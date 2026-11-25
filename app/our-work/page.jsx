import Navbar from "@/components/Navbar";
import OurWorkHero from "@/components/OurWorkHero";
import WhatWeCreateCarosel from "@/components/WhatWeCreateCarosel";
import CollectionPortfolio from "@/components/CollectionPortfolio";
import PricingBenefits from "@/components/PricingBenefits";
import PricingTestimonials from "@/components/PricingTestimonials";
import PricingFAQ from "@/components/PricingFAQ";
import Footer from "@/components/Footer";
import React from "react";
import { getActiveEvent } from "@/app/lib/heroEvents";
import JsonLd from "@/components/JsonLd";
import { KEYWORDS, pageMetadata, jsonLdGraph, webPageJsonLd, breadcrumbJsonLd } from "@/app/lib/seo";

// Event changes revalidate this page immediately; this is just a safety net
export const revalidate = 600;

const TITLE = "Video Editing Portfolio: Reels, YouTube & Ads";
const DESCRIPTION =
  "Explore AfterRender's video editing portfolio: short-form Reels and TikToks, long-form YouTube edits, SaaS explainers, ads and motion graphics for US brands.";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/our-work",
  keywords: [
    "video editing portfolio",
    "video editor portfolio",
    "video editing examples",
    "video editing samples",
    ...KEYWORDS.shortForm,
    ...KEYWORDS.youtube,
  ],
});

const OurWorkPage = async () => {
  const event = await getActiveEvent();

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-black pb-8">
      <JsonLd
        data={jsonLdGraph(
          webPageJsonLd({ path: "/our-work", name: TITLE, description: DESCRIPTION, type: "CollectionPage" }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Our Work", path: "/our-work" },
          ])
        )}
      />
      <Navbar />
      <OurWorkHero backgroundUrl={event?.backgroundUrl} />
      <WhatWeCreateCarosel />
      <CollectionPortfolio />
      <PricingBenefits />
      <PricingTestimonials />
      <PricingFAQ />
      <Footer />
    </main>
  );
};

export default OurWorkPage;