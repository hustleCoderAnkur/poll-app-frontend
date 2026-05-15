const OptionInput = ({
    value,
    onChange,
    onRemove,
    placeholder,
    removable = true,
    index,         
    error = "",
}) => {

    return (
        <div className="flex flex-col gap-1.5">
            <div className="group flex items-center gap-3">

                {index !== undefined && (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center
                        rounded-lg bg-zinc-800 text-xs font-bold text-zinc-400
                        group-focus-within:bg-indigo-500/20 group-focus-within:text-indigo-400
                        transition-colors duration-200">
                        {index + 1}
                    </span>
                )}

                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`
                        w-full rounded-xl border bg-zinc-900/80 backdrop-blur-sm
                        px-4 py-3 text-sm text-white outline-none
                        transition-all duration-200
                        placeholder:text-zinc-600
                        ${error
                            ? "border-red-500/70 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                            : "border-zinc-700/60 hover:border-zinc-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        }
                    `}
                />

                {removable ? (
                    <button
                        type="button"
                        onClick={onRemove}
                        title="Remove option"
                        className="
                            flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                            border border-zinc-700/60 text-zinc-500
                            transition-all duration-200
                            hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400
                            active:scale-90
                        "
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                ) : (
                    <div className="h-9 w-9 shrink-0" />
                )}

            </div>

            {error && (
                <p className="ml-10 flex items-center gap-1 text-xs text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M12 2a10 10 0 100 20A10 10 0 0012 2zm-1 5a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
};

export default OptionInput;