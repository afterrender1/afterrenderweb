"use client";
import React, { useState } from "react";
import { Urbanist, Playfair_Display } from "next/font/google";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:embed\/|v\/|vi\/|youtu\.be\/|watch\?v=)([^#&?]*)/);
  return match && match[1].length === 11 ? match[1] : null;
}

const videos = [
  {
    number: "1",
    title: "Clients Testimonials",
    src: "https://www.youtube.com/embed/HBa1FugVjfU?si=rtyxydfZDymImvNE",
  },
];

const VideoCard = ({ src, title, number }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = getYouTubeId(src);
  const posterImg = videoId
    ? `https://i.ytimg.com/vi_webp/${videoId}/hqdefault.webp`
    : null;

  const autoplaySrc = src.includes("?") ? `${src}&autoplay=1` : `${src}?autoplay=1`;

  return (
    <div className="relative group flex flex-col items-center max-w-lg w-full">
      <div className="relative bg-white/5 rounded-2xl p-3.5 sm:p-5 border border-gray-800/50 overflow-hidden flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.01] mt-3 sm:mt-5 w-full">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-all duration-300"
          style={{ backgroundImage: "url('/images/herobg.png')" }}
        />
        <div className="absolute inset-0 bg-linear-to-br from-black/70 via-black/50 to-transparent z-0 rounded-2xl"></div>

        <div className="relative z-10 rounded-xl overflow-hidden shadow-lg bg-gray-900 aspect-video">
          {isPlaying ? (
            <iframe
              className="w-full h-full rounded-xl"
              src={autoplaySrc}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="relative w-full h-full block cursor-pointer text-left group/btn focus:outline-none focus:ring-2 focus:ring-[#48A2FF]"
              aria-label={`Play testimonial video: ${title}`}
            >
              {posterImg && (
                <img
                  loading="lazy"
                  decoding="async"
                  src={posterImg}
                  alt={title}
                  className="w-full h-full object-cover group-hover/btn:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-black/40 group-hover/btn:bg-black/20 transition-colors" />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#48A2FF]/90 text-white flex items-center justify-center shadow-lg shadow-[#48A2FF]/40 group-hover/btn:scale-110 group-hover/btn:bg-[#48A2FF] transition-all duration-300">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 fill-current translate-x-0.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </button>
          )}
        </div>

        <h3
          className="relative z-10 text-white text-sm sm:text-base font-semibold text-center mt-3 sm:mt-4"
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
    <section className="relative bg-black py-10 sm:py-14 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/images/herobg.png')" }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-black via-black/90 to-black z-0"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-6 sm:mb-8">
          <p className="text-white text-xs font-medium tracking-wider mb-2 sm:mb-3 rounded-full px-3 py-1 inline-block border border-gray-600">
            Video Testimonials
          </p>
          <h2
            className={`${urbanist.className} text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1.5 sm:mb-2 tracking-tight`}
          >
            Hear from our happy{" "}
            <span
              className={`${playfair.className} italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#48A2FF] via-[#7EC0FF] to-[#C9E4FF]`}
            >
              clients
            </span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm">
            Real stories. Real experiences. Real satisfaction.
          </p>
        </div>

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
