"use client";
import React from "react";
import { motion } from "framer-motion";

const CaseStudies = () => {
  return (

    <>
      <div className="text-center mb-15 md:mb-10 px-4">
        <p className="text-white text-sm  tracking-wider  rounded-full px-3 py-1 inline-block border border-gray-600">
          Case Studies

        </p>
        <h2 className="text-2xl md:text-[2.8rem] font-bold text-white mb-4" style={{ fontFamily: "poppins" }}>
          Typical {" "}
          <span className=" bg-clip-text tracking-wider text-[#48A2FF]">
            results
          </span>
          <span className="text-white"> and we bring</span>
        </h2>
      </div>
      <div className="relative w-full text-white">

        <div
          className="
    sticky top-0
    min-h-[100svh] md:h-screen
    flex items-center justify-center
    bg-cover bg-center
    px-4
  "
          style={{
            backgroundImage: "url('/images/casebg.png')",
            fontFamily: "poppins",
          }}
        >
          <motion.div
            className="
      max-w-6xl w-full
      grid grid-cols-1 lg:grid-cols-2
      gap-5 sm:gap-6 lg:gap-10
      backdrop-blur-md bg-black/70
      border border-white/10
      rounded-2xl sm:rounded-3xl
      p-5 sm:p-6 lg:p-10 py-12
      shadow-2xl
    "
          >
            {/* Text */}
            <div className="flex flex-col justify-center space-y-3 sm:space-y-4">
              <h2 className="text-xl sm:text-2xl md:text-4xl font-bold leading-tight">
                Growing{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#48A2FF] to-[#C9E4FF]">
                  TMG
                </span>{" "}
                to 100K+ Followers
              </h2>

              <p className="text-gray-300 leading-relaxed text-xs sm:text-sm md:text-base lg:text-lg">
                “Before AfterRender, I had just a few followers on Instagram and YouTube.
                Then they came in with a full plan — suddenly people were binge-watching
                my content. Reach exploded and we passed 100K fast.”
              </p>
            </div>

            {/* Video + Stats */}
            <div className="flex flex-col items-center justify-center gap-4 sm:gap-6">
              <div className="w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                <iframe
                  loading="lazy"
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/smBE-xrtQKg?si=PuoVGf0O8IOb1Yh6"
                  title="YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="flex gap-6 sm:gap-10 text-center">
                <div>
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-white">
                    +100K
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">
                    Insta / YouTube Subs
                  </p>
                </div>

                <div>
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-white">
                    80K–100K
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">
                    Avg Views per Reel
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>


        <div
          className="sticky top-0 h-screen flex items-center justify-center bg-transparent"
          style={{ fontFamily: "poppins" }}
        >
          <motion.div
            className="
      max-w-6xl mx-4
      grid grid-cols-1 lg:grid-cols-2
      gap-5 sm:gap-6 lg:gap-10
      backdrop-blur-md bg-black/70
      border border-white/10
      rounded-2xl sm:rounded-3xl
      p-5 sm:p-6 lg:p-10 py-12
      shadow-2xl
    "
          >
            {/* Text */}
            <div className="flex flex-col justify-center space-y-3 sm:space-y-4">
              <h2 className="text-xl sm:text-2xl md:text-4xl font-bold leading-tight">
                Scaling{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#48A2FF] to-[#C9E4FF]">
                  Farming Creator
                </span>{" "}
                to Millions of Impressions
              </h2>

              <p className="text-gray-300 leading-relaxed text-xs sm:text-sm md:text-base lg:text-lg">
                "Afterrender helped us find our voice — they transformed our short-form
                strategy completely. Engagement went through the roof and the content
                finally felt like us."
              </p>
            </div>

            {/* Video + Stats */}
            <div className="flex flex-col items-center justify-center gap-4 sm:gap-6">
              <div className="w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                <iframe
                  loading="lazy"
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/hUnXKKa5gk4?si=NRO9f_M5acskovJe"
                  title="YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="flex gap-6 sm:gap-10 text-center">
                <div>
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-white">
                    +2M
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">
                    Monthly Impressions
                  </p>
                </div>

                <div>
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-white">
                    3x
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">
                    Engagement Growth
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </>

  );
};

export default CaseStudies;
