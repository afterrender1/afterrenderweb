"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Plus_Jakarta_Sans, Playfair_Display } from "@/app/lib/fonts";
import { ChevronDown, ArrowRight } from "lucide-react";

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
const WHATSAPP_URL = `https://wa.me/923235100033?text=${encodeURIComponent(
  "Hi! I'd like a plan and quote for my website."
)}`;

const processSteps = [
  {
    step: "01",
    title: "Discovery Call",
    description: "We learn about your business, goals, audience and competitors.",
  },
  {
    step: "02",
    title: "Design",
    description: "We craft a custom design and refine it with you until it feels right.",
  },
  {
    step: "03",
    title: "Development",
    description: "We build it fast, responsive and SEO-ready on a modern stack.",
  },
  {
    step: "04",
    title: "Launch & Support",
    description: "We go live, hand over everything and stay on for support.",
  },
];

const faqs = [
  {
    q: "How long does it take to build a website?",
    a: "A landing page usually takes 5–7 days. A full business website takes 2–3 weeks depending on pages and features.",
  },
  {
    q: "Will my website work on mobile?",
    a: "Yes. Every website we build is fully responsive and tested on mobile, tablet and desktop.",
  },
  {
    q: "Do you help with domain and hosting?",
    a: "Yes, we can set up your domain, hosting and business email, or deploy to your existing setup.",
  },
  {
    q: "Can I edit the website myself later?",
    a: "Absolutely. We can add a CMS so you can update text, images and blog posts without touching code.",
  },
  {
    q: "What happens after the website goes live?",
    a: "We provide post-launch support and offer care plans for ongoing updates, fixes and new sections.",
  },
];

// Fluid type shared by every /website section heading (≈28px on phones → 48px on desktop)
export const SECTION_TITLE =
  "text-[clamp(1.75rem,3.6vw+0.9rem,3rem)] font-extrabold text-gray-950 tracking-tight leading-[1.15]";
export const SECTION_TEXT =
  "mt-3 sm:mt-3.5 text-gray-500 text-[13.5px] sm:text-sm md:text-[15px] leading-relaxed font-medium";

export const SectionTag = ({ label }) => (
  <div className="flex items-center gap-3 mb-5 sm:mb-6">
    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold tracking-widest uppercase text-gray-400">
      <span className="w-2 h-2 rounded-full bg-[#48A2FF] inline-block" />
      <span>{label}</span>
    </div>
    <div className="flex-1 h-[1px] bg-gray-200" />
  </div>
);

export const SectionHeader = ({ bold, italic, text }) => (
  <div className="mb-9 sm:mb-12 lg:mb-14 max-w-2xl">
    <h2 className={SECTION_TITLE}>
      <span>{bold} </span>
      <span className={`${playfair.className} italic font-normal text-gray-900 block sm:inline`}>
        {italic}
      </span>
    </h2>
    <p className={SECTION_TEXT}>
      {text}
    </p>
  </div>
);

const FAQItem = ({ q, a, isOpen, onToggle }) => (
  <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_6px_20px_rgba(0,0,0,0.03)] overflow-hidden">
    <button
      onClick={onToggle}
      aria-expanded={isOpen}
      className="w-full flex items-center justify-between gap-3 sm:gap-4 text-left px-4 sm:px-6 py-4 sm:py-5 cursor-pointer"
    >
      <span className="text-[14px] sm:text-[15px] font-bold text-gray-950 leading-snug">{q}</span>
      <ChevronDown
        size={18}
        className={`shrink-0 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <p className="px-4 sm:px-6 pb-4 sm:pb-5 text-[13px] sm:text-[14px] text-gray-500 font-medium leading-relaxed">
            {a}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// `portfolio` and `testimonials` are rendered, in that order, between the process and FAQ sections
const WebsiteSections = ({ portfolio = null, testimonials = null }) => {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className={`${jakarta.className} bg-[#FAFAFA] text-black`}>
      {/* Process */}
      <section className="py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <SectionTag label="Our Process" />
          <SectionHeader
            bold="From Idea To"
            italic="Launch Day"
            text="A simple, transparent process so you always know what's happening next."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {processSteps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="relative bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)]"
              >
                <span className="text-[2rem] sm:text-4xl leading-none font-extrabold bg-gradient-to-r from-[#48A2FF] to-[#93C5FD] bg-clip-text text-transparent">
                  {item.step}
                </span>
                <h3 className="mt-3 text-[16px] sm:text-lg font-extrabold text-gray-950 tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[13px] sm:text-[13.5px] text-gray-500 font-medium leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {portfolio}

      {testimonials}

      {/* FAQ */}
      <section className="py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <SectionTag label="FAQ" />
          <SectionHeader
            bold="Questions?"
            italic="We've Got Answers"
            text="Everything you need to know before starting your website with us."
          />
          <div className="space-y-2.5 sm:space-y-3">
            {faqs.map((item, index) => (
              <FAQItem
                key={item.q}
                q={item.q}
                a={item.a}
                isOpen={openFaq === index}
                onToggle={() => setOpenFaq(openFaq === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto rounded-2xl sm:rounded-3xl bg-[#0A2540] px-5 py-8 sm:px-10 sm:py-12 lg:px-14 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-12">
          <div className="max-w-xl">
            <h2 className="text-[clamp(1.6rem,2.6vw+0.9rem,2.5rem)] font-extrabold tracking-tight text-white leading-[1.15]">
              Ready For A Website{" "}
              <span className={`${playfair.className} italic font-normal text-[#9FCFFF]`}>
                That Works?
              </span>
            </h2>
            <p className="mt-2.5 sm:mt-3 text-white/65 text-[13.5px] sm:text-sm md:text-[15px] font-medium leading-relaxed">
              Book a free 15-minute call and get a plan and quote for your website.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
            <Link
              href={CALENDLY_URL}
              target="_blank"
              className="group inline-flex items-center justify-center gap-1.5 h-11 px-6 rounded-lg bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] hover:brightness-105 text-[#0A2540] text-sm font-bold whitespace-nowrap transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2540]"
            >
              Book a Free Call
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={WHATSAPP_URL}
              target="_blank"
              className="inline-flex items-center justify-center h-11 px-6 rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/5 text-white text-sm font-semibold whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              WhatsApp us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WebsiteSections;
