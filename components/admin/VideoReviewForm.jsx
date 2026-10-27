"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus, Search, Pencil, Trash2, X, Play, Film, Loader2, AlertCircle } from "lucide-react";

import {
    inputClass,
    labelClass,
    primaryBtn,
    ghostBtn,
    iconBtn,
    iconBtnDanger,
    Snackbar,
    Modal,
    modalPanel,
    ModalHeader,
    ModalBody,
    ModalFooter,
    PageHeader,
    EmptyState,
    Skeleton,
    Badge,
} from "./ui";

const emptyForm = { clientName: "", role: "", videoUrl: "", poster: "", fit: "cover" };

const VideoError = ({ dark }) => (
    <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center ${
            dark ? "bg-stone-900 text-stone-400" : "bg-stone-100 text-stone-400"
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
            className={`relative block w-full bg-stone-100 overflow-hidden ${onOpen && !failed ? "cursor-pointer" : ""} ${className}`}
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
                <div className="w-full h-full flex items-center justify-center text-stone-400">
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
            <div className="bg-stone-950 sm:rounded-xl rounded-t-xl overflow-hidden shadow-xl pb-[env(safe-area-inset-bottom)] sm:pb-0">
                <div className="relative h-[80dvh] max-h-[80dvh] aspect-[9/16] max-w-[calc(100vw-2rem)] sm:max-w-full mx-auto bg-black">
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
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-stone-300">
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
                        className="absolute top-3 right-3 size-9 grid place-items-center rounded-md bg-black/50 text-white hover:bg-black/70 cursor-pointer"
                        aria-label="Close"
                        title="Close"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="px-4 py-3">
                    <p className="text-sm font-medium text-white truncate">{review.clientName || "No name"}</p>
                    <p className="text-xs text-stone-400 truncate">{review.role}</p>
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
    useEffect(() => {
        savingRef.current = saving;
    }, [saving]);
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
            <form onSubmit={submit} className={modalPanel}>
                <ModalHeader title={isEdit ? "Edit video review" : "New video review"} onClose={onClose} disabled={saving} />

                <ModalBody>
                <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_180px]">
                    <div className="space-y-5 min-w-0">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className={labelClass}>
                                    Client name <span className="text-stone-400 font-normal">· optional</span>
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
                                Poster URL <span className="text-stone-400 font-normal">· optional</span>
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
                            <div className="inline-flex p-1 rounded-lg bg-stone-100">
                                {["cover", "contain"].map((fit) => (
                                    <button
                                        key={fit}
                                        type="button"
                                        onClick={() => setForm((prev) => ({ ...prev, fit }))}
                                        className={`h-8 px-3.5 rounded-md text-sm capitalize transition cursor-pointer ${
                                            form.fit === fit
                                                ? "bg-white text-stone-900 font-medium shadow-sm"
                                                : "text-stone-600 hover:text-stone-900"
                                        }`}
                                    >
                                        {fit}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="w-40 sm:w-auto mx-auto sm:mx-0 min-w-0">
                        <p className={labelClass}>Preview</p>
                        <VideoThumb
                            key={form.videoUrl}
                            review={form}
                            className="aspect-[9/16] rounded-lg border border-stone-200"
                        />
                    </div>
                </div>

                {error && (
                    <p className="mt-5 flex items-start gap-2 px-3 py-2.5 rounded-md text-sm bg-red-50 text-red-700 border border-red-200" role="alert">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <span className="min-w-0 break-words">{error}</span>
                    </p>
                )}
                </ModalBody>

                <ModalFooter>
                    <button type="button" onClick={onClose} disabled={saving} className={ghostBtn}>
                        Cancel
                    </button>
                    <button type="submit" disabled={saving} className={primaryBtn}>
                        {saving && <Loader2 size={16} className="animate-spin" />}
                        {isEdit ? "Save changes" : "Add review"}
                    </button>
                </ModalFooter>
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
        <li className="group min-w-0 bg-white border border-stone-200 rounded-lg shadow-xs overflow-hidden hover:border-stone-300 transition-colors">
            <VideoThumb review={review} className="aspect-[9/16]" onOpen={() => onPlay(review)} />

            <div className="p-2.5 sm:p-3">
                {confirming ? (
                    <div className="space-y-2.5">
                        <p className="text-sm text-stone-800">Delete this review?</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setConfirming(false)}
                                disabled={deleting}
                                className="flex-1 h-9 rounded-md text-xs font-medium text-stone-700 border border-stone-200 hover:bg-stone-50 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 h-9 inline-flex items-center justify-center gap-1.5 rounded-md text-xs font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 cursor-pointer"
                            >
                                {deleting && <Loader2 size={12} className="animate-spin" />}
                                Delete
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-start gap-2">
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-stone-900 truncate">
                                {review.clientName || <span className="text-stone-400 font-normal">No name</span>}
                            </p>
                            <p className="text-xs text-stone-500 truncate mt-0.5">{review.role}</p>
                            <Badge className="mt-2 capitalize">{review.fit}</Badge>
                        </div>
                        <div className="flex -mr-1.5 -mt-1 shrink-0">
                            <button onClick={() => onEdit(review)} className={iconBtn} aria-label="Edit" title="Edit">
                                <Pencil size={15} />
                            </button>
                            <button onClick={() => setConfirming(true)} className={iconBtnDanger} aria-label="Delete" title="Delete">
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
        <div>
            <PageHeader
                title="Video Reviews"
                description={
                    loading
                        ? "Loading…"
                        : `${reviews.length} ${reviews.length === 1 ? "review" : "reviews"} · shown in the client testimonials section`
                }
                actions={
                    <button onClick={() => setEditing({})} className={primaryBtn}>
                        <Plus size={16} />
                        New review
                    </button>
                }
            />

            {/* Search */}
            {reviews.length > 0 && (
                <div className="relative w-full sm:max-w-xs">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name or role"
                        aria-label="Search video reviews"
                        className={`${inputClass} pl-9`}
                    />
                </div>
            )}

            {/* Content */}
            <div className="mt-5">
                {loading ? (
                    <ul className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <li key={i} className="rounded-lg border border-stone-200 bg-white overflow-hidden">
                                <Skeleton className="aspect-[9/16] rounded-none" />
                                <div className="p-3 space-y-2">
                                    <Skeleton className="h-3.5 w-2/3" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : reviews.length === 0 ? (
                    <EmptyState
                        icon={Film}
                        title="No video reviews yet"
                        description="Add your first client video to show it on the site."
                        action={
                            <button onClick={() => setEditing({})} className={primaryBtn}>
                                <Plus size={16} />
                                New review
                            </button>
                        }
                    />
                ) : filtered.length === 0 ? (
                    <p className="py-16 text-center text-sm text-stone-500 break-words">
                        No reviews match “{query}”.
                    </p>
                ) : (
                    <ul className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
