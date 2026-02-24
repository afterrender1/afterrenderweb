"use client";
import React, { useState, useEffect } from "react";

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

    const THEME_COLOR = "#80C1FC";

    // Toggle body scroll
    useEffect(() => {
        if (isOpen || isEditOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen, isEditOpen]);

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
        setEditContent(blog.content);
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
                }),
            });

            if (res.ok) {
                setBlogs(prev =>
                    prev.map((blog) =>
                        blog._id === selectedBlog._id ? { ...blog, title: editTitle, content: editContent } : blog
                    )
                );
                setIsEditOpen(false);
            }
        } catch (err) {
            alert("Update failed");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="p-4">
            {/* 1. Animated Manage Button (Restored Old UI) */}
            <button
                onClick={() => setIsOpen(true)}
                className="group relative dark:bg-neutral-800 bg-neutral-200 rounded-full p-px overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
            >
                <span className="absolute inset-0 rounded-full overflow-hidden">
                    <span className="inset-0 absolute pointer-events-none select-none">
                        <span
                            className="block -translate-x-1/2 -translate-y-1/3 size-24 blur-xl"
                            style={{ background: `linear-gradient(135deg, ${THEME_COLOR}, #ffffff, ${THEME_COLOR})` }}
                        ></span>
                    </span>
                </span>
                <span className="flex items-center justify-center gap-1 relative z-1 dark:bg-neutral-950/90 bg-neutral-50/90 rounded-full py-2.5 px-5 pl-3 w-full">
                    <span className="relative group-hover:rotate-180 transition-transform duration-700">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={THEME_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </span>
                    <span className="bg-neutral-900 dark:bg-white bg-clip-text text-[11px] font-bold uppercase tracking-widest text-transparent">
                        Manage Blogs
                    </span>
                </span>
            </button>

            {/* 2. Main Modal (Google Style Surface) */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 backdrop-blur-[2px] p-4 transition-all">
                    <div className="bg-white w-full max-w-xl max-h-[75vh] overflow-hidden rounded-xl shadow-2xl flex flex-col border border-neutral-200">
                        <div className="px-6 pt-6 pb-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg" style={{ backgroundColor: `${THEME_COLOR}20` }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={THEME_COLOR} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </div>
                                <h2 className="text-[22px] font-medium text-neutral-800 tracking-tight">Manage blogs</h2>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 transition-colors">✕</button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
                            {loading ? (
                                <div className="py-20 flex justify-center">
                                    <div className="w-8 h-8 border-[3px] border-neutral-200 border-t-[#80C1FC] animate-spin rounded-full"></div>
                                </div>
                            ) : (
                                <div className="px-2 py-2">
                                    {blogs.map((blog) => (
                                        <div key={blog._id} className="group flex items-center justify-between gap-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors duration-200">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-neutral-900 text-[15px] truncate">{blog.title}</h3>
                                                <p className="text-neutral-500 text-sm mt-0.5 truncate">{blog.content}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => openEditModal(blog)} className="px-4 py-1.5 rounded-full text-sm font-medium border border-neutral-200 hover:border-[#80C1FC] hover:text-[#80C1FC] transition-all">Edit</button>
                                                <button
                                                    onClick={() => handleDelete(blog._id)}
                                                    disabled={deletingId === blog._id}
                                                    className="px-4 py-1.5 rounded-full text-sm font-medium text-red-600 border border-transparent hover:bg-red-50 disabled:opacity-30"
                                                >
                                                    {deletingId === blog._id ? "..." : "Delete"}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-6 flex justify-end border-t border-neutral-100">
                            <button onClick={() => setIsOpen(false)} className="px-6 py-2.5 rounded-full text-sm font-medium bg-[#80C1FC] text-white shadow-sm hover:shadow-md active:scale-95 transition-all">Done</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Edit Modal (Restored Studio Design) */}
            {isEditOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-2xl shadow-2xl p-8 space-y-6 border border-neutral-200 dark:border-neutral-800">
                        <div>
                            <h2 className="text-2xl font-black text-neutral-800 dark:text-white uppercase tracking-tighter">Edit Post</h2>
                            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Update your entry details</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-2 mb-1 block">Title</label>
                                <input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full bg-neutral-50 dark:bg-neutral-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#80C1FC]/50 outline-none transition-all dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-2 mb-1 block">Content</label>
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    rows="6"
                                    className="w-full bg-neutral-50 dark:bg-neutral-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#80C1FC]/50 outline-none transition-all resize-none dark:text-white"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button onClick={() => setIsEditOpen(false)} className="px-6 py-2 rounded-full text-xs font-bold uppercase text-neutral-400 hover:text-neutral-600 transition-colors">Cancel</button>
                            <button
                                onClick={handleUpdate}
                                disabled={updating}
                                className="px-8 py-3 rounded-full text-white text-xs font-bold uppercase shadow-lg shadow-[#80C1FC]/20 active:scale-95 transition-all flex items-center gap-2"
                                style={{ backgroundColor: THEME_COLOR }}
                            >
                                {updating && <div className="w-3 h-3 border-2 border-white/30 border-t-white animate-spin rounded-full" />}
                                {updating ? "Saving..." : "Update Post"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #80C1FC; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default DeleteBlogPostModel;