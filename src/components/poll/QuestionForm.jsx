import { useState } from "react";

const MAX_OPTIONS = 8;

const ErrorMsg = ({ msg }) => msg ? (
    <p className="flex items-center gap-1 text-xs text-red-400 mt-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M12 2a10 10 0 100 20A10 10 0 0012 2zm-1 5a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
        </svg>
        {msg}
    </p>
) : null;

const fieldClass = (hasError) => `
    w-full rounded-xl border bg-zinc-900/80 backdrop-blur-sm
    px-4 py-3 text-sm text-white outline-none
    transition-all duration-200 placeholder:text-zinc-600
    ${hasError
        ? "border-red-500/70 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
        : "border-zinc-700/60 hover:border-zinc-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
    }
`;

const QuestionForm = ({ onAddQuestion, loading = false }) => {
    const [questionData, setQuestionData] = useState({
        questionText: "",
        options: ["", ""],
        isRequired: false,
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!questionData.questionText.trim())
            e.questionText = "Question text is required";
        else if (questionData.questionText.trim().length < 5)
            e.questionText = "Question must be at least 5 characters";

        const filledOptions = questionData.options.filter((o) => o.trim() !== "");
        if (filledOptions.length < 2)
            e.options = "At least 2 options are required";

        const unique = new Set(filledOptions.map((o) => o.trim().toLowerCase()));
        if (unique.size !== filledOptions.length)
            e.options = "Options must be unique";

        return e;
    };

    const handleQuestionChange = (e) => {
        const { name, value, type, checked } = e.target;
        setQuestionData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleOptionChange = (index, value) => {
        const updated = [...questionData.options];
        updated[index] = value;
        setQuestionData((prev) => ({ ...prev, options: updated }));
        if (errors.options) setErrors((prev) => ({ ...prev, options: "" }));
    };

    const addOption = () => {
        if (questionData.options.length >= MAX_OPTIONS) return;
        setQuestionData((prev) => ({ ...prev, options: [...prev.options, ""] }));
    };

    const removeOption = (index) => {
        setQuestionData((prev) => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        const filteredOptions = questionData.options.filter((o) => o.trim() !== "");
        onAddQuestion({ ...questionData, options: filteredOptions });
        setQuestionData({ questionText: "", options: ["", ""], isRequired: false });
        setErrors({});
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-zinc-700/60 bg-zinc-900/80 backdrop-blur-sm p-8"
        >
            <div>
                <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    Question <span className="text-indigo-400">*</span>
                </label>
                <input
                    type="text"
                    name="questionText"
                    placeholder="e.g. Which framework do you prefer?"
                    value={questionData.questionText}
                    onChange={handleQuestionChange}
                    className={fieldClass(errors.questionText)}
                />
                <ErrorMsg msg={errors.questionText} />
            </div>

            {/* Options */}
            <div>
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                            Options <span className="text-indigo-400">*</span>
                        </label>
                        <p className="mt-0.5 text-xs text-zinc-600">
                            {questionData.options.length}/{MAX_OPTIONS} options
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={addOption}
                        disabled={questionData.options.length >= MAX_OPTIONS}
                        className="flex items-center gap-1.5 rounded-xl border border-zinc-700
                            px-3 py-2 text-xs font-medium text-zinc-400
                            transition-all duration-200
                            hover:border-indigo-500/50 hover:text-indigo-400 hover:bg-indigo-500/5
                            disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        Add Option
                    </button>
                </div>

                <div className="space-y-3">
                    {questionData.options.map((option, index) => (
                        <div key={index} className="group flex items-center gap-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center
                                rounded-lg bg-zinc-800 text-xs font-bold text-zinc-500
                                group-focus-within:bg-indigo-500/20 group-focus-within:text-indigo-400
                                transition-colors duration-200">
                                {index + 1}
                            </span>

                            <input
                                type="text"
                                placeholder={`Option ${index + 1}`}
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                className={fieldClass(errors.options && option.trim() === "")}
                            />

                            {questionData.options.length > 2 ? (
                                <button
                                    type="button"
                                    onClick={() => removeOption(index)}
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                                        border border-zinc-700/60 text-zinc-500
                                        transition-all duration-200
                                        hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400
                                        active:scale-90"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            ) : (
                                <div className="h-9 w-9 shrink-0" />
                            )}
                        </div>
                    ))}
                </div>

                <ErrorMsg msg={errors.options} />
            </div>

            <label className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4
                transition-all duration-200
                ${questionData.isRequired
                    ? "border-indigo-500/30 bg-indigo-500/5"
                    : "border-zinc-700/60 bg-zinc-800/40 hover:border-zinc-600"
                }`}>
                <div className="relative mt-0.5 shrink-0">
                    <input
                        type="checkbox"
                        name="isRequired"
                        checked={questionData.isRequired}
                        onChange={handleQuestionChange}
                        className="sr-only"
                    />
                    <div className={`h-5 w-9 rounded-full transition-colors duration-200
                        ${questionData.isRequired ? "bg-indigo-500" : "bg-zinc-700"}`}>
                        <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow
                            transition-transform duration-200
                            ${questionData.isRequired ? "translate-x-4" : "translate-x-0.5"}`} />
                    </div>
                </div>
                <div>
                    <p className={`text-sm font-medium ${questionData.isRequired ? "text-white" : "text-zinc-400"}`}>
                        Required Question
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-600">
                        Voters must answer this question to submit
                    </p>
                </div>
            </label>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white
                    shadow-lg shadow-indigo-500/30
                    transition-all duration-200
                    hover:bg-indigo-500 hover:shadow-indigo-500/40
                    disabled:cursor-not-allowed disabled:opacity-50
                    active:scale-[0.98]
                    flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Adding...
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        Add Question
                    </>
                )}
            </button>
        </form>
    );
};

export default QuestionForm;