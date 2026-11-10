"use client";

import React, { useState } from "react";
import { Play } from "lucide-react";

// Pulls the 11-char video id out of any YouTube link or embed code
// (watch?v=, youtu.be/, /embed/, /shorts/, or a full <iframe> snippet).
const getYouTubeId = (url = "") => {
  const match = url.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : "";
};

// Direct files use the native video player. YouTube loads its iframe only on click.
const AiAvatarsVideo = ({ url, title = "AI Avatars video", poster }) => {
  const source = typeof url === "string" ? url.trim() : "";
  const videoId = getYouTubeId(source);
  const [playing, setPlaying] = useState(false);
  const [thumb, setThumb] = useState("maxresdefault");

  if (!source) return null;

  return (
    <div className="relative w-full rounded-2xl sm:rounded-[22px] bg-white p-1.5 sm:p-2 border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_50px_-20px_rgba(15,23,42,0.28)]">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl sm:rounded-2xl bg-zinc-900">
        {!videoId ? (
          <video
            key={source}
            src={source}
            poster={poster}
            autoPlay
            controls
            playsInline
            controlsList="nodownload"
            loop
            muted
            preload="metadata"
            aria-label={title}
            className="absolute inset-0 h-full w-full bg-black object-contain"
          >
            Your browser does not support video playback. <a href={source}>Open video</a>.
          </video>
        ) : playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title}`}
            className="group absolute inset-0 h-full w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#48A2FF]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${videoId}/${thumb}.jpg`}
              alt=""
              decoding="async"
              // HD thumbnail isn't generated for every video; fall back to the one that always exists
              onError={() => thumb !== "hqdefault" && setThumb("hqdefault")}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-black/10" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-14 w-14 sm:h-[72px] sm:w-[72px] items-center justify-center rounded-full bg-white/95 text-[#0A2540] shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-110 group-active:scale-95 motion-reduce:transition-none">
              <Play size={24} className="ml-1 fill-current sm:hidden" />
              <Play size={28} className="ml-1 fill-current hidden sm:block" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AiAvatarsVideo;
