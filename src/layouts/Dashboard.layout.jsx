import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinks = [
    {
        to: "/dashboard",
        label: "Dashboard",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
            </svg>
        ),
    },
    {
        to: "/poll/create",
        label: "Create Poll",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
            </svg>
        ),
    },
];

const DashboardLayout = () => {
    const { pathname } = useLocation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="flex min-h-screen bg-zinc-950 text-white">

            <aside className="flex w-64 shrink-0 flex-col border-r border-zinc-800/60 bg-zinc-900/80 backdrop-blur-sm">

                <div className="border-b border-zinc-800/60 px-6 py-5">
                    <Link to="/dashboard" className="group flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-indigo-500 shadow-lg shadow-indigo-500/40
                            group-hover:bg-indigo-400 transition-colors duration-200" />
                        <span className="text-lg font-bold tracking-tight">
                            Pulse<span className="text-indigo-400">Board</span>
                        </span>
                    </Link>
                </div>

                <nav className="flex flex-col gap-1 p-4 flex-1">
                    <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-zinc-600">
                        Menu
                    </p>
                    {navLinks.map(({ to, label, icon }) => {
                        const isActive = pathname === to;
                        return (
                            <Link
                                key={to}
                                to={to}
                                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
                                    transition-all duration-200
                                    ${isActive
                                        ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20"
                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white border border-transparent"
                                    }`}
                            >
                                <span className={isActive ? "text-indigo-400" : "text-zinc-500"}>
                                    {icon}
                                </span>
                                {label}
                                {isActive && (
                                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-zinc-800/60 p-4">
                    {user && (
                        <div className="mb-3 flex items-center gap-3 rounded-xl bg-zinc-800/60 px-3 py-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center
                                rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-400">
                                {user.name?.[0]?.toUpperCase() ?? "U"}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-white">{user.name}</p>
                                <p className="truncate text-xs text-zinc-500">{user.email}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
                            text-zinc-400 border border-transparent
                            transition-all duration-200
                            hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            <div className="flex flex-1 flex-col min-w-0">

                <header className="flex items-center justify-between border-b border-zinc-800/60
                    bg-zinc-950/80 backdrop-blur-sm px-8 py-4">
                    <div>
                        <h1 className="text-sm font-semibold text-white capitalize">
                            {navLinks.find(l => l.to === pathname)?.label ?? "Dashboard"}
                        </h1>
                        <p className="text-xs text-zinc-500">
                            {new Date().toLocaleDateString("en-IN", {
                                weekday: "long", day: "numeric", month: "long"
                            })}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-zinc-800
                        bg-zinc-900 px-3 py-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs text-zinc-400">Live</span>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;