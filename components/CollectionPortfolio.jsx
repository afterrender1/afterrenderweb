"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { Play, X, Video } from "lucide-react";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "600", "700"],
});


export const graphicsCategories = [
  "Ad creatives",
  "Ai generated graphics",
  "App graphic",
  "Blog thumbnails",
  "Brand Kits & Assets",
  "Custom Icons",
  "Ebook graphics for website",
  "Infographics",
  "Pdfs",
  "Presentations",
  "Slide decks",
  "Social media graphics",
];


export const videosCategories = [
  "Long form edits",
  "Montage style",
  "SaaS Videos",
  "Shorts form edits",
  "Talking Heads",
  "Product Showcase",
  // "Podcast Intro",
  // "Digital Course VSL",
];

export const graphicsItems = [
  {
    id: "g1",
    title: "Toner Organic Skincare",
    category: "Ad creatives",
    imageUrl:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop",
    aspect: "aspect-[4/3]",
    gridSpan: "col-span-12 sm:col-span-6 lg:col-span-3",
    tag: "Cosmetics",
  },
  {
    id: "g2",
    title: "Snuggle Blanket Kids Campaign",
    category: "Ad creatives",
    imageUrl:
      "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800&auto=format&fit=crop",
    aspect: "aspect-[4/3]",
    gridSpan: "col-span-12 sm:col-span-6 lg:col-span-3",
    tag: "E-Commerce",
  },
  {
    id: "g3",
    title: "Unique Time Pieces - For Unique People",
    category: "Ad creatives",
    imageUrl:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop",
    aspect: "aspect-[3/4]",
    gridSpan: "col-span-12 sm:col-span-6 lg:col-span-3",
    tag: "Luxury",
  },
  {
    id: "g4",
    title: "Timeless Elegance - Gold Rings",
    category: "Ad creatives",
    imageUrl:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
    aspect: "aspect-[9/16]",
    gridSpan: "col-span-12 sm:col-span-6 lg:col-span-3 row-span-2",
    tag: "Jewelry",
  },
  {
    id: "g5",
    title: "EKOUAER Classic Nightshirt",
    category: "Ad creatives",
    imageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    aspect: "aspect-square",
    gridSpan: "col-span-12 sm:col-span-6 lg:col-span-3",
    tag: "Fashion",
  },
  {
    id: "g6",
    title: "Soft as moss - Leather Oxford Shoes",
    category: "Ad creatives",
    imageUrl:
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=800&auto=format&fit=crop",
    aspect: "aspect-[16/10]",
    gridSpan: "col-span-12 sm:col-span-6 lg:col-span-3",
    tag: "Footwear",
  },
  {
    id: "g7",
    title: "JBL HEAR Everything - Wireless Headphones",
    category: "Ad creatives",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    aspect: "aspect-[16/9]",
    gridSpan: "col-span-12 sm:col-span-6 lg:col-span-3",
    tag: "Tech Audio",
  },
];

