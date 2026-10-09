"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Urbanist, Playfair_Display } from "@/app/lib/fonts";
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

const VideoCard = ({ item, index, onOpenModal, isLight = false }) => {
  return (
    <div
      onClick={() => onOpenModal(index)}
      className={`relative w-[190px] sm:w-[220px] md:w-[240px] aspect-[9/16] rounded-2xl overflow-hidden shrink-0 group cursor-pointer select-none [transform:translateZ(0)] transition-all duration-300 hover:-translate-y-1 ${
        isLight
          ? "bg-white ring-1 ring-black/10 shadow-[0_6px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.14)]"
          : "bg-[#0C1017] ring-1 ring-white/10 hover:ring-white/25"
      }`}
    >
      {/* Poster Image or preview */}
      {item.poster ? (
        <Image
          src={item.poster}
          alt={item.clientName}
          fill
          sizes="(max-width: 640px) 190px, (max-width: 768px) 220px, 240px"
          className="object-cover"
        />
      ) : (
        <video
          src={item.videoUrl}
          preload="metadata"
          playsInline
          muted
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm text-black flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
          <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-black ml-0.5" />
        </div>
      </div>

      {/* Name & role */}
      <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-12 bg-gradient-to-t from-black/75 to-transparent z-10 pointer-events-none">
        {item.clientName?.trim() ? (
          <h4 className="text-sm sm:text-[15px] font-bold text-white leading-tight line-clamp-1">
            {item.clientName}
          </h4>
        ) : null}
        {item.role?.trim() ? (
          <p className="mt-0.5 text-[11px] sm:text-xs text-white/70 line-clamp-1">
            {item.role}
          </p>
        ) : null}
      </div>
    </div>
  );
};

const emptySubscribe = () => () => {};

const ShortVideoClientTestimonials = ({ isLight = false }) => {
  const [videos, setVideos] = useState([]);
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
    let cancelled = false;
    fetch("/api/video-reviews")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.success) setVideos(data.reviews);
      })
      .catch((err) => console.error("Failed to load video reviews", err));
    return () => {
      cancelled = true;
    };
  }, []);

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
          prev > 0 ? prev - 1 : videos.length - 1
        );
      } else if (e.key === "ArrowRight") {
        setActiveModalIndex((prev) =>
          prev < videos.length - 1 ? prev + 1 : 0
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModalIndex, closeModal, videos.length]);

  const handlePrev = () => {
    setActiveModalIndex((prev) =>
      prev > 0 ? prev - 1 : videos.length - 1
    );
  };

  const handleNext = () => {
    setActiveModalIndex((prev) =>
      prev < videos.length - 1 ? prev + 1 : 0
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
    activeModalIndex !== null ? videos[activeModalIndex] : null;

  if (videos.length === 0) return null;

  return (
    <section
      id="client-video-testimonials"
      className={`${urbanist.className} relative ${
        isLight ? "bg-[#FAFAFA] text-black" : "bg-black text-white"
      } py-14 sm:py-20 lg:py-24 overflow-hidden`}
      style={
        isLight
          ? { backgroundImage: "none", backgroundColor: "#FAFAFA" }
          : {
              backgroundImage: "url('/images/casebg.png')",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
      }
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tag & Divider Line */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`flex items-center gap-1.5 text-[11px] sm:text-xs font-bold tracking-widest uppercase ${
              isLight ? "text-black" : "text-gray-400"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full inline-block ${
                isLight
                  ? "bg-[#48A2FF] shadow-[0_0_8px_rgba(72,162,255,0.6)]"
                  : "bg-[#CEFF00] shadow-[0_0_8px_#CEFF00]"
              }`}
            />
            <span>TESTIMONIALS</span>
          </div>
          <div
            className={`flex-1 h-[1px] ${
              isLight ? "bg-gray-300" : "bg-white/10"
            }`}
          />
        </div>

        {/* Section Header with Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] ${
                isLight ? "text-black" : "text-white"
              }`}
            >
              <span>Stories from </span>
              <span
                className={`${playfair.className} italic font-normal ${
                  isLight ? "text-black" : "text-[#F4EBD9]"
                } block sm:inline`}
              >
                Real Clients.
              </span>
            </h2>
            <p
              className={`mt-3.5 text-xs sm:text-sm md:text-[14.5px] leading-relaxed font-semibold ${
                isLight ? "text-black" : "text-gray-400"
              }`}
            >
              Hear directly from creators, founders, and brands who transformed their reach with AfterRender.
            </p>
          </div>

          {/* Navigation Arrow Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Previous testimonials"
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border active:scale-95 flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-md group ${
                isLight
                  ? "bg-white hover:bg-gray-100 border-gray-300 text-black shadow-xs"
                  : "bg-white/10 hover:bg-white/20 border-white/15 text-white"
              }`}
            >
              <ChevronLeft
                className={`w-5 h-5 transition-colors ${
                  isLight
                    ? "text-black group-hover:scale-110"
                    : "text-gray-300 group-hover:text-white"
                }`}
              />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Next testimonials"
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border active:scale-95 flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-md group ${
                isLight
                  ? "bg-white hover:bg-gray-100 border-gray-300 text-black shadow-xs"
                  : "bg-white/10 hover:bg-white/20 border-white/15 text-white"
              }`}
            >
              <ChevronRight
                className={`w-5 h-5 transition-colors ${
                  isLight
                    ? "text-black group-hover:scale-110"
                    : "text-gray-300 group-hover:text-white"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Seamless Infinite Running Carousel Track */}
      <div className="relative w-full overflow-hidden">
        {/* Soft edge blur gradient masks */}
        <div
          className={`pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r ${
            isLight
              ? "from-[#FAFAFA] via-[#FAFAFA]/80"
              : "from-black via-black/80"
          } to-transparent z-20`}
        />
        <div
          className={`pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l ${
            isLight
              ? "from-[#FAFAFA] via-[#FAFAFA]/80"
              : "from-black via-black/80"
          } to-transparent z-20`}
        />

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
              {videos.map((videoItem, index) => (
                <VideoCard
                  key={`t1-${videoItem._id}`}
                  item={videoItem}
                  index={index}
                  onOpenModal={openModal}
                  isLight={isLight}
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
              {videos.map((videoItem, index) => (
                <VideoCard
                  key={`t2-${videoItem._id}`}
                  item={videoItem}
                  index={index}
                  onOpenModal={openModal}
                  isLight={isLight}
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
              {videos.map((videoItem, index) => (
                <VideoCard
                  key={`t3-${videoItem._id}`}
                  item={videoItem}
                  index={index}
                  onOpenModal={openModal}
                  isLight={isLight}
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
                  {activeVideo.clientName?.trim() ? (
                    <h3 className="text-white text-base sm:text-lg font-bold tracking-tight line-clamp-1">
                      {activeVideo.clientName}
                    </h3>
                  ) : null}
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
                    controlsList="nodownload"
                    disablePictureInPicture
                    onContextMenu={(e) => e.preventDefault()}
                    playsInline
                    className={`w-full h-full bg-black ${
                      activeVideo.fit === "contain"
                        ? "object-contain"
                        : "object-cover"
                    }`}
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

