"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus, Search, Pencil, Trash2, X, Play, Film, Loader2, AlertCircle } from "lucide-react";

const inputClass =
    "w-full h-11 bg-white border border-neutral-300 rounded-lg px-3.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none hover:border-neutral-400 focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition";

const labelClass = "block text-[13px] font-medium text-neutral-700 mb-1.5";

const primaryBtn =
    "inline-flex items-center justify-center gap-2 h-10 px-5 rounded-full text-sm font-medium bg-[#1a73e8] text-white hover:bg-[#1765cc] hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer";

const ghostBtn =
    "inline-flex items-center justify-center gap-2 h-10 px-5 rounded-full text-sm font-medium text-[#1a73e8] hover:bg-[#1a73e8]/[0.06] transition cursor-pointer";

const emptyForm = { clientName: "", role: "", videoUrl: "", poster: "", fit: "cover" };

/* ---------- Snackbar ---------- */
const Snackbar = ({ toast, onClose }) => {
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [toast, onClose]);

    if (!toast) return null;
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-[60] flex items-center gap-4 pl-4 pr-2 py-2.5 rounded-lg bg-neutral-900 text-white text-sm shadow-lg">
            <span className={toast.type === "error" ? "text-red-300" : ""}>{toast.message}</span>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 cursor-pointer" aria-label="Dismiss">
                <X size={14} />
            </button>
        </div>
    );
};

