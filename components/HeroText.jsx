"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Urbanist, Playfair_Display } from "@/app/lib/fonts";
import BookACall from "./BookACall";
import AnnouncementTrack, { announcementWrapperStyle } from "./AnnouncementTrack";
import { cloudinaryImage, cloudinarySrcSet } from "@/app/lib/cloudinaryUrl";
import { announcementBackground } from "@/app/lib/announcementStyle";

export const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-urbanist",
  display: "swap",
});

export const editorialSerif = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const words = ["Video Edits", "Graphic Design", "AI Avatars"];
const LONGEST_WORD = words.reduce((a, b) => (b.length > a.length ? b : a));

// Original upload is ~23MB; Cloudinary transcodes to a right-sized, compressed
// rendition (~1.5MB mobile / ~4MB desktop) with the best codec per browser.
const VIDEO_BASE = "https://res.cloudinary.com/dlurrugno/video/upload";
const VIDEO_ID = "v1791555685/Afterrendershowreel_uv3d14.mp4";
const videoSrc = (isMobile) =>
  `${VIDEO_BASE}/${isMobile ? "q_auto:eco,vc_auto,w_720" : "q_auto,vc_auto,w_1280"}/${VIDEO_ID}`;
// The poster is the page's LCP element. A <video poster> can't be responsive or
// high-priority, so it's a real <img> (srcset + fetchpriority) under the video instead.
const POSTER_URL = "https://res.cloudinary.com/dlurrugno/image/upload/v1791545041/main-poster_a9zfxj.webp";
// Rendered width of the video frame: 80% of the 960px content column on xl, ~75-90% of the viewport below
const POSTER_SIZES = "(min-width: 1280px) 768px, (min-width: 1024px) 720px, 85vw";

// Matches the fixed navbar height (logo + vertical padding) at each breakpoint
const NAV_OFFSET = "top-[60px] sm:top-[78px]";

// Typewriter lives in its own component so its 40–80ms ticks re-render only
// this span, not the whole hero.
// `gradient` ({ from, via, to }) comes from the live event; null keeps the default blues.
const Typewriter = ({ gradient = null }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const targetWord = words[currentWordIndex];

    // Full word typed: hold it for 2s before deleting
    if (!isDeleting && currentText === targetWord) {
      const hold = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(hold);
    }

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setCurrentText(targetWord.substring(0, currentText.length + 1));
        } else if (currentText === "") {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        } else {
          setCurrentText(targetWord.substring(0, currentText.length - 1));
        }
      },
      isDeleting ? 40 : 80
    );

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex]);

  const cursor = <span className="inline-block w-[1.5px] sm:w-[2px] h-[0.9em] bg-white/70 ml-1.5 align-middle animate-pulse" />;

  // An invisible copy of the longest word reserves the width, so typing doesn't
  // reflow the headline on every tick (that movement counted as layout shift).
  return (
    <span className={`${editorialSerif.className} italic font-normal tracking-normal inline-grid min-h-[1.2em]`}>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1 inline-flex items-center">
        {LONGEST_WORD}
        {cursor}
      </span>
      <span
        className={`col-start-1 row-start-1 justify-self-start inline-flex items-center text-transparent bg-clip-text ${
          gradient ? "" : "bg-gradient-to-r from-[#48A2FF] via-[#7EC0FF] to-[#C9E4FF]"
        }`}
        style={
          gradient
            ? { backgroundImage: `linear-gradient(to right, ${gradient.from}, ${gradient.via}, ${gradient.to})` }
            : undefined
        }
      >
        {currentText}
        {cursor}
      </span>
    </span>
  );
};

// Gently swinging decoration that hangs from just below the navbar.
// CSS animation (rotate/translate) runs on the compositor, not the JS thread.
const HangingImage = ({ src, side, belowBar }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={cloudinaryImage(src, { width: 448 })}
    srcSet={cloudinarySrcSet(src, [192, 288, 448])}
    sizes="(min-width: 1024px) 224px, (min-width: 768px) 176px, (min-width: 640px) 144px, 96px"
    alt=""
    aria-hidden="true"
    draggable={false}
    decoding="async"
    fetchPriority="low"
    className={`pointer-events-none select-none absolute ${belowBar ? "top-[96px] sm:top-[114px]" : NAV_OFFSET} z-[5] h-auto w-24 sm:w-36 md:w-44 lg:w-56 ${
      side === "left" ? "left-0 sm:left-4 animate-hang" : "right-0 sm:right-4 animate-hang-reverse"
    }`}
    onError={(e) => {
      e.currentTarget.style.display = "none";
    }}
  />
);

// Full-width strip under the navbar with continuously scrolling text.
// Colors / gradient come from the event's announcementStyle (set in admin).
const AnnouncementBar = ({ text, link, style }) => {
  const className = `announcement-bar absolute inset-x-0 ${NAV_OFFSET} z-[6] flex overflow-hidden h-9 border-y border-white/10 text-xs sm:text-sm font-medium`;
  const wrapperStyle = announcementWrapperStyle(style);
  const content = <AnnouncementTrack text={text} style={style} showArrow={Boolean(link)} />;

  if (!link) return <div className={className} style={wrapperStyle}>{content}</div>;
  if (link.startsWith("/")) {
    return (
      <Link href={link} className={`${className} hover:brightness-110 transition`} style={wrapperStyle}>
        {content}
      </Link>
    );
  }
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className={`${className} hover:brightness-110 transition`} style={wrapperStyle}>
      {content}
    </a>
  );
};

