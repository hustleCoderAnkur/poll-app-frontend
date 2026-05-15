const Button = ({
    children,
    type = "button",
    onClick,
    className = "",
    disabled = false,
    variant = "primary",  
    size = "md",          
    loading = false,
}) => {

    const base = `
        inline-flex items-center justify-center gap-2
        font-semibold tracking-wide rounded-xl
        transition-all duration-200 ease-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-40 disabled:pointer-events-none
        active:scale-[0.97]
    `;

    const variants = {
        primary: `
            bg-indigo-600 text-white
            hover:bg-indigo-500
            shadow-md shadow-indigo-500/30
            hover:shadow-lg hover:shadow-indigo-500/40
            focus-visible:ring-indigo-500
        `,
        secondary: `
            bg-zinc-900 text-white border border-zinc-700
            hover:bg-zinc-800 hover:border-zinc-600
            focus-visible:ring-zinc-500
        `,
        ghost: `
            bg-transparent text-zinc-300 border border-zinc-700
            hover:bg-zinc-800 hover:text-white
            focus-visible:ring-zinc-500
        `,
        danger: `
            bg-red-600 text-white
            hover:bg-red-500
            shadow-md shadow-red-500/30
            focus-visible:ring-red-500
        `,
    };

    const sizes = {
        sm: "px-3.5 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-7 py-3.5 text-base",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {loading && (
                <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
            )}
            {children}
        </button>
    );
};

export default Button;