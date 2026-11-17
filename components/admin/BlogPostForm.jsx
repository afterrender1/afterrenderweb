"use client";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
    AlertCircle,
    CheckCircle2,
    Circle,
    Crop,
    ExternalLink,
    ImagePlus,
    Loader2,
    RefreshCw,
    Trash2,
    X,
} from "lucide-react";
import { mutate as globalMutate } from "swr";
import DeleteBlogPostModel from "../DeleteBlogPostModel";
import { KEYS } from "./hooks";
import { Card, PageHeader, inputClass, selectClass, labelClass, primaryBtn } from "./ui";

// Loaded on demand so the editor never ships in a public bundle
const RichTextEditor = dynamic(() => import("./RichTextEditor"), {
    ssr: false,
    loading: () => <div className="min-h-[420px] rounded-lg bg-stone-100 animate-pulse" />,
});

// Only loaded when an image is picked
const ImageCropModal = dynamic(() => import("./ImageCropModal"), { ssr: false });

const CATEGORIES = ["Technology", "Innovation", "Design"];
const MAX_IMAGE_MB = 15;
const TITLE_MAX = 150;
const TITLE_SEO = 70; // longer titles get cut off in Google results
const MAX_TAGS = 10;
const MAX_TAG_LEN = 30;
const DRAFT_KEY = "admin:blog-draft:v1";

/* Local button styles (complete class lists, so no two utilities fight over the same property) */
const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20";
const smallBtn = `inline-flex items-center justify-center gap-1.5 h-9 px-2 rounded-md border bg-white text-xs font-medium whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${focusRing}`;
const smallBtnNeutral = `${smallBtn} border-stone-200 text-stone-900 hover:bg-stone-50`;
const smallBtnDanger = `${smallBtn} border-stone-200 text-red-600 hover:bg-red-50 hover:border-red-200`;
const textBtn = `inline-flex items-center h-8 px-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${focusRing}`;
const clearBtn = `inline-flex w-full items-center justify-center gap-2 h-9 mt-1.5 rounded-md text-sm font-medium text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${focusRing}`;
const dismissBtn = `size-7 shrink-0 grid place-items-center rounded-md hover:bg-black/5 transition-colors cursor-pointer ${focusRing}`;
const selectErrorClass = selectClass.replace("border-stone-200", "border-red-300").replace("focus:ring-stone-900/10", "focus:ring-red-500/15");

// Enter/comma while an IME (e.g. Urdu or Chinese keyboard) is composing must not be intercepted
const composing = (e) => e.nativeEvent.isComposing || e.keyCode === 229;

