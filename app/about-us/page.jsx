import Navbar from "@/components/Navbar";
import AboutUsHero from "@/components/AboutUsHero";
import OurStory from "@/components/OurStory";
import WhatWeDo from "@/components/WhatWeDo";
import PricingTestimonials from "@/components/PricingTestimonials";
import PricingFAQ from "@/components/PricingFAQ";
import Footer from "@/components/Footer";
import React from "react";
import JsonLd from "@/components/JsonLd";
import { KEYWORDS, pageMetadata, jsonLdGraph, webPageJsonLd, breadcrumbJsonLd } from "@/app/lib/seo";

const TITLE = "About Us: US Video Editing & Creative Agency";
const DESCRIPTION =
  "At AfterRender we blend creativity, strategy and technology to craft videos, graphics and AI-driven content that elevate brands across the United States.";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/about-us",
  keywords: [
    "about AfterRender",
    "AfterRender video editing agency",
    "creative agency USA",
    "video production agency",
    ...KEYWORDS.usa.slice(20),
  ],
});

const AboutUsPage = () => {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-black pb-8">
      <JsonLd
        data={jsonLdGraph(
          webPageJsonLd({ path: "/about-us", name: TITLE, description: DESCRIPTION, type: "AboutPage" }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "About Us", path: "/about-us" },
          ])
        )}
      />
      <Navbar />
      <AboutUsHero />
      <OurStory />
      <WhatWeDo />
      <PricingTestimonials />
      <PricingFAQ />
      <Footer theme="light" />
    </main>
  );
};

export default AboutUsPage;