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

const ReelEditingStyles = () => {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (e) => e.key === "Escape" && setSelected(null);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  return (
    <section
      className={`${jakarta.className} relative bg-[#FAFAFA] text-black py-14 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden`}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#48A2FF] inline-block" />
            <span>Editing Styles</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
            <span>Take Your Pick From Our 3 </span>
            <span className={`${playfair.className} italic font-normal text-gray-900`}>
              Reel Editing Styles
            </span>
          </h2>

          <p className="mt-4 mx-auto max-w-2xl text-gray-600 text-sm sm:text-[15px] leading-relaxed font-medium">
            Choose your vibe and we&apos;ll bring your content to life. With our pro team on the
            job for less than $8 a day, you&apos;ll be the talk of the town, without lifting a
            finger.
          </p>
        </motion.div>

        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {styles.map((item, index) => (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setSelected(item)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              aria-label={`Play ${item.title} ${item.version}`}
              className="group relative shrink-0 w-[68%] sm:w-auto snap-center aspect-[9/16] rounded-2xl overflow-hidden bg-gray-950 border border-gray-200/80 shadow-[0_6px_20px_rgba(0,0,0,0.08)] hover:border-[#48A2FF]/50 hover:shadow-[0_12px_32px_rgba(72,162,255,0.2)] transition-all duration-300 hover:-translate-y-1 cursor-pointer text-left"
            >
              <Image
                src={item.posterUrl}
                alt={`${item.title} ${item.version}`}
                fill
                sizes="(max-width: 640px) 68vw, 260px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] flex items-center justify-center shadow-[0_4px_16px_rgba(72,162,255,0.45)] group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-5 h-5 fill-[#0A2540] text-[#0A2540] ml-0.5" />
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-12 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#48A2FF]">
                  {item.version}
                </span>
                <p className="text-white text-base font-bold leading-tight">{item.title}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm max-h-[90vh] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/15"
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 z-30 p-2.5 rounded-full bg-black/70 hover:bg-black text-white hover:text-[#48A2FF] transition-colors cursor-pointer border border-white/20 backdrop-blur-md"
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
