"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus_Jakarta_Sans, Playfair_Display, Inter } from "next/font/google";
import { Info, Check, ChevronDown } from "lucide-react";
import Link from "next/link";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "600", "700"],
});

const CALENDLY_URL = "https://calendly.com/afterrenderagency/30min";

const plans = {
  video: {
    id: "video",
    tabLabel: "Video",
    title: "Video Editing",
    description:
      "Tailored for agencies, creators & brands who outsource video editing, from reels and long-form edits to ads, promos & more.",
    basePrice: 699,
    prices: {
      1: 699,
      2: 1199,
      3: 1999,
    },
    calendlyUrl: CALENDLY_URL,
    features: [
      "Unlimited Video Requests",
      "Unlimited Revisions",
      "Upgrade or Downgrade Anytime",
      "Dedicated Project Manager",
      "Pause or Cancel Anytime",
      "Unlimited Brands",
      "No Contract",
      "Unlimited User Seats",
      "Monday to Friday Workday",
    ],
  },
  both: {
    id: "both",
    tabLabel: "Both",
    title: "Graphic + Video",
    description:
      "All-in-One for agencies, creators & brands unlimited videos and graphics, from ads and posts to long-form edits & more.",
    basePrice: 1037,
    prices: {
      1: 1037,
      2: 1899,
      3: 2899,
    },
    calendlyUrl: CALENDLY_URL,
    features: [
      "Unlimited Graphic + Video Requests",
      "Unlimited Revisions",
      "Upgrade or Downgrade Anytime",
      "Dedicated Project Manager",
      "Pause or Cancel Anytime",
      "Unlimited Brands",
      "No Contract",
      "Unlimited User Seats",
      "Monday to Friday Workday",
    ],
  },
  graphics: {
    id: "graphics",
    tabLabel: "Graphics",
    title: "Graphic Design",
    description:
      "Perfect for agencies, marketers & startups with ongoing design needs, from ads and carousels to social posts & more.",
    basePrice: 473,
    prices: {
      1: 473,
      2: 899,
      3: 1299,
    },
    calendlyUrl: CALENDLY_URL,
    features: [
      "Unlimited Graphic Requests",
      "Unlimited Revisions",
      "Upgrade or Downgrade Anytime",
      "Dedicated Project Manager",
      "Pause or Cancel Anytime",
      "Unlimited Brands",
      "No Contract",
      "Unlimited User Seats",
      "Monday to Friday Workday",
    ],
  },
};

