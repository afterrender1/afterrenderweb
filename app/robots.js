// app/robots.js -> /robots.txt
import { SITE_URL } from "@/app/lib/seo";

// Private areas: the admin panel and the API (forms, admin actions). Everything else is public.
// /_next/ is NOT blocked: Google needs the JS/CSS to render the pages.
const PRIVATE = ["/admin", "/admin/", "/api/"];

// AI search / assistant crawlers, allowed explicitly so AfterRender can be cited and recommended
// in ChatGPT, Claude, Perplexity, Gemini, Copilot and Apple answers (AIO / GEO).
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "Amazonbot",
  "meta-externalagent",
  "CCBot",
];

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
