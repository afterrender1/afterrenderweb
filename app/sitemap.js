// app/sitemap.js
import dbConnect from "@/app/lib/db";
import Blog from "@/app/models/Post"; 

export default async function sitemap() {
    await dbConnect();

    const blogs = await Blog.find(
        { published: true },
        { slug: 1, createdAt: 1 }
    ).lean();

    const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const staticPages = ["", "/social-media", "/our-work", "/services"];

    return [
        // Static pages
        ...staticPages.map((path) => ({
            url: `${baseUrl}${path}`,
            lastModified: new Date().toISOString(),
            changeFrequency: path === "" ? "daily" : "weekly",
            priority: path === "" ? 1.0 : 0.8,
        })),

        // Blog pages
        ...blogs.map((blog) => ({
            url: `${baseUrl}/blog/${encodeURIComponent(blog.slug)}`,
            lastModified: blog.createdAt
                ? new Date(blog.createdAt).toISOString()
                : new Date().toISOString(),
            changeFrequency: "monthly",
            priority: 0.7,
        })),
    ];
}
