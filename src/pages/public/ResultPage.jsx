import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PollResults from "../../components/poll/PollResults.jsx";
import axiosInstance from "../../api/axios.js";

// ── top-level helpers ───────────────────────────────────────────────
const PageLoader = () => (
    <div className="flex items-center justify-center py-32">
        <div className="relative flex items-center justify-center">
            <div className="absolute h-12 w-12 rounded-full bg-indigo-500/20 blur-md" />
            <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-zinc-800 border-t-indigo-400" />
        </div>
    </div>
);

const StatusScreen = ({ emoji, title, subtitle, children }) => (
    <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800/80 text-4xl">
            {emoji}
        </div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {subtitle && <p className="mt-2 max-w-sm text-sm text-zinc-500">{subtitle}</p>}
        {children}
    </div>
);

const ResultPage = () => {
    const { shareId } = useParams();

    const [poll, setPoll] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!shareId) return;
        let cancelled = false;

        const fetchResults = async () => {
            try {
                setLoading(true);
                setError("");

                const pollRes = await axiosInstance.get(`/polls/share/${shareId}`);
                const pollObj = pollRes.data.poll ?? pollRes.data;

                if (!pollObj.isPublished) {
                    if (!cancelled) setError("not_published");
                    return;
                }

                const analyticsRes = await axiosInstance.get(
                    `/responses/poll/${pollObj.id}/analytics`
                );
                const analyticsObj = analyticsRes.data.analytics ?? analyticsRes.data;

                if (!cancelled) {
                    setPoll(pollObj);
                    setAnalytics(analyticsObj);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.response?.data?.message || err.message || "Failed to load results");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchResults();
        return () => { cancelled = true; };
    }, [shareId]);

    if (loading) return (
        <div className="mx-auto max-w-5xl">
            <PageLoader />
        </div>
    );

    if (error === "not_published") return (
        <div className="mx-auto max-w-5xl">
            <StatusScreen
                title="Results Not Yet Published"
                subtitle="The poll creator hasn't published the results yet. Check back later."
            >
                <Link
                    to={`/poll/share/${shareId}`}
                    className="mt-6 rounded-xl border border-zinc-700 px-5 py-2.5 text-sm
                        text-zinc-400 hover:border-zinc-500 hover:text-white transition"
                >
                     Back to Poll
                </Link>
            </StatusScreen>
        </div>
    );

    if (error) return (
        <div className="mx-auto max-w-5xl">
            <StatusScreen
                title="Something went wrong"
                subtitle={error}
            >
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 rounded-xl border border-zinc-700 px-5 py-2.5 text-sm
                        text-zinc-400 hover:border-zinc-500 hover:text-white transition"
                >
                    Try again
                </button>
            </StatusScreen>
        </div>
    );

    return (
        <div className="mx-auto max-w-5xl space-y-8">

            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <Link
                            to={`/poll/share/${shareId}`}
                            className="text-zinc-500 hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M19 12H5M12 5l-7 7 7 7" />
                            </svg>
                        </Link>
                        <span className="text-xs text-zinc-500">Back to Poll</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Published Results</h1>
                    <p className="mt-1.5 text-sm text-zinc-500">
                        Final response analytics and voting summaries
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-2 rounded-xl border border-emerald-500/20
                    bg-emerald-500/10 px-4 py-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2.5" strokeLinecap="round">
                        <path d="M5 12l5 5L20 7" />
                    </svg>
                    <span className="text-sm font-semibold text-emerald-400">Published</span>
                </div>
            </div>

            <PollResults poll={poll} analytics={analytics} />

        </div>
    );
};

export default ResultPage;