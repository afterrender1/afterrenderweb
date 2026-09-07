"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, X } from "lucide-react";
import { Urbanist, Playfair_Display } from "next/font/google";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "600", "700"],
  display: "swap",
});

// =========================================================================
// SERVICES DATA - YouTube Video URLs, Posters, and Deliverables
// =========================================================================
export const servicesList = [
  {
    id: "01",
    number: "0 1",
    title: "Client Long-Form Video Production",
    description:
      "A complete long-form video crafted by AfterRender for our client. Engineered with dynamic pacing, custom sound design, and retention-focused storytelling to maximize viewer watch time and conversions.",
    tags: ["Long-Form Video", "Client Work by AfterRender", "High Retention"],
    link: "/our-work",
    videoUrl: "https://www.youtube.com/watch?v=qwMtjPHk3aU?si=PgXtx1kjEVJvv0aR",
    posterUrl: "/images/longformvideotn1.jpg",
    isMediaLeft: true,
  },
  {
    id: "02",
    number: "0 2",
    title: "Original Short-Form Showcase",
    description:
      "An in-house short-form creation by AfterRender. Packed with scroll-stopping hooks, high-energy pacing, viral sound design, and animated captions built to dominate YouTube Shorts and Instagram Reels.",
    tags: ["Short-Form Video", "AfterRender Original", "Viral Hooks & Reels"],
    link: "/our-work",
    videoUrl: "https://youtube.com/shorts/7Y1Hl1i1PZI?si=H54lIg-ptyYEJly3",
    posterUrl: "/images/sfv.jpg",
    isMediaLeft: false,
  },
  {
    id: "03",
    number: "0 3",
    title: "SaaS Product Demo & Explainer",
    description:
      "A high-converting SaaS showcase video crafted by AfterRender. Engineered with sleek UI animation, crystal-clear value framing, and smooth pacing to turn complex software into compelling, high-converting demos.",
    tags: ["SaaS Product Demo", "UI Screen Animation", "High Conversion"],
    link: "/our-work",
    videoUrl: "https://www.youtube.com/watch?v=16pk6M08U-s?si=8FcIArJ3RqtQKFq8",
    posterUrl: "/images/saas.jpg",
    isMediaLeft: true,
  },
];

// Helper function to extract working embed URL from any YouTube link format (Standard, Short, or Embed)
function getYouTubeEmbedUrl(url) {
  if (!url) return "";
  if (url.includes("/embed/")) {
    const cleanUrl = url.split("?")[0];
    return `${cleanUrl}?autoplay=1&rel=0`;
  }
  // Match standard 11-character video ID from watch?v=, youtu.be/, or /shorts/
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
  }
  const genericMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^#&?]+)/
  );
  const videoId = genericMatch && genericMatch[1] ? genericMatch[1] : url;
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
}

