const StatCard = ({ label, value, accent = false }) => (
    <div className={`
        relative overflow-hidden rounded-2xl border p-6
        transition-all duration-200 hover:scale-[1.02]
        ${accent
            ? "border-indigo-500/30 bg-indigo-500/10"
            : "border-zinc-700/60 bg-zinc-900/80"
        }
    `}>
        <div className={`
            absolute -right-4 -top-4 h-20 w-20 rounded-full blur-2xl opacity-20
            ${accent ? "bg-indigo-500" : "bg-zinc-600"}
        `} />

        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            {label}
        </p>
        <h2 className={`mt-3 text-4xl font-bold tracking-tight
            ${accent ? "text-indigo-300" : "text-white"}`}>
            {value ?? 0}
        </h2>
    </div>
);

const OptionBar = ({ option, count, total }) => {
    const percent = total > 0 ? Math.round((count / total) * 100) : 0;
    const isLeading = percent === Math.max(percent); 

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className={`font-medium ${isLeading && percent > 0 ? "text-white" : "text-zinc-400"}`}>
                    {option}
                </span>
                <div className="flex items-center gap-2">
                    <span className="text-zinc-500">{count} votes</span>
                    <span className={`
                         rounded-lg px-2 py-0.5 text-center text-xs font-bold
                        ${percent >= 50
                            ? "bg-indigo-500/20 text-indigo-300"
                            : "bg-zinc-800 text-zinc-400"
                        }
                    `}>
                        {percent}%
                    </span>
                </div>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-zinc-800">
                <div
                    style={{ width: `${percent}%` }}
                    className={`
                        h-full rounded-full transition-all duration-700 ease-out
                        ${percent >= 50
                            ? " bg-indigo-400 shadow-sm shadow-indigo-500/50"
                            : "bg-zinc-600"
                        }
                    `}
                />
            </div>
        </div>
    );
};

const PollAnalytics = ({ analytics }) => {
    const total = analytics?.totalResponses || 0;
    const questionWise = analytics?.questionWiseAnalytics || {};

    return (
        <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                    label="Total Responses"
                    value={total}
                    accent={true}
                />
                <StatCard
                    label="Anonymous"
                    value={analytics?.anonymousResponses}
                />
                <StatCard
                    label="Authenticated"
                    value={analytics?.authenticatedResponses}
                />
            </div>

            {Object.keys(questionWise).length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-700 py-16 text-center">
                    <div className="mb-3 text-4xl">📊</div>
                    <p className="text-sm font-medium text-zinc-400">No responses yet</p>
                    <p className="mt-1 text-xs text-zinc-600">Analytics will appear once votes come in</p>
                </div>
            ) : (
                <div className="space-y-5">
                    {Object.entries(questionWise).map(([questionId, options], qIdx) => {
                        const totalVotes = Object.values(options).reduce((a, b) => a + b, 0);
                        const sortedOptions = Object.entries(options).sort((a, b) => b[1] - a[1]);

                        return (
                            <div
                                key={questionId}
                                className="rounded-2xl border border-zinc-700/60 bg-zinc-900/80 p-6 backdrop-blur-sm"
                            >
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-lg
                                            bg-indigo-500/20 text-xs font-bold text-indigo-400">
                                            Q{qIdx + 1}
                                        </span>
                                        <h3 className="text-sm font-semibold text-zinc-300">
                                            Question ID:&nbsp;
                                            <span className="font-mono text-xs text-zinc-500">{questionId}</span>
                                        </h3>
                                    </div>
                                    <span className="text-xs text-zinc-600">{totalVotes} total</span>
                                </div>

                                <div className="space-y-4">
                                    {sortedOptions.map(([option, count]) => (
                                        <OptionBar
                                            key={option}
                                            option={option}
                                            count={count}
                                            total={totalVotes}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    );
};

export default PollAnalytics;