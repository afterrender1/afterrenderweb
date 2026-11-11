"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus_Jakarta_Sans, Playfair_Display } from "@/app/lib/fonts";
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
  "Shorts form edits",
  "Real Estate",
  "Montage style",
  "Talking Heads",
  "Long form edits",
  "SaaS Videos",
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
    id: "long-11",
    title: "Long form #11",
    category: "Long form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789483221/The_Hardest_Lesson_I_Learned_as_a_YouTuber_r0efqs.mp4",
    posterUrl: "/images/longformvideoposters/longform11.png",
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
  {
    id: "saas-4",
    title: "SaaS #4",
    category: "SaaS Videos",
    videoUrl: "https://res.cloudinary.com/dlurrugno/video/upload/v1789470781/Short_2_rev_r4w0mo.mp4",
    posterUrl: "/images/saasvideoposters/svp1.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "saas-5",
    title: "SaaS #5",
    category: "SaaS Videos",
    videoUrl: "https://res.cloudinary.com/dlurrugno/video/upload/v1789470778/Short_3_pycyyd.mp4",
    posterUrl: "/images/saasvideoposters/svp2.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "saas-6",
    title: "SaaS #6",
    category: "SaaS Videos",
    videoUrl: "https://res.cloudinary.com/dlurrugno/video/upload/v1789470775/Short_4_top8tv.mp4",
    posterUrl: "/images/saasvideoposters/svp3.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "short-1",
    title: "Short #1",
    category: "Shorts form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788183664/Adam_reel-1_phvxsx.mp4",
    posterUrl: "/images/video-tn/one.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "short-2",
    title: "Short #2",
    category: "Shorts form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788183792/Matt_Short_03_jjo3qx.mp4",
    posterUrl: "/images/video-tn/two.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "short-3",
    title: "Short #3",
    category: "Shorts form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788184449/Reel-1_pxvgud.mp4",
    posterUrl: "/images/video-tn/three.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "short-4",
    title: "Short #4",
    category: "Shorts form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788184603/reel-1_kuxlzp.mp4",
    posterUrl: "/images/video-tn/four.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "short-5",
    title: "Short #5",
    category: "Shorts form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788184746/reel-1_wveaag.mp4",
    posterUrl: "/images/video-tn/five.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "short-6",
    title: "Short #6",
    category: "Shorts form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788184788/Nade_reel-1_revise_ejrqar.mp4",
    posterUrl: "/images/video-tn/six.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "short-7",
    title: "Short #7",
    category: "Shorts form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788184812/Anthropic_reel_n76nlc.mp4",
    posterUrl: "/images/video-tn/seven.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "short-8",
    title: "Short #8",
    category: "Shorts form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789471135/reel_5_s0gu5p.mp4",
    posterUrl: "/images/shortformvideoposters/shortvideoposter1.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "short-9",
    title: "Short #9",
    category: "Shorts form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789471166/Ali_reel_1_rev_rhealk.mp4",
    posterUrl: "/images/shortformvideoposters/shortvideoposter2.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "short-10",
    title: "Short #10",
    category: "Shorts form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789471214/Indulge_spa_1_dtgdmm.mp4",
    posterUrl: "/images/shortformvideoposters/shortvideoposter3.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "short-11",
    title: "Short #11",
    category: "Shorts form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789471253/black_short_1_vzynuh.mp4",
    posterUrl: "/images/shortformvideoposters/shortvideoposter4.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "short-12",
    title: "Short #12",
    category: "Shorts form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789471770/Gage_reel_1_qeemre.mp4",
    posterUrl: "/images/shortformvideoposters/shortvideoposter5.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "short-13",
    title: "Short #13",
    category: "Shorts form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789471786/Alex_short_1_agkwns.mp4",
    posterUrl: "/images/shortformvideoposters/shortvideoposter6.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "short-14",
    title: "Short #14",
    category: "Shorts form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789472020/Reel_4_fnavvl.mp4",
    posterUrl: "/images/shortformvideoposters/shortvideoposter7.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "short-15",
    title: "Short #15",
    category: "Shorts form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789472093/Alexing_closing_jw0ln9.mp4",
    posterUrl: "/images/shortformvideoposters/shortvideoposter8.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "short-16",
    title: "Short #16",
    category: "Shorts form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789485735/Reel_5_ejbmvc.mp4",
    posterUrl: "/images/shortformvideoposters/shortvideoposter9.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "short-17",
    title: "Short #17",
    category: "Shorts form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789485082/Reel-9_qm1qmz.mp4",
    posterUrl: "/images/shortformvideoposters/shortvideoposter10.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "short-18",
    title: "Short #18",
    category: "Shorts form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789485068/reel-7_py9rkc.mp4",
    posterUrl: "/images/shortformvideoposters/shortvideoposter11.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "short-19",
    title: "Short #19",
    category: "Shorts form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789481191/Reel_01_p64dct.mp4",
    posterUrl: "/images/montageposters/montage-poster4.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "short-20",
    title: "Short #20",
    category: "Shorts form edits",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789485708/Reel_09_wszdtq.mp4",
    posterUrl: "/images/montageposters/montage-poster5.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },

  {
    id: "th-4",
    title: "Long form #4",
    category: "Talking Heads",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789474628/Faadi_1_asqfaz.mp4",
    posterUrl: "/images/longformvideoposters/longform4.png",
    aspect: "aspect-[16/9]",
    isVertical: false,
  },
  {
    id: "th-6",
    title: "Long form #6",
    category: "Talking Heads",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789474465/Spirit_airline_wcoflo.mp4",
    posterUrl: "/images/longformvideoposters/longform6.png",
    aspect: "aspect-[16/9]",
    isVertical: false,
  },
  {
    id: "th-7",
    title: "Long form #7",
    category: "Talking Heads",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789473496/Harel_g4s1bp.mp4",
    posterUrl: "/images/longformvideoposters/longform7.png",
    aspect: "aspect-[16/9]",
    isVertical: false,
  },
  {
    id: "th-9",
    title: "Long form #9",
    category: "Talking Heads",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789478131/PROFIT_MAX_vmv64g.mp4",
    posterUrl: "/images/longformvideoposters/longform9.png",
    aspect: "aspect-[16/9]",
    isVertical: false,
  },
  {
    id: "th-10",
    title: "Long form #10",
    category: "Talking Heads",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789480611/how_to_get_rid_of_moss_on_roofs_q1prfb.mp4",
    posterUrl: "/images/longformvideoposters/longform10.png",
    aspect: "aspect-[16/9]",
    isVertical: false,
  },
  {
    id: "th-11",
    title: "Long form #11",
    category: "Talking Heads",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789483221/The_Hardest_Lesson_I_Learned_as_a_YouTuber_r0efqs.mp4",
    posterUrl: "/images/longformvideoposters/longform11.png",
    aspect: "aspect-[16/9]",
    isVertical: false,
  },
  {
    id: "montage-1",
    title: "Montage #1",
    category: "Montage style",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789481156/Reel_04_c8woob.mp4",
    posterUrl: "/images/montageposters/montage-poster3.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "montage-2",
    title: "Montage #2",
    category: "Montage style",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789486847/Short_4_revise_o3a97r.mp4",
    posterUrl: "/images/montageposters/mv2.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "montage-3",
    title: "Montage #3",
    category: "Montage style",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789486853/short_7_lcc3nm.mp4",
    posterUrl: "/images/montageposters/mv3.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "montage-4",
    title: "Montage #4",
    category: "Montage style",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789486858/Short_6_xmvlfh.mp4",
    posterUrl: "/images/montageposters/mv4.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "montage-5",
    title: "Montage #5",
    category: "Montage style",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789486867/Short_3_chexhi.mp4",
    posterUrl: "/images/montageposters/mv5.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "realestate-1",
    title: "RealEstate #1",
    category: "Real Estate",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789477840/Han_reel_1_ik1u7i.mp4",
    posterUrl: "/images/montageposters/montage-poster1.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "realestate-2",
    title: "RealEstate #2",
    category: "Real Estate",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789478071/Diceman_drive_keykmv.mp4",
    posterUrl: "/images/montageposters/montage-poster2.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "realestate-3",
    title: "RealEstate #3",
    category: "Real Estate",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788184746/reel-1_wveaag.mp4",
    posterUrl: "/images/video-tn/five.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "realestate-4",
    title: "RealEstate #4",
    category: "Rea lEstate",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1788184788/Nade_reel-1_revise_ejrqar.mp4",
    posterUrl: "/images/video-tn/six.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "realestate-5",
    title: "RealEstate #5",
    category: "Real Estate",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789471166/Ali_reel_1_rev_rhealk.mp4",
    posterUrl: "/images/shortformvideoposters/shortvideoposter2.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "realestate-6",
    title: "RealEstate #6",
    category: "Real Estate",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1789472093/Alexing_closing_jw0ln9.mp4",
    posterUrl: "/images/shortformvideoposters/shortvideoposter8.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "realestate-7",
    title: "RealEstate #7",
    category: "Real Estate",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1791554813/Leslie_Losing_v4m1k1.mp4",
    posterUrl: "https://res.cloudinary.com/dlurrugno/image/upload/v1791557766/Screenshot_2026-10-09_195252_fnbrdu.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "realestate-8",
    title: "RealEstate #8",
    category: "Real Estate",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1791554912/Ruth_Closing_uqhihw.mp4",
    posterUrl: "https://res.cloudinary.com/dlurrugno/image/upload/v1791557810/Screenshot_2026-10-09_195628_naxasl.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "realestate-9",
    title: "RealEstate #9",
    category: "Real Estate",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1791554990/recruitment_1_imlb7q.mp4",
    posterUrl: "https://res.cloudinary.com/dlurrugno/image/upload/v1791557767/Screenshot_2026-10-09_195534_u6owiu.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "realestate-10",
    title: "RealEstate #10",
    category: "Real Estate",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1791555050/Recruitment_1_ffrkib.mp4",
    posterUrl: "https://res.cloudinary.com/dlurrugno/image/upload/v1791557797/Screenshot_2026-10-09_195341_tshvul.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
  {
    id: "realestate-11",
    title: "RealEstate #11",
    category: "Real Estate",
    videoUrl:
      "https://res.cloudinary.com/dlurrugno/video/upload/v1791555056/recruitment_3_pkdoj8.mp4",
    posterUrl: "https://res.cloudinary.com/dlurrugno/image/upload/v1791555249/Screenshot_2026-10-09_191223_n2kjj9.png",
    aspect: "aspect-[9/16]",
    isVertical: true,
  },
];

function VideoThumb({ video, onOpen }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => video.videoUrl && onOpen(video)}
      aria-label={`Play video: ${video.title}`}
      className="group block w-full text-left cursor-pointer self-start"
    >
      <span
        className={`relative block w-full ${
          video.aspect || (video.isVertical ? "aspect-[9/16]" : "aspect-[16/9]")
        } overflow-hidden rounded-lg bg-gray-200`}
      >
        {!loaded && <span aria-hidden="true" className="absolute inset-0 animate-pulse bg-black/[0.07]" />}
        <Image
          src={video.posterUrl}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onLoad={() => setLoaded(true)}
          className={`object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
        <span className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition-transform duration-200 group-hover:scale-105">
            <Play className="h-4 w-4 fill-black ml-0.5" />
          </span>
        </span>
      </span>
      <span className="mt-2 block text-[13px] font-medium text-gray-700 line-clamp-1">{video.title}</span>
    </button>
  );
}

export default function CollectionPortfolio() {
  const [activeTab] = useState("videos");
  const [activeCategory, setActiveCategory] = useState("Long form edits");
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Lock page scroll and allow Esc to close while the video popup is open
  useEffect(() => {
    if (!selectedVideo) return;
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") setSelectedVideo(null);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedVideo]);

  const currentCategories =
    activeTab === "graphics" ? graphicsCategories : videosCategories;

  const filteredVideos = videosItems.filter(
    (item) => item.category.toLowerCase().trim() === activeCategory.toLowerCase().trim()
  );

  const hasMixedVideos =
    filteredVideos.some((v) => !v.isVertical) &&
    filteredVideos.some((v) => v.isVertical);
  const longVideos = filteredVideos.filter((v) => !v.isVertical);
  const shortVideos = filteredVideos.filter((v) => v.isVertical);

  const renderVideoCard = (video) => (
    <VideoThumb key={video.id} video={video} onOpen={setSelectedVideo} />
  );

  const filteredGraphics = graphicsItems.filter(
    (item) => item.category.toLowerCase().trim() === activeCategory.toLowerCase().trim()
  );

  return (
    <section
      id="portfolio"
      className={`${jakarta.className} relative w-full bg-[#FAFAFA] text-black pt-12 sm:pt-16 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden scroll-mt-20`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-10">
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">
            Portfolio
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight">
            <span>Featured </span>
            <span className={`${playfair.className} italic font-normal text-gray-900`}>
              Projects
            </span>
          </h2>
          <p className="mt-3 text-gray-600 text-sm sm:text-base max-w-xl">
            A curated look at standout creations across industries and formats.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-12">
          {/* Categories: swipeable chips on mobile, plain list on desktop */}
          <nav aria-label="Work categories" className="w-full lg:w-56 shrink-0 lg:sticky lg:top-24 min-w-0">
            <h3 className="hidden lg:block mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Our Work
            </h3>

            <ul className="flex lg:flex-col gap-2 lg:gap-0 overflow-x-auto lg:overflow-visible no-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 pb-1 lg:pb-0 lg:border-l lg:border-gray-200">
              {currentCategories.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <li key={category} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      aria-pressed={isActive}
                      className={`whitespace-nowrap cursor-pointer text-sm transition-colors rounded-full px-4 py-2 border lg:rounded-none lg:border-0 lg:border-l-2 lg:-ml-px lg:px-4 lg:py-2.5 lg:text-left lg:w-full ${
                        isActive
                          ? "bg-gray-950 text-white border-gray-950 font-semibold lg:bg-transparent lg:text-gray-950 lg:border-gray-950"
                          : "bg-white text-gray-700 border-gray-300 hover:text-black lg:bg-transparent lg:border-transparent lg:text-gray-500 lg:hover:border-gray-400"
                      }`}
                    >
                      {category}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

    
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
                  hasMixedVideos ? (
                    <div className="space-y-10">
                      <div>
                        <h4 className="mb-4 text-base font-semibold text-gray-950">Long form <span className="text-gray-400 font-normal">({longVideos.length})</span></h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-6">
                          {longVideos.map(renderVideoCard)}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-200">
                        <h4 className="mb-4 mt-8 text-base font-semibold text-gray-950">Shorts <span className="text-gray-400 font-normal">({shortVideos.length})</span></h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-5">
                          {shortVideos.map(renderVideoCard)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-5">
                      {filteredVideos.map(renderVideoCard)}
                    </div>
                  )
                ) : (
                  <div className="w-full py-16 sm:py-20 px-6 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
                    <Video className="w-6 h-6 text-gray-400 mb-3" />
                    <h3 className="text-gray-950 text-lg sm:text-xl font-bold mb-1.5">
                      {activeCategory}
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm max-w-md mb-5 font-medium">
                      No videos uploaded yet in this category. Content will be added here soon.
                    </p>
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
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
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
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 overscroll-contain"
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
                  ? "w-full max-w-sm aspect-[9/16] max-h-[90dvh]"
                  : "w-full max-w-4xl aspect-video"
              }`}
            >
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/70 hover:bg-black text-white transition-colors cursor-pointer"
                aria-label="Close video player"
              >
                <X size={20} />
              </button>

              <video
                key={selectedVideo.videoUrl}
                src={selectedVideo.videoUrl}
                autoPlay
                controls
                controlsList="nodownload"
                disablePictureInPicture
                onContextMenu={(e) => e.preventDefault()}
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
