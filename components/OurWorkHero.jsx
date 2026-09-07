"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
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

const OurWorkHero = () => {
  return (
    <section
      className={`${jakarta.className} relative bg-[#FAFAFA] text-black pt-32 sm:pt-36 pb-12 sm:pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col items-center justify-center`}
    >
      {/* Background Soft Mesh Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-b from-[#eaf4ff]/50 via-[#f5f8ff]/25 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Floating Badges */}
      <div className="w-full max-w-2xl relative">
        {/* Left Floating Badge: @Unlimited */}
        <motion.div
          initial={{ opacity: 0, x: -20, rotate: -8 }}
          animate={{ opacity: 1, x: 0, rotate: -8 }}
          whileHover={{ scale: 1.06, rotate: -4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute -top-7 left-0 sm:left-2 md:left-4 z-20 hidden sm:flex items-center gap-1 bg-gradient-to-br from-[#FF6A00] to-[#FF4500] text-white text-[11px] md:text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-[0_8px_20px_rgba(255,85,0,0.3)] cursor-pointer select-none"
        >
          <span>@Unlimited</span>
          <div className="absolute -bottom-1 right-3 w-2.5 h-2.5 bg-[#FF4500] rotate-45 rounded-[1px]" />
        </motion.div>

        {/* Right Floating Badge: @Videos */}
        <motion.div
          initial={{ opacity: 0, x: 20, rotate: 10 }}
          animate={{ opacity: 1, x: 0, rotate: 10 }}
          whileHover={{ scale: 1.06, rotate: 6 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute -top-7 right-0 sm:right-2 md:right-4 z-20 hidden sm:flex items-center gap-1 bg-[#111111] text-white text-[11px] md:text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.25)] cursor-pointer select-none"
        >
          <span>@Videos</span>
          <div className="absolute -bottom-1 left-3 w-2.5 h-2.5 bg-[#111111] rotate-45 rounded-[1px]" />
        </motion.div>
      </div>

      {/* Hero Title & Subtitle */}
      <div className="text-center max-w-2xl mx-auto z-10">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-2xl sm:text-3xl md:text-[38px] lg:text-[42px] font-bold sm:font-extrabold tracking-tight text-[#111111] leading-[1.2]"
        >
          <span className="block">Your Brand’s Next Big</span>
          <span className="block mt-0.5 sm:mt-1">
            <span>Moment </span>
            <span
              className={`${playfair.className} italic font-normal inline-block`}
            >
              Starts Here
            </span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mt-3.5 text-[#555555] text-xs sm:text-sm md:text-[14.5px] leading-relaxed max-w-xl mx-auto font-medium"
        >
          From social media reels to high-concept brand campaigns, explore the
          variety, creativity, and speed that define every project we deliver.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="https://calendly.com/afterrenderagency/new-meeting"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] text-[#0A2540] font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-[0_6px_16px_rgba(72,162,255,0.3)] hover:shadow-[0_10px_20px_rgba(72,162,255,0.4)] hover:brightness-105 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Start Your Free Trial
          </Link>
          <Link
            href="#plans"
            className="bg-white hover:bg-gray-50 text-gray-800 font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full border border-gray-200 shadow-2xs hover:border-gray-300 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            See Plans
          </Link>
        </motion.div>

        {/* Trust Points */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.22 }}
          className="mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-7 gap-y-2 text-xs sm:text-[13px] font-medium text-gray-700"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-gray-900">✓</span>
            <span>Start in minutes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-gray-900">✓</span>
            <span>Pause, cancel, or scale anytime.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-gray-900">✓</span>
            <span>No contract</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OurWorkHero;
