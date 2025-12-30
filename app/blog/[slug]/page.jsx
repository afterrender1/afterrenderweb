import Image from "next/image";
import { Inter, Montserrat } from "next/font/google";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

export default async function BlogDetail({ params }) {
    const { slug } = await params;
    const res = await fetch(`http://localhost:3000/api/blog?slug=${slug}`, {
        next: { revalidate: 3600 },
    });

    const data = await res.json();
    if (!data?.success) return <p className="pt-40 text-center text-white/50 font-light">Post not found</p>;
    const blog = data.blog;

    return (
        <main className={`relative min-h-screen bg-[#0a0a0a] text-zinc-300 ${inter.className} selection:bg-indigo-500/30`}>
            <Navbar />

            {/* Subtle Top Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[40vh] bg-indigo-500/5 blur-[120px] pointer-events-none" />

            <article className="relative z-10 max-w-[720px] mx-auto px-6 pt-40 pb-32">

                {/* 1. Header: Minimal & Balanced */}
                <header className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-indigo-400 mb-6">
                        <span>{blog.category}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-800" />
                        <span className="text-zinc-500">5 min read</span>
                    </div>

                    <h1 className={` text-4xl md:text-6xl text-white leading-[1.15] mb-8 tracking-tight`}>
                        {blog.title}
                    </h1>

                    <div className="flex items-center justify-center gap-3 text-xs text-zinc-500 font-medium">
                        <span className="text-zinc-300">By {blog.author}</span>
                        <span className="text-zinc-800">—</span>
                        <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                    </div>
                </header>

                {/* 2. Hero Image: Clean Corners */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-zinc-900 mb-20 shadow-2xl">
                    <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* 3. Body: High Readability */}
                <div className="prose prose-invert prose-zinc max-w-none">
                    <div className="whitespace-pre-line space-y-10 text-[18px] leading-[1.85] text-zinc-300 font-light tracking-wide">
                        {/* Dropcap simplified for "Clean" look */}
                        <div className=" ">
                            {blog.content}
                        </div>
                    </div>
                </div>

                {/* 4. Footer: Minimalist Tags */}
                <footer className="mt-24 pt-12 border-t border-zinc-900">
                    <div className="flex flex-wrap gap-2">
                        {blog.tags?.map((tag, i) => (
                            <span
                                key={i}
                                className="px-3 py-1 text-[11px] font-medium rounded-md bg-zinc-900 text-zinc-500 hover:text-indigo-400 transition-colors cursor-default"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Simple Author Credit */}
                    <div className="mt-16 flex items-center gap-4 p-8 rounded-2xl bg-zinc-900/40 border border-zinc-900">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                            {blog.author?.charAt(0)}
                        </div>
                        <p className="text-sm text-zinc-400">
                            Published by <span className="text-white font-medium">{blog.author}</span>. Focused on minimal design and digital strategy.
                        </p>
                    </div>
                </footer>
            </article>

            {/* Reading Progress bar - Ultra Slim */}
            <div className="fixed top-0 left-0 w-full h-px z-100">
                <div className="h-full bg-indigo-500/50 w-0 transition-all duration-200" id="progress-bar" />
            </div>
        </main>
    );
}