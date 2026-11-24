import React from "react";
import Navbar from "@/components/Navbar";
import OnDemandPricing from "@/components/OnDemandPricing";
import Footer from "@/components/Footer";

export const metadata = {
  title: "On Demand Pricing",
  description: "AfterRender On Demand: pay per project video editing, no subscription.",
  // Placeholder page: keep it out of search results until the real content is added
  robots: { index: false, follow: true },
};

export default function OnDemandPricingPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-black pb-8">
      <Navbar />
      <OnDemandPricing />
      <Footer />
    </main>
  );
}