/* ---------- Modal shell: blurred backdrop + page scroll lock ---------- */
const Modal = ({ onClose, children, className = "" }) => {
    useEffect(() => {
        const { body, documentElement } = document;
        const prevOverflow = body.style.overflow;
        const prevPadding = body.style.paddingRight;
        // Keep layout from jumping when the scrollbar disappears
        const scrollbar = window.innerWidth - documentElement.clientWidth;
        body.style.overflow = "hidden";
        if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => {
            body.style.overflow = prevOverflow;
            body.style.paddingRight = prevPadding;
            window.removeEventListener("keydown", onKey);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6">
            <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-md" onClick={onClose} />
            <div className={`relative ${className}`}>{children}</div>
        </div>
    );
};

const VideoError = ({ dark }) => (
    <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center ${
            dark ? "bg-neutral-900 text-neutral-400" : "bg-neutral-100 text-neutral-400"
        }`}
    >
        <AlertCircle size={22} />
        <p className="text-xs">Video unavailable</p>
    </div>
);

// Media fragment makes the browser show the frame at 0.1s instead of a black first frame
const withStartFrame = (url) => (url && !url.includes("#") ? `${url}#t=0.1` : url);

/* ---------- Video thumbnail ---------- */
const VideoThumb = ({ review, className = "", onOpen }) => {
    const ref = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [failed, setFailed] = useState(false);

    const play = () => {
        if (failed) return;
        ref.current?.play().then(() => setPlaying(true)).catch(() => {});
    };
    const stop = () => {
        const video = ref.current;
        if (!video) return;
        video.pause();
        setPlaying(false);
        if (review.poster) {
            // A video that has played won't show its poster again until reloaded
            video.load();
        } else {
            video.currentTime = 0.1;
        }
    };

    const Wrapper = onOpen ? "button" : "div";

    return (
        <Wrapper
            type={onOpen ? "button" : undefined}
            onClick={onOpen && !failed ? onOpen : undefined}
            className={`relative block w-full bg-neutral-100 overflow-hidden ${onOpen && !failed ? "cursor-pointer" : ""} ${className}`}
            onMouseEnter={play}
            onMouseLeave={stop}
            aria-label={onOpen ? "Play video" : undefined}
        >
            {review.videoUrl ? (
                <video
                    ref={ref}
                    src={withStartFrame(review.videoUrl)}
                    poster={review.poster || undefined}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onError={() => setFailed(true)}
                    className={`w-full h-full ${review.fit === "contain" ? "object-contain bg-black" : "object-cover"}`}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                    <Film size={28} />
                </div>
            )}
            {failed && <VideoError />}
            {review.videoUrl && !playing && !failed && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="w-10 h-10 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center">
                        <Play size={16} className="text-white ml-0.5" fill="currentColor" />
                    </span>
                </div>
            )}
        </Wrapper>
    );
};

/* ---------- Video player popup ---------- */
const VideoPlayerDialog = ({ review, onClose }) => {
    const [failed, setFailed] = useState(false);
    const [buffering, setBuffering] = useState(true);

    return (
        <Modal onClose={onClose} className="w-full sm:w-auto">
            <div className="bg-neutral-950 sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl">
                <div className="relative h-[80vh] sm:h-[78vh] aspect-[9/16] max-w-full mx-auto bg-black">
                    {!failed && (
                        <video
                            src={review.videoUrl}
                            poster={review.poster || undefined}
                            controls
                            autoPlay
                            playsInline
                            onWaiting={() => setBuffering(true)}
                            onCanPlay={() => setBuffering(false)}
                            onPlaying={() => setBuffering(false)}
                            onError={() => {
                                setFailed(true);
                                setBuffering(false);
                            }}
                            className={`w-full h-full ${review.fit === "contain" ? "object-contain" : "object-cover"}`}
                        />
                    )}
                    {buffering && !failed && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Loader2 size={28} className="text-white/80 animate-spin" />
                        </div>
                    )}
                    {failed && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-neutral-300">
                            <AlertCircle size={28} />
                            <p className="text-sm">This video couldn&apos;t be loaded.</p>
                            <a
                                href={review.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#8ab4f8] hover:underline break-all"
                            >
                                Open video URL
                            </a>
                        </div>
                    )}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 cursor-pointer"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="px-4 py-3">
                    <p className="text-sm font-medium text-white truncate">{review.clientName || "No name"}</p>
                    <p className="text-xs text-neutral-400 truncate">{review.role}</p>
                </div>
            </div>
        </Modal>
    );
};

/* ---------- Add / edit dialog ---------- */
const ReviewDialog = ({ initial, onClose, onSaved }) => {
    const isEdit = Boolean(initial?._id);
    const [form, setForm] = useState(() =>
        isEdit
            ? {
                  clientName: initial.clientName || "",
                  role: initial.role || "",
                  videoUrl: initial.videoUrl || "",
                  poster: initial.poster || "",
                  fit: initial.fit || "cover",
              }
            : emptyForm
    );
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const savingRef = useRef(false);
    savingRef.current = saving;
    // Stable so the modal's scroll lock isn't torn down on every keystroke
    const safeClose = useCallback(() => {
        if (!savingRef.current) onClose();
    }, [onClose]);

    const submit = async (e) => {
        e.preventDefault();
        if (!form.role.trim() || !form.videoUrl.trim()) {
            setError("Role and video URL are required.");
            return;
        }
        setSaving(true);
        setError("");
        try {
            const res = await fetch(isEdit ? `/api/video-reviews/${initial._id}` : "/api/video-reviews", {
                method: isEdit ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            let data;
            try {
                data = await res.json();
            } catch {
                throw new Error(`Server error (${res.status})`);
            }
            if (res.status === 401) throw new Error("Session expired — please log in again.");
            if (!res.ok || !data.success) throw new Error(data.error || `Request failed (${res.status})`);
            onSaved(data.review, isEdit);
        } catch (err) {
            setError(err.message === "Failed to fetch" ? "Network error — check your connection." : err.message || "Something went wrong.");
            setSaving(false);
        }
    };

    return (
        <Modal onClose={safeClose} className="w-full sm:max-w-3xl">
            <form
                onSubmit={submit}
                className="w-full max-h-[92vh] overflow-y-auto overscroll-contain bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl"
            >
                <div className="flex items-center justify-between px-6 pt-5 pb-4">
                    <h2 className="text-lg font-normal text-neutral-900">
                        {isEdit ? "Edit video review" : "New video review"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="p-2 -mr-2 rounded-full text-neutral-500 hover:bg-neutral-100 cursor-pointer"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-6 pb-2 grid gap-6 sm:grid-cols-[1fr_180px]">
                    <div className="space-y-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className={labelClass}>
                                    Client name <span className="text-neutral-400 font-normal">· optional</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="HANRECCA"
                                    className={inputClass}
                                    value={form.clientName}
                                    onChange={update("clientName")}
                                    autoFocus
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
                            <label className={labelClass}>
                                Poster URL <span className="text-neutral-400 font-normal">· optional</span>
                            </label>
                            <input
                                type="text"
                                placeholder="https://res.cloudinary.com/.../image/upload/....png or /images/..."
                                className={inputClass}
                                value={form.poster}
                                onChange={update("poster")}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Video fit</label>
                            <div className="inline-flex p-1 rounded-full bg-neutral-100">
                                {["cover", "contain"].map((fit) => (
                                    <button
                                        key={fit}
                                        type="button"
                                        onClick={() => setForm((prev) => ({ ...prev, fit }))}
                                        className={`h-8 px-4 rounded-full text-sm capitalize transition cursor-pointer ${
                                            form.fit === fit
                                                ? "bg-white text-neutral-900 font-medium shadow-sm"
                                                : "text-neutral-600 hover:text-neutral-900"
                                        }`}
                                    >
                                        {fit}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className={labelClass}>Preview</p>
                        <VideoThumb
                            key={form.videoUrl}
                            review={form}
                            className="aspect-[9/16] rounded-xl border border-neutral-200"
                        />
                    </div>
                </div>

                {error && (
                    <p className="mx-6 mt-4 px-4 py-3 rounded-lg text-sm bg-red-50 text-red-700">{error}</p>
                )}

                <div className="flex justify-end gap-2 px-6 py-5">
                    <button type="button" onClick={onClose} disabled={saving} className={ghostBtn}>
                        Cancel
                    </button>
                    <button type="submit" disabled={saving} className={primaryBtn}>
                        {saving && <Loader2 size={16} className="animate-spin" />}
                        {isEdit ? "Save changes" : "Add review"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

/* ---------- Review card ---------- */
const ReviewCard = ({ review, onEdit, onDelete, onPlay }) => {
    const [confirming, setConfirming] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        const ok = await onDelete(review);
        if (!ok) {
            setDeleting(false);
            setConfirming(false);
        }
    };

    return (
        <li className="group bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-[0_1px_3px_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] transition-shadow">
            <VideoThumb review={review} className="aspect-[9/16]" onOpen={() => onPlay(review)} />

            <div className="p-3">
                {confirming ? (
                    <div className="space-y-2.5">
                        <p className="text-sm text-neutral-800">Delete this review?</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setConfirming(false)}
                                disabled={deleting}
                                className="flex-1 h-8 rounded-full text-xs font-medium text-neutral-700 border border-neutral-300 hover:bg-neutral-50 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 h-8 inline-flex items-center justify-center gap-1.5 rounded-full text-xs font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 cursor-pointer"
                            >
                                {deleting && <Loader2 size={12} className="animate-spin" />}
                                Delete
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-start gap-2">
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-neutral-900 truncate">
                                {review.clientName || <span className="text-neutral-400 font-normal">No name</span>}
                            </p>
                            <p className="text-xs text-neutral-500 truncate mt-0.5">{review.role}</p>
                            <span className="inline-block mt-2 px-2 py-0.5 rounded text-[11px] capitalize bg-neutral-100 text-neutral-600">
                                {review.fit}
                            </span>
                        </div>
                        <div className="flex -mr-1 -mt-1 shrink-0">
                            <button
                                onClick={() => onEdit(review)}
                                className="p-2 rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 cursor-pointer"
                                aria-label="Edit"
                                title="Edit"
                            >
                                <Pencil size={15} />
                            </button>
                            <button
                                onClick={() => setConfirming(true)}
                                className="p-2 rounded-full text-neutral-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                aria-label="Delete"
                                title="Delete"
                            >
                                <Trash2 size={15} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </li>
    );
};

/* ---------- Page ---------- */
const VideoReviewForm = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    // null = closed, {} = new, review = editing
    const [editing, setEditing] = useState(null);
    const [toast, setToast] = useState(null);
    const [playing, setPlaying] = useState(null);

    const closeToast = useCallback(() => setToast(null), []);
    const closeDialog = useCallback(() => setEditing(null), []);
    const closePlayer = useCallback(() => setPlaying(null), []);

    const fetchReviews = useCallback(async () => {
        try {
            const res = await fetch("/api/video-reviews");
            const data = await res.json();
            if (!data.success) throw new Error(data.error);
            setReviews(data.reviews);
        } catch (err) {
            console.error("Failed to fetch video reviews", err);
            setToast({ type: "error", message: "Couldn't load video reviews." });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleSaved = (review, isEdit) => {
        setReviews((prev) => (isEdit ? prev.map((r) => (r._id === review._id ? review : r)) : [review, ...prev]));
        setEditing(null);
        setToast({ type: "success", message: isEdit ? "Review updated" : "Review added" });
    };

    const handleDelete = async (review) => {
        try {
            const res = await fetch(`/api/video-reviews/${review._id}`, { method: "DELETE" });
            const data = await res.json().catch(() => ({}));
            if (res.status === 401) throw new Error("Session expired — please log in again.");
            if (!res.ok || !data.success) throw new Error(data.error || `Delete failed (${res.status})`);
            setReviews((prev) => prev.filter((r) => r._id !== review._id));
            setToast({ type: "success", message: "Review deleted" });
            return true;
        } catch (err) {
            setToast({
                type: "error",
                message:
                    err.message === "Failed to fetch"
                        ? "Network error — check your connection."
                        : err.message || "Couldn't delete review.",
            });
            return false;
        }
    };

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return reviews;
        return reviews.filter(
            (r) => r.clientName?.toLowerCase().includes(q) || r.role?.toLowerCase().includes(q)
        );
    }, [reviews, query]);

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b border-neutral-200">
                <div>
                    <h1 className="text-2xl font-normal text-neutral-900">Video Reviews</h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        {loading
                            ? "Loading…"
                            : `${reviews.length} ${reviews.length === 1 ? "review" : "reviews"} · shown in the client testimonials section`}
                    </p>
                </div>
                <button onClick={() => setEditing({})} className={`${primaryBtn} self-start sm:self-auto`}>
                    <Plus size={18} />
                    New review
                </button>
            </div>

            {/* Search */}
            {reviews.length > 0 && (
                <div className="relative mt-6 max-w-md">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name or role"
                        className="w-full h-11 pl-11 pr-4 rounded-full bg-neutral-100 text-sm text-neutral-900 placeholder-neutral-500 outline-none border border-transparent focus:bg-white focus:border-neutral-200 focus:shadow-[0_1px_6px_rgba(32,33,36,0.18)] transition"
                    />
                </div>
            )}

            {/* Content */}
            <div className="mt-6">
                {loading ? (
                    <ul className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <li key={i} className="rounded-xl border border-neutral-200 overflow-hidden">
                                <div className="aspect-[9/16] bg-neutral-100 animate-pulse" />
                                <div className="p-3 space-y-2">
                                    <div className="h-3.5 w-2/3 rounded bg-neutral-100 animate-pulse" />
                                    <div className="h-3 w-1/2 rounded bg-neutral-100 animate-pulse" />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : reviews.length === 0 ? (
                    <div className="flex flex-col items-center text-center py-20">
                        <div className="w-14 h-14 rounded-full bg-[#1a73e8]/10 text-[#1a73e8] flex items-center justify-center mb-4">
                            <Film size={24} />
                        </div>
                        <p className="text-base text-neutral-900">No video reviews yet</p>
                        <p className="text-sm text-neutral-500 mt-1 mb-6">Add your first client video to show it on the site.</p>
                        <button onClick={() => setEditing({})} className={primaryBtn}>
                            <Plus size={18} />
                            New review
                        </button>
                    </div>
                ) : filtered.length === 0 ? (
                    <p className="py-16 text-center text-sm text-neutral-500">
                        No reviews match “{query}”.
                    </p>
                ) : (
                    <ul className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {filtered.map((review) => (
                            <ReviewCard
                                key={review._id}
                                review={review}
                                onEdit={setEditing}
                                onDelete={handleDelete}
                                onPlay={setPlaying}
                            />
                        ))}
                    </ul>
                )}
            </div>

            {playing && <VideoPlayerDialog review={playing} onClose={closePlayer} />}
            {editing && <ReviewDialog initial={editing} onClose={closeDialog} onSaved={handleSaved} />}
            <Snackbar toast={toast} onClose={closeToast} />
        </div>
    );
};

export default VideoReviewForm;
