// Only allow same-site relative paths as post-login redirects (blocks open redirects).
// Safe to import from both server and client code.
export const safeRedirectPath = (value, fallback = "/profile") => {
    if (typeof value !== "string" || value.length > 512) return fallback;
    if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
    if (/[\u0000-\u001F\u007F]/.test(value)) return fallback;
    if (value.startsWith("/api/")) return fallback;
    return value;
};
