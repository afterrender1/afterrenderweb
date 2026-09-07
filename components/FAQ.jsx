"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Urbanist, Playfair_Display } from "next/font/google";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div
      className="border border-gray-800/80 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:border-gray-700 bg-black/40 backdrop-blur-md"
      style={{ fontFamily: "Poppins" }}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left transition-all duration-300 cursor-pointer gap-3"
      >
        <span className="text-white text-xs sm:text-sm md:text-base font-semibold leading-snug">
          {question}
        </span>
        <div className="shrink-0">
          <div
            className={`transform transition-transform duration-300 ${isOpen ? "rotate-45" : ""
              }`}
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="p-3.5 sm:p-4 pt-0 bg-transparent">
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

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
      answer: "We don't just create content—we build growth systems. With AI-powered workflows, proven frameworks, and a team that understands what actually drives results, we're operating 1-2 years ahead of traditional agencies. Plus, we only work with clients we know we can deliver massive value for.",
    },

  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="relative bg-black py-10 sm:py-14 px-4 overflow-hidden">
      <Image
        src="/images/herobg.png"
        alt="background glow"
        width={700}
        height={700}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-100 pointer-events-none object-cover"
      />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-6 sm:mb-8">
          <p className="text-white text-xs font-medium tracking-wider mb-2 sm:mb-3 rounded-full px-3 py-1 inline-block border border-gray-600">
            Frequently Asked Questions
          </p>
          <h2
            className={`${urbanist.className} text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1.5 sm:mb-2 tracking-tight`}
          >
            Everything you need to{" "}
            <span
              className={`${playfair.className} italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#48A2FF] via-[#7EC0FF] to-[#C9E4FF]`}
            >
              know.
            </span>
          </h2>
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
