"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { Plus, Search, Pencil, Trash2, X, Play, Film, Loader2, AlertCircle, UploadCloud, Crop, ImagePlus } from "lucide-react";
import { uploadFileToCloudinary } from "./ImageUpload";
import { isCloudinaryVideo, stripVideoCrop, withVideoCrop, cropTransform } from "./videoCrop";

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
    api,
    friendlyError,
    EmptyState,
    Skeleton,
    Badge,
} from "./ui";
import { useVideoReviews, setList } from "./hooks";

// Only loaded when a file is picked
const VideoCropModal = dynamic(() => import("./VideoCropModal"), { ssr: false });
const ImageCropModal = dynamic(() => import("./ImageCropModal"), { ssr: false });

const emptyForm = { clientName: "", role: "", videoUrl: "", poster: "", fit: "cover" };

const UPLOAD_FOLDER = "video-reviews";
const MAX_VIDEO_MB = 100;
const MAX_POSTER_MB = 10;
const VIDEO_EXT = /\.(mp4|mov|webm|m4v)$/i;
// Formats every browser plays; anything else is delivered as MP4 by Cloudinary
const WEB_VIDEO_FORMATS = ["mp4", "webm"];

const POSTER_ASPECTS = [
    { label: "9:16", value: 9 / 16, site: true },
    { label: "4:5", value: 4 / 5 },
    { label: "1:1", value: 1 },
    { label: "16:9", value: 16 / 9 },
    { label: "Original", value: "original" },
];

const smallBtn =
    "inline-flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-md text-xs font-medium border transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20";
const smallBtnNeutral = `${smallBtn} bg-white border-stone-200 text-stone-700 hover:bg-stone-50`;
const smallBtnDanger = `${smallBtn} bg-white border-stone-200 text-red-600 hover:bg-red-50 hover:border-red-200`;

const FieldError = ({ children }) =>
    children ? (
        <p className="flex items-start gap-1.5 mt-2 text-xs text-red-600" role="alert">
            <AlertCircle size={13} className="mt-px shrink-0" />
            <span className="min-w-0 break-words">{children}</span>
        </p>
    ) : null;

const UploadProgress = ({ progress, label }) => (
    <div className="flex flex-col items-center justify-center gap-2 h-full">
        <Loader2 size={20} className="animate-spin text-stone-900" />
        <span className="text-xs text-stone-600">
            {label}… {progress}%
        </span>
        <span className="w-3/4 max-w-xs h-1 rounded-full bg-stone-200 overflow-hidden">
            <span className="block h-full bg-stone-900 transition-all" style={{ width: `${progress}%` }} />
        </span>
    </div>
);

// Dropzone shared by the video and poster fields
const DropZone = ({ onPick, onFile, icon: Icon, title, hint, className = "" }) => {
    const [dragging, setDragging] = useState(false);
    return (
        <button
            type="button"
            onClick={onPick}
            onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                onFile(e.dataTransfer.files?.[0]);
            }}
            className={`w-full flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed px-3 text-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20 ${
                dragging ? "border-stone-900 bg-stone-100" : "border-stone-300 hover:border-stone-400 hover:bg-stone-50"
            } ${className}`}
        >
            <Icon size={20} className="text-stone-400" />
            <span className="text-xs">
                <span className="text-stone-900 font-medium">{title}</span> <span className="text-stone-500">or drag & drop</span>
            </span>
            <span className="text-[11px] text-stone-400">{hint}</span>
        </button>
    );
};

