import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { Poppins, Montserrat, Michroma, Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";

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

export const metadata = {
  metadataBase: new URL("https://www.afterrender.com"),

  title: {
    default: "AfterRender",
    template: "%s | AfterRender",
  },

  description:
    "We’ll build your YouTube growth funnel — organic + maximum potential. If we don’t deliver, you don’t pay us.",

  openGraph: {
    title: "AfterRender",
    description:
      "We’ll build your YouTube growth funnel — organic + maximum potential. If we don’t deliver, you don’t pay.",
    url: "https://www.afterrender.com",
    siteName: "AfterRender",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${poppins.variable} ${montserrat.variable} ${michroma.variable} ${spaceGrotesk.variable} ${jakarta.variable}`}
    >
      <body suppressHydrationWarning className={poppins.className}>
        {/* Meta Pixel Code */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1024339690404455');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1024339690404455&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}

        <Analytics />
        {children}
      </body>
    </html>
  );
}