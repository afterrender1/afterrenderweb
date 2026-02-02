"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const SERVICES = [
  {
    id: "brand-audit",
    title: "Brand Audit",
    subtitle: "Comprehensive audit to refine positioning & messaging.",
    includes: [
      "Competitive analysis",
      "Messaging & tone audit",
      "Creative gap identification",
    ],
    image: "/images/services/ba.png",
  },
  {
    id: "website-dev",
    title: "Website Development",
    subtitle: "Fast, SEO-friendly sites that convert visitors to customers.",
    includes: [
      "Performance-first builds",
      "Conversion-focused UI",
      "CMS / e-commerce setup",
    ],
    image: "/images/services/wd.png",
  },
  {
    id: "creative-design",
    title: "Creative Design",
    subtitle: "High-performing visuals and motion assets for social & ads.",
    includes: [
      "Video editing & motion",
      "Thumbnail & static creatives",
      "Brand-aligned templates",
    ],
    image: "/images/services/cd.png",
  },
  {
    id: "social-handles",
    title: "Social Handles",
    subtitle: "Profile strategy, posting cadence, and growth playbooks.",
    includes: [
      "Profile optimization",
      "Content calendar",
      "Community & engagement",
    ],
    image: "/images/services/sh.png",
  },
  {
    id: "youtube",
    title: "YouTube Growth",
    subtitle: "Long-form strategy, production & channel optimization.",
    includes: [
      "Channel optimization",
      "Scripts & thumbnails",
      "Publishing + repurposing",
    ],
    image: "/images/services/yg.png",
  },
];

const ServiceCard = ({ title, subtitle, includes, image }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="
    group
    bg-white/5 backdrop-blur-md
    rounded-xl sm:rounded-2xl
    p-4 sm:p-6
    border border-white/10
    flex flex-col
    shadow-md hover:shadow-[#48A2FF]/10
    transition-all
  "
    >
      {/* Image */}
      <div className="
    relative w-full
    aspect-4/3
    mb-4
    rounded-lg overflow-hidden
    bg-white/5
  ">
        <Image
          src={image}
          alt={title}
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Title */}
      <div className="mb-3">
        <h3 className="text-base sm:text-xl font-bold text-white leading-tight">
          {title}
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">
          {subtitle}
        </p>
      </div>

      {/* Includes */}
      <ul className="space-y-2 mb-4">
        {includes.slice(0, 4).map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <svg
              className="w-3.5 h-3.5 text-[#48A2FF] mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-white text-xs leading-relaxed">
              {item}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={() => {
          const el = document.getElementById("contact");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        className="
      mt-auto
      w-full
      py-2.5 sm:py-3.5
      bg-linear-to-r from-[#48A2FF] to-[#C9E4FF]
      text-[#0A1A2F]
      text-sm sm:text-base
      font-semibold
      rounded-lg sm:rounded-xl
      transition-all
      hover:scale-[1.02]
    "
      >
        Get Quote
      </button>
    </motion.div>

  );
};

const ServicesCards = () => {
  return (
    <div className="relative min-h-screen bg-black py-16 sm:py-20 px-4 sm:px-6 md:px-12 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage: `url('/images/herobg.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black via-black/80 to-black" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-12 sm:mb-16" style={{ fontFamily: "poppins" }}>
          <h2 className="text-2xl sm:text-4xl md:text-[2.8rem] font-semibold text-white mb-3">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#48A2FF] to-[#C9E4FF]">
              Services
            </span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Everything your brand needs to scale and shine.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8" style={{ fontFamily: "poppins" }}>
          {SERVICES.map((s) => (
            <ServiceCard
              key={s.id}
              title={s.title}
              subtitle={s.subtitle}
              includes={s.includes}
              image={s.image}
            />
          ))}
        </div>
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
             w-72 h-72 sm:w-96 sm:h-96 bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] 
             rounded-full blur-3xl opacity-40 pointer-events-none"
      />
    </div>
  );
};

export default ServicesCards;
