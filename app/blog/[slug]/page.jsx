import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Inter, Poppins } from "@/app/lib/fonts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ReadingProgress, CopyLinkButton } from "@/components/BlogPostClient";
import { sanitizeBlogHtml, toExcerpt } from "@/app/lib/blogContent";
import { getBlogBySlug, getRecentBlogs } from "@/app/lib/blogs";
import { toPlainText, readMinutes } from "@/app/lib/plainText";
import { OG_IMAGE } from "@/app/lib/seo";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600"] });

// Same base as metadataBase in app/layout.js
const SITE_URL = "https://www.afterrender.com";
const CALENDLY_URL = "https://calendly.com/afterrenderagency/new-meeting";

// Pages are cached and rebuilt at most once an hour; editing or deleting a post refreshes it right away
export const revalidate = 3600;

const formatDate = (iso, month = "long") => {
    const d = new Date(iso);
    return iso && !Number.isNaN(d.getTime())
        ? d.toLocaleDateString("en-US", { month, day: "numeric", year: "numeric", timeZone: "UTC" })
        : "";
};

const describe = (blog) => blog.excerpt || toExcerpt(blog.content) || toPlainText(blog.content).slice(0, 160);

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);
    if (!blog) return { title: "Post not found", robots: { index: false } };

    const description = describe(blog);
    const path = `/blog/${blog.slug}`;
    // Posts without a cover use the site's social card (this openGraph replaces the layout's, image included)
    const images = blog.image ? [{ url: blog.image, alt: blog.title }] : [{ ...OG_IMAGE, alt: blog.title }];

    return {
        // The root layout adds " | AfterRender"
        title: blog.title,
        description,
        keywords: blog.tags.length ? blog.tags.join(", ") : undefined,
        authors: [{ name: blog.author }],
        alternates: { canonical: path },
        openGraph: {
            title: blog.title,
            description,
            type: "article",
            url: path,
            siteName: "AfterRender",
            locale: "en_US",
            images,
            publishedTime: blog.createdAt || undefined,
            modifiedTime: blog.updatedAt || undefined,
            authors: [blog.author],
            tags: blog.tags.length ? blog.tags : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: blog.title,
            description,
            images: images.map((image) => image.url),
        },
    };
}

// Old posts are markdown. Rendered inside .blog-content so they get the same typography as html posts.
const MarkdownBody = ({ content }) => (
    <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
            // Bare spans in old posts were used as blue highlights; styled spans keep their own look.
            // `node` is pulled out so it isn't spread onto the DOM element.
            span: ({ node, className, style, ...props }) => (
                <span {...props} className={className || (style ? undefined : "font-semibold text-[#7cc0ff]")} style={style} />
            ),
        }}
    >
        {content}
    </ReactMarkdown>
);

