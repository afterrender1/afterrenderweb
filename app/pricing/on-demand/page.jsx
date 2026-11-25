import React, { Suspense } from "react";
import Navbar from "@/components/Navbar";
import JsonLd from "@/components/JsonLd";
import { OnDemandPackagesJsonLd } from "@/components/PricingJsonLd";
import { KEYWORDS, pageMetadata, jsonLdGraph, webPageJsonLd, breadcrumbJsonLd } from "@/app/lib/seo";
import OnDemandPricing from "@/components/OnDemandPricing";
import OnDemandPackages from "@/components/OnDemandPackages";
import CollectionPortfolio from "@/components/CollectionPortfolio";
import { getActiveEvent } from "@/app/lib/heroEvents";
import PricingTestimonials from "@/components/PricingTestimonials";
import ShortVideoClientTestimonials from "@/components/VideoClientTestimonials";
import PricingBenefits from "@/components/PricingBenefits";
import PricingFAQ from "@/components/PricingFAQ";
import Footer from "@/components/Footer";

const TITLE = "Pay-Per-Project Video Editing Packages";
const DESCRIPTION =
  "Get high quality videos edited without a monthly subscription. Pre-paid short-form, real estate and YouTube video editing packages from AfterRender.";

// The On Demand packages are live, so the page is indexable and listed in the sitemap
export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/pricing/on-demand",
  keywords: [
    ...KEYWORDS.pricing.slice(6),
    "video editing packages",
    "short form video editing packages",
    "real estate video editing packages",
    "YouTube video editing packages",
    ...KEYWORDS.shortForm.slice(0, 6),
  ],
});

// Event changes revalidate this page immediately; this is just a safety net
export const revalidate = 600;

export default function OnDemandPricingPage() {
  // Live event (package prices). Not awaited: the page renders at once and only the
  // prices wait (shimmer). getActiveEvent never rejects; null = default prices.
  const eventPromise = getActiveEvent();

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-black pb-8">
      <JsonLd
        data={jsonLdGraph(
          webPageJsonLd({ path: "/pricing/on-demand", name: TITLE, description: DESCRIPTION }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Pricing", path: "/pricing" },
            { name: "On Demand", path: "/pricing/on-demand" },
          ])
        )}
      />
      <Suspense fallback={null}>
        <OnDemandPackagesJsonLd eventPromise={eventPromise} />
      </Suspense>
      <Navbar />
      <OnDemandPricing />
      <OnDemandPackages eventPromise={eventPromise} />
      <CollectionPortfolio />
      <PricingTestimonials />
      <ShortVideoClientTestimonials isLight={true} />
      <PricingBenefits />
      <PricingFAQ />
      <Footer theme="light" />
    </main>
  );
}
