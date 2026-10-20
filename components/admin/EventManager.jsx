"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Loader2,
    AlertCircle,
    UploadCloud,
    ImageIcon,
    PartyPopper,
    Megaphone,
    Radio,
    Sparkles,
    Palette,
    ChevronDown,
    CheckCircle2,
    MinusCircle,
} from "lucide-react";
import { inputClass, labelClass, primaryBtn, ghostBtn, Snackbar, Modal, api, friendlyError } from "./ui";
import AnnouncementStyleEditor, { BarPreview } from "./AnnouncementStyleEditor";
import AnnouncementTrack, { announcementWrapperStyle } from "@/components/AnnouncementTrack";
import { DEFAULT_ANNOUNCEMENT_STYLE, announcementBackground, withStyleDefaults } from "@/app/lib/announcementStyle";

const MAX_UPLOAD_MB = 10;

const emptyEvent = {
    name: "",
    isActive: false,
    showBackground: true,
    backgroundUrl: "",
    showTopLeft: true,
    topLeftUrl: "",
    showTopRight: true,
    topRightUrl: "",
    showAnnouncement: true,
    announcementText: "",
    announcementLink: "",
    announcementStyle: DEFAULT_ANNOUNCEMENT_STYLE,
};

// Signed direct upload: the server signs, the browser sends the file straight to Cloudinary
const uploadToCloudinary = async (file, onProgress) => {
    const sig = await api("/api/admin/upload-signature", {
        method: "POST",
        body: JSON.stringify({ folder: "events" }),
    });

    const body = new FormData();
    body.append("file", file);
    body.append("api_key", sig.apiKey);
    body.append("timestamp", sig.timestamp);
    body.append("signature", sig.signature);
    body.append("folder", sig.folder);

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`);
        xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
        xhr.onload = () => {
            let data = null;
            try {
                data = JSON.parse(xhr.responseText);
            } catch {
                /* handled below */
            }
            if (xhr.status >= 200 && xhr.status < 300 && data?.secure_url) resolve(data.secure_url);
            else reject(new Error(data?.error?.message || `Upload failed (${xhr.status})`));
        };
        xhr.onerror = () => reject(new Error("Upload failed — check your connection."));
        xhr.send(body);
    });
};

/* ---------- Switch ---------- */
const Switch = ({ checked, onChange, disabled, label }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            checked ? "bg-[#1a73e8]" : "bg-neutral-300"
        }`}
    >
        <span
            className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                checked ? "translate-x-[22px]" : "translate-x-0.5"
            }`}
        />
    </button>
);

/* ---------- Image upload field ---------- */
const ImageUpload = ({ value, onChange, onBusyChange, aspect = "aspect-video", contain = false }) => {
    const inputRef = useRef(null);
    const [progress, setProgress] = useState(null);
    const [error, setError] = useState("");
    const [dragging, setDragging] = useState(false);
    const [broken, setBroken] = useState(false);

    const handleFile = async (file) => {
        if (!file) return;
        setError("");
        if (!file.type.startsWith("image/")) {
            setError("Please choose an image file (PNG, JPG, WEBP, GIF or SVG).");
            return;
        }
        if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
            setError(`Image is too large — max ${MAX_UPLOAD_MB} MB.`);
            return;
        }

        setProgress(0);
        onBusyChange(true);
        try {
            const url = await uploadToCloudinary(file, setProgress);
            setBroken(false);
            onChange(url);
        } catch (err) {
            setError(friendlyError(err, "Upload failed."));
        } finally {
            setProgress(null);
            onBusyChange(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    const uploading = progress !== null;

    return (
        <div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {value && !uploading ? (
                <div className={`group relative ${aspect} rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50`}>
                    {broken ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-neutral-400 bg-neutral-50">
                            <AlertCircle size={20} />
                            <p className="text-xs">Image couldn&apos;t be loaded</p>
                        </div>
                    ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={value}
                            alt=""
                            onError={() => setBroken(true)}
                            className={`w-full h-full ${contain ? "object-contain" : "object-cover"}`}
                        />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="h-8 px-3.5 rounded-full text-xs font-medium bg-white text-neutral-900 hover:bg-neutral-100 cursor-pointer"
                        >
                            Replace
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onChange("");
                                setBroken(false);
                            }}
                            className="h-8 px-3.5 rounded-full text-xs font-medium bg-white text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    disabled={uploading}
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragging(false);
                        handleFile(e.dataTransfer.files?.[0]);
                    }}
                    className={`${aspect} w-full flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm transition cursor-pointer disabled:cursor-wait ${
                        dragging
                            ? "border-[#1a73e8] bg-[#1a73e8]/[0.04] text-[#1a73e8]"
                            : "border-neutral-300 text-neutral-500 hover:border-neutral-400 hover:bg-neutral-50"
                    }`}
                >
                    {uploading ? (
                        <>
                            <Loader2 size={20} className="animate-spin text-[#1a73e8]" />
                            <span className="text-xs text-neutral-600">Uploading… {progress}%</span>
                            <span className="w-2/3 max-w-[160px] h-1 rounded-full bg-neutral-200 overflow-hidden">
                                <span className="block h-full bg-[#1a73e8] transition-all" style={{ width: `${progress}%` }} />
                            </span>
                        </>
                    ) : (
                        <>
                            <UploadCloud size={20} />
                            <span className="text-xs">
                                <span className="text-[#1a73e8] font-medium">Upload</span> or drag & drop
                            </span>
                        </>
                    )}
                </button>
            )}

            {error && (
                <p className="flex items-start gap-1.5 mt-2 text-xs text-red-600">
                    <AlertCircle size={13} className="mt-px shrink-0" />
                    {error}
                </p>
            )}
        </div>
    );
};

/* ---------- Mini hero preview ---------- */
const HeroPreview = ({ event, className = "" }) => {
    const bg = event.showBackground && event.backgroundUrl;
    const left = event.showTopLeft && event.topLeftUrl;
    const right = event.showTopRight && event.topRightUrl;
    const announcement = event.showAnnouncement && event.announcementText;

    return (
        <div
            className={`relative aspect-video overflow-hidden bg-black bg-center bg-no-repeat ${bg ? "bg-cover" : "bg-contain"} ${className}`}
            style={{ backgroundImage: bg ? `url(${JSON.stringify(bg)})` : "url('/images/hb1.png')" }}
        >
            <div className="absolute inset-0 bg-black/60" />
            {/* eslint-disable @next/next/no-img-element */}
            {left && <img src={left} alt="" className={`absolute ${announcement ? "top-[15%]" : "top-[8%]"} left-[2%] w-[18%] h-auto`} />}
            {right && <img src={right} alt="" className={`absolute ${announcement ? "top-[15%]" : "top-[8%]"} right-[2%] w-[18%] h-auto`} />}
            {/* eslint-enable @next/next/no-img-element */}

            {/* navbar strip */}
            <div className="absolute top-0 inset-x-0 h-[8%] flex items-center justify-between px-[4%]">
                <span className="w-[14%] h-[30%] rounded-sm bg-white/70" />
                <span className="w-[20%] h-[22%] rounded-sm bg-white/25" />
            </div>

            {announcement && (
                <div
                    className="announcement-bar absolute top-[8%] inset-x-0 h-[7%] flex items-center overflow-hidden border-y border-white/10 text-[8px] sm:text-[9px] leading-none"
                    style={announcementWrapperStyle(event.announcementStyle)}
                >
                    <AnnouncementTrack text={event.announcementText} style={event.announcementStyle} repeat={4} compact />
                </div>
            )}

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-[3%] pt-[10%]">
                <span className="w-[44%] h-[5%] rounded bg-white/85" />
                <span className="w-[32%] h-[4%] rounded bg-white/45" />
                <span className="w-[46%] aspect-video rounded-md border border-[#48A2FF]/50 bg-white/10 mt-[1%]" />
            </div>
        </div>
    );
};

/* ---------- Editor building blocks ---------- */
const Section = ({ icon: Icon, title, description, enabled, onToggle, children }) => {
    const toggleable = typeof onToggle === "function";
    const open = !toggleable || enabled;

    return (
        <section className="rounded-xl border border-neutral-200 bg-white">
            <header className="flex items-center gap-3 px-5 py-4">
                {Icon && (
                    <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            open ? "bg-[#1a73e8]/10 text-[#1a73e8]" : "bg-neutral-100 text-neutral-400"
                        }`}
                    >
                        <Icon size={16} />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <h3 className={`text-[15px] font-medium ${open ? "text-neutral-900" : "text-neutral-500"}`}>{title}</h3>
                    {description && <p className="text-xs text-neutral-500 mt-0.5">{description}</p>}
                </div>
                {toggleable && <Switch checked={enabled} onChange={onToggle} label={`Show ${title}`} />}
            </header>
            {open && children && <div className="px-5 pb-5">{children}</div>}
        </section>
    );
};