const RelatedCard = ({ post }) => (
    <Link
        href={`/blog/${post.slug}`}
        className="group flex flex-col min-w-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#48A2FF]/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0a0a0a]"
    >
        <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-zinc-900">
            {post.image ? (
                <Image
                    src={post.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
            ) : (
                <div className="absolute inset-0 grid place-items-center">
                    <Image src="/logos/logoxar.png" alt="" width={40} height={40} className="opacity-30" />
                </div>
            )}
        </div>
        <p className="mt-4 text-xs text-zinc-500">
            {post.category && <span className="font-medium text-[#7cc0ff]">{post.category}</span>}
            {post.category && post.createdAt && <span aria-hidden="true"> · </span>}
            {post.createdAt && <time dateTime={post.createdAt}>{formatDate(post.createdAt, "short")}</time>}
        </p>
        <h3 className={`${poppins.className} mt-2 text-lg font-semibold leading-snug text-white group-hover:text-[#9fd0ff] transition-colors`}>
            {post.title}
        </h3>
    </Link>
);

export default async function BlogDetail({ params }) {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);
    if (!blog) notFound();

    const related = await getRecentBlogs(blog.slug, 3);
    const minutes = readMinutes(toPlainText(blog.content));
    const published = formatDate(blog.createdAt);
    const url = `${SITE_URL}/blog/${blog.slug}`;
    const shareText = encodeURIComponent(blog.title);
    const shareUrl = encodeURIComponent(url);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: blog.title,
        description: describe(blog),
        image: blog.image ? [blog.image] : undefined,
        datePublished: blog.createdAt || undefined,
        dateModified: blog.updatedAt || blog.createdAt || undefined,
        author: { "@type": "Organization", name: "AfterRender", url: SITE_URL },
        publisher: { "@type": "Organization", name: "AfterRender", url: SITE_URL },
        mainEntityOfPage: url,
        keywords: blog.tags.length ? blog.tags.join(", ") : undefined,
    };

    const pillLink =
        "inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-white/10 text-xs font-medium text-zinc-300 hover:border-white/25 hover:text-white transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#48A2FF]/60";

    return (
        <>
            <Navbar />
            <ReadingProgress />
            <script
                type="application/ld+json"
                // "<" is escaped so the JSON can never close the script tag
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
            />

            <main className={`min-h-screen bg-[#0a0a0a] text-zinc-300 ${inter.className}`}>
                <article className="pt-28 sm:pt-36">
                    {/* Header */}
                    <header className="max-w-[720px] mx-auto px-4 sm:px-6">
                        <Link
                            href="/blogs"
                            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors outline-none focus-visible:text-white"
                        >
                            <ArrowLeft size={15} />
                            All posts
                        </Link>

                        <p className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-500">
                            {blog.category && (
                                <>
                                    <span className="font-medium text-[#7cc0ff]">{blog.category}</span>
                                    <span aria-hidden="true">·</span>
                                </>
                            )}
                            <span>{minutes} min read</span>
                        </p>

                        <h1 className={`${poppins.className} mt-3 text-[1.85rem] leading-[1.2] sm:text-4xl md:text-[2.75rem] md:leading-[1.15] font-semibold tracking-tight text-white`}>
                            {blog.title}
                        </h1>

                        <div className="mt-6 flex items-center gap-3">
                            <span className="grid place-items-center size-10 shrink-0 rounded-full border border-white/10 bg-zinc-900">
                                <Image src="/logos/logoxar.png" alt="" width={22} height={22} className="object-contain" />
                            </span>
                            <div className="text-sm leading-tight">
                                <p className="font-medium text-white">{blog.author}</p>
                                {published && (
                                    <p className="mt-0.5 text-zinc-500">
                                        <time dateTime={blog.createdAt}>{published}</time>
                                    </p>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Cover image */}
                    {blog.image && (
                        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-10 sm:mt-12">
                            <div className="relative aspect-video overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-zinc-900">
                                <Image
                                    src={blog.image}
                                    alt={blog.title}
                                    fill
                                    priority
                                    sizes="(min-width: 1024px) 976px, 100vw"
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    )}

                    {/* Body */}
                    <div className="max-w-[720px] mx-auto px-4 sm:px-6 mt-10 sm:mt-14">
                        {blog.contentFormat === "html" ? (
                            // Sanitized when saved; sanitized again here as defense in depth
                            <div
                                className="blog-content text-[17px] sm:text-[18px] leading-[1.8] text-zinc-300"
                                dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(blog.content) }}
                            />
                        ) : (
                            <div className="blog-content text-[17px] sm:text-[18px] leading-[1.8] text-zinc-300">
                                <MarkdownBody content={blog.content} />
                            </div>
                        )}

                        {/* Tags + share */}
                        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            {blog.tags.length > 0 ? (
                                <ul className="flex flex-wrap gap-2" aria-label="Tags">
                                    {blog.tags.map((tag) => (
                                        <li key={tag} className="px-2.5 py-1 rounded-md bg-white/5 text-xs text-zinc-400">
                                            #{tag}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <span />
                            )}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs text-zinc-500 mr-1">Share</span>
                                <a
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={pillLink}
                                >
                                    LinkedIn
                                </a>
                                <a
                                    href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={pillLink}
                                >
                                    X
                                </a>
                                <CopyLinkButton url={url} className={pillLink} />
                            </div>
                        </div>

                        {/* Call to action */}
                        <aside className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                            <div className="flex items-center gap-3">
                                <Image src="/logos/logoxar.png" alt="" width={28} height={28} className="object-contain" />
                                <p className="text-sm font-medium text-white">AfterRender</p>
                            </div>
                            <p className={`${poppins.className} mt-4 text-xl sm:text-2xl font-semibold leading-snug text-white`}>
                                Want help putting this into practice?
                            </p>
                            <p className="mt-2 text-[15px] leading-relaxed text-zinc-400">
                                We&apos;re a creative studio for video editing, design and websites. Tell us about your project on a free call.
                            </p>
                            <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
                                <a
                                    href={CALENDLY_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center justify-center gap-1.5 h-11 px-5 rounded-lg bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] hover:brightness-105 text-[#0A2540] text-sm font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                                >
                                    Book a free call
                                    <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                                </a>
                                <Link
                                    href="/our-work"
                                    className="inline-flex items-center justify-center h-11 px-5 rounded-lg border border-white/15 hover:border-white/35 hover:bg-white/5 text-white text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                                >
                                    See our work
                                </Link>
                            </div>
                        </aside>
                    </div>
                </article>

                {/* Keep reading */}
                {related.length > 0 && (
                    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-24 pt-12 sm:pt-16 pb-20 sm:pb-24 border-t border-white/10">
                        <div className="flex items-end justify-between gap-4">
                            <h2 className={`${poppins.className} text-2xl font-semibold text-white`}>Keep reading</h2>
                            <Link href="/blogs" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors">
                                All posts
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((post) => (
                                <RelatedCard key={post.id} post={post} />
                            ))}
                        </div>
                    </section>
                )}
                {related.length === 0 && <div className="pb-20 sm:pb-24" />}
            </main>

            <Footer />
        </>
    );
}
