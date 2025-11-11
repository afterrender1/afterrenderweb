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

const SocialHeroText = () => {
  const [showBackground, setShowBackground] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowBackground(true), 1300);
    return () => clearTimeout(timer);
  }, []);


  const lines = [
    <>
    We’ll build your YouTube{" "}
      <span className="text-transparent  bg-clip-text tracking-wider bg-linear-to-r from-[#48A2FF] to-[#C9E4FF]">
       YouTube growth funnel—organic
      </span>{" "}
      +{" "}
      <span className="text-transparent bg-clip-text tracking-wider bg-linear-to-r from-[#48A2FF] to-[#C9E4FF]">
        social media presence
      </span>
    </>,
    <>
     to help you reach your maximum potential
      <span className="text-transparent bg-clip-text tracking-wider bg-linear-to-r from-[#48A2FF] to-[#C9E4FF]">
        {" "}
        . if we don’t deliver,{" "} you don’t pay us.
      </span>
    </>,
    <>
     
     
    </>,
  ];


  return (
    <section
      className="relative flex flex-col justify-center-safe items-center h-screen text-white transition-opacity duration-1000 ease-in-out overflow-hidden"
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
      className="text-[1.6rem] sm:text-[1.6rem] md:text-[2rem] lg:text-[2.5rem] xl:text-[2.5rem]"
      variants={{
        hidden: { opacity: 0, filter: "blur(10px)", y: 40 },
        visible: {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          transition: { duration: 0.5, ease: "easeOut" },
        },
      }}
    >
      {line}
    </motion.p>
          ))}
        </motion.div>

        {/* === Video === */}
        <motion.video
          loading="lazy"
          poster="/images/arposter.png"
          controls
         autoPlay = {false}
          muted ={false}
          loop={false}
          playsInline
          className="mx-auto rounded-xl shadow-lg border-2 border-[#48A2FF]/40 w-[90%] sm:w-[85%] md:w-[80%] lg:w-[75%] xl:w-[70%] h-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <source src="/videos/saas.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </motion.video>

        {/* === CTA Button === */}
       
      </div>
    </section>
  );
};

export default SocialHeroText;
