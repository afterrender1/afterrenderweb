"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { ArrowUpRight } from "lucide-react";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "600", "700"],
});

const testimonials = [
  {
    id: 1,
    name: "DEBORAH",
    company: "Medical Creator",
    image: "/images/clients/deborah.png",
    quotePrefix: "AfterRender really are the ",
    highlight: "ultimate content team",
    quoteSuffix:
      ". The videos came out clean, educational, and engaging — not easy to pull off.",
    metrics: [
      { value: "700+hrs", label: "Editing time saved" },
      { value: "$14k+", label: "Cost Saving" },
      { value: "120+", label: "Videos Delivered" },
    ],
  },
  {
    id: 2,
    name: "TRACTION",
    company: "Digital Entrepreneur",
    image: "/images/clients/traction.png",
    quotePrefix: "Been great working with them, ",
    highlight: "always super fast",
    quoteSuffix: " and smooth. My content finally looks and feels like my brand.",
    metrics: [
      { value: "1.9k+hrs", label: "Editing time saved" },
      { value: "$35k+", label: "Cost Saving" },
      { value: "150+", label: "Videos Delivered" },
    ],
  },
  {
    id: 3,
    name: "FINEPOINT",
    company: "SaaS Company",
    image: "/images/clients/finep.png",
    quotePrefix: "AfterRender built a full creative system for us. ",
    highlight: "The quality & communication",
    quoteSuffix: " is top tier, with better engagement and lower ad costs.",
    metrics: [
      { value: "3k+hrs", label: "Editing time saved" },
      { value: "$50k+", label: "Cost Saving" },
      { value: "200+", label: "Videos Delivered" },
    ],
  },
  {
    id: 4,
    name: "CRYPTO SIMBA",
    company: "Crypto Trader",
    image: "/images/clients/crypto.png",
    quotePrefix: "The turnaround time is unbelievable. Every video hits the right tone with ",
    highlight: "clean edits and high watch time",
    quoteSuffix: " across our channels.",
    metrics: [
      { value: "1.2k+hrs", label: "Editing time saved" },
      { value: "$22k+", label: "Cost Saving" },
      { value: "180+", label: "Videos Delivered" },
    ],
  },
  {
    id: 5,
    name: "AUDREY",
    company: "Fitness Coach",
    image: "/images/clients/metabolic.png",
    quotePrefix: "Loved how simple the process was. ",
    highlight: "The best subscription decision",
    quoteSuffix: " — I just sent my clips and the final videos came back polished.",
    metrics: [
      { value: "2.4k+hrs", label: "Editing time saved" },
      { value: "$40k+", label: "Cost Saving" },
      { value: "250+", label: "Videos Delivered" },
    ],
  },
];

const PricingTestimonials = () => {
  // Duplicate for seamless infinite loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section
      className={`${jakarta.className} relative bg-[#FAFAFA] text-black py-16 sm:py-24 overflow-hidden`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Tag & Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold tracking-widest uppercase text-gray-400">
            <span className="w-2 h-2 rounded-full bg-[#CEFF00] inline-block" />
            <span>Testimonial</span>
          </div>
          <div className="flex-1 h-[1px] bg-gray-200" />
        </div>

        {/* Section Header */}
        <div className="mb-12 sm:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
              <span>Success Stories </span>
              <span
                className={`${playfair.className} italic font-normal text-gray-900 block sm:inline`}
              >
                from the Creative Frontline.
              </span>
            </h2>
            <p className="mt-3.5 text-gray-500 text-xs sm:text-sm md:text-[14.5px] leading-relaxed font-medium">
              From startups to global teams, our creative process fuels success
              stories built on strategy, design, and seamless execution.
            </p>
          </div>

          {/* Trustpilot Review Badge & Link */}
          <div className="shrink-0">
            <Link
              href="https://www.trustpilot.com/review/afterrender.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3  rounded-full px-4 py-2 text-xs font-semibold text-gray-800 hover:shadow-xs transition-all duration-200 group"
            >
              <div className="relative w-16 h-16 shrink-0">
                <Image
                  src="/images/tp.png"
                  alt="Trustpilot"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-gray-700 group-hover:text-black transition-colors">
                See more reviews on Trustpilot
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Infinite Horizontal Scrolling Slider (moving slowly to the left) */}
      <div className="relative w-full overflow-hidden">
        {/* Soft edge blur masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-r from-[#FAFAFA] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-l from-[#FAFAFA] to-transparent z-10" />

        <div className="flex gap-6 sm:gap-8 w-max animate-testimonial-scroll hover:[animation-play-state:paused] px-4 sm:px-8">
          {duplicatedTestimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-[26px] sm:rounded-[30px] p-5 sm:p-7 lg:p-8 border border-gray-200/90 w-[320px] sm:w-[440px] lg:w-[490px] xl:w-[520px] shrink-0 flex flex-col justify-between transition-all duration-300 select-none min-h-[220px] sm:min-h-[250px]"
            >
              {/* Top: Avatar + Quote */}
              <div>
                <div className="flex items-start gap-4 sm:gap-5 mb-5">
                  {/* Left Avatar */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl sm:rounded-3xl overflow-hidden shrink-0 ">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Right Quote */}
                  <div className="flex-1">
                    <p className="text-xs sm:text-[13.5px] lg:text-[14.5px] font-medium text-gray-800 leading-relaxed">
                      <span>{item.quotePrefix}</span>
                      <span className="bg-[#E4FF4D]/90 text-black font-semibold px-1.5 py-0.5 rounded-sm inline-block shadow-2xs">
                        {item.highlight}
                      </span>
                      <span>{item.quoteSuffix}</span>
                    </p>
                    <button
                      type="button"
                      className="text-[11px] sm:text-xs font-semibold text-gray-500 hover:text-black underline mt-2 inline-block cursor-pointer"
                    >
                      more
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom: Author Info & Metrics Grid */}
              <div className="pt-4 sm:pt-5 border-t border-gray-100 flex items-center justify-between gap-3 sm:gap-4">
                {/* Author */}
                <div className="min-w-[90px] sm:min-w-[120px] shrink-0">
                  <h4 className="text-xs sm:text-[13.5px] lg:text-[15px] font-extrabold text-gray-950 uppercase tracking-tight truncate">
                    {item.name}
                  </h4>
                  <p className="text-[10.5px] sm:text-[11.5px] lg:text-[12.5px] text-gray-500 font-medium truncate">
                    {item.company}
                  </p>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-2 sm:gap-4 pl-2 sm:pl-4 border-l border-gray-100">
                  {item.metrics.map((metric, mIdx) => (
                    <div
                      key={mIdx}
                      className={`text-center ${
                        mIdx !== 0 ? "pl-2 sm:pl-4 border-l border-gray-100" : ""
                      }`}
                    >
                      <span className="block text-xs sm:text-[13.5px] lg:text-[15px] font-extrabold text-gray-950 tracking-tight">
                        {metric.value}
                      </span>
                      <span className="block text-[9px] sm:text-[10px] lg:text-[11px] text-gray-400 font-medium leading-tight">
                        {metric.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingTestimonials;
