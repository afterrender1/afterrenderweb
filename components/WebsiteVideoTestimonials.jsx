"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { cloudinaryImage } from "@/app/lib/cloudinaryUrl";
import { isYouTubeUrl, getYouTubeEmbedUrl } from "@/app/lib/video";
import { SectionTag, SectionHeader } from "./WebsiteSections";

const ReviewCard = ({ item, isPlaying, onPlay }) => {
  const name = item.clientName?.trim() || item.role;

  return (
    <div className="relative w-[150px] min-[400px]:w-[165px] sm:w-auto shrink-0 snap-start aspect-[9/16] rounded-xl sm:rounded-3xl overflow-hidden bg-white ring-1 ring-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.06)] md:hover:-translate-y-1 transition-transform duration-300">
      {isPlaying ? (
        isYouTubeUrl(item.videoUrl) ? (
          <iframe
            src={getYouTubeEmbedUrl(item.videoUrl)}
            title={name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="absolute inset-0 w-full h-full bg-black"
          />
        ) : (
          <video
            src={item.videoUrl}
            autoPlay
            controls
            playsInline
            controlsList="nodownload nofullscreen"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
            className={`absolute inset-0 w-full h-full bg-black ${
              item.fit === "contain" ? "object-contain" : "object-cover"
            }`}
          />
        )
      ) : (
        <button
          type="button"
          onClick={onPlay}
          aria-label={`Play video review from ${name}`}
          className="group absolute inset-0 w-full h-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48A2FF] focus-visible:ring-inset"
        >
          {item.poster ? (
            <Image
              src={cloudinaryImage(item.poster, { width: 600 })}
              alt={`${name}, video review`}
              fill
              sizes="(max-width: 640px) 165px, 300px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <video
              src={item.videoUrl}
              preload="metadata"
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm text-black flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-black ml-0.5" />
            </span>
          </span>

          <span className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-10 sm:px-4 sm:pb-4 sm:pt-12 bg-gradient-to-t from-black/75 to-transparent pointer-events-none">
            {item.clientName?.trim() ? (
              <span className="block text-[13px] sm:text-[15px] font-bold text-white leading-tight line-clamp-1">
                {item.clientName}
              </span>
            ) : null}
            {item.role?.trim() ? (
              <span className="mt-0.5 block text-[10px] sm:text-xs text-white/70 line-clamp-1">
                {item.role}
              </span>
            ) : null}
          </span>
        </button>
      )}
    </div>
  );
};

const WebsiteVideoTestimonials = ({ reviews = [] }) => {
  // Only one card plays at a time; starting another unmounts the previous player
  const [activeId, setActiveId] = useState(null);

  if (!reviews.length) return null;

  return (
    <div className="defer-render">
      <section className="py-10 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <SectionTag label="Testimonials" />
          <SectionHeader
            bold="Hear It From"
            italic="Our Clients"
            text="Real words from founders and brands we've built websites for."
          />
          <div className="no-scrollbar -mx-4 px-4 scroll-px-4 sm:mx-auto sm:px-0 sm:max-w-[900px] flex sm:grid sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:h-0">
            {reviews.map((item, index) => {
              const id = item.id ?? `${item.videoUrl}-${index}`;
              return (
                <ReviewCard
                  key={id}
                  item={item}
                  isPlaying={activeId === id}
                  onPlay={() => setActiveId(id)}
                />
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default WebsiteVideoTestimonials;
