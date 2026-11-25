import Navbar from "@/components/Navbar";
import WebsiteHero from "@/components/WebsiteHero";
import WebsiteSections from "@/components/WebsiteSections";
import WebsitePortfolio from "@/components/WebsitePortfolio";
import WebsiteIntroVideo from "@/components/WebsiteIntroVideo";
import WebsiteVideoTestimonials from "@/components/WebsiteVideoTestimonials";
import Footer from "@/components/Footer";
import React from "react";
import { getPortfolioItems } from "@/app/lib/portfolio";
import { getActiveEvent } from "@/app/lib/heroEvents";
import { getVideoReviewsByIds } from "@/app/lib/videoReviews";
import JsonLd from "@/components/JsonLd";
import { WEBSITE_FAQS } from "@/app/lib/faqData";
import {
  KEYWORDS,
  pageMetadata,
  jsonLdGraph,
  webPageJsonLd,
  serviceJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/app/lib/seo";

// Portfolio and event changes revalidate this page immediately; this is just a safety net
export const revalidate = 600;

const HALLOWEEN_INTRO_URL =
  "https://res.cloudinary.com/dlurrugno/video/upload/v1792585980/web-video-haloween_online-video-cutter.com_zgfwit.mp4";
const HALLOWEEN_INTRO_MOBILE_URL =
  "https://res.cloudinary.com/dlurrugno/video/upload/v1792585981/mob-video-haloween_online-video-cutter.com_dlevfo.mp4";

// VideoReview ids shown above the FAQ, in this order
const WEBSITE_REVIEW_IDS = [
  "6ac8faf9c968d4a2292bcdb7",
  "6ac8fab8c968d4a2292bcdb6",
  "6ac8f3f7c968d4a2292bcdad",
];

// Matches "Halloween", "Haloween", "halloween 2026" etc. in the event name
const isHalloweenEvent = (event) => /hal+o+w+e+n/i.test(event?.name || "");

const TITLE = "Website Design & Development in the USA";
const DESCRIPTION =
  "Custom, fast and SEO-ready websites that convert visitors into clients. Landing pages, business websites, e-commerce stores and more by AfterRender.";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/website",
  keywords: [...KEYWORDS.website, "web design California", "WordPress website development", "Shopify website design"],
});

const WebsitePage = async () => {
  const [portfolio, event, reviews] = await Promise.all([
    getPortfolioItems(),
    getActiveEvent(),
    getVideoReviewsByIds(WEBSITE_REVIEW_IDS),
  ]);

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-black pb-8">
      <JsonLd
        data={jsonLdGraph(
          webPageJsonLd({ path: "/website", name: TITLE, description: DESCRIPTION }),
          serviceJsonLd({
            name: "Website Design & Development",
            serviceType: "Website design and development",
            description: DESCRIPTION,
            path: "/website",
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Website Design", path: "/website" },
          ]),
          faqJsonLd(WEBSITE_FAQS, "/website")
        )}
      />
      {isHalloweenEvent(event) && <WebsiteIntroVideo src={HALLOWEEN_INTRO_URL} mobileSrc={HALLOWEEN_INTRO_MOBILE_URL} />}
      <Navbar />
      <WebsiteHero
        backgroundUrl={event?.backgroundUrl}
        showcase={portfolio.map(({ id, name, url, image }) => ({ id, name, url, image }))}
      />
      <WebsiteSections
        portfolio={<WebsitePortfolio items={portfolio} />}
        testimonials={<WebsiteVideoTestimonials reviews={reviews} />}
      />
      <Footer />
    </main>
  );
};

export default WebsitePage;
