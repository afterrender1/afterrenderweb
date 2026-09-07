"use client";
import Image from "next/image";
import React from "react";
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

const ProcessCard = ({ number, img, title, description }) => {
  return (
    <div className="relative group h-full">
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="px-5 rounded-full bg-white/10 backdrop-blur-xl border border-gray-700 flex items-center justify-center">
          <span className="text-white font-semibold text-lg">{number}</span>
        </div>
      </div>

      {/* Card */}
      <div className="relative bg-white/5 rounded-3xl p-5 pt-12 border border-gray-800/50 h-full overflow-hidden flex flex-col justify-between">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-all duration-300"
          style={{ backgroundImage: "url('/images/herobg.png')" }}
        />
        <div className="absolute inset-0 bg-linear-to-br from-black/60 via-black/40 to-transparent z-0"></div>

        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="pt-4 flex justify-center">
            <Image
              src={img}
              alt={`Step ${number} Icon`}
              height={60}
              width={160}
              className="object-contain"
            />
          </div>

         <div>
           <h3 className="text-white text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">
            {title}
          </h3>

          <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed">
            {description}
          </p>
         </div>
        </div>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: "Brand Audit",
      description:
        "We get to know you—your voice, your vision, and what kind of content will actually move the needle.",
      img: "/images/aud.png",
    },
    {
      number: 2,
      title: "Content Calendar",
      description:
        "We build a tailored content roadmap + fill your calendar with viral-ready ideas and scripts that sound like you.",
      img: "/images/cont.png",
    },
    {
      number: 3,
      title: "Full Production",
      description:
        "You record—we turn it into scroll-stopping videos, publish across all platforms, and fuel it with SEO.",
      img: "/images/pro.png",
    },
  ];

  return (
    <div className="relative min-h-screen bg-black py-20 px-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center  opacity-30"
        style={{ backgroundImage: "url('/images/herobg.png')" }}
      ></div>
      <div className="absolute inset-0 bg-linear-to-b from-black via-black/90 to-black z-0"></div>
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-14 sm:mb-20">
          <p className="text-white text-xs sm:text-sm tracking-wider mb-3 sm:mb-4 rounded-full px-3 py-1 inline-block border border-gray-600">
            How it works
          </p>
          <h2
            className={`${urbanist.className} text-2xl md:text-[2.8rem] font-bold text-white mb-4 tracking-tight`}
          >
            Getting started is{" "}
            <span
              className={`${playfair.className} italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#48A2FF] via-[#7EC0FF] to-[#C9E4FF]`}
            >
              simple
            </span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg">
            and there's a good reason why
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <ProcessCard
              key={index}
              number={step.number}
              img={step.img}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
