import React from "react";
import Navbar from "@/components/Navbar";
import OnDemandPricing from "@/components/OnDemandPricing";
import OnDemandPackages from "@/components/OnDemandPackages";
import { getActiveEvent } from "@/app/lib/heroEvents";
import PricingTestimonials from "@/components/PricingTestimonials";
import ShortVideoClientTestimonials from "@/components/ShortVideoClientTestimonials";
import PricingBenefits from "@/components/PricingBenefits";
import PricingFAQ from "@/components/PricingFAQ";
import Footer from "@/components/Footer";

export const metadata = {
  title: "On Demand Pricing",
  description: "AfterRender On Demand: get high quality video edited without the commitment of a monthly subscription.",
  // Still being built: keep it out of search results until the On Demand plans are added
  robots: { index: false, follow: true },
};

// Event changes revalidate this page immediately; this is just a safety net
export const revalidate = 600;

export default function OnDemandPricingPage() {
  // Live event (package prices). Not awaited: the page renders at once and only the
  // prices wait (shimmer). getActiveEvent never rejects; null = default prices.
  const eventPromise = getActiveEvent();

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-black pb-8">
      <Navbar />
      <OnDemandPricing />
      <OnDemandPackages eventPromise={eventPromise} />
      <PricingTestimonials />
      <ShortVideoClientTestimonials isLight={true} />
      <PricingBenefits />
      <PricingFAQ />
      <Footer theme="light" />
    </main>
  );
}