/* ---------- Video field: upload + crop (crop is a Cloudinary URL transformation) ---------- */
const VideoField = ({ value, onChange, onBusyChange }) => {
    const inputRef = useRef(null);
    const [progress, setProgress] = useState(null);
    const [error, setError] = useState("");
    // { file, url } of a picked file waiting for the crop step
    const [pending, setPending] = useState(null);
    // "new" = cropping a freshly picked file, "edit" = re-cropping the current Cloudinary video
    const [cropMode, setCropMode] = useState(null);

    const pendingUrlRef = useRef(null);
    useEffect(() => {
        pendingUrlRef.current = pending?.url || null;
    }, [pending]);
    useEffect(() => () => pendingUrlRef.current && URL.revokeObjectURL(pendingUrlRef.current), []);

    const uploading = progress !== null;
    const canRecrop = isCloudinaryVideo(value) && !uploading;

    const clearPending = () => {
        if (pending) URL.revokeObjectURL(pending.url);
        setPending(null);
    };

    const handleFile = (file) => {
        if (inputRef.current) inputRef.current.value = "";
        if (!file) return;
        setError("");
        if (!file.type.startsWith("video/") && !VIDEO_EXT.test(file.name)) {
            setError("Please choose a video file (MP4, MOV or WEBM).");
            return;
        }
        if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
            setError(`Video is too large — max ${MAX_VIDEO_MB} MB.`);
            return;
        }
        if (pending) URL.revokeObjectURL(pending.url);
        setPending({ file, url: URL.createObjectURL(file) });
        setCropMode("new");
    };

    const upload = async (file, crop) => {
        const isWebFormat = file.type === "video/mp4" || file.type === "video/webm";
        // Ask Cloudinary to prepare the cropped version right away (only when it keeps the same format)
        const eager = crop && isWebFormat ? cropTransform(crop.area, crop.width, crop.height) || undefined : undefined;

        setProgress(0);
        onBusyChange(true);
        try {
            const data = await uploadFileToCloudinary(file, { onProgress: setProgress, folder: UPLOAD_FOLDER, resourceType: "video", eager });
            let url = data.secure_url;
            const format = String(data.format || "").toLowerCase();
            if (format && !WEB_VIDEO_FORMATS.includes(format) && url.toLowerCase().endsWith(`.${format}`)) {
                url = `${url.slice(0, -format.length)}mp4`;
            }
            // Cloudinary's stored size is the source of truth (it applies phone rotation metadata)
            const width = data.width > 0 ? data.width : crop?.width;
            const height = data.height > 0 ? data.height : crop?.height;
            onChange(crop ? withVideoCrop(url, cropTransform(crop.area, width, height)) : url);
        } catch (err) {
            setError(friendlyError(err, "Upload failed."));
        } finally {
            setProgress(null);
            onBusyChange(false);
        }
    };

    const applyCrop = (crop) => {
        const mode = cropMode;
        setCropMode(null);
        if (mode === "new") {
            const file = pending?.file;
            clearPending();
            if (file) upload(file, crop);
        } else {
            onChange(withVideoCrop(value, cropTransform(crop.area, crop.width, crop.height)));
        }
    };

    const skipCrop = () => {
        const mode = cropMode;
        setCropMode(null);
        if (mode === "new") {
            const file = pending?.file;
            clearPending();
            if (file) upload(file, null);
        } else {
            onChange(stripVideoCrop(value));
        }
    };

    const cancelCrop = () => {
        if (cropMode === "new") clearPending();
        setCropMode(null);
    };

    const cropSrc = cropMode === "new" ? pending?.url : cropMode === "edit" ? stripVideoCrop(value) : null;

    return (
        <div className="min-w-0">
            <input
                ref={inputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm,video/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {uploading ? (
                <div className="h-28 rounded-lg border border-stone-200 bg-stone-50">
                    <UploadProgress progress={progress} label="Uploading video" />
                </div>
            ) : value ? (
                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 p-2.5">
                    <Film size={16} className="text-stone-400 shrink-0" />
                    <span className="flex-1 min-w-0 text-xs text-stone-600 truncate" title={value}>
                        {value.split("/").pop()}
                    </span>
                    <div className="flex items-center gap-1.5">
                        {canRecrop && (
                            <button type="button" onClick={() => setCropMode("edit")} className={smallBtnNeutral}>
                                <Crop size={13} />
                                Crop
                            </button>
                        )}
                        <button type="button" onClick={() => inputRef.current?.click()} className={smallBtnNeutral}>
                            Replace
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onChange("");
                                setError("");
                            }}
                            className={smallBtnDanger}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ) : (
                <DropZone
                    onPick={() => inputRef.current?.click()}
                    onFile={handleFile}
                    icon={UploadCloud}
                    title="Upload video"
                    hint={`MP4, MOV or WEBM · max ${MAX_VIDEO_MB} MB`}
                    className="h-28"
                />
            )}

            <FieldError>{error}</FieldError>

            {cropSrc &&
                createPortal(
                    <VideoCropModal
                        key={cropSrc}
                        src={cropSrc}
                        title={cropMode === "new" ? "Crop video" : "Re-crop video"}
                        applyLabel={cropMode === "new" ? "Crop & upload" : "Apply crop"}
                        skipLabel={cropMode === "new" ? "Upload full video" : "Remove crop"}
                        onApply={applyCrop}
                        onSkip={skipCrop}
                        onCancel={cancelCrop}
                    />,
                    document.body
                )}
        </div>
    );
};

