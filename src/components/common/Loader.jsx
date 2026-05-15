const RingSpinner = ({ size }) => {
    const glowSizes = {
        sm: "h-6 w-6",
        md: "h-11 w-11",
        lg: "h-16 w-16",
    };
    const spinSizes = {
        sm: "h-6 w-6 border-2",
        md: "h-11 w-11 border-[3px]",
        lg: "h-16 w-16 border-4",
    };
    return (
        <div className="relative flex items-center justify-center">
            <div className={`absolute rounded-full blur-md opacity-30 bg-indigo-500 ${glowSizes[size]}`} />
            <div className={`animate-spin rounded-full border-zinc-800 border-t-indigo-400 ${spinSizes[size]}`} />
        </div>
    );
};

const DotsSpinner = () => (
    <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
            <div
                key={i}
                className="h-2 w-2 rounded-full bg-indigo-400"
                style={{
                    animation: "dotBounce 1.2s ease-in-out infinite",
                    animationDelay: `${i * 0.2}s`,
                }}
            />
        ))}
        <style>{`
            @keyframes dotBounce {
                0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
                40% { transform: scale(1); opacity: 1; }
            }
        `}</style>
    </div>
);

const PulseSpinner = ({ size }) => {
    const pingSizes = {
        sm: "h-6 w-6",
        md: "h-11 w-11",
        lg: "h-16 w-16",
    };
    const dotSizes = {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-6 w-6",
    };
    return (
        <div className="relative flex items-center justify-center">
            <div className={`absolute animate-ping rounded-full bg-indigo-500/40 ${pingSizes[size]}`} />
            <div className={`relative rounded-full bg-indigo-500 ${dotSizes[size]}`} />
        </div>
    );
};

const Loader = ({
    fullscreen = true,
    size = "md",
    label = "",
    variant = "ring",
}) => {
    const spinners = {
        ring: <RingSpinner size={size} />,
        dots: <DotsSpinner />,
        pulse: <PulseSpinner size={size} />,
    };

    const content = (
        <div className="flex flex-col items-center gap-4">
            {spinners[variant]}
            {label && (
                <p className="text-xs font-medium tracking-widest uppercase text-zinc-500 animate-pulse">
                    {label}
                </p>
            )}
        </div>
    );

    if (!fullscreen) return content;

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950">
            {content}
        </div>
    );
};

export default Loader;