const HeroBackground = ({ url }) => {
  const [failed, setFailed] = useState(false);

  if (url && !failed) {
    return (
      // Real <img> (not CSS background) so the browser discovers it in the HTML
      // and fetches it first; Cloudinary serves a right-sized WebP/AVIF.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={cloudinaryImage(url, { width: 1920 })}
        srcSet={cloudinarySrcSet(url, [640, 960, 1280, 1920, 2560])}
        sizes="100vw"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        onError={() => setFailed(true)}
        className="absolute inset-0 w-full h-full object-cover"
      />
    );
  }

  return (
    <Image
      src="/images/hb1.png"
      alt=""
      aria-hidden="true"
      fill
      priority
      sizes="100vw"
      className="object-contain"
    />
  );
};

const HeroText = ({ event = null }) => {
  const hasBar = Boolean(event?.announcementText);
  // With the bar showing, the video frame takes the bar's color/gradient (full opacity)
  const videoFrame = hasBar
    ? { background: announcementBackground({ ...event.announcementStyle, bgOpacity: 100 }) }
    : undefined;
  const videoRef = useRef(null);

  // The showreel is ~4MB. Start it only after the page has loaded so it
  // doesn't compete with the hero image, fonts and JS; the poster shows until then.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let idleId;
    let timer;

    const start = () => {
      // React doesn't reliably render `muted` on SSR'd video; autoplay needs it
      video.muted = true;
      // src is set here (not in the HTML) so nothing downloads before page load
      if (!video.getAttribute("src")) video.src = videoSrc(window.matchMedia("(max-width: 767px)").matches);
      video.play().catch(() => {});
    };
    const schedule = () => {
      if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(start, { timeout: 2000 });
      else timer = setTimeout(start, 200);
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      window.removeEventListener("load", schedule);
      if (idleId) window.cancelIdleCallback(idleId);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section
      className={`relative flex flex-col justify-center items-center min-h-[650px] sm:min-h-[750px] text-white overflow-hidden ${hasBar ? "pt-36 sm:pt-40" : "pt-28"} pb-16`}
    >
      <HeroBackground url={event?.backgroundUrl} />
      <div className="absolute inset-0 bg-black/60"></div>

      {event?.topLeftUrl && <HangingImage src={event.topLeftUrl} side="left" belowBar={hasBar} />}
      {event?.topRightUrl && <HangingImage src={event.topRightUrl} side="right" belowBar={hasBar} />}
      {hasBar && <AnnouncementBar text={event.announcementText} link={event.announcementLink} style={event.announcementStyle} />}

      {/* w-full: without it this column shrink-wraps its content, and the video has no
          intrinsic size until its media loads, so the whole hero jumped wider (layout shift) */}
      <div className="relative z-10 w-full text-center px-4 sm:px-8 max-w-5xl">
        <div className="mb-8 animate-hero-fade-up">
          {/* Main Animated Headline */}
          <h1
            className={`${urbanist.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.2] mb-3 text-white flex flex-wrap items-center justify-center gap-x-3`}
          >
            <span>Unlimited</span>
            <Typewriter gradient={event?.headlineGradient} />
          </h1>

          <h2
            className={`${urbanist.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-200 mt-2`}
          >
            One Scalable Subscription.
          </h2>
        </div>

        <div className="flex justify-center items-center animate-hero-fade-up [animation-delay:0.15s]">
          <div
            className={`mx-auto rounded-xl shadow-lg w-[90%] sm:w-[85%] md:w-[80%] lg:w-[75%] xl:w-[80%] ${
              videoFrame ? "p-[2px]" : "border-2 border-[#48A2FF]/40 overflow-hidden"
            }`}
            style={videoFrame}
          >
          <div className="relative">
          {/* Poster sits behind the video; a <video> with no frames yet is transparent */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cloudinaryImage(POSTER_URL, { width: 1280 })}
            srcSet={cloudinarySrcSet(POSTER_URL, [480, 640, 768, 960, 1280, 1536])}
            sizes={POSTER_SIZES}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            className={`absolute inset-0 w-full h-full object-cover ${videoFrame ? "rounded-[10px]" : ""}`}
          />
          <video
            ref={videoRef}
            preload="none"
            aria-label="AfterRender Introduction Video"
            controls
            muted
            loop
            controlsList="nodownload"
            playsInline
            width={1804}
            height={966}
            className={`relative block w-full h-auto ${videoFrame ? "rounded-[10px]" : ""}`}
            onPlay={(e) => {
              // User pressed play before the deferred start attached a source
              const video = e.currentTarget;
              if (!video.getAttribute("src")) {
                video.src = videoSrc(window.matchMedia("(max-width: 767px)").matches);
                video.play().catch(() => {});
              }
            }}
          />
          </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 animate-hero-fade-up [animation-delay:0.3s]">
          <BookACall offer={event?.offer} />
        </div>
      </div>
    </section>
  );
};

export default HeroText;