export const videosItems = [
  {
    id: "long-1",
    title: "Long form #1",
    category: "Long form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789477081/6_subs_1_fjnezv.mp4",
    posterUrl: "/images/longformvideoposters/longform1.png",
    aspect: "aspect-[16/9]",
    isVertical: false,
  },
  {
    id: "long-2",
    title: "Long form #2",
    category: "Long form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789476262/24.h_taxi_saas_video_s9vo91.mp4",
    posterUrl: "/images/longformvideoposters/longform2.png",
    aspect: "aspect-[16/9]",
    isVertical: false,
  },
  {
    id: "long-3",
    title: "Long form #3",
    category: "Long form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789476223/saas_video_v14min.mp4",
    posterUrl: "/images/longformvideoposters/longform3.png",
    aspect: "aspect-[16/9]",
    isVertical: false,
  },
  {
    id: "long-4",
    title: "Long form #4",
    category: "Long form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789474628/Faadi_1_asqfaz.mp4",
    posterUrl: "/images/longformvideoposters/longform4.png",
    aspect: "aspect-[16/9]",
    isVertical: false,
  },
  {
    id: "long-5",
    title: "Long form #5",
    category: "Long form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789474516/Panda_Express1_f9yo42.mp4",
    posterUrl: "/images/longformvideoposters/longform5.png",
    aspect: "aspect-[16/9]",
    isVertical: false,
  },
  {
    id: "long-6",
    title: "Long form #6",
    category: "Long form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789474465/Spirit_airline_wcoflo.mp4",
    posterUrl: "/images/longformvideoposters/longform6.png",
    aspect: "aspect-[16/9]",
    isVertical: false,
  },
  {
    id: "long-7",
    title: "Long form #7",
    category: "Long form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789473496/Harel_g4s1bp.mp4",
    posterUrl: "/images/longformvideoposters/longform7.png",
    aspect: "aspect-[16/9]",
    isVertical: false,
  },
  {
    id: "long-8",
    title: "Long form #8",
    category: "Long form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789472470/Horizon_demo_pv00yc.mp4",
    posterUrl: "/images/longformvideoposters/longform8.png",
    aspect: "aspect-[16/9]",
    isVertical: false,
  },
  {
    id: "long-9",
    title: "Long form #9",
    category: "Long form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789478131/PROFIT_MAX_vmv64g.mp4",
    posterUrl: "/images/longformvideoposters/longform9.png",
    aspect: "aspect-[16/9]",
    isVertical: false,
  },
  {
    id: "long-10",
    title: "Long form #10",
    category: "Long form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789480611/how_to_get_rid_of_moss_on_roofs_q1prfb.mp4",
    posterUrl: "/images/longformvideoposters/longform10.png",
    aspect: "aspect-[16/9]",
    isVertical: false,
  },
  {
    id: "saas-1",
    title: "SaaS #1",
    category: "SaaS Videos",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789476262/24.h_taxi_saas_video_s9vo91.mp4",
    posterUrl: "/images/longformvideoposters/longform2.png",
    aspect: "aspect-[16/9]",
    isVertical: false,
  },
  {
    id: "saas-2",
    title: "SaaS #2",
    category: "SaaS Videos",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789476223/saas_video_v14min.mp4",
    posterUrl: "/images/longformvideoposters/longform3.png",
    aspect: "aspect-[16/9]",
    isVertical: false,
  },
  {
    id: "saas-3",
    title: "SaaS #3",
    category: "SaaS Videos",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789472470/Horizon_demo_pv00yc.mp4",
    posterUrl: "/images/longformvideoposters/longform8.png",
    aspect: "aspect-[16/9]",
    isVertical: false,
  },
];

