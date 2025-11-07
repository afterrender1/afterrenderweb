"use client";
import React, { useState } from 'react';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border border-gray-800 rounded-3xl overflow-hidden transition-all duration-300 hover:border-gray-700">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 md:p-8 text-left  hover:bg-black/60 transition-all duration-300"
      >
        <span className="text-white text-lg md:text-xl font-normal pr-4">
          {question}
        </span>
        <div className="shrink-0">
          <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-6 md:p-8 pt-0 bg-black/40">
          <p className="text-gray-400 text-base leading-relaxed">
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
      question: "What is your pricing structure?",
      answer: "Our pricing is customized based on your specific needs and goals. We offer flexible packages for both one-time projects and ongoing retainers. Schedule a call with us to discuss a plan that works for your business."
    },
    {
      question: "What differentiates you from other agencies?",
      answer: "We don't just create content—we build growth systems. With AI-powered workflows, proven frameworks, and a team that understands what actually drives results, we're operating 1-2 years ahead of traditional agencies. Plus, we only work with clients we know we can deliver massive value for."
    },
    {
      question: "What happens after the call?",
      answer: "After our discovery call, if we're a good fit, we'll send over a detailed proposal outlining the strategy, timeline, and investment. Once approved, we onboard you within 48 hours and start executing immediately. You'll have direct access to your dedicated team from day one."
    },
    {
      question: "What do I have to do from my side?",
      answer: "Minimal work from your end. You provide the brand voice, approve strategies, and show up for recording sessions (if applicable). We handle everything else—scripting, editing, posting, optimization, and reporting. It's designed to be completely done-for-you."
    },
    {
      question: "How do you track sales from YT videos?",
      answer: "We implement advanced tracking systems including UTM parameters, custom landing pages, and integration with your CRM. You'll get detailed analytics showing exactly which videos drive traffic, leads, and sales. Monthly reports break down ROI by content piece."
    },
    {
      question: "How do you guys have an LTV of 2+ years with clients?",
      answer: "Simple—we deliver results consistently. Our clients stick with us because they see real ROI month after month. We focus on building long-term growth systems, not quick wins. Plus, our team becomes an extension of your business, deeply understanding your brand and audience over time."
    },
    {
      question: "Do you guys have a physical office or are you fully remote?",
      answer: "We're a fully remote team with talent across multiple time zones. This allows us to work around the clock and gives you access to the best creators, editors, and strategists worldwide—not just limited to one geographic location. Communication happens seamlessly through Slack, Zoom, and project management tools."
    }
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-black py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-cyan-400 text-sm uppercase tracking-wider mb-4">
            FAQ
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-lg">
            Everything you need to know about working with us
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
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