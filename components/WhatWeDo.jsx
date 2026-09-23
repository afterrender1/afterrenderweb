"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { Video, Palette, Sparkles, Layers, ArrowRight, Check, Zap, Flame, MonitorPlay } from "lucide-react";
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

const capabilities = [
  {
    number: "01",
    icon: Video,
    tag: "Video Production",
    title: "High-Retention Video Editing",
    description:
      "We turn raw footage into high-retention cinematic assets. From viral YouTube Shorts and Instagram Reels to high-production long-form videos, our edits use psychological hooks, seamless pacing, and custom sound design to maximize watch time.",
    deliverables: [
      "YouTube Long-Form Edits",
      "Shorts, TikToks & Reels",
      "SaaS Product Walkthroughs",
      "Podcasts & Interview Edits",
    ],
  },
  {
    number: "02",
    icon: Palette,
    tag: "Graphic Design",
    title: "High-CTR Visuals & Brand Design",
    description:
      "Design that captures attention and drives conversions. We craft scroll-stopping static and animated ad creatives, high-CTR YouTube thumbnails, engaging multi-slide social carousels, and full brand asset kits.",
    deliverables: [
      "High-CTR YouTube Thumbnails",
      "Paid Ad Creatives (Static & Motion)",
      "Social Media Carousels",
      "Slide Decks & Brand Collateral",
    ],
  },
  {
    number: "03",
    icon: Sparkles,
    tag: "Next-Gen Workflows",
    title: "AI-Powered Creative Speed",
    description:
      "By fusing seasoned creative directors with generative AI tools and smart rendering pipelines, we deliver top-tier studio quality in 24 to 48 hours without compromising on craftsmanship or brand tone.",
    deliverables: [
      "24–48 Hour Standard Turnaround",
      "AI B-Roll & Visual Enhancements",
      "Dynamic Subtitling & Motion VFX",
      "Rapid Multi-Variant Testing",
    ],
  },
  {
    number: "04",
    icon: Layers,
    tag: "Unlimited Model",
    title: "All-in-One Creative Partner",
    description:
      "No more juggling unreliable freelancers or paying bloated agency retainers. AfterRender provides a dedicated creative team on a flexible monthly subscription with unlimited requests, revisions, and zero contracts.",
    deliverables: [
      "Dedicated Project Manager & Editors",
      "Unlimited Requests & Revisions",
      "Pause, Scale, or Cancel Anytime",
      "Seamless Slack / Trello Workflow",
    ],
  },
];

const scopeChips = [
  "YouTube Edits",
  "Viral Reels & Shorts",
  "High-CTR Thumbnails",
  "Paid Ad Creatives",
  "SaaS Product Demos",
  "Motion Graphics",
  "Brand Identity Kits",
  "Pitch Decks",
  "Podcast Audio/Video",
  "Social Carousels",
];

export default function WhatWeDo() {
  return (
    <section
      className={`${jakarta.className} relative bg-[#FAFAFA] text-black py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header Line: • WHAT WE DO */}
        <div className="flex items-center gap-3 pb-8 sm:pb-12 border-b border-gray-200/80 mb-10 sm:mb-14">
          <span className="w-2.5 h-2.5 rounded-full bg-[#48A2FF] inline-block shadow-xs shrink-0" />
          <span className="text-xs sm:text-[13px] font-bold tracking-[0.2em] uppercase text-gray-500">
            WHAT WE DO
          </span>
        </div>

        {/* Section Header Titles */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] tracking-tight leading-[1.15]"
            >
              <span>Transforming Ideas into a Scalable </span>
              <span
                className={`${playfair.className} italic font-normal text-[#1a1a1a] block sm:inline`}
              >
                Growth Engine
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="mt-4 text-[#555555] text-xs sm:text-sm md:text-[15px] leading-relaxed font-normal"
            >
              From viral short-form clips to full-scale YouTube channel management
              and high-converting advertising assets, here is how AfterRender
              powers creators, modern founders, and ambitious brands.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="shrink-0"
          >
            <Link
              href="/our-work"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0A2540] bg-white border border-gray-200 px-5 py-2.5 rounded-full shadow-2xs hover:border-gray-300 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Explore Our Portfolio</span>
              <ArrowRight className="w-4 h-4 text-[#48A2FF]" />
            </Link>
          </motion.div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-14">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.number}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="group relative bg-white rounded-3xl p-7 sm:p-9 border border-gray-200/90 hover:border-[#48A2FF]/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(72,162,255,0.12)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      {/* Icon Box with signature Book a Call gradient */}
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] text-[#0A2540] flex items-center justify-center shadow-[0_6px_18px_rgba(72,162,255,0.28)] group-hover:scale-105 group-hover:shadow-[0_8px_24px_rgba(72,162,255,0.4)] transition-all duration-300">
                        <Icon className="w-6 h-6 text-[#0A2540] stroke-[2.2]" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#F0F6FF] text-[#0A2540] border border-[#D5E6F8]">
                        {cap.tag}
                      </span>
                    </div>

                    <span className="text-2xl font-black text-gray-200 group-hover:text-[#48A2FF]/80 transition-colors font-mono">
                      {cap.number}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight mb-3">
                    {cap.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-[14px] text-[#555555] leading-relaxed mb-6 font-normal">
                    {cap.description}
                  </p>
                </div>

                {/* Deliverables List */}
                <div className="pt-5 border-t border-gray-100">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Key Deliverables
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {cap.deliverables.map((item, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                        <div className="w-4 h-4 rounded-full bg-[#EBF4FF] text-[#0A2540] flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-[#0A2540] stroke-[3]" />
                        </div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Deliverables Scope Tag Cloud Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] text-center"
        >
          <div className="text-xs sm:text-[13px] font-bold uppercase tracking-widest text-gray-500 mb-4">
            Everything Your Brand Needs Under One Roof
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {scopeChips.map((chip, i) => (
              <span
                key={i}
                className="text-xs sm:text-[13px] font-semibold text-gray-800 bg-[#F4F4F5] hover:bg-gradient-to-r hover:from-[#48A2FF] hover:to-[#C9E4FF] hover:text-[#0A2540] px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-default"
              >
                {chip}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
