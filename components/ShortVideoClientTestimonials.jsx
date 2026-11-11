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

// Card sizes shared by the real card and its skeleton so nothing jumps when data arrives
const CARD_SIZE = "w-[168px] sm:w-[200px] md:w-[230px] aspect-[9/16] rounded-xl shrink-0";

const SkeletonCard = ({ isLight = false }) => (
  <div
    aria-hidden="true"
    className={`${CARD_SIZE} relative overflow-hidden animate-pulse ${
      isLight ? "bg-black/[0.07]" : "bg-white/[0.07]"
    }`}
  >
    {/* play button placeholder */}
    <div
      className={`absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full ${
        isLight ? "bg-black/[0.08]" : "bg-white/10"
      }`}
    />
    {/* name + role placeholders */}
    <div className="absolute inset-x-0 bottom-0 space-y-2 p-4">
      <div className={`h-3 w-3/5 rounded ${isLight ? "bg-black/10" : "bg-white/10"}`} />
      <div className={`h-2.5 w-2/5 rounded ${isLight ? "bg-black/[0.07]" : "bg-white/[0.07]"}`} />
    </div>
  </div>
);

const VideoCard = ({ item, index, onOpenModal, isLight = false }) => {
  const [posterLoaded, setPosterLoaded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onOpenModal(index)}
      aria-label={`Play video${item.clientName?.trim() ? ` from ${item.clientName}` : ""}`}
      className={`${CARD_SIZE} relative overflow-hidden group cursor-pointer select-none text-left ${
        isLight ? "bg-gray-200" : "bg-[#12161d]"
      }`}
    >
      {/* Skeleton shown until the poster has loaded */}
      {item.poster && !posterLoaded && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 animate-pulse ${isLight ? "bg-black/[0.07]" : "bg-white/[0.07]"}`}
        />
      )}

      {/* Poster Image or preview */}
      {item.poster ? (
        <Image
          src={item.poster}
          alt=""
          fill
          sizes="(max-width: 640px) 168px, (max-width: 768px) 200px, 230px"
          onLoad={() => setPosterLoaded(true)}
          className={`object-cover transition-opacity duration-300 ${posterLoaded ? "opacity-100" : "opacity-0"}`}
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
      <span className="absolute inset-0 flex items-center justify-center z-10">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition-transform duration-200 group-hover:scale-105">
          <Play className="h-4 w-4 fill-black ml-0.5" />
        </span>
      </span>

      {/* Name & role */}
      {(item.clientName?.trim() || item.role?.trim()) && (
        <span className="absolute inset-x-0 bottom-0 z-10 block px-3.5 pb-3.5 pt-10 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
          {item.clientName?.trim() ? (
            <span className="block text-sm font-semibold text-white leading-tight line-clamp-1">
              {item.clientName}
            </span>
          ) : null}
          {item.role?.trim() ? (
            <span className="mt-0.5 block text-xs text-white/70 line-clamp-1">{item.role}</span>
          ) : null}
        </span>
      )}
    </button>
  );
};

const emptySubscribe = () => () => {};

const ShortVideoClientTestimonials = ({ isLight = false }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModalIndex, setActiveModalIndex] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef(null);

  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const scrollContainerRef = useRef(null);
  const firstTrackRef = useRef(null);
  const touchingRef = useRef(false);
  const hoverRef = useRef(false);
  const pausedRef = useRef(false);
  const pauseTimerRef = useRef(null);
  const modalOpenRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/video-reviews")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.success) setVideos(data.reviews);
      })
      .catch((err) => console.error("Failed to load video reviews", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
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

  // Pause auto-scroll for a moment after the visitor interacts (arrows, wheel, swipe momentum)
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

  useEffect(() => {
    modalOpenRef.current = activeModalIndex !== null;
  }, [activeModalIndex]);

  // Carousel: auto-scrolls on its own, but is a real scroll container, so it can also be
  // swiped with a thumb or dragged/wheeled. Three identical tracks let it loop in both directions.
  useEffect(() => {
    const el = scrollContainerRef.current;
    const track = firstTrackRef.current;
    if (loading || !el || !track) return;

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
        modalOpenRef.current ||
        pausedRef.current ||
        reduceMotion;

      if (paused) {
        pos = el.scrollLeft; // follow the user
      } else {
        pos += SPEED * dt;
        el.scrollLeft = pos;
      }

      // Jump a full copy to stay in the middle, invisible because the copies are identical
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
  }, [loading, videos.length]);

  const activeVideo =
    activeModalIndex !== null ? videos[activeModalIndex] : null;

  // Nothing to show once loading has finished with no results
  if (!loading && videos.length === 0) return null;

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
        {/* Section Header with Controls */}
        <div className="flex items-end justify-between gap-6 mb-8 sm:mb-12">
          <div className="max-w-2xl">
            <p
              className={`mb-2 text-xs font-semibold tracking-[0.2em] uppercase ${
                isLight ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Testimonials
            </p>
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] ${
                isLight ? "text-black" : "text-white"
              }`}
            >
              <span>Stories from </span>
              <span
                className={`${playfair.className} italic font-normal ${
                  isLight ? "text-black" : "text-[#F4EBD9]"
                }`}
              >
                Real Clients.
              </span>
            </h2>
            <p
              className={`mt-3 text-sm sm:text-base leading-relaxed ${
                isLight ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Hear directly from creators, founders, and brands who transformed their reach with AfterRender.
            </p>
          </div>

          {/* Arrow buttons: desktop only, the carousel runs by itself on mobile */}
          {!loading && (
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              {[
                { dir: "left", label: "Previous testimonials", Icon: ChevronLeft },
                { dir: "right", label: "Next testimonials", Icon: ChevronRight },
              ].map(({ dir, label, Icon }) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => handleScroll(dir)}
                  aria-label={label}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors cursor-pointer ${
                    isLight
                      ? "border-gray-300 text-black hover:bg-gray-100"
                      : "border-white/20 text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        /* Skeleton row: same card size and gaps as the real carousel, so the layout doesn't shift */
        <div className="w-full overflow-hidden" aria-busy="true" aria-label="Loading testimonials">
          <div className="flex gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 w-max min-w-full lg:justify-center">
            {Array.from({ length: 7 }).map((_, i) => (
              <SkeletonCard key={i} isLight={isLight} />
            ))}
          </div>
        </div>
      ) : (
        /* Infinite running carousel */
        <div className="relative w-full overflow-hidden">
          {/* Edge fades */}
          <div
            className={`pointer-events-none absolute left-0 top-0 bottom-0 w-10 sm:w-24 bg-gradient-to-r ${
              isLight ? "from-[#FAFAFA]" : "from-black"
            } to-transparent z-20`}
          />
          <div
            className={`pointer-events-none absolute right-0 top-0 bottom-0 w-10 sm:w-24 bg-gradient-to-l ${
              isLight ? "from-[#FAFAFA]" : "from-black"
            } to-transparent z-20`}
          />

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
                  {videos.map((videoItem, index) => (
                    <VideoCard
                      key={`${track}-${videoItem._id}`}
                      item={videoItem}
                      index={index}
                      onOpenModal={openModal}
                      isLight={isLight}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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

