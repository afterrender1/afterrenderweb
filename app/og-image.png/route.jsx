// /og-image.png: the 1200x630 social preview card (Open Graph / Twitter) used by every page
// that has no image of its own. Generated once at build time.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export async function GET() {
  const logo = await readFile(join(process.cwd(), "public/logos/logoxar.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #07090E 0%, #0A2540 60%, #123A66 100%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={logoSrc} width={72} height={72} />
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>AfterRender</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 800, lineHeight: 1.08, letterSpacing: -2 }}>
            Unlimited Video Editing
          </div>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 800, lineHeight: 1.08, letterSpacing: -2, color: "#7EC0FF" }}>
            One Monthly Subscription.
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: "#C9E4FF" }}>
            YouTube · Reels · TikTok · Ads · Real Estate · Graphic Design · AI Avatars
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, color: "#9FC8F1" }}>
          <div style={{ display: "flex" }}>US video editing agency · Unlimited revisions</div>
          <div style={{ display: "flex", fontWeight: 700, color: "#FFFFFF" }}>afterrender.com</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
