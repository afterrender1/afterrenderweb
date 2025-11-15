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
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="bg-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col shadow-lg hover:shadow-[#48A2FF]/10 transition-all duration-300"
    >
      {/* Image */}
      <div className="w-full h-64 sm:h-90 mb-6 rounded-xl overflow-hidden flex items-center justify-center ">
        <Image
          src={image}
          alt={title}
          width={400}
          height={400}
          className="object-cover rounded-md"
        />
      </div>

      {/* Header */}
      <div className="mb-4 flex flex-col items-start">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-400 text-sm sm:text-base">{subtitle}</p>
      </div>

      {/* Includes */}
      <div className="grow">
        <p className="text-gray-200 font-medium mb-3 text-sm sm:text-base">
          Includes:
        </p>
        <ul className="space-y-2 sm:space-y-3">
          {includes.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-[#48A2FF] mt-1 shrink-0"
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
              <span className="text-white text-sm sm:text-base">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <button
        onClick={() => {
          const el = document.getElementById("contact");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        className="cursor-pointer mt-6 w-full py-3 px-6 sm:py-4 sm:px-8 bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] text-[#0A1A2F] font-semibold rounded-2xl hover:scale-[1.03] hover:shadow-md transition-all duration-300"
      >
        Get a Quote
      </button>
    </motion.div>
  );
};

const ServicesCards = () => {
  return (
    <div className="relative min-h-screen bg-black py-16 sm:py-20 px-4 sm:px-6 md:px-12 overflow-hidden">
      {/* Background Overlay */}
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

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16" style={{fontFamily : "poppins"}}>
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

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8" style={{fontFamily : "poppins"}}>
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

      {/* Decorative Glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
             w-72 h-72 sm:w-96 sm:h-96 bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] 
             rounded-full blur-3xl opacity-40 pointer-events-none"
      />
    </div>
  );
};

export default ServicesCards;
