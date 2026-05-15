import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import PollHeader from "../../components/poll/PollHeader.jsx";
import axiosInstance from "../../api/axios.js";


// ── Loader ─────────────────────────────────────────────
const PageLoader = () => (
    <div className="flex min-h-screen items-center justify-center bg-[#09090B]">
        <div className="relative flex items-center justify-center">
            <div className="absolute h-16 w-16 rounded-full bg-indigo-500/20 blur-2xl" />
            <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-zinc-800 border-t-indigo-400" />
        </div>
    </div>
);


// ── Status Screen ──────────────────────────────────────
const StatusScreen = ({ title, subtitle, children }) => (
    <div className="flex min-h-screen items-center justify-center bg-[#09090B] px-6">
        <div className="w-full max-w-md rounded-[2rem] border border-zinc-800 bg-zinc-950/90 p-10 text-center shadow-2xl shadow-black/30 backdrop-blur-xl">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
                {title}
            </h2>

            {subtitle && (
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {subtitle}
                </p>
            )}

            {children}
        </div>
    </div>
);


// ── PollPage ───────────────────────────────────────────
const PollPage = () => {

    const { shareId } = useParams();

    const [poll, setPoll] = useState(null);
    const [questions, setQuestions] = useState([]);

    const [responses, setResponses] = useState({});
    const [errors, setErrors] = useState({});

    const [isAnonymous, setIsAnonymous] = useState(false);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);


    // ── Fetch Poll ────────────────────────────────────
    useEffect(() => {

        if (!shareId) return;

        let cancelled = false;

        const fetchPoll = async () => {

            try {

                setLoading(true);
                setError("");

                const pollRes =
                    await axiosInstance.get(
                        `/polls/share/${shareId}`
                    );

                const pollObj =
                    pollRes.data.poll ??
                    pollRes.data;

                const pollId =
                    pollObj.id ||
                    pollObj._id;

                if (
                    pollObj.expiresAt &&
                    new Date(pollObj.expiresAt) < new Date()
                ) {

                    if (!cancelled) {
                        setError("expired");
                    }

                    return;
                }

                const qRes =
                    await axiosInstance.get(
                        `/questions/poll/${pollId}`
                    );

                const fetchedQuestions =
                    qRes.data.questions ||
                    qRes.data.data ||
                    qRes.data.pollQuestions ||
                    qRes.data.items ||
                    [];

                const normalizedQuestions =
                    Array.isArray(fetchedQuestions)
                        ? fetchedQuestions.map((q) => ({
                            ...q,
                            id: q.id || q._id,
                        }))
                        : [];

                if (!cancelled) {

                    setPoll({
                        ...pollObj,
                        id: pollId,
                    });

                    setQuestions(normalizedQuestions);
                }

            } catch (err) {

                if (!cancelled) {

                    setError(
                        err.response?.data?.message ||
                        err.message ||
                        "Something went wrong"
                    );
                }

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchPoll();

        return () => {
            cancelled = true;
        };

    }, [shareId]);


    // ── Option Select ─────────────────────────────────
    const handleOptionSelect = (
        questionId,
        option
    ) => {

        setResponses((prev) => ({
            ...prev,
            [questionId]: option,
        }));

        if (errors[questionId]) {

            setErrors((prev) => ({
                ...prev,
                [questionId]: "",
            }));
        }
    };


    // ── Validation ────────────────────────────────────
    const validate = () => {

        const e = {};

        questions?.forEach((q) => {

            const questionId =
                q.id || q._id;

            if (
                q.isRequired &&
                !responses[questionId]
            ) {

                e[questionId] =
                    "This question is required";
            }
        });

        return e;
    };


    // ── Submit ────────────────────────────────────────
    const handleSubmit = async (e) => {

        e.preventDefault();

        const errs = validate();

        if (Object.keys(errs).length > 0) {

            setErrors(errs);

            const firstErrId =
                Object.keys(errs)[0];

            document
                .getElementById(
                    `question-${firstErrId}`
                )
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });

            return;
        }

        try {

            setSubmitting(true);
            setError("");

            if (
                !poll.allowAnonymous &&
                !localStorage.getItem("accessToken")
            ) {

                setError(
                    "This poll requires login before submitting a response."
                );

                return;
            }

            const responseEntries =
                Object.entries(responses);

            const submissionToken =
                window.crypto.randomUUID()


            for (const [questionId, answer] of responseEntries) {

                const payload = {

                    pollId:
                        Number(poll.id),

                    questionId:
                        Number(questionId),

                    selectedOption:
                        answer,

                    isAnonymous:
                        isAnonymous &&
                        poll.allowAnonymous,

                    submissionToken
                };

                const res =
                    await axiosInstance.post(
                        "/responses",
                        payload
                    );

                if (!res?.data?.success) {

                    throw new Error(
                        "Failed to submit response"
                    );
                }
            }

            setSubmitted(true);

        } catch (err) {

            setError(
                err.response?.data?.message ||
                err.message ||
                "Submission failed. Please try again."
            );

        } finally {

            setSubmitting(false);
        }
    };


    // ── States ────────────────────────────────────────
    if (loading) {
        return <PageLoader />;
    }

    if (error === "expired") {

        return (
            <StatusScreen
                title="Poll Expired"
                subtitle="This poll is no longer accepting responses."
            >
                <Link
                    to={`/poll/results/${shareId}`}
                    className="mt-6 inline-flex rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-zinc-500 hover:bg-zinc-900 hover:text-white"
                >
                    View Results
                </Link>
            </StatusScreen>
        );
    }

    if (error && !poll) {

        return (
            <StatusScreen
                title="Poll Not Found"
                subtitle={error}
            />
        );
    }

    if (submitted) {

        return (
            <StatusScreen
                title="Response Submitted!"
                subtitle="Thanks for participating in this poll."
            >
                <Link
                    to={`/poll/results/${shareId}`}
                    className="mt-6 inline-flex rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-900/40 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500"
                >
                    View Results
                </Link>
            </StatusScreen>
        );
    }


    const isExpired =
        poll?.expiresAt &&
        new Date(poll.expiresAt) < new Date();

    const answeredCount =
        Object.keys(responses).length;

    const totalCount =
        questions?.length || 0;

    const progress =
        totalCount > 0
            ? (answeredCount / totalCount) * 100
            : 0;

    const allAnswered =
        answeredCount === totalCount &&
        totalCount > 0;


    // ── UI ────────────────────────────────────────────
    return (

        <div className="min-h-screen bg-[#09090B]">

            {/* Background glow */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
            </div>

            <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
                    <PollHeader
                        poll={poll}
                        questionCount={questions.length}
                    />
                </div>


                {/* Login warning */}
                {poll &&
                    !poll.allowAnonymous &&
                    !localStorage.getItem("accessToken") && (

                        <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5">
                            <p className="text-sm font-semibold text-amber-300">
                                Login required
                            </p>

                            <p className="mt-1 text-sm text-amber-200/70">
                                This poll only accepts authenticated responses.
                            </p>
                        </div>
                    )}


                {/* Error */}
                {error && poll && (

                    <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5">
                        <p className="text-sm font-medium text-red-300">
                            {error}
                        </p>
                    </div>
                )}


                {/* Progress */}
                {totalCount > 0 && (

                    <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">

                        <div className="mb-3 flex items-center justify-between">

                            <span className="text-sm font-medium text-zinc-400">
                                {answeredCount} of {totalCount} answered
                            </span>

                            <span
                                className={`text-sm font-semibold ${allAnswered
                                    ? "text-emerald-400"
                                    : "text-indigo-400"
                                    }`}
                            >
                                {Math.round(progress)}%
                            </span>

                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-zinc-900">

                            <div
                                style={{
                                    width: `${progress}%`
                                }}
                                className={`h-full rounded-full transition-all duration-500 ${allAnswered
                                    ? "bg-emerald-500"
                                    : "bg-gradient-to-r from-indigo-500 to-violet-500"
                                    }`}
                            />

                        </div>

                    </div>
                )}


                {/* Questions */}
                {!isExpired &&
                    questions?.map((question, index) => {

                        const questionId =
                            question.id ||
                            question._id;

                        const selectedOption =
                            responses[questionId];

                        return (

                            <div
                                key={questionId}
                                id={`question-${questionId}`}
                                className={`rounded-3xl border bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl transition-all duration-200 ${errors[questionId]
                                    ? "border-red-500/40"
                                    : "border-zinc-800/80"
                                    }`}
                            >

                                {/* Question number */}
                                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                                    Question {index + 1}
                                    {question.isRequired && (
                                        <span className="ml-1 text-red-400">
                                            *
                                        </span>
                                    )}
                                </p>


                                {/* Title */}
                                <h2 className="mb-6 text-lg font-semibold leading-relaxed tracking-tight text-zinc-100">
                                    {question.questionText ||
                                        question.text ||
                                        question.title}
                                </h2>


                                {/* Options */}
                                <div className="space-y-3">

                                    {question.options?.map(
                                        (option, i) => {

                                            const optionValue =
                                                typeof option === "string"
                                                    ? option
                                                    : option.text ||
                                                    option.value ||
                                                    option;

                                            const isSelected =
                                                selectedOption === optionValue;

                                            return (

                                                <label
                                                    key={i}
                                                    className={`flex cursor-pointer items-center gap-4 rounded-2xl border px-5 py-4 transition-all duration-200 ${isSelected
                                                        ? "border-indigo-400/60 bg-indigo-500/15 shadow-lg shadow-indigo-500/10"
                                                        : "border-zinc-800 bg-zinc-900/70 hover:border-zinc-600 hover:bg-zinc-800"
                                                        }`}
                                                >

                                                    <input
                                                        type="radio"
                                                        name={`question-${questionId}`}
                                                        checked={isSelected}
                                                        onChange={() =>
                                                            handleOptionSelect(
                                                                questionId,
                                                                optionValue
                                                            )
                                                        }
                                                        className="sr-only"
                                                    />

                                                    <div
                                                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${isSelected
                                                            ? "border-indigo-400 bg-indigo-500"
                                                            : "border-zinc-600"
                                                            }`}
                                                    >

                                                        {isSelected && (
                                                            <div className="h-2 w-2 rounded-full bg-white" />
                                                        )}

                                                    </div>

                                                    <span
                                                        className={`text-sm leading-relaxed ${isSelected
                                                            ? "font-medium text-white"
                                                            : "text-zinc-200"
                                                            }`}
                                                    >
                                                        {optionValue}
                                                    </span>

                                                </label>
                                            );
                                        }
                                    )}

                                </div>


                                {/* Validation */}
                                {errors[questionId] && (

                                    <p className="mt-4 text-sm font-medium text-red-400">
                                        {errors[questionId]}
                                    </p>

                                )}

                            </div>
                        );
                    })}


                {/* Anonymous */}
                {!isExpired && (

                    <label className="flex cursor-pointer items-start gap-4 rounded-3xl border border-zinc-800 bg-zinc-950/90 p-5 transition-all duration-200 hover:border-zinc-700">

                        <div className="relative mt-1 shrink-0">

                            <input
                                type="checkbox"
                                checked={isAnonymous}
                                onChange={(e) =>
                                    setIsAnonymous(
                                        e.target.checked
                                    )
                                }
                                className="sr-only"
                            />

                            <div
                                className={`h-6 w-11 rounded-full transition-all duration-200 ${isAnonymous
                                    ? "bg-indigo-500"
                                    : "bg-zinc-700"
                                    }`}
                            >

                                <div
                                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200 ${isAnonymous
                                        ? "translate-x-5"
                                        : "translate-x-0.5"
                                        }`}
                                />

                            </div>

                        </div>

                        <div>

                            <p className="text-sm font-semibold text-zinc-100">
                                Submit anonymously
                            </p>

                            <p className="mt-1 text-sm text-zinc-500">
                                Your identity won&apos;t be linked with this response.
                            </p>

                        </div>

                    </label>
                )}


                {/* Submit */}
                {!isExpired && (

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex h-14 w-full items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-2xl shadow-indigo-900/40 transition-all duration-200 hover:scale-[1.01] hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99]"
                    >

                        {submitting ? (

                            <>
                                <svg
                                    className="h-4 w-4 animate-spin"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />

                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8z"
                                    />
                                </svg>

                                Submitting...

                            </>

                        ) : (

                            <>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                >
                                    <path d="M5 12l5 5L20 7" />
                                </svg>

                                Submit Response

                            </>

                        )}

                    </button>
                )}

            </div>

        </div>
    );
};

export default PollPage;