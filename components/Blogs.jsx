"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Poppins, Inter } from "@/app/lib/fonts";
import { getCachedBlogs } from "@/app/lib/blogCache";
import { toPlainText, readMinutes } from "@/app/lib/plainText";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600"] });
const inter = Inter({ subsets: ["latin"] });

// Preferred tab order; any other category that has posts is listed after these
const CATEGORY_ORDER = ["Design", "Technology", "Innovation", "Development"];


const formatDate = (value) => {
    const d = new Date(value);
    return Number.isNaN(d.getTime())
        ? ""
        : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

// Adds the derived fields the cards need once, instead of on every render
const preparePost = (blog) => {
    const text = toPlainText(blog.content);
    return {
        id: blog._id,
        slug: blog.slug,
        title: blog.title,
        image: blog.image,
        category: blog.category?.trim() || "General",
        date: formatDate(blog.createdAt),
        excerpt: blog.excerpt?.trim() || text,
        minutes: readMinutes(text),
    };
};

const Meta = ({ post }) => (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500">
        <span className="font-medium text-[#7cc0ff]">{post.category}</span>
        <span aria-hidden="true">·</span>
        {post.date && (
            <>
                <time>{post.date}</time>
                <span aria-hidden="true">·</span>
            </>
        )}
        <span>{post.minutes} min read</span>
    </p>
);

const Cover = ({ post, sizes, priority = false }) =>
    post.image ? (
        <Image
            src={post.image}
            alt=""
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
    ) : (
        <div className="absolute inset-0 grid place-items-center bg-zinc-900">
            <Image src="/logos/logoxar.png" alt="" width={40} height={40} className="opacity-30" />
        </div>
    );

const FeaturedPost = ({ post }) => (
    <Link
        href={`/blog/${post.slug}`}
        className="group grid md:grid-cols-[1.15fr_1fr] gap-5 md:gap-8 items-center rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#48A2FF]/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0a0a0a]"
    >
        <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-zinc-900">
            <Cover post={post} sizes="(min-width: 1024px) 620px, (min-width: 768px) 55vw, 100vw" priority />
        </div>
        <div className="min-w-0">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Latest post</p>
            <h2 className={`${poppins.className} text-2xl sm:text-3xl font-semibold leading-snug text-white group-hover:text-[#9fd0ff] transition-colors`}>
                {post.title}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-zinc-400 line-clamp-3">{post.excerpt}</p>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <Meta post={post} />
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white">
                    Read article
                    <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
            </div>
        </div>
    </Link>
);

const PostCard = ({ post }) => (
    <Link
        href={`/blog/${post.slug}`}
        className="group flex flex-col min-w-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#48A2FF]/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0a0a0a]"
    >
        <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-zinc-900">
            <Cover post={post} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" />
        </div>
        <div className="pt-4 flex flex-col flex-1">
            <Meta post={post} />
            <h3 className={`${poppins.className} mt-2 text-lg font-semibold leading-snug text-white group-hover:text-[#9fd0ff] transition-colors`}>
                {post.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400 line-clamp-3">{post.excerpt}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-200">
                Read article
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
        </div>
    </Link>
);

const CardSkeleton = () => (
    <div className="animate-pulse">
        <div className="aspect-video rounded-xl bg-white/5" />
        <div className="mt-4 h-3 w-1/3 rounded bg-white/5" />
        <div className="mt-3 h-5 w-5/6 rounded bg-white/5" />
        <div className="mt-2 h-4 w-full rounded bg-white/5" />
        <div className="mt-1.5 h-4 w-2/3 rounded bg-white/5" />
    </div>
);

const AllBlogs = () => {
    const [blogs, setBlogs] = useState(null); // null = loading
    const [failed, setFailed] = useState(false);
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        let cancelled = false;
        getCachedBlogs()
            .then((data) => {
                if (!cancelled) setBlogs(Array.isArray(data) ? data : []);
            })
            .catch(() => {
                if (!cancelled) {
                    setFailed(true);
                    setBlogs([]);
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    // Newest first, whatever order the API returns
    const posts = useMemo(
        () =>
            (blogs || [])
                .filter((b) => b?.slug && b?.title)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map(preparePost),
        [blogs]
    );

    // Only categories that actually have posts, with their counts
    const categories = useMemo(() => {
        const counts = new Map();
        posts.forEach((p) => counts.set(p.category, (counts.get(p.category) || 0) + 1));
        const known = CATEGORY_ORDER.filter((c) => counts.has(c));
        const others = [...counts.keys()].filter((c) => !CATEGORY_ORDER.includes(c)).sort();
        return [{ name: "All", count: posts.length }, ...[...known, ...others].map((name) => ({ name, count: counts.get(name) }))];
    }, [posts]);

    const visible = activeCategory === "All" ? posts : posts.filter((p) => p.category === activeCategory);
    // The newest post gets the large slot only on the unfiltered view
    const featured = activeCategory === "All" ? visible[0] : null;
    const rest = featured ? visible.slice(1) : visible;
    const loading = blogs === null;

    return (
        <main className={`min-h-screen bg-[#0a0a0a] text-white ${inter.className}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 sm:pb-28">
                {/* Header */}
                <header className="max-w-2xl">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Blog</p>
                    <h1 className={`${poppins.className} mt-3 text-4xl sm:text-5xl font-semibold tracking-tight`}>The Journal</h1>
                    <p className="mt-3 text-[15px] sm:text-base leading-relaxed text-zinc-400">
                        Ideas, guides and case studies on video, design and marketing from the AfterRender team.
                    </p>
                </header>

                {/* Category filter */}
                {posts.length > 0 && (
                    <nav aria-label="Filter by category" className="mt-8 sm:mt-10 border-b border-white/10">
                        <ul className="-mb-px flex gap-5 sm:gap-7 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {categories.map(({ name, count }) => {
                                const active = activeCategory === name;
                                return (
                                    <li key={name} className="shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setActiveCategory(name)}
                                            aria-pressed={active}
                                            className={`flex items-center gap-1.5 pb-3 text-sm border-b-2 transition-colors cursor-pointer outline-none focus-visible:text-white ${
                                                active
                                                    ? "border-[#48A2FF] text-white font-medium"
                                                    : "border-transparent text-zinc-500 hover:text-zinc-200"
                                            }`}
                                        >
                                            {name}
                                            <span className={`text-xs tabular-nums ${active ? "text-zinc-400" : "text-zinc-600"}`}>{count}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                )}

                {/* Posts */}
                <section className="mt-10 sm:mt-12" aria-live="polite">
                    {loading ? (
                        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <CardSkeleton key={i} />
                            ))}
                        </div>
                    ) : failed ? (
                        <p className="py-16 text-center text-sm text-zinc-400">
                            Couldn&apos;t load the posts right now. Please refresh the page to try again.
                        </p>
                    ) : visible.length === 0 ? (
                        <p className="py-16 text-center text-sm text-zinc-400">No posts here yet. Check back soon.</p>
                    ) : (
                        <>
                            {featured && <FeaturedPost post={featured} />}
                            {rest.length > 0 && (
                                <div
                                    className={`grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 ${
                                        featured ? "mt-12 sm:mt-16 pt-12 sm:pt-16 border-t border-white/10" : ""
                                    }`}
                                >
                                    {rest.map((post) => (
                                        <PostCard key={post.id} post={post} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>
        </main>
    );
};

export default AllBlogs;
