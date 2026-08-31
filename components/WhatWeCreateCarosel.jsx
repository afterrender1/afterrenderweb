"use client";

import React, { useState, useRef } from "react";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "600", "700"],
});

// 9:16 Short Form Videos Array (7 Videos)
const videosData = [
  {
    id: 1,
    title: "Adam Reel",
    category: "Shorts & Reels",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788183664/Adam_reel-1_phvxsx.mp4",
    poster: "/images/video-tn/one.png",
  },
  {
    id: 2,
    title: "Matt Short",
    category: "Paid Social Ad",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788183792/Matt_Short_03_jjo3qx.mp4",
    poster: "/images/video-tn/two.png",
  },
  {
    id: 3,
    title: "Motion Graphics & B-Roll",
    category: "YouTube Shorts",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788184449/Reel-1_pxvgud.mp4",
    poster: "/images/video-tn/three.png",
  },
  {
    id: 4,
    title: "SaaS Product Demo",
    category: "TikTok Campaign",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788184603/reel-1_kuxlzp.mp4",
    poster: "/images/video-tn/four.png",
  },
  {
    id: 5,
    title: "Creator Storytelling",
    category: "Viral Edit",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788184746/reel-1_wveaag.mp4",
    poster: "/images/video-tn/five.png",
  },
  {
    id: 6,
    title: "Nade Reel Revise",
    category: "Viral Edit",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788184788/Nade_reel-1_revise_ejrqar.mp4",
    poster: "/images/video-tn/six.png",
  },
  {
    id: 7,
    title: "Anthropic Reel",
    category: "Viral Edit",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788184812/Anthropic_reel_n76nlc.mp4",
    poster: "/images/video-tn/seven.png",
  },
];

const VideoCard = ({ item, uniqueKey, currentPlayingKey, onTogglePlay }) => {
  const isPlaying = currentPlayingKey === uniqueKey;

  const handleCardClick = (e) => {
    e.stopPropagation();
    onTogglePlay(uniqueKey);
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative w-[190px] sm:w-[220px] md:w-[240px] aspect-[9/16] rounded-2xl sm:rounded-[22px] overflow-hidden bg-neutral-950 border border-gray-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.04)] shrink-0 group cursor-pointer select-none [transform:translateZ(0)]"
    >
      {/* Poster Image (Visible when not playing) */}
      <img
        src={item.poster}
        alt={item.title}
        loading="lazy"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      />

      {/* Video Element (Only loaded & rendered when user clicks play) */}
      {isPlaying && (
        <video
          src={item.videoUrl}
          autoPlay
          loop
          playsInline
          controls={false}
          className="w-full h-full object-cover"
        />
      )}

      {/* Top Floating Badge */}
      <div className="absolute top-3.5 right-3.5 z-10 pointer-events-none">
        <span className="inline-flex items-center gap-1 bg-[#CEFF00] text-black text-[10.5px] font-bold px-2.5 py-1 rounded-full shadow-xs tracking-tight">
          ✦ After
        </span>
      </div>

      {/* Bottom Gradient Overlay & Title */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 sm:p-5 flex flex-col justify-end z-10 pointer-events-none">
        <span className="text-[10px] sm:text-[11px] font-bold text-[#48A2FF] uppercase tracking-wider mb-1">
          {item.category}
        </span>
        <h4 className="text-white text-sm sm:text-base font-bold tracking-tight line-clamp-1">
          {item.title}
        </h4>
      </div>

      {/* Central Play/Pause Button Overlay */}
      <div
        className={`absolute inset-0 bg-black/25 flex items-center justify-center transition-all duration-300 z-20 ${
          isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
        }`}
      >
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#48A2FF] hover:bg-[#3b8ee6] text-white flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110 active:scale-95">
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-white text-white" />
          ) : (
            <Play className="w-6 h-6 fill-white text-white ml-0.5" />
          )}
        </div>
      </div>
    </div>
  );
};

