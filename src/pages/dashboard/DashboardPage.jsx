import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PollCard from "../../components/poll/PollCard.jsx";
import axiosInstance from "../../api/axios.js";


const StatCard = ({ label, value, accent = false }) => (
    <div
        className={`relative overflow-hidden rounded-2xl border p-5
        transition-all duration-200 hover:scale-[1.02]
        ${accent
                ? "border-indigo-500/30 bg-indigo-500/10"
                : "border-zinc-700/60 bg-zinc-900/80"
            }`}
    >

        <div
            className={`absolute -right-4 -top-4
            h-16 w-16 rounded-full blur-2xl opacity-20
            ${accent ? "bg-indigo-500" : "bg-zinc-600"}`}
        />

        <p
            className="text-xs font-semibold uppercase
            tracking-widest text-zinc-500"
        >
            {label}
        </p>

        <p
            className={`mt-2 text-3xl font-bold tracking-tight
            ${accent ? "text-indigo-300" : "text-white"}`}
        >
            {value}
        </p>

    </div>
);

const PollCardSkeleton = () => (

    <div
        className="animate-pulse rounded-2xl
        border border-zinc-800
        bg-zinc-900/80 p-6 space-y-4"
    >

        <div className="flex justify-between">

            <div className="space-y-2 flex-1">

                <div className="h-4 w-2/3 rounded-lg bg-zinc-800" />

                <div className="h-3 w-full rounded-lg bg-zinc-800" />

                <div className="h-3 w-4/5 rounded-lg bg-zinc-800" />

            </div>

            <div className="h-6 w-16 rounded-full bg-zinc-800 ml-4" />

        </div>

        <div className="flex gap-2">

            <div className="h-6 w-24 rounded-lg bg-zinc-800" />

            <div className="h-6 w-24 rounded-lg bg-zinc-800" />

        </div>

        <div className="h-px bg-zinc-800" />

        <div className="flex justify-between">

            <div className="h-3 w-28 rounded bg-zinc-800" />

            <div className="flex gap-2">

                <div className="h-8 w-16 rounded-xl bg-zinc-800" />

                <div className="h-8 w-20 rounded-xl bg-zinc-800" />

            </div>

        </div>

    </div>
);


