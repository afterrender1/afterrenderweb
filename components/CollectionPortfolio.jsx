"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { Play, X } from "lucide-react";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "600", "700"],
});

// =========================================================================
// 1. DATA COLLECTIONS - AP YAHAN APNI IMAGE / VIDEO URLS REPLACE KAR SAKTE HAIN
// =========================================================================

// GRAPHICS CATEGORIES (Screenshot 2 se exact match)
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

// VIDEOS CATEGORIES (Screenshot 1 se exact match)
export const videosCategories = [
  "Montage style",
  "Spanish Videos",
  "Animation AI videos",
  "Gym & Fitness",
  "Text Based",
  "Talking Heads",
  "Product Showcase",
  "Podcast Intro",
  "Long form edits",
  "Digital Course VSL",
];

// GRAPHICS ITEMS (Screenshot 2 ka exact layout)
export const graphicsItems = [
  {
    id: "g1",
    title: "Toner Organic Skincare",
    category: "Ad creatives",
    // Yahan apni Image URL daalein:
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop",
    aspect: "aspect-[4/3]",
    gridSpan: "col-span-12 sm:col-span-6 lg:col-span-3",
    tag: "Cosmetics",
  },
  {
    id: "g2",
    title: "Snuggle Blanket Kids Campaign",
    category: "Ad creatives",
    // Yahan apni Image URL daalein:
    imageUrl: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800&auto=format&fit=crop",
    aspect: "aspect-[4/3]",
    gridSpan: "col-span-12 sm:col-span-6 lg:col-span-3",
    tag: "E-Commerce",
  },
  {
    id: "g3",
    title: "Unique Time Pieces - For Unique People",
    category: "Ad creatives",
    // Yahan apni Image URL daalein:
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop",
    aspect: "aspect-[3/4]",
    gridSpan: "col-span-12 sm:col-span-6 lg:col-span-3",
    tag: "Luxury",
  },
  {
    id: "g4",
    title: "Timeless Elegance - Gold Rings",
    category: "Ad creatives",
    // Yahan apni Image URL daalein:
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
    aspect: "aspect-[9/16]",
    gridSpan: "col-span-12 sm:col-span-6 lg:col-span-3 row-span-2",
    tag: "Jewelry",
  },
  {
    id: "g5",
    title: "EKOUAER Classic Nightshirt",
    category: "Ad creatives",
    // Yahan apni Image URL daalein:
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    aspect: "aspect-square",
    gridSpan: "col-span-12 sm:col-span-6 lg:col-span-3",
    tag: "Fashion",
  },
  {
    id: "g6",
    title: "Soft as moss - Leather Oxford Shoes",
    category: "Ad creatives",
    // Yahan apni Image URL daalein:
    imageUrl: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=800&auto=format&fit=crop",
    aspect: "aspect-[16/10]",
    gridSpan: "col-span-12 sm:col-span-6 lg:col-span-3",
    tag: "Footwear",
  },
  {
    id: "g7",
    title: "JBL HEAR Everything - Wireless Headphones",
    category: "Ad creatives",
    // Yahan apni Image URL daalein:
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    aspect: "aspect-[16/9]",
    gridSpan: "col-span-12 sm:col-span-6 lg:col-span-3",
    tag: "Tech Audio",
  },
];

