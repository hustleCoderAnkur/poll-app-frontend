import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PollAnalytics from "../../components/poll/PollAnalytics.jsx";
import axiosInstance from "../../api/axios.js";
import useSocket from "../../hooks/useSocket.js";

const PageLoader = () => (
    <div className="flex items-center justify-center py-32">
        <div className="relative flex items-center justify-center">
            <div className="absolute h-12 w-12 rounded-full bg-indigo-500/20 blur-md" />
            <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-zinc-800 border-t-indigo-400" />
        </div>
    </div>
);

const ErrorBanner = ({ message, onBack }) => (
    <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-3xl">
        </div>
        <p className="text-base font-semibold text-white">{message}</p>
        <button
            onClick={onBack}
            className="mt-6 rounded-xl border border-zinc-700 px-5 py-2.5 text-sm
                text-zinc-400 transition hover:border-zinc-500 hover:text-white"
        >
             Back to Dashboard
        </button>
    </div>
);

const AnalyticsPage = () => {
    const { pollId } = useParams();
    const navigate = useNavigate();

    const [analytics, setAnalytics] = useState(null);
    const [poll, setPoll] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [lastUpdated, setLastUpdated] = useState(null);

    const { connected, liveCount, analytics: liveAnalytics } = useSocket(pollId);

    const displayAnalytics = liveAnalytics || analytics;

    const fetchAnalytics = useCallback(async () => {
        if (!pollId) return;
        try {
            setLoading(true);
            setError("");

            const [pollRes, analyticsRes] =
                await Promise.all([
                    axiosInstance.get(
                        `/polls/${pollId}`
                    ),
                    axiosInstance.get(
                        `/responses/poll/${pollId}/analytics`
                    ),
                ]);

            setPoll(pollRes.data.poll ?? pollRes.data);
            setAnalytics(analyticsRes.data.analytics ?? analyticsRes.data);
            setLastUpdated(new Date());
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    }, [pollId]);

    useEffect(() => {

        const init = async () => {
            await fetchAnalytics();
        };

        init();

    }, [fetchAnalytics]);

    useEffect(() => {

        if (!liveAnalytics) return;

        queueMicrotask(() => {
            setLastUpdated(new Date());
        });

    }, [liveAnalytics]);

    return (
        <div className="space-y-8">

            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="mb-1 flex items-center gap-2">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="text-zinc-500 hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M19 12H5M12 5l-7 7 7 7" />
                            </svg>
                        </button>
                        <span className="text-xs text-zinc-500">Dashboard</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">
                        {poll?.title ?? "Poll Analytics"}
                    </h1>
                    <p className="mt-1.5 text-sm text-zinc-500">
                        {poll?.description ?? "Live response insights and vote breakdown"}
                    </p>
                </div>

                {!loading && !error && (
                    <div className="flex shrink-0 flex-col items-end gap-2">

                        {connected && (
                            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20
                                bg-emerald-500/10 px-3 py-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs font-medium text-emerald-400">Live</span>
                                {liveCount !== null && (
                                    <span className="text-xs text-emerald-400/70">
                                        · {liveCount} responses
                                    </span>
                                )}
                            </div>
                        )}

                        {lastUpdated && (
                            <p className="text-xs text-zinc-600">
                                Updated {lastUpdated.toLocaleTimeString("en-IN", {
                                    hour: "2-digit", minute: "2-digit", second: "2-digit"
                                })}
                            </p>
                        )}

                        <button
                            onClick={fetchAnalytics}
                            className="flex items-center gap-2 rounded-xl border border-zinc-700
                                px-4 py-2.5 text-xs font-medium text-zinc-400
                                transition-all duration-200 hover:border-zinc-500 hover:text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M23 4v6h-6M1 20v-6h6" />
                                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                )}
            </div>

            {loading && <PageLoader />}
            {!loading && error && (
                <ErrorBanner message={error} onBack={() => navigate("/dashboard")} />
            )}
            {!loading && !error && (
                <PollAnalytics analytics={displayAnalytics} />
            )}
        </div>
    );
};

export default AnalyticsPage;