"use client";
import React, { useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";

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
        <div className="w-full bg-black py-20">
            <div className="mb-12 flex flex-col items-center text-center px-4">
                <h2 className="text-3xl md:text-5xl font-semibold text-transparent bg-clip-text bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] mb-4 uppercase tracking-tighter">
                    Graphic Design
                </h2>
                <p className="text-gray-400 max-w-xl">
                    A continuous stream of our latest creative work.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <div className="relative overflow-hidden mask-[linear-gradient(to_right,transparent_0,black_128px,black_calc(100%-128px),transparent_100%)]">

                    <motion.div
                        className="flex gap-6 w-max"
                        animate={controls}
                        // Optional: smoother feel on resume
                        whileHover={{ cursor: "grab" }}
                    >
                        {duplicatedThumbnails.map((item, index) => (
                            <div
                                key={`${item.id}-${index}`}
                                className="relative w-[280px] md:w-[400px] h-[180px] md:h-[250px] shrink-0 overflow-hidden rounded-lg border border-white/10 group"
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
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
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