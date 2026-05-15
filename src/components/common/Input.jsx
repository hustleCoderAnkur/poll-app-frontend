const Input = ({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    name,
    className = "",
    error = "",
    hint = "",
    required = false,
    disabled = false,
    icon = null,        
    rightIcon = null,   
}) => {

    return (
        <div className="flex w-full flex-col gap-1.5">

            {label && (
                <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    {label}
                    {required && <span className="text-indigo-400">*</span>}
                </label>
            )}

            <div className="relative flex items-center">

                {icon && (
                    <div className="pointer-events-none absolute left-3.5 text-zinc-500">
                        {icon}
                    </div>
                )}

                <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    className={`
                        w-full rounded-xl border bg-zinc-900/80 backdrop-blur-sm
                        py-3 text-sm text-white
                        transition-all duration-200 ease-out
                        placeholder:text-zinc-600
                        outline-none
                        disabled:cursor-not-allowed disabled:opacity-40
                        ${icon ? "pl-10" : "pl-4"}
                        ${rightIcon ? "pr-10" : "pr-4"}
                        ${error
                            ? "border-red-500/70 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                            : "border-zinc-700/60 hover:border-zinc-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        }
                        ${className}
                    `}
                />

                {rightIcon && (
                    <div className="absolute right-3.5 text-zinc-500">
                        {rightIcon}
                    </div>
                )}
            </div>

            {hint && !error && (
                <p className="text-xs text-zinc-500">{hint}</p>
            )}

            {error && (
                <p className="flex items-center gap-1 text-xs text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M12 2a10 10 0 100 20A10 10 0 0012 2zm-1 5a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}

        </div>
    );
};

export default Input;