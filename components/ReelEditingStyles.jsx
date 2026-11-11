"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
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

const styles = [
  {
    id: "short-v1",
    version: "V1",
    title: "Short Form",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788183664/Adam_reel-1_phvxsx.mp4",
    posterUrl: "/images/video-tn/one.png",
  },
  {
    id: "short-v2",
    version: "V2",
    title: "Short Form",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788183792/Matt_Short_03_jjo3qx.mp4",
    posterUrl: "/images/video-tn/two.png",
  },
  {
    id: "montage-v1",
    version: "V1",
    title: "Montage",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789481156/Reel_04_c8woob.mp4",
    posterUrl: "/images/montageposters/montage-poster3.png",
  },
];

const StyleCard = ({ item, onOpen }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      aria-label={`Play ${item.title} ${item.version}`}
      className="group relative shrink-0 snap-center w-[70vw] max-w-[280px] sm:w-auto sm:max-w-none aspect-[9/16] rounded-xl overflow-hidden bg-gray-200 cursor-pointer text-left"
    >
      {!loaded && <span aria-hidden="true" className="absolute inset-0 animate-pulse bg-black/[0.07]" />}
      <Image
        src={item.posterUrl}
        alt=""
        fill
        sizes="(max-width: 640px) 70vw, 260px"
        onLoad={() => setLoaded(true)}
        className={`object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
      <span className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black transition-transform duration-200 group-hover:scale-105">
          <Play className="h-5 w-5 fill-black ml-0.5" />
        </span>
      </span>

      <span className="absolute inset-x-0 bottom-0 block px-4 pb-4 pt-12 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
        <span className="block text-xs font-semibold uppercase tracking-wide text-[#7cc0ff]">
          {item.version}
        </span>
        <span className="block text-base font-semibold text-white leading-tight">{item.title}</span>
      </span>
    </button>
  );
};

const ReelEditingStyles = () => {
  const [selected, setSelected] = useState(null);

  // Lock page scroll and allow Esc to close while the video popup is open
  useEffect(() => {
    if (!selected) return;
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    const onKeyDown = (e) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  return (
    <section
      className={`${jakarta.className} relative bg-[#FAFAFA] text-black py-14 sm:py-20 overflow-hidden`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* Mobile: swipeable row with the next card peeking in. Tablet and up: 3-column grid. */}
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 scroll-px-4 pb-1 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible">
          {styles.map((item) => (
            <StyleCard key={item.id} item={item} onOpen={setSelected} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 overscroll-contain"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              // Fit a 9:16 box inside the screen: never wider than 24rem, never taller than 90% of the viewport
              style={{ width: "min(100%, 24rem, calc(90dvh * 9 / 16))" }}
              className="relative aspect-[9/16] bg-black rounded-xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/70 hover:bg-black text-white transition-colors cursor-pointer"
                aria-label="Close video player"
              >
                <X size={20} />
              </button>

              <video
                key={selected.videoUrl}
                src={selected.videoUrl}
                autoPlay
                controls
                controlsList="nodownload"
                disablePictureInPicture
                onContextMenu={(e) => e.preventDefault()}
                playsInline
                className="w-full h-full object-contain bg-black"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ReelEditingStyles;
