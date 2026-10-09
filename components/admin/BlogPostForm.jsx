"use client";
import React, { useState } from "react";
import DeleteBlogPostModel from "../DeleteBlogPostModel";

const inputClass =
    "w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#80C1FC] focus:ring-2 focus:ring-[#80C1FC]/30 transition";

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
        <div className="max-w-3xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h1 className="text-xl font-semibold text-neutral-900">Blogs</h1>

                <div className="flex items-center gap-3">
                    <DeleteBlogPostModel />
                    <button
                        type="submit"
                        form="blog-form"
                        disabled={loading}
                        className="px-5 py-2.5 rounded-full text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                        {loading ? "Publishing..." : "Publish Insight"}
                    </button>
                </div>
            </div>

            {status.message && (
                <p
                    className={`mb-4 px-4 py-3 rounded-xl text-sm border ${
                        status.type === "success"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                    }`}
                >
                    {status.message}
                </p>
            )}

            <form
                id="blog-form"
                onSubmit={submitBlog}
                className={`border border-neutral-200 rounded-2xl overflow-hidden transition-opacity ${
                    loading ? "opacity-50 pointer-events-none" : ""
                }`}
            >
                <div className="relative h-56 sm:h-72 bg-neutral-50 border-b border-neutral-200">
                    {image ? (
                        <>
                            <img src={image} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => setImage("")}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 text-neutral-700 shadow hover:bg-white cursor-pointer"
                                aria-label="Remove image"
                            >
                                ×
                            </button>
                        </>
                    ) : (
                        <label className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-neutral-100 transition-colors">
                            <svg className="w-8 h-8 text-neutral-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-xs text-neutral-500 font-medium">Add cover image</span>
                            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                        </label>
                    )}
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                    <input
                        type="text"
                        placeholder="Headline..."
                        className="w-full text-2xl sm:text-4xl font-bold bg-transparent outline-none text-neutral-900 placeholder-neutral-300 leading-tight"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <div className="flex flex-col sm:flex-row gap-4">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={`${inputClass} flex-1 cursor-pointer`}
                        >
                            <option value="">Select Category</option>
                            <option value="Technology">Technology</option>
                            <option value="Innovation">Innovation</option>
                            <option value="Design">Design</option>
                        </select>

                        <div className="flex-1 space-y-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tags (Press Enter)"
                                    className={inputClass}
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={addTag}
                                />
                                <button
                                    type="button"
                                    onClick={() => addTag()}
                                    className="absolute right-3 top-3.5 text-[10px] text-neutral-500 hover:text-neutral-900 font-bold uppercase cursor-pointer"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag, i) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 bg-[#80C1FC]/15 text-neutral-700 text-xs rounded-md border border-[#80C1FC]/40 flex items-center gap-2"
                                    >
                                        #{tag}
                                        <button type="button" onClick={() => removeTag(i)} className="hover:text-red-600 cursor-pointer">
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <textarea
                        placeholder="Your narrative begins here..."
                        className="w-full min-h-[360px] bg-transparent outline-none text-neutral-700 text-base leading-relaxed resize-none placeholder-neutral-400"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
            </form>
        </div>
    );
};

export default BlogPostForm;
