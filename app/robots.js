export default function robots() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.afterrender.com";

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            // Prefix rules cover each route, its subpages, and query strings.
            disallow: [
                "/admin",
                "/api",
                "/profile",
                "/login",
                "/signup",
                "/forgot-password",
                "/reset-password",
                "/verify-email",
            ],
        },
        sitemap: new URL("/sitemap.xml", baseUrl).href,
    };
}
