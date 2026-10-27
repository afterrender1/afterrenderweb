"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Loader2,
    AlertCircle,
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
import {
    Skeleton,
    inputClass,
    labelClass,
    primaryBtn,
    secondaryBtn,
    ghostBtn,
    iconBtn,
    iconBtnDanger,
    Snackbar,
    Modal,
    modalPanel,
    ModalHeader,
    EmptyState,
    PageHeader,
    Badge,
    api,
    friendlyError,
} from "./ui";
import { useEvents, setList } from "./hooks";
import ImageUpload from "./ImageUpload";
import AnnouncementStyleEditor, { BarPreview, ColorField } from "./AnnouncementStyleEditor";
import OfferBadge from "@/components/OfferBadge";
import { resolveDiscount } from "@/app/lib/offer";
import AnnouncementTrack, { announcementWrapperStyle } from "@/components/AnnouncementTrack";
import { DEFAULT_ANNOUNCEMENT_STYLE, announcementBackground, withStyleDefaults } from "@/app/lib/announcementStyle";


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
    discountPercent: 20,
    showHeadlineColors: false,
    headlineFrom: "#48A2FF",
    headlineVia: "#7EC0FF",
    headlineTo: "#C9E4FF",
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
            checked ? "bg-stone-900" : "bg-stone-300"
        }`}
    >
        <span
            className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                checked ? "translate-x-[22px]" : "translate-x-0.5"
            }`}
        />
    </button>
);

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
                    <span className="block w-full h-full rounded-[5px] bg-stone-800" />
                </span>
            </div>
        </div>
    );
};

/* ---------- Editor building blocks ---------- */
const StatusDot = ({ state }) => (
    <span
        className={`w-2 h-2 rounded-full shrink-0 ${
            state === "ready" ? "bg-emerald-500" : state === "missing" ? "bg-amber-500" : "bg-stone-300"
        }`}
        title={state === "ready" ? "Ready" : state === "missing" ? "Needs content" : "Off"}
    />
);

// Header of the active tab: title, description, optional on/off switch
const PanelHeader = ({ title, description, enabled, onToggle }) => (
    <div className="flex items-start gap-3 sm:gap-4 pb-4 sm:pb-5 mb-5 sm:mb-6 border-b border-stone-200">
        <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-stone-900">{title}</h3>
            {description && <p className="text-sm text-stone-500 mt-1 break-words">{description}</p>}
        </div>
        {onToggle && (
            <div className="flex items-center gap-2.5 pt-1 shrink-0">
                <span className={`text-xs font-medium ${enabled ? "text-stone-900" : "text-stone-400"}`}>
                    {enabled ? "On" : "Off"}
                </span>
                <Switch checked={enabled} onChange={onToggle} label={`Show ${title}`} />
            </div>
        )}
    </div>
);

const OffNotice = ({ onEnable }) => (
    <div className="flex flex-col items-center text-center px-4 py-10 rounded-lg border border-dashed border-stone-300">
        <p className="text-sm text-stone-500">This element is turned off and won&apos;t show on the site.</p>
        <button type="button" onClick={onEnable} className={`${ghostBtn} mt-3`}>
            Turn on
        </button>
    </div>
);

