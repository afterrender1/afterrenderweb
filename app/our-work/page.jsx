import Navbar from "@/components/Navbar";
import PricingHero from "@/components/PricingHero";
import PricingListOfServices from "@/components/PricingListOfServices";
import PricingBenefits from "@/components/PricingBenefits";
import PricingTestimonials from "@/components/PricingTestimonials";
import PricingFAQ from "@/components/PricingFAQ";
import WhatWeCreateCarosel from "@/components/WhatWeCreateCarosel";
import Footer from "@/components/Footer";
import React from "react";

export const metadata = {
  title: "Our Work & Plans | AfterRender",
  description:
    "Unlimited Creatives with One Subscription. Explore our work, video editing, and graphic design packages tailored for your business growth.",
};

const OurWorkPage = () => {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-black pb-8">
      <Navbar />
      <PricingHero />
      <PricingListOfServices />
      <PricingBenefits />
      <PricingTestimonials />
      <PricingFAQ />
      <WhatWeCreateCarosel />
      <Footer />
    </main>
  );
};

export default OurWorkPage;