export default function CollectionPortfolio() {
  const [activeTab, setActiveTab] = useState("videos");
  const [activeCategory, setActiveCategory] = useState("Long form edits");
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "graphics") {
      setActiveCategory("Ad creatives");
    } else {
      setActiveCategory("Long form edits");
    }
  };

  const currentCategories =
    activeTab === "graphics" ? graphicsCategories : videosCategories;

  const filteredVideos = videosItems.filter(
    (item) => item.category.toLowerCase().trim() === activeCategory.toLowerCase().trim()
  );

  const filteredGraphics = graphicsItems.filter(
    (item) => item.category.toLowerCase().trim() === activeCategory.toLowerCase().trim()
  );

  return (
    <section
      id="collection-portfolio"
      className={`${jakarta.className} relative w-full bg-[#FAFAFA] text-black pt-12 sm:pt-16 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden`}
    >
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#48A2FF]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#C9E4FF]/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#48A2FF] inline-block animate-pulse" />
          <span>PORTFOLIO</span>
        </div>

        <div className="w-full h-[1px] bg-gray-200/80 mb-8" />

        <div className="mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight">
            <span>Featured </span>
            <span
              className={`${playfair.className} italic font-normal text-gray-900`}
            >
              Projects
            </span>
          </h2>
          <p className="mt-2.5 text-gray-600 text-xs sm:text-sm md:text-[14.5px] max-w-xl font-medium">
            A curated look at standout creations across industries and formats.
          </p>
        </div>

        <div className="flex justify-center mb-10 sm:mb-14">
          <div className="bg-[#EFEFEF] p-1 rounded-full flex items-center shadow-inner border border-gray-200/70">
            <button
              type="button"
              onClick={() => handleTabChange("videos")}
              className={`relative px-6 sm:px-7 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === "videos"
                  ? "text-[#0A2540] font-bold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {activeTab === "videos" && (
                <motion.div
                  layoutId="collectionActiveTab"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  className="absolute inset-0 bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] rounded-full shadow-[0_2px_10px_rgba(72,162,255,0.35)]"
                />
              )}
              <span className="relative z-10">Videos</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("graphics")}
              className={`relative px-6 sm:px-7 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === "graphics"
                  ? "text-[#0A2540] font-bold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {activeTab === "graphics" && (
                <motion.div
                  layoutId="collectionActiveTab"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  className="absolute inset-0 bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] rounded-full shadow-[0_2px_10px_rgba(72,162,255,0.35)]"
                />
              )}
              <span className="relative z-10">Graphics</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-8 sm:gap-10">
          <aside className="w-full lg:w-64 shrink-0 bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] sticky top-24">
            <h3 className="text-gray-950 font-bold text-lg sm:text-xl tracking-tight mb-6 pb-1 border-b-2 border-black inline-block">
              Our Work
            </h3>

            <ul className="space-y-1.5">
              {currentCategories.map((category, index) => {
                const isActive = activeCategory === category;
                return (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`text-left w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center justify-between ${
                        isActive
                          ? "bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] text-[#0A2540] font-bold shadow-[0_2px_10px_rgba(72,162,255,0.25)]"
                          : "text-gray-600 hover:text-black hover:bg-gray-100/80 font-medium"
                      }`}
                    >
                      <span className="line-clamp-1">{category}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0A2540] inline-block shrink-0 ml-1.5" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

    
          <main className="flex-1 w-full min-w-0">
            
            {activeTab === "videos" && (
              <motion.div
                key={`videos-${activeCategory}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {filteredVideos.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
                    {filteredVideos.map((video) => (
                      <div
                        key={video.id}
                        className="group relative rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-gray-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:border-[#48A2FF]/50 hover:shadow-[0_10px_28px_rgba(72,162,255,0.18)] transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                        onClick={() => {
                          if (video.videoUrl) {
                            setSelectedVideo(video);
                          }
                        }}
                      >
                        <div
                          className={`relative w-full ${
                            video.aspect || "aspect-[16/9]"
                          } overflow-hidden bg-gray-950`}
                        >
                          <img
                            src={video.posterUrl}
                            alt={video.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />

                          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors duration-300" />

                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] text-[#0A2540] flex items-center justify-center shadow-[0_4px_16px_rgba(72,162,255,0.45)] group-hover:scale-115 active:scale-95 transition-all duration-300">
                              <Play className="w-4 h-4 fill-[#0A2540] text-[#0A2540] ml-0.5" />
                            </div>
                          </div>

                          <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-white text-xs sm:text-[13px] font-bold line-clamp-1">
                              {video.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full py-16 sm:py-20 px-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex flex-col items-center justify-center text-center">
                    <div className="w-14 h-14 rounded-full bg-[#48A2FF]/10 text-[#48A2FF] flex items-center justify-center mb-4">
                      <Video className="w-6 h-6" />
                    </div>
                    <h3 className="text-gray-950 text-lg sm:text-xl font-bold mb-1.5">
                      {activeCategory}
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm max-w-md mb-5 font-medium">
                      No videos uploaded yet in this category. Content will be added here soon.
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                      <span className="w-2 h-2 rounded-full bg-[#48A2FF] animate-pulse" />
                      Videos Coming Soon
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "graphics" && (
              <motion.div
                key={`graphics-${activeCategory}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {filteredGraphics.length > 0 ? (
                  <div className="grid grid-cols-12 gap-4 sm:gap-5">
                    {filteredGraphics.map((item) => (
                      <div
                        key={item.id}
                        className={`${item.gridSpan} group relative rounded-2xl overflow-hidden bg-white border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:border-gray-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1`}
                      >
                        <div className={`relative w-full ${item.aspect} overflow-hidden bg-gray-100`}>
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                            <span className="text-[11px] font-bold text-[#48A2FF] uppercase tracking-wider">
                              {item.tag}
                            </span>
                            <h4 className="text-white text-xs sm:text-sm font-bold line-clamp-1">
                              {item.title}
                            </h4>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full py-16 sm:py-20 px-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex flex-col items-center justify-center text-center">
                    <h3 className="text-gray-950 text-lg sm:text-xl font-bold mb-1.5">
                      {activeCategory}
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm max-w-md font-medium">
                      No graphics uploaded yet in this category.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </main>
        </div>
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/15 ${
                selectedVideo.isVertical
                  ? "w-full max-w-sm aspect-[9/16]"
                  : "w-full max-w-4xl aspect-video"
              }`}
            >
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="absolute top-3 right-3 z-30 p-2.5 rounded-full bg-black/70 hover:bg-black text-white hover:text-[#48A2FF] transition-all duration-200 cursor-pointer border border-white/20 backdrop-blur-md shadow-lg"
                aria-label="Close video player"
              >
                <X size={20} />
              </button>

              <video
                key={selectedVideo.videoUrl}
                src={selectedVideo.videoUrl}
                autoPlay
                controls
                playsInline
                className="w-full h-full object-contain bg-black"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