// One hanging-image slot inside the "Hanging decorations" section
const DecorationSlot = ({ title, enabled, onToggle, value, onChange, onBusyChange }) => (
    <div className={`rounded-lg border p-3 transition-colors ${enabled ? "border-neutral-200" : "border-dashed border-neutral-200 bg-neutral-50"}`}>
        <div className="flex items-center justify-between gap-2 mb-3">
            <p className={`text-[13px] font-medium ${enabled ? "text-neutral-800" : "text-neutral-400"}`}>{title}</p>
            <Switch checked={enabled} onChange={onToggle} label={`Show ${title}`} />
        </div>
        {enabled ? (
            <ImageUpload value={value} onChange={onChange} onBusyChange={onBusyChange} aspect="aspect-square" contain />
        ) : (
            <div className="aspect-square flex items-center justify-center text-xs text-neutral-400">Hidden</div>
        )}
    </div>
);

// Readiness line in the preview pane
const StatusRow = ({ label, state }) => {
    const map = {
        ready: { text: "Ready", className: "text-green-700", Icon: CheckCircle2 },
        missing: { text: "Needs content", className: "text-amber-600", Icon: AlertCircle },
        off: { text: "Off", className: "text-neutral-400", Icon: MinusCircle },
    };
    const { text, className, Icon } = map[state];
    return (
        <li className="flex items-center justify-between py-2 text-sm">
            <span className={state === "off" ? "text-neutral-400" : "text-neutral-700"}>{label}</span>
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${className}`}>
                <Icon size={14} />
                {text}
            </span>
        </li>
    );
};

const elementState = (enabled, hasContent) => (!enabled ? "off" : hasContent ? "ready" : "missing");

/* ---------- Add / edit dialog ---------- */
const EventDialog = ({ initial, onClose, onSaved }) => {
    const isEdit = Boolean(initial?._id);
    const [form, setForm] = useState(() => {
        const base = { ...emptyEvent };
        if (isEdit) for (const key of Object.keys(emptyEvent)) base[key] = initial[key] ?? emptyEvent[key];
        // Events saved before bar styling existed have no style yet
        base.announcementStyle = withStyleDefaults(base.announcementStyle);
        return base;
    });
    const [saving, setSaving] = useState(false);
    const [uploads, setUploads] = useState(0);
    const [error, setError] = useState("");
    const [styleOpen, setStyleOpen] = useState(false);

    const set = (field) => (value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setError("");
    };
    const onBusyChange = useCallback((busy) => setUploads((n) => n + (busy ? 1 : -1)), []);

    const busyRef = useRef(false);
    useEffect(() => {
        busyRef.current = saving || uploads > 0;
    }, [saving, uploads]);
    const safeClose = useCallback(() => {
        if (!busyRef.current) onClose();
    }, [onClose]);

    const validate = () => {
        if (!form.name.trim()) return "Give the event a name.";
        if (form.showBackground && !form.backgroundUrl) return "Upload a hero background or turn it off.";
        if (form.showTopLeft && !form.topLeftUrl) return "Upload the top-left image or turn it off.";
        if (form.showTopRight && !form.topRightUrl) return "Upload the top-right image or turn it off.";
        if (form.showAnnouncement && !form.announcementText.trim()) return "Add announcement text or turn it off.";
        const link = form.announcementLink.trim();
        if (link && !link.startsWith("/") && !/^https?:\/\//i.test(link)) {
            return "Announcement link must start with https:// or / (e.g. /pricing).";
        }
        return "";
    };

    const submit = async (e) => {
        e.preventDefault();
        const problem = validate();
        if (problem) {
            setError(problem);
            return;
        }
        setSaving(true);
        setError("");
        try {
            const data = await api(isEdit ? `/api/events/${initial._id}` : "/api/events", {
                method: isEdit ? "PATCH" : "POST",
                body: JSON.stringify(form),
            });
            onSaved(data.event, isEdit);
        } catch (err) {
            setError(friendlyError(err));
            setSaving(false);
        }
    };

    const busy = saving || uploads > 0;
    const statuses = [
        ["Hero background", elementState(form.showBackground, form.backgroundUrl)],
        ["Top left image", elementState(form.showTopLeft, form.topLeftUrl)],
        ["Top right image", elementState(form.showTopRight, form.topRightUrl)],
        ["Announcement bar", elementState(form.showAnnouncement, form.announcementText.trim())],
    ];
    const missing = statuses.filter(([, s]) => s === "missing").length;

    const preview = (
        <div className="space-y-5">
            <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">Preview</p>
                <HeroPreview event={form} className="rounded-xl shadow-sm ring-1 ring-black/5" />
            </div>

            <div className="rounded-xl bg-white border border-neutral-200 px-4 py-2">
                <ul className="divide-y divide-neutral-100">
                    {statuses.map(([label, state]) => (
                        <StatusRow key={label} label={label} state={state} />
                    ))}
                </ul>
            </div>

            <div
                className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                    form.isActive ? "bg-[#1a73e8]/[0.06] border-[#1a73e8]/30" : "bg-white border-neutral-200"
                }`}
            >
                <Radio size={18} className={form.isActive ? "text-[#1a73e8]" : "text-neutral-400"} />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900">Live on website</p>
                    <p className="text-xs text-neutral-500 mt-0.5">Replaces any other live event.</p>
                </div>
                <Switch checked={form.isActive} onChange={set("isActive")} label="Live on website" />
            </div>
        </div>
    );

    return (
        <Modal onClose={safeClose} className="w-full sm:max-w-6xl">
            <form
                onSubmit={submit}
                className="w-full h-[94vh] sm:h-[88vh] flex flex-col bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center gap-4 px-6 h-16 border-b border-neutral-200 shrink-0">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg text-neutral-900 truncate">
                            {isEdit ? `Edit “${initial.name}”` : "New event"}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={safeClose}
                        disabled={busy}
                        className="p-2 -mr-2 rounded-full text-neutral-500 hover:bg-neutral-100 cursor-pointer disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body: form and preview scroll independently */}
                <div className="flex-1 min-h-0 grid lg:grid-cols-[minmax(0,1fr)_400px]">
                    <div className="overflow-y-auto overscroll-contain bg-neutral-50 px-4 sm:px-6 py-6">
                        <div className="max-w-2xl mx-auto space-y-4">
                            <div className="lg:hidden">{preview}</div>

                            <Section title="Details">
                                <label className={labelClass}>Event name</label>
                                <input
                                    type="text"
                                    placeholder="Halloween 2026"
                                    className={inputClass}
                                    value={form.name}
                                    onChange={(e) => set("name")(e.target.value)}
                                    autoFocus={!isEdit}
                                />
                            </Section>

                            <Section
                                icon={ImageIcon}
                                title="Hero background"
                                description="Replaces the default hero background image."
                                enabled={form.showBackground}
                                onToggle={set("showBackground")}
                            >
                                <ImageUpload value={form.backgroundUrl} onChange={set("backgroundUrl")} onBusyChange={onBusyChange} />
                            </Section>

                            <Section
                                icon={Sparkles}
                                title="Hanging decorations"
                                description="Swing gently from the top corners. Transparent PNGs work best."
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    <DecorationSlot
                                        title="Top left"
                                        enabled={form.showTopLeft}
                                        onToggle={set("showTopLeft")}
                                        value={form.topLeftUrl}
                                        onChange={set("topLeftUrl")}
                                        onBusyChange={onBusyChange}
                                    />
                                    <DecorationSlot
                                        title="Top right"
                                        enabled={form.showTopRight}
                                        onToggle={set("showTopRight")}
                                        value={form.topRightUrl}
                                        onChange={set("topRightUrl")}
                                        onBusyChange={onBusyChange}
                                    />
                                </div>
                            </Section>

                            <Section
                                icon={Megaphone}
                                title="Announcement bar"
                                description="Scrolling strip under the navbar."
                                enabled={form.showAnnouncement}
                                onToggle={set("showAnnouncement")}
                            >
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-baseline justify-between mb-1.5">
                                            <label className="text-[13px] font-medium text-neutral-700">Message</label>
                                            <span className="text-[11px] text-neutral-400">{form.announcementText.length}/120</span>
                                        </div>
                                        <input
                                            type="text"
                                            maxLength={120}
                                            placeholder="🎃 Halloween offer — 20% off your first month"
                                            className={inputClass}
                                            value={form.announcementText}
                                            onChange={(e) => set("announcementText")(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>
                                            Link <span className="text-neutral-400 font-normal">· optional</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="/pricing or https://…"
                                            className={inputClass}
                                            value={form.announcementLink}
                                            onChange={(e) => set("announcementLink")(e.target.value)}
                                        />
                                    </div>

                                    <BarPreview text={form.announcementText} style={form.announcementStyle} />

                                    <div className="rounded-lg border border-neutral-200">
                                        <button
                                            type="button"
                                            onClick={() => setStyleOpen((v) => !v)}
                                            aria-expanded={styleOpen}
                                            className="w-full flex items-center gap-3 px-4 h-12 text-left cursor-pointer hover:bg-neutral-50 rounded-lg"
                                        >
                                            <Palette size={16} className="text-neutral-500" />
                                            <span className="flex-1 text-sm font-medium text-neutral-800">Colors & style</span>
                                            <span
                                                className="w-5 h-5 rounded-full border border-black/10"
                                                style={{ background: announcementBackground({ ...form.announcementStyle, bgOpacity: 100 }) }}
                                            />
                                            <ChevronDown
                                                size={16}
                                                className={`text-neutral-500 transition-transform ${styleOpen ? "rotate-180" : ""}`}
                                            />
                                        </button>
                                        {styleOpen && (
                                            <div className="px-4 pb-4 pt-1 border-t border-neutral-100">
                                                <div className="pt-4">
                                                    <AnnouncementStyleEditor
                                                        value={form.announcementStyle}
                                                        onChange={set("announcementStyle")}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Section>
                        </div>
                    </div>

                    <aside className="hidden lg:block overflow-y-auto overscroll-contain border-l border-neutral-200 p-6">
                        {preview}
                    </aside>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 px-6 py-3.5 border-t border-neutral-200 bg-white shrink-0">
                    <div className="flex-1 min-w-0 text-sm">
                        {error ? (
                            <p className="flex items-start gap-2 text-red-600">
                                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </p>
                        ) : uploads > 0 ? (
                            <p className="flex items-center gap-2 text-neutral-500">
                                <Loader2 size={14} className="animate-spin" />
                                Waiting for uploads…
                            </p>
                        ) : missing > 0 ? (
                            <p className="text-amber-600 text-xs sm:text-sm">
                                {missing} {missing === 1 ? "element needs" : "elements need"} content
                            </p>
                        ) : null}
                    </div>
                    <button type="button" onClick={safeClose} disabled={busy} className={ghostBtn}>
                        Cancel
                    </button>
                    <button type="submit" disabled={busy} className={primaryBtn}>
                        {saving && <Loader2 size={16} className="animate-spin" />}
                        {isEdit ? "Save changes" : form.isActive ? "Publish event" : "Save as draft"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

/* ---------- Event card ---------- */
const EventCard = ({ event, onEdit, onDelete, onToggleLive }) => {
    const [confirming, setConfirming] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [toggling, setToggling] = useState(false);

    const elements = [
        event.showBackground && "Background",
        event.showTopLeft && "Top left",
        event.showTopRight && "Top right",
        event.showAnnouncement && "Announcement",
    ].filter(Boolean);

    const handleDelete = async () => {
        setDeleting(true);
        const ok = await onDelete(event);
        if (!ok) {
            setDeleting(false);
            setConfirming(false);
        }
    };

    const handleToggle = async (value) => {
        setToggling(true);
        await onToggleLive(event, value);
        setToggling(false);
    };

    return (
        <li
            className={`bg-white rounded-xl overflow-hidden border transition-shadow hover:shadow-[0_1px_3px_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] ${
                event.isActive ? "border-[#1a73e8] ring-1 ring-[#1a73e8]" : "border-neutral-200"
            }`}
        >
            <div className="relative">
                <HeroPreview event={event} />
                {event.isActive && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-[#1a73e8] text-white text-[11px] font-medium shadow">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        Live
                    </span>
                )}
            </div>

            <div className="p-4">
                {confirming ? (
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm text-neutral-800 mr-auto">Delete “{event.name}”?</p>
                        <button
                            onClick={() => setConfirming(false)}
                            disabled={deleting}
                            className="h-8 px-4 rounded-full text-xs font-medium text-neutral-700 border border-neutral-300 hover:bg-neutral-50 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="h-8 px-4 inline-flex items-center gap-1.5 rounded-full text-xs font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 cursor-pointer"
                        >
                            {deleting && <Loader2 size={12} className="animate-spin" />}
                            Delete
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-start gap-3">
                            <div className="min-w-0 flex-1">
                                <p className="text-[15px] font-medium text-neutral-900 truncate">{event.name}</p>
                                <p className="text-xs text-neutral-500 mt-0.5">
                                    {event.isActive ? "Showing on the homepage" : "Draft · not visible"}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                {toggling && <Loader2 size={14} className="animate-spin text-neutral-400" />}
                                <Switch
                                    checked={event.isActive}
                                    onChange={handleToggle}
                                    disabled={toggling}
                                    label={event.isActive ? "Disable event" : "Enable event"}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                            <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
                                {elements.length ? (
                                    elements.map((el) => (
                                        <span key={el} className="px-2 py-0.5 rounded text-[11px] bg-neutral-100 text-neutral-600">
                                            {el}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-[11px] text-neutral-400">No elements enabled</span>
                                )}
                            </div>
                            <button
                                onClick={() => onEdit(event)}
                                className="p-2 rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 cursor-pointer"
                                aria-label="Edit"
                                title="Edit"
                            >
                                <Pencil size={15} />
                            </button>
                            <button
                                onClick={() => setConfirming(true)}
                                className="p-2 -mr-2 rounded-full text-neutral-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                aria-label="Delete"
                                title="Delete"
                            >
                                <Trash2 size={15} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </li>
    );
};

/* ---------- Page ---------- */
const EventManager = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    // null = closed, {} = new, event = editing
    const [editing, setEditing] = useState(null);
    const [toast, setToast] = useState(null);

    const closeToast = useCallback(() => setToast(null), []);
    const closeDialog = useCallback(() => setEditing(null), []);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setLoadError("");
        try {
            const data = await api("/api/events");
            setEvents(data.events);
        } catch (err) {
            setLoadError(friendlyError(err, "Couldn't load events."));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // Mirror the server rule locally: one live event at most
    const applyEvent = (event) =>
        setEvents((prev) => {
            const exists = prev.some((e) => e._id === event._id);
            const next = exists ? prev.map((e) => (e._id === event._id ? event : e)) : [event, ...prev];
            return event.isActive ? next.map((e) => (e._id === event._id ? e : { ...e, isActive: false })) : next;
        });

    const handleSaved = (event, isEdit) => {
        applyEvent(event);
        setEditing(null);
        setToast({
            type: "success",
            message: event.isActive ? `“${event.name}” is live` : isEdit ? "Event updated" : "Event saved as draft",
        });
    };

    const handleToggleLive = async (event, isActive) => {
        try {
            const data = await api(`/api/events/${event._id}`, {
                method: "PATCH",
                body: JSON.stringify({ isActive }),
            });
            applyEvent(data.event);
            setToast({
                type: "success",
                message: isActive ? `“${event.name}” is live` : "Event disabled — default hero is showing",
            });
        } catch (err) {
            setToast({ type: "error", message: friendlyError(err, "Couldn't update event.") });
        }
    };

    const handleDelete = async (event) => {
        try {
            await api(`/api/events/${event._id}`, { method: "DELETE" });
            setEvents((prev) => prev.filter((e) => e._id !== event._id));
            setToast({ type: "success", message: "Event deleted" });
            return true;
        } catch (err) {
            setToast({ type: "error", message: friendlyError(err, "Couldn't delete event.") });
            return false;
        }
    };

    const live = events.find((e) => e.isActive);

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b border-neutral-200">
                <div>
                    <h1 className="text-2xl font-normal text-neutral-900">Events</h1>
                    <p className="text-sm text-neutral-500 mt-1">Seasonal themes for the homepage hero.</p>
                </div>
                <button onClick={() => setEditing({})} className={`${primaryBtn} self-start sm:self-auto`}>
                    <Plus size={18} />
                    New event
                </button>
            </div>

            {/* Live status */}
            {!loading && !loadError && events.length > 0 && (
                <div
                    className={`flex items-center gap-3 mt-6 px-4 py-3 rounded-xl text-sm ${
                        live ? "bg-[#1a73e8]/[0.06] text-[#174ea6]" : "bg-neutral-100 text-neutral-600"
                    }`}
                >
                    <Radio size={16} className="shrink-0" />
                    {live ? (
                        <span>
                            <span className="font-medium">{live.name}</span> is live on the homepage.
                        </span>
                    ) : (
                        <span>No event is live — the default hero theme is showing.</span>
                    )}
                </div>
            )}

            <div className="mt-6">
                {loading ? (
                    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <li key={i} className="rounded-xl border border-neutral-200 overflow-hidden">
                                <div className="aspect-video bg-neutral-100 animate-pulse" />
                                <div className="p-4 space-y-2">
                                    <div className="h-4 w-1/2 rounded bg-neutral-100 animate-pulse" />
                                    <div className="h-3 w-1/3 rounded bg-neutral-100 animate-pulse" />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : loadError ? (
                    <div className="flex flex-col items-center text-center py-20">
                        <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
                            <AlertCircle size={24} />
                        </div>
                        <p className="text-base text-neutral-900">Couldn&apos;t load events</p>
                        <p className="text-sm text-neutral-500 mt-1 mb-6">{loadError}</p>
                        <button onClick={fetchEvents} className={ghostBtn}>
                            Try again
                        </button>
                    </div>
                ) : events.length === 0 ? (
                    <div className="flex flex-col items-center text-center py-20">
                        <div className="w-14 h-14 rounded-full bg-[#1a73e8]/10 text-[#1a73e8] flex items-center justify-center mb-4">
                            <PartyPopper size={24} />
                        </div>
                        <p className="text-base text-neutral-900">No events yet</p>
                        <p className="text-sm text-neutral-500 mt-1 mb-6 max-w-sm">
                            Create a seasonal theme like Halloween — custom background, hanging decorations and an
                            announcement.
                        </p>
                        <button onClick={() => setEditing({})} className={primaryBtn}>
                            <Plus size={18} />
                            New event
                        </button>
                    </div>
                ) : (
                    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <EventCard
                                key={event._id}
                                event={event}
                                onEdit={setEditing}
                                onDelete={handleDelete}
                                onToggleLive={handleToggleLive}
                            />
                        ))}
                    </ul>
                )}
            </div>

            {editing && <EventDialog initial={editing} onClose={closeDialog} onSaved={handleSaved} />}
            <Snackbar toast={toast} onClose={closeToast} />
        </div>
    );
};

export default EventManager;
