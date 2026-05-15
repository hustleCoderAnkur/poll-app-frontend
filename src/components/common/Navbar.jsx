import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
    const { pathname } = useLocation();

    const navLinks = [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/poll/create", label: "Create Poll" },
    ];

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">

                <Link
                    to="/"
                    className="group flex items-center gap-2"
                >
                    <div className="h-7 w-7 rounded-lg bg-indigo-500 shadow-lg shadow-indigo-500/40
                        group-hover:bg-indigo-400 transition-colors duration-200" />
                    <span className="text-xl font-bold tracking-tight text-white">
                        Pulse<span className="text-indigo-400">Board</span>
                    </span>
                </Link>

                {/* Nav Links */}
                <div className="flex items-center gap-1">
                    {navLinks.map(({ to, label }) => {
                        const isActive = pathname === to;
                        return (
                            <Link
                                key={to}
                                to={to}
                                className={`
                                    relative px-4 py-2 text-sm font-medium rounded-lg
                                    transition-all duration-200
                                    ${isActive
                                        ? "text-white bg-zinc-800"
                                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                                    }
                                `}
                            >
                                {label}
                                {isActive && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-indigo-400" />
                                )}
                            </Link>
                        );
                    })}

                    <div className="ml-3 h-5 w-px bg-zinc-700" />

                    <Link
                        to="/login"
                        className="
                            ml-3 rounded-xl bg-indigo-600 px-4 py-2
                            text-sm font-semibold text-white
                            shadow-md shadow-indigo-500/30
                            transition-all duration-200
                            hover:bg-indigo-500 hover:shadow-indigo-500/40
                            active:scale-95
                        "
                    >
                        Login
                    </Link>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;