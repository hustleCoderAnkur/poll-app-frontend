import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PollForm from "../../components/poll/PollForm.jsx";
import QuestionForm from "../../components/poll/QuestionForm.jsx";

import axiosInstance from "../../api/axios.js";

const steps = [
    "Poll Details",
    "Add Questions",
    "Review & Publish",
];


// ── Step Bar ─────────────────────────────────────────────
const StepBar = ({ current }) => (

    <div className="flex items-center gap-0">

        {steps.map((label, i) => {

            const done = i < current;
            const active = i === current;

            return (

                <div
                    key={i}
                    className="flex items-center"
                >

                    <div
                        className="flex items-center gap-2"
                    >

                        <div
                            className={`flex h-7 w-7
                            items-center justify-center
                            rounded-full text-xs
                            font-bold transition-all duration-300
                            ${done
                                    ? "bg-indigo-500 text-white"
                                    : active
                                        ? "border-2 border-indigo-500 bg-indigo-500/20 text-indigo-400"
                                        : "bg-zinc-800 text-zinc-600"
                                }`}
                        >

                            {done ? (

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3.5 w-3.5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                >
                                    <path d="M5 12l5 5L20 7" />
                                </svg>

                            ) : (
                                i + 1
                            )}

                        </div>

                        <span
                            className={`hidden text-xs
                            font-medium sm:block
                            ${active
                                    ? "text-white"
                                    : done
                                        ? "text-indigo-400"
                                        : "text-zinc-600"
                                }`}
                        >
                            {label}
                        </span>

                    </div>

                    {i < steps.length - 1 && (

                        <div
                            className={`mx-3 h-px
                            w-10 transition-colors
                            duration-300 sm:w-16
                            ${done
                                    ? "bg-indigo-500"
                                    : "bg-zinc-800"
                                }`}
                        />

                    )}

                </div>
            );
        })}

    </div>
);


// ── Question Preview Card ───────────────────────────────
const QuestionPreviewCard = ({
    question,
    index,
    onRemove,
}) => (

    <div
        className="group rounded-2xl
        border border-zinc-700/60
        bg-zinc-900/80 p-5
        transition-all duration-200
        hover:border-zinc-600"
    >

        <div
            className="mb-3 flex
            items-start justify-between gap-3"
        >

            <div
                className="flex items-center gap-3"
            >

                <span
                    className="flex h-6 w-6
                    shrink-0 items-center
                    justify-center rounded-md
                    bg-indigo-500/20 text-xs
                    font-bold text-indigo-400"
                >
                    {index + 1}
                </span>

                <p
                    className="text-sm
                    font-semibold text-white"
                >
                    {question.questionText}
                </p>

            </div>

            <div
                className="flex shrink-0
                items-center gap-2"
            >

                {question.isRequired && (

                    <span
                        className="rounded-full
                        border border-red-500/20
                        bg-red-500/10 px-2.5
                        py-0.5 text-xs font-semibold
                        text-red-400"
                    >
                        Required
                    </span>

                )}

                <button
                    onClick={() =>
                        onRemove(index)
                    }
                    className="flex h-7 w-7
                    items-center justify-center
                    rounded-lg border
                    border-zinc-700 text-zinc-500
                    opacity-0 transition-all
                    duration-200 group-hover:opacity-100
                    hover:border-red-500/40
                    hover:bg-red-500/10
                    hover:text-red-400"
                >

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>

                </button>

            </div>

        </div>

        <div
            className="ml-9 flex flex-wrap gap-2"
        >

            {question.options.map((opt, i) => (

                <span
                    key={i}
                    className="rounded-lg
                    border border-zinc-700/60
                    bg-zinc-800/60 px-3 py-1
                    text-xs text-zinc-400"
                >
                    {opt}
                </span>

            ))}

        </div>

    </div>
);


