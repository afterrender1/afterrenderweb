"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, X } from "lucide-react";
import { Urbanist, Playfair_Display } from "@/app/lib/fonts";

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

        {/* Services list */}
        <div className="border-t border-white/10">
          {servicesList.map((item) => {
            const isPlaying = playingVideoId === item.id;
            const embedSrc = getYouTubeEmbedUrl(item.videoUrl);

            return (
              <div
                key={item.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-center py-8 sm:py-10 border-b border-white/10"
              >
                {/* Video */}
                <div className={`lg:col-span-6 ${item.isMediaLeft ? "lg:order-1" : "lg:order-2"}`}>
                  <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-black">
                    {isPlaying ? (
                      <>
                        <iframe
                          src={embedSrc}
                          title={item.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full"
                        />
                        <button
                          type="button"
                          onClick={() => setPlayingVideoId(null)}
                          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-black/80 text-white hover:text-[#48A2FF] transition-colors cursor-pointer"
                          aria-label="Close video"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPlayingVideoId(item.id)}
                        className="group absolute inset-0 w-full h-full cursor-pointer"
                        aria-label={`Play video: ${item.title}`}
                      >
                        <Image
                          src={item.posterUrl}
                          alt={item.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover"
                        />
                        <span className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white text-black group-hover:scale-105 transition-transform">
                            <Play className="h-5 w-5 fill-black ml-0.5" />
                          </span>
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Text */}
                <div className={`lg:col-span-6 ${item.isMediaLeft ? "lg:order-2" : "lg:order-1"}`}>
                  <span className="block text-sm font-semibold text-[#48A2FF] mb-2">
                    {item.id}
                  </span>

                  <h3
                    className={`${urbanist.className} text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-3`}
                  >
                    {item.title}
                  </h3>

                  <p className="text-gray-300 text-[15px] leading-relaxed mb-4 max-w-xl">
                    {item.description}
                  </p>

                  {item.tags && item.tags.length > 0 && (
                    <p className="text-sm text-gray-500 mb-5">{item.tags.join(" · ")}</p>
                  )}

                  <Link
                    href={item.link || "/our-work"}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-white underline underline-offset-4 decoration-white/30 hover:decoration-[#48A2FF] hover:text-[#48A2FF] transition-colors"
                  >
                    See our work <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

