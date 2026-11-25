// app/sitemap.js -> /sitemap.xml
// Every public, indexable page plus every blog post, on the canonical www host.
// Not listed on purpose: /admin and /api (private, also blocked in robots.js).
import { SITE_URL } from "@/app/lib/seo";
import { getBlogList } from "@/app/lib/blogs";

// Rebuilt at most once an hour; creating, editing or deleting a post refreshes it right away
export const revalidate = 3600;

const STATIC_PAGES = [
    { path: "/", changeFrequency: "daily", priority: 1.0 },
    { path: "/pricing", changeFrequency: "weekly", priority: 0.9 },
    { path: "/pricing/on-demand", changeFrequency: "weekly", priority: 0.9 },
    { path: "/our-work", changeFrequency: "weekly", priority: 0.8 },
    // /real-estate is intentionally left out of the sitemap
    { path: "/website", changeFrequency: "monthly", priority: 0.8 },
    { path: "/ai-avatars", changeFrequency: "monthly", priority: 0.8 },
    { path: "/about-us", changeFrequency: "monthly", priority: 0.7 },
    { path: "/blogs", changeFrequency: "weekly", priority: 0.7 },
    { path: "/applynow", changeFrequency: "monthly", priority: 0.6 },
    { path: "/apply", changeFrequency: "monthly", priority: 0.4 },
    { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/refund-policy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms-conditions", changeFrequency: "yearly", priority: 0.3 },
];

const url = (path) => (path === "/" ? SITE_URL : `${SITE_URL}${path}`);

export default async function sitemap() {
    const now = new Date();
    // null when the database is unreachable: the static pages are still served
    const blogs = (await getBlogList()) || [];

    return [
        ...STATIC_PAGES.map(({ path, changeFrequency, priority }) => ({
            url: url(path),
            lastModified: now,
            changeFrequency,
            priority,
        })),

        ...blogs.map((blog) => ({
            url: url(`/blog/${encodeURIComponent(blog.slug)}`),
            lastModified: new Date(blog.updatedAt || blog.createdAt || now),
            changeFrequency: "monthly",
            priority: 0.6,
            ...(blog.image ? { images: [blog.image] } : {}),
        })),
    ];
}