// ── CreatePollPage ──────────────────────────────────────
const CreatePollPage = () => {

    const navigate = useNavigate();

    const [step, setStep] = useState(0);

    const [pollData, setPollData] =
        useState(null);

    const [questions, setQuestions] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // ── Poll details submit ───────────────────────────
    const handlePollSubmit = (data) => {

        setPollData(data);
        setStep(1);
    };


    // ── Add question ──────────────────────────────────
    const handleAddQuestion = (
        question
    ) => {

        setQuestions((prev) => [
            ...prev,
            question,
        ]);
    };


    // ── Remove question ───────────────────────────────
    const handleRemoveQuestion = (
        index
    ) => {

        setQuestions((prev) =>
            prev.filter(
                (_, i) => i !== index
            )
        );
    };


    // ── Final review step ─────────────────────────────
    const handleFinalize = () => {

        if (questions.length === 0) {

            setError(
                "Add at least one question before publishing"
            );

            return;
        }

        setError("");
        setStep(2);
    };


    // ── Publish poll ──────────────────────────────────
    const handlePublish = async () => {

        try {

            setLoading(true);
            setError("");

            // ── 1. Create poll ─────────────────────
            const pollResponse =
                await axiosInstance.post(
                    "/polls",
                    pollData
                );

            console.log(
                "[CreatePollPage] pollResponse:",
                pollResponse.data
            );

            const createdPoll =
                pollResponse.data.poll ??
                pollResponse.data;

            const pollId =
                createdPoll.id ||
                createdPoll._id;

            if (!pollId) {

                throw new Error(
                    "Poll ID missing after creation"
                );
            }

            console.log(
                "[CreatePollPage] pollId:",
                pollId
            );

            // ── 2. Create questions ────────────────
            for (const question of questions) {

                const questionPayload = {
                    pollId,
                    questionText:
                        question.questionText,
                    options:
                        question.options,
                    isRequired:
                        question.isRequired,
                };

                console.log(
                    "[CreatePollPage] creating question:",
                    questionPayload
                );

                await axiosInstance.post(
                    "/questions",
                    questionPayload
                );
            }

            // ── 3. Publish poll ────────────────────
            await axiosInstance.patch(
                `/polls/${pollId}/publish`
            );

            console.log(
                "[CreatePollPage] poll published"
            );

            // ── 4. Redirect ────────────────────────
            navigate(
                `/poll/${pollId}/analytics`
            );

        } catch (err) {

            console.error(
                "[CreatePollPage] publish error:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                "Something went wrong"
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="space-y-8">

            {/* Header */}
            <div
                className="flex items-start
                justify-between gap-4"
            >

                <div>

                    <h1
                        className="text-3xl
                        font-bold text-white"
                    >
                        Create Poll
                    </h1>

                    <p
                        className="mt-1.5 text-sm
                        text-zinc-500"
                    >
                        Build and publish a new poll in minutes
                    </p>

                </div>

                <StepBar current={step} />

            </div>


            {/* Error */}
            {error && (

                <div
                    className="flex items-center
                    gap-2 rounded-xl
                    border border-red-500/20
                    bg-red-500/10 px-4 py-3"
                >

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 shrink-0 text-red-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M12 2a10 10 0 100 20A10 10 0 0012 2zm-1 5a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                            clipRule="evenodd"
                        />
                    </svg>

                    <p
                        className="text-sm text-red-400"
                    >
                        {error}
                    </p>

                </div>
            )}


            {/* Step 1 */}
            {step === 0 && (

                <PollForm
                    onSubmit={handlePollSubmit}
                />

            )}


            {/* Step 2 */}
            {step === 1 && (

                <div className="space-y-6">

                    <QuestionForm
                        onAddQuestion={handleAddQuestion}
                    />

                    {questions.length > 0 && (

                        <div className="space-y-4">

                            <div
                                className="flex items-center
                                justify-between"
                            >

                                <h2
                                    className="text-base
                                    font-semibold text-white"
                                >
                                    Questions Added

                                    <span
                                        className="ml-2
                                        rounded-full
                                        bg-indigo-500/20
                                        px-2.5 py-0.5
                                        text-xs font-bold
                                        text-indigo-400"
                                    >
                                        {questions.length}
                                    </span>

                                </h2>

                                <button
                                    onClick={
                                        handleFinalize
                                    }
                                    className="flex items-center
                                    gap-2 rounded-xl
                                    bg-indigo-600 px-5
                                    py-2.5 text-sm
                                    font-semibold text-white
                                    shadow-md
                                    shadow-indigo-500/30
                                    transition-all duration-200
                                    hover:bg-indigo-500
                                    active:scale-95"
                                >

                                    Review Poll

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                    >
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>

                                </button>

                            </div>

                            <div className="space-y-3">

                                {questions.map((q, i) => (

                                    <QuestionPreviewCard
                                        key={i}
                                        question={q}
                                        index={i}
                                        onRemove={
                                            handleRemoveQuestion
                                        }
                                    />

                                ))}

                            </div>

                        </div>
                    )}

                </div>
            )}


            {/* Step 3 */}
            {step === 2 && pollData && (

                <div className="space-y-6">

                    <div
                        className="rounded-2xl
                        border border-zinc-700/60
                        bg-zinc-900/80 p-6"
                    >

                        <div
                            className="mb-4 flex
                            items-center justify-between"
                        >

                            <h2
                                className="text-lg
                                font-bold text-white"
                            >
                                Poll Summary
                            </h2>

                            <button
                                onClick={() =>
                                    setStep(0)
                                }
                                className="text-xs
                                text-zinc-500
                                transition-colors
                                hover:text-indigo-400"
                            >
                                Edit details
                            </button>

                        </div>

                        <div
                            className="space-y-2 text-sm"
                        >

                            <div className="flex gap-3">

                                <span
                                    className="w-24
                                    shrink-0 text-zinc-500"
                                >
                                    Title
                                </span>

                                <span
                                    className="font-medium text-white"
                                >
                                    {pollData.title}
                                </span>

                            </div>

                            <div className="flex gap-3">

                                <span
                                    className="w-24
                                    shrink-0 text-zinc-500"
                                >
                                    Description
                                </span>

                                <span
                                    className="text-zinc-300"
                                >
                                    {pollData.description}
                                </span>

                            </div>

                        </div>

                    </div>

                    <div className="flex items-center gap-3">

                        <button
                            onClick={() =>
                                setStep(1)
                            }
                            className="rounded-xl
                            border border-zinc-700
                            px-5 py-3 text-sm
                            font-medium text-zinc-400
                            transition hover:border-zinc-500
                            hover:text-white"
                        >
                            Back
                        </button>

                        <button
                            onClick={handlePublish}
                            disabled={loading}
                            className="flex flex-1
                            items-center justify-center
                            gap-2 rounded-xl
                            bg-indigo-600 px-5
                            py-3.5 text-sm
                            font-semibold text-white
                            shadow-lg shadow-indigo-500/30
                            transition-all duration-200
                            hover:bg-indigo-500
                            hover:shadow-indigo-500/40
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            active:scale-[0.98]"
                        >

                            {loading ? (

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

                                    Publishing...

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

                                    Publish Poll

                                </>

                            )}

                        </button>

                    </div>

                </div>
            )}

        </div>
    );
};

export default CreatePollPage;
