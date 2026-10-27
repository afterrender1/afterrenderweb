"use client";
import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Loader2, Pencil, Trash2, Settings2, AlertCircle } from "lucide-react";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    modalPanel,
    Skeleton,
    inputClass,
    labelClass,
    primaryBtn,
    secondaryBtn,
    ghostBtn,
    iconBtn,
    iconBtnDanger,
} from "./admin/ui";

// Loaded on demand so the editor never ships in a public bundle
const RichTextEditor = dynamic(() => import("./admin/RichTextEditor"), {
    ssr: false,
    loading: () => <div className="min-h-[360px] rounded-lg bg-stone-100 animate-pulse" />,
});

const escapeHtml = (str) =>
    str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Old posts are Markdown; load them as plain paragraphs so they can be re-saved as html
const markdownToParagraphs = (md) =>
    md
        .split(/\n\s*\n/)
        .map((block) => block.trim())
        .filter(Boolean)
        .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br>")}</p>`)
        .join("");

// Card/list preview: html posts store an excerpt, old posts fall back to stripped text
const previewText = (blog) =>
    blog.excerpt || String(blog.content || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const DeleteBlogPostModel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [selectedBlog, setSelectedBlog] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [converted, setConverted] = useState(false);

    // Fetch blogs when main modal opens
    useEffect(() => {
        if (isOpen) fetchBlogs();
    }, [isOpen]);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/blog");
            const data = await res.json();
            setBlogs(data.blogs || data);
        } catch (err) {
            console.error("Failed to fetch blogs", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/blog/delete-blog/${id}`, { method: "DELETE" });
            if (res.ok) {
                setBlogs(prev => prev.filter((blog) => blog._id !== id));
            }
        } catch (err) {
            alert("Error deleting blog");
        } finally {
            setDeletingId(null);
        }
    };

    const openEditModal = (blog) => {
        setSelectedBlog(blog);
        setEditTitle(blog.title);
        const isHtml = blog.contentFormat === "html";
        setEditContent(isHtml ? blog.content : markdownToParagraphs(blog.content || ""));
        setConverted(!isHtml);
        setIsEditOpen(true);
    };

    const handleUpdate = async () => {
        if (!editTitle || !editContent) return alert("Fields cannot be empty");
        setUpdating(true);
        try {
            const res = await fetch(`/api/blog/update-blog/${selectedBlog._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedBlog._id,
                    title: editTitle,
                    content: editContent,
                    contentFormat: "html",
                }),
            });

            const data = await res.json().catch(() => ({}));
            if (res.ok && data.success) {
                setBlogs(prev =>
                    prev.map((blog) => (blog._id === selectedBlog._id ? data.blog : blog))
                );
                setIsEditOpen(false);
            } else {
                alert(data.message || data.error || "Update failed");
            }
        } catch (err) {
            alert("Update failed");
        } finally {
            setUpdating(false);
        }
    };

    const closeList = useCallback(() => setIsOpen(false), []);
    const closeEdit = useCallback(() => {
        if (!updating) setIsEditOpen(false);
    }, [updating]);

    return (
        <div className="flex">
            <button type="button" onClick={() => setIsOpen(true)} className={`${secondaryBtn} w-full sm:w-auto`}>
                <Settings2 size={16} />
                Manage blogs
            </button>

            {/* Manage list; hidden while a post is being edited so Escape only closes the top dialog */}
            {isOpen && !isEditOpen && (
                <Modal onClose={closeList} className="sm:max-w-xl">
                    <div className={`${modalPanel} sm:h-auto sm:max-h-[80dvh]`}>
                        <ModalHeader title="Manage blogs" onClose={closeList} />

                        <ModalBody className="!px-2 sm:!px-3 !py-2">
                            {loading ? (
                                <div className="space-y-2 p-2">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <Skeleton key={i} className="h-14 w-full" />
                                    ))}
                                </div>
                            ) : blogs.length === 0 ? (
                                <p className="py-14 text-center text-sm text-stone-500">No blog posts yet.</p>
                            ) : (
                                <ul>
                                    {blogs.map((blog) => (
                                        <li
                                            key={blog._id}
                                            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-md hover:bg-stone-50 transition-colors"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-stone-900 text-sm truncate" title={blog.title}>
                                                    {blog.title}
                                                </h3>
                                                <p className="text-stone-500 text-xs mt-0.5 line-clamp-1 break-all">
                                                    {previewText(blog)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                                {/* Icon buttons on phones, text buttons from sm up */}
                                                <button
                                                    onClick={() => openEditModal(blog)}
                                                    className={`${iconBtn} sm:hidden`}
                                                    aria-label={`Edit ${blog.title}`}
                                                    title="Edit"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(blog._id)}
                                                    disabled={deletingId === blog._id}
                                                    className={`${iconBtnDanger} sm:hidden`}
                                                    aria-label={`Delete ${blog.title}`}
                                                    title="Delete"
                                                >
                                                    {deletingId === blog._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                                                </button>
                                                <button onClick={() => openEditModal(blog)} className={`${secondaryBtn} hidden sm:inline-flex`}>
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(blog._id)}
                                                    disabled={deletingId === blog._id}
                                                    className={`${ghostBtn} hidden sm:inline-flex text-red-600 hover:bg-red-50`}
                                                >
                                                    {deletingId === blog._id ? "..." : "Delete"}
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </ModalBody>

                        <ModalFooter>
                            <button onClick={closeList} className={primaryBtn}>Done</button>
                        </ModalFooter>
                    </div>
                </Modal>
            )}

            {isEditOpen && (
                <Modal onClose={closeEdit} className="sm:max-w-4xl">
                    <div className={`${modalPanel} h-[92dvh] sm:h-auto`}>
                        <ModalHeader title="Edit post" onClose={closeEdit} disabled={updating} />

                        <ModalBody className="space-y-5">
                            <div>
                                <label htmlFor="edit-title" className={labelClass}>Title</label>
                                <input
                                    id="edit-title"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Content</label>
                                {converted && (
                                    <p className="mb-2 flex items-start gap-1.5 text-xs font-medium text-amber-700">
                                        <AlertCircle size={13} className="mt-px shrink-0" />
                                        Converted from Markdown, check formatting.
                                    </p>
                                )}
                                <RichTextEditor value={editContent} onChange={setEditContent} placeholder="Write your post..." />
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <button onClick={closeEdit} disabled={updating} className={ghostBtn}>Cancel</button>
                            <button onClick={handleUpdate} disabled={updating} className={primaryBtn}>
                                {updating && <Loader2 size={16} className="animate-spin" />}
                                {updating ? "Saving..." : "Update post"}
                            </button>
                        </ModalFooter>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default DeleteBlogPostModel;
