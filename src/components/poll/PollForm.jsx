import { useState } from "react";

const Toggle = ({ name, checked, onChange, label, description }) => (
    <label className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4
        transition-all duration-200
        ${checked
            ? "border-indigo-500/30 bg-indigo-500/5"
            : "border-zinc-700/60 bg-zinc-800/40 hover:border-zinc-600"
        }`}>
        <div className="relative mt-0.5 shrink-0">
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
                className="sr-only"
            />
            <div className={`h-5 w-9 rounded-full transition-colors duration-200
                ${checked ? "bg-indigo-500" : "bg-zinc-700"}`}>
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow
                    transition-transform duration-200
                    ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
            </div>
        </div>
        <div>
            <p className={`text-sm font-medium ${checked ? "text-white" : "text-zinc-400"}`}>
                {label}
            </p>
            {description && (
                <p className="mt-0.5 text-xs text-zinc-600">{description}</p>
            )}
        </div>
    </label>
);

const ErrorMsg = ({ msg }) => msg ? (
    <p className="flex items-center gap-1 text-xs text-red-400 mt-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M12 2a10 10 0 100 20A10 10 0 0012 2zm-1 5a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
        </svg>
        {msg}
    </p>
) : null;

const PollForm = ({ onSubmit, loading = false }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        expiresAt: "",
        allowAnonymous: true,
        allowAuthenticated: true,
    });

    const [errors, setErrors] = useState({});

    const [minDateTime] = useState(() => new Date(Date.now() + 60000).toISOString().slice(0, 16),
        []
    );


    const validate = () => {
        const e = {};
        if (!formData.title.trim()) e.title = "Poll title is required";
        else if (formData.title.trim().length < 5) e.title = "Title must be at least 5 characters";
        if (!formData.description.trim()) e.description = "Description is required";
        if (!formData.expiresAt) e.expiresAt = "Please set an expiry date";
        else if (new Date(formData.expiresAt) <= new Date()) e.expiresAt = "Expiry must be in the future";
        if (!formData.allowAnonymous && !formData.allowAuthenticated)
            e.responseType = "At least one response type must be enabled";
        return e;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        onSubmit(formData);
    };

    const fieldClass = (hasError) => `
        w-full rounded-xl border bg-zinc-900/80 backdrop-blur-sm
        px-4 py-3 text-sm text-white outline-none
        transition-all duration-200 placeholder:text-zinc-600
        ${hasError
            ? "border-red-500/70 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
            : "border-zinc-700/60 hover:border-zinc-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        }
    `;

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-zinc-700/60 bg-zinc-900/80 backdrop-blur-sm p-8"
        >
            <div>
                <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    Poll Title <span className="text-indigo-400">*</span>
                </label>
                <input
                    type="text"
                    name="title"
                    placeholder="e.g. What's your favourite stack?"
                    value={formData.title}
                    onChange={handleChange}
                    className={fieldClass(errors.title)}
                />
                <ErrorMsg msg={errors.title} />
            </div>

            <div>
                <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    Description <span className="text-indigo-400">*</span>
                </label>
                <textarea
                    name="description"
                    placeholder="Give voters some context about this poll..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`${fieldClass(errors.description)} resize-none`}
                />
                <div className="mt-1.5 flex items-center justify-between">
                    <ErrorMsg msg={errors.description} />
                    <span className="ml-auto text-xs text-zinc-600">
                        {formData.description.length} chars
                    </span>
                </div>
            </div>

            <div>
                <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    Expiry Date <span className="text-indigo-400">*</span>
                </label>
                <input
                    type="datetime-local"
                    name="expiresAt"
                    value={formData.expiresAt}
                    onChange={handleChange}
                    min={minDateTime}
                    className={`${fieldClass(errors.expiresAt)} color-scheme:dark`}
                />
                <ErrorMsg msg={errors.expiresAt} />
            </div>

            <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    Response Settings
                </p>
                <div className="space-y-3">
                    <Toggle
                        name="allowAnonymous"
                        checked={formData.allowAnonymous}
                        onChange={handleChange}
                        label="Allow Anonymous Responses"
                        description="Anyone can vote without logging in"
                    />
                    <Toggle
                        name="allowAuthenticated"
                        checked={formData.allowAuthenticated}
                        onChange={handleChange}
                        label="Allow Authenticated Responses"
                        description="Logged-in users can vote"
                    />
                </div>
                <ErrorMsg msg={errors.responseType} />
            </div>

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
                        Creating...
                    </>
                ) : "Create Poll"}
            </button>
        </form>
    );
};

export default PollForm;