import sanitizeHtml from "sanitize-html";

const COLOR = /^(#[0-9a-f]{3,8}|rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*[\d.]+\s*)?\))$/i;
const ALIGN = /^(left|center|right|justify)$/;

// Server-only: cleans editor HTML down to the tags/styles the blog editor can produce
export const sanitizeBlogHtml = (html) =>
    sanitizeHtml(String(html ?? ""), {
        allowedTags: [
            "p", "br", "h1", "h2", "h3", "strong", "b", "em", "i", "u", "s",
            "code", "pre", "blockquote", "ul", "ol", "li", "a", "hr", "span", "mark",
        ],
        allowedAttributes: {
            a: ["href", "target", "rel"],
            span: ["style"],
            mark: ["style", "data-color"],
            p: ["style"],
            h1: ["style"],
            h2: ["style"],
            h3: ["style"],
        },
        allowedStyles: {
            "*": {
                color: [COLOR],
                "background-color": [COLOR],
                "text-align": [ALIGN],
            },
        },
        allowedSchemes: ["http", "https", "mailto"],
        transformTags: {
            a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true),
        },
    });

// Plain-text summary used for meta descriptions and card excerpts
export const toExcerpt = (html, len = 160) =>
    sanitizeHtml(String(html ?? ""), { allowedTags: [], allowedAttributes: {} })
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, len);
