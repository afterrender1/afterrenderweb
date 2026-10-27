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

export const metadata = {
  title: "Website Design & Development",
  description:
    "Custom, fast and SEO-ready websites that convert visitors into clients. Landing pages, business websites, e-commerce stores and more by AfterRender.",
};

const WebsitePage = async () => {
  const [portfolio, event, reviews] = await Promise.all([
    getPortfolioItems(),
    getActiveEvent(),
    getVideoReviewsByIds(WEBSITE_REVIEW_IDS),
  ]);

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-black pb-8">
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
