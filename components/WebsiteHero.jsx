"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus_Jakarta_Sans, Playfair_Display } from "@/app/lib/fonts";
import EventHeroBackdrop from "./EventHeroBackdrop";
import {
  Check,
  ArrowRight,
  Clock,
} from "lucide-react";

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
const WHATSAPP_NUMBER = "923235100033";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi! I'm interested in the $300 Landing Page Website package."
)}`;

const pages = [
  { label: "Home", note: "Hero, offers & highlights" },
  { label: "About", note: "Your story & your team" },
  { label: "Services", note: "What you offer, clearly" },
  { label: "Contact", note: "Form, map & WhatsApp" },
];

const features = [
  "Fully mobile responsive",
  "SEO-ready structure",
  "Fast loading speed",
  "Custom design, no templates",
  "Contact form & WhatsApp button",
  "Free SSL & 7 days support",
];

const CheckDot = () => (
  <span className="mt-px flex items-center justify-center w-[18px] h-[18px] rounded-full border border-[#2f8cf5]/40 bg-white text-[#2f8cf5] shrink-0">
    <Check size={11} strokeWidth={3} />
  </span>
);

// `backgroundUrl` swaps in the live event background (same as the pricing hero)
const WebsiteHero = ({ backgroundUrl = "" }) => {
  return (
    <section
      id="pricing"
      className={`${jakarta.className} relative ${backgroundUrl ? "isolate" : ""} bg-[#FAFAFA] text-black pt-28 sm:pt-36 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col items-center`}
    >
      <EventHeroBackdrop url={backgroundUrl} />

      {/* Background Soft Mesh Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-[#eaf4ff]/80 via-[#f5f8ff]/30 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Floating Badges */}
      <div className="w-full max-w-3xl relative">
        <motion.div
          initial={{ opacity: 0, x: -20, rotate: -8 }}
          animate={{ opacity: 1, x: 0, rotate: -8 }}
          whileHover={{ scale: 1.06, rotate: -4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute -top-7 left-1 sm:left-4 md:left-8 z-20 hidden sm:flex items-center gap-1 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] text-white text-[11px] md:text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-[0_8px_20px_rgba(59,130,246,0.3)] cursor-pointer select-none"
        >
          <span>@Design</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20, rotate: 10 }}
          animate={{ opacity: 1, x: 0, rotate: 10 }}
          whileHover={{ scale: 1.06, rotate: 6 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute -top-7 right-1 sm:right-4 md:right-8 z-20 hidden sm:flex items-center gap-1 bg-gradient-to-r from-[#48A2FF] to-[#93C5FD] text-white text-[11px] md:text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-[0_8px_20px_rgba(72,162,255,0.3)] cursor-pointer select-none"
        >
          <span>@Develop</span>
        </motion.div>
      </div>

      {/* Hero Title & Subtitle */}
      <div className="text-center max-w-2xl mx-auto z-10">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-[clamp(1.75rem,5vw+0.6rem,2.875rem)] tracking-tight text-[#111111] leading-[1.15]"
        >
          <span className={`${playfair.className} italic font-normal block sm:inline-block`}>
            Professional Website!
          </span>{" "}
          <span className="font-extrabold block sm:inline-block">One Simple Price.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mt-3.5 text-[#555555] text-[13.5px] sm:text-sm md:text-[15px] leading-relaxed max-w-md sm:max-w-xl mx-auto font-medium"
        >
          A fast, modern and mobile-friendly website for your business, designed
          and built by our team and delivered ready to launch.
        </motion.p>
      </div>

      {/* Pricing Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="relative z-10 mt-8 sm:mt-12 w-full max-w-[440px]"
      >
        <div className="rounded-[24px] border border-[#D9E7FB] bg-gradient-to-b from-[#EEF5FF] via-white to-white p-5 sm:p-7 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_24px_50px_-24px_rgba(47,140,245,0.35)]">
          {/* Plan */}
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-[22px] sm:text-2xl font-bold tracking-tight text-gray-950 leading-tight">
              Landing Page Website
            </h2>
            <span className="mt-1 shrink-0 rounded-full bg-[#2f8cf5] text-white text-[11px] font-semibold px-2.5 py-1 leading-none">
              Popular
            </span>
          </div>
          <p className="mt-2 text-[13px] sm:text-[13.5px] text-gray-500 leading-relaxed">
            Everything a new business needs to look professional online and
            start getting enquiries.
          </p>

          {/* Price */}
          <div className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-[44px] sm:text-5xl font-bold tracking-tight text-gray-950 leading-none">
              $300
            </span>
            <del className="text-lg font-semibold text-gray-400 decoration-[#2f8cf5] decoration-2">
              <span className="sr-only">Regular price </span>$400
            </del>
            <span className="text-[13px] sm:text-sm font-medium text-gray-500">/one-time</span>
          </div>

          {/* CTA */}
          <Link
            href={CALENDLY_URL}
            target="_blank"
            className="group mt-5 flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-gradient-to-b from-[#4FA6FF] to-[#2f8cf5] hover:to-[#1f7be6] active:scale-[0.99] text-white font-semibold text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_22px_-8px_rgba(47,140,245,0.7)] transition-all duration-200"
          >
            Book a Free Call
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[12.5px] text-gray-500">
            <Link href={WHATSAPP_URL} target="_blank" className="font-medium text-gray-700 hover:text-[#1a5fd0] hover:underline">
              Chat on WhatsApp
            </Link>
            <span className="text-gray-300" aria-hidden="true">•</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={12} />
              Delivery in 5–7 days
            </span>
          </div>

          {/* Key features */}
          <div className="mt-6 pt-5 border-t border-gray-200/80">
            <p className="text-[13px] font-semibold text-gray-900">Key features</p>
            <ul className="mt-3.5 space-y-3">
              {pages.map(({ label, note }, index) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.35 + index * 0.06, ease: "easeOut" }}
                  className="flex items-start gap-2.5"
                >
                  <CheckDot />
                  <span className="text-[13.5px] leading-snug text-gray-800">
                    <span className="font-semibold text-gray-950">{label} page</span>
                    <span className="text-gray-500"> · {note}</span>
                  </span>
                </motion.li>
              ))}
            </ul>

            <p className="mt-5 pt-5 border-t border-dashed border-gray-200 text-[13px] font-semibold text-gray-900">
              Plus, on every page:
            </p>
            <ul className="mt-3.5 space-y-3">
              {features.map((text, index) => (
                <motion.li
                  key={text}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.6 + index * 0.05, ease: "easeOut" }}
                  className="flex items-start gap-2.5"
                >
                  <CheckDot />
                  <span className="text-[13.5px] leading-snug text-gray-800">{text}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <p className="mt-6 pt-4 border-t border-gray-200/80 text-[12.5px] text-gray-500 leading-relaxed text-center">
            Need more pages or e-commerce?{" "}
            <Link href={CALENDLY_URL} target="_blank" className="font-semibold text-[#1a5fd0] hover:underline">
              Get a custom quote
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default WebsiteHero;
