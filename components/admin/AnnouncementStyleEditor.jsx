"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeftRight, Bookmark, Loader2, X, AlertCircle, Check } from "lucide-react";
import { inputClass, labelClass, api, friendlyError } from "./ui";
import AnnouncementTrack, { announcementWrapperStyle } from "@/components/AnnouncementTrack";
import {
    BUILT_IN_PALETTES,
    announcementBackground,
    isValidHex,
    withStyleDefaults,
} from "@/app/lib/announcementStyle";

const sameStyle = (a, b) => JSON.stringify(withStyleDefaults(a)) === JSON.stringify(withStyleDefaults(b));

/* ---------- Color picker: native swatch + editable hex ---------- */
export const ColorField = ({ label, value, onChange }) => {
    // Local draft so half-typed hex values don't get rejected mid-typing
    const [draft, setDraft] = useState(value);
    const [synced, setSynced] = useState(value);
    // Picker or palette changed the color from outside -> show it in the text box
    if (value !== synced) {
        setSynced(value);
        setDraft(value);
    }

    const commit = (raw) => {
        const hex = (raw.startsWith("#") ? raw : `#${raw}`).toUpperCase();
        if (isValidHex(hex)) onChange(hex);
        else setDraft(value);
    };

    return (
        <div>
            <label className={labelClass}>{label}</label>
            <div className="flex items-center h-11 rounded-lg border border-neutral-300 hover:border-neutral-400 focus-within:border-[#1a73e8] focus-within:ring-1 focus-within:ring-[#1a73e8] transition overflow-hidden">
                <label className="relative w-11 h-full shrink-0 border-r border-neutral-200 cursor-pointer">
                    <span className="absolute inset-2 rounded-md border border-black/10" style={{ backgroundColor: value }} />
                    <input
                        type="color"
                        value={value}
                        onChange={(e) => onChange(e.target.value.toUpperCase())}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        aria-label={`${label} picker`}
                    />
                </label>
                <input
                    type="text"
                    value={draft}
                    maxLength={7}
                    spellCheck={false}
                    onChange={(e) => {
                        setDraft(e.target.value);
                        const hex = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`;
                        if (isValidHex(hex)) onChange(hex.toUpperCase());
                    }}
                    onBlur={(e) => commit(e.target.value)}
                    className="flex-1 min-w-0 h-full px-3 text-sm font-mono uppercase text-neutral-900 outline-none bg-white"
                    aria-label={`${label} hex`}
                />
            </div>
        </div>
    );
};

const Slider = ({ label, value, min, max, unit, onChange }) => (
    <div>
        <div className="flex items-center justify-between mb-1.5">
            <label className="text-[13px] font-medium text-neutral-700">{label}</label>
            <span className="text-xs font-mono text-neutral-500">
                {value}
                {unit}
            </span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full accent-[#1a73e8] cursor-pointer"
        />
    </div>
);

/* ---------- Palette chip ---------- */
const PaletteChip = ({ palette, active, onApply, onDelete, deleting }) => (
    <div className="group relative">
        <button
            type="button"
            onClick={() => onApply(palette.style)}
            className={`flex items-center gap-2 h-9 pl-1.5 pr-3 rounded-full border text-xs transition cursor-pointer ${
                active
                    ? "border-[#1a73e8] bg-[#1a73e8]/[0.06] text-[#174ea6] font-medium"
                    : "border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            } ${onDelete ? "pr-7" : ""}`}
            title={`Apply “${palette.name}”`}
        >
            <span
                className="relative w-6 h-6 rounded-full border border-black/10 shrink-0 overflow-hidden flex items-center justify-center"
                style={{ background: announcementBackground({ ...palette.style, bgOpacity: 100 }) }}
            >
                {active ? (
                    <Check size={12} style={{ color: withStyleDefaults(palette.style).textColor }} />
                ) : (
                    <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: withStyleDefaults(palette.style).accentColor }}
                    />
                )}
            </span>
            <span className="max-w-[120px] truncate">{palette.name}</span>
        </button>
        {onDelete && (
            <button
                type="button"
                onClick={() => onDelete(palette)}
                disabled={deleting}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-neutral-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                aria-label={`Delete palette ${palette.name}`}
                title="Delete palette"
            >
                {deleting ? <Loader2 size={11} className="animate-spin" /> : <X size={11} />}
            </button>
        )}
    </div>
);

/* ---------- Real-size bar preview over the default hero background ---------- */
export const BarPreview = ({ text, style }) => (
    <div
        className="rounded-lg overflow-hidden bg-neutral-900 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hb1.png')" }}
    >
        <div
            className="announcement-bar flex h-9 overflow-hidden text-xs sm:text-sm font-medium"
            style={announcementWrapperStyle(style)}
        >
            <AnnouncementTrack text={text || "Your announcement text"} style={style} repeat={4} />
        </div>
        <div className="h-5 bg-black/50" />
    </div>
);

