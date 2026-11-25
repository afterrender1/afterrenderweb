import Navbar from "@/components/Navbar";
import PricingHero from "@/components/PricingHero";
import ReelEditingStyles from "@/components/ReelEditingStyles";
import PricingListOfServices from "@/components/PricingListOfServices";
import PricingWorkWall from "@/components/PricingWorkWall";
import PricingBenefits from "@/components/PricingBenefits";
import ShortVideoClientTestimonials from "@/components/VideoClientTestimonials";
import PricingTestimonials from "@/components/PricingTestimonials";
import PricingFAQ from "@/components/PricingFAQ";
import Footer from "@/components/Footer";
import React, { Suspense } from "react";
import { getActiveEvent } from "@/app/lib/heroEvents";
import JsonLd from "@/components/JsonLd";
import { SubscriptionPlansJsonLd } from "@/components/PricingJsonLd";
import { GENERAL_FAQS } from "@/app/lib/faqData";
import { KEYWORDS, pageMetadata, jsonLdGraph, webPageJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/app/lib/seo";

// Event changes revalidate this page immediately; this is just a safety net
export const revalidate = 600;

const TITLE = "Video Editing Pricing & Unlimited Plans";
const DESCRIPTION =
  "Unlimited video editing and graphic design for one flat monthly price. Compare Basic, Plus and Ultra plans: unlimited revisions, next-day and same-day delivery.";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/pricing",
  keywords: [...KEYWORDS.pricing, ...KEYWORDS.core.slice(8, 16), ...KEYWORDS.wedding, ...KEYWORDS.design.slice(0, 6)],
});

const PricingPage = () => {
  // Live event (plan prices, offer, background). Deliberately NOT awaited: the page and the
  // plan cards render at once and only the prices wait (shimmer) until it resolves.
  // getActiveEvent never rejects; null = default prices.
  const eventPromise = getActiveEvent();

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-black pb-8">
      <JsonLd
        data={jsonLdGraph(
          webPageJsonLd({ path: "/pricing", name: TITLE, description: DESCRIPTION }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Pricing", path: "/pricing" },
          ]),
          faqJsonLd(GENERAL_FAQS, "/pricing")
        )}
      />
      <Suspense fallback={null}>
        <SubscriptionPlansJsonLd eventPromise={eventPromise} />
      </Suspense>
      <Navbar />
      <PricingHero eventPromise={eventPromise} />
      <ReelEditingStyles />
      <PricingListOfServices />
      <PricingWorkWall />
      <PricingBenefits />
      <ShortVideoClientTestimonials isLight={true} />
      <PricingTestimonials />
      <PricingFAQ />
      <Footer />
    </main>
  );
};

export default PricingPage;