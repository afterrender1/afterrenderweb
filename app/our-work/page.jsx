import Navbar from "@/components/Navbar";
import OurWorkHero from "@/components/OurWorkHero";
import WhatWeCreateCarosel from "@/components/WhatWeCreateCarosel";
import PricingHero from "@/components/PricingHero";
import CollectionPortfolio from "@/components/CollectionPortfolio";
import PricingListOfServices from "@/components/PricingListOfServices";
import PricingBenefits from "@/components/PricingBenefits";
import PricingTestimonials from "@/components/PricingTestimonials";
import PricingFAQ from "@/components/PricingFAQ";
import Footer from "@/components/Footer";
import React from "react";

export const metadata = {
  title: "Our Work & Plans | AfterRender",
  description:
    "Your Brand’s Next Big Moment Starts Here. Explore our work, video editing, and graphic design packages tailored for your business growth.",
};

const OurWorkPage = () => {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-black pb-8">
      <Navbar />
      <OurWorkHero />
      <WhatWeCreateCarosel />
      <PricingHero hideHeader={true} id="plans" />
      <CollectionPortfolio />
      <PricingListOfServices />
      <PricingBenefits />
      <PricingTestimonials />
      <PricingFAQ />
      <Footer />
    </main>
  );
};

export default OurWorkPage;