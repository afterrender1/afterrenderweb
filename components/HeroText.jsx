"use client";
import React, { useState, useEffect } from "react";
import { Poppins, Montserrat } from "next/font/google";
import BookACall from "./BookACall";
import { motion } from "framer-motion";

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
    const timer = setTimeout(() => setShowBackground(true), 600); // show after 3s
    return () => clearTimeout(timer);
  }, []);

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

      {/* Content Box */}
      <div
        className="relative text-center text-white max-w-5xl px-4"
        style={{ fontFamily: "poppins" }}
      >
        <h1 className="text-[2.8rem] font-bold mb-6 leading-tight">
          We will build you a{" "}
          <span className="text-[#48A2FF]">Youtube organic</span> +{" "}
          <span className="text-[#48A2FF]">Paid</span> ads funnel that will book
          you{" "}
          <span className="text-[#48A2FF]">20+ calls per month.</span> if we
          don’t you don’t pay us
        </h1>

        {/* Video */}
        <video
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

        <motion.div className="mt-10" initial={{ opacity: 0 , y : 12 }} animate={{ opacity: 1 , y : 0 }} transition={{ duration: 1, delay: 1 }}>
          <BookACall />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroText;
