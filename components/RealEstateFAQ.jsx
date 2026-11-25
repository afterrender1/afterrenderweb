"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus_Jakarta_Sans, Playfair_Display } from "@/app/lib/fonts";
import { ChevronDown, ArrowRight } from "lucide-react";
import {
  REAL_ESTATE_FAQS,
  REAL_ESTATE_INDUSTRIES,
  REAL_ESTATE_INDUSTRIES_INTRO,
  REAL_ESTATE_INDUSTRIES_OUTRO,
} from "@/app/lib/faqData";

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

// Shared with the lead form (it imports `industries` from here)
export const industries = REAL_ESTATE_INDUSTRIES;

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs hover:border-[#48A2FF]/40 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      <button
        type="button"
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer gap-4"
      >
        <span className="text-gray-900 font-semibold text-sm sm:text-[15px] leading-snug">
          {question}
        </span>
        <div className="shrink-0">
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
              isOpen ? "rotate-180 text-[#48A2FF]" : ""
            }`}
          />
        </div>
      </button>

      {/* The answer is always in the HTML (crawlers and FAQ structured data need it); closed it
          collapses to zero height with a grid-rows transition instead of being removed */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-[250ms] ease-in-out motion-reduce:transition-none ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 sm:px-6 pb-5 text-gray-600 text-xs sm:text-[13.5px] leading-relaxed border-t border-gray-100/80 pt-3">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
};

// "What kinds of businesses do you work with?": same sentences as the shared data, with the industry chips
const IndustriesAnswer = () => (
  <div>
    <p className="mb-3.5">{REAL_ESTATE_INDUSTRIES_INTRO}</p>
    <div className="flex flex-wrap gap-2 mb-3.5">
      {REAL_ESTATE_INDUSTRIES.map((industry) => (
        <span
          key={industry}
          className="bg-[#EAF4FF] border border-[#48A2FF]/25 text-[#0A0A0A] text-[10.5px] sm:text-[11.5px] font-semibold px-2.5 py-1 rounded-full"
        >
          {industry}
        </span>
      ))}
    </div>
    <p>{REAL_ESTATE_INDUSTRIES_OUTRO}</p>
  </div>
);

const RealEstateFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = REAL_ESTATE_FAQS;

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className={`${jakarta.className} relative bg-[#FAFAFA] text-black py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Top Tag & Divider Line */}
        <div className="flex items-center gap-3 mb-10">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold tracking-widest uppercase text-gray-400">
            <span className="w-2 h-2 rounded-full bg-[#CEFF00] inline-block" />
            <span>FAQ</span>
          </div>
          <div className="flex-1 h-[1px] bg-gray-200" />
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Heading & CTA */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full lg:sticky lg:top-32">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15] mb-4">
                <span>Common </span>
                <span
                  className={`${playfair.className} italic font-normal text-gray-900`}
                >
                  questions.
                </span>
              </h2>
            </div>

            {/* Still have questions CTA Box */}
            <div className="mt-8 sm:mt-14 pt-6 border-t border-gray-200/60 lg:border-t-0">
              <h4 className="text-base font-bold text-gray-950 mb-1.5">
                Still have questions?
              </h4>
              <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed max-w-xs mb-4">
                Didn&apos;t find what you were looking for? Our team is just
                a message away.
              </p>
              <Link
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300/90 rounded-full px-5 py-2 text-xs font-semibold shadow-2xs hover:shadow-xs transition-all duration-200 group"
              >
                <span>Book a Call</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Accordion Questions */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="space-y-3.5">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.industries ? <IndustriesAnswer /> : faq.answer}
                  isOpen={openIndex === index}
                  onClick={() => handleToggle(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealEstateFAQ;
