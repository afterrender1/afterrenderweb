"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus_Jakarta_Sans, Playfair_Display } from "@/app/lib/fonts";
import EventHeroBackdrop from "./EventHeroBackdrop";
import WebsiteShowcaseCarousel from "./WebsiteShowcaseCarousel";
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

const words = ["Landing Pages", "Business Websites", "Portfolio Sites"];
const LONGEST_WORD = words.reduce((a, b) => (b.length > a.length ? b : a));

// Same typewriter as the home hero, with website words and a darker gradient for the light background.
// Lives in its own component so its 40–80ms ticks re-render only this span.
const Typewriter = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex];

    // Full word typed: hold it for 2s before deleting
    if (!deleting && text === word) {
      const hold = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(hold);
    }

    const timeout = setTimeout(
      () => {
        if (!deleting) {
          setText(word.substring(0, text.length + 1));
        } else if (text === "") {
          setDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        } else {
          setText(word.substring(0, text.length - 1));
        }
      },
      deleting ? 40 : 80
    );
    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex]);

  const cursor = (
    <span className="inline-block w-[2px] h-[0.85em] bg-[#2f8cf5]/70 ml-1.5 align-middle animate-pulse" />
  );

  // An invisible copy of the longest word reserves the width, so typing doesn't reflow the headline
  return (
    <span className={`${playfair.className} italic font-normal tracking-normal inline-grid min-h-[1.2em]`}>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1 inline-flex items-center whitespace-nowrap">
        {LONGEST_WORD}
        {cursor}
      </span>
      <span className="col-start-1 row-start-1 justify-self-center lg:justify-self-start inline-flex items-center whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[#1a73e8] via-[#2f8cf5] to-[#48A2FF]">
        {text}
        {cursor}
      </span>
    </span>
  );
};

const highlights = ["Custom design", "Mobile-first", "SEO-ready", "Delivered in 5–7 days"];

