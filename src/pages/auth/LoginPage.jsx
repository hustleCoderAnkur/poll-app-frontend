import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const from = location.state?.from || "/dashboard";

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setError("Please fill in all fields");
            return;
        }
        try {
            setLoading(true);
            setError("");
            await login(formData);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err?.response?.data?.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {

        window.location.href =
            "http://localhost:3000/api/v1/oauth/google"
    }
    
    const inputClass = (hasError) => `
        w-full rounded-xl border bg-zinc-900/80 backdrop-blur-sm
        px-4 py-3 text-sm text-white outline-none
        transition-all duration-200 placeholder:text-zinc-600
        ${hasError
            ? "border-red-500/70 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
            : "border-zinc-700/60 hover:border-zinc-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        }
    `;

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6">

            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2
                    rounded-full bg-indigo-500/10 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                <div className="rounded-2xl border border-zinc-700/60 bg-zinc-900/80
                    backdrop-blur-sm p-8 shadow-2xl shadow-black/40">

                    <div className="mb-8 text-center">
                        <Link to="/" className="group mb-6 inline-flex items-center gap-2">
                            <div className="h-8 w-8 rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/40
                                group-hover:bg-indigo-400 transition-colors duration-200" />
                            <span className="text-xl font-bold tracking-tight text-white">
                                Pulse<span className="text-indigo-400">Board</span>
                            </span>
                        </Link>
                        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
                        <p className="mt-1.5 text-sm text-zinc-500">
                            Sign in to your account to continue
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="mb-5 flex w-full items-center justify-center gap-3 rounded-xl
                            border border-zinc-700/60 bg-zinc-800/60 px-5 py-3
                            text-sm font-semibold text-white
                            transition-all duration-200
                            hover:border-zinc-500 hover:bg-zinc-800
                            active:scale-[0.98]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5 shrink-0">
                            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z" />
                            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19.1 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.5 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.1C9.5 35.6 16.2 44 24 44z" />
                            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.2 5.2C41 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-3.9z" />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="mb-5 flex items-center gap-3">
                        <div className="h-px flex-1 bg-zinc-800" />
                        <span className="text-xs text-zinc-600">or sign in with email</span>
                        <div className="h-px flex-1 bg-zinc-800" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold
                                uppercase tracking-widest text-zinc-400">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                className={inputClass(error && !formData.email)}
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold
                                uppercase tracking-widest text-zinc-400">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    className={`${inputClass(error && !formData.password)} pr-11`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((p) => !p)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2
                                        text-zinc-500 hover:text-zinc-300 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 rounded-xl border border-red-500/20
                                bg-red-500/10 px-4 py-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-red-400"
                                    viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M12 2a10 10 0 100 20A10 10 0 0012 2zm-1 5a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl
                                bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white
                                shadow-lg shadow-indigo-500/30
                                transition-all duration-200
                                hover:bg-indigo-500 hover:shadow-indigo-500/40
                                disabled:cursor-not-allowed disabled:opacity-50
                                active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                        fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10"
                                            stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Signing in...
                                </>
                            ) : "Sign In"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-zinc-500">
                        Don&apos;t have an account?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;