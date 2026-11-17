import { cache } from "react";

// Server-only reads for the public blog pages. Plain objects only (no ObjectId / Date instances),
// so the results can be passed to client components safely.

const toPost = (doc) => ({
    id: String(doc._id),
    title: doc.title,
    slug: doc.slug,
    content: doc.content || "",
    contentFormat: doc.contentFormat === "html" ? "html" : "markdown",
    excerpt: doc.excerpt || "",
    image: doc.image || "",
    author: doc.author || "AfterRender",
    category: doc.category?.trim() || "",
    tags: Array.isArray(doc.tags) ? doc.tags.filter(Boolean) : [],
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : "",
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : "",
});

// cache(): generateMetadata and the page share one database read per request
export const getBlogBySlug = cache(async (slug) => {
    if (typeof slug !== "string" || !slug) return null;
    try {
        // Imported lazily so a missing DB config can't break the page
        const { default: dbConnect } = await import("@/app/lib/db");
        const { default: Blog } = await import("@/app/models/Post");
        await dbConnect();
        const doc = await Blog.findOne({ slug }).lean();
        return doc ? toPost(doc) : null;
    } catch (err) {
        console.error("Failed to load blog post:", err);
        return null;
    }
});

// Latest posts other than `excludeSlug`, for the "Keep reading" list
export const getRecentBlogs = cache(async (excludeSlug, limit = 3) => {
    try {
        const { default: dbConnect } = await import("@/app/lib/db");
        const { default: Blog } = await import("@/app/models/Post");
        await dbConnect();
        const docs = await Blog.find({ slug: { $ne: excludeSlug } })
            .sort({ createdAt: -1 })
            .limit(limit)
            .select("title slug image category createdAt")
            .lean();
        return docs.map((d) => ({
            id: String(d._id),
            title: d.title,
            slug: d.slug,
            image: d.image || "",
            category: d.category?.trim() || "",
            createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : "",
        }));
    } catch (err) {
        console.error("Failed to load recent blog posts:", err);
        return [];
    }
});