// VIDEOS ITEMS (Screenshot 1 ka exact layout)
export const videosItems = [
  {
    id: "v1",
    title: "30 Plus Years Experience - Talking Head Reel",
    category: "Montage style",
    // Yahan apni Video URL daalein:
    videoUrl: "https://res.cloudinary.com/dlurrugno/video/upload/v1788183664/Adam_reel-1_phvxsx.mp4",
    // Yahan apni Poster/Thumbnail daalein:
    posterUrl: "/images/video-tn/one.png",
    aspect: "aspect-[9/16]",
    gridSpan: "col-span-12 sm:col-span-6 lg:col-span-3",
    isVertical: true,
  },
  {
    id: "v2",
    title: "Craftsmen Construction Cement Pouring",
    category: "Montage style",
    // Yahan apni Video URL daalein:
    videoUrl: "https://res.cloudinary.com/dlurrugno/video/upload/v1788183792/Matt_Short_03_jjo3qx.mp4",
    // Yahan apni Poster/Thumbnail daalein:
    posterUrl: "/images/video-tn/two.png",
    aspect: "aspect-[9/16]",
    gridSpan: "col-span-12 sm:col-span-6 lg:col-span-3",
    isVertical: true,
  },
  {
    id: "v3",
    title: "Sunroom & Patio Transformation",
    category: "Montage style",
    // Yahan apni Video URL daalein:
    videoUrl: "https://res.cloudinary.com/dlurrugno/video/upload/v1788184449/Reel-1_pxvgud.mp4",
    // Yahan apni Poster/Thumbnail daalein:
    posterUrl: "/images/video-tn/three.png",
    aspect: "aspect-[9/16]",
    gridSpan: "col-span-12 sm:col-span-6 lg:col-span-3",
    isVertical: true,
  },
  {
    id: "v4",
    title: "Metal Fabrication Welding & Sparks",
    category: "Montage style",
    // Yahan apni Video URL daalein:
    videoUrl: "https://res.cloudinary.com/dlurrugno/video/upload/v1788184603/reel-1_kuxlzp.mp4",
    // Yahan apni Poster/Thumbnail daalein:
    posterUrl: "/images/video-tn/four.png",
    aspect: "aspect-[9/16]",
    gridSpan: "col-span-12 sm:col-span-6 lg:col-span-3",
    isVertical: true,
  },
  {
    id: "v5",
    title: "French Bulldog Neon Retail Animation",
    category: "Montage style",
    // Yahan apni Video URL daalein:
    videoUrl: "https://res.cloudinary.com/dlurrugno/video/upload/v1788184746/reel-1_wveaag.mp4",
    // Yahan apni Poster/Thumbnail daalein:
    posterUrl: "/images/video-tn/five.png",
    aspect: "aspect-[9/16]",
    gridSpan: "col-span-12 sm:col-span-6 lg:col-span-3",
    isVertical: true,
  },
  {
    id: "v6",
    title: "Contagioso - Viral Book Summary Breakdown",
    category: "Montage style",
    // Yahan apni Video URL daalein:
    videoUrl: "https://res.cloudinary.com/dlurrugno/video/upload/v1788184788/Nade_reel-1_revise_ejrqar.mp4",
    // Yahan apni Poster/Thumbnail daalein:
    posterUrl: "/images/video-tn/six.png",
    aspect: "aspect-[9/16]",
    gridSpan: "col-span-12 sm:col-span-6 lg:col-span-3",
    isVertical: true,
  },
  {
    id: "v7",
    title: "Night Infrastructure Bridge Crane Work",
    category: "Montage style",
    // Yahan apni Video URL daalein:
    videoUrl: "https://res.cloudinary.com/dlurrugno/video/upload/v1788184812/Anthropic_reel_n76nlc.mp4",
    // Yahan apni Poster/Thumbnail daalein:
    posterUrl: "/images/video-tn/seven.png",
    aspect: "aspect-[9/16]",
    gridSpan: "col-span-12 sm:col-span-6 lg:col-span-3",
    isVertical: true,
  },
  {
    id: "v8",
    title: "Architectural Luxury Hillside Glass Villa",
    category: "Montage style",
    // Yahan apni Video URL daalein:
    videoUrl: "https://res.cloudinary.com/dlurrugno/video/upload/v1770041503/mainintrovideo_m2pujs.mp4",
    // Yahan apni Poster/Thumbnail daalein:
    posterUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop",
    aspect: "aspect-[16/9]",
    gridSpan: "col-span-12 sm:col-span-6 lg:col-span-3",
    isVertical: false,
  },
  {
    id: "v9",
    title: "Cinematic BMW Emblem Macro Shots",
    category: "Montage style",
    // Yahan apni Video URL daalein:
    videoUrl: "https://res.cloudinary.com/dlurrugno/video/upload/v1770041503/mainintrovideo_m2pujs.mp4",
    // Yahan apni Poster/Thumbnail daalein:
    posterUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format&fit=crop",
    aspect: "aspect-[16/9]",
    gridSpan: "col-span-12 sm:col-span-6 lg:col-span-3",
    isVertical: false,
  },
];

