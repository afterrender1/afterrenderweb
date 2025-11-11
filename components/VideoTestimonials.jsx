"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const heroVideos = [
  { src: "https://www.youtube.com/embed/rHfibRZisjI?si=mut7J4LlonzKkbPm", title: "Modern Tailoring", subtitle: "Sharp. Confident. Effortless." },
  { src: "https://www.youtube.com/embed/5q1njhBzdF0?si=zHVOFtJlPNdw30iq", title: "Urban Edge", subtitle: "For the man who leads the way." },
  { src: "https://www.youtube.com/embed/lpKpHIhXdy0?si=P2G7138KwbSQz4NM", title: "Classic Revival", subtitle: "Timeless fits, redefined." },
];

const bottomVideos = [
  { src: "https://www.youtube.com/embed/rHfibRZisjI?si=mut7J4LlonzKkbPm", title: "Testimonial 1" },
  { src: "https://www.youtube.com/embed/5q1njhBzdF0?si=zHVOFtJlPNdw30iq", title: "Testimonial 2" },
  { src: "https://www.youtube.com/embed/lpKpHIhXdy0?si=P2G7138KwbSQz4NM", title: "Testimonial 3" },
];

const HeroVideoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev === heroVideos.length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? heroVideos.length - 1 : prev - 1));

  return (
    <>
    <div>
        <div className="flex items-center justify-center gap-2 mt-10 mb-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white" style={{fontFamily : "poppins"}}>What Our <span className="text-4xl md:text-5xl mb-4 font-bold lg:text-[2.8rem] text-transparent bg-clip-text tracking-wider bg-linear-to-r from-[#48A2FF] to-[#C9E4FF]">Clients</span> Say</h2>
        </div>
        <p className="text-center text-gray-300 mb-10 px-4 sm:px-0" style={{fontFamily : "poppins"}}>Discover how we've transformed brands with our video expertise</p>
    </div>
    <section className="w-full">
      {/* HERO CAROUSEL */}
      <div className="relative hidden  h-[90vh] sm:h-[80vh] xs:h-[60vh] lg:flex items-center justify-center overflow-hidden bg-black">
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
                <div className="rounded-2xl overflow-hidden shadow-lg w-[90vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] h-[50vh] sm:h-[60vh] md:h-[70vh]">
                  <iframe
                  loading="lazy"
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
      </div>

      {/* BOTTOM VIDEOS - 3 COLUMNS */}
      <div className="py-16 px-4 sm:px-10 lg:hidden ">
        <h2 className="text-3xl sm:text-4xl md:text-5xl text-center font-bold mb-10">
          Video Testimonials
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
          {bottomVideos.map((video, idx) => (
            <div key={idx} className="w-full rounded-2xl overflow-hidden shadow-lg">
              <div className="relative pb-[56.25%]">
                <iframe
                loading="lazy"
                  className="absolute top-0 left-0 w-full h-full"
                  src={video.src}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              {/* <p className="text-center mt-2 font-semibold text-gray-800">{video.title}</p> */}
            </div>
          ))}
        </div>
      </div>
    </section>
    </>

  );
};

export default HeroVideoCarousel;
