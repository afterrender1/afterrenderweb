import "./globals.css";
import { Analytics } from "@vercel/analytics/next"




export const metadata = {
  title: {
    default: "AfterRender",
    template: "%s | AfterRender",
  },
  description:
    "We’ll build your YouTube growth funnel — organic + maximum potential. If we don’t deliver, you don’t pay us.",
  keywords: [
    "YouTube growth",
    "YouTube automation",
    "video editing",
    "YouTube agency",
    "cash cow channel",
    "YouTube video production",
    "thumbnail design",
    "script writing",
    "SEO optimization",
    "web development",
    "digital marketing",
    "content creation",
  ],
  authors: [{ name: "Arham Khan" }],
  creator: "AfterRender",
  publisher: "AfterRender",

  openGraph: {
    title: "AfterRender",
    description:
      "We’ll build your YouTube growth funnel — organic + maximum potential. If we don’t deliver, you don’t pay.",
    url: "https://www.afterrender.com",
    siteName: "AfterRender", // ← This makes Google show just "AfterRender" in search results
    images: [
      {
        url: "/logos/logoxar.png",
        width: 1200,
        height: 630,
        alt: "AfterRender – YouTube Growth Agency",
      },
    ],
    locale: "en_US",
    type: "website",
  },



  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://www.afterrender.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body

      >
        <Analytics />
        {children}
      </body>
    </html>
  );
}