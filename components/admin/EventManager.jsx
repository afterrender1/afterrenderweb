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
    BadgePercent,
    ArrowRight,
    Radio,
    Sparkles,
    Palette,
    ChevronDown,
    Settings2,
    Type,
} from "lucide-react";
import { inputClass, labelClass, primaryBtn, ghostBtn, Snackbar, Modal, api, friendlyError } from "./ui";
import AnnouncementStyleEditor, { BarPreview, ColorField } from "./AnnouncementStyleEditor";
import OfferBadge from "@/components/OfferBadge";
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
    showOffer: false,
    offerText: "20% OFF",
    offerButtonColor: "#FF7A00",
    offerButtonTextColor: "#FFFFFF",
    offerBadgeColor: "#EF4444",
    showHeadlineColors: false,
    headlineFrom: "#48A2FF",
    headlineVia: "#7EC0FF",
    headlineTo: "#C9E4FF",
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
    const headline = event.showHeadlineColors
        ? `linear-gradient(to right, ${event.headlineFrom}, ${event.headlineVia}, ${event.headlineTo})`
        : "linear-gradient(to right, #48A2FF, #7EC0FF, #C9E4FF)";

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
                <span className="flex items-center gap-[3%] w-[48%] h-[5%]">
                    <span className="w-[35%] h-full rounded bg-white/85" />
                    <span className="flex-1 h-full rounded" style={{ background: headline }} />
                </span>
                <span className="w-[32%] h-[4%] rounded bg-white/45" />
                <span
                    className="w-[46%] aspect-video rounded-md mt-[1%] p-[1.5px]"
                    style={{
                        background: announcement
                            ? announcementBackground({ ...event.announcementStyle, bgOpacity: 100 })
                            : "rgba(72,162,255,0.5)",
                    }}
                >
                    <span className="block w-full h-full rounded-[5px] bg-neutral-800" />
                </span>
            </div>
        </div>
    );
};

/* ---------- Editor building blocks ---------- */
const StatusDot = ({ state }) => (
    <span
        className={`w-2 h-2 rounded-full shrink-0 ${
            state === "ready" ? "bg-green-500" : state === "missing" ? "bg-amber-500" : "bg-neutral-300"
        }`}
        title={state === "ready" ? "Ready" : state === "missing" ? "Needs content" : "Off"}
    />
);

// Header of the active tab: title, description, optional on/off switch
const PanelHeader = ({ title, description, enabled, onToggle }) => (
    <div className="flex items-start gap-4 pb-5 mb-6 border-b border-neutral-200">
        <div className="flex-1 min-w-0">
            <h3 className="text-lg text-neutral-900">{title}</h3>
            {description && <p className="text-sm text-neutral-500 mt-1">{description}</p>}
        </div>
        {onToggle && (
            <div className="flex items-center gap-2.5 pt-1 shrink-0">
                <span className={`text-xs font-medium ${enabled ? "text-[#1a73e8]" : "text-neutral-400"}`}>
                    {enabled ? "On" : "Off"}
                </span>
                <Switch checked={enabled} onChange={onToggle} label={`Show ${title}`} />
            </div>
        )}
    </div>
);

const OffNotice = ({ onEnable }) => (
    <div className="flex flex-col items-center text-center py-12 rounded-xl border border-dashed border-neutral-300">
        <p className="text-sm text-neutral-500">This element is turned off and won&apos;t show on the site.</p>
        <button type="button" onClick={onEnable} className={`${ghostBtn} mt-3`}>
            Turn on
        </button>
    </div>
);

// One hanging-image slot inside the Decorations tab
const DecorationSlot = ({ title, enabled, onToggle, value, onChange, onBusyChange }) => (
    <div className={`rounded-xl border p-4 transition-colors ${enabled ? "border-neutral-200" : "border-dashed border-neutral-200 bg-neutral-50"}`}>
        <div className="flex items-center justify-between gap-2 mb-3">
            <p className={`text-sm font-medium ${enabled ? "text-neutral-800" : "text-neutral-400"}`}>{title}</p>
            <Switch checked={enabled} onChange={onToggle} label={`Show ${title}`} />
        </div>
        {enabled ? (
            <ImageUpload value={value} onChange={onChange} onBusyChange={onBusyChange} aspect="aspect-square" contain />
        ) : (
            <div className="aspect-square flex items-center justify-center text-xs text-neutral-400">Hidden</div>
        )}
    </div>
);

