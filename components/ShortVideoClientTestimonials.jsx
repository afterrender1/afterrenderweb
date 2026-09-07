"use client";

import React, { useState, useRef } from "react";
import { Urbanist, Playfair_Display } from "next/font/google";
import { Play, Pause, ChevronLeft, ChevronRight, X } from "lucide-react";

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
// CLIENT VIDEO TESTIMONIALS DATA
// Aap yahan apni Video URLs (MP4 ya YouTube Shorts), Posters aur Details add kar sakte hain:
// =========================================================================
export const clientVideoTestimonialsData = [
  {
    id: 1,
    clientName: "Deborah",
    role: "Medical Creator",
    result: "+120K Views per Video",
    // Yahan apni video URL daalein:
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788792634/Checkout_our_Recent_Testimonials_from_our_beloved_clients_DM_EDIT_and_let_s_get_started_tes_1_mbldbt.mp4",
    // Yahan apna thumbnail/poster image path daalein:
    poster: "/images/short-t-v/keith.png",
  },
  {
    id: 2,
    clientName: "Traction",
    role: "Digital Entrepreneur",
    result: "3x Engagement Growth",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788792636/Checkout_our_Recent_Testimonials_from_our_beloved_clients_DM_EDIT_and_let_s_get_started_tes_tewro7.mp4",
    poster: "/images/short-t-v/lauren.png",
  },
  {
    id: 3,
    clientName: "Crypto Simba",
    role: "Crypto Trader & Creator",
    result: "High Watch Time & Retention",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788792636/Checkout_our_Recent_Testimonials_from_our_beloved_clients_DM_EDIT_and_let_s_get_started_tes_3_q5bumj.mp4",
    poster: "/images/short-t-v/lvan.png",
  },
  {
    id: 4,
    clientName: "FinePoint Marketing",
    role: "SaaS Company",
    result: "Lower CAC & Better ROAS",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788792636/Checkout_our_Recent_Testimonials_from_our_beloved_clients_DM_EDIT_and_let_s_get_started_tes_2_mz0nv5.mp4",
    poster: "/images/short-t-v/justin.png",
  },
  {
    id: 5,
    clientName: "Audrey",
    role: "Fitness Coach",
    result: "+2M Monthly Impressions",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788792639/Another_one_locked_in.We_just_closed_a_deal_with_CJ_for_55_reels._That_is_55_pieces_of_content_b_rmi8mu.mp4",
    poster: "/images/short-t-v/dc.png",
  },
  {
    id: 6,
    clientName: "BigHots",
    role: "YouTube Creator",
    result: "100K+ Organic Subscribers",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788792639/Matt_came_to_us_for_short_form_content._The_shorts_performed._And_he_took_the_time_to_share_his_aemz7y.mp4",
    poster: "/images/short-t-v/matt.png",
  },
  {
    id: 7,
    clientName: "Alex R.",
    role: "Agency Founder",
    result: "Viral Brand Packaging",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788792739/Nothing_speaks_louder_than_a_client_jumping_on_a_call_just_to_tell_you_the_work_exceeded_their_e_wswjkb.mp4",
    poster: "/images/short-t-v/nothing.png",
  },
];

// Helper to check if URL is a YouTube link
function isYouTubeUrl(url) {
  if (!url) return false;
  return url.includes("youtube.com") || url.includes("youtu.be");
}

// Helper to format YouTube Embed link
function getYouTubeEmbedUrl(url) {
  if (!url) return "";
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  const videoId = match && match[1] ? match[1] : url;
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
}