/* ---------- Editor ---------- */
const AnnouncementStyleEditor = ({ value, onChange }) => {
    const style = withStyleDefaults(value);
    const set = (key) => (v) => onChange({ ...style, [key]: v });

    const [palettes, setPalettes] = useState([]);
    const [loadingPalettes, setLoadingPalettes] = useState(true);
    const [paletteError, setPaletteError] = useState("");
    const [naming, setNaming] = useState(false);
    const [paletteName, setPaletteName] = useState("");
    const [savingPalette, setSavingPalette] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        let cancelled = false;
        api("/api/palettes")
            .then((data) => !cancelled && setPalettes(data.palettes))
            .catch((err) => !cancelled && setPaletteError(friendlyError(err, "Couldn't load saved palettes.")))
            .finally(() => !cancelled && setLoadingPalettes(false));
        return () => {
            cancelled = true;
        };
    }, []);

    const savePalette = async () => {
        const name = paletteName.trim();
        if (!name) {
            setPaletteError("Give the palette a name.");
            return;
        }
        if (palettes.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
            setPaletteError(`A palette named “${name}” already exists.`);
            return;
        }
        setSavingPalette(true);
        setPaletteError("");
        try {
            const data = await api("/api/palettes", { method: "POST", body: JSON.stringify({ name, style }) });
            setPalettes((prev) => [data.palette, ...prev]);
            setNaming(false);
            setPaletteName("");
        } catch (err) {
            setPaletteError(friendlyError(err, "Couldn't save palette."));
        } finally {
            setSavingPalette(false);
        }
    };

    const deletePalette = async (palette) => {
        setDeletingId(palette._id);
        setPaletteError("");
        try {
            await api(`/api/palettes/${palette._id}`, { method: "DELETE" });
            setPalettes((prev) => prev.filter((p) => p._id !== palette._id));
        } catch (err) {
            setPaletteError(friendlyError(err, "Couldn't delete palette."));
        } finally {
            setDeletingId(null);
        }
    };

    const alreadySaved = [...BUILT_IN_PALETTES, ...palettes].some((p) => sameStyle(p.style, style));

    return (
        <div className="space-y-5">
            {/* Palettes */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[13px] font-medium text-neutral-700">Palettes</p>
                    {!naming && (
                        <button
                            type="button"
                            onClick={() => {
                                setNaming(true);
                                setPaletteError("");
                            }}
                            disabled={alreadySaved}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1a73e8] hover:underline disabled:text-neutral-400 disabled:no-underline cursor-pointer disabled:cursor-default"
                            title={alreadySaved ? "These colors are already saved" : "Save current colors"}
                        >
                            <Bookmark size={13} />
                            Save current
                        </button>
                    )}
                </div>

                {naming && (
                    <div className="flex items-center gap-2 mb-3">
                        <input
                            type="text"
                            value={paletteName}
                            maxLength={40}
                            autoFocus
                            placeholder="Palette name"
                            onChange={(e) => setPaletteName(e.target.value)}
                            onKeyDown={(e) => {
                                // Don't submit the whole event form
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    savePalette();
                                }
                                if (e.key === "Escape") {
                                    e.stopPropagation();
                                    setNaming(false);
                                }
                            }}
                            className={`${inputClass} h-9`}
                        />
                        <button
                            type="button"
                            onClick={savePalette}
                            disabled={savingPalette}
                            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-xs font-medium bg-[#1a73e8] text-white hover:bg-[#1765cc] disabled:opacity-60 cursor-pointer shrink-0"
                        >
                            {savingPalette && <Loader2 size={12} className="animate-spin" />}
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setNaming(false);
                                setPaletteError("");
                            }}
                            className="h-9 px-3 rounded-full text-xs font-medium text-neutral-600 hover:bg-neutral-100 cursor-pointer shrink-0"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                <div className="flex flex-wrap gap-2">
                    {BUILT_IN_PALETTES.map((p) => (
                        <PaletteChip key={p.name} palette={p} active={sameStyle(p.style, style)} onApply={onChange} />
                    ))}
                    {palettes.map((p) => (
                        <PaletteChip
                            key={p._id}
                            palette={p}
                            active={sameStyle(p.style, style)}
                            onApply={(s) => onChange(withStyleDefaults(s))}
                            onDelete={deletePalette}
                            deleting={deletingId === p._id}
                        />
                    ))}
                    {loadingPalettes && (
                        <span className="inline-flex items-center gap-1.5 h-9 px-2 text-xs text-neutral-400">
                            <Loader2 size={12} className="animate-spin" /> Loading saved…
                        </span>
                    )}
                </div>

                {paletteError && (
                    <p className="flex items-start gap-1.5 mt-2 text-xs text-red-600">
                        <AlertCircle size={13} className="mt-px shrink-0" />
                        {paletteError}
                    </p>
                )}
            </div>

            {/* Colors */}
            <div className="grid gap-4 sm:grid-cols-2">
                <ColorField label="Text color" value={style.textColor} onChange={set("textColor")} />
                <ColorField label="Dot & arrow color" value={style.accentColor} onChange={set("accentColor")} />
            </div>

            <div>
                <label className={labelClass}>Background</label>
                <div className="inline-flex p-1 rounded-full bg-neutral-100">
                    {["solid", "gradient"].map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => set("bgType")(type)}
                            className={`h-8 px-4 rounded-full text-sm capitalize transition cursor-pointer ${
                                style.bgType === type
                                    ? "bg-white text-neutral-900 font-medium shadow-sm"
                                    : "text-neutral-600 hover:text-neutral-900"
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {style.bgType === "solid" ? (
                <div className="sm:w-1/2 sm:pr-2">
                    <ColorField label="Background color" value={style.bgColor} onChange={set("bgColor")} />
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                        <ColorField label="From" value={style.gradientFrom} onChange={set("gradientFrom")} />
                        <button
                            type="button"
                            onClick={() => onChange({ ...style, gradientFrom: style.gradientTo, gradientTo: style.gradientFrom })}
                            className="h-11 w-10 flex items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 cursor-pointer"
                            aria-label="Swap gradient colors"
                            title="Swap"
                        >
                            <ArrowLeftRight size={16} />
                        </button>
                        <ColorField label="To" value={style.gradientTo} onChange={set("gradientTo")} />
                    </div>
                    <Slider label="Angle" value={style.gradientAngle} min={0} max={360} unit="°" onChange={set("gradientAngle")} />
                </div>
            )}

            <Slider label="Background opacity" value={style.bgOpacity} min={0} max={100} unit="%" onChange={set("bgOpacity")} />
        </div>
    );
};

export default AnnouncementStyleEditor;
