"use client";
import React, { useState } from "react";
import { cloudinaryImage, cloudinarySrcSet } from "@/app/lib/cloudinaryUrl";

// Live event background for the light-themed heroes (Our Work, Pricing).
// Sits at the very back of the section (the section needs `isolate`), starts at
// the top of the page so the fixed navbar floats over it, and is washed out with
// a light gradient so the dark hero text and navbar links stay readable.
const EventHeroBackdrop = ({ url }) => {
  const [failed, setFailed] = useState(false);
  if (!url || failed) return null;

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-30 pointer-events-none">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cloudinaryImage(url, { width: 1920 })}
        srcSet={cloudinarySrcSet(url, [640, 960, 1280, 1920, 2560])}
        sizes="100vw"
        alt=""
        fetchPriority="high"
        decoding="async"
        onError={() => setFailed(true)}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/55 via-[#FAFAFA]/80 to-[#FAFAFA]" />
    </div>
  );
};

export default EventHeroBackdrop;
