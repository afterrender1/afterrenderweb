import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Real Estate Video Editing | AfterRender",
  description:
    "High-impact real estate video editing for realtors, agents & brokerages. Listing walkthroughs, drone edits, reels & ads that sell properties faster.",
};

const RealEstatePage = () => {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-black">
      <Navbar />

      {/* Content wrapper */}
      <div className="pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Placeholder / Header area ready for user's content */}
      </div>

      <Footer />
    </main>
  );
};

export default RealEstatePage;