import Navbar from "@/components/Navbar";
import PricingHero from "@/components/PricingHero";
import ReelEditingStyles from "@/components/ReelEditingStyles";
import PricingListOfServices from "@/components/PricingListOfServices";
import PricingWorkWall from "@/components/PricingWorkWall";
import PricingBenefits from "@/components/PricingBenefits";
import ShortVideoClientTestimonials from "@/components/ShortVideoClientTestimonials";
import PricingTestimonials from "@/components/PricingTestimonials";
import PricingFAQ from "@/components/PricingFAQ";
import Footer from "@/components/Footer";
import React from "react";
import { getActiveEvent } from "@/app/lib/heroEvents";

// Event changes revalidate this page immediately; this is just a safety net
export const revalidate = 600;

export const metadata = {
  title: "Pricing & Plans",
  description:
    "Unlimited Creatives with One Subscription. Choose the perfect video editing and graphic design package tailored for your business growth.",
};

const PricingPage = () => {
  // Live event (plan prices, offer, background). Deliberately NOT awaited: the page and the
  // plan cards render at once and only the prices wait (shimmer) until it resolves.
  // getActiveEvent never rejects; null = default prices.
  const eventPromise = getActiveEvent();

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-black pb-8">
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