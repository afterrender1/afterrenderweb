"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { PhoneCall, FileText, Camera, UploadCloud } from "lucide-react";

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
    icon: PhoneCall,
    iconBg: "linear-gradient(135deg, #EAF4FF 0%, #C9E4FF 100%)",
    iconColor: "#48A2FF",
    title: "We learn your business",
    description:
      "First, we get on a call and learn about your business: who your customers are, what you sell, and what's worked (or hasn't) before.",
  },
  {
    icon: FileText,
    iconBg: "linear-gradient(135deg, #E6F0FF 0%, #BFD8FF 100%)",
    iconColor: "#2F7FE0",
    title: "We plan & write the scripts",
    description:
      "Then we plan the month and write the scripts. You see them before anything gets filmed.",
  },
  {
    icon: Camera,
    iconBg: "linear-gradient(135deg, #EEF6FF 0%, #D4E9FF 100%)",
    iconColor: "#3A8CF0",
    title: "We film, twice a week",
    description:
      "Our camera operator comes by twice a week to shoot. Each visit usually takes a couple of hours.",
  },
  {
    icon: UploadCloud,
    iconBg: "linear-gradient(135deg, #E3EEFF 0%, #B5D3FF 100%)",
    iconColor: "#1F6FD1",
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
            <span className="w-2 h-2 rounded-full bg-[#CEFF00] inline-block" />
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
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
          {/* Connecting line (desktop only), running through the icon centers */}
          <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#9CCBFF] to-transparent" />

          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative flex flex-col items-center text-center px-2"
              >
                <div
                  className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-[0_6px_18px_rgba(72,162,255,0.15)]"
                  style={{ background: item.iconBg }}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{ color: item.iconColor }}
                    strokeWidth={1.75}
                  />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-950 tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-[13.5px] text-gray-500 leading-relaxed max-w-[220px]">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RealEstateProcess;
