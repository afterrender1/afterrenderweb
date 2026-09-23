import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RealEstateHero from "@/components/RealEstateHero";
import RealEstateWhatYouGet from "@/components/RealEstateWhatYouGet";
import RealEstatePackages from "@/components/RealEstatePackages";
import RealEstateProcess from "@/components/RealEstateProcess";
import RealEstateFAQ from "@/components/RealEstateFAQ";
import RealEstateLeadForm from "@/components/RealEstateLeadForm";

export const metadata = {
  title: "Done-For-You Video Content | AfterRender",
  description:
    "We write the scripts, film at your location twice a week, edit everything, and post it to your channels. Done-for-you video content for realtors, local businesses and service brands.",
};

const RealEstatePage = () => {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-black">
      <Navbar />

      <RealEstateHero />
      <RealEstateWhatYouGet />
      <RealEstatePackages />
      <RealEstateProcess />
      <RealEstateFAQ />
      <RealEstateLeadForm />

      <Footer />
    </main>
  );
};

export default RealEstatePage;
