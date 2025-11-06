import React from "react";
import { Poppins, Montserrat } from "next/font/google";
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
  return (
    <section
      className="h-screen flex pt-32 justify-center bg-no-repeat bg-center relative"
      style={{
        backgroundImage: "url('/images/hb1.png')",
        backgroundSize: "88%",
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

        {/* YouTube Logo */}
      
        {/* Video */}
        <video
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
          <div>
        <BookACall />
      </div>
      </div>

    
    </section>
  );
};

export default HeroText;
