"use client";

import React, { useEffect, useRef } from "react";

// Muted, looping, inline autoplay video for showcase grids (no controls, no click action).
// - Download starts a little before the video scrolls into view (never competes with the hero).
// - It only plays (decodes) while actually on screen, so phones never decode a whole grid at
//   once; off screen it pauses.
// - The poster shows until it's playing.
export default function LoopVideo({ src, poster, label, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // React doesn't reliably render the `muted` attribute; browsers only autoplay muted video
    video.muted = true;
    video.defaultMuted = true;

    // Source is set here (not as a prop) so nothing downloads before it's needed.
    // Near the viewport only the header is fetched ("metadata"); the full clip downloads
    // once it's on screen, so on slow connections visible videos get the bandwidth first.
    const load = (level) => {
      if (video.getAttribute("src") !== src) {
        video.preload = level;
        video.src = src;
      } else if (level === "auto") {
        video.preload = "auto";
      }
    };
    const play = () => {
      load("auto");
      video.play()?.catch(() => {}); // blocked (e.g. low-power mode) or paused again: poster stays
    };

    if (typeof IntersectionObserver === "undefined") {
      play();
      return;
    }
    const preload = new IntersectionObserver(([entry]) => entry.isIntersecting && load("metadata"), {
      rootMargin: "300px 0px",
    });
    // Play only after it has stayed on screen briefly: scrolling past (the site uses smooth
    // scrolling, so every section flashes by) shouldn't start full downloads that would
    // steal bandwidth from the videos the visitor is actually looking at.
    let dwell;
    const onScreen = new IntersectionObserver(([entry]) => {
      clearTimeout(dwell);
      if (entry.isIntersecting) dwell = setTimeout(play, 200);
      else video.pause();
    });
    preload.observe(video);
    onScreen.observe(video);
    return () => {
      clearTimeout(dwell);
      preload.disconnect();
      onScreen.disconnect();
    };
  }, [src]);

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      disableRemotePlayback
      controlsList="nodownload"
      onContextMenu={(e) => e.preventDefault()}
      aria-label={label}
      className={className}
    />
  );
}
