"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const heroVideos = [
  { src: "https://www.youtube.com/embed/rHfibRZisjI?si=mut7J4LlonzKkbPm", title: "Modern Tailoring", subtitle: "Sharp. Confident. Effortless." },
  { src: "https://www.youtube.com/embed/5q1njhBzdF0?si=zHVOFtJlPNdw30iq", title: "Urban Edge", subtitle: "For the man who leads the way." },
  { src: "https://www.youtube.com/embed/lpKpHIhXdy0?si=P2G7138KwbSQz4NM", title: "Classic Revival", subtitle: "Timeless fits, redefined." },
];

const HeroVideoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev === heroVideos.length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? heroVideos.length - 1 : prev - 1));

  return (
    <section className="relative h-[90vh] sm:h-[80vh] xs:h-[60vh] flex items-center justify-center overflow-hidden bg-black">
      <div className="relative w-full h-full flex items-center justify-center">
        {heroVideos.map((video, idx) => {
          const isActive = idx === currentIndex;
          const isPrev = idx === (currentIndex - 1 + heroVideos.length) % heroVideos.length;
          const isNext = idx === (currentIndex + 1) % heroVideos.length;

          return (
            <div
              key={idx}
              className={`absolute transition-all duration-700 ease-in-out ${
                isActive
                  ? "z-20 scale-100 opacity-100"
                  : isPrev || isNext
                  ? "z-10 scale-90 opacity-20"
                  : "z-0 scale-75 opacity-0"
              }`}
              style={{
                transform: isActive
                  ? "translateX(0)"
                  : isPrev
                  ? "translateX(-40%)"
                  : isNext
                  ? "translateX(40%)"
                  : "translateX(0)",
              }}
            >
              <div className="rounded-2xl overflow-hidden shadow-lg w-[80vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] h-[50vh] sm:h-[60vh] md:h-[70vh]">
                <iframe
                  className="w-full h-full border-2 rounded-2xl"
                  src={video.src}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hero Text */}
      {/* <div className="absolute bottom-12 sm:bottom-16 z-30 text-center text-white px-4 sm:px-6 max-w-5xl mx-auto">
        <p className="text-xs sm:text-sm md:text-base lg:text-lg uppercase mb-2 flex items-center justify-center gap-2 opacity-90">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" /> The New Gentleman Edit
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-light mb-2 drop-shadow-lg">
          {heroVideos[currentIndex].title}
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl">{heroVideos[currentIndex].subtitle}</p>
      </div> */}

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-10 top-1/2 -translate-y-1/2 backdrop-blur-xl p-3 sm:p-6 rounded-full hover:scale-110 cursor-pointer transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.2)] z-40"
      >
        <ChevronLeft className="w-5 sm:w-8 h-5 sm:h-8 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-10 top-1/2 -translate-y-1/2 backdrop-blur-xl p-3 sm:p-6 rounded-full hover:scale-110 cursor-pointer transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.2)] z-40"
      >
        <ChevronRight className="w-5 sm:w-8 h-5 sm:h-8 text-white" />
      </button>
    </section>
  );
};

export default HeroVideoCarousel;
