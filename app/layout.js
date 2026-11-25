import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import CrispChat from "@/components/CrispChat";
import LazyFloatingChat from "@/components/LazyFloatingChat";
import DeferredAnalytics from "@/components/DeferredAnalytics";
import JsonLd from "@/components/JsonLd";
import { Poppins, Montserrat, Michroma, Space_Grotesk, Plus_Jakarta_Sans } from "@/app/lib/fonts";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  OG_IMAGE,
  KEYWORDS,
  jsonLdGraph,
  organizationJsonLd,
  websiteJsonLd,
} from "@/app/lib/seo";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const michroma = Michroma({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-michroma",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const DEFAULT_TITLE = "Unlimited Video Editing Services in the USA | AfterRender";

// Site-wide defaults. Every page sets its own title, description, keywords and canonical
// through pageMetadata() (app/lib/seo.js). There is deliberately NO canonical here: a
// canonical in the root layout is inherited by every page that doesn't override it, which
// told Google that all those pages were duplicates of the home page.
export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: DEFAULT_TITLE,
    template: "%s | AfterRender",
  },
  description: SITE_DESCRIPTION,
  keywords: KEYWORDS.core,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Video Editing Services",
  formatDetection: { telephone: false, address: false, email: false },

  openGraph: {
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [{ ...OG_IMAGE, alt: DEFAULT_TITLE }],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // Google Search Console ownership is verified with public/google252ea89853e9290a.html
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A2540",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${poppins.variable} ${montserrat.variable} ${michroma.variable} ${spaceGrotesk.variable} ${jakarta.variable}`}
    >
      <body suppressHydrationWarning className={poppins.className}>
        {/* Who AfterRender is (Organization) and the site itself (WebSite), on every page */}
        <JsonLd data={jsonLdGraph(organizationJsonLd(), websiteJsonLd())} />

        {/* Google Analytics + Meta Pixel, loaded on first interaction (see component) */}
        <DeferredAnalytics />

        {/* Meta Pixel fallback for visitors without JS */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1024339690404455&ev=PageView&noscript=1"
            alt="Meta Pixel"
          />
        </noscript>
        {/* End Meta Pixel Code */}

        <Analytics />
        {children}
        <LazyFloatingChat />
      </body>
    </html>
  );
}