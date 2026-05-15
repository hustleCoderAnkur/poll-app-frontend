import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios.js"

const ErrorMsg = ({ msg }) => msg ? (
    <p className="flex items-center gap-1 text-xs text-red-400 mt-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M12 2a10 10 0 100 20A10 10 0 0012 2zm-1 5a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
        </svg>
        {msg}
    </p>
) : null;

const Toggle = ({ name, checked, onChange, label, description }) => (
    <label className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4
        transition-all duration-200
        ${checked
            ? "border-indigo-500/30 bg-indigo-500/5"
            : "border-zinc-700/60 bg-zinc-800/40 hover:border-zinc-600"
        }`}>
        <div className="relative mt-0.5 shrink-0">
            <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only" />
            <div className={`h-5 w-9 rounded-full transition-colors duration-200
                ${checked ? "bg-indigo-500" : "bg-zinc-700"}`}>
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow
                    transition-transform duration-200
                    ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
            </div>
        </div>
        <div>
            <p className={`text-sm font-medium ${checked ? "text-white" : "text-zinc-400"}`}>{label}</p>
            {description && <p className="mt-0.5 text-xs text-zinc-600">{description}</p>}
        </div>
    </label>
);

const PageLoader = () => (
    <div className="flex items-center justify-center py-32">
        <div className="relative flex items-center justify-center">
            <div className="absolute h-12 w-12 rounded-full bg-indigo-500/20 blur-md" />
            <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-zinc-800 border-t-indigo-400" />
        </div>
    </div>
);

const fieldClass = (hasError) => `
    w-full rounded-xl border bg-zinc-900/80 backdrop-blur-sm
    px-4 py-3 text-sm text-white outline-none
    transition-all duration-200 placeholder:text-zinc-600
    ${hasError
        ? "border-red-500/70 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
        : "border-zinc-700/60 hover:border-zinc-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
    }
`;

const EditPollPage = () => {
    const { pollId } = useParams();
    const navigate = useNavigate();

    const [pollData, setPollData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [saved, setSaved] = useState(false);


    useEffect(() => {

        if (!pollId) return;

        let cancelled = false;

        const fetchPoll = async () => {

            try {

                setLoading(true);

                const response = await axiosInstance.get(
                    `/polls/${pollId}`
                );

                const data = response.data;

                const poll = data.poll ?? data;

                if (!cancelled) {

                    setPollData({
                        title: poll.title ?? "",

                        description:
                            poll.description ?? "",

                        expiresAt: poll.expiresAt
                            ? new Date(poll.expiresAt)
                                .toISOString()
                                .slice(0, 16)
                            : "",

                        allowAnonymous:
                            poll.allowAnonymous ?? true,

                        allowAuthenticated:
                            poll.allowAuthenticated ?? true,
                    });
                }

            } catch (err) {

                if (!cancelled) {

                    setError(
                        err.response?.data?.message ||
                        err.message ||
                        "Failed to load poll"
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

    }, [pollId]);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPollData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: "" }));
        if (error) setError("");
        setSaved(false);
    };

    const validate = () => {
        const e = {};
        if (!pollData.title.trim()) e.title = "Title is required";
        else if (pollData.title.trim().length < 5) e.title = "At least 5 characters";
        if (!pollData.description.trim()) e.description = "Description is required";
        if (!pollData.expiresAt) e.expiresAt = "Expiry date is required";
        else if (new Date(pollData.expiresAt) <= new Date()) e.expiresAt = "Must be in the future";
        if (!pollData.allowAnonymous && !pollData.allowAuthenticated)
            e.responseType = "At least one response type must be enabled";
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setFieldErrors(errs);
            return;
        }
        try {
            setSaving(true);
            setError("");

            const res = await fetch(`/api/polls/${pollId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify(pollData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to save changes");
            }

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <PageLoader />;

    if (error && !pollData) return (
        <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-3 text-5xl"></div>
            <p className="text-base font-semibold text-white">{error}</p>
            <button
                onClick={() => navigate("/dashboard")}
                className="mt-6 rounded-xl border border-zinc-700 px-5 py-2.5 text-sm
                    text-zinc-400 hover:border-zinc-500 hover:text-white transition"
            >
                 Back to Dashboard
            </button>
        </div>
    );

    return (
        <div className="space-y-8">

            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="mb-1 flex items-center gap-2">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="text-zinc-500 hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M19 12H5M12 5l-7 7 7 7" />
                            </svg>
                        </button>
                        <span className="text-xs text-zinc-500">Dashboard</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Edit Poll</h1>
                    <p className="mt-1.5 text-sm text-zinc-500">Update your poll settings</p>
                </div>

                {saved && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20
                        bg-emerald-500/10 px-4 py-2.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M5 12l5 5L20 7" />
                        </svg>
                        <span className="text-sm font-medium text-emerald-400">Saved!</span>
                    </div>
                )}
            </div>

            {error && pollData && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/20
                    bg-red-500/10 px-4 py-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-red-400"
                        viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M12 2a10 10 0 100 20A10 10 0 0012 2zm-1 5a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-2xl border border-zinc-700/60 bg-zinc-900/80 backdrop-blur-sm p-8"
            >
                {/* Title */}
                <div>
                    <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold
                        uppercase tracking-widest text-zinc-400">
                        Poll Title <span className="text-indigo-400">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={pollData.title}
                        onChange={handleChange}
                        className={fieldClass(fieldErrors.title)}
                    />
                    <ErrorMsg msg={fieldErrors.title} />
                </div>

                <div>
                    <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold
                        uppercase tracking-widest text-zinc-400">
                        Description <span className="text-indigo-400">*</span>
                    </label>
                    <textarea
                        rows={4}
                        name="description"
                        value={pollData.description}
                        onChange={handleChange}
                        className={`${fieldClass(fieldErrors.description)} resize-none`}
                    />
                    <div className="mt-1.5 flex items-center justify-between">
                        <ErrorMsg msg={fieldErrors.description} />
                        <span className="ml-auto text-xs text-zinc-600">
                            {pollData.description.length} chars
                        </span>
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold
                        uppercase tracking-widest text-zinc-400">
                        Expiry Date <span className="text-indigo-400">*</span>
                    </label>
                    <input
                        type="datetime-local"
                        name="expiresAt"
                        value={pollData.expiresAt}
                        onChange={handleChange}
                        className={`${fieldClass(fieldErrors.expiresAt)} color-scheme:dark`}
                    />
                    <ErrorMsg msg={fieldErrors.expiresAt} />
                </div>

                <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                        Response Settings
                    </p>
                    <div className="space-y-3">
                        <Toggle
                            name="allowAnonymous"
                            checked={pollData.allowAnonymous}
                            onChange={handleChange}
                            label="Allow Anonymous Responses"
                            description="Anyone can vote without logging in"
                        />
                        <Toggle
                            name="allowAuthenticated"
                            checked={pollData.allowAuthenticated}
                            onChange={handleChange}
                            label="Allow Authenticated Responses"
                            description="Logged-in users can vote"
                        />
                    </div>
                    <ErrorMsg msg={fieldErrors.responseType} />
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-medium
                            text-zinc-400 transition hover:border-zinc-500 hover:text-white"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl
                            bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white
                            shadow-lg shadow-indigo-500/30
                            transition-all duration-200
                            hover:bg-indigo-500 hover:shadow-indigo-500/40
                            disabled:cursor-not-allowed disabled:opacity-50
                            active:scale-[0.98]"
                    >
                        {saving ? (
                            <>
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10"
                                        stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Saving...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                                    <polyline points="17 21 17 13 7 13 7 21" />
                                    <polyline points="7 3 7 8 15 8" />
                                </svg>
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPollPage;