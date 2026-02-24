"use client";
import React, { useState, useEffect } from 'react';

const DeleteBlogPostModel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // Brand Theme Color
    const THEME_COLOR = "#80C1FC";
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            fetchBlogs();
        } else {
            document.body.style.overflow = 'unset';
        }
        // Cleanup on unmount
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);
    useEffect(() => {
        if (isOpen) fetchBlogs();
    }, [isOpen]);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/blog');
            const data = await res.json();
            setBlogs(data.blogs || data);
        } catch (err) {
            console.error("Failed to fetch blogs", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            const res = await fetch(`/api/blog/delete-blog/${id}`, { method: "DELETE" });
            if (res.ok) {
                setBlogs(blogs.filter(blog => blog._id !== id));
            }
        } catch (err) {
            alert("Error deleting blog");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="p-4">
            {/* 1. Manage Blogs Button with #80C1FC Glow */}
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

                <span className="inset-0 absolute pointer-events-none select-none animate-[border-glow-translate_10s_ease-in-out_infinite_alternate]">
                    <span
                        className="block z-0 h-full w-12 blur-xl -translate-x-1/2 rounded-full animate-[border-glow-scale_10s_ease-in-out_infinite_alternate]"
                        style={{ background: `linear-gradient(135deg, ${THEME_COLOR}, #4facfe, #00f2fe)` }}
                    ></span>
                </span>

                <span className="flex items-center justify-center gap-1 relative z-1 dark:bg-neutral-950/90 bg-neutral-50/90 rounded-full py-2.5 px-5 pl-3 w-full">
                    <span className="relative group-hover:rotate-180 transition-transform duration-700">
                        <svg
                            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={THEME_COLOR}
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </span>
                    <span className=" bg-neutral-900 dark:bg-white bg-clip-text text-[11px] font-bold uppercase tracking-widest text-transparent">
                        Manage Blogs
                    </span>
                </span>
            </button>

            {/* 2. Modal Overlay with #80C1FC Accents */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 backdrop-blur-[2px] p-4 transition-all">
                    {/* Google Material Surface Container */}
                    <div className="bg-white w-full max-w-xl max-h-[75vh] overflow-hidden rounded-xl shadow-2xl flex flex-col border border-neutral-200">

                        {/* Google Style Header */}
                        <div className="px-6 pt-6 pb-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div
                                    className="p-2 rounded-lg"
                                    style={{ backgroundColor: `${THEME_COLOR}20` }}
                                >
                                    <svg
                                        width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={THEME_COLOR}
                                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                                    >
                                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </div>
                                <h2 className="text-[22px] font-medium text-neutral-800 tracking-tight">
                                    Manage blogs
                                </h2>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 transition-colors"
                            >
                                <span className="text-xl">✕</span>
                            </button>
                        </div>

                        {/* Search Bar / Filter (Very Google) */}
                        <div className="px-6 pb-2">
                            <div className="bg-neutral-100 rounded-full px-4 py-2 flex items-center gap-3 border border-transparent focus-within:border-neutral-300 transition-all">
                                <span className="text-neutral-400">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search your blogs"
                                    className="bg-transparent text-sm outline-none w-full text-neutral-700 placeholder-neutral-500"
                                />
                            </div>
                        </div>

                        {/* List Area */}
                        <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
                            {loading ? (
                                <div className="py-20 flex justify-center">
                                    <div className="w-8 h-8 border-[3px] border-neutral-200 border-t-[#80C1FC] animate-spin rounded-full"></div>
                                </div>
                            ) : (
                                <div className="px-2 py-2">
                                    {blogs.map((blog) => (
                                        <div
                                            key={blog._id}
                                            className="group flex items-center justify-between gap-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors duration-200"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-neutral-900 text-[15px] truncate">
                                                    {blog.title}
                                                </h3>
                                                <p className="text-neutral-500 text-sm mt-0.5 truncate">
                                                    {blog.content || "No description provided"}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => handleDelete(blog._id)}
                                                disabled={deletingId === blog._id}
                                                className="px-4 py-2 rounded-full border border-neutral-300 text-red-600 hover:bg-red-50 text-sm font-medium transition-all active:scale-95 disabled:opacity-30"
                                            >
                                                {deletingId === blog._id ? "Removing..." : "Delete"}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 flex justify-end items-center gap-3 border-t border-neutral-100">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-6 py-2.5 rounded-full text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{ backgroundColor: THEME_COLOR }}
                                className="px-6 py-2.5 rounded-full text-sm font-medium text-white shadow-sm hover:shadow-md transition-all active:scale-95"
                            >
                                Done
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