const plainText = (html) =>
    String(html || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();

const cleanTag = (t) => t.replace(/#/g, "").trim().slice(0, MAX_TAG_LEN);

// Adds comma-separated tags, skipping blanks and case-insensitive duplicates
const mergeTags = (existing, raw) => {
    const out = [...existing];
    for (const part of raw.split(",")) {
        const tag = cleanTag(part);
        if (tag && out.length < MAX_TAGS && !out.some((t) => t.toLowerCase() === tag.toLowerCase())) out.push(tag);
    }
    return out;
};

// Text fields survive a refresh or closed tab; the cover image is too large to keep
const readDraft = () => {
    try {
        const d = JSON.parse(window.localStorage.getItem(DRAFT_KEY) || "null");
        if (!d || typeof d !== "object") return null;
        return {
            title: typeof d.title === "string" ? d.title.slice(0, TITLE_MAX) : "",
            content: typeof d.content === "string" ? d.content : "",
            category: CATEGORIES.includes(d.category) ? d.category : "",
            tags: Array.isArray(d.tags) ? mergeTags([], d.tags.filter((t) => typeof t === "string").join(",")) : [],
        };
    } catch {
        return null;
    }
};

const draftHasData = (d) => Boolean(d && (d.title.trim() || plainText(d.content) || d.category || d.tags.length));

const FieldError = ({ id, children }) =>
    children ? (
        <p id={id} className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
            <AlertCircle size={13} className="shrink-0" />
            {children}
        </p>
    ) : null;

const CheckItem = ({ done, optional = false, children }) => (
    <li className="flex items-center gap-2 text-sm">
        {done ? (
            <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
        ) : (
            <Circle size={16} className="shrink-0 text-stone-300" />
        )}
        <span className={done ? "text-stone-900" : "text-stone-500"}>{children}</span>
        {optional && <span className="ml-auto text-[11px] text-stone-400">Optional</span>}
    </li>
);

const BlogPostForm = () => {
    const [initialDraft] = useState(readDraft);

    const [loading, setLoading] = useState(false);
    // { type: "success" | "error", message, slug? }
    const [status, setStatus] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [draftNotice, setDraftNotice] = useState(() => draftHasData(initialDraft));

    const [title, setTitle] = useState(() => initialDraft?.title ?? "");
    const [content, setContent] = useState(() => initialDraft?.content ?? "");
    const [category, setCategory] = useState(() => initialDraft?.category ?? "");
    const [tags, setTags] = useState(() => initialDraft?.tags ?? []);
    const [tagInput, setTagInput] = useState("");

    // `image` is the cropped JPEG (data URL) that gets published; `source` is the original file
    // (object URL), kept so the crop can be redone without quality loss.
    const [image, setImage] = useState("");
    const [source, setSource] = useState("");
    const [imageError, setImageError] = useState("");
    const [dragging, setDragging] = useState(false);
    // "new" = cropping a freshly picked file, "edit" = re-cropping the current one
    const [cropMode, setCropMode] = useState(null);
    // Picked files wait in `pending` until the crop is applied, so cancelling keeps the current image
    const [pending, setPending] = useState("");

    const sourceRef = useRef("");
    const fileInputRef = useRef(null);
    const titleRef = useRef(null);
    const categoryRef = useRef(null);
    const contentRef = useRef(null);
    const topRef = useRef(null);

    const setSourceUrl = (url) => {
        if (sourceRef.current) URL.revokeObjectURL(sourceRef.current);
        sourceRef.current = url;
        setSource(url);
    };

    // Free the original file's memory when leaving the page
    useEffect(
        () => () => {
            if (sourceRef.current) URL.revokeObjectURL(sourceRef.current);
        },
        []
    );

    // Autosave the text fields (debounced); an empty form clears the saved draft
    useEffect(() => {
        const t = setTimeout(() => {
            try {
                if (!title.trim() && !plainText(content) && !category && !tags.length) {
                    window.localStorage.removeItem(DRAFT_KEY);
                } else {
                    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, content, category, tags }));
                }
            } catch {
                /* storage full or blocked: the form still works, just without a draft */
            }
        }, 500);
        return () => clearTimeout(t);
    }, [title, content, category, tags]);

    // The draft can't hold the cover image, so warn before leaving with one picked or while publishing
    useEffect(() => {
        if (!image && !loading) return;
        const onBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = "";
        };
        window.addEventListener("beforeunload", onBeforeUnload);
        return () => window.removeEventListener("beforeunload", onBeforeUnload);
    }, [image, loading]);

    /* ---------- Validation ---------- */
    const hasContent = Boolean(plainText(content));
    const errors = {
        title: title.trim() ? "" : "Add a title for your post.",
        category: category ? "" : "Choose a category.",
        content: hasContent ? "" : "Write the post content.",
    };
    const showError = (field) => (submitted ? errors[field] : "");

    /* ---------- Cover image ---------- */
    const pickFile = (file) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setImageError("Please choose an image file (JPG, PNG, WEBP or GIF).");
            return;
        }
        if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
            setImageError(`Image is too large — max ${MAX_IMAGE_MB} MB.`);
            return;
        }
        setImageError("");
        if (pending) URL.revokeObjectURL(pending);
        setPending(URL.createObjectURL(file));
        setCropMode("new");
    };

    const handleFileInput = (e) => {
        const file = e.target.files?.[0];
        e.target.value = ""; // lets the same file be picked again
        pickFile(file);
    };

    const cropSrc = cropMode === "new" ? pending : source;

    const applyCrop = (dataUrl) => {
        if (cropMode === "new") {
            setSourceUrl(pending);
            setPending("");
        }
        setImage(dataUrl);
        setCropMode(null);
    };

    const cancelCrop = () => {
        if (cropMode === "new" && pending) URL.revokeObjectURL(pending);
        setPending("");
        setCropMode(null);
    };

    const removeImage = () => {
        setSourceUrl("");
        setImage("");
        setImageError("");
    };

    /* ---------- Tags ---------- */
    const commitTagInput = () => {
        if (!tagInput.trim()) return;
        setTags((prev) => mergeTags(prev, tagInput));
        setTagInput("");
    };

    const onTagKeyDown = (e) => {
        if (composing(e)) return;
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commitTagInput();
        } else if (e.key === "Backspace" && !tagInput && tags.length) {
            setTags((prev) => prev.slice(0, -1));
        }
    };

    const removeTag = (tag) => setTags((prev) => prev.filter((t) => t !== tag));

    /* ---------- Form actions ---------- */
    const resetForm = () => {
        setTitle("");
        setContent("");
        setCategory("");
        setTags([]);
        setTagInput("");
        removeImage();
        setSubmitted(false);
        setDraftNotice(false);
        try {
            window.localStorage.removeItem(DRAFT_KEY);
        } catch {
            /* ignore */
        }
    };

    const clearForm = () => {
        const dirty = title.trim() || hasContent || category || tags.length || tagInput.trim() || image;
        if (dirty && !window.confirm("Clear the whole form? This can't be undone.")) return;
        resetForm();
        setStatus(null);
    };

    const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    const submitBlog = async (e) => {
        e.preventDefault();
        if (loading) return;
        setSubmitted(true);

        // Move to the first problem so it's obvious what's missing
        if (errors.title) return titleRef.current?.focus();
        if (errors.category) return categoryRef.current?.focus();
        if (errors.content) {
            contentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            contentRef.current?.querySelector(".ProseMirror")?.focus();
            return;
        }

        // A tag still typed in the box is included
        const finalTags = mergeTags(tags, tagInput);
        setTags(finalTags);
        setTagInput("");

        setLoading(true);
        setStatus(null);
        try {
            const res = await fetch("/api/blog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.trim(),
                    content,
                    contentFormat: "html",
                    category,
                    tags: finalTags,
                    image,
                    author: "Admin",
                }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok || !data?.success) {
                const raw = data?.error || data?.message || "";
                if (res.status === 401) throw new Error("Your session expired — please log in again.");
                if (raw.includes("E11000")) throw new Error("A post with this title already exists. Please change the title.");
                if (res.status === 413) throw new Error("The cover image is too large. Try cropping it smaller.");
                throw new Error(raw || `Publishing failed (${res.status}).`);
            }

            // The manage-blogs list is cached, so refresh it with the new post
            globalMutate(KEYS.blogs);
            resetForm();
            setStatus({ type: "success", message: "Your post is live.", slug: data.blog?.slug });
        } catch (err) {
            setStatus({
                type: "error",
                message: err?.message === "Failed to fetch" ? "Network error — check your connection and try again." : err?.message || "Something went wrong.",
            });
        } finally {
            setLoading(false);
            scrollToTop();
        }
    };

    const titleLength = title.length;

    return (
        <div ref={topRef} className="scroll-mt-20">
            <PageHeader
                title="Blogs"
                description="Write a new post and publish it to the blog."
                actions={
                    <>
                        <DeleteBlogPostModel />
                        <button type="submit" form="blog-form" disabled={loading} className={primaryBtn}>
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            {loading ? "Publishing..." : "Publish"}
                        </button>
                    </>
                }
            />

            {status && (
                <div
                    role={status.type === "error" ? "alert" : "status"}
                    className={`mb-4 flex items-start gap-2.5 pl-3 pr-1.5 py-2 rounded-md text-sm border ${
                        status.type === "success"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-red-50 text-red-700 border-red-200"
                    }`}
                >
                    {status.type === "success" ? (
                        <CheckCircle2 size={16} className="mt-1 shrink-0" />
                    ) : (
                        <AlertCircle size={16} className="mt-1 shrink-0" />
                    )}
                    <p className="flex-1 min-w-0 py-0.5 break-words">
                        {status.message}
                        {status.slug && (
                            <a
                                href={`/blog/${status.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 inline-flex items-center gap-1 font-medium underline underline-offset-2"
                            >
                                View post
                                <ExternalLink size={13} />
                            </a>
                        )}
                    </p>
                    <button type="button" onClick={() => setStatus(null)} className={dismissBtn} aria-label="Dismiss" title="Dismiss">
                        <X size={14} />
                    </button>
                </div>
            )}

            {draftNotice && (
                <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 rounded-md border border-stone-200 bg-white text-sm text-stone-700">
                    <span className="flex-1 min-w-0">We restored your unsaved draft from this browser.</span>
                    <div className="flex items-center gap-1">
                        <button type="button" onClick={() => setDraftNotice(false)} className={`${textBtn} text-stone-700 hover:bg-stone-100`}>
                            Keep it
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                resetForm();
                                setStatus(null);
                            }}
                            className={`${textBtn} text-red-600 hover:bg-red-50`}
                        >
                            Discard draft
                        </button>
                    </div>
                </div>
            )}

            <form
                id="blog-form"
                onSubmit={submitBlog}
                noValidate
                aria-busy={loading}
                className={`grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-4 lg:gap-5 items-start transition-opacity ${
                    loading ? "opacity-60 pointer-events-none" : ""
                }`}
            >
                {/* ---------- Writing area ---------- */}
                <Card className="p-4 sm:p-6 min-w-0">
                    <div>
                        <div className="flex items-baseline justify-between gap-3">
                            <label htmlFor="blog-title" className={labelClass}>
                                Title <span className="text-red-600">*</span>
                            </label>
                            <span className={`text-[11px] tabular-nums ${titleLength > TITLE_SEO ? "text-amber-600" : "text-stone-400"}`}>
                                {titleLength}/{TITLE_MAX}
                            </span>
                        </div>
                        <input
                            ref={titleRef}
                            id="blog-title"
                            type="text"
                            placeholder="e.g. 7 Video Editing Tips That Boost Engagement"
                            maxLength={TITLE_MAX}
                            aria-invalid={Boolean(showError("title"))}
                            aria-describedby={showError("title") ? "blog-title-error" : "blog-title-hint"}
                            className={`w-full min-w-0 rounded-md border bg-white px-3 py-2.5 text-lg sm:text-2xl font-semibold tracking-tight text-stone-900 placeholder:text-stone-300 placeholder:font-medium outline-none transition-colors focus:ring-2 ${
                                showError("title")
                                    ? "border-red-300 focus:border-red-400 focus:ring-red-500/15"
                                    : "border-stone-200 hover:border-stone-300 focus:border-stone-400 focus:ring-stone-900/10"
                            }`}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            // Enter in the title shouldn't publish the post
                            onKeyDown={(e) => e.key === "Enter" && !composing(e) && e.preventDefault()}
                        />
                        {showError("title") ? (
                            <FieldError id="blog-title-error">{errors.title}</FieldError>
                        ) : (
                            <p id="blog-title-hint" className="mt-1.5 text-xs text-stone-500">
                                {titleLength > TITLE_SEO
                                    ? `Titles over ${TITLE_SEO} characters get cut off in Google results.`
                                    : "Also used for the post's link and search results."}
                            </p>
                        )}
                    </div>

                    <div ref={contentRef} className="mt-5 scroll-mt-24">
                        <p className={labelClass} id="blog-content-label">
                            Content <span className="text-red-600">*</span>
                        </p>
                        <div className={showError("content") ? "rounded-lg ring-2 ring-red-500/20 [&>div]:border-red-300" : ""}>
                            <RichTextEditor
                                value={content}
                                onChange={setContent}
                                placeholder="Start writing your post… Select text to format it with the toolbar."
                                stickyClass="top-14 md:top-0"
                            />
                        </div>
                        <FieldError>{showError("content")}</FieldError>
                    </div>
                </Card>

                {/* ---------- Sidebar ---------- */}
                <aside className="space-y-4 min-w-0">
                    {/* Publish */}
                    <Card className="p-4">
                        <h2 className="text-sm font-semibold text-stone-900">Ready to publish?</h2>
                        <ul className="mt-3 space-y-2">
                            <CheckItem done={Boolean(title.trim())}>Title</CheckItem>
                            <CheckItem done={Boolean(category)}>Category</CheckItem>
                            <CheckItem done={hasContent}>Content</CheckItem>
                            <CheckItem done={Boolean(image)} optional>Cover image</CheckItem>
                            <CheckItem done={tags.length > 0} optional>Tags</CheckItem>
                        </ul>
                        <button type="submit" disabled={loading} className={`${primaryBtn} w-full mt-4`}>
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            {loading ? "Publishing..." : "Publish post"}
                        </button>
                        <button type="button" onClick={clearForm} disabled={loading} className={clearBtn}>
                            <Trash2 size={14} />
                            Clear form
                        </button>
                        <p className="mt-2 text-[11px] leading-snug text-stone-400">
                            Your text is saved in this browser as you type. The cover image isn&apos;t.
                        </p>
                    </Card>

                    {/* Cover image */}
                    <Card className="p-4">
                        <div className="flex items-baseline justify-between gap-2">
                            <h2 className="text-sm font-semibold text-stone-900">Cover image</h2>
                            <span className="text-[11px] text-stone-400">Shown at 16:9</span>
                        </div>

                        <input ref={fileInputRef} type="file" accept="image/*" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={handleFileInput} />

                        {image ? (
                            <>
                                {/* Contain: shows the whole cropped image exactly as it will be saved */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={image} alt="Cover preview" className="mt-3 w-full aspect-video object-contain rounded-md border border-stone-200 bg-stone-100" />
                                <div className="mt-2 grid grid-cols-3 gap-1.5">
                                    <button type="button" onClick={() => setCropMode("edit")} disabled={!source} className={smallBtnNeutral}>
                                        <Crop size={14} />
                                        Crop
                                    </button>
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className={smallBtnNeutral}>
                                        <RefreshCw size={14} />
                                        Replace
                                    </button>
                                    <button type="button" onClick={removeImage} className={smallBtnDanger}>
                                        <X size={14} />
                                        Remove
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragging(true);
                                }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setDragging(false);
                                    pickFile(e.dataTransfer.files?.[0]);
                                }}
                                className={`mt-3 w-full aspect-video flex flex-col items-center justify-center gap-1.5 rounded-md border border-dashed text-center px-3 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20 ${
                                    dragging ? "border-stone-900 bg-stone-100" : "border-stone-300 hover:border-stone-400 hover:bg-stone-50"
                                }`}
                            >
                                <ImagePlus size={20} className="text-stone-400" />
                                <span className="text-xs font-medium text-stone-900">Upload image</span>
                                <span className="text-[11px] text-stone-500">or drag &amp; drop · max {MAX_IMAGE_MB} MB</span>
                            </button>
                        )}
                        <FieldError>{imageError}</FieldError>
                    </Card>

                    {/* Details */}
                    <Card className="p-4 space-y-4">
                        <h2 className="text-sm font-semibold text-stone-900">Details</h2>

                        <div>
                            <label htmlFor="blog-category" className={labelClass}>
                                Category <span className="text-red-600">*</span>
                            </label>
                            <select
                                ref={categoryRef}
                                id="blog-category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                aria-invalid={Boolean(showError("category"))}
                                aria-describedby={showError("category") ? "blog-category-error" : undefined}
                                className={showError("category") ? selectErrorClass : selectClass}
                            >
                                <option value="">Choose a category</option>
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                            <FieldError id="blog-category-error">{showError("category")}</FieldError>
                        </div>

                        <div>
                            <div className="flex items-baseline justify-between gap-3">
                                <label htmlFor="blog-tags" className={labelClass}>
                                    Tags
                                </label>
                                <span className="text-[11px] text-stone-400 tabular-nums">
                                    {tags.length}/{MAX_TAGS}
                                </span>
                            </div>
                            <div className="relative">
                                <input
                                    id="blog-tags"
                                    type="text"
                                    placeholder={tags.length >= MAX_TAGS ? "Tag limit reached" : "e.g. video editing"}
                                    disabled={tags.length >= MAX_TAGS}
                                    maxLength={200}
                                    aria-describedby="blog-tags-hint"
                                    className={`${inputClass} pr-14`}
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={onTagKeyDown}
                                    onBlur={commitTagInput}
                                />
                                <button
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={commitTagInput}
                                    disabled={!tagInput.trim() || tags.length >= MAX_TAGS}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-2.5 rounded-md text-xs font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 cursor-pointer disabled:opacity-40 disabled:cursor-default"
                                >
                                    Add
                                </button>
                            </div>
                            <p id="blog-tags-hint" className="mt-1.5 text-xs text-stone-500">
                                Press Enter or comma to add.
                            </p>
                            {tags.length > 0 && (
                                <ul className="flex flex-wrap gap-1.5 mt-2.5">
                                    {tags.map((tag) => (
                                        <li
                                            key={tag}
                                            className="max-w-full inline-flex items-center gap-1 pl-2 pr-0.5 py-0.5 bg-stone-100 text-stone-700 text-xs rounded-md border border-stone-200"
                                        >
                                            <span className="min-w-0 break-all">#{tag}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="size-5 shrink-0 grid place-items-center rounded hover:bg-stone-200 hover:text-red-600 cursor-pointer"
                                                aria-label={`Remove tag ${tag}`}
                                                title="Remove tag"
                                            >
                                                <X size={12} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </Card>
                </aside>
            </form>

            {cropMode && cropSrc && (
                <ImageCropModal
                    key={cropSrc}
                    src={cropSrc}
                    title={cropMode === "new" ? "Crop cover image" : "Re-crop cover image"}
                    onApply={applyCrop}
                    onCancel={cancelCrop}
                />
            )}
        </div>
    );
};

export default BlogPostForm;