const WhatWeCreateCarosel = () => {
  const [currentPlayingKey, setCurrentPlayingKey] = useState(null);
  const scrollContainerRef = useRef(null);

  const handleTogglePlay = (uniqueKey) => {
    setCurrentPlayingKey((prev) => (prev === uniqueKey ? null : uniqueKey));
  };

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      className={`${jakarta.className} relative bg-[#FAFAFA] text-black py-16 sm:py-24 overflow-hidden`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tag & Divider Line */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold tracking-widest uppercase text-gray-400">
            <span className="w-2 h-2 rounded-full bg-[#CEFF00] inline-block" />
            <span>What We Create</span>
          </div>
          <div className="flex-1 h-[1px] bg-gray-200" />
        </div>

        {/* Section Header with Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
              <span>From Raw to </span>
              <span
                className={`${playfair.className} italic font-normal text-gray-900 block sm:inline`}
              >
                Remarkable.
              </span>
            </h2>
            <p className="mt-3.5 text-gray-500 text-xs sm:text-sm md:text-[14.5px] leading-relaxed font-medium">
              Raw inputs, refined outputs. That’s the AfterRender touch.
            </p>
          </div>

          {/* Navigation Arrow Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Previous videos"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border border-gray-200 shadow-2xs hover:bg-gray-50 active:scale-95 flex items-center justify-center transition-all duration-200 cursor-pointer group"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:text-black transition-colors" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Next videos"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border border-gray-200 shadow-2xs hover:bg-gray-50 active:scale-95 flex items-center justify-center transition-all duration-200 cursor-pointer group"
            >
              <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-black transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Seamless Infinite Running Carousel Track */}
      <div className="relative w-full overflow-hidden">
        {/* Soft edge blur gradient masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-[#FAFAFA] via-[#FAFAFA]/80 to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-[#FAFAFA] via-[#FAFAFA]/80 to-transparent z-20" />

        {/* Scrollable / Animated Marquee Track */}
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-hidden no-scrollbar"
        >
          <div
            className="flex w-max hover:[&>*]:[animation-play-state:paused]"
            style={{
              animationPlayState: currentPlayingKey ? "paused" : "running",
            }}
          >
            {/* Track 1 (1 to 7) */}
            <div
              style={{
                animationPlayState: currentPlayingKey ? "paused" : "running",
              }}
              className="flex gap-5 sm:gap-7 shrink-0 pr-5 sm:pr-7 animate-marquee-track will-change-transform"
            >
              {videosData.map((videoItem) => {
                const uniqueKey = `t1-${videoItem.id}`;
                return (
                  <VideoCard
                    key={uniqueKey}
                    uniqueKey={uniqueKey}
                    item={videoItem}
                    currentPlayingKey={currentPlayingKey}
                    onTogglePlay={handleTogglePlay}
                  />
                );
              })}
            </div>

            {/* Track 2 (1 to 7 - immediately attaches to the right of Track 1's 7th video) */}
            <div
              style={{
                animationPlayState: currentPlayingKey ? "paused" : "running",
              }}
              className="flex gap-5 sm:gap-7 shrink-0 pr-5 sm:pr-7 animate-marquee-track will-change-transform"
            >
              {videosData.map((videoItem) => {
                const uniqueKey = `t2-${videoItem.id}`;
                return (
                  <VideoCard
                    key={uniqueKey}
                    uniqueKey={uniqueKey}
                    item={videoItem}
                    currentPlayingKey={currentPlayingKey}
                    onTogglePlay={handleTogglePlay}
                  />
                );
              })}
            </div>

            {/* Track 3 (1 to 7 - guarantees zero empty space on wide screens) */}
            <div
              style={{
                animationPlayState: currentPlayingKey ? "paused" : "running",
              }}
              className="flex gap-5 sm:gap-7 shrink-0 pr-5 sm:pr-7 animate-marquee-track will-change-transform"
            >
              {videosData.map((videoItem) => {
                const uniqueKey = `t3-${videoItem.id}`;
                return (
                  <VideoCard
                    key={uniqueKey}
                    uniqueKey={uniqueKey}
                    item={videoItem}
                    currentPlayingKey={currentPlayingKey}
                    onTogglePlay={handleTogglePlay}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeCreateCarosel;