"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { AlertCircle, CheckCircle2, ImagePlus, Loader2, X } from "lucide-react";
import DeleteBlogPostModel from "../DeleteBlogPostModel";
import { Card, PageHeader, inputClass, selectClass, labelClass, primaryBtn, iconBtn } from "./ui";

// Loaded on demand so the editor never ships in a public bundle
const RichTextEditor = dynamic(() => import("./RichTextEditor"), {
    ssr: false,
    loading: () => <div className="min-h-[360px] rounded-lg bg-stone-100 animate-pulse" />,
});

const BlogPostForm = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [image, setImage] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => setImage(reader.result);
    };

    const addTag = (e) => {
        if (e && e.key !== "Enter") return;
        if (e) e.preventDefault();

        const val = tagInput.trim().replace(/#/g, "");
        if (val && !tags.includes(val)) {
            setTags((prev) => [...prev, val]);
            setTagInput("");
        }
    };

    const removeTag = (idx) => setTags(tags.filter((_, i) => i !== idx));

    const submitBlog = async (e) => {
        e.preventDefault();

        if (!title || !content || !category) {
            setStatus({ type: "error", message: "Please fill Title, Content and Category." });
            return;
        }

        setLoading(true);
        setStatus({ type: "", message: "" });
        try {
            const res = await fetch("/api/blog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content,
                    contentFormat: "html",
                    category,
                    tags: [...tags],
                    image,
                    author: "Admin",
                }),
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.error);

            setStatus({ type: "success", message: "Story published!" });
            setTitle("");
            setContent("");
            setTags([]);
            setImage("");
            setCategory("");
        } catch (err) {
            setStatus({ type: "error", message: err.message || "Something went wrong." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageHeader
                title="Blogs"
                description="Write and publish a new story."
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

            {status.message && (
                <p
                    role={status.type === "error" ? "alert" : "status"}
                    className={`mb-4 flex items-start gap-2 px-3 py-2.5 rounded-md text-sm border ${
                        status.type === "success"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-700 border-red-200"
                    }`}
                >
                    {status.type === "success" ? (
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                    ) : (
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    )}
                    <span className="min-w-0 break-words">{status.message}</span>
                </p>
            )}

            <Card className={`transition-opacity overflow-clip ${loading ? "opacity-50 pointer-events-none" : ""}`}>
                <form id="blog-form" onSubmit={submitBlog}>
                    <div className="relative aspect-[16/7] sm:aspect-[16/6] bg-stone-50 border-b border-stone-200">
                        {image ? (
                            <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={image} alt="Cover preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setImage("")}
                                    className={`${iconBtn} absolute top-3 right-3 bg-white/90 shadow-xs hover:bg-white`}
                                    aria-label="Remove image"
                                    title="Remove image"
                                >
                                    <X size={16} />
                                </button>
                            </>
                        ) : (
                            <label className="flex flex-col items-center justify-center gap-2 h-full cursor-pointer hover:bg-stone-100 transition-colors">
                                <ImagePlus size={22} className="text-stone-400" />
                                <span className="text-xs text-stone-500 font-medium">Add cover image</span>
                                <input type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                            </label>
                        )}
                    </div>

                    <div className="p-4 sm:p-6 space-y-5">
                        <input
                            type="text"
                            placeholder="Headline..."
                            aria-label="Headline"
                            className="w-full min-w-0 text-xl sm:text-3xl font-semibold tracking-tight bg-transparent outline-none text-stone-900 placeholder-stone-300 leading-tight break-words"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="min-w-0">
                                <label htmlFor="blog-category" className={labelClass}>Category</label>
                                <select
                                    id="blog-category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className={selectClass}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Innovation">Innovation</option>
                                    <option value="Design">Design</option>
                                </select>
                            </div>

                            <div className="min-w-0">
                                <label htmlFor="blog-tags" className={labelClass}>Tags</label>
                                <div className="relative">
                                    <input
                                        id="blog-tags"
                                        type="text"
                                        placeholder="Type a tag, press Enter"
                                        className={`${inputClass} pr-14`}
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={addTag}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => addTag()}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-2.5 rounded-md text-xs font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 cursor-pointer"
                                    >
                                        Add
                                    </button>
                                </div>
                                {tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                                        {tags.map((tag, i) => (
                                            <span
                                                key={tag}
                                                className="max-w-full inline-flex items-center gap-1.5 pl-2 pr-1 py-0.5 bg-stone-100 text-stone-700 text-xs rounded-md border border-stone-200"
                                            >
                                                <span className="min-w-0 break-all">#{tag}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(i)}
                                                    className="size-5 shrink-0 grid place-items-center rounded hover:bg-stone-200 hover:text-red-600 cursor-pointer"
                                                    aria-label={`Remove tag ${tag}`}
                                                    title="Remove tag"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <RichTextEditor
                            value={content}
                            onChange={setContent}
                            placeholder="Your narrative begins here..."
                        />
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default BlogPostForm;
