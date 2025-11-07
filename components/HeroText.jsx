"use client";
import React, { useState, useEffect } from "react";
import { Poppins, Montserrat } from "next/font/google";
import { motion } from "framer-motion";
import BookACall from "./BookACall";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400"],
});

const HeroText = () => {
  const [showBackground, setShowBackground] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowBackground(true), 1300);
    return () => clearTimeout(timer);
  }, []);

  // lines for animated blur text
  const lines = [
    <>
      We will build you a{" "}
      <span className="text-[#48A2FF]">Youtube organic</span> +{" "}
      <span className="text-[#48A2FF]">Paid</span>
    </>,
    <>
      ads funnel that will book you 
      <span className="text-[#48A2FF]"> 20+ calls per month.</span>
    </>,
    <>if we don’t you don’t pay us</>,
  ];

  return (
    <section
      className="h-screen flex pt-32 justify-center bg-no-repeat bg-center relative transition-opacity duration-1000 ease-in-out"
      style={{
        backgroundImage: showBackground ? "url('/images/hb1.png')" : "none",
        backgroundSize: "88%",
        opacity: showBackground ? 1 : 0.5,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div
        className="relative text-center text-white max-w-6xl px-4"
        style={{ fontFamily: "poppins" }}
      >
        {/* === Animated Blur Heading === */}
        <motion.div
          className="text-[2.6rem] font-bold mb-6 leading-tight "
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.4 } },
          }}
        >
          {lines.map((line, i) => (
            <motion.p
              key={i}
              variants={{
                hidden: { opacity: 0, filter: "blur(10px)", y: 40 },
                visible: {
                  opacity: 1,
                  filter: "blur(0px)",
                  y: 0,
                  transition: { duration: 0.9, ease: "easeOut" },
                },
              }}
            >
              {line}
            </motion.p>
          ))}
        </motion.div>

        {/* === Video === */}
        <video
          loading="lazy"
          controls
          autoPlay
          loop
          muted
          playsInline
          className="mx-auto rounded-xl shadow-lg border-2 border-[#48A2FF]/40"
          style={{ width: "80%", height: "auto" }}
        >
          <source src="/videos/saasarvideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* === Button === */}
        <motion.div
          className="mt-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <BookACall />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroText;
