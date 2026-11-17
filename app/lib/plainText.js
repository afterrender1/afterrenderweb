// Plain text from either an html post or an old markdown post (no tags, #, **, ---, link syntax).
// Shared by the blog list (client) and the blog post page (server); has no dependencies.
export const toPlainText = (content) =>
    String(content || "")
        .replace(/<[^>]+>/g, " ")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // markdown images
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // markdown links -> text
        .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "") // headings, quotes, list markers
        .replace(/^\s*([-*_]\s*){3,}$/gm, " ") // horizontal rules
        .replace(/(\*\*|__|\*|_|`|~~)/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();

// ~200 words per minute, at least 1
export const readMinutes = (text) => Math.max(1, Math.round(String(text).split(" ").filter(Boolean).length / 200));
