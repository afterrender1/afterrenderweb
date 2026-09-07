"use client";
import React, { useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Urbanist, Playfair_Display } from "next/font/google";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const thumbnails = [
    { id: 1, thumbnail: "https://res.cloudinary.com/dlurrugno/image/upload/v1769169738/maxresdefault_cxnnxy.jpg", title: "Thumbnail 1" },
    { id: 2, thumbnail: "https://res.cloudinary.com/dlurrugno/image/upload/v1769169751/maxresdefault_1_k339yu.jpg", title: "Thumbnail 2" },
    { id: 3, thumbnail: "https://res.cloudinary.com/dlurrugno/image/upload/v1769169763/maxresdefault_2_bagvz7.jpg", title: "Thumbnail 3" },
    { id: 4, thumbnail: "https://res.cloudinary.com/dlurrugno/image/upload/v1769170007/maxresdefault_3_dxyoap.jpg", title: "Thumbnail 4" },
    { id: 5, thumbnail: "https://res.cloudinary.com/dlurrugno/image/upload/v1769170017/maxresdefault_4_f9wxnw.jpg", title: "Thumbnail 5" },
    // ... rest of your array
];

const MarqueeThumbnails = () => {
    const controls = useAnimationControls();

    // Triple for seamless loop
    const duplicatedThumbnails = [...thumbnails, ...thumbnails, ...thumbnails];

    useEffect(() => {
        controls.start({
            x: "-33.33%",
            transition: {
                duration: 25,
                ease: "linear",
                repeat: Infinity,
            },
        });
    }, [controls]);

    return (
        <div className="w-full bg-black py-10 sm:py-14">
            <div className="mb-6 sm:mb-8 flex flex-col items-center text-center px-4">
                <h2 className={`${urbanist.className} text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1.5 sm:mb-2 tracking-tight`}>
                    Graphic{" "}
                    <span className={`${playfair.className} italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#48A2FF] via-[#7EC0FF] to-[#C9E4FF]`}>
                        Design
                    </span>
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm max-w-lg">
                    A continuous stream of our latest creative work.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-2 sm:px-4">
                <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)] sm:[mask-image:linear-gradient(to_right,transparent,black_64px,black_calc(100%-64px),transparent)] md:[mask-image:linear-gradient(to_right,transparent,black_96px,black_calc(100%-96px),transparent)]">

                    <motion.div
                        className="flex gap-3.5 sm:gap-5 w-max"
                        animate={controls}
                        // Optional: smoother feel on resume
                        whileHover={{ cursor: "grab" }}
                    >
                        {duplicatedThumbnails.map((item, index) => (
                            <div
                                key={`${item.id}-${index}`}
                                className="relative w-[200px] xs:w-[240px] sm:w-[280px] lg:w-[320px] h-[120px] xs:h-[140px] sm:h-[165px] lg:h-[190px] shrink-0 overflow-hidden rounded-lg sm:rounded-xl border border-white/10 group"
                                onMouseEnter={() => controls.stop()}
                                onMouseLeave={() => controls.start({
                                    x: "-33.33%",
                                    transition: {
                                        duration: 25,
                                        ease: "linear",
                                        repeat: Infinity,
                                    },
                                })}
                            >
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default MarqueeThumbnails;