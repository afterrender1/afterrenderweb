"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { Check } from "lucide-react";
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

const packages = [
  {
    name: "Starter",
    badge: "STARTER",
    price: "2,500",
    tagline: "Good for businesses getting started with regular video.",
    featured: false,
    features: [
      "10 videos shot on mobile",
      "Scripts written for every video",
      "Edited in Adobe Premiere Pro and After Effects",
      "5 static posts",
      "We upload everything to your channels",
      "Shoots twice a week at your location",
    ],
  },
  {
    name: "Pro",
    badge: "MOST POPULAR",
    price: "5,000",
    tagline: "For brands that want a more polished, cinematic look.",
    featured: true,
    features: [
      "10 videos shot on a professional cinema camera",
      "Color graded in DaVinci Resolve for a high-end finish",
      "Scripts written for every video",
      "Edited in Adobe Premiere Pro and After Effects",
      "7 static posts",
      "We upload everything to your channels",
      "Shoots twice a week at your location",
    ],
  },
  {
    name: "Premium",
    badge: "PREMIUM",
    price: "15,000",
    tagline: "For businesses that want to post every single day.",
    featured: false,
    features: [
      "30 videos shot on a professional cinema camera",
      "Color graded in DaVinci Resolve",
      "Scripts written for every video",
      "Edited in Adobe Premiere Pro and After Effects",
      "10 static posts",
      "We upload everything to your channels",
      "Shoots twice a week at your location",
    ],
  },
];

// Small "rivet" corner dots that give each card the punched-card look
const cornerPositions = [
  "top-3 left-3",
  "top-3 right-3",
  "bottom-3 left-3",
  "bottom-3 right-3",
];

const CornerDots = ({ dark }) => (
  <>
    {cornerPositions.map((pos) => (
      <span
        key={pos}
        className={`absolute ${pos} w-2 h-2 rounded-full border pointer-events-none ${
          dark ? "border-white/20" : "border-gray-300"
        }`}
      />
    ))}
  </>
);

const RealEstatePackages = () => {
  return (
    <section
      id="packages"
      className={`${jakarta.className} relative bg-[#FAFAFA] text-black py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Top Tag & Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold tracking-widest uppercase text-gray-400">
            <span className="w-2 h-2 rounded-full bg-[#B8860B] inline-block shadow-[0_0_8px_rgba(184,134,11,0.6)]" />
            <span>Packages</span>
          </div>
          <div className="flex-1 h-[1px] bg-gray-200" />
        </div>

        <div className="mb-10 sm:mb-14 max-w-2xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
            <span>Pick the plan that </span>
            <span
              className={`${playfair.className} italic font-normal text-gray-900 block sm:inline`}
            >
              fits your pace.
            </span>
          </h2>
        </div>

        {/* 3 Package Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
          {packages.map((pkg, index) => {
            const isPremium = pkg.name === "Premium";

            return (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`relative flex flex-col rounded-2xl p-6 sm:p-7 transition-all duration-300 ${
                  pkg.featured
                    ? "bg-[#111111] text-white border border-white/10 shadow-[0_25px_60px_-15px_rgba(184,134,11,0.35)] lg:-translate-y-3"
                    : "bg-white text-black border border-gray-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
                }`}
              >
                <CornerDots dark={pkg.featured} />

                {/* Top Row: Name + Badge */}
                <div className="flex items-center justify-between mb-5">
                  <h3
                    className={`text-sm sm:text-base font-bold tracking-tight ${
                      pkg.featured ? "text-white" : "text-gray-950"
                    }`}
                  >
                    {pkg.name} Plan
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      pkg.featured
                        ? "text-black border-transparent"
                        : isPremium
                        ? "bg-[#111111] text-white border-transparent"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                    style={
                      pkg.featured
                        ? {
                            background:
                              "linear-gradient(135deg, #FFD700 0%, #B8860B 100%)",
                          }
                        : undefined
                    }
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        pkg.featured
                          ? "bg-black/60"
                          : isPremium
                          ? "bg-[#FFD700]"
                          : "bg-gray-400"
                      }`}
                    />
                    {pkg.badge}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 mb-1.5">
                  <span
                    className={`text-2xl sm:text-[28px] font-extrabold tracking-tight ${
                      pkg.featured ? "text-white" : "text-gray-950"
                    }`}
                  >
                    ${pkg.price}
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      pkg.featured ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    /month
                  </span>
                </div>

                <p
                  className={`text-xs sm:text-[12.5px] leading-relaxed mb-5 ${
                    pkg.featured ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {pkg.tagline}
                </p>

                {/* CTA Button */}
                <Link
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full text-center font-bold text-xs sm:text-sm py-2.5 sm:py-3 px-5 rounded-xl transition-all duration-200 active:scale-[0.98] mb-6 ${
                    pkg.featured
                      ? "bg-white text-black hover:bg-gray-100"
                      : isPremium
                      ? "bg-[#111111] text-white hover:bg-black shadow-sm hover:shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Book a Free Call
                </Link>

                {/* Feature List */}
                <ul className="space-y-2.5 sm:space-y-3 grow">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span
                        className={`shrink-0 mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${
                          pkg.featured
                            ? "border-white/25"
                            : "border-gray-300"
                        }`}
                      >
                        <Check
                          className={`w-2.5 h-2.5 stroke-[3] ${
                            pkg.featured ? "text-gray-300" : "text-gray-500"
                          }`}
                        />
                      </span>
                      <span
                        className={`text-xs sm:text-[13px] font-medium tracking-tight leading-tight ${
                          pkg.featured ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RealEstatePackages;