const VideoCard = ({ item, uniqueKey, currentPlayingKey, onTogglePlay }) => {
  const isPlaying = currentPlayingKey === uniqueKey;
  const isYT = isYouTubeUrl(item.videoUrl);

  const handleCardClick = (e) => {
    e.stopPropagation();
    onTogglePlay(uniqueKey);
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative w-[190px] sm:w-[220px] md:w-[240px] aspect-[9/16] rounded-2xl sm:rounded-[22px] overflow-hidden bg-[#0C1017] border border-white/10 hover:border-[#48A2FF]/40 shadow-[0_15px_40px_rgba(0,0,0,0.6)] shrink-0 group cursor-pointer select-none [transform:translateZ(0)] transition-all duration-300"
    >
      {/* Top subtle highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none group-hover:via-[#48A2FF]/40 transition-colors duration-500 z-10" />

      {/* Poster Image (Visible when not playing) or video preview frame if poster is omitted */}
      {item.poster ? (
        <img
          src={item.poster}
          alt={item.clientName}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        />
      ) : (
        <video
          src={item.videoUrl}
          preload="metadata"
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        />
      )}

      {/* Video Element / YouTube Iframe */}
      {isPlaying && (
        <div className="absolute inset-0 w-full h-full bg-black z-20">
          {isYT ? (
            <iframe
              src={getYouTubeEmbedUrl(item.videoUrl)}
              title={item.clientName}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={item.videoUrl}
              autoPlay
              loop
              playsInline
              controls={false}
              className="w-full h-full object-cover"
            />
          )}
          {/* Close / Pause Floating Button */}
          <button
            type="button"
            onClick={handleCardClick}
            aria-label="Stop video"
            className="absolute top-2.5 right-2.5 z-30 p-1.5 rounded-full bg-black/80 hover:bg-black text-white hover:text-[#48A2FF] transition-colors cursor-pointer border border-white/20"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Bottom Gradient Overlay & Details */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 sm:p-5 flex flex-col justify-end z-10 pointer-events-none">
        <span className="text-[10px] sm:text-[11px] font-bold text-[#48A2FF] uppercase tracking-wider mb-0.5">
          {item.role}
        </span>
        <h4 className="text-white text-sm sm:text-base font-bold tracking-tight line-clamp-1 mb-1">
          {item.clientName}
        </h4>
        <span className="text-[11px] text-gray-300/90 font-medium line-clamp-1">
          "{item.result}"
        </span>
      </div>

      {/* Central Play Button Overlay */}
      <div
        className={`absolute inset-0 bg-black/25 flex items-center justify-center transition-all duration-300 z-20 ${
          isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
        }`}
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#48A2FF]/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#48A2FF] hover:bg-[#3b8ee6] text-white flex items-center justify-center shadow-2xl transform transition-all duration-300 group-hover:scale-110 active:scale-95">
            {isPlaying ? (
              <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-white" />
            ) : (
              <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-white ml-0.5" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ShortVideoClientTestimonials = () => {
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
      id="client-video-testimonials"
      className={`${urbanist.className} relative bg-black text-white py-14 sm:py-20 lg:py-24 overflow-hidden`}
      style={{
        backgroundImage: "url('/images/casebg.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tag & Divider Line */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold tracking-widest uppercase text-gray-400">
            <span className="w-2 h-2 rounded-full bg-[#CEFF00] inline-block shadow-[0_0_8px_#CEFF00]" />
            <span>VIDEO TESTIMONIALS</span>
          </div>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>

        {/* Section Header with Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              <span>Stories from </span>
              <span
                className={`${playfair.className} italic font-normal text-[#F4EBD9] block sm:inline`}
              >
                Real Clients.
              </span>
            </h2>
            <p className="mt-3.5 text-gray-400 text-xs sm:text-sm md:text-[14.5px] leading-relaxed font-medium">
              Hear directly from creators, founders, and brands who transformed their reach with AfterRender.
            </p>
          </div>

          {/* Navigation Arrow Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Previous testimonials"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white active:scale-95 flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-md group"
            >
              <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Next testimonials"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white active:scale-95 flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-md group"
            >
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Seamless Infinite Running Carousel Track */}
      <div className="relative w-full overflow-hidden">
        {/* Soft edge blur gradient masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-black via-black/80 to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-black via-black/80 to-transparent z-20" />

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
              {clientVideoTestimonialsData.map((videoItem) => {
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
              {clientVideoTestimonialsData.map((videoItem) => {
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
              {clientVideoTestimonialsData.map((videoItem) => {
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

export default ShortVideoClientTestimonials;
