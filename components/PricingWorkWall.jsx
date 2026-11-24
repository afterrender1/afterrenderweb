"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Plus_Jakarta_Sans } from "@/app/lib/fonts";
import LoopVideo from "./LoopVideo";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Light 8-second loops straight from Cloudinary (all from Our Work), so nine videos can
// play at once even on slow connections: low quality, H.264, no audio.
// ~70–330 KB each instead of the 20–95 MB originals.
const CLOUDINARY_VIDEO = "https://res.cloudinary.com/dlurrugno/video/upload";
const CLIP = {
  portrait: { video: "du_8,q_auto:low,w_288,c_limit,vc_h264,ac_none", poster: "so_0,w_288,c_limit,q_auto" },
  landscape: { video: "du_8,q_auto:low,w_512,c_limit,vc_h264,ac_none", poster: "so_0,w_512,c_limit,q_auto" },
};

const VIDEOS = {
  gage: { id: "v1789471770/Gage_reel_1_qeemre", label: "Short form edit", orientation: "portrait" },
  horizon: { id: "v1789472470/Horizon_demo_pv00yc", label: "SaaS demo video", orientation: "landscape" },
  anthropic: { id: "v1788184812/Anthropic_reel_n76nlc", label: "Short form edit", orientation: "portrait" },
  han: { id: "v1789477840/Han_reel_1_ik1u7i", label: "Real estate reel", orientation: "portrait" },
  harel: { id: "v1789473496/Harel_g4s1bp", label: "Talking head edit", orientation: "landscape" },
  nade: { id: "v1788184788/Nade_reel-1_revise_ejrqar", label: "Short form edit", orientation: "portrait" },
  montage: { id: "v1789486847/Short_4_revise_o3a97r", label: "Montage edit", orientation: "portrait" },
  indulge: { id: "v1789471214/Indulge_spa_1_dtgdmm", label: "Short form edit", orientation: "portrait" },
  ali: { id: "v1789471166/Ali_reel_1_rev_rhealk", label: "Short form edit", orientation: "portrait" },
};

const Tile = ({ video, aspect }) => {
  const clip = CLIP[video.orientation];
  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl sm:rounded-2xl bg-gray-200 shadow-[0_1px_2px_rgba(16,24,40,0.06),0_14px_32px_-16px_rgba(16,24,40,0.3)] ${aspect}`}
    >
      <LoopVideo
        src={`${CLOUDINARY_VIDEO}/${clip.video}/${video.id}.mp4`}
        poster={`${CLOUDINARY_VIDEO}/${clip.poster}/${video.id}.jpg`}
        label={video.label}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
};

// Masonry wall of mixed portrait / landscape / square tiles with staggered column tops.
// md+: one row of 4 columns (the 3rd is double width). Phones: columns 1–2 side by side,
//   column 3 full width (landscape on top, two portraits below), column 4 as two squares.
// Top offsets on md+ are % of the row width, so the stagger scales with the screen.
const PricingWorkWall = () => {
  const gap = "gap-3 sm:gap-4";

  return (
    <section className={`${jakarta.className} relative bg-[#FAFAFA] text-black pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden`}>
      <h2 className="sr-only">Recent video edits</h2>

      <div className="flex justify-center mb-8 sm:mb-12">
        <Link
          href="/our-work"
          className="group inline-flex items-center gap-2 h-11 px-6 rounded-full bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] text-[#0A2540] text-sm font-bold shadow-[0_8px_22px_-8px_rgba(72,162,255,0.7)] transition-all duration-200 hover:shadow-[0_10px_26px_-8px_rgba(72,162,255,0.9)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
        >
          Show Me More!
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>

      <div className={`max-w-6xl mx-auto grid grid-cols-2 items-start ${gap} md:flex md:gap-4`}>
        {/* Column 1: tall reel + landscape */}
        <div className={`flex flex-col ${gap} mt-10 md:mt-[4.5%] md:flex-1 md:min-w-0`}>
          <Tile video={VIDEOS.gage} aspect="aspect-[9/16]" />
          <Tile video={VIDEOS.horizon} aspect="aspect-video" />
        </div>

        {/* Column 2: tall reel + square */}
        <div className={`flex flex-col ${gap} md:flex-1 md:min-w-0`}>
          <Tile video={VIDEOS.anthropic} aspect="aspect-[9/16]" />
          <Tile video={VIDEOS.han} aspect="aspect-square" />
        </div>

        {/* Column 3 (double width): landscape + two reels side by side */}
        <div className={`col-span-2 flex flex-col ${gap} md:flex-[2] md:min-w-0 md:mt-[2.2%]`}>
          <Tile video={VIDEOS.harel} aspect="aspect-video" />
          <div className={`grid grid-cols-2 ${gap}`}>
            <Tile video={VIDEOS.nade} aspect="aspect-[9/16]" />
            <Tile video={VIDEOS.montage} aspect="aspect-[9/16]" />
          </div>
        </div>

        {/* Column 4: two squares (side by side on phones) */}
        <div className={`col-span-2 grid grid-cols-2 ${gap} md:flex md:flex-col md:flex-1 md:min-w-0 md:mt-[6.7%]`}>
          <Tile video={VIDEOS.indulge} aspect="aspect-square" />
          <Tile video={VIDEOS.ali} aspect="aspect-square" />
        </div>
      </div>
    </section>
  );
};

export default PricingWorkWall;
