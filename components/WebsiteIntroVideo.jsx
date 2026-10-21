"use client";
import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Play } from "lucide-react";

const START_TIMEOUT_MS = 8000;
const FADE_MS = 700;

const MOBILE_QUERY = "(max-width: 767px)";

const noopSubscribe = () => () => {};
const useHydrated = () => useSyncExternalStore(noopSubscribe, () => true, () => false);

const WebsiteIntroVideo = ({ src, mobileSrc = src }) => {
  const videoRef = useRef(null);
  const startTimer = useRef(null);
  const hydrated = useHydrated();
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
        if (err?.name === "AbortError") return;
        if (err?.name === "NotAllowedError") {
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
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
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
        animation: hydrated ? undefined : "ar-intro-fallback 0.6s ease-out 12s forwards",
      }}
    >
      <style>
        {"@keyframes ar-intro-fallback{to{opacity:0;visibility:hidden;pointer-events:none}}" +
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
