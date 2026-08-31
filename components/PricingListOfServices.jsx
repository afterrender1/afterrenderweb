"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const serviceData = {
  graphics: [
    "Social Media Graphics",
    "Carousels",
    "Ad Creatives (Static)",
    "Ad Creatives (Animated)",
    "Brand Kits & Assets",
    "Website Graphics",
    "App Graphics",
    "Thumbnails",
    "Slide Decks",
    "Presentations",
    "eBooks",
    "Whitepapers",
    "PDFs",
    "Infographics",
    "Brochures",
    "Flyers",
    "Posters",
    "Merchandise Design",
    "Packaging Design",
    "Custom Icons",
  ],
  videos: [
    "YouTube Editing",
    "Reels",
    "Shorts",
    "TikToks",
    "Explainer Video",
    "Product Video",
    "Demo Videos",
    "Motion Graphics",
    "Animation",
    "Video Ads (Performance & Social)",
    "Subtitles, Captions, Titling & Transitions",
    "Voice-over Integration",
    "Longform Edits",
    "Intro/Outro Creation",
    "Podcast Edits",
    "Webinar Edits",
    "Digital Course Editing",
    "Multilingual Edits",
    "Montage Edits",
    "Training Videos",
    "Travel Vlogs",
    "House Showcase Videos",
    "Gym & Fitness Edits",
    "Car Edits",
  ],
};

const PricingListOfServices = () => {
  const [activeTab, setActiveTab] = useState("videos");

  const currentServices = serviceData[activeTab] || [];
  // Split into 2 balanced columns
  const midPoint = Math.ceil(currentServices.length / 2);
  const leftColumn = currentServices.slice(0, midPoint);
  const rightColumn = currentServices.slice(midPoint);

  return (
    <section
      className={`${jakarta.className} relative bg-[#FAFAFA] text-black pt-4 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden`}
    >
      <div className="max-w-[720px] mx-auto relative">
        {/* Floating Badge: @features */}
        <div className="flex justify-end mb-2 mr-1 sm:mr-4">
          <motion.div
            initial={{ opacity: 0, y: -8, rotate: 6 }}
            whileInView={{ opacity: 1, y: 0, rotate: 6 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.06, rotate: 2 }}
            className="flex items-center gap-1 bg-black text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.2)] select-none cursor-pointer"
          >
            <span>@features</span>
          </motion.div>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-6">
          <div className="bg-[#EFEFEF] p-1 rounded-full flex items-center shadow-inner border border-gray-200/70">
            {[
              { key: "graphics", label: "Graphics" },
              { key: "videos", label: "Videos" },
            ].map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative px-5 sm:px-7 py-1.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "text-[#0A2540] font-bold"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="serviceActiveTab"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      className="absolute inset-0 bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] rounded-full shadow-[0_2px_10px_rgba(72,162,255,0.35)]"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Services List Card */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white rounded-[24px] border border-gray-200/90 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] p-5 sm:p-6 md:p-8"
        >
          {/* Header */}
          <h3 className="text-base sm:text-lg font-extrabold text-gray-950 mb-5 flex items-center gap-1.5 tracking-tight">
            <span className="text-gray-900">•</span>
            <span>List of services</span>
          </h3>

          {/* 2-Column Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 md:gap-x-12 gap-y-2.5 sm:gap-y-3">
            {/* Left Column */}
            <div className="space-y-2.5 sm:space-y-3">
              {leftColumn.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <span className="shrink-0 w-4 h-4 rounded-full bg-black flex items-center justify-center shadow-2xs">
                    <Check
                      className="w-2.5 h-2.5 text-[#CEFF00] stroke-[3]"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="text-xs sm:text-[13px] font-medium text-gray-800 tracking-tight leading-tight">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-2.5 sm:space-y-3">
              {rightColumn.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <span className="shrink-0 w-4 h-4 rounded-full bg-black flex items-center justify-center shadow-2xs">
                    <Check
                      className="w-2.5 h-2.5 text-[#CEFF00] stroke-[3]"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="text-xs sm:text-[13px] font-medium text-gray-800 tracking-tight leading-tight">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingListOfServices;