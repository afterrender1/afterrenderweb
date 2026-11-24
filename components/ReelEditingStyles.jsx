"use client";

import React, { useEffect, useRef } from "react";
import { Plus_Jakarta_Sans, Playfair_Display } from "@/app/lib/fonts";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "600", "700"],
});

// Light versions straight from Cloudinary so the reels start almost instantly:
// 360px wide, low quality, H.264 (plays everywhere), audio stripped (they play muted).
// ~0.6–1.4 MB each instead of the 30–80 MB originals.
const CLOUDINARY_VIDEO = "https://res.cloudinary.com/dlurrugno/video/upload";
const LIGHT_VIDEO = "q_auto:low,w_360,c_limit,vc_h264,ac_none";
const videoSrc = (id) => `${CLOUDINARY_VIDEO}/${LIGHT_VIDEO}/${id}.mp4`;
// First frame as a ~20 KB poster, shown until the video is playing
const posterSrc = (id) => `${CLOUDINARY_VIDEO}/so_0,w_360,c_limit,q_auto/${id}.jpg`;

// Staggered layout like the reference: mixed card sizes, some dropped lower.
// Phones: 2×2 grid with the right column shifted down. sm+: one row; widths and
// top offsets are % of the row width so the composition scales with the screen.
const reels = [
  {
    id: "v1788183664/Adam_reel-1_phvxsx",
    label: "Short Form V1",
    layout: "sm:w-[23.3%]",
  },
  {
    id: "v1788183792/Matt_Short_03_jjo3qx",
    label: "Short Form V2",
    layout: "translate-y-10 sm:translate-y-0 sm:w-[21.5%] sm:mt-[7.8%]",
  },
  {
    id: "v1789481156/Reel_04_c8woob",
    label: "Montage",
    layout: "sm:w-[23.7%]",
  },
  // From Our Work (What We Create → Motion Graphics & B-Roll)
  {
    id: "v1788184449/Reel-1_pxvgud",
    label: "Motion Graphics & B-Roll",
    layout: "translate-y-10 sm:translate-y-0 sm:w-[25.2%] sm:mt-[3.2%]",
  },
];

// Muted, looping, inline autoplay. The source is attached only when the card comes near
// the viewport (so it doesn't compete with the hero), and it pauses while off screen.
function LoopVideo({ id, label }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // React doesn't reliably render the `muted` attribute; browsers only autoplay muted video
    video.muted = true;
    video.defaultMuted = true;

    // Source is set here (not as a prop) so nothing downloads before it's needed
    const start = () => {
      if (!video.getAttribute("src")) video.src = videoSrc(id);
      video.play()?.catch(() => {}); // blocked (e.g. low-power mode): the poster stays
    };

    if (typeof IntersectionObserver === "undefined") {
      start();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : video.pause()),
      { rootMargin: "300px 0px" }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [id]);

  return (
    <video
      ref={ref}
      poster={posterSrc(id)}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      disableRemotePlayback
      controlsList="nodownload"
      onContextMenu={(e) => e.preventDefault()}
      aria-label={`${label} reel`}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

const ReelEditingStyles = () => {
  return (
    <section
      className={`${jakarta.className} relative bg-[#FAFAFA] text-black py-14 sm:py-20 overflow-hidden`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">
            Editing Styles
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
            <span>Take Your Pick From Our 3 </span>
            <span className={`${playfair.className} italic font-normal text-gray-900`}>
              Reel Editing Styles
            </span>
          </h2>

          <p className="mt-4 mx-auto max-w-2xl text-gray-600 text-sm sm:text-base leading-relaxed">
            Choose your vibe and we&apos;ll bring your content to life. With our pro team on the
            job for less than $8 a day, you&apos;ll be the talk of the town, without lifting a
            finger.
          </p>
        </div>

        {/* Phones: 2×2 (pb leaves room for the shifted right column). sm+: staggered row. */}
        <div className="grid grid-cols-2 gap-3 pb-10 sm:pb-0 sm:flex sm:items-start sm:justify-center sm:gap-[2.1%]">
          {reels.map((reel) => (
            <div
              key={reel.id}
              className={`relative aspect-[9/16] min-w-0 overflow-hidden rounded-2xl sm:rounded-[18px] bg-gray-200 shadow-[0_1px_2px_rgba(16,24,40,0.06),0_16px_36px_-16px_rgba(16,24,40,0.3)] ${reel.layout}`}
            >
              <LoopVideo id={reel.id} label={reel.label} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReelEditingStyles;
