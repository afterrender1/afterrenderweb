import Navbar from "@/components/Navbar";
import AboutUsHero from "@/components/AboutUsHero";
import WhatWeCreateCarosel from "@/components/WhatWeCreateCarosel";
import PricingBenefits from "@/components/PricingBenefits";
import PricingTestimonials from "@/components/PricingTestimonials";
import PricingFAQ from "@/components/PricingFAQ";
import Footer from "@/components/Footer";
import React from "react";

export const metadata = {
  title: "About Us | DSQR Studio",
  description:
    "Turning Ideas into Visuals that Inspire. At DSQR Studio, we blend creativity, strategy, and technology to craft videos, graphics, and AI-driven content that elevate brands.",
};

const AboutUsPage = () => {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-black pb-8">
      <Navbar />
      <AboutUsHero />
      <WhatWeCreateCarosel />
      <PricingBenefits />
      <PricingTestimonials />
      <PricingFAQ />
      <Footer theme="light" />
    </main>
  );
};

export default AboutUsPage;