export default function Services() {
  const [playingVideoId, setPlayingVideoId] = useState(null);

  return (
    <section
      id="services"
      className="relative bg-cover bg-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6"
    >
      <div className="absolute inset-0"></div>
      <div
        className="relative max-w-5xl mx-auto z-10 bg-no-repeat bg-contain bg-center"
        style={{
          backgroundImage: "url('/images/casebg.png')",
        }}
      >
        {/* ==========================================
            SECTION HEADER
            ========================================== */}
        <div className="mb-8 sm:mb-10">
          {/* Subtitle Tag */}
          <p className="text-gray-400 text-xs sm:text-[13px] font-semibold tracking-[0.25em] uppercase mb-1.5">
            SERVICES
          </p>

          {/* Main Title: What We Do */}
          <h2
            className={`${urbanist.className} text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight`}
          >
            <span>What </span>
            <span
              className={`${playfair.className} italic font-normal text-[#F4EBD9]`}
            >
              We Do
            </span>
          </h2>
        </div>

        {/* ==========================================
            SERVICES CARDS LIST (COMPACT, SLEEK & CLIENT CONVERTING)
            ========================================== */}
        <div className="space-y-4 sm:space-y-5">
          {servicesList.map((item) => {
            const isPlaying = playingVideoId === item.id;
            const embedSrc = getYouTubeEmbedUrl(item.videoUrl);

            return (
              <div
                key={item.id}
                className="group relative bg-[#0C1017]/95 backdrop-blur-xl border border-white/[0.08] hover:border-[#48A2FF]/35 rounded-2xl sm:rounded-[22px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.55)] hover:shadow-[0_20px_50px_rgba(72,162,255,0.12)] transition-all duration-300"
              >
                {/* Subtle top specular accent highlight */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none group-hover:via-[#48A2FF]/40 transition-colors duration-500" />

                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                  {/* Media / Video Column (Zero Padding: Flushed to edges) */}
                  <div
                    className={`lg:col-span-6 w-full relative p-0 overflow-hidden ${
                      item.isMediaLeft ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <div className="relative w-full h-full min-h-[200px] sm:min-h-[240px] lg:min-h-[270px] bg-black/90 group/media">
                      {isPlaying ? (
                        <div className="relative w-full h-full min-h-[200px] sm:min-h-[240px] lg:min-h-[270px]">
                          <iframe
                            src={embedSrc}
                            title={item.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full absolute inset-0 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setPlayingVideoId(null)}
                            className="absolute top-2.5 right-2.5 z-30 p-1.5 rounded-full bg-black/80 hover:bg-black text-white hover:text-[#48A2FF] transition-colors cursor-pointer border border-white/20"
                            aria-label="Close video"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="relative w-full h-full min-h-[200px] sm:min-h-[240px] lg:min-h-[270px] cursor-pointer"
                          onClick={() => setPlayingVideoId(item.id)}
                        >
                          {/* Thumbnail / Poster */}
                          <img
                            src={item.posterUrl}
                            alt={item.title}
                            loading="lazy"
                            className="w-full h-full absolute inset-0 object-cover transition-transform duration-700 ease-out group-hover/media:scale-105"
                          />

                          {/* Ambient vignette */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent group-hover/media:from-black/40 transition-colors duration-300" />

                          {/* Center Play Button with glow */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative flex items-center justify-center">
                              <div className="absolute inset-0 rounded-full bg-[#48A2FF]/30 blur-md opacity-0 group-hover/media:opacity-100 transition-opacity duration-300" />
                              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/65 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-2xl group-hover/media:scale-110 group-hover/media:bg-[#48A2FF] group-hover/media:border-[#48A2FF] transition-all duration-300">
                                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white ml-0.5" />
                              </div>
                            </div>
                          </div>

                          {/* Watch Preview Badge */}
                          <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 z-10 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10.5px] sm:text-[11px] text-gray-300 font-medium flex items-center gap-1.5 pointer-events-none group-hover/media:border-[#48A2FF]/40 group-hover/media:text-white transition-colors duration-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#48A2FF] animate-pulse" />
                            <span>Watch Preview</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content Column (Sleek, Balanced Padding) */}
                  <div
                    className={`lg:col-span-6 flex flex-col justify-center p-5 sm:p-6 lg:p-7 xl:p-8 ${
                      item.isMediaLeft ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    {/* Step / Number */}
                    <span className="text-[11px] sm:text-xs font-mono tracking-[0.3em] text-gray-400 font-bold mb-1.5 sm:mb-2 block">
                      {item.number || item.id}
                    </span>

                    {/* Title */}
                    <h3
                      className={`${urbanist.className} text-lg sm:text-xl lg:text-[22px] font-bold text-white tracking-tight mb-2 sm:mb-2.5 leading-snug group-hover:text-white transition-colors`}
                    >
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-300/80 text-xs sm:text-[13px] sm:leading-relaxed mb-3.5 sm:mb-4 max-w-lg font-normal">
                      {item.description}
                    </p>

                    {/* Deliverable / Outcome Badges for Prospective Clients */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4 sm:mb-5">
                        {item.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center text-[10.5px] sm:text-[11px] font-medium text-gray-300/90 bg-white/[0.04] border border-white/[0.08] px-2.5 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Explore Link */}
                    <div>
                      <Link
                        href={item.link || "/our-work"}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-[12.5px] font-bold tracking-[0.18em] uppercase text-gray-300 hover:text-[#48A2FF] group/link transition-colors cursor-pointer"
                      >
                        <span>EXPLORE</span>
                        <span className="text-sm font-bold group-hover/link:translate-x-1.5 transition-transform duration-200">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