const DashboardPage = () => {

    const { user } = useAuth();

    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all");

    useEffect(() => {

        let cancelled = false;

        const fetchPolls = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await axiosInstance.get(
                        "/polls/myPolls"
                    );

                const data = response.data;

                if (!cancelled) {

                    setPolls(
                        data.polls ?? data
                    );
                }

            } catch (err) {

                if (!cancelled) {

                    setError(
                        err.response?.data?.message ||
                        err.message ||
                        "Something went wrong"
                    );
                }

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchPolls();

        return () => {
            cancelled = true;
        };

    }, []);


    const filtered = polls.filter((p) => {

        if (filter === "published")
            return p.isPublished;

        if (filter === "draft")
            return !p.isPublished;

        return true;
    });


    const publishedCount =
        polls.filter((p) => p.isPublished).length;

    const draftCount =
        polls.filter((p) => !p.isPublished).length;

    const expiredCount =
        polls.filter(
            (p) =>
                p.expiresAt &&
                new Date(p.expiresAt) < new Date()
        ).length;

    const filterBtns = [
        {
            key: "all",
            label: "All",
            count: polls.length,
        },
        {
            key: "published",
            label: "Live",
            count: publishedCount,
        },
        {
            key: "draft",
            label: "Drafts",
            count: draftCount,
        },
    ];

    return (

        <div className="space-y-8">

            <div
                className="flex flex-col gap-5
                sm:flex-row sm:items-start
                sm:justify-between"
            >

                <div>

                    <h1
                        className="text-3xl
                        font-bold text-white"
                    >
                        {
                            user?.name
                                ? `Hey, ${user.name.split(" ")[0]} `
                                : "Dashboard"
                        }
                    </h1>

                    <p
                        className="mt-1.5 text-sm
                        text-zinc-500"
                    >
                        Manage your polls and track responses
                    </p>

                </div>

                <Link
                    to="/poll/create"
                    className="flex items-center gap-2
                    self-start rounded-xl bg-indigo-600
                    px-5 py-2.5 text-sm font-semibold
                    text-white shadow-md
                    shadow-indigo-500/30
                    transition-all duration-200
                    hover:bg-indigo-500 active:scale-95"
                >

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    >
                        <path d="M12 5v14M5 12h14" />
                    </svg>

                    Create Poll

                </Link>

            </div>

            {!loading && !error && (

                <div className="grid grid-cols-3 gap-4">

                    <StatCard
                        label="Total Polls"
                        value={polls.length}
                        accent
                    />

                    <StatCard
                        label="Live"
                        value={publishedCount}
                    />

                    <StatCard
                        label="Expired"
                        value={expiredCount}
                    />

                </div>
            )}

            {/* Filter tabs */}
            {!loading &&
                !error &&
                polls.length > 0 && (

                    <div
                        className="flex items-center gap-1
                        rounded-xl border border-zinc-800
                        bg-zinc-900/60 p-1 w-fit"
                    >

                        {filterBtns.map(
                            ({
                                key,
                                label,
                                count
                            }) => (

                                <button
                                    key={key}
                                    onClick={() => setFilter(key)}
                                    className={`flex items-center gap-2
                                    rounded-lg px-4 py-2
                                    text-xs font-semibold
                                    transition-all duration-200
                                    ${filter === key
                                            ? "bg-indigo-600 text-white shadow-sm"
                                            : "text-zinc-400 hover:text-white"
                                        }`}
                                >

                                    {label}

                                    <span
                                        className={`rounded-full
                                        px-1.5 py-0.5 text-xs
                                        ${filter === key
                                                ? "bg-indigo-500/50 text-indigo-200"
                                                : "bg-zinc-800 text-zinc-500"
                                            }`}
                                    >
                                        {count}
                                    </span>

                                </button>
                            )
                        )}

                    </div>
                )}

            {loading && (

                <div className="grid gap-6 lg:grid-cols-2">

                    {[1, 2, 3, 4].map((i) => (
                        <PollCardSkeleton key={i} />
                    ))}

                </div>
            )}

            {/* Error */}
            {!loading && error && (

                <div
                    className="flex flex-col items-center
                    justify-center rounded-2xl
                    border border-red-500/20
                    bg-red-500/5 py-16 text-center"
                >

                    <div className="mb-3 text-4xl">
                    </div>

                    <p
                        className="text-sm font-semibold text-white"
                    >
                        {error}
                    </p>

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-5 rounded-xl
                        border border-zinc-700
                        px-5 py-2 text-xs text-zinc-400
                        hover:border-zinc-500
                        hover:text-white transition"
                    >
                        Try again
                    </button>

                </div>
            )}

            {!loading &&
                !error &&
                filtered.length === 0 && (

                    <div
                        className="flex flex-col items-center
                        justify-center rounded-2xl
                        border border-dashed border-zinc-700
                        py-20 text-center"
                    >

                        <div className="mb-3 text-5xl">

                            {
                                filter === "all"
                                    ? "📋"
                                    : filter === "published"
                                        ? "📡"
                                        : "📝"
                            }

                        </div>

                        <h2
                            className="text-base font-semibold text-white"
                        >

                            {
                                filter === "all"
                                    ? "No polls yet"
                                    : filter === "published"
                                        ? "No live polls"
                                        : "No drafts"
                            }

                        </h2>

                        <p
                            className="mt-1.5 text-sm text-zinc-500"
                        >

                            {
                                filter === "all"
                                    ? "Create your first poll to get started"
                                    : `Switch to "All" to see other polls`
                            }

                        </p>

                        {filter === "all" && (

                            <Link
                                to="/poll/create"
                                className="mt-6 rounded-xl
                                bg-indigo-600 px-5 py-2.5
                                text-sm font-semibold text-white
                                shadow-md shadow-indigo-500/30
                                hover:bg-indigo-500 transition"
                            >
                                Create your first poll
                            </Link>
                        )}

                    </div>
                )}

            {!loading &&
                !error &&
                filtered.length > 0 && (

                    <div className="grid gap-5 lg:grid-cols-2">

                        {filtered.map((poll) => {

                            const pollId =
                                poll.id || poll._id;

                            return (

                                <PollCard
                                    key={pollId}
                                    poll={poll}

                                    onPublish={(updatedPoll) => {

                                        const updatedId =
                                            updatedPoll.id ||
                                            updatedPoll._id;

                                        setPolls((prev) =>
                                            prev.map((p) => {

                                                const currentId =
                                                    p.id || p._id;

                                                return currentId === updatedId
                                                    ? updatedPoll
                                                    : p;
                                            })
                                        );
                                    }}

                                    onDelete={(deletedId) => {

                                        setPolls((prev) =>
                                            prev.filter((p) => {

                                                const currentId =
                                                    p.id || p._id;

                                                return currentId !== deletedId;
                                            })
                                        );
                                    }}
                                />
                            );
                        })}

                    </div>
                )}

        </div>
    );
};

export default DashboardPage;