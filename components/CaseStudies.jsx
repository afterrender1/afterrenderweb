"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
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

function CaseStudyVideo({ src, title }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const match = src.match(/(?:embed\/|v\/|vi\/|youtu\.be\/|watch\?v=)([^#&?]*)/);
  const videoId = match && match[1].length === 11 ? match[1] : null;
  const posterImg = videoId
    ? `https://i.ytimg.com/vi_webp/${videoId}/hqdefault.webp`
    : null;
  const autoplaySrc = src.includes("?") ? `${src}&autoplay=1` : `${src}?autoplay=1`;

  return (
    <div className="w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-gray-900 relative">
      {isPlaying ? (
        <iframe
          className="w-full h-full"
          src={autoplaySrc}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          className="relative w-full h-full block cursor-pointer text-left group/btn focus:outline-none focus:ring-2 focus:ring-[#48A2FF]"
          aria-label={`Play case study video: ${title}`}
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
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#48A2FF]/90 text-white flex items-center justify-center shadow-lg shadow-[#48A2FF]/40 group-hover/btn:scale-110 group-hover/btn:bg-[#48A2FF] transition-all duration-300">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 fill-current translate-x-0.5"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}

const CaseStudies = () => {
  return (
    <section className="relative w-full text-white py-10 sm:py-14">
      <div className="text-center mb-6 sm:mb-10 px-4 max-w-4xl mx-auto">
        <p className="text-white text-xs font-medium tracking-wider rounded-full px-3 py-1 inline-block border border-gray-600 mb-2 sm:mb-3">
          Case Studies
        </p>
        <h2 className={`${urbanist.className} text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight`}>
          Typical results we{" "}
          <span className={`${playfair.className} italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#48A2FF] via-[#7EC0FF] to-[#C9E4FF]`}>
            bring
          </span>
        </h2>
      </div>

      <div className="relative w-full max-w-5xl mx-auto px-4 space-y-6 sm:space-y-8">
        {/* Card 1 */}
        <div
          className="relative flex items-center justify-center bg-cover bg-center rounded-2xl sm:rounded-3xl overflow-hidden"
          style={{
            backgroundImage: "url('/images/casebg.png')",
            fontFamily: "poppins",
          }}
        >
          <motion.div
            className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 backdrop-blur-md bg-black/80 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl"
          >
            {/* Text */}
            <div className="flex flex-col justify-center space-y-2.5 sm:space-y-3">
              <h3 className={`text-base sm:text-lg lg:text-xl font-bold leading-snug ${urbanist.className}`}>
                Growing{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#48A2FF] to-[#C9E4FF]">
                  TMG
                </span>{" "}
                to 100K+ Followers
              </h3>

              <p className="text-gray-300 leading-relaxed text-xs sm:text-sm">
                “Before AfterRender, I had just a few followers on Instagram and YouTube.
                Then they came in with a full plan — suddenly people were binge-watching
                my content. Reach exploded and we passed 100K fast.”
              </p>
            </div>

            {/* Video + Stats */}
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
              <CaseStudyVideo
                src="https://www.youtube.com/embed/smBE-xrtQKg?si=PuoVGf0O8IOb1Yh6"
                title="TMG Case Study Video"
              />

              <div className="flex gap-6 sm:gap-8 text-center">
                <div>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                    +100K
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Insta / YouTube Subs
                  </p>
                </div>

                <div>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                    80K–100K
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Avg Views per Reel
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Card 2 */}
        <div
          className="relative flex items-center justify-center bg-cover bg-center rounded-2xl sm:rounded-3xl overflow-hidden"
          style={{
            backgroundImage: "url('/images/casebg.png')",
            fontFamily: "poppins",
          }}
        >
          <motion.div
            className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 backdrop-blur-md bg-black/80 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl"
          >
            {/* Text */}
            <div className="flex flex-col justify-center space-y-2.5 sm:space-y-3">
              <h3 className= {`text-base sm:text-lg lg:text-xl font-bold leading-snug ${urbanist.className}`}>
                Scaling{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#48A2FF] to-[#C9E4FF]">
                  Farming Creator
                </span>{" "}
                to Millions of Impressions
              </h3>

              <p className="text-gray-300 leading-relaxed text-xs sm:text-sm">
                "Afterrender helped us find our voice — they transformed our short-form
                strategy completely. Engagement went through the roof and the content
                finally felt like us."
              </p>
            </div>

            {/* Video + Stats */}
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
              <CaseStudyVideo
                src="https://www.youtube.com/embed/hUnXKKa5gk4?si=NRO9f_M5acskovJe"
                title="Farming Creator Case Study Video"
              />

              <div className="flex gap-6 sm:gap-8 text-center">
                <div>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                    +2M
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Monthly Impressions
                  </p>
                </div>

                <div>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                    3x
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Engagement Growth
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