// =========================================================================
// 2. MAIN COMPONENT
// =========================================================================
export default function CollectionPortfolio() {
  const [activeTab, setActiveTab] = useState("graphics"); // "graphics" | "videos"
  const [activeCategory, setActiveCategory] = useState("Ad creatives");
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Switch default category when main tab changes
  useEffect(() => {
    if (activeTab === "graphics") {
      setActiveCategory("Ad creatives");
    } else {
      setActiveCategory("Montage style");
    }
  }, [activeTab]);

  const currentCategories =
    activeTab === "graphics" ? graphicsCategories : videosCategories;

  return (
    <section
      id="collection-portfolio"
      className={`${jakarta.className} relative w-full bg-[#FAFAFA] text-black pt-12 sm:pt-16 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden`}
    >
      {/* Background Soft Ambient Glow Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#48A2FF]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#C9E4FF]/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* ==========================================
            TOP HEADER
            ========================================== */}
        {/* Badge: • PORTFOLIO */}
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#48A2FF] inline-block animate-pulse" />
          <span>PORTFOLIO</span>
        </div>

        {/* Separator Line */}
        <div className="w-full h-[1px] bg-gray-200/80 mb-8" />

        {/* Main Heading & Subtitle */}
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

        {/* ==========================================
            PILL SWITCHER (GRAPHICS / VIDEOS)
            ========================================== */}
        <div className="flex justify-center mb-10 sm:mb-14">
          <div className="bg-[#EFEFEF] p-1 rounded-full flex items-center shadow-inner border border-gray-200/70">
            {/* Graphics Tab */}
            <button
              type="button"
              onClick={() => setActiveTab("graphics")}
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

            {/* Videos Tab */}
            <button
              type="button"
              onClick={() => setActiveTab("videos")}
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
          </div>
        </div>

        {/* ==========================================
            TWO-COLUMN SECTION: SIDEBAR + CONTENT GRID
            ========================================== */}
        <div className="flex flex-col lg:flex-row items-start gap-8 sm:gap-10">
          {/* ------------------------------------------
              LEFT SIDEBAR (OUR WORK)
              ------------------------------------------ */}
          <aside className="w-full lg:w-64 shrink-0 bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] sticky top-24">
            {/* Title with Underline */}
            <h3 className="text-gray-950 font-bold text-lg sm:text-xl tracking-tight mb-6 pb-1 border-b-2 border-black inline-block">
              Our Work
            </h3>

            {/* Category Items List */}
            <ul className="space-y-1.5">
              {currentCategories.map((category, index) => {
                const isActive = activeCategory === category;
                return (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`text-left w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center justify-between ${
                        isActive
                          ? "bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] text-[#0A2540] font-bold shadow-[0_2px_10px_rgba(72,162,255,0.25)]"
                          : "text-gray-600 hover:text-black hover:bg-gray-100/80 font-medium"
                      }`}
                    >
                      <span>{category}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0A2540] inline-block" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* ------------------------------------------
              RIGHT CONTENT AREA (GRIDS)
              ------------------------------------------ */}
          <main className="flex-1 w-full min-w-0">
            {/* 1. GRAPHICS TAB GRID */}
            {activeTab === "graphics" && (
              <motion.div
                key="graphics-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-12 gap-4 sm:gap-5"
              >
                {graphicsItems.map((item) => (
                  <div
                    key={item.id}
                    className={`${item.gridSpan} group relative rounded-2xl overflow-hidden bg-white border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:border-gray-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1`}
                  >
                    <div className={`relative w-full ${item.aspect} overflow-hidden bg-gray-100`}>
                      {/* Image Thumbnail */}
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Subtle Gradient Overlay on Hover */}
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
              </motion.div>
            )}

            {/* 2. VIDEOS TAB GRID */}
            {activeTab === "videos" && (
              <motion.div
                key="videos-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-12 gap-4 sm:gap-5"
              >
                {videosItems.map((video) => (
                  <div
                    key={video.id}
                    className={`${video.gridSpan} group relative rounded-2xl overflow-hidden bg-white border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:border-gray-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className={`relative w-full ${video.aspect} overflow-hidden bg-gray-100`}>
                      {/* Video Poster Thumbnail */}
                      <img
                        src={video.posterUrl}
                        alt={video.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Video Screen Filter */}
                      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors duration-300" />

                      {/* Center Theme Gradient Circle Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] text-[#0A2540] flex items-center justify-center shadow-[0_4px_16px_rgba(72,162,255,0.45)] group-hover:scale-115 active:scale-95 transition-all duration-300">
                          <Play className="w-4 h-4 fill-[#0A2540] text-[#0A2540] ml-0.5" />
                        </div>
                      </div>

                      {/* Bottom Title on Hover */}
                      <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-black/85 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-xs font-semibold line-clamp-1">
                          {video.title}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* ==========================================
          MODAL VIDEO PLAYER (FOR VIDEOS TAB)
          ========================================== */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 ${
                selectedVideo.isVertical
                  ? "w-full max-w-sm aspect-[9/16]"
                  : "w-full max-w-3xl aspect-video"
              }`}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/60 hover:bg-black text-white hover:text-[#48A2FF] transition-colors cursor-pointer"
                aria-label="Close video player"
              >
                <X size={20} />
              </button>

              {/* Video Element */}
              <video
                src={selectedVideo.videoUrl}
                autoPlay
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
