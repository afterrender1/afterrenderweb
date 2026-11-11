"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Plus_Jakarta_Sans, Playfair_Display } from "@/app/lib/fonts";
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
  const [posterLoaded, setPosterLoaded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onTogglePlay(uniqueKey)}
      aria-label={`${isPlaying ? "Stop" : "Play"} video: ${item.title}`}
      className="relative w-[168px] sm:w-[200px] md:w-[230px] aspect-[9/16] rounded-xl overflow-hidden bg-neutral-200 shrink-0 group cursor-pointer select-none text-left"
    >
      {/* Skeleton until the poster has loaded */}
      {!posterLoaded && (
        <span aria-hidden="true" className="absolute inset-0 animate-pulse bg-black/[0.07]" />
      )}

      {/* Poster (hidden while the video plays) */}
      <Image
        src={item.poster}
        alt=""
        fill
        sizes="(max-width: 640px) 168px, (max-width: 768px) 200px, 230px"
        onLoad={() => setPosterLoaded(true)}
        className={`object-cover transition-opacity duration-300 ${
          posterLoaded && !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Video is only mounted after the visitor taps play */}
      {isPlaying && (
        <video
          src={item.videoUrl}
          autoPlay
          loop
          playsInline
          controls={false}
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Title (poster state only) */}
      {!isPlaying && (
        <span className="absolute inset-x-0 bottom-0 z-10 block px-3.5 pb-3.5 pt-10 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
          <span className="block text-[11px] font-semibold text-[#7cc0ff] uppercase tracking-wide">
            {item.category}
          </span>
          <span className="mt-0.5 block text-sm font-semibold text-white leading-tight line-clamp-1">
            {item.title}
          </span>
        </span>
      )}

      {/* Play button (poster state only) */}
      {!isPlaying && (
        <span className="absolute inset-0 z-20 flex items-center justify-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition-transform duration-200 group-hover:scale-105">
            <Play className="h-4 w-4 fill-black ml-0.5" />
          </span>
        </span>
      )}

      {/* Pause button while playing */}
      {isPlaying && (
        <span className="absolute right-2.5 top-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white">
          <Pause className="h-3.5 w-3.5 fill-white" />
        </span>
      )}
    </button>
  );
};

const WhatWeCreateCarosel = () => {
  const [currentPlayingKey, setCurrentPlayingKey] = useState(null);
  const scrollContainerRef = useRef(null);
  const firstTrackRef = useRef(null);
  const touchingRef = useRef(false);
  const hoverRef = useRef(false);
  const pausedRef = useRef(false);
  const pauseTimerRef = useRef(null);
  const playingRef = useRef(false);

  useEffect(() => {
    playingRef.current = currentPlayingKey !== null;
  }, [currentPlayingKey]);

  const handleTogglePlay = (uniqueKey) => {
    setCurrentPlayingKey((prev) => (prev === uniqueKey ? null : uniqueKey));
  };

  // Pause auto-scroll briefly after the visitor interacts (arrows, wheel, swipe momentum)
  const pauseAutoScroll = (ms = 2500) => {
    pausedRef.current = true;
    clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, ms);
  };

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      pauseAutoScroll();
      const scrollAmount = direction === "left" ? -280 : 280;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Auto-scrolls on its own but is a real scroll container, so it can be swiped with a thumb
  // or dragged/wheeled. Three identical tracks let it loop in both directions.
  useEffect(() => {
    const el = scrollContainerRef.current;
    const track = firstTrackRef.current;
    if (!el || !track) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SPEED = 45; // px per second
    let raf;
    let last = 0;
    let pos = track.offsetWidth; // start on the middle copy
    el.scrollLeft = pos;

    const tick = (now) => {
      const dt = last ? Math.min(now - last, 64) / 1000 : 0;
      last = now;
      const w = track.offsetWidth;

      const paused =
        touchingRef.current ||
        hoverRef.current ||
        playingRef.current ||
        pausedRef.current ||
        reduceMotion;

      if (paused) {
        pos = el.scrollLeft; // follow the user
      } else {
        pos += SPEED * dt;
        el.scrollLeft = pos;
      }

      // Jump one full copy to stay in the middle; invisible because the copies are identical
      if (w > 0 && !touchingRef.current) {
        if (el.scrollLeft >= 2 * w) {
          pos = el.scrollLeft - w;
          el.scrollLeft = pos;
        } else if (el.scrollLeft < w * 0.5) {
          pos = el.scrollLeft + w;
          el.scrollLeft = pos;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(pauseTimerRef.current);
    };
  }, []);

  return (
    <section
      className={`${jakarta.className} relative bg-[#FAFAFA] text-black py-14 sm:py-20 lg:py-24 overflow-hidden`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Controls */}
        <div className="flex items-end justify-between gap-6 mb-8 sm:mb-12">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">
              What We Create
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
              <span>From Raw to </span>
              <span className={`${playfair.className} italic font-normal text-gray-900`}>
                Remarkable.
              </span>
            </h2>
            <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed">
              Raw inputs, refined outputs. That’s the AfterRender touch.
            </p>
          </div>

          {/* Arrow buttons: desktop only, the carousel runs by itself and can be swiped on mobile */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {[
              { dir: "left", label: "Previous videos", Icon: ChevronLeft },
              { dir: "right", label: "Next videos", Icon: ChevronRight },
            ].map(({ dir, label, Icon }) => (
              <button
                key={dir}
                type="button"
                onClick={() => handleScroll(dir)}
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-black hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Infinite running carousel */}
      <div className="relative w-full overflow-hidden">
        {/* Edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 sm:w-24 bg-gradient-to-r from-[#FAFAFA] to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 sm:w-24 bg-gradient-to-l from-[#FAFAFA] to-transparent z-20" />

        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto no-scrollbar"
          onTouchStart={() => {
            touchingRef.current = true;
          }}
          onTouchEnd={() => {
            touchingRef.current = false;
            pauseAutoScroll(3000); // let the swipe momentum finish
          }}
          onTouchCancel={() => {
            touchingRef.current = false;
            pauseAutoScroll(3000);
          }}
          onWheel={() => pauseAutoScroll()}
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") hoverRef.current = true;
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") hoverRef.current = false;
          }}
        >
          <div className="flex w-max">
            {["t1", "t2", "t3"].map((track, trackIndex) => (
              <div
                key={track}
                ref={trackIndex === 0 ? firstTrackRef : undefined}
                className="flex gap-4 sm:gap-6 shrink-0 pr-4 sm:pr-6"
              >
                {videosData.map((videoItem) => {
                  const uniqueKey = `${track}-${videoItem.id}`;
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeCreateCarosel;