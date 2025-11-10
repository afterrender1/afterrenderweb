"use client";
import Image from "next/image";
import React, { useState } from "react";

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div
      className="border border-gray-700 cursor-pointer rounded-3xl overflow-hidden transition-all duration-300 hover:border-gray-600 bg-black/40 backdrop-blur-md"
      style={{ fontFamily: "Poppins" }}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 md:p-5 text-left transition-all duration-300 cursor-pointer"
      >
        <span className="text-white text-lg md:text-base font-semibold">
          {question}
        </span>
        <div className="shrink-0">
          <div
            className={`transform transition-transform duration-300 ${
              isOpen ? "rotate-45" : ""
            }`}
          >
            <svg
              className="w-6 h-6 text-white"
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
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-6 md:p-5 pt-0 bg-transparent ">
          <p className="text-gray-300 text-base leading-relaxed">
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
      question: "How do you track sales from YT videos?",
      answer:
        "We implement advanced tracking systems including UTM parameters, custom landing pages, and integration with your CRM. You'll get detailed analytics showing exactly which videos drive traffic, leads, and sales. Monthly reports break down ROI by content piece.",
    },
    {
      question: "How do you guys have an LTV of 2+ years with clients?",
      answer:
        "Simple—we deliver results consistently. Our clients stick with us because they see real ROI month after month. We focus on building long-term growth systems, not quick wins. Plus, our team becomes an extension of your business, deeply understanding your brand and audience over time.",
    },
    {
      question: "Do you guys have a physical office or are you fully remote?",
      answer:
        "We're a fully remote team with talent across multiple time zones. This allows us to work around the clock and gives you access to the best creators, editors, and strategists worldwide—not just limited to one geographic location. Communication happens seamlessly through Slack, Zoom, and project management tools.",
    },
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-black py-20 px-4 overflow-hidden">
      {/* Background Gradient Glow */}
<Image
  src="/images/herobg.png"
  alt="background glow"
  width={700}
  height={700}
  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-100 pointer-events-none object-cover"
/>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
     <div className="text-center mb-20">
          <p className="text-white text-sm tracking-wider mb-4 rounded-full px-3 py-1 inline-block border border-gray-600">
Frequently Asked Questions

          </p>
          <h2
            className="text-2xl md:text-[2.8rem] font-bold text-white mb-4"
            style={{ fontFamily: "poppins" }}
          >
          Everything you <span className="text-transparent bg-clip-text tracking-wider bg-linear-to-r from-[#48A2FF] to-[#C9E4FF]" style={{fontFamily : "michroma"}}>
            need
          </span> to know.

          </h2>
        
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 ">
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
