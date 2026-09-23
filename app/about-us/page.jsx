import Navbar from "@/components/Navbar";
import AboutUsHero from "@/components/AboutUsHero";
import OurStory from "@/components/OurStory";
import WhatWeDo from "@/components/WhatWeDo";
import PricingTestimonials from "@/components/PricingTestimonials";
import PricingFAQ from "@/components/PricingFAQ";
import Footer from "@/components/Footer";
import React from "react";

export const metadata = {
  title: "About Us | Afterrender",
  description:
    "Turning Ideas into Visuals that Inspire. At Afterrender, we blend creativity, strategy, and technology to craft videos, graphics, and AI-driven content that elevate brands.",
};

const AboutUsPage = () => {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-black pb-8">
      <Navbar />
      <AboutUsHero />
      <OurStory />
      <WhatWeDo />
      <PricingTestimonials />
      <PricingFAQ />
      <Footer theme="light" />
    </main>
  );
};

export default AboutUsPage;