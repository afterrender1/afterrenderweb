"use client";
import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Play } from "lucide-react";

// If the video hasn't started playing by then (slow network), show the page
const START_TIMEOUT_MS = 8000;
const FADE_MS = 700;

// Phones get the portrait cut; matches the `md` breakpoint used across the site
const MOBILE_QUERY = "(max-width: 767px)";

const noopSubscribe = () => () => {};
// false during SSR and before hydration, true once React runs in the browser
const useHydrated = () => useSyncExternalStore(noopSubscribe, () => true, () => false);

// Fullscreen muted intro that plays once over the page, then fades away.
// Rendered on the server too, so the page never flashes before the video.
// The source is picked on the client, so only the video for this screen is downloaded.
const WebsiteIntroVideo = ({ src, mobileSrc = src }) => {
  const videoRef = useRef(null);
  const startTimer = useRef(null);
  const hydrated = useHydrated();
  // playing -> leaving (fade out) -> done (unmounted)
  // blocked = the browser refused autoplay (iOS Low Power Mode, data saver): wait for a tap
  const [phase, setPhase] = useState("playing");

  const finish = useCallback(() => {
    clearTimeout(startTimer.current);
    setPhase((p) => (p === "playing" || p === "blocked" ? "leaving" : p));
  }, []);

  const tryPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().then(
      () => setPhase((p) => (p === "blocked" ? "playing" : p)),
      (err) => {
        // A newer load/play replaced this one (e.g. React StrictMode re-running the effect); not a failure
        if (err?.name === "AbortError") return;
        if (err?.name === "NotAllowedError") {
          // Autoplay blocked: keep the intro and ask for a tap instead of silently skipping it
          clearTimeout(startTimer.current);
          setPhase((p) => (p === "playing" ? "blocked" : p));
        } else {
          finish();
        }
      }
    );
  }, [finish]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Mobile browsers (iOS especially) only autoplay when these are real attributes;
    // React sets `muted` as a property only, so add them by hand before loading
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    // Only load once: setting src again (StrictMode runs effects twice in dev) restarts the video
    // and aborts the pending play()
    if (!video.getAttribute("src")) {
      video.src = window.matchMedia(MOBILE_QUERY).matches ? mobileSrc : src;
      video.load();
    }
    tryPlay();
    startTimer.current = setTimeout(finish, START_TIMEOUT_MS);
    return () => clearTimeout(startTimer.current);
  }, [finish, tryPlay, src, mobileSrc]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const t = setTimeout(() => setPhase("done"), FADE_MS);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black overscroll-none touch-none transition-opacity ease-out ${
        phase === "leaving" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        transitionDuration: `${FADE_MS}ms`,
        // Safety net if the page's JS never loads: the intro removes itself after 12s instead of covering the page
        animation: hydrated ? undefined : "ar-intro-fallback 0.6s ease-out 12s forwards",
      }}
    >
      <style>
        {"@keyframes ar-intro-fallback{to{opacity:0;visibility:hidden;pointer-events:none}}" +
          // Lock page scroll while the intro is on screen (only once JS can also unlock it)
          // <html> only: hiding <body> overflow makes it a scroll container and breaks sticky sections
          (hydrated ? "html{overflow:hidden!important;}" : "")}
      </style>
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        onPlaying={() => clearTimeout(startTimer.current)}
        onEnded={finish}
        onError={finish}
        className="w-full h-full object-cover"
      />

      {phase === "blocked" && (
        <button
          type="button"
          onClick={tryPlay}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white cursor-pointer"
          aria-label="Play intro video"
        >
          <span className="flex items-center justify-center w-16 h-16 rounded-full bg-white/15 backdrop-blur-md border border-white/25">
            <Play size={26} fill="currentColor" className="ml-1" />
          </span>
          <span className="text-sm font-semibold tracking-wide">Tap to play</span>
        </button>
      )}

      <button
        type="button"
        onClick={finish}
        className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 sm:bottom-6 sm:right-6 h-10 sm:h-9 px-5 sm:px-4 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs font-semibold tracking-wide border border-white/20 transition-colors cursor-pointer"
      >
        Skip
      </button>
    </div>
  );
};

export default WebsiteIntroVideo;