// One hanging-image slot inside the Decorations tab
const DecorationSlot = ({ title, enabled, onToggle, value, onChange, onBusyChange }) => (
    <div className={`min-w-0 rounded-lg border p-3 sm:p-4 transition-colors ${enabled ? "border-stone-200" : "border-dashed border-stone-200 bg-stone-50"}`}>
        <div className="flex items-center justify-between gap-2 mb-3">
            <p className={`text-sm font-medium ${enabled ? "text-stone-800" : "text-stone-400"}`}>{title}</p>
            <Switch checked={enabled} onChange={onToggle} label={`Show ${title}`} />
        </div>
        {enabled ? (
            <ImageUpload value={value} onChange={onChange} onBusyChange={onBusyChange} aspect="aspect-square" contain />
        ) : (
            <div className="aspect-square flex items-center justify-center text-xs text-stone-400">Hidden</div>
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
        // Same discount the site applies (older events: taken from the badge text)
        if (initial?._id) base.discountPercent = resolveDiscount(initial);
        return base;
    });
    const [tab, setTab] = useState("general");
    const [saving, setSaving] = useState(false);
    const [uploads, setUploads] = useState(0);
    const [error, setError] = useState("");
    const [styleOpen, setStyleOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);

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
        const pct = Number(form.discountPercent);
        if (form.showOffer && (!Number.isInteger(pct) || pct < 0 || pct > 90)) {
            return ["offer", "Discount must be a whole number from 0 to 90."];
        }
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
                body: JSON.stringify({ ...form, discountPercent: Number(form.discountPercent) }),
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
                        className={`flex items-center gap-3 p-3 sm:p-4 rounded-lg border transition-colors ${
                            form.isActive ? "bg-stone-100 border-stone-400" : "border-stone-200"
                        }`}
                    >
                        <Radio size={18} className={form.isActive ? "text-stone-900" : "text-stone-400"} />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-stone-900">Live on website</p>
                            <p className="text-xs text-stone-500 mt-0.5">Turning this on replaces any other live event.</p>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                <label className="text-[13px] font-medium text-stone-700">Message</label>
                                <span className="text-[11px] text-stone-400">{form.announcementText.length}/120</span>
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
                                Link <span className="text-stone-400 font-normal">· optional</span>
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

                        <div className="rounded-lg border border-stone-200">
                            <button
                                type="button"
                                onClick={() => setStyleOpen((v) => !v)}
                                aria-expanded={styleOpen}
                                className="w-full flex items-center gap-3 px-3 sm:px-4 h-12 text-left cursor-pointer hover:bg-stone-50 rounded-lg transition-colors"
                            >
                                <Palette size={16} className="text-stone-500" />
                                <span className="flex-1 text-sm font-medium text-stone-800">Colors & style</span>
                                <span
                                    className="w-5 h-5 rounded-full border border-black/10"
                                    style={{ background: announcementBackground({ ...form.announcementStyle, bgOpacity: 100 }) }}
                                />
                                <ChevronDown size={16} className={`text-stone-500 transition-transform ${styleOpen ? "rotate-180" : ""}`} />
                            </button>
                            {styleOpen && (
                                <div className="px-3 sm:px-4 pb-4 pt-4 border-t border-stone-100">
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
                    description="Shaking “See Plans” button with a badge in the hero, plus the badge and a real discount on the pricing page."
                    enabled={form.showOffer}
                    onToggle={set("showOffer")}
                />
                {form.showOffer ? (
                    <div className="space-y-5">
                        <div>
                            <div className="flex items-baseline justify-between mb-1.5">
                                <label className="text-[13px] font-medium text-stone-700">Badge text</label>
                                <span className="text-[11px] text-stone-400">{form.offerText.length}/24</span>
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

                        <div>
                            <label className={labelClass}>Real discount on pricing</label>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                <div className="relative w-32 shrink-0">
                                    <input
                                        type="number"
                                        min={0}
                                        max={90}
                                        step={1}
                                        inputMode="numeric"
                                        className={`${inputClass} pr-8`}
                                        value={form.discountPercent}
                                        onChange={(e) => set("discountPercent")(e.target.value === "" ? "" : Number(e.target.value))}
                                    />
                                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-stone-500">%</span>
                                </div>
                                <p className="text-xs text-stone-500 flex-1 min-w-[12rem] break-words">
                                    {Number(form.discountPercent) > 0
                                        ? `Pricing shows prices ${form.discountPercent}% lower, original struck through. e.g. USD 399 → USD ${Math.round(399 * (1 - Number(form.discountPercent) / 100))}`
                                        : "0 = badge only, prices unchanged."}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <ColorField label="Button color" value={form.offerButtonColor} onChange={set("offerButtonColor")} />
                            <ColorField label="Button text" value={form.offerButtonTextColor} onChange={set("offerButtonTextColor")} />
                            <ColorField label="Badge color" value={form.offerBadgeColor} onChange={set("offerBadgeColor")} />
                        </div>

                        <div
                            className="flex flex-wrap items-center justify-center gap-3 pt-9 pb-7 px-3 rounded-lg bg-stone-900 bg-cover bg-center overflow-hidden"
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
                        <div className="flex items-center justify-center py-8 px-3 rounded-lg bg-stone-900 text-center">
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
        <Modal onClose={safeClose} className="sm:max-w-6xl">
            <form onSubmit={submit} className={`${modalPanel} h-[92dvh] sm:h-[88dvh]`}>
                <ModalHeader
                    title={isEdit ? `Edit “${initial.name}”` : form.name.trim() ? form.name : "New event"}
                    onClose={safeClose}
                    disabled={busy}
                >
                    {form.isActive && (
                        <Badge variant="success" className="hidden sm:inline-flex">
                            <span className="size-1.5 rounded-full bg-emerald-500" /> Live
                        </Badge>
                    )}
                </ModalHeader>

                {/* Body: tabs · panel · preview */}
                <div className="flex-1 min-h-0 flex flex-col lg:grid lg:grid-cols-[200px_minmax(0,1fr)_340px]">
                    <nav
                        className="shrink-0 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-y-auto snap-x px-3 py-2 lg:py-4 border-b lg:border-b-0 lg:border-r border-stone-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                                    className={`snap-start shrink-0 flex items-center gap-2.5 h-9 px-3 rounded-md text-sm whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20 ${
                                        active
                                            ? "bg-stone-100 text-stone-900 font-medium"
                                            : "text-stone-600 hover:bg-stone-50"
                                    }`}
                                >
                                    <Icon size={16} className={active ? "text-stone-900" : "text-stone-500"} />
                                    <span className="lg:flex-1 text-left">{label}</span>
                                    <StatusDot state={tabState[id]} />
                                </button>
                            );
                        })}
                    </nav>

                    <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-8 py-5 sm:py-6">
                        {/* Below lg the side preview is hidden, so it folds into the top of the panel */}
                        <div className="lg:hidden mb-5 rounded-lg border border-stone-200">
                            <button
                                type="button"
                                onClick={() => setPreviewOpen((v) => !v)}
                                aria-expanded={previewOpen}
                                className="w-full flex items-center gap-2 px-3 h-10 text-sm font-medium text-stone-700 cursor-pointer"
                            >
                                <span className="flex-1 text-left">Preview</span>
                                <ChevronDown size={16} className={`text-stone-500 transition-transform ${previewOpen ? "rotate-180" : ""}`} />
                            </button>
                            {previewOpen && (
                                <div className="px-3 pb-3">
                                    <div className="w-full aspect-video overflow-hidden rounded-md">
                                        <HeroPreview event={form} className="ring-1 ring-black/5" />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="max-w-2xl min-w-0">{panels[tab]}</div>
                    </div>

                    <aside className="hidden lg:block overflow-y-auto overscroll-contain bg-stone-50 border-l border-stone-200 p-5">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-2">Preview</p>
                        <div className="w-full aspect-video overflow-hidden rounded-lg shadow-xs ring-1 ring-black/5">
                            <HeroPreview event={form} />
                        </div>
                        <p className="text-xs text-stone-500 mt-3 leading-relaxed">
                            Approximate layout. Dots in the menu show what&apos;s{" "}
                            <span className="text-emerald-600 font-medium">ready</span>,{" "}
                            <span className="text-amber-600 font-medium">needs content</span> or off.
                        </p>
                    </aside>
                </div>

                {/* Footer: status on its own row on phones, one row from sm up */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 px-4 sm:px-6 py-3 border-t border-stone-200 bg-white shrink-0">
                    <div className="sm:flex-1 min-w-0 text-sm empty:hidden">
                        {error ? (
                            <p className="flex items-start gap-2 text-red-600" role="alert">
                                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                <span className="min-w-0 break-words">{error}</span>
                            </p>
                        ) : uploads > 0 ? (
                            <p className="flex items-center gap-2 text-stone-500">
                                <Loader2 size={14} className="animate-spin" />
                                Waiting for uploads…
                            </p>
                        ) : missing > 0 ? (
                            <p className="text-amber-600 text-xs sm:text-sm">
                                {missing} {missing === 1 ? "section needs" : "sections need"} content
                            </p>
                        ) : null}
                    </div>
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:ml-auto [&>button]:w-full sm:[&>button]:w-auto">
                        <button type="button" onClick={safeClose} disabled={busy} className={ghostBtn}>
                            Cancel
                        </button>
                        <button type="submit" disabled={busy} className={primaryBtn}>
                            {saving && <Loader2 size={16} className="animate-spin" />}
                            {isEdit ? "Save changes" : form.isActive ? "Publish event" : "Save as draft"}
                        </button>
                    </div>
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
            className={`min-w-0 bg-white rounded-lg shadow-xs overflow-hidden border transition-colors hover:border-stone-300 ${
                event.isActive ? "border-stone-900 ring-1 ring-stone-900" : "border-stone-200"
            }`}
        >
            <div className="relative">
                <HeroPreview event={event} />
                {event.isActive && (
                    <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 h-5 px-2 rounded-md bg-stone-900 text-stone-50 text-[11px] font-medium">
                        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live
                    </span>
                )}
            </div>

            <div className="p-3 sm:p-4">
                {confirming ? (
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm text-stone-800 mr-auto min-w-0 break-words">Delete “{event.name}”?</p>
                        <button
                            onClick={() => setConfirming(false)}
                            disabled={deleting}
                            className="h-9 px-3 rounded-md text-xs font-medium text-stone-700 border border-stone-200 hover:bg-stone-50 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md text-xs font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 cursor-pointer"
                        >
                            {deleting && <Loader2 size={12} className="animate-spin" />}
                            Delete
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-start gap-3">
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-stone-900 truncate" title={event.name}>{event.name}</p>
                                <p className="text-xs text-stone-500 mt-0.5">
                                    {event.isActive ? "Showing on the homepage" : "Draft · not visible"}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                {toggling && <Loader2 size={14} className="animate-spin text-stone-400" />}
                                <Switch
                                    checked={event.isActive}
                                    onChange={handleToggle}
                                    disabled={toggling}
                                    label={event.isActive ? "Disable event" : "Enable event"}
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-1 mt-3.5">
                            <div className="flex flex-wrap gap-1.5 flex-1 min-w-0 pt-1.5">
                                {elements.length ? (
                                    elements.map((el) => (
                                        <Badge key={el} className="max-w-full truncate">{el}</Badge>
                                    ))
                                ) : (
                                    <span className="text-[11px] text-stone-400">No elements enabled</span>
                                )}
                            </div>
                            <button onClick={() => onEdit(event)} className={iconBtn} aria-label="Edit" title="Edit">
                                <Pencil size={15} />
                            </button>
                            <button onClick={() => setConfirming(true)} className={`${iconBtnDanger} -mr-1.5`} aria-label="Delete" title="Delete">
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
    const { list: events, isLoading: loading, error, mutate } = useEvents();
    const loadError = error ? friendlyError(error, "Couldn't load events.") : "";
    // null = closed, {} = new, event = editing
    const [editing, setEditing] = useState(null);
    const [toast, setToast] = useState(null);

    const closeToast = useCallback(() => setToast(null), []);
    const closeDialog = useCallback(() => setEditing(null), []);

    // Mirror the server rule locally: one live event at most
    const withEvent = (list, event) => {
        const exists = list.some((e) => e._id === event._id);
        const next = exists ? list.map((e) => (e._id === event._id ? event : e)) : [event, ...list];
        return event.isActive ? next.map((e) => (e._id === event._id ? e : { ...e, isActive: false })) : next;
    };
    const applyEvent = (event) => setList(mutate, "events", (prev) => withEvent(prev, event));

    const handleSaved = (event, isEdit) => {
        applyEvent(event);
        setEditing(null);
        setToast({
            type: "success",
            message: event.isActive ? `“${event.name}” is live` : isEdit ? "Event updated" : "Event saved as draft",
        });
    };

    // Optimistic: the switch flips at once and rolls back if the request fails
    const handleToggleLive = async (event, isActive) => {
        try {
            await mutate(
                api(`/api/events/${event._id}`, { method: "PATCH", body: JSON.stringify({ isActive }) }).then((r) => r.event),
                {
                    optimisticData: (d) => d && { ...d, events: withEvent(d.events || [], { ...event, isActive }) },
                    populateCache: (updated, d) => ({ ...d, events: withEvent(d?.events || [], updated) }),
                    rollbackOnError: true,
                    revalidate: false,
                }
            );
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
            setList(mutate, "events", (prev) => prev.filter((e) => e._id !== event._id));
            setToast({ type: "success", message: "Event deleted" });
            return true;
        } catch (err) {
            setToast({ type: "error", message: friendlyError(err, "Couldn't delete event.") });
            return false;
        }
    };

    const live = events.find((e) => e.isActive);

    return (
        <div>
            <PageHeader
                title="Events"
                description="Seasonal themes for the homepage hero."
                actions={
                    <button onClick={() => setEditing({})} className={primaryBtn}>
                        <Plus size={16} />
                        New event
                    </button>
                }
            />

            {/* Live status */}
            {!loading && !loadError && events.length > 0 && (
                <div
                    className={`flex items-center gap-3 mb-5 px-3 py-2.5 rounded-lg border text-sm ${
                        live ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-stone-100 border-stone-200 text-stone-600"
                    }`}
                >
                    <Radio size={16} className="shrink-0" />
                    {live ? (
                        <span className="min-w-0 break-words">
                            <span className="font-medium">{live.name}</span> is live on the homepage.
                        </span>
                    ) : (
                        <span>No event is live — the default hero theme is showing.</span>
                    )}
                </div>
            )}

            <div>
                {loading ? (
                    <ul className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <li key={i} className="rounded-lg border border-stone-200 bg-white overflow-hidden">
                                <Skeleton className="aspect-video rounded-none" />
                                <div className="p-4 space-y-2">
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-3 w-1/3" />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : loadError ? (
                    <EmptyState
                        icon={AlertCircle}
                        title="Couldn't load events"
                        description={loadError}
                        action={
                            <button onClick={() => mutate()} className={secondaryBtn}>
                                Try again
                            </button>
                        }
                    />
                ) : events.length === 0 ? (
                    <EmptyState
                        icon={PartyPopper}
                        title="No events yet"
                        description="Create a seasonal theme like Halloween — custom background, hanging decorations and an announcement."
                        action={
                            <button onClick={() => setEditing({})} className={primaryBtn}>
                                <Plus size={16} />
                                New event
                            </button>
                        }
                    />
                ) : (
                    <ul className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
