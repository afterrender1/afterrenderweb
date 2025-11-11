"use client";
import React from "react";

const videos = [
  {
    title: "Client Testimonial 1",
    src: "https://www.youtube.com/embed/rHfibRZisjI?si=mut7J4LlonzKkbPm",
  },
  {
    title: "Client Testimonial 2",
    src: "https://www.youtube.com/embed/5q1njhBzdF0?si=zHVOFtJlPNdw30iq",
  },
  {
    title: "Client Testimonial 3",
    src: "https://www.youtube.com/embed/lpKpHIhXdy0?si=P2G7138KwbSQz4NM",
  },
];

const VideoCard = ({ src, title }) => {
  return (
    <div className="relative group h-full">
      {/* Card Container */}
      <div className="relative bg-white/5 rounded-3xl p-4 border border-gray-800/50 h-full overflow-hidden flex flex-col justify-between hover:shadow-[0_0_25px_rgba(72,162,255,0.4)] transition-all duration-300">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-all duration-300"
          style={{ backgroundImage: "url('/images/herobg.png')" }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-black/60 via-black/40 to-transparent z-0 rounded-3xl"></div>

        {/* Video */}
        <div className="relative z-10 rounded-2xl overflow-hidden shadow-lg">
          <div className="relative pb-[56.25%]">
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
        <h3 className="relative z-10 text-white text-xl font-semibold text-center mt-4">
          {title}
        </h3>
      </div>
    </div>
  );
};

const VideoTestimonials = () => {
  return (
    <div className="relative min-h-screen bg-black py-20 px-4 overflow-hidden">
      {/* Background Layers */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/images/herobg.png')" }}
      ></div>
      <div className="absolute inset-0 bg-linear-to-b from-black via-black/90 to-black z-0"></div>

      {/* Header */}
      <div className="relative z-10 text-center mb-20">
        <p className="text-white text-sm tracking-wider mb-4 rounded-full px-3 py-1 inline-block border border-gray-600">
          Client Stories
        </p>
        <h2
          className="text-2xl md:text-[2.8rem] font-bold text-white mb-4"
          style={{ fontFamily: "poppins" }}
        >
          See what our{" "}
          <span
            className="text-transparent bg-clip-text tracking-wider bg-linear-to-r from-[#48A2FF] to-[#C9E4FF]"
            style={{ fontFamily: "michroma" }}
          >
            clients say
          </span>
        </h2>
        <p className="text-gray-400 text-lg">
          Real people. Real results. Real transformations.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        {videos.map((video, i) => (
          <VideoCard key={i} src={video.src} title={video.title} />
        ))}
      </div>
    </div>
  );
};

export default VideoTestimonials;
