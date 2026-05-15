// PollHeader.jsx
// Pure presentational component.
// Renders poll title, description, status badge, expiry info, and meta tags.
// Receives: poll object, questions count

const PollHeader = ({ poll, questionCount }) => {

    const isExpired =
        poll?.expiresAt &&
        new Date(poll.expiresAt) < new Date();

    const timeLeft = () => {

        if (!poll?.expiresAt) return null;

        const diff = new Date(poll.expiresAt) - new Date();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

        if (days === 1) return "Closes tomorrow";
        if (days <= 7) return `Closes in ${days} days`;
        return null;
    };

    return (

        <div
            className="relative overflow-hidden rounded-2xl border
            border-zinc-700/60 bg-zinc-900/80 backdrop-blur-sm p-7"
        >
            {/* Ambient glow */}
            <div
                className="pointer-events-none absolute -right-10 -top-10
                h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl"
            />

            <div className="relative">

                {/* Status badges */}
                <div className="mb-4 flex items-center gap-2.5">

                    {isExpired ? (
                        <span
                            className="rounded-full border border-red-500/20
                            bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400"
                        >
                            Closed
                        </span>
                    ) : (
                        <span
                            className="flex items-center gap-1.5 rounded-full
                            border border-emerald-500/20 bg-emerald-500/10
                            px-3 py-1 text-xs font-semibold text-emerald-400"
                        >
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                            Live
                        </span>
                    )}

                    {timeLeft() && (
                        <span className="text-xs text-zinc-500">
                            {timeLeft()}
                        </span>
                    )}

                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold tracking-tight text-white">
                    {poll.title}
                </h1>

                {/* Description */}
                {poll.description && (
                    <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">
                        {poll.description}
                    </p>
                )}

                {/* Meta row */}
                <div
                    className="mt-5 flex flex-wrap items-center gap-4
                    border-t border-zinc-800 pt-4"
                >
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        {questionCount} question{questionCount !== 1 ? "s" : ""}
                    </div>

                    {poll.allowAnonymous && (
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                            Anonymous responses allowed
                        </div>
                    )}

                    {poll.expiresAt && (
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                            {new Date(poll.expiresAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PollHeader;