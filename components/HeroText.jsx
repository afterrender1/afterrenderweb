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

  const lines = [
    <>
      We will build you a{" "}
      <span className="text-transparent  bg-clip-text tracking-wider bg-linear-to-r from-[#48A2FF] to-[#C9E4FF]">
        Youtube organic
      </span>{" "}
      +{" "}
      <span className="text-transparent bg-clip-text tracking-wider bg-linear-to-r from-[#48A2FF] to-[#C9E4FF]">
        Paid
      </span>
    </>,
    <>
      ads funnel that will book you
      <span className="text-transparent bg-clip-text tracking-wider bg-linear-to-r from-[#48A2FF] to-[#C9E4FF]">
        {" "}
        20+ calls per{" "}
      </span>
    </>,
    <>
      <span className="text-transparent bg-clip-text tracking-wider bg-linear-to-r from-[#48A2FF] to-[#C9E4FF]">
        month.
      </span>{" "}
      if we don’t you don’t pay us
    </>,
  ];

  return (
    <section
      className="relative flex flex-col justify-center-safe items-center h-screen text-white transition-opacity duration-1000 ease-in-out overflow-hidden pt-8"
      style={{
        backgroundImage: showBackground ? "url('/images/hb1.png')" : "none",
        backgroundSize: "contain", // ensures full coverage
        backgroundPosition: "",
        backgroundRepeat: "no-repeat",
        opacity: showBackground ? 1 : 0.5,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div
        className="relative z-10 text-center px-4 sm:px-8 max-w-6xl"
        style={{ fontFamily: poppins.style.fontFamily }}
      >
        {/* === Animated Text === */}
        <motion.div
          className="font-bold mb-6 leading-tight text-[1.8rem] sm:text-[2rem] md:text-[2.3rem] lg:text-[2.7rem] xl:text-[3rem]"
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
      className="text-[1.6rem] sm:text-[1.6rem] md:text-[2rem] lg:text-[2.5rem] xl:text-[2.8rem]"
      variants={{
        hidden: { opacity: 0, filter: "blur(10px)", y: 40 },
        visible: {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          transition: { duration: 0.6, ease: "easeOut" },
        },
      }}
    >
      {line}
    </motion.p>
          ))}
        </motion.div>

        {/* === Video === */}
   <div className="flex justify-center items-center ">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative w-[90%] sm:w-[85%] md:w-[80%] lg:w-[75%] xl:w-[80%] rounded-xl overflow-hidden shadow-lg border-2 border-[#48A2FF]/40"
      >
        {/* YouTube Embed */}
        <iframe
          className="w-full aspect-video rounded-xl"
          src="https://www.youtube.com/embed/GO0Z7SW9U10?si=ynbd1J3dZv_gET1F&rel=0&modestbranding=1&showinfo=0"
          title="AfterRender Showcase Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        ></iframe>

        {/* optional: gradient overlay glow effect */}
        <div className="absolute inset-0 pointer-events-none bg-linear-to-r from-transparent via-[#48A2FF]/5 to-transparent"></div>
      </motion.div>
    </div>

        {/* === CTA Button === */}
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