/* ---------- Poster field: upload + crop (cropped in the browser, like blog covers) ---------- */
const PosterField = ({ value, onChange, onBusyChange }) => {
    const inputRef = useRef(null);
    const [progress, setProgress] = useState(null);
    const [error, setError] = useState("");
    const [broken, setBroken] = useState(false);
    // Picked file waits in `pending` until the crop is applied; `source` keeps the original for re-cropping
    const [pending, setPending] = useState(null);
    const [source, setSource] = useState(null);
    const [cropMode, setCropMode] = useState(null);

    const urlsRef = useRef({ pending: null, source: null });
    useEffect(() => {
        urlsRef.current = { pending, source };
    }, [pending, source]);
    useEffect(
        () => () => {
            const { pending: p, source: s } = urlsRef.current;
            if (p) URL.revokeObjectURL(p);
            if (s) URL.revokeObjectURL(s);
        },
        []
    );

    const uploading = progress !== null;

    const handleFile = (file) => {
        if (inputRef.current) inputRef.current.value = "";
        if (!file) return;
        setError("");
        if (!file.type.startsWith("image/")) {
            setError("Please choose an image file (JPG, PNG, WEBP or GIF).");
            return;
        }
        if (file.size > MAX_POSTER_MB * 1024 * 1024) {
            setError(`Image is too large — max ${MAX_POSTER_MB} MB.`);
            return;
        }
        if (pending) URL.revokeObjectURL(pending);
        setPending(URL.createObjectURL(file));
        setCropMode("new");
    };

    const applyCrop = async (dataUrl) => {
        const mode = cropMode;
        setCropMode(null);
        let nextSource = source;
        if (mode === "new") {
            if (source) URL.revokeObjectURL(source);
            nextSource = pending;
            setSource(pending);
            setPending(null);
        }

        setError("");
        setProgress(0);
        onBusyChange(true);
        try {
            const blob = await (await fetch(dataUrl)).blob();
            const data = await uploadFileToCloudinary(blob, { onProgress: setProgress, folder: UPLOAD_FOLDER });
            setBroken(false);
            onChange(data.secure_url);
        } catch (err) {
            setError(friendlyError(err, "Upload failed."));
            // A failed new upload leaves nothing to re-crop against the current poster
            if (mode === "new" && nextSource) {
                URL.revokeObjectURL(nextSource);
                setSource(null);
            }
        } finally {
            setProgress(null);
            onBusyChange(false);
        }
    };

    const cancelCrop = () => {
        if (cropMode === "new" && pending) URL.revokeObjectURL(pending);
        if (cropMode === "new") setPending(null);
        setCropMode(null);
    };

    const remove = () => {
        if (source) URL.revokeObjectURL(source);
        setSource(null);
        setBroken(false);
        setError("");
        onChange("");
    };

    const cropSrc = cropMode === "new" ? pending : cropMode === "edit" ? source : null;

    return (
        <div className="min-w-0">
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />

            {uploading ? (
                <div className="h-28 rounded-lg border border-stone-200 bg-stone-50">
                    <UploadProgress progress={progress} label="Uploading poster" />
                </div>
            ) : value ? (
                <div className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 p-2.5">
                    <div className="relative w-12 aspect-[9/16] shrink-0 rounded overflow-hidden bg-stone-200">
                        {broken ? (
                            <div className="absolute inset-0 grid place-items-center text-stone-400">
                                <AlertCircle size={14} />
                            </div>
                        ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={value} alt="Poster" onError={() => setBroken(true)} className="w-full h-full object-cover" />
                        )}
                    </div>
                    <div className="flex flex-1 min-w-0 flex-wrap items-center justify-end gap-1.5">
                        {source && (
                            <button type="button" onClick={() => setCropMode("edit")} className={smallBtnNeutral}>
                                <Crop size={13} />
                                Crop
                            </button>
                        )}
                        <button type="button" onClick={() => inputRef.current?.click()} className={smallBtnNeutral}>
                            Replace
                        </button>
                        <button type="button" onClick={remove} className={smallBtnDanger}>
                            Remove
                        </button>
                    </div>
                </div>
            ) : (
                <DropZone
                    onPick={() => inputRef.current?.click()}
                    onFile={handleFile}
                    icon={ImagePlus}
                    title="Upload poster"
                    hint={`JPG, PNG or WEBP · max ${MAX_POSTER_MB} MB`}
                    className="h-28"
                />
            )}

            <FieldError>{error}</FieldError>

            {cropSrc &&
                createPortal(
                    <ImageCropModal
                        key={cropSrc}
                        src={cropSrc}
                        title={cropMode === "new" ? "Crop poster" : "Re-crop poster"}
                        aspects={POSTER_ASPECTS}
                        hint="Drag to position · scroll or pinch to zoom. Posters show at 9:16 on the site."
                        onApply={applyCrop}
                        onCancel={cancelCrop}
                    />,
                    document.body
                )}
        </div>
    );
};

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
    // Video and poster can upload at the same time, so count them
    const [uploads, setUploads] = useState(0);
    const uploading = uploads > 0;
    const busy = saving || uploading;

    const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
    const setField = useCallback((field) => (value) => setForm((prev) => ({ ...prev, [field]: value })), []);
    const setVideoUrl = useMemo(() => setField("videoUrl"), [setField]);
    const setPoster = useMemo(() => setField("poster"), [setField]);
    const onBusyChange = useCallback((on) => setUploads((n) => Math.max(0, n + (on ? 1 : -1))), []);

    const busyRef = useRef(false);
    useEffect(() => {
        busyRef.current = busy;
    }, [busy]);
    // Stable so the modal's scroll lock isn't torn down on every keystroke
    const safeClose = useCallback(() => {
        if (!busyRef.current) onClose();
    }, [onClose]);

    const submit = async (e) => {
        e.preventDefault();
        if (uploading) return;
        if (!form.role.trim()) {
            setError("Role is required.");
            return;
        }
        if (!form.videoUrl.trim()) {
            setError("Upload a video or paste its URL.");
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
                <ModalHeader title={isEdit ? "Edit video review" : "New video review"} onClose={safeClose} disabled={busy} />

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
                            <p className={labelClass}>Video</p>
                            <VideoField value={form.videoUrl} onChange={setVideoUrl} onBusyChange={onBusyChange} />
                            <input
                                type="url"
                                aria-label="Video URL"
                                placeholder="…or paste a video URL"
                                className={`${inputClass} mt-2`}
                                value={form.videoUrl}
                                onChange={update("videoUrl")}
                                disabled={uploading}
                            />
                        </div>

                        <div>
                            <p className={labelClass}>
                                Poster <span className="text-stone-400 font-normal">· optional</span>
                            </p>
                            <PosterField value={form.poster} onChange={setPoster} onBusyChange={onBusyChange} />
                            <input
                                type="text"
                                aria-label="Poster URL"
                                placeholder="…or paste an image URL (or /images/...)"
                                className={`${inputClass} mt-2`}
                                value={form.poster}
                                onChange={update("poster")}
                                disabled={uploading}
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
                    <button type="button" onClick={safeClose} disabled={busy} className={ghostBtn}>
                        Cancel
                    </button>
                    <button type="submit" disabled={busy} className={primaryBtn}>
                        {busy && <Loader2 size={16} className="animate-spin" />}
                        {uploading ? "Uploading…" : isEdit ? "Save changes" : "Add review"}
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
    const [toast, setToast] = useState(null);
    const { list: reviews, isLoading: loading, mutate } = useVideoReviews({
        onError: () => setToast({ type: "error", message: "Couldn't load video reviews." }),
    });
    const [query, setQuery] = useState("");
    // null = closed, {} = new, review = editing
    const [editing, setEditing] = useState(null);
    const [playing, setPlaying] = useState(null);

    const closeToast = useCallback(() => setToast(null), []);
    const closeDialog = useCallback(() => setEditing(null), []);
    const closePlayer = useCallback(() => setPlaying(null), []);

    // Cached by SWR: revisits show the list instantly and revalidate in the background
    const handleSaved = (review, isEdit) => {
        setList(mutate, "reviews", (prev) => (isEdit ? prev.map((r) => (r._id === review._id ? review : r)) : [review, ...prev]));
        setEditing(null);
        setToast({ type: "success", message: isEdit ? "Review updated" : "Review added" });
    };

    const handleDelete = async (review) => {
        try {
            await api(`/api/video-reviews/${review._id}`, { method: "DELETE" });
            setList(mutate, "reviews", (prev) => prev.filter((r) => r._id !== review._id));
            setToast({ type: "success", message: "Review deleted" });
            return true;
        } catch (err) {
            setToast({ type: "error", message: friendlyError(err, "Couldn't delete review.") });
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
