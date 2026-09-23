"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { ArrowRight } from "lucide-react";
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

const CALENDLY_URL = "https://calendly.com/afterrenderagency/new-meeting";

const RealEstateHero = () => {
  return (
    <section
      className={`${jakarta.className} relative bg-[#FAFAFA] text-black pt-32 sm:pt-40 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col items-center justify-center`}
    >
      {/* Background Soft Gold Mesh Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-b from-[#FFD700]/15 via-[#FDF6E3]/40 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Floating Badges */}
      <div className="w-full max-w-2xl relative">
        <motion.div
          initial={{ opacity: 0, x: -20, rotate: -8 }}
          animate={{ opacity: 1, x: 0, rotate: -8 }}
          whileHover={{ scale: 1.06, rotate: -4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute -top-7 left-0 sm:left-2 md:left-4 z-20 hidden sm:flex items-center gap-1 text-black text-[11px] md:text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-[0_8px_20px_rgba(184,134,11,0.35)] cursor-pointer select-none"
          style={{
            background: "linear-gradient(135deg, #FFD700 0%, #B8860B 100%)",
          }}
        >
          <span>@DoneForYou</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20, rotate: 10 }}
          animate={{ opacity: 1, x: 0, rotate: 10 }}
          whileHover={{ scale: 1.06, rotate: 6 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute -top-7 right-0 sm:right-2 md:right-4 z-20 hidden sm:flex items-center gap-1 bg-[#111111] text-white text-[11px] md:text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.25)] cursor-pointer select-none"
        >
          <span>@TwiceAWeek</span>
        </motion.div>
      </div>

      {/* Hero Title & Subtitle */}
      <div className="text-center max-w-2xl mx-auto z-10">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-3xl sm:text-4xl md:text-[44px] font-bold sm:font-extrabold tracking-tight text-[#111111] leading-[1.18]"
        >
          <span className="block">Video content for your business,</span>
          <span className="block mt-0.5 sm:mt-1">
            <span
              className={`${playfair.className} italic font-normal inline-block`}
            >
              handled
            </span>{" "}
            <span>start to finish.</span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mt-4 text-[#555555] text-xs sm:text-sm md:text-[15px] leading-relaxed max-w-xl mx-auto font-medium"
        >
          We write the scripts, film at your location twice a week, edit
          everything, and post it to your channels. You just show up on
          camera, or don&apos;t. We can work around you.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "linear-gradient(135deg, #FFD700 0%, #B8860B 100%)",
            }}
            className="group inline-flex items-center gap-2 text-black font-bold text-xs sm:text-sm px-7 py-3 rounded-full shadow-[0_8px_20px_rgba(184,134,11,0.4)] hover:shadow-[0_12px_28px_rgba(184,134,11,0.5)] hover:brightness-105 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <span>Book a Free Call</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
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
            <span className="text-xs font-bold text-[#B8860B]">✓</span>
            <span>Scripts written for every video</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#B8860B]">✓</span>
            <span>Filmed at your location</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#B8860B]">✓</span>
            <span>We upload it for you</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RealEstateHero;