export default function PricingHero() {
  const [activeTab, setActiveTab] = useState("video");
  const [activeRequests, setActiveRequests] = useState(1);
  const [lightningFast, setLightningFast] = useState(false);
  const [showActiveReqTooltip, setShowActiveReqTooltip] = useState(false);
  const [showLightningTooltip, setShowLightningTooltip] = useState(false);

  const currentPlan = plans[activeTab];

  // Calculate dynamic price based on active requests
  const calculatedPrice = (
    currentPlan.prices?.[activeRequests] ||
    currentPlan.basePrice * activeRequests
  ).toLocaleString();

  return (
    <section
      className={`${jakarta.className} relative min-h-screen bg-[#FAFAFA] text-black pt-32 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col items-center justify-center`}
    >
      {/* Background Soft Mesh Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-b from-[#eaf4ff]/50 via-[#f5f8ff]/25 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Floating Badges */}
      <div className="w-full max-w-3xl relative">
        {/* Left Floating Badge: @Subscribe */}
        <motion.div
          initial={{ opacity: 0, x: -20, rotate: -8 }}
          animate={{ opacity: 1, x: 0, rotate: -8 }}
          whileHover={{ scale: 1.06, rotate: -4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute -top-7 left-1 sm:left-4 md:left-8 z-20 hidden sm:flex items-center gap-1 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] text-white text-[11px] md:text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-[0_8px_20px_rgba(59,130,246,0.3)] cursor-pointer select-none"
        >
          <span>@Subscribe</span>
        </motion.div>

        {/* Right Floating Badge: @Connect */}
        <motion.div
          initial={{ opacity: 0, x: 20, rotate: 10 }}
          animate={{ opacity: 1, x: 0, rotate: 10 }}
          whileHover={{ scale: 1.06, rotate: 6 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute -top-7 right-1 sm:right-4 md:right-8 z-20 hidden sm:flex items-center gap-1 bg-gradient-to-r from-[#c084fc] to-[#a855f7] text-white text-[11px] md:text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-[0_8px_20px_rgba(168,85,247,0.3)] cursor-pointer select-none"
        >
          <span>@Connect</span>
        </motion.div>
      </div>

      {/* Hero Title & Subtitle */}
      <div className="text-center max-w-2xl mx-auto z-10">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-3xl sm:text-4xl md:text-[42px] tracking-tight text-[#111111] leading-[1.18]"
        >
          <span
            className={`${playfair.className} italic font-normal block sm:inline-block`}
          >
            Unlimited Creatives!
          </span>{" "}
          <span className="font-extrabold block sm:inline-block">One Subscription.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mt-3.5 text-[#555555] text-xs sm:text-sm md:text-[14.5px] leading-relaxed max-w-xl mx-auto font-medium"
        >
          From social media posts to full-scale video campaigns, choose the plan
          that matches your creative needs and watch your brand grow.
        </motion.p>
      </div>

      {/* Tab Switcher */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
        className="mt-6 mb-7 z-10"
      >
        <div className="bg-[#EFEFEF] p-1 mb-5 rounded-full flex items-center shadow-inner border border-gray-200/70">
          {["video", "both", "graphics"].map((tabKey) => {
            const plan = plans[tabKey];
            const isActive = activeTab === tabKey;
            return (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`relative px-4 sm:px-6 py-1.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "text-[#0A2540] font-bold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBadge"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    className="absolute inset-0 bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] rounded-full shadow-[0_2px_12px_rgba(72,162,255,0.4)]"
                  />
                )}
                <span className="relative z-10">{plan.tabLabel}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* 3D Stacked Cards Deck Container */}
      <div className="relative w-full max-w-[720px] mx-auto z-10 px-2 sm:px-0 pt-8 sm:pt-10">
        {/* Helper to get other plans for the background stacked cards */}
        {(() => {
          const allTabs = ["video", "both", "graphics"];
          const otherTabs = allTabs.filter((t) => t !== activeTab);
          const middleTabKey = otherTabs[0];
          const backTabKey = otherTabs[1];
          const middlePlan = plans[middleTabKey];
          const backPlan = plans[backTabKey];

          return (
            <>
              {/* Stack Layer 2 (Back-most Card Peeking) */}
              <div
                onClick={() => setActiveTab(backTabKey)}
                className="absolute -top-6 sm:-top-7 inset-x-6 sm:inset-x-8 h-24 bg-white rounded-[26px] border border-gray-300/80 shadow-[0_15px_35px_-8px_rgba(0,0,0,0.18)] -z-20 cursor-pointer transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full px-5 sm:px-6 pt-2.5 items-start">
                  <div className="md:col-span-6 flex items-center gap-2 opacity-60">
                    <span className="shrink-0 w-3.5 h-3.5 rounded-[4px] border border-gray-700 flex items-center justify-center bg-white">
                      <Check className="w-2.5 h-2.5 text-gray-800 stroke-[3]" />
                    </span>
                    <span className="text-[11px] font-bold text-gray-800 tracking-tight truncate">
                      {backPlan.features[0]}
                    </span>
                  </div>
                  <div className="md:col-span-6 bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] rounded-t-[16px] px-4 py-1.5 h-full flex items-center justify-between border-t border-x border-white/20 shadow-xs text-[#0A2540]">
                    <span className="text-xs font-extrabold truncate">
                      {backPlan.title}
                    </span>
                    <span className="text-[10px] font-bold opacity-80">
                      USD {backPlan.basePrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stack Layer 1 (Middle Card Peeking) */}
              <div
                onClick={() => setActiveTab(middleTabKey)}
                className="absolute -top-1 sm:-top-1.5 inset-x-3 sm:inset-x-4 h-24 bg-white rounded-[26px] border border-gray-300/90 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.22)] -z-10 cursor-pointer transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full px-5 sm:px-6 pt-2.5 items-start">
                  <div className="md:col-span-6 flex items-center gap-2 opacity-70">
                    <span className="shrink-0 w-3.5 h-3.5 rounded-[4px] border border-gray-700 flex items-center justify-center bg-white">
                      <Check className="w-2.5 h-2.5 text-gray-800 stroke-[3]" />
                    </span>
                    <span className="text-[11px] font-bold text-gray-800 tracking-tight truncate">
                      {middlePlan.features[0]}
                    </span>
                  </div>
                  <div className="md:col-span-6 bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] rounded-t-[18px] px-4 py-2 h-full flex items-center justify-between border-t border-x border-white/20 shadow-xs text-[#0A2540]">
                    <span className="text-xs font-extrabold truncate">
                      {middlePlan.title}
                    </span>
                    <span className="text-[11px] font-bold opacity-90">
                      USD {middlePlan.basePrice}
                    </span>
                  </div>
                </div>
              </div>
            </>
          );
        })()}

        {/* Main Active Card (Front) */}
        <motion.div
          layout
          key={activeTab}
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative bg-white rounded-[26px] border border-gray-200/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.22),0_10px_25px_-5px_rgba(0,0,0,0.1)] ring-1 ring-black/[0.05] p-5 sm:p-6 md:p-7"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Left Side: Included Features List */}
            <div className="md:col-span-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-gray-950 mb-4 tracking-tight">
                  This includes:
                </h3>

                <ul className="space-y-2.5 sm:space-y-3">
                  {currentPlan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2.5 text-gray-900"
                    >
                      {/* Checkbox Icon */}
                      <span className="shrink-0 w-4 h-4 rounded-[4.5px] border-[1.5px] border-gray-800 flex items-center justify-center bg-white shadow-2xs">
                        <Check
                          className="w-3 h-3 text-gray-900 stroke-[3]"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="text-xs sm:text-[13px] font-medium text-gray-900 tracking-tight leading-tight">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Side: Gradient Action Card */}
            <div className="md:col-span-6 bg-gradient-to-r from-[#48A2FF] via-[#75B8FF] to-[#C9E4FF] rounded-[20px] p-5 sm:p-6 text-[#0A2540] flex flex-col justify-between shadow-[0_12px_30px_rgba(72,162,255,0.35)]">
              <div>
                <h3 className="text-xl sm:text-[22px] font-extrabold text-black tracking-tight mb-1.5">
                  {currentPlan.title}
                </h3>
                <p className="text-xs sm:text-[12.5px] font-medium text-black/85 leading-relaxed mb-4">
                  {currentPlan.description}
                </p>

                {/* Dropdown & Controls */}
                <div className="space-y-3 mb-4">
                  {/* Active Request Dropdown */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <select
                        value={activeRequests}
                        onChange={(e) =>
                          setActiveRequests(Number(e.target.value))
                        }
                        className="appearance-none bg-white border border-black/10 rounded-md px-2.5 py-1 pr-7 text-xs font-bold text-black focus:outline-none focus:ring-1 focus:ring-black cursor-pointer shadow-2xs"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-black absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <div className="flex items-center gap-1 relative">
                      <span className="text-xs font-bold text-black">
                        Active Request
                      </span>
                      <button
                        type="button"
                        onMouseEnter={() => setShowActiveReqTooltip(true)}
                        onMouseLeave={() => setShowActiveReqTooltip(false)}
                        onClick={() =>
                          setShowActiveReqTooltip(!showActiveReqTooltip)
                        }
                        className="cursor-pointer text-black/70 hover:text-black focus:outline-none"
                      >
                        <Info className="w-3 h-3" />
                      </button>

                      {/* Tooltip */}
                      {showActiveReqTooltip && (
                        <div className="absolute left-0 bottom-6 z-30 w-48 bg-black text-white text-[10.5px] rounded-md p-1.5 shadow-lg">
                          Number of requests we actively work on simultaneously.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Get Lightning Fast Delivery Toggle */}
                  <div className="flex items-center gap-2 relative">
                    <button
                      type="button"
                      onClick={() => setLightningFast(!lightningFast)}
                      className="relative inline-flex h-4.5 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-black transition-colors duration-200 ease-in-out focus:outline-none"
                    >
                      <span
                        className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          lightningFast ? "translate-x-3.5" : "translate-x-0"
                        }`}
                      />
                    </button>

                    <div className="flex items-center gap-1 relative">
                      <span className="text-xs font-bold text-black">
                        Get Lightning Fast Delivery
                      </span>
                      <button
                        type="button"
                        onMouseEnter={() => setShowLightningTooltip(true)}
                        onMouseLeave={() => setShowLightningTooltip(false)}
                        onClick={() =>
                          setShowLightningTooltip(!showLightningTooltip)
                        }
                        className="cursor-pointer text-black/70 hover:text-black focus:outline-none"
                      >
                        <Info className="w-3 h-3" />
                      </button>

                      {/* Tooltip */}
                      {showLightningTooltip && (
                        <div className="absolute left-0 bottom-6 z-30 w-52 bg-black text-white text-[10.5px] rounded-md p-1.5 shadow-lg">
                          Priority turnaround within 24-48 hours for all your
                          assets.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Subscribe Button */}
              <div className="mt-3 pt-1">
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-xl sm:text-2xl font-extrabold text-black tracking-tight">
                    USD {calculatedPrice}
                  </span>
                  <span className="text-[11px] font-bold text-black/75 tracking-tight">
                    Per month
                  </span>
                </div>

                <Link
                  href={currentPlan.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-black hover:bg-neutral-900 active:scale-[0.98] text-white font-bold text-xs sm:text-sm py-2.5 sm:py-3 px-5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Subscribe
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
