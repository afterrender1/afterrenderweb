// lib/blogCache.js
let cachedBlogs = null;

export const getCachedBlogs = async () => {
    if (cachedBlogs) return cachedBlogs; // return cached data if available

    const res = await fetch("/api/blog");
    const data = await res.json();

    if (data.success) cachedBlogs = data.blogs; // store in cache
    return cachedBlogs || [];
};
