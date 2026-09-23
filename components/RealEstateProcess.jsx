"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "600", "700"],
});

const steps = [
  {
    step: "01",
    title: "We learn your business",
    description:
      "First, we get on a call and learn about your business: who your customers are, what you sell, and what's worked (or hasn't) before.",
  },
  {
    step: "02",
    title: "We plan & write the scripts",
    description:
      "Then we plan the month and write the scripts. You see them before anything gets filmed.",
  },
  {
    step: "03",
    title: "We film, twice a week",
    description:
      "Our camera operator comes by twice a week to shoot. Each visit usually takes a couple of hours.",
  },
  {
    step: "04",
    title: "We edit, approve & post",
    description:
      "We edit, send you the videos to approve, and post them once you're happy.",
  },
];

const RealEstateProcess = () => {
  return (
    <section
      className={`${jakarta.className} relative bg-white text-black py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Top Tag & Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold tracking-widest uppercase text-gray-400">
            <span className="w-2 h-2 rounded-full bg-[#B8860B] inline-block shadow-[0_0_8px_rgba(184,134,11,0.6)]" />
            <span>How It Works</span>
          </div>
          <div className="flex-1 h-[1px] bg-gray-200" />
        </div>

        <div className="mb-12 sm:mb-16 max-w-2xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
            <span>From first call to </span>
            <span
              className={`${playfair.className} italic font-normal text-gray-900 block sm:inline`}
            >
              posted video.
            </span>
          </h2>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6">
          {/* Connecting line (desktop only) */}
          <div className="hidden lg:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#FFD700] via-[#B8860B] to-[#FFD700] opacity-40" />

          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative flex flex-col"
            >
              <div
                className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-sm font-extrabold text-black shadow-[0_8px_20px_rgba(184,134,11,0.35)] mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, #FFD700 0%, #B8860B 100%)",
                }}
              >
                {item.step}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-gray-950 tracking-tight mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RealEstateProcess;
