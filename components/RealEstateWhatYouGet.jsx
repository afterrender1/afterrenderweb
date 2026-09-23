"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { FileText, Camera, UploadCloud } from "lucide-react";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "600", "700"],
});

const highlights = [
  {
    icon: FileText,
    title: "A Script Before Every Shoot",
    description:
      "We send you a script ahead of time, so nobody's standing around wondering what to say.",
  },
  {
    icon: Camera,
    title: "On-Location, Twice a Week",
    description:
      "Our camera operator visits your business two days a week to film everything you need.",
  },
  {
    icon: UploadCloud,
    title: "Edited & Uploaded For You",
    description:
      "Our editors turn the footage into finished videos, and we upload them to your channels.",
  },
];

const RealEstateWhatYouGet = () => {
  return (
    <section
      className={`${jakarta.className} relative bg-white text-black py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Top Tag & Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold tracking-widest uppercase text-gray-400">
            <span className="w-2 h-2 rounded-full bg-[#B8860B] inline-block shadow-[0_0_8px_rgba(184,134,11,0.6)]" />
            <span>What You Get</span>
          </div>
          <div className="flex-1 h-[1px] bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left: Heading + Copy */}
          <div className="lg:col-span-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15] mb-5">
              <span>Consistent video, </span>
              <span
                className={`${playfair.className} italic font-normal text-gray-900 block sm:inline`}
              >
                off your plate.
              </span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed mb-4">
              Most businesses know they should be posting video. The problem
              is finding the time to plan it, film it, edit it and actually
              get it online every week. That&apos;s the part we take off
              your plate.
            </p>
            <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed">
              Our camera operator visits your business two days a week.
              Before every shoot, we send you a script, so nobody&apos;s
              standing around wondering what to say. After the shoot, our
              editors turn the footage into finished videos, and we upload
              them to your channels for you.
            </p>
          </div>

          {/* Right: 3 Highlight Cards */}
          <div className="lg:col-span-6 flex flex-col gap-4 sm:gap-5">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="flex items-start gap-4 bg-[#FAFAFA] border border-gray-200/80 rounded-2xl p-5 sm:p-6 hover:border-[#B8860B]/40 hover:shadow-[0_12px_30px_rgba(184,134,11,0.1)] transition-all duration-300"
                >
                  <div
                    className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-black shadow-[0_6px_16px_rgba(184,134,11,0.3)]"
                    style={{
                      background:
                        "linear-gradient(135deg, #FFD700 0%, #B8860B 100%)",
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-950 tracking-tight mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealEstateWhatYouGet;
