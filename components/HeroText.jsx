"use client";
import React, { useState, useEffect } from "react";
import { Urbanist, Playfair_Display } from "next/font/google";
import { motion } from "framer-motion";
import BookACall from "./BookACall";

export const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-urbanist",
  display: "swap",
});

export const editorialSerif = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const words = ["Video Edits", "Graphic Design"];

const HeroText = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect logic
  useEffect(() => {
    const targetWord = words[currentWordIndex];
    const typingSpeed = isDeleting ? 40 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        setCurrentText(targetWord.substring(0, currentText.length + 1));

        // When full word is typed, pause before deleting
        if (currentText === targetWord) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        setCurrentText(targetWord.substring(0, currentText.length - 1));

        // When word is fully deleted, move to next word
        if (currentText === "") {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex]);

  return (
    <section
      className="relative flex flex-col justify-center items-center min-h-[650px] sm:min-h-[750px] text-white overflow-hidden pt-28 pb-16 bg-center bg-contain bg-no-repeat"
      style={{
        backgroundImage: "url('/images/hb1.png')",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 text-center px-4 sm:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-8"
        >
          {/* Main Animated Headline */}
          <h1
            className={`${urbanist.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.2] mb-3 text-white flex flex-wrap items-center justify-center gap-x-3`}
          >
            <span>Unlimited</span>
            <span
              className={`${editorialSerif.className} italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#48A2FF] via-[#7EC0FF] to-[#C9E4FF] tracking-normal inline-flex items-center min-h-[1.2em]`}
            >
              {currentText}
              <span className="inline-block w-[1.5px] sm:w-[2px] h-[0.9em] bg-white/70 ml-1.5 align-middle animate-pulse" />
            </span>
          </h1>

          <h2
            className={`${urbanist.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-200 mt-2`}
          >
            One Scalable Subscription.
          </h2>
        </motion.div>

        <div className="flex justify-center items-center ">
          <motion.video
            poster="https://res.cloudinary.com/dlurrugno/image/upload/f_auto,q_auto,w_900/v1770043205/mainvposter_mw1d20.png"
            preload="none"
            aria-label="AfterRender Introduction Video"
            controls
            autoPlay={false}
            muted={false}
            loop={false}
            playsInline
            className="mx-auto rounded-xl shadow-lg border-2 border-[#48A2FF]/40 w-[90%] sm:w-[85%] md:w-[80%] lg:w-[75%] xl:w-[70%] h-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <source src="https://res.cloudinary.com/dlurrugno/video/upload/v1770041503/mainintrovideo_m2pujs.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </motion.video>
        </div>

        <motion.div
          className="mt-4 sm:mt-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
        >
          <BookACall />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroText;
