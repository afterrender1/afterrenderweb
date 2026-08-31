"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { Send } from "lucide-react";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "600", "700"],
});

const benefitsData = [
  {
    title: "7,000+ Videos Delivered",
    description:
      "We’ve created high-performing content for clients across industries consistently, creatively, and at scale.",
    highlight: false,
  },
  {
    title: "Lightning-Fast Turnaround",
    description:
      "Most requests are delivered within 1–2 business days perfect for brands that move fast.",
    highlight: false,
  },
  {
    title: "Unlimited Revisions",
    description:
      "We tweak until it’s perfect. No limits. No extra charges.",
    highlight: false,
  },
  {
    title: "Professional Editing Team",
    description:
      "Leverage the speed of AI with the touch of experienced editors and designers.",
    highlight: false,
  },
  {
    title: "We Can Do It All!",
    description:
      "From New Year to Christmas, we get it done. Every season, every challenge - handled. All year long, we can do it!",
    highlight: true,
    img: "/images/cardbg.webp"
  },
  {
    title: "Trusted by 700+ Brands",
    description:
      "From startups to influencers to global teams they rely on AfterRender to scale their content production.",
    highlight: false,
  },
];

const PricingBenefits = () => {
  return (
    <section
      className={`${jakarta.className} relative bg-[#FAFAFA] text-black py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Top Tag & Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold tracking-widest uppercase text-gray-400">
            <span className="w-2 h-2 rounded-full bg-[#CEFF00] inline-block" />
            <span>Benefits</span>
          </div>
          <div className="flex-1 h-[1px] bg-gray-200" />
        </div>

        {/* Section Header */}
        <div className="mb-12 sm:mb-16 max-w-2xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
            <span>Why Our Work </span>
            <span
              className={`${playfair.className} italic font-normal text-gray-900 block sm:inline`}
            >
              Delivers Results
            </span>
          </h2>
          <p className="mt-3.5 text-gray-500 text-xs sm:text-sm md:text-[14.5px] leading-relaxed font-medium">
            At AfterRender, we combine speed, creativity, and consistency to
            deliver content that fuels brand growth.
          </p>
        </div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {benefitsData.map((benefit, index) => {
            if (benefit.highlight) {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  whileHover={{ y: -5 }}
                  className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center bg-cover bg-center border border-blue-200/70 shadow-[0_15px_40px_rgba(72,162,255,0.25)] flex flex-col justify-center items-center min-h-[220px] overflow-hidden group"
                  style={{
                    backgroundImage: "url('/images/cardbg.webp')",
                  }}
                >
                  <div className="relative z-10">
                    <h3 className="text-lg sm:text-xl font-extrabold text-gray-950 mb-2.5 tracking-tight">
                      {benefit.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-gray-800 font-medium leading-relaxed max-w-xs mx-auto">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center border border-gray-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_18px_45px_rgba(0,0,0,0.07)] transition-all duration-300 flex flex-col justify-center items-center min-h-[220px]"
              >
                <h3 className="text-lg sm:text-xl font-extrabold text-gray-950 mb-2.5 tracking-tight">
                  {benefit.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-gray-500 font-medium leading-relaxed max-w-xs mx-auto">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingBenefits;
