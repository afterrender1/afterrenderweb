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
// SERVICES DATA - Yahan aap apni YouTube Video URLs aur Posters update kar sakte hain
// =========================================================================
export const servicesList = [
  {
    id: "01",
    title: "Product Launch & Demo Videos",
    description:
      "Scripted, storyboarded, and animated in-house. 30–45 second launch films built for the feed, 60–75 second demos built for the landing page.",
    link: "/our-work",
    // Yahan apni YouTube URL daalein:
    videoUrl: "https://www.youtube.com/watch?v=qwMtjPHk3aU?si=PgXtx1kjEVJvv0aR",
    // Yahan apni Thumbnail Image URL daalein:
        posterUrl: "/images/longformvideotn1.jpg",

    isMediaLeft: true,
  },
  {
    id: "02",
    title: "Ad Creatives",
    description:
      "We mine your sales calls for angles, then ship 20 creatives with multiple hooks and formats — built to lift ROAS and lower CAC.",
    link: "/our-work",
    // Yahan apni YouTube URL daalein:
    videoUrl: "https://youtube.com/shorts/7Y1Hl1i1PZI?si=H54lIg-ptyYEJly3",
    // Yahan apni Thumbnail Image URL daalein:
    posterUrl: "/images/sfv.jpg",
    isMediaLeft: false,
  },
  {
    id: "03",
    title: "YouTube Organic",
    description:
      "Long-form built to compound: channel strategy, packaging, and a publishing rhythm that keeps working after launch week.",
    link: "/our-work",
    // Yahan apni YouTube URL daalein:
    videoUrl: "https://www.youtube.com/watch?v=16pk6M08U-s?si=8FcIArJ3RqtQKFq8",
    // Yahan apni Thumbnail Image URL daalein:
        posterUrl: "/images/saas.jpg",

    isMediaLeft: true,
  },
];

// Helper function to extract working embed URL from any YouTube link format
function getYouTubeEmbedUrl(url) {
  if (!url) return "";
  if (url.includes("/embed/")) {
    return url.includes("?") ? `${url}&autoplay=1` : `${url}?autoplay=1`;
  }
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^#&?]+)/
  );
  const videoId = match && match[1] ? match[1] : url;
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
            SERVICES CARDS LIST (COMPACT & SLEEK)
            ========================================== */}
        <div className="space-y-4 sm:space-y-5">
          {servicesList.map((item) => {
            const isPlaying = playingVideoId === item.id;
            const embedSrc = getYouTubeEmbedUrl(item.videoUrl);

            return (
              <div
                key={item.id}
                className="bg-[#0B0E14]/90 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.5)] hover:border-white/20 transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                  {/* Media / Video Column (Zero Padding: Flushed to edges) */}
                  <div
                    className={`lg:col-span-6 w-full relative p-0 overflow-hidden ${
                      item.isMediaLeft ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <div className="relative w-full h-full min-h-[190px] sm:min-h-[220px] lg:min-h-[250px] bg-black/90 group/media">
                      {isPlaying ? (
                        <div className="relative w-full h-full min-h-[190px] sm:min-h-[220px] lg:min-h-[250px]">
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
                            className="absolute top-2.5 right-2.5 z-30 p-1.5 rounded-full bg-black/70 hover:bg-black text-white hover:text-[#48A2FF] transition-colors cursor-pointer"
                            aria-label="Close video"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="relative w-full h-full min-h-[190px] sm:min-h-[220px] lg:min-h-[250px] cursor-pointer"
                          onClick={() => setPlayingVideoId(item.id)}
                        >
                          {/* Thumbnail / Poster */}
                          <img
                            src={item.posterUrl}
                            alt={item.title}
                            loading="lazy"
                            className="w-full h-full absolute inset-0 object-cover transition-transform duration-500 group-hover/media:scale-105"
                          />

                          {/* Dark overlay */}
                          <div className="absolute inset-0 bg-black/30 group-hover/media:bg-black/10 transition-colors duration-300" />

                          {/* Center Play Button */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/65 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-2xl group-hover/media:scale-110 group-hover/media:bg-[#48A2FF] group-hover/media:border-[#48A2FF] transition-all duration-300">
                              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white ml-0.5" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content Column (Thori si Padding: Clean & Balanced) */}
                  <div
                    className={`lg:col-span-6 flex flex-col justify-center p-5 sm:p-6 lg:p-7 xl:p-8 ${
                      item.isMediaLeft ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    {/* Step / Number */}
                    <span className="text-[11px] sm:text-xs font-mono tracking-widest text-gray-400 font-bold mb-1.5 sm:mb-2 block">
                      {item.id}
                    </span>

                    {/* Title */}
                    <h3
                      className={`${urbanist.className} text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight mb-2 sm:mb-2.5 leading-snug`}
                    >
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-xs sm:text-[13px] sm:leading-relaxed mb-4 sm:mb-5 max-w-lg font-normal">
                      {item.description}
                    </p>

                    {/* Explore Link */}
                    <div>
                      <Link
                        href={item.link || "/our-work"}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-[12.5px] font-bold tracking-widest uppercase text-gray-300 hover:text-white group/link transition-colors cursor-pointer"
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
