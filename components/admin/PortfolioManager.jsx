"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    X,
    Loader2,
    Globe,
    ExternalLink,
    AlertCircle,
    ChevronUp,
    ChevronDown,
    Layers,
} from "lucide-react";

import { inputClass, labelClass, primaryBtn, ghostBtn, Snackbar, Modal, api, friendlyError } from "./ui";
import ImageUpload from "./ImageUpload";
import { cloudinaryImage } from "@/app/lib/cloudinaryUrl";

// Keep in sync with the limits in app/lib/portfolio.js (not imported: that file loads the DB)
const MAX_TABS = 12;
const MAX_TAB_IMAGES = 2;

const emptyForm = { name: "", url: "", image: "", tabs: [] };

const textareaClass = inputClass.replace("h-11", "min-h-[110px] py-2.5 resize-y leading-relaxed");

// Local-only keys so tab editors keep their state (and in-flight uploads) when tabs move
let tabKeySeq = 0;
const newTab = (tab = {}) => ({
    key: `tab-${++tabKeySeq}`,
    title: tab.title || "",
    images: Array.from({ length: MAX_TAB_IMAGES }, (_, i) => tab.images?.[i] || ""),
    description: tab.description || "",
});

/* ---------- One "Read about" tab ---------- */
const TabEditor = ({ tab, index, total, onChange, onImage, onMove, onRemove, onBusyChange }) => (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-4">
        <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-neutral-500">Tab {index + 1}</span>
            <div className="ml-auto flex items-center">
                <button
                    type="button"
                    onClick={() => onMove(-1)}
                    disabled={index === 0}
                    className="p-1.5 rounded-full text-neutral-500 hover:bg-neutral-200/70 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-default"
                    aria-label="Move tab up"
                    title="Move up"
                >
                    <ChevronUp size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => onMove(1)}
                    disabled={index === total - 1}
                    className="p-1.5 rounded-full text-neutral-500 hover:bg-neutral-200/70 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-default"
                    aria-label="Move tab down"
                    title="Move down"
                >
                    <ChevronDown size={16} />
                </button>
                <button
                    type="button"
                    onClick={onRemove}
                    className="p-1.5 rounded-full text-neutral-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                    aria-label="Delete tab"
                    title="Delete tab"
                >
                    <Trash2 size={15} />
                </button>
            </div>
        </div>

        <label className={labelClass}>Tab title</label>
        <input
            type="text"
            placeholder="The challenge"
            maxLength={60}
            className={inputClass}
            value={tab.title}
            onChange={(e) => onChange({ title: e.target.value })}
        />

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {tab.images.map((img, slot) => (
                <div key={slot}>
                    <p className={labelClass}>
                        Image {slot + 1}
                        {slot > 0 && <span className="text-neutral-400 font-normal"> · optional</span>}
                    </p>
                    <ImageUpload
                        value={img}
                        onChange={(url) => onImage(slot, url)}
                        onBusyChange={onBusyChange}
                        aspect="aspect-[16/10]"
                        folder="portfolio"
                    />
                </div>
            ))}
        </div>

        <div className="mt-4">
            <label className={labelClass}>
                Description <span className="text-neutral-400 font-normal">· shown under the images</span>
            </label>
            <textarea
                rows={4}
                maxLength={4000}
                placeholder="What we did, results, tech used…"
                className={textareaClass}
                value={tab.description}
                onChange={(e) => onChange({ description: e.target.value })}
            />
        </div>
    </div>
);

const hostnameOf = (url) => {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return url;
    }
};

