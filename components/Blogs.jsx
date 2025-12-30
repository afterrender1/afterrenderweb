"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Poppins, Inter } from "next/font/google";
import Image from "next/image";
import Navbar from "./Navbar";
import { useRouter } from "next/navigation";
import { getCachedBlogs } from "@/app/lib/blogCache";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600"] });
const inter = Inter({ subsets: ["latin"] });

const AllBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const router = useRouter();

    const categories = ["All", "Innovation", "Technology", "Development", "Design"];

    useEffect(() => {
        const fetchBlogs = async () => {
            const data = await getCachedBlogs(); // use cache
            setBlogs(data);
            setFilteredBlogs(data);
            setLoading(false);
        };
        fetchBlogs();
    }, []);

    useEffect(() => {
        if (activeCategory === "All") {
            setFilteredBlogs(blogs);
        } else {
            setFilteredBlogs(blogs.filter((b) => b.category === activeCategory));
        }
    }, [activeCategory, blogs]);

    return (
        <main
            className={`min-h-screen bg-[#050505] text-white ${inter.className} selection:bg-white selection:text-black`}
        >
            {/* Background Layer */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e1b4b,transparent)] opacity-40" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
            </div>

            <div className="relative z-10">
                <Navbar />

                {/* --- HERO SECTION --- */}
                <header className="pt-48 pb-20 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs font-bold tracking-[0.3em] uppercase text-indigo-500 mb-4 block"
                        >
                            Our Perspectives
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`text-6xl md:text-8xl font-medium tracking-tight mb-8 ${poppins.className}`}
                        >
                            The <span className="text-gray-500">Journal.</span>
                        </motion.h1>

                        {/* Category Tabs */}
                        <div className="flex flex-wrap justify-center gap-2 mt-12">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-5 py-2 rounded-full text-[13px] transition-all duration-300 border ${activeCategory === cat
                                        ? "bg-white text-black border-white"
                                        : "bg-transparent border-white/10 text-gray-500 hover:border-white/40"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            Array(6)
                                .fill(0)
                                .map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-[450px] bg-white/5 rounded-3xl animate-pulse"
                                    />
                                ))
                        ) : (
                            <AnimatePresence mode="popLayout">
                                {filteredBlogs.map((blog, index) => (
                                    <motion.article
                                        key={blog._id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                        onClick={() => router.push(`/blog/${blog.slug}`)}
                                        className="group cursor-pointer"
                                    >
                                        <div className="relative h-[450px] w-full rounded-4xl overflow-hidden border border-white/10 bg-white/5 transition-all duration-500 group-hover:border-white/20 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                            <Image
                                                src={blog.image || "/placeholder.jpg"}
                                                alt={blog.title}
                                                fill
                                                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
                                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                                <div className="mb-4">
                                                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest rounded-full">
                                                        {blog.category}
                                                    </span>
                                                </div>

                                                <h3 className="text-2xl font-semibold mb-3 leading-tight group-hover:text-indigo-300 transition-colors">
                                                    {blog.title}
                                                </h3>

                                                <p className="text-gray-400 text-sm line-clamp-2 mb-6 font-light">
                                                    {blog.content}
                                                </p>

                                                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <div className="relative w-6 h-6">
                                                            <Image src="/logos/logoxar.png" alt="Logo" fill className="object-contain" />
                                                        </div>
                                                        <span className="text-gray-400 font-medium">
                                                            AfterRender • {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                        </span>
                                                    </div>

                                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <svg
                                                            width="12"
                                                            height="12"
                                                            viewBox="0 0 15 15"
                                                            fill="none"
                                                            className="text-white"
                                                        >
                                                            <path
                                                                d="M8.14645 3.14645L12.8536 7.14645L8.14645 11.1464"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.article>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default AllBlogs;
