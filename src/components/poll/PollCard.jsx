import { useState } from "react"
import { Link } from "react-router-dom"
import axiosInstance from "../../api/axios.js"
import { deletePoll } from "../../api/poll.api.js"

const PollCard = ({ poll, onPublish, onDelete }) => {

    const isExpired = poll.expiresAt && new Date(poll.expiresAt) < new Date()

    const [publishing, setPublishing] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [copied, setCopied] = useState(false)

    const pollId = poll.id || poll._id

    const shareUrl = `${window.location.origin}/poll/share/${poll.shareId}`

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 2000)
    }

    const handlePublish = async () => {
        try {
            setPublishing(true)
            const res =
                await axiosInstance.patch(
                    `/polls/${pollId}/publish`
                )

            const updated =
                res.data.poll ?? res.data
            onPublish?.(updated)
        } catch (err) {
            console.error(
                "Publish failed:",
                err
            )
        } finally {
            setPublishing(false)
        }
    }

    const handleDelete = async () => {

        const confirmed = window.confirm(
            "Delete this poll permanently?"
        )
        if (!confirmed) return
        try {
            setDeleting(true)
            onDelete?.(pollId)
            await deletePoll(pollId)
        } catch (err) {
            console.error(
                "Delete failed:",
                err
            )
        } finally {

            setDeleting(false)
        }
    }

    const expiryLabel = () => {

        if (!poll.expiresAt)
            return "No expiry"

        if (isExpired)
            return "Expired"

        const days = Math.ceil(
            (
                new Date(poll.expiresAt) -
                new Date()
            ) / (1000 * 60 * 60 * 24)
        )

        if (days === 1)
            return "Expires tomorrow"

        if (days <= 7)
            return `Expires in ${days} days`

        return `Expires ${new Date(
            poll.expiresAt
        ).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })}`
    }

    return (

        <div
            className={`group relative overflow-hidden
            rounded-2xl border border-zinc-700/60
            bg-zinc-900/80 backdrop-blur-sm p-6
            transition-all duration-300
            hover:border-zinc-600
            hover:shadow-xl hover:shadow-black/30
            hover:-translate-y-0.5
            ${deleting ? "opacity-50 pointer-events-none" : ""}
            `}
        >

            <div
                className="absolute inset-x-0 top-0 h-px
                bg-linear-to-r from-transparent
                via-indigo-500/40 to-transparent
                opacity-0 group-hover:opacity-100
                transition-opacity duration-300"
            />

            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-2">
                    <h2
                        className="truncate text-lg
                        font-bold text-white"
                    >
                        {poll.title}
                    </h2>

                    <p
                        className="text-sm leading-relaxed
                        text-zinc-400 line-clamp-2"
                    >
                        {poll.description}
                    </p>
                </div>

                <span
                    className={`shrink-0 rounded-full
                    px-3 py-1 text-xs font-semibold
                    ${isExpired
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : poll.isPublished
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                >
                    {
                        isExpired
                            ? "Expired"
                            : poll.isPublished
                                ? "Live"
                                : "Draft"
                    }
                </span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">

                <span
                    className={`flex items-center gap-1.5
                    rounded-lg px-3 py-1.5 text-xs font-medium
                    ${poll.allowAnonymous
                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                            : "bg-zinc-800 text-zinc-500 border border-zinc-700/40"
                        }`}
                >
                    Anonymous
                </span>

                <span
                    className={`flex items-center gap-1.5
                    rounded-lg px-3 py-1.5 text-xs font-medium
                    ${poll.allowAuthenticated
                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                            : "bg-zinc-800 text-zinc-500 border border-zinc-700/40"
                        }`}
                >
                    Auth Required
                </span>

                {poll.questions?.length > 0 && (

                    <span
                        className="rounded-lg bg-zinc-800
                        border border-zinc-700/40
                        px-3 py-1.5 text-xs font-medium
                        text-zinc-400"
                    >
                        {poll.questions.length} Questions
                    </span>
                )}

            </div>

            {poll.shareId && (

                <div
                    className="mt-4 flex items-center gap-2
                    rounded-xl border border-zinc-700/60
                    bg-zinc-800/40 px-3 py-2"
                >

                    <span
                        className="flex-1 truncate
                        font-mono text-xs text-zinc-500"
                    >
                        {shareUrl}
                    </span>

                    <button
                        onClick={handleCopy}
                        className={`shrink-0 rounded-lg
                        px-2.5 py-1 text-xs font-semibold
                        transition-all duration-200
                        ${copied
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                            }`}
                    >
                        {copied ? "✓ Copied!" : "Copy"}
                    </button>
                </div>
            )}

            <div className="my-5 h-px bg-zinc-800" />

            <div className="flex items-center justify-between gap-4">

                <p
                    className={`text-xs font-medium
                    ${isExpired
                            ? "text-red-400"
                            : "text-zinc-500"
                        }`}
                >
                    {expiryLabel()}
                </p>

                <div className="flex items-center gap-2">

                    {!poll.isPublished && !isExpired && (

                        <button
                            onClick={handlePublish}
                            disabled={publishing}
                            className="rounded-xl border
                            border-emerald-500/30
                            bg-emerald-500/10
                            px-4 py-2 text-xs
                            font-semibold text-emerald-400
                            hover:bg-emerald-500/20"
                        >
                            {
                                publishing
                                    ? "Publishing..."
                                    : "Publish"
                            }
                        </button>
                    )}

                    <Link
                        to={`/poll/${pollId}/edit`}
                        className="rounded-xl border
                        border-zinc-700 px-4 py-2
                        text-xs font-semibold text-zinc-400
                        hover:border-zinc-500
                        hover:text-white"
                    >
                        Edit
                    </Link>

                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="rounded-xl border
                        border-red-500/30
                        bg-red-500/10
                        px-4 py-2 text-xs
                        font-semibold text-red-400
                        hover:bg-red-500/20"
                    >
                        {
                            deleting
                                ? "Deleting..."
                                : "Delete"
                        }
                    </button>

                    <Link
                        to={`/poll/${pollId}/analytics`}
                        className="rounded-xl bg-indigo-600
                        px-4 py-2 text-xs font-semibold
                        text-white hover:bg-indigo-500"
                    >
                        Analytics
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default PollCard