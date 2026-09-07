"use client";

import React, { useEffect, useState } from "react";
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

const VideoCard = ({ thumbnail, title, tags }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = getYouTubeId(thumbnail);
  const posterImg = videoId
    ? `https://i.ytimg.com/vi_webp/${videoId}/hqdefault.webp`
    : thumbnail;

  const tagColors = {
    Scripting: "bg-cyan-400 text-black",
    ideation: "bg-green-400 text-black",
    Editing: "bg-red-400 text-black",
    SEO: "bg-yellow-400 text-black",
    Thumbnails: "bg-purple-400 text-black",
  };

  const autoplaySrc = thumbnail.includes("?")
    ? `${thumbnail}&autoplay=1`
    : `${thumbnail}?autoplay=1`;

  return (
    <div
      className="rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-3.5 sm:p-4 group flex flex-col justify-between"
      style={{ fontFamily: "poppins" }}
    >
      <div>
        <div className="relative rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4 bg-gray-900 aspect-video">
          {isPlaying ? (
            <iframe
              src={autoplaySrc}
              title={title}
              className="w-full h-full object-cover"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="relative w-full h-full block cursor-pointer text-left group/btn focus:outline-none focus:ring-2 focus:ring-[#48A2FF]"
              aria-label={`Play video: ${title}`}
            >
              <img
                loading="lazy"
                decoding="async"
                src={posterImg}
                alt={title}
                className="w-full h-full object-cover group-hover/btn:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 group-hover/btn:bg-black/10 transition-colors" />

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

        <h3 className="text-white text-xs sm:text-sm font-medium mb-2.5 sm:mb-3 leading-snug">
          {title}
        </h3>
      </div>

      <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-1.5">
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`${
              tagColors[tag] || "bg-gray-600 text-white"
            } px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-medium`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const Portfolio = () => {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    }
  }, []);

const videos = [
  {
    id: "v1",
    thumbnail: "https://www.youtube.com/embed/x4gjRFvwoxc?si=a5CbcRSWf1fj8HhB",
    title: "VSL Video Editing for Business Client | AfterRender Showcase",
    tags: ["VSL", "ideation", "Editing", "SEO"],
  },
  {
    id: "v2",
    thumbnail: "https://www.youtube.com/embed/rHfibRZisjI?si=CvW6uG9KJbTZiBwP",
    title: "Vlog Talking Head Video | Nathaniel Drew & Johnny Harris Style (Client Work)",
    tags: ["Scripting", "ideation", "Editing", "SEO", "Thumbnails"],
  },
  {
    id: "v3",
    thumbnail: "https://www.youtube.com/embed/BFBv_FlfehI?si=hDn_u4MINSz0LVAd",
    title: "I found an UNTAPPED Faceless YouTube Niche",
    tags: ["Scripting", "ideation", "Editing", "SEO", "Thumbnails"],
  },
  {
    id: "v4",
    thumbnail: "https://www.youtube.com/embed/lpKpHIhXdy0?si=wbj2UPPvJquXzdTQ",
    title: "Talking Head Video Edit | Iman Gadzhi & Ali Abdaal Style (Client Work)",
    tags: ["Scripting", "ideation", "Editing", "SEO", "Thumbnails"],
  },
  {
    id: "v5",
    thumbnail: "https://www.youtube.com/embed/yAK8UcNmsgs?si=d1LIBkIPPuTtelzS",
    title: "Business Documentary Video Editing (Jake Tran Inspired)",
    tags: ["Scripting", "ideation", "Editing"],
  },
  {
    id: "v6",
    thumbnail: "https://www.youtube.com/embed/hlH5Plu6XYI?si=3VCXYhTJv0CdXcxz",
    title: "CashCow Style YouTube Video – Professional Editing Example",
    tags: ["Scripting", "ideation", "Editing", "SEO", "Thumbnails"],
  },
  {
    id: "v7",
    thumbnail: "https://www.youtube.com/embed/Ybkqf_NjiEs?si=B4qVD8y19yQOI18u",
    title: "The Guy Behind Anime Blades… (Organic Drop Shipping)",
    tags: ["ideation", "Editing", "SEO", "Thumbnails"],
  },
  {
    id: "v8",
    thumbnail: "https://www.youtube.com/embed/hlH5Plu6XYI?si=gIqIFOZzIy5jgEbA",
    title: "Organic Dropshipping Masterclass (6+ HOUR FREE COURSE)",
    tags: ["ideation", "Editing", "Thumbnails"],
  },
  {
    id: "v9",
    thumbnail: "https://www.youtube.com/embed/Ybkqf_NjiEs?si=R0A8UjjXs3VyyZoa",
    title: "AfterRender Shorts | High-Quality Portfolio",
    tags: ["ideation", "Editing", "SEO", "Thumbnails"],
  },
  {
    id: "v10",
    thumbnail: "https://www.youtube.com/embed/5q1njhBzdF0?si=xjToL-OWPBui-ubu",
    title: "AfterRender EXPOSED? ‪@bighot‬ Tells All",
    tags: ["Scripting", "ideation", "Editing", "Thumbnails"],
  },
];


  return (
    <div
      id="videos"
      className="bg-contain bg-center bg-no-repeat relative py-10 sm:py-14 px-4"
      style={{
        backgroundImage: "url('/images/herobg.png')",
        fontFamily: "poppins",
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative max-w-4xl mx-auto z-10">
        <div className="mb-6 sm:mb-8 flex flex-col items-center text-center">
          <h2
            className={`${urbanist.className} text-2xl sm:text-3xl lg:text-4xl mb-1.5 sm:mb-2 font-bold tracking-tight text-white`}
          >
            Featured{" "}
            <span
              className={`${playfair.className} italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#48A2FF] via-[#7EC0FF] to-[#C9E4FF]`}
            >
              Portfolio
            </span>
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm">
            Explore our latest projects and success stories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {videos.map((video) => (
            <div key={video.id} id={video.id}>
              <VideoCard
                thumbnail={video.thumbnail}
                title={video.title}
                tags={video.tags}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
