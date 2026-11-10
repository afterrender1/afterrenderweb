import React from "react";
import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
import { Plus_Jakarta_Sans, Playfair_Display } from "@/app/lib/fonts";
import EventHeroBackdrop from "./EventHeroBackdrop";
import AiAvatarsVideo from "./AiAvatarsVideo";

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

// Hero video: paste any YouTube link or embed URL here
// (e.g. https://www.youtube.com/embed/VIDEO_ID or https://youtu.be/VIDEO_ID)
const HERO_VIDEO_URL = "https://www.youtube.com/embed/aqz-KE-bpKQ";

const trustPoints = ["Looks & sounds like you", "Any language, any niche", "No camera needed"];

// Same look as the pricing hero, but animated with pure CSS (no animation library),
// so it shows instantly and stays light on low-end phones.
// `plansId` is the section "See Plans" scrolls to.
const AiAvatarsHero = ({ backgroundUrl = "", plansId = "plans" }) => {
  return (
    <section
      className={`${jakarta.className} relative ${backgroundUrl ? "isolate" : ""} bg-[#FAFAFA] text-black pt-32 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col items-center`}
    >
      <EventHeroBackdrop url={backgroundUrl} />

      {/* Background Soft Mesh Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-b from-[#eaf4ff]/50 via-[#f5f8ff]/25 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Floating Badges */}
      <div className="w-full max-w-3xl relative">
        <div className="absolute -top-7 left-1 sm:left-4 md:left-8 z-20 hidden sm:block animate-hero-fade-up">
          <span className="flex items-center gap-1 -rotate-8 hover:-rotate-4 hover:scale-105 transition-transform duration-300 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] text-white text-[11px] md:text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-[0_8px_20px_rgba(59,130,246,0.3)] cursor-default select-none">
            @AI Avatar
          </span>
        </div>
        <div className="absolute -top-7 right-1 sm:right-4 md:right-8 z-20 hidden sm:block animate-hero-fade-up">
          <span className="flex items-center gap-1 rotate-10 hover:rotate-6 hover:scale-105 transition-transform duration-300 bg-gradient-to-r from-[#c084fc] to-[#a855f7] text-white text-[11px] md:text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-[0_8px_20px_rgba(168,85,247,0.3)] cursor-default select-none">
            @Digital Twin
          </span>
        </div>
      </div>

      {/* Hero Title & Subtitle */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <h1 className="animate-hero-fade-up text-3xl sm:text-4xl md:text-[42px] tracking-tight text-[#111111] leading-[1.18]">
          <span className={`${playfair.className} italic font-normal block sm:inline-block`}>
            Your Face, Your Voice.
          </span>{" "}
          <span className="font-extrabold block sm:inline-block">Zero Filming.</span>
        </h1>

        <p className="animate-hero-fade-up [animation-delay:0.08s] mt-3.5 text-[#555555] text-xs sm:text-sm md:text-[14.5px] leading-relaxed max-w-xl mx-auto font-medium">
          We create a lifelike AI avatar of you that presents, teaches and sells on camera,
          so you can post more videos every week without ever setting up a camera.
        </p>

        {/* Action Buttons */}
        <div className="animate-hero-fade-up [animation-delay:0.15s] mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xs sm:max-w-none mx-auto">
          {/* Plain anchor: html has scroll-behavior: smooth, so this scrolls down to the plan */}
          <a
            href={`#${plansId}`}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] text-[#0A2540] font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-[0_6px_16px_rgba(72,162,255,0.3)] hover:shadow-[0_10px_20px_rgba(72,162,255,0.4)] hover:brightness-105 hover:scale-105 active:scale-95 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/40 focus-visible:ring-offset-2"
          >
            See Plans
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <Link
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full border border-gray-200 shadow-2xs hover:border-gray-300 hover:scale-105 active:scale-95 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/40 focus-visible:ring-offset-2"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Book a Free Call
          </Link>
        </div>

        {/* Trust Points */}
        <ul className="animate-hero-fade-up [animation-delay:0.22s] mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-7 gap-y-2 text-xs sm:text-[13px] font-medium text-gray-700">
          {trustPoints.map((point) => (
            <li key={point} className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-900">✓</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Hero Video */}
      <div className="animate-hero-fade-up [animation-delay:0.3s] relative z-10 w-full max-w-4xl mx-auto mt-10 sm:mt-14">
        <AiAvatarsVideo url={HERO_VIDEO_URL} title="AI Avatars by AfterRender" />
      </div>
    </section>
  );
};

export default AiAvatarsHero;
