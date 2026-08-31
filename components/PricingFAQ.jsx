"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
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

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs hover:border-gray-300 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      <button
        type="button"
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer gap-4"
      >
        <span className="text-gray-900 font-semibold text-sm sm:text-[15px] leading-snug">
          {question}
        </span>
        <div className="shrink-0">
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
              isOpen ? "rotate-180 text-gray-900" : ""
            }`}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-5 sm:px-6 pb-5 text-gray-600 text-xs sm:text-[13.5px] leading-relaxed border-t border-gray-100/80 pt-3">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PricingFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const faqs = [
    {
      question: "Did you help scale a social media presence to 100K+?",
      answer:
        "Yes, we have. We successfully helped two of our clients TMG and Regenerative Farmers of America, grow their social media accounts to over 100,000 followers.",
    },
    {
      question: "Do you work with coaches and business owners?",
      answer:
        "Yes, we do. We mainly work with coaches and business owners, and we help hundreds of them with their daily tasks. Our services are designed to support their business growth and make their work easier.",
    },
    {
      question: "Can you create a SaaS video for me?",
      answer:
        "Yes, we can. We just need your brand guidelines and a short meeting to understand your product and goals. After that, we will handle everything from idea to final video.",
    },
    {
      question: "What do I have to do from my side?",
      answer:
        "Minimal work from your end. You provide the brand voice, approve strategies, and show up for recording sessions (if applicable). We handle everything else—scripting, editing, posting, optimization, and reporting. It's designed to be completely done-for-you.",
    },
    {
      question: "How do you guys have an LTV of 2+ years with clients?",
      answer:
        "Simple—we deliver results consistently. Our clients stick with us because they see real ROI month after month. We focus on building long-term growth systems, not quick wins. Plus, our team becomes an extension of your business, deeply understanding your brand and audience over time.",
    },
    {
      question: "What is your pricing structure?",
      answer:
        "Our pricing is customized based on your specific needs and goals. We offer flexible packages for both one-time projects and ongoing retainers. Schedule a call with us to discuss a plan that works for your business.",
    },
    {
      question: "What differentiates you from other agencies?",
      answer:
        "We don't just create content—we build growth systems. With AI-powered workflows, proven frameworks, and a team that understands what actually drives results, we're operating 1-2 years ahead of traditional agencies. Plus, we only work with clients we know we can deliver massive value for.",
    },
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const displayedFaqs = showAll ? faqs : faqs.slice(0, 5);

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
                <span>Answers to the </span>
                <span className="block">frequently asked </span>
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
                Didn’t find what you were looking for? Our team is just a message
                away.
              </p>
              <Link
                href="https://calendly.com/afterrenderagency/new-meeting"
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
              {displayedFaqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  onClick={() => handleToggle(index)}
                />
              ))}
            </div>

            {/* Show more button */}
            {faqs.length > 5 && (
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowAll(!showAll)}
                  className="text-xs font-semibold text-gray-600 hover:text-black transition-colors cursor-pointer"
                >
                  {showAll ? "Show less" : "Show more"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingFAQ;
