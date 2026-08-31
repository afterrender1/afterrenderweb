import Navbar from "@/components/Navbar";
import PricingHero from "@/components/PricingHero";
import FAQ from "@/components/FAQ";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/Contact";
import Footer from "@/components/Footer";
import React from "react";

export const metadata = {
  title: "Pricing & Plans",
  description:
    "Unlimited Creatives with One Subscription. Choose the perfect video editing and graphic design package tailored for your business growth.",
};

const PricingPage = () => {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <PricingHero />
 
    </main>
  );
};

export default PricingPage;