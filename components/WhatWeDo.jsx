"use client";

import React from "react";
import { Plus_Jakarta_Sans, Playfair_Display } from "@/app/lib/fonts";
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

const capabilities = [
  {
    number: "01",
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
  "Realtors",
  "Real Estate Videos",
  "Service Base Business Videos"
];

export default function WhatWeDo() {
  return (
    <section
      className={`${jakarta.className} relative bg-[#FAFAFA] text-black py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">
              What We Do
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] tracking-tight leading-[1.15]">
              <span>Transforming Ideas into a Scalable </span>
              <span className={`${playfair.className} italic font-normal text-[#1a1a1a]`}>
                Growth Engine
              </span>
            </h2>
            <p className="mt-4 text-[#555555] text-sm sm:text-base leading-relaxed">
              From viral short-form clips to full-scale YouTube channel management
              and high-converting advertising assets, here is how AfterRender
              powers creators, modern founders, and ambitious brands.
            </p>
          </div>

          <Link
            href="/our-work"
            className="group inline-flex items-center gap-2 self-start lg:self-auto shrink-0 text-sm font-semibold text-[#0A2540] underline underline-offset-4 decoration-[#0A2540]/30 hover:decoration-[#48A2FF] transition-colors"
          >
            Explore Our Portfolio
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Services: plain rows, stacked on mobile, three columns on desktop */}
        <div className="border-t border-gray-300">
          {capabilities.map((cap) => (
            <article
              key={cap.number}
              className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-4 py-7 sm:py-9 border-b border-gray-300"
            >
              <div className="lg:col-span-3 flex lg:flex-col items-baseline lg:items-start gap-3 lg:gap-1">
                <span className="text-sm font-semibold text-[#48A2FF]">{cap.number}</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {cap.tag}
                </span>
              </div>

              <div className="lg:col-span-5">
                <h3 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight mb-2.5">
                  {cap.title}
                </h3>
                <p className="text-sm sm:text-[15px] text-[#555555] leading-relaxed">
                  {cap.description}
                </p>
              </div>

              <ul className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-x-6 gap-y-1.5 text-sm text-gray-800 lg:pt-1">
                {cap.deliverables.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span aria-hidden="true" className="text-[#48A2FF]">–</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Scope */}
        <div className="mt-10 sm:mt-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-3">
            Everything Your Brand Needs Under One Roof
          </p>
          <p className="text-base sm:text-lg leading-relaxed text-gray-800">
            {scopeChips.join(" · ")}
          </p>
        </div>
      </div>
    </section>
  );
}
