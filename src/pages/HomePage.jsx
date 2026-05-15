
import { Link } from "react-router-dom";

const features = [
    "Realtime analytics",
    "Anonymous voting",
    "Live response tracking",
];

const stats = [
    { label: "Polls Created", value: "10K+", sub: "and counting" },
    { label: "Responses Collected", value: "2M+", sub: "across all polls" },
    { label: "Active Users", value: "5K+", sub: "this month" },
];

const HomePage = () => {
    return (
        <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-white">

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-0 h-120 w-120 -translate-x-1/2 -translate-y-1/3 rounded-full bg-indigo-600/20 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/4 rounded-full bg-violet-700/10 blur-3xl" />
                <div className="absolute right-0 top-1/2 h-64 w-64 translate-x-1/4 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(circle,#6366f120_1px,transparent_1px)] bg-size-[32px_32px]" />
            </div>

            <section className="relative z-10 pt-16">
                <div className="mx-auto flex max-w-4xl flex-col items-center px-6 pb-24 pt-20 text-center">

                    <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-4 py-1.5">
                        <span className="relative flex h-2 w-2 shrink-0">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-60" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400" />
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-indigo-300">
                            Realtime Polling Platform
                        </span>
                    </div>

                    <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
                        Create polls.
                        <br />
                        <span className="bg-linear-to-r from-indigo-400 via-violet-400 to-indigo-300 bg-clip-text text-transparent">
                            Collect responses.
                        </span>
                        <br />
                        Analyze live.
                    </h1>

                    <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-zinc-400">
                        Build interactive polls, share them instantly, and watch results
                        update in realtime — with full support for anonymous and
                        authenticated responses.
                    </p>

                    <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                        <Link
                            to="/register"
                            className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3
                                text-sm font-semibold text-white shadow-xl shadow-indigo-600/30
                                transition-all duration-200 hover:bg-indigo-500 active:scale-[0.97]"
                        >
                            Start for free
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <Link
                            to="/login"
                            className="inline-flex items-center rounded-xl border border-zinc-700/60 bg-zinc-900/60
                                px-6 py-3 text-sm font-medium text-zinc-300
                                transition-all duration-200 hover:border-zinc-500 hover:text-white"
                        >
                            Sign in to dashboard
                        </Link>
                    </div>

                    <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70
                                    px-4 py-2 text-xs font-medium text-zinc-400 backdrop-blur-sm"
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                                {f}
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            <div className="relative z-10 mx-auto max-w-6xl px-6">
                <div className="h-px bg-linear-to-r from-transparent via-zinc-700/50 to-transparent" />
            </div>

            <section className="relative z-10 mx-auto max-w-6xl px-6 py-20">
                <p className="mb-10 text-center text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
                    Trusted by teams worldwide
                </p>
                <div className="grid gap-4 sm:grid-cols-3">
                    {stats.map(({ label, value, sub }, i) => (
                        <div
                            key={i}
                            className="group relative overflow-hidden rounded-2xl border border-zinc-700/60
                                bg-zinc-900/80 p-7 backdrop-blur-sm
                                transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-900"
                        >
                            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-indigo-500/10
                                blur-2xl transition-all duration-300 group-hover:bg-indigo-500/20" />
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                                {label}
                            </p>
                            <p className="mt-3 text-4xl font-black tracking-tight text-white">
                                {value}
                            </p>
                            <p className="mt-1 text-xs text-zinc-600">{sub}</p>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="relative z-10 border-t border-zinc-800/60 py-8 text-center">
                <p className="text-xs text-zinc-600">
                    © {new Date().getFullYear()} PulseBoard  Built for realtime teams.
                </p>
            </footer>

        </div>
    );
};

export default HomePage;