// `backgroundUrl` swaps in the live event background (same as the pricing hero);
// `showcase` (portfolio items) feeds the carousel under the headline
const WebsiteHero = ({ backgroundUrl = "", showcase = [] }) => {
  return (
    <section
      id="pricing"
      className={`${jakarta.className} relative ${backgroundUrl ? "isolate" : ""} bg-[#FAFAFA] text-black pt-28 sm:pt-36 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col items-center`}
    >
      <EventHeroBackdrop url={backgroundUrl} />

      {/* Background Soft Mesh Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-[#eaf4ff]/80 via-[#f5f8ff]/30 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Text on the left, pricing card on the right (stacked on phones/tablets) */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_440px] items-center gap-10 sm:gap-12 lg:gap-16">
        {/* Hero Title & Subtitle */}
        {/* Sits near the top of the card on desktop instead of centering against its full height */}
        <div className="relative min-w-0 text-center lg:text-left lg:self-start lg:pt-12">
          {/* Floating Badges */}
          <motion.div
            initial={{ opacity: 0, x: -20, rotate: -8 }}
            animate={{ opacity: 1, x: 0, rotate: -8 }}
            whileHover={{ scale: 1.06, rotate: -4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute -top-10 left-[8%] lg:left-0 z-20 hidden sm:flex items-center gap-1 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] text-white text-[11px] md:text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-[0_8px_20px_rgba(59,130,246,0.3)] cursor-pointer select-none"
          >
            <span>@Design</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20, rotate: 10 }}
            animate={{ opacity: 1, x: 0, rotate: 10 }}
            whileHover={{ scale: 1.06, rotate: 6 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute -top-8 right-[8%] lg:right-[12%] z-20 hidden sm:flex items-center gap-1 bg-gradient-to-r from-[#48A2FF] to-[#93C5FD] text-white text-[11px] md:text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-[0_8px_20px_rgba(72,162,255,0.3)] cursor-pointer select-none"
          >
            <span>@Develop</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-[clamp(2rem,3.6vw+0.9rem,3.5rem)] font-extrabold tracking-tight text-[#111111] leading-[1.1]"
          >
            <span className="block">We Build</span>
            <span className="block">
              <Typewriter />
            </span>
            <span className="block">That Win Clients.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="mt-4 sm:mt-5 text-[#555555] text-[13.5px] sm:text-sm md:text-[15px] leading-relaxed max-w-md sm:max-w-xl mx-auto lg:mx-0 font-medium"
          >
            A fast, modern and mobile-friendly website for your business, designed
            and built by our team and delivered ready to launch.
          </motion.p>

          <motion.ul
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.14 }}
            className="mt-5 sm:mt-6 flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2"
          >
            {highlights.map((text) => (
              <li key={text} className="flex items-center gap-1.5 text-[13px] sm:text-sm font-medium text-gray-700">
                <Check size={15} strokeWidth={2.5} className="text-[#2f8cf5]" />
                {text}
              </li>
            ))}
          </motion.ul>

          {showcase.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.22 }}
              className="mt-8 sm:mt-10 -mx-4 sm:mx-0"
            >
              <WebsiteShowcaseCarousel items={showcase} />
            </motion.div>
          )}
        </div>

      {/* Pricing Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="relative w-full max-w-[440px] mx-auto lg:mx-0 lg:justify-self-end"
      >
        <div className="rounded-xl bg-white border border-zinc-200 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_8px_24px_-12px_rgba(0,0,0,0.12)]">
          {/* Plan + price */}
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3 text-xs sm:text-[12.5px]">
              <span className="font-semibold text-[#1a73e8]">Website package</span>
              <span className="flex items-center gap-1 text-zinc-500">
                <Clock size={12} />
                5–7 day delivery
              </span>
            </div>
            <h2 className="mt-1 sm:mt-1.5 text-[17px] sm:text-xl font-semibold tracking-tight text-zinc-950">
              Landing Page Website
            </h2>
            <p className="mt-1 text-[13px] sm:text-[13.5px] leading-snug sm:leading-relaxed text-zinc-500">
              Everything a new business needs to look professional online and start getting enquiries.
            </p>

            <div className="mt-4 sm:mt-5 flex items-baseline flex-wrap gap-x-2 gap-y-1">
              <span className="text-[32px] sm:text-4xl font-semibold tracking-tight text-zinc-950 leading-none">$300</span>
              <span className="text-sm text-zinc-500">USD</span>
              <del className="text-sm text-zinc-400">
                <span className="sr-only">Regular price </span>$400
              </del>
              <span className="text-[12.5px] font-medium text-emerald-700">Save $100</span>
            </div>
            <p className="mt-1 sm:mt-1.5 text-xs sm:text-[12.5px] text-zinc-500">One-time payment, no monthly fees</p>

            <div className="mt-4 sm:mt-5 grid grid-cols-[1.4fr_1fr] gap-2 text-[13px] sm:text-sm">
              <Link
                href={CALENDLY_URL}
                target="_blank"
                className="group inline-flex items-center justify-center gap-1.5 h-10 rounded-lg bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] hover:brightness-105 text-[#0A2540] font-bold whitespace-nowrap shadow-sm hover:shadow-md transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/40 focus-visible:ring-offset-2"
              >
                Book a free call
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={WHATSAPP_URL}
                target="_blank"
                className="inline-flex items-center justify-center h-10 rounded-lg border border-[#48A2FF]/40 bg-white hover:bg-[#F3F9FF] text-[#0A2540] font-semibold whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/40"
              >
                WhatsApp us
              </Link>
            </div>
          </div>

          {/* What's included */}
          <div className="border-t border-zinc-100 px-4 sm:px-6 py-4 sm:py-5">
            <p className="text-xs sm:text-[12.5px] font-medium text-zinc-500">4 custom pages</p>
            <dl className="mt-2 sm:mt-2.5 grid grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-2.5 sm:gap-y-3">
              {pages.map(({ label, note }) => (
                <div key={label} className="min-w-0">
                  <dt className="text-[13px] sm:text-[13.5px] font-medium text-zinc-900">{label}</dt>
                  <dd className="text-[11.5px] sm:text-xs text-zinc-500 leading-snug">{note}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-4 sm:mt-5 text-xs sm:text-[12.5px] font-medium text-zinc-500">Included on every page</p>
            <ul className="mt-2 sm:mt-2.5 grid grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-1.5 sm:gap-y-2">
              {features.map((text) => (
                <li key={text} className="flex items-start gap-1.5 sm:gap-2 text-[12px] sm:text-[13px] leading-snug text-zinc-700">
                  <Check size={14} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[#2f8cf5]" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-zinc-100 bg-[#F7FBFF] rounded-b-xl px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-[12.5px] text-zinc-500">
            Need more pages or e-commerce?{" "}
            <Link href={CALENDLY_URL} target="_blank" className="font-semibold text-[#1a73e8] hover:underline underline-offset-2">
              Get a custom quote
            </Link>
          </div>
        </div>
      </motion.div>
      </div>
    </section>
  );
};

export default WebsiteHero;
