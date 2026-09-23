"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { Sparkles, Video, Palette, Cpu, Check, ArrowRight, Users, Rocket, Eye } from "lucide-react";
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

const pillars = {
  creativity: {
    id: "creativity",
    tabLabel: "Creativity",
    badge: "Visual Excellence",
    icon: Palette,
    title: "Unmatched Creative Craftsmanship",
    description:
      "We design bold visual identities, eye-catching graphics, and cinematic video edits tailored to evoke emotion and captivate modern digital audiences.",
    stats: [
      { label: "High-Retention Edits", val: "500+" },
      { label: "Brand Identities Built", val: "120+" },
      { label: "Client Satisfaction", val: "99%" },
    ],
    features: [
      "Custom Graphic Design & Social Carousels",
      "Short-Form Viral Reels, TikToks & Shorts",
      "High-Production Long-Form YouTube Edits",
      "Dynamic Motion Graphics & Visual FX",
      "Unlimited Revisions & Creative Freedom",
    ],
  },
  strategy: {
    id: "strategy",
    tabLabel: "Strategy",
    badge: "Audience Engagement",
    icon: Rocket,
    title: "Data-Informed Content Strategy",
    description:
      "Great visuals need purpose. We align every creative asset with platform algorithms, audience psychology, and performance marketing objectives.",
    stats: [
      { label: "Views Generated", val: "50M+" },
      { label: "Average CTR Lift", val: "+34%" },
      { label: "Retention Boost", val: "+68%" },
    ],
    features: [
      "Platform-Tailored Aspect Ratios & Hooks",
      "Conversion-Focused Ad Creatives",
      "Audience Retention & Pacing Optimization",
      "Brand Storytelling & Narrative Pacing",
      "Dedicated Creative Project Management",
    ],
  },
  technology: {
    id: "technology",
    tabLabel: "Technology & AI",
    badge: "Next-Gen Innovation",
    icon: Cpu,
    title: "AI-Driven Content Acceleration",
    description:
      "By integrating cutting-edge AI workflows, generative visual systems, and smart automation, we deliver studio-grade outputs at unprecedented speed.",
    stats: [
      { label: "Turnaround Speed", val: "24-48h" },
      { label: "AI Workflows", val: "100% Pro" },
      { label: "Format Flexibility", val: "Multi-Platform" },
    ],
    features: [
      "Generative AI Visuals & Background Enhancements",
      "Automated Subtitling, B-roll & Sound Design",
      "Rapid Experimentation & A/B Creative Variants",
      "Seamless Cloud Asset Management",
      "Cutting-Edge Render Engines & 4K Pipelines",
    ],
  },
};

export default function AboutUsHero() {
  const [activeTab, setActiveTab] = useState("creativity");
  const currentPillar = pillars[activeTab];
  const IconComponent = currentPillar.icon;

  return (
    <section
      className={`${jakarta.className} relative min-h-100 bg-[#FAFAFA] text-black pt-32 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col items-center justify-start`}
    >
      {/* Background Soft Mesh Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-b from-[#eaf4ff]/60 via-[#f5f8ff]/30 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Floating Badges (Pricing Hero style) */}
      <div className="w-full max-w-3xl relative">
        {/* Left Floating Badge: @Join us */}
        <Link href="/apply">
          <motion.div
            initial={{ opacity: 0, x: -20, rotate: -8 }}
            animate={{ opacity: 1, x: 0, rotate: -8 }}
            whileHover={{ scale: 1.08, rotate: -4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute -top-7 left-1 sm:left-4 md:left-8 z-20 hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] text-white text-[11px] md:text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-[0_8px_20px_rgba(59,130,246,0.3)] cursor-pointer select-none"
          >
            <Users className="w-3.5 h-3.5" />
            <span>@Join us</span>
          </motion.div>
        </Link>

        {/* Right Floating Badge: @workus */}
        <Link href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
          <motion.div
            initial={{ opacity: 0, x: 20, rotate: 10 }}
            animate={{ opacity: 1, x: 0, rotate: 10 }}
            whileHover={{ scale: 1.08, rotate: 6 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute -top-7 right-1 sm:right-4 md:right-8 z-20 hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-[#c084fc] to-[#a855f7] text-white text-[11px] md:text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-[0_8px_20px_rgba(168,85,247,0.3)] cursor-pointer select-none"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>@workus</span>
          </motion.div>
        </Link>
      </div>

      {/* Hero Title & Subtitle */}
      <div className="text-center max-w-3xl mx-auto z-10">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-3xl sm:text-4xl md:text-[44px] lg:text-[48px] tracking-tight text-[#111111] leading-[1.18]"
        >
          <span
            className={`${playfair.className} italic font-normal block sm:inline-block`}
          >
            Turning Ideas into
          </span>{" "}
          <span className="font-extrabold block sm:inline-block text-[#0A2540]">
            Visuals that Inspire
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mt-4 text-[#555555] text-xs sm:text-sm md:text-[15.5px] leading-relaxed max-w-2xl mx-auto font-medium"
        >
          At{" "}
          <span className="inline-block bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] text-[#fff] font-bold px-2 py-0.5 rounded-md shadow-xs">
            Afterrender
          </span>
          , we blend creativity, strategy, and technology to craft videos,
          graphics, and AI-driven content that elevate brands and engage
          audiences across every platform.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] text-[#0A2540] font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-[0_6px_16px_rgba(72,162,255,0.3)] hover:shadow-[0_10px_20px_rgba(72,162,255,0.4)] hover:brightness-105 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Work With Us
          </Link>
          <Link
            href="/apply"
            className="bg-white hover:bg-gray-50 text-gray-800 font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full border border-gray-200 shadow-2xs hover:border-gray-300 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Join Our Team
          </Link>
        </motion.div>
      </div>





      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.25 }}
        className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-7 gap-y-2 text-xs sm:text-[13px] font-medium text-gray-700"
      >
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-[#2563eb]">✓</span>
          <span>Tailored Visual Craftsmanship</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-[#2563eb]">✓</span>
          <span>AI-Driven Creative Speed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-[#2563eb]">✓</span>
          <span>Scalable Content Partnerships</span>
        </div>
      </motion.div>
    </section>
  );
}
