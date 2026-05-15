const WinnerBadge = () => (
    <span className="flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20
        px-2.5 py-0.5 text-xs font-semibold text-amber-400">
        Leading
    </span>
);

const OptionBar = ({ option, count, totalVotes, isWinner }) => {
    const percentage = totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : 0;

    return (
        <div className={`rounded-xl border p-4 transition-all duration-200
            ${isWinner
                ? "border-indigo-500/30 bg-indigo-500/5"
                : "border-zinc-800/60 bg-zinc-800/20"
            }`}>
            <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                    <span className={`truncate text-sm font-medium
                        ${isWinner ? "text-white" : "text-zinc-400"}`}>
                        {option}
                    </span>
                    {isWinner && <WinnerBadge />}
                </div>
                <div className="shrink-0 text-right">
                    <span className={`text-sm font-bold ${isWinner ? "text-indigo-300" : "text-zinc-400"}`}>
                        {percentage}%
                    </span>
                    <span className="ml-1.5 text-xs text-zinc-600">
                        ({count} vote{count !== 1 ? "s" : ""})
                    </span>
                </div>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                    style={{ width: `${percentage}%` }}
                    className={`h-full rounded-full transition-all duration-700 ease-out
                        ${isWinner
                            ? "bg-indigo-400 shadow-sm shadow-indigo-500/50"
                            : "bg-zinc-600"
                        }`}
                />
            </div>
        </div>
    );
};

const QuestionBlock = ({ questionId, options, index }) => {
    const entries = Object.entries(options).sort((a, b) => b[1] - a[1]);
    const totalVotes = entries.reduce((acc, [, count]) => acc + count, 0);
    const maxVotes = entries[0]?.[1] ?? 0;

    return (
        <div className="rounded-2xl border border-zinc-700/60 bg-zinc-900/80 backdrop-blur-sm p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center
                        rounded-lg bg-indigo-500/20 text-sm font-bold text-indigo-400">
                        Q{index + 1}
                    </span>
                    <div>
                        <p className="text-xs text-zinc-600 font-mono">{questionId}</p>
                        <p className="text-sm font-semibold text-white">Question {index + 1}</p>
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <p className="text-xl font-bold text-white">{totalVotes}</p>
                    <p className="text-xs text-zinc-500">total votes</p>
                </div>
            </div>

            {totalVotes === 0 ? (
                <div className="flex items-center justify-center rounded-xl border border-dashed border-zinc-700 py-8">
                    <p className="text-sm text-zinc-600">No votes yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {entries.map(([option, count]) => (
                        <OptionBar
                            key={option}
                            option={option}
                            count={count}
                            totalVotes={totalVotes}
                            isWinner={count === maxVotes && maxVotes > 0}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const PollResults = ({ poll, analytics }) => {
    const isExpired = poll?.expiresAt && new Date(poll.expiresAt) < new Date();
    const questionWise = analytics?.questionWiseAnalytics || {};
    const hasData = Object.keys(questionWise).length > 0;

    return (
        <div className="space-y-6">

            <div className="relative overflow-hidden rounded-2xl border border-zinc-700/60
                bg-zinc-900/80 backdrop-blur-sm p-8">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full
                    bg-indigo-500/10 blur-3xl pointer-events-none" />

                <div className="relative flex items-start justify-between gap-4">
                    <div className="space-y-3 min-w-0">
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            {poll?.title}
                        </h1>
                        <p className="text-sm leading-relaxed text-zinc-400 max-w-2xl">
                            {poll?.description}
                        </p>
                    </div>

                    <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold
                        ${isExpired
                            ? "border-red-500/20 bg-red-500/10 text-red-400"
                            : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                        }`}>
                        {isExpired ? "Closed" : "Live"}
                    </span>
                </div>

                <div className="relative mt-6 flex flex-wrap gap-6 border-t border-zinc-800 pt-5">
                    <div>
                        <p className="text-2xl font-bold text-white">
                            {analytics?.totalResponses ?? 0}
                        </p>
                        <p className="text-xs text-zinc-500">Total Responses</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">
                            {analytics?.anonymousResponses ?? 0}
                        </p>
                        <p className="text-xs text-zinc-500">Anonymous</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">
                            {analytics?.authenticatedResponses ?? 0}
                        </p>
                        <p className="text-xs text-zinc-500">Authenticated</p>
                    </div>
                    {poll?.expiresAt && (
                        <div className="ml-auto text-right">
                            <p className="text-sm font-medium text-zinc-300">
                                {new Date(poll.expiresAt).toLocaleDateString("en-IN", {
                                    day: "numeric", month: "short", year: "numeric"
                                })}
                            </p>
                            <p className="text-xs text-zinc-500">
                                {isExpired ? "Closed on" : "Closes on"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {!hasData ? (
                <div className="flex flex-col items-center justify-center rounded-2xl
                    border border-dashed border-zinc-700 py-20 text-center">
                    <div className="mb-3 text-5xl">📊</div>
                    <p className="text-sm font-medium text-zinc-400">No results yet</p>
                    <p className="mt-1 text-xs text-zinc-600">
                        Results will appear once people start voting
                    </p>
                </div>
            ) : (
                <div className="space-y-5">
                    {Object.entries(questionWise).map(([questionId, options], i) => (
                        <QuestionBlock
                            key={questionId}
                            questionId={questionId}
                            options={options}
                            index={i}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PollResults;