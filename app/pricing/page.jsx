import Navbar from "@/components/Navbar";
import PricingHero from "@/components/PricingHero";
import ReelEditingStyles from "@/components/ReelEditingStyles";
import PricingListOfServices from "@/components/PricingListOfServices";
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

const PricingPage = async () => {
  // Live event's offer badge (null when no event/offer -> page unchanged)
  const event = await getActiveEvent();

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-black pb-8">
      <Navbar />
      <PricingHero offer={event?.offer} backgroundUrl={event?.backgroundUrl} />
      <ReelEditingStyles />
      <PricingListOfServices />
      <PricingBenefits />
      <ShortVideoClientTestimonials isLight={true} />
      <PricingTestimonials />
      <PricingFAQ />
      <Footer />
    </main>
  );
};

export default PricingPage;