const elementState = (enabled, hasContent) => (!enabled ? "off" : hasContent ? "ready" : "missing");

const TABS = [
    { id: "general", label: "General", icon: Settings2 },
    { id: "background", label: "Background", icon: ImageIcon },
    { id: "decorations", label: "Decorations", icon: Sparkles },
    { id: "announcement", label: "Announcement", icon: Megaphone },
    { id: "offer", label: "Offer", icon: BadgePercent },
    { id: "headline", label: "Headline", icon: Type },
];

/* ---------- Add / edit dialog ---------- */
const EventDialog = ({ initial, onClose, onSaved }) => {
    const isEdit = Boolean(initial?._id);
    const [form, setForm] = useState(() => {
        const base = { ...emptyEvent };
        for (const key of Object.keys(emptyEvent)) base[key] = initial?.[key] ?? emptyEvent[key];
        // Events saved before bar styling existed have no style yet
        base.announcementStyle = withStyleDefaults(base.announcementStyle);
        return base;
    });
    const [tab, setTab] = useState("general");
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

    const decorationsState = (() => {
        const parts = [elementState(form.showTopLeft, form.topLeftUrl), elementState(form.showTopRight, form.topRightUrl)];
        if (parts.includes("missing")) return "missing";
        return parts.includes("ready") ? "ready" : "off";
    })();
    const tabState = {
        general: form.name.trim() ? "ready" : "missing",
        background: elementState(form.showBackground, form.backgroundUrl),
        decorations: decorationsState,
        announcement: elementState(form.showAnnouncement, form.announcementText.trim()),
        offer: elementState(form.showOffer, form.offerText.trim()),
        headline: elementState(form.showHeadlineColors, true),
    };
    const missing = Object.values(tabState).filter((s) => s === "missing").length;

    // Returns [tab, message] for the first problem, or null
    const validate = () => {
        if (!form.name.trim()) return ["general", "Give the event a name."];
        if (form.showBackground && !form.backgroundUrl) return ["background", "Upload a hero background or turn it off."];
        if (form.showTopLeft && !form.topLeftUrl) return ["decorations", "Upload the top-left image or turn it off."];
        if (form.showTopRight && !form.topRightUrl) return ["decorations", "Upload the top-right image or turn it off."];
        if (form.showAnnouncement && !form.announcementText.trim()) return ["announcement", "Add announcement text or turn it off."];
        const link = form.announcementLink.trim();
        if (link && !link.startsWith("/") && !/^https?:\/\//i.test(link)) {
            return ["announcement", "Announcement link must start with https:// or / (e.g. /pricing)."];
        }
        if (form.showOffer && !form.offerText.trim()) return ["offer", "Add offer text (e.g. 20% OFF) or turn the offer off."];
        return null;
    };

    const submit = async (e) => {
        e.preventDefault();
        const problem = validate();
        if (problem) {
            setTab(problem[0]);
            setError(problem[1]);
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

    const panels = {
        general: (
            <>
                <PanelHeader title="General" description="Name the event and choose whether it&apos;s live." />
                <div className="space-y-6">
                    <div>
                        <label className={labelClass}>Event name</label>
                        <input
                            type="text"
                            placeholder="Halloween 2026"
                            className={inputClass}
                            value={form.name}
                            onChange={(e) => set("name")(e.target.value)}
                            autoFocus={!isEdit}
                        />
                    </div>

                    <div
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                            form.isActive ? "bg-[#1a73e8]/[0.06] border-[#1a73e8]/30" : "border-neutral-200"
                        }`}
                    >
                        <Radio size={18} className={form.isActive ? "text-[#1a73e8]" : "text-neutral-400"} />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900">Live on website</p>
                            <p className="text-xs text-neutral-500 mt-0.5">Turning this on replaces any other live event.</p>
                        </div>
                        <Switch checked={form.isActive} onChange={set("isActive")} label="Live on website" />
                    </div>

                </div>
            </>
        ),
        background: (
            <>
                <PanelHeader
                    title="Hero background"
                    description="Replaces the default hero background image."
                    enabled={form.showBackground}
                    onToggle={set("showBackground")}
                />
                {form.showBackground ? (
                    <ImageUpload value={form.backgroundUrl} onChange={set("backgroundUrl")} onBusyChange={onBusyChange} />
                ) : (
                    <OffNotice onEnable={() => set("showBackground")(true)} />
                )}
            </>
        ),
        decorations: (
            <>
                <PanelHeader title="Hanging decorations" description="Swing gently from the top corners. Transparent PNGs work best." />
                <div className="grid grid-cols-2 gap-4">
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
            </>
        ),
        announcement: (
            <>
                <PanelHeader
                    title="Announcement bar"
                    description="Scrolling strip under the navbar. The hero video border uses the same color."
                    enabled={form.showAnnouncement}
                    onToggle={set("showAnnouncement")}
                />
                {form.showAnnouncement ? (
                    <div className="space-y-5">
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

                        <div className="rounded-xl border border-neutral-200">
                            <button
                                type="button"
                                onClick={() => setStyleOpen((v) => !v)}
                                aria-expanded={styleOpen}
                                className="w-full flex items-center gap-3 px-4 h-12 text-left cursor-pointer hover:bg-neutral-50 rounded-xl"
                            >
                                <Palette size={16} className="text-neutral-500" />
                                <span className="flex-1 text-sm font-medium text-neutral-800">Colors & style</span>
                                <span
                                    className="w-5 h-5 rounded-full border border-black/10"
                                    style={{ background: announcementBackground({ ...form.announcementStyle, bgOpacity: 100 }) }}
                                />
                                <ChevronDown size={16} className={`text-neutral-500 transition-transform ${styleOpen ? "rotate-180" : ""}`} />
                            </button>
                            {styleOpen && (
                                <div className="px-4 pb-4 pt-4 border-t border-neutral-100">
                                    <AnnouncementStyleEditor value={form.announcementStyle} onChange={set("announcementStyle")} />
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <OffNotice onEnable={() => set("showAnnouncement")(true)} />
                )}
            </>
        ),
        offer: (
            <>
                <PanelHeader
                    title="Offer"
                    description="Shaking “See Plans” button with a badge in the hero, plus the badge and a struck-through price on pricing. Real prices don't change."
                    enabled={form.showOffer}
                    onToggle={set("showOffer")}
                />
                {form.showOffer ? (
                    <div className="space-y-5">
                        <div>
                            <div className="flex items-baseline justify-between mb-1.5">
                                <label className="text-[13px] font-medium text-neutral-700">Badge text</label>
                                <span className="text-[11px] text-neutral-400">{form.offerText.length}/24</span>
                            </div>
                            <input
                                type="text"
                                maxLength={24}
                                placeholder="20% OFF"
                                className={inputClass}
                                value={form.offerText}
                                onChange={(e) => set("offerText")(e.target.value)}
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <ColorField label="Button color" value={form.offerButtonColor} onChange={set("offerButtonColor")} />
                            <ColorField label="Button text" value={form.offerButtonTextColor} onChange={set("offerButtonTextColor")} />
                            <ColorField label="Badge color" value={form.offerBadgeColor} onChange={set("offerBadgeColor")} />
                        </div>

                        <div
                            className="flex items-center justify-center gap-3 pt-9 pb-7 rounded-xl bg-neutral-900 bg-cover bg-center"
                            style={{ backgroundImage: "linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.6)), url('/images/hb1.png')" }}
                        >
                            <span className="px-5 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] text-[#0A2540]">
                                Book a Call
                            </span>
                            <div className="relative animate-offer-shake">
                                <OfferBadge text={form.offerText || "20% OFF"} color={form.offerBadgeColor} />
                                <span
                                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold"
                                    style={{ backgroundColor: form.offerButtonColor, color: form.offerButtonTextColor }}
                                >
                                    See Plans <ArrowRight size={12} />
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <OffNotice onEnable={() => set("showOffer")(true)} />
                )}
            </>
        ),
        headline: (
            <>
                <PanelHeader
                    title="Headline colors"
                    description="Gradient for the changing word after “Unlimited”."
                    enabled={form.showHeadlineColors}
                    onToggle={set("showHeadlineColors")}
                />
                {form.showHeadlineColors ? (
                    <div className="space-y-5">
                        <div className="grid gap-4 sm:grid-cols-3">
                            <ColorField label="From" value={form.headlineFrom} onChange={set("headlineFrom")} />
                            <ColorField label="Via" value={form.headlineVia} onChange={set("headlineVia")} />
                            <ColorField label="To" value={form.headlineTo} onChange={set("headlineTo")} />
                        </div>
                        <div className="flex items-center justify-center py-8 rounded-xl bg-neutral-900">
                            <p className="text-2xl sm:text-3xl font-medium text-white">
                                Unlimited{" "}
                                <span
                                    className="italic font-serif text-transparent bg-clip-text"
                                    style={{
                                        backgroundImage: `linear-gradient(to right, ${form.headlineFrom}, ${form.headlineVia}, ${form.headlineTo})`,
                                    }}
                                >
                                    Video Edits
                                </span>
                            </p>
                        </div>
                    </div>
                ) : (
                    <OffNotice onEnable={() => set("showHeadlineColors")(true)} />
                )}
            </>
        ),
    };

    return (
        <Modal onClose={safeClose} className="w-full sm:max-w-6xl">
            <form
                onSubmit={submit}
                className="w-full h-[94vh] sm:h-[88vh] flex flex-col bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center gap-4 px-6 h-16 border-b border-neutral-200 shrink-0">
                    <h2 className="flex-1 min-w-0 text-lg text-neutral-900 truncate">
                        {isEdit ? `Edit “${initial.name}”` : form.name.trim() ? form.name : "New event"}
                    </h2>
                    {form.isActive && (
                        <span className="hidden sm:inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-[#1a73e8]/10 text-[#1a73e8] text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1a73e8]" /> Live
                        </span>
                    )}
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

                {/* Body: tabs · panel · preview */}
                <div className="flex-1 min-h-0 flex flex-col lg:grid lg:grid-cols-[200px_minmax(0,1fr)_360px]">
                    <nav
                        className="shrink-0 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-y-auto px-3 py-2 lg:py-4 border-b lg:border-b-0 lg:border-r border-neutral-200"
                        aria-label="Event sections"
                    >
                        {TABS.map(({ id, label, icon: Icon }) => {
                            const active = tab === id;
                            return (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setTab(id)}
                                    aria-current={active ? "page" : undefined}
                                    className={`flex items-center gap-3 h-10 px-3 rounded-full lg:rounded-r-full lg:rounded-l-md text-sm whitespace-nowrap transition-colors cursor-pointer ${
                                        active
                                            ? "bg-[#1a73e8]/10 text-[#174ea6] font-medium"
                                            : "text-neutral-700 hover:bg-neutral-100"
                                    }`}
                                >
                                    <Icon size={16} className={active ? "text-[#1a73e8]" : "text-neutral-500"} />
                                    <span className="flex-1 text-left">{label}</span>
                                    <StatusDot state={tabState[id]} />
                                </button>
                            );
                        })}
                    </nav>

                    <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 sm:px-8 py-6">
                        <div className="max-w-2xl">{panels[tab]}</div>
                    </div>

                    <aside className="hidden lg:block overflow-y-auto overscroll-contain bg-neutral-50 border-l border-neutral-200 p-6">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">Preview</p>
                        <HeroPreview event={form} className="rounded-xl shadow-sm ring-1 ring-black/5" />
                        <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
                            Approximate layout. Dots in the menu show what&apos;s{" "}
                            <span className="text-green-600 font-medium">ready</span>,{" "}
                            <span className="text-amber-600 font-medium">needs content</span> or off.
                        </p>
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
                                {missing} {missing === 1 ? "section needs" : "sections need"} content
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
        event.showOffer && `Offer · ${event.offerText}`,
        event.showHeadlineColors && "Headline",
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