/* ---------- Add / edit dialog ---------- */
const PortfolioDialog = ({ initial, onClose, onSaved }) => {
    const isEdit = Boolean(initial?._id);
    const [form, setForm] = useState(() =>
        isEdit
            ? {
                  name: initial.name || "",
                  url: initial.url || "",
                  image: initial.image || "",
                  tabs: (initial.tabs || []).map(newTab),
              }
            : emptyForm
    );
    const [saving, setSaving] = useState(false);
    // Several uploaders can run at once (screenshot + tab images), so count them
    const [uploads, setUploads] = useState(0);
    const uploading = uploads > 0;
    const [error, setError] = useState("");

    const onBusyChange = useCallback((busy) => setUploads((n) => Math.max(0, n + (busy ? 1 : -1))), []);

    const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

    // Tabs are addressed by key, so an upload finishing after its tab moved/was deleted stays correct
    const updateTab = (key, patch) =>
        setForm((prev) => ({
            ...prev,
            tabs: prev.tabs.map((t) => (t.key === key ? { ...t, ...(typeof patch === "function" ? patch(t) : patch) } : t)),
        }));
    const setTabImage = (key, slot, url) =>
        updateTab(key, (t) => {
            const images = [...t.images];
            images[slot] = url;
            return { images };
        });
    const addTab = () => setForm((prev) => ({ ...prev, tabs: [...prev.tabs, newTab()] }));
    const removeTab = (key) => setForm((prev) => ({ ...prev, tabs: prev.tabs.filter((t) => t.key !== key) }));
    const moveTab = (key, dir) =>
        setForm((prev) => {
            const tabs = [...prev.tabs];
            const from = tabs.findIndex((t) => t.key === key);
            const to = from + dir;
            if (from < 0 || to < 0 || to >= tabs.length) return prev;
            [tabs[from], tabs[to]] = [tabs[to], tabs[from]];
            return { ...prev, tabs };
        });

    const busyRef = useRef(false);
    useEffect(() => {
        busyRef.current = saving || uploading;
    }, [saving, uploading]);
    // Stable so the modal's scroll lock isn't torn down on every keystroke
    const safeClose = useCallback(() => {
        if (!busyRef.current) onClose();
    }, [onClose]);

    const submit = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.url.trim()) {
            setError("Website name and URL are required.");
            return;
        }
        if (!form.image) {
            setError("Upload a website screenshot.");
            return;
        }
        const tabs = form.tabs.map(({ title, images, description }) => ({
            title: title.trim(),
            images: images.filter(Boolean),
            description: description.trim(),
        }));
        const badTab = tabs.findIndex((t) => !t.title || !t.images.length);
        if (badTab !== -1) {
            setError(`Tab ${badTab + 1} needs a title and at least one image.`);
            return;
        }
        setSaving(true);
        setError("");
        try {
            const data = await api(isEdit ? `/api/portfolio/${initial._id}` : "/api/portfolio", {
                method: isEdit ? "PUT" : "POST",
                body: JSON.stringify({ name: form.name, url: form.url, image: form.image, tabs }),
            });
            onSaved(data.item, isEdit);
        } catch (err) {
            setError(friendlyError(err));
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
                        {isEdit ? "Edit portfolio item" : "New portfolio item"}
                    </h2>
                    <button
                        type="button"
                        onClick={safeClose}
                        disabled={saving || uploading}
                        className="p-2 -mr-2 rounded-full text-neutral-500 hover:bg-neutral-100 cursor-pointer"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-6 pb-2 grid gap-6 sm:grid-cols-[1fr_1.2fr]">
                    <div className="space-y-5">
                        <div>
                            <label className={labelClass}>Website name</label>
                            <input
                                type="text"
                                placeholder="Bella Interiors"
                                className={inputClass}
                                value={form.name}
                                onChange={update("name")}
                                autoFocus
                                required
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Website URL</label>
                            <input
                                type="text"
                                inputMode="url"
                                placeholder="https://example.com"
                                className={inputClass}
                                value={form.url}
                                onChange={update("url")}
                                required
                            />
                            <p className="mt-1.5 text-xs text-neutral-500">Opens in a new tab when the card is clicked.</p>
                        </div>
                    </div>

                    <div>
                        <p className={labelClass}>Screenshot</p>
                        <ImageUpload
                            value={form.image}
                            onChange={(image) => setForm((prev) => ({ ...prev, image }))}
                            onBusyChange={onBusyChange}
                            aspect="aspect-[16/10]"
                            folder="portfolio"
                        />
                        <p className="mt-1.5 text-xs text-neutral-500">
                            Landscape works best. Tall full-page screenshots scroll on hover.
                        </p>
                    </div>
                </div>

                {/* "Read about" tabs */}
                <div className="mx-6 mt-6 pt-5 border-t border-neutral-200">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                            <p className="text-sm font-medium text-neutral-900">&quot;Read about&quot; tabs</p>
                            <p className="text-xs text-neutral-500 mt-0.5">
                                Shown in the popup when visitors click &quot;Read about {form.name.trim() || "this website"}&quot;.
                                Leave empty to hide the button.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={addTab}
                            disabled={form.tabs.length >= MAX_TABS}
                            className={`${ghostBtn} shrink-0 h-9 px-4 border border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <Plus size={16} />
                            Add tab
                        </button>
                    </div>

                    {form.tabs.length === 0 ? (
                        <button
                            type="button"
                            onClick={addTab}
                            className="w-full py-6 rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 hover:border-neutral-400 hover:bg-neutral-50 transition cursor-pointer"
                        >
                            No tabs yet. <span className="text-[#1a73e8] font-medium">Add the first tab</span>
                        </button>
                    ) : (
                        <div className="space-y-3">
                            {form.tabs.map((tab, index) => (
                                <TabEditor
                                    key={tab.key}
                                    tab={tab}
                                    index={index}
                                    total={form.tabs.length}
                                    onChange={(patch) => updateTab(tab.key, patch)}
                                    onImage={(slot, url) => setTabImage(tab.key, slot, url)}
                                    onMove={(dir) => moveTab(tab.key, dir)}
                                    onRemove={() => removeTab(tab.key)}
                                    onBusyChange={onBusyChange}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {error && <p className="mx-6 mt-4 px-4 py-3 rounded-lg text-sm bg-red-50 text-red-700">{error}</p>}

                <div className="flex justify-end gap-2 px-6 py-5">
                    <button type="button" onClick={safeClose} disabled={saving || uploading} className={ghostBtn}>
                        Cancel
                    </button>
                    <button type="submit" disabled={saving || uploading} className={primaryBtn}>
                        {saving && <Loader2 size={16} className="animate-spin" />}
                        {isEdit ? "Save changes" : "Add website"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

/* ---------- Portfolio card ---------- */
const PortfolioCard = ({ item, onEdit, onDelete }) => {
    const [confirming, setConfirming] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [broken, setBroken] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        const ok = await onDelete(item);
        if (!ok) {
            setDeleting(false);
            setConfirming(false);
        }
    };

    return (
        <li className="group bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-[0_1px_3px_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] transition-shadow">
            <div className="relative aspect-[16/10] bg-neutral-100">
                {broken ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-neutral-400">
                        <AlertCircle size={20} />
                        <p className="text-xs">Image couldn&apos;t be loaded</p>
                    </div>
                ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={cloudinaryImage(item.image, { width: 640 })}
                        alt={item.name}
                        loading="lazy"
                        onError={() => setBroken(true)}
                        className="w-full h-full object-cover object-top"
                    />
                )}
            </div>

            <div className="p-3">
                {confirming ? (
                    <div className="space-y-2.5">
                        <p className="text-sm text-neutral-800">Delete this website?</p>
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
                            <p className="text-sm font-medium text-neutral-900 truncate">{item.name}</p>
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 max-w-full text-xs text-[#1a73e8] hover:underline mt-0.5"
                            >
                                <span className="truncate">{hostnameOf(item.url)}</span>
                                <ExternalLink size={11} className="shrink-0" />
                            </a>
                            <span className="flex items-center gap-1 mt-2 text-[11px] text-neutral-500">
                                <Layers size={12} />
                                {item.tabs?.length
                                    ? `${item.tabs.length} ${item.tabs.length === 1 ? "tab" : "tabs"}`
                                    : "No tabs · Read about hidden"}
                            </span>
                        </div>
                        <div className="flex -mr-1 -mt-1 shrink-0">
                            <button
                                onClick={() => onEdit(item)}
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
const PortfolioManager = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    // null = closed, {} = new, item = editing
    const [editing, setEditing] = useState(null);
    const [toast, setToast] = useState(null);

    const closeToast = useCallback(() => setToast(null), []);
    const closeDialog = useCallback(() => setEditing(null), []);

    useEffect(() => {
        api("/api/portfolio")
            .then((data) => setItems(data.items))
            .catch((err) => {
                console.error("Failed to fetch portfolio", err);
                setToast({ type: "error", message: "Couldn't load portfolio." });
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSaved = (item, isEdit) => {
        setItems((prev) => (isEdit ? prev.map((i) => (i._id === item._id ? item : i)) : [item, ...prev]));
        setEditing(null);
        setToast({ type: "success", message: isEdit ? "Website updated" : "Website added" });
    };

    const handleDelete = async (item) => {
        try {
            await api(`/api/portfolio/${item._id}`, { method: "DELETE" });
            setItems((prev) => prev.filter((i) => i._id !== item._id));
            setToast({ type: "success", message: "Website deleted" });
            return true;
        } catch (err) {
            setToast({ type: "error", message: friendlyError(err, "Couldn't delete website.") });
            return false;
        }
    };

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return items;
        return items.filter((i) => i.name?.toLowerCase().includes(q) || i.url?.toLowerCase().includes(q));
    }, [items, query]);

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b border-neutral-200">
                <div>
                    <h1 className="text-2xl font-normal text-neutral-900">Portfolio</h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        {loading
                            ? "Loading…"
                            : `${items.length} ${items.length === 1 ? "website" : "websites"} · shown on the /website page`}
                    </p>
                </div>
                <button onClick={() => setEditing({})} className={`${primaryBtn} self-start sm:self-auto`}>
                    <Plus size={18} />
                    New website
                </button>
            </div>

            {/* Search */}
            {items.length > 0 && (
                <div className="relative mt-6 max-w-md">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name or URL"
                        className="w-full h-11 pl-11 pr-4 rounded-full bg-neutral-100 text-sm text-neutral-900 placeholder-neutral-500 outline-none border border-transparent focus:bg-white focus:border-neutral-200 focus:shadow-[0_1px_6px_rgba(32,33,36,0.18)] transition"
                    />
                </div>
            )}

            {/* Content */}
            <div className="mt-6">
                {loading ? (
                    <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <li key={i} className="rounded-xl border border-neutral-200 overflow-hidden">
                                <div className="aspect-[16/10] bg-neutral-100 animate-pulse" />
                                <div className="p-3 space-y-2">
                                    <div className="h-3.5 w-2/3 rounded bg-neutral-100 animate-pulse" />
                                    <div className="h-3 w-1/2 rounded bg-neutral-100 animate-pulse" />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center text-center py-20">
                        <div className="w-14 h-14 rounded-full bg-[#1a73e8]/10 text-[#1a73e8] flex items-center justify-center mb-4">
                            <Globe size={24} />
                        </div>
                        <p className="text-base text-neutral-900">No websites yet</p>
                        <p className="text-sm text-neutral-500 mt-1 mb-6">
                            Add your first website to show the portfolio section.
                        </p>
                        <button onClick={() => setEditing({})} className={primaryBtn}>
                            <Plus size={18} />
                            New website
                        </button>
                    </div>
                ) : filtered.length === 0 ? (
                    <p className="py-16 text-center text-sm text-neutral-500">No websites match “{query}”.</p>
                ) : (
                    <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((item) => (
                            <PortfolioCard key={item._id} item={item} onEdit={setEditing} onDelete={handleDelete} />
                        ))}
                    </ul>
                )}
            </div>

            {editing && <PortfolioDialog initial={editing} onClose={closeDialog} onSaved={handleSaved} />}
            <Snackbar toast={toast} onClose={closeToast} />
        </div>
    );
};

export default PortfolioManager;
