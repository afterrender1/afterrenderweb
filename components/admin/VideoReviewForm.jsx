"use client";
import React, { useCallback, useEffect, useState } from "react";

const inputClass =
    "w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#80C1FC] focus:ring-2 focus:ring-[#80C1FC]/30 transition";

const labelClass = "block text-xs font-medium text-neutral-500 mb-1.5";

const emptyForm = { clientName: "", role: "", videoUrl: "", poster: "", fit: "cover" };

const VideoReviewForm = () => {
    const [form, setForm] = useState(emptyForm);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });

    const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const fetchReviews = useCallback(async () => {
        try {
            const res = await fetch("/api/video-reviews");
            const data = await res.json();
            if (data.success) setReviews(data.reviews);
        } catch (err) {
            console.error("Failed to fetch video reviews", err);
        }
    }, []);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: "", message: "" });
        try {
            const res = await fetch("/api/video-reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error);

            setStatus({ type: "success", message: "Video review added!" });
            setForm(emptyForm);
            fetchReviews();
        } catch (err) {
            setStatus({ type: "error", message: err.message || "Something went wrong." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl">
            <h1 className="text-xl font-semibold text-neutral-900 mb-6">Video Reviews</h1>

            {status.message && (
                <p
                    className={`mb-4 px-4 py-3 rounded-xl text-sm border ${
                        status.type === "success"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                    }`}
                >
                    {status.message}
                </p>
            )}

            <form
                onSubmit={submit}
                className={`border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-5 transition-opacity ${
                    loading ? "opacity-50 pointer-events-none" : ""
                }`}
            >
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className={labelClass}>Client Name (optional)</label>
                        <input
                            type="text"
                            placeholder="HANRECCA"
                            className={inputClass}
                            value={form.clientName}
                            onChange={update("clientName")}
                            
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Role</label>
                        <input
                            type="text"
                            placeholder="Marketing Agency"
                            className={inputClass}
                            value={form.role}
                            onChange={update("role")}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className={labelClass}>Video URL</label>
                    <input
                        type="url"
                        placeholder="https://res.cloudinary.com/.../video/upload/....mp4"
                        className={inputClass}
                        value={form.videoUrl}
                        onChange={update("videoUrl")}
                        required
                    />
                </div>

                <div>
                    <label className={labelClass}>Poster URL (optional)</label>
                    <input
                        type="text"
                        placeholder="https://res.cloudinary.com/.../image/upload/....png or /images/..."
                        className={inputClass}
                        value={form.poster}
                        onChange={update("poster")}
                    />
                </div>

                <div className="sm:w-1/2">
                    <label className={labelClass}>Fit</label>
                    <select value={form.fit} onChange={update("fit")} className={`${inputClass} cursor-pointer`}>
                        <option value="cover">Cover</option>
                        <option value="contain">Contain</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 rounded-full text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer"
                >
                    {loading ? "Adding..." : "Add Video Review"}
                </button>
            </form>

            {reviews.length > 0 && (
                <ul className="mt-8 divide-y divide-neutral-200 border border-neutral-200 rounded-2xl overflow-hidden">
                    {reviews.map((review) => (
                        <li key={review._id} className="flex items-center gap-4 px-4 py-3">
                            {review.poster ? (
                                <img src={review.poster} alt="" className="w-9 h-14 rounded-md object-cover bg-neutral-100" />
                            ) : (
                                <div className="w-9 h-14 rounded-md bg-neutral-100" />
                            )}
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-neutral-900 truncate">{review.clientName || review.role}</p>
                                <p className="text-xs text-neutral-500 truncate">{review.role}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default VideoReviewForm;
