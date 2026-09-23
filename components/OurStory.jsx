"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus_Jakarta_Sans, Playfair_Display, Caveat } from "next/font/google";
import Image from "next/image";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
});


export default function OurStory({
  founderImage = "/images/ArhamKhan.webp",
  signatureImage = "/images/signature.svg",
  founderName = "Divyang",
}) {
  return (
    <section
      className={`${jakarta.className} relative bg-[#FAFAFA] text-black py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header Line: • OUR STORY */}
        <div className="flex items-center gap-3 pb-8 sm:pb-12 border-b border-gray-200/80 mb-10 sm:mb-14">
          <span className="w-2.5 h-2.5 rounded-full bg-[#48A2FF] inline-block shadow-xs shrink-0" />
          <span className="text-xs sm:text-[13px] font-bold tracking-[0.2em] uppercase text-gray-500">
            OUR STORY
          </span>
        </div>

        {/* 2-Column Grid: Left Content & Right Portrait Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column (Quote & Story) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            {/* Bold Headline Quote */}
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl sm:text-3xl md:text-[38px] lg:text-[42px] font-extrabold tracking-tight text-[#111111] leading-[1.18]"
            >
              &ldquo;Turning a Passion for{" "}
              <span
                className={`${playfair.className} italic font-normal text-[#1a1a1a]`}
              >
                Creativity
              </span>{" "}
              into Endless Opportunities for{" "}
              <span
                className={`${playfair.className} italic font-normal text-[#1a1a1a]`}
              >
                Creative Minds.
              </span>
              &rdquo;
            </motion.h2>

            {/* Paragraph 1 */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 sm:mt-8 text-xs sm:text-sm md:text-[14.5px] text-[#444444] leading-relaxed max-w-xl font-normal"
            >
              What started as a small idea helping brands stand out with
              scroll-stopping edits has grown into Afterrender: a creative
              partner trusted worldwide shaping stories, designs, and
              experiences that connect.
            </motion.p>
          </div>

          {/* Right Column (Lime Green Backdrop + Overlapping Founder Cutout) */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="relative w-full max-w-[420px] sm:max-w-[460px] pt-14 sm:pt-16"
            >
              {/* Handwritten Signature overlapping top-left */}
              <div className="absolute -top-3 sm:-top-4 left-0 sm:-left-3 z-30 flex items-center pointer-events-none select-none">
                {signatureImage ? (
                  <div className="relative w-28 sm:w-36 h-14 sm:h-16">
                    <Image
                      src={signatureImage}
                      alt={`${founderName} Signature`}
                      fill
                      className="object-contain -rotate-6 filter drop-shadow-sm"
                    />
                  </div>
                ) : (
                  <span
                    className={`${caveat.className} text-3xl sm:text-4xl font-bold text-[#111111] -rotate-6`}
                  >
                    {founderName}
                  </span>
                )}
              </div>

              {/* The Box (Matching Book a Call Gradient) */}
              <div className="relative w-full h-[220px] sm:h-[260px] bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] rounded-2xl sm:rounded-3xl shadow-[0_15px_35px_rgba(72,162,255,0.3)] flex items-end justify-center overflow-visible">
                {/* Founder Cutout Image (Pops up above the box) */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[88%] sm:w-[92%] h-[145%] sm:h-[155%] pointer-events-none z-20">
                  <Image
                    src={founderImage}
                    alt={founderName}
                    fill
                    priority
                    className="object-contain object-bottom drop-shadow-2xl"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Supporting Statement */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 sm:mt-14 max-w-2xl"
        >
          <p className="text-xs sm:text-sm md:text-[14.5px] text-[#444444] leading-relaxed font-normal">
            We’ve always believed great storytelling isn’t just about visual
            it’s about creating impact. From our very first project to the
            thousands of edits we deliver today.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
