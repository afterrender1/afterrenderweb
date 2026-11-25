// app/manifest.js -> /manifest.webmanifest (install / "Add to Home Screen" details)
import { SITE_NAME, SITE_DESCRIPTION } from "@/app/lib/seo";

export default function manifest() {
  return {
    name: `${SITE_NAME} | Unlimited Video Editing Services`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#07090E",
    theme_color: "#0A2540",
    categories: ["business", "productivity", "photo"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
