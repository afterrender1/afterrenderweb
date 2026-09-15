"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Urbanist, Playfair_Display } from "next/font/google";
import { Play, ChevronLeft, ChevronRight, X } from "lucide-react";

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

export const clientVideoTestimonialsData = [
 
  {
    id: 1,
    clientName: "KEITH HEARN",
    role: "Finepoint Design And Marketing",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788792634/Checkout_our_Recent_Testimonials_from_our_beloved_clients_DM_EDIT_and_let_s_get_started_tes_1_mbldbt.mp4",
    poster: "/images/short-t-v/keith.png",
  },
     {
    id: 2,
    clientName: "MATHEW",
    role: "Marketing Agency",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788792739/Nothing_speaks_louder_than_a_client_jumping_on_a_call_just_to_tell_you_the_work_exceeded_their_e_wswjkb.mp4",
    poster: "/images/short-t-v/nothing.png",
  },
  {
    id: 3,
    clientName: "LAUREN LOVEJOY",
    role: "Regenerative Agriculture, Farms & Farmers",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788792636/Checkout_our_Recent_Testimonials_from_our_beloved_clients_DM_EDIT_and_let_s_get_started_tes_tewro7.mp4",
    poster: "/images/short-t-v/lauren.png",
  },
  {
    id: 4,
    clientName: "LVAN BOSNJAK",
    role: "Musician and Content Creator",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788792636/Checkout_our_Recent_Testimonials_from_our_beloved_clients_DM_EDIT_and_let_s_get_started_tes_3_q5bumj.mp4",
    poster: "/images/short-t-v/lvan.png",
  },
    {
    id: 5,
    clientName: "CJ",
    role: "Marketing Agency",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788792639/Another_one_locked_in.We_just_closed_a_deal_with_CJ_for_55_reels._That_is_55_pieces_of_content_b_rmi8mu.mp4",
    poster: "/images/short-t-v/dc.png",
  },
  {
    id: 6,
    clientName: "JUSTIN CREATOR",
    role: "Business Coach",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788792636/Checkout_our_Recent_Testimonials_from_our_beloved_clients_DM_EDIT_and_let_s_get_started_tes_2_mz0nv5.mp4",
    poster: "/images/short-t-v/justin.png",
  },

  {
    id: 7,
    clientName: "MATT",
        role: "Marketing Agency",

    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788792639/Matt_came_to_us_for_short_form_content._The_shorts_performed._And_he_took_the_time_to_share_his_aemz7y.mp4",
    poster: "/images/short-t-v/matt.png",
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

const VideoCard = ({ item, index, onOpenModal }) => {
  return (
    <div
      onClick={() => onOpenModal(index)}
      className="relative w-[190px] sm:w-[220px] md:w-[240px] aspect-[9/16] rounded-xl sm:rounded-[12px] overflow-hidden bg-[#0C1017] border border-white/10 hover:border-[#48A2FF]/60 shadow-[0_15px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_0_30px_rgba(72,162,255,0.3)] shrink-0 group cursor-pointer select-none [transform:translateZ(0)] transition-colors duration-300"
    >
      {/* Top subtle highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none group-hover:via-[#48A2FF]/60 transition-colors duration-500 z-10" />

      {/* Poster Image or preview */}
      {item.poster ? (
        <img
          src={item.poster}
          alt={item.clientName}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <video
          src={item.videoUrl}
          preload="metadata"
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Bottom Gradient Overlay & Details */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 sm:p-5 flex flex-col justify-end z-10 pointer-events-none">
        {item.role?.trim() ? (
          <span className="text-[10px] sm:text-[11px] font-bold text-[#48A2FF] uppercase tracking-wider mb-0.5 line-clamp-1">
            {item.role}
          </span>
        ) : null}
        <h4 className="text-white text-sm sm:text-base font-bold tracking-tight line-clamp-1 mb-1">
          {item.clientName}
        </h4>
      </div>

      {/* Central Play Button Overlay */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 flex items-center justify-center transition-all duration-300 z-20">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#48A2FF]/40 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#48A2FF] group-hover:bg-[#3b8ee6] text-white flex items-center justify-center shadow-2xl transition-colors duration-300">
            <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-white ml-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

const emptySubscribe = () => () => {};

const ShortVideoClientTestimonials = () => {
  const [activeModalIndex, setActiveModalIndex] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef(null);

  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const closeModal = React.useCallback(() => {
    if (activeModalIndex === null || isClosing) return;

    // Check if big device (min-width: 768px)
    const isBigDevice =
      typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;

    if (isBigDevice) {
      setIsClosing(true);
      closeTimerRef.current = setTimeout(() => {
        setActiveModalIndex(null);
        setIsClosing(false);
      }, 180); // matches popupCardOut 0.18s
    } else {
      // Instant close on small screens: zero lag, zero delay
      setActiveModalIndex(null);
    }
  }, [activeModalIndex, isClosing]);

  const openModal = (index) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsClosing(false);
    setActiveModalIndex(index);
  };

  // Keyboard navigation for modal (Escape, ArrowLeft, ArrowRight) and body scroll lock
  useEffect(() => {
    if (activeModalIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
      } else if (e.key === "ArrowLeft") {
        setActiveModalIndex((prev) =>
          prev > 0 ? prev - 1 : clientVideoTestimonialsData.length - 1
        );
      } else if (e.key === "ArrowRight") {
        setActiveModalIndex((prev) =>
          prev < clientVideoTestimonialsData.length - 1 ? prev + 1 : 0
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModalIndex, closeModal]);

  const handlePrev = () => {
    setActiveModalIndex((prev) =>
      prev > 0 ? prev - 1 : clientVideoTestimonialsData.length - 1
    );
  };

  const handleNext = () => {
    setActiveModalIndex((prev) =>
      prev < clientVideoTestimonialsData.length - 1 ? prev + 1 : 0
    );
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

  const activeVideo =
    activeModalIndex !== null ? clientVideoTestimonialsData[activeModalIndex] : null;

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
            <span>TESTIMONIALS</span>
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
              animationPlayState: activeModalIndex !== null ? "paused" : "running",
            }}
          >
            {/* Track 1 (1 to 7) */}
            <div
              style={{
                animationPlayState: activeModalIndex !== null ? "paused" : "running",
              }}
              className="flex gap-5 sm:gap-7 shrink-0 pr-5 sm:pr-7 animate-marquee-track will-change-transform"
            >
              {clientVideoTestimonialsData.map((videoItem, index) => (
                <VideoCard
                  key={`t1-${videoItem.id}`}
                  item={videoItem}
                  index={index}
                  onOpenModal={openModal}
                />
              ))}
            </div>

            {/* Track 2 (1 to 7) */}
            <div
              style={{
                animationPlayState: activeModalIndex !== null ? "paused" : "running",
              }}
              className="flex gap-5 sm:gap-7 shrink-0 pr-5 sm:pr-7 animate-marquee-track will-change-transform"
            >
              {clientVideoTestimonialsData.map((videoItem, index) => (
                <VideoCard
                  key={`t2-${videoItem.id}`}
                  item={videoItem}
                  index={index}
                  onOpenModal={openModal}
                />
              ))}
            </div>

            {/* Track 3 (1 to 7) */}
            <div
              style={{
                animationPlayState: activeModalIndex !== null ? "paused" : "running",
              }}
              className="flex gap-5 sm:gap-7 shrink-0 pr-5 sm:pr-7 animate-marquee-track will-change-transform"
            >
              {clientVideoTestimonialsData.map((videoItem, index) => (
                <VideoCard
                  key={`t3-${videoItem.id}`}
                  item={videoItem}
                  index={index}
                  onOpenModal={openModal}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Big Video Popup Modal with Blurred Background */}
      {isMounted &&
        activeVideo &&
        createPortal(
          <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md ${
              isClosing
                ? "animate-modal-backdrop-out"
                : "animate-modal-backdrop-in"
            }`}
            onClick={closeModal}
          >
            {/* Previous Video Button (Desktop) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous video"
              className={`hidden sm:flex absolute left-4 md:left-8 lg:left-14 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white items-center justify-center backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer z-30 shadow-2xl ${
                isClosing ? "md:opacity-0" : "md:opacity-100"
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Video Button (Desktop) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next video"
              className={`hidden sm:flex absolute right-4 md:right-8 lg:right-14 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white items-center justify-center backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer z-30 shadow-2xl ${
                isClosing ? "md:opacity-0" : "md:opacity-100"
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Video Modal Box */}
            <div
              className={`relative w-full max-w-[340px] sm:max-w-[440px] md:max-w-[520px] lg:max-w-[580px] aspect-[14/18] md:aspect-[15/18] max-h-[88vh] rounded-2xl sm:rounded-3xl overflow-hidden bg-black border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_50px_rgba(72,162,255,0.25)] flex flex-col justify-center select-none ${
                isClosing
                  ? "animate-modal-card-out"
                  : "animate-modal-card-in"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Gradient Header: Client Details + Controls */}
              <div className="absolute top-0 inset-x-0 p-4 sm:p-5 bg-gradient-to-b from-black/95 via-black/60 to-transparent flex items-start justify-between z-20">
                <div className="pr-3">
                  {activeVideo.role?.trim() ? (
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-black/20 border border-[#48A2FF]/40 text-gray-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-1">
                      {activeVideo.role}
                    </span>
                  ) : null}
                  <h3 className="text-white text-base sm:text-lg font-bold tracking-tight line-clamp-1">
                    {activeVideo.clientName}
                  </h3>
                </div>

                {/* Header Action Buttons: Mobile Prev/Next + Close */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    aria-label="Previous video"
                    className="sm:hidden p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/25 backdrop-blur-md cursor-pointer active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    aria-label="Next video"
                    className="sm:hidden p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/25 backdrop-blur-md cursor-pointer active:scale-95"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    aria-label="Close modal"
                    className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/25 backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Video Display */}
              <div className="w-full h-full bg-black flex items-center justify-center">
                {isYouTubeUrl(activeVideo.videoUrl) ? (
                  <iframe
                    key={activeVideo.videoUrl}
                    src={getYouTubeEmbedUrl(activeVideo.videoUrl)}
                    title={activeVideo.clientName}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    key={activeVideo.videoUrl}
                    src={activeVideo.videoUrl}
                    autoPlay
                    controls
                    playsInline
                    className="w-full h-full object-cover bg-black"
                  />
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};

export default ShortVideoClientTestimonials;

