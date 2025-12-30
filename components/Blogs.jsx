"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Navbar from "./Navbar";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600"],
});

const AllBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = ["All", "Innovation", "Technology", "Development", "Design"];

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch("/api/blog");
                const data = await res.json();
                if (data.success) {
                    setBlogs(data.blogs);
                    setFilteredBlogs(data.blogs);
                }
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    // Filter Logic
    useEffect(() => {
        if (activeCategory === "All") {
            setFilteredBlogs(blogs);
        } else {
            setFilteredBlogs(blogs.filter(b => b.category === activeCategory));
        }
    }, [activeCategory, blogs]);

    return (
        <main className={`min-h-screen bg-[#050505] text-white ${poppins.className} selection:bg-indigo-500/30`}>
            <Navbar />

            {/* --- HERO SECTION --- */}
            <header className="relative pt-40 pb-16 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-linear-to-b from-white to-white/40 bg-clip-text text-transparent">
                            The Journal
                        </h1>
                        <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-lg font-light leading-relaxed">
                            A curated space for deep dives into tech, creative engineering, and the future of digital experiences.
                        </p>
                    </motion.div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap justify-center gap-3 mt-12">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 rounded-full text-xs font-medium border transition-all duration-300 ${activeCategory === cat
                                        ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                        : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* --- BLOG GRID --- */}
            <section className="container mx-auto px-6 pb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {loading ? (
                        [1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-[500px] bg-white/5 rounded-[2.5rem] animate-pulse border border-white/10" />
                        ))
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredBlogs.map((blog, index) => (
                                <motion.article
                                    key={blog._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className="group relative flex flex-col bg-white/3 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden hover:bg-white/6 hover:border-white/20 transition-all duration-500"
                                >
                                    {/* Image Wrapper */}
                                    <div className="relative h-64 w-full overflow-hidden">
                                        <Image
                                            src={blog.image || "/placeholder.jpg"}
                                            alt={blog.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/20 to-transparent opacity-80" />
                                        <div className="absolute bottom-4 left-6">
                                            <span className="px-3 py-1 bg-indigo-600 text-[9px] font-bold uppercase tracking-widest rounded-md shadow-lg">
                                                {blog.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-8 flex flex-col grow">
                                        <h3 className="text-2xl font-medium mb-4 leading-tight group-hover:text-indigo-300 transition-colors line-clamp-2">
                                            {blog.title}
                                        </h3>

                                        <p className="text-gray-400 text-[14px] font-light leading-relaxed line-clamp-3 mb-6">
                                            {blog.content}
                                        </p>

                                        {/* Separate Tags Section */}
                                        <div className="flex flex-wrap gap-2 mb-8">
                                            {blog.tags?.map((tag, i) => (
                                                <span key={i} className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-md text-[10px] text-gray-500 hover:border-indigo-500/50 hover:text-indigo-400 transition-colors">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Footer Area */}
                                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold shadow-xl">
                                                    {blog.author?.charAt(0) || "A"}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-semibold text-white">Editorial Team</span>
                                                    <span className="text-[9px] text-gray-500 uppercase tracking-tighter">
                                                        {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-xl"
                                            >
                                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M8.14645 3.14645L12.8536 7.14645L8.14645 11.1464" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </section>
        </main>
    );
};

export default AllBlogs;