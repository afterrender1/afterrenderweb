"use client";
import React from "react";
import Image from "next/image";

const videos = [
  {
    number: "1",
    title: "Client Testimonial 1",
    src: "https://www.youtube.com/embed/HBa1FugVjfU?si=rtyxydfZDymImvNE",
  },
];

const VideoCard = ({ src, title, number }) => {
  return (
    <div className="relative group flex flex-col items-center max-w-xl w-full">
      {/* Number Badge */}
     
      {/* Card */}
      <div className="relative bg-white/5 rounded-3xl p-6 sm:p-8 border border-gray-800/50 overflow-hidden flex flex-col justify-between transition-all duration-500 transform hover:scale-[1.03] mt-8 w-full">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-all duration-300"
          style={{ backgroundImage: "url('/images/herobg.png')" }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-black/70 via-black/50 to-transparent z-0 rounded-3xl"></div>

        {/* Video */}
        <div className="relative z-10 rounded-2xl overflow-hidden shadow-lg">
          <div className="relative pb-[60%]">
            <iframe
              loading="lazy"
              className="absolute top-0 left-0 w-full h-full rounded-2xl"
              src={src}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Title */}
        <h3
          className="relative z-10 text-white text-xl sm:text-2xl font-semibold text-center mt-6 sm:mt-8"
          style={{ fontFamily: "poppins" }}
        >
          {title}
        </h3>
      </div>
    </div>
  );
};

const VideoTestimonials = () => {
  return (
    <section className="relative bg-black py-20 sm:py-28 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/images/herobg.png')" }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-black via-black/90 to-black z-0"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-9xl mx-auto px-4 sm:px-8 md:px-12 lg:px-20">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-24">
          <p className="text-white text-sm tracking-wider mb-4 rounded-full px-3 py-1 inline-block border border-gray-600">
            Video Testimonials
          </p>
          <h2
            className="text-3xl md:text-[3.2rem] font-bold text-white mb-4"
            style={{ fontFamily: "poppins" }}
          >
            Hear from our{" "}
            <span
              className="text-transparent bg-clip-text tracking-wider bg-linear-to-r from-[#48A2FF] to-[#C9E4FF]"
              style={{ fontFamily: "michroma" }}
            >
              happy clients
            </span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl">
            Real stories. Real experiences. Real satisfaction.
          </p>
        </div>

        {/* Cards Centered */}
        <div className="flex justify-center">
          {videos.map((video, i) => (
            <VideoCard
              key={i}
              src={video.src}
              title={video.title}
              number={video.number}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoTestimonials;
