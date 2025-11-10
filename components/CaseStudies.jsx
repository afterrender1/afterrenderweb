"use client";
import React from "react";
import { motion } from "framer-motion";

const CaseStudies = () => {
  return (

    <>
          <div className="text-center mb-10 md:mb-16 px-4">
          <p className="text-white text-sm  tracking-wider mb-4 rounded-full px-3 py-1 inline-block border border-gray-600">
Case Studies

          </p>
          <h2 className="text-2xl md:text-[2.8rem] font-bold text-white mb-4" style={{fontFamily : "poppins"}}>
           Typical {" "}
            <span className=" bg-clip-text tracking-wider text-[#48A2FF]">
              results   
            </span>
            <span className="text-white"> and we bring</span>
          </h2>
        </div>
    <div className="relative w-full text-white">
      {/* --- FIRST CARD (with background image) --- */}
       
      <div
        className="sticky top-0 h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/casebg.png')",
        }}
      >
        
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-5 grid grid-cols-1 lg:grid-cols-2 gap-10
                     backdrop-blur-md bg-white/10 border border-white/10 
                     rounded-3xl p-10 shadow-2xl"
        >
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-6" style={{fontFamily : "poppins"}}>
           
            <h2 className="text-4xl md:text-[2.8rem] font-bold leading-tight">
              Growing{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#48A2FF] to-[#C9E4FF]">
                Paladin Bhutia
              </span>{" "}
              to 100K+ Followers
            </h2>
            <p className="text-gray-300 leading-relaxed">
              "Before ADDX, I had just a Twitter account, no real structure, and
              nothing was hitting. They came in with a full plan and suddenly
              people were binging my content. We passed 100K followers like it
              was nothing."
            </p>
          </div>

          {/* Right Content */}
          <div className="flex flex-col items-center justify-center gap-6" style={{fontFamily : "poppins"}}>
            <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-lg">
              <iframe
              loading="lazy"
                className="w-full h-full"
                src="https://www.youtube.com/embed/x4gjRFvwoxc?si=UFz7NZimm00rYtgN"
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="flex gap-10 text-center">
              <div>
                <p className="text-4xl font-bold text-white">+100K</p>
                <p className="text-gray-400 text-sm mt-1">Insta/YouTube Subs</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-white">80K–100K</p>
                <p className="text-gray-400 text-sm mt-1">Avg views per reel</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- SECOND CARD (transparent background) --- */}
      <div className="sticky top-0 h-screen flex items-center justify-center bg-transparent" style={{fontFamily : "poppins"}}>
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-4 grid grid-cols-1 lg:grid-cols-2 gap-10
                     backdrop-blur-3xl bg-black/10 border border-white/10 
                     rounded-3xl p-10 shadow-2xl"
        >
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-6">
            
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Scaling{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#48A2FF] to-[#C9E4FF]">
                Next Creator
              </span>{" "}
              to Millions of Impressions Monthly
            </h2>
            <p className="text-gray-300 leading-relaxed">
              "ADDX helped us find our voice — they transformed our short-form
              strategy completely. Engagement went through the roof and the
              content finally felt like *us*."
            </p>
          </div>

          {/* Right Content */}
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-lg">
              <iframe
              loading="lazy"
                className="w-full h-full"
                src="https://www.youtube.com/embed/5q1njhBzdF0?si=r9jRJFX1InXKFQs4"
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="flex gap-10 text-center">
              <div>
                <p className="text-4xl font-bold text-white">+2M</p>
                <p className="text-gray-400 text-sm mt-1">
                  Monthly Impressions
                </p>
              </div>
              <div>
                <p className="text-4xl font-bold text-white">3x</p>
                <p className="text-gray-400 text-sm mt-1">Engagement Growth</p>
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
