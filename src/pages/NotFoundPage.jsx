// NotFoundPage.jsx
import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-6 text-white">

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-1/2 h-100 w-100 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a0f_1px,transparent_1px),linear-gradient(to_bottom,#27272a0f_1px,transparent_1px)] bg-size-[48px_48px]" />
            </div>

            <div className="relative z-10 w-full max-w-xl text-center">

                <div className="relative inline-block">
                    <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-3xl" />
                    <h1 className="relative text-8xl font-black tracking-tight text-white sm:text-9xl">
                        404
                    </h1>
                </div>

                <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
                    Page Not Found
                </h2>
                <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-zinc-400 sm:text-base">
                    The page you are looking for does not exist,
                    may have been moved, or the URL might be incorrect.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        to="/"
                        className="group inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-500/40 active:scale-[0.98]"
                    >
                        Go Back Home
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        >
                            <path d="M19 12H5M12 5l-7 7 7 7" />
                        </svg>
                    </Link>
                    <Link
                        to="/dashboard"
                        className="rounded-2xl border border-zinc-700/60 bg-zinc-900/80 px-6 py-3 text-sm font-semibold text-zinc-300 backdrop-blur-sm transition-all duration-200 hover:border-zinc-500 hover:bg-zinc-800 hover:text-white"
                    >
                        Dashboard
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default NotFoundPage;