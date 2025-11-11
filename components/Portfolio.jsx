"use client";
import React from "react";
import {Michroma} from 'next/font/google'

const michroma = Michroma({ subsets: ['latin'],
    weight: '400',
    variable: '--font-michroma'});

const VideoCard = ({ thumbnail, title, tags }) => {
  const tagColors = {
    Scripting: "bg-cyan-400 text-black",
    ideation: "bg-green-400 text-black",
    Editing: "bg-red-400 text-black",
    SEO: "bg-yellow-400 text-black",
    Thumbnails: "bg-purple-400 text-black",
  };

  return (
    <div
      className="rounded-3xl bg-white/5 backdrop-blur-md   border border-white/10 p-6 group"
      style={{ fontFamily: "poppins" }}
    >
      {/* Video / Thumbnail */}
      <div className="relative rounded overflow-hidden mb-6 bg-gray-800 aspect-video">
        {thumbnail.includes("youtube") ? (
          <iframe
          
          loading="lazy"
            src={thumbnail}
            title={title}
            className="w-full h-full object-cover"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <>
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover"
            />
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-white bg-opacity-90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7 text-black ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Title */}
      <h3 className="text-white text-lg font-normal mb-4 leading-relaxed min-h-24">
        {title}
      </h3>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`${
              tagColors[tag] || "bg-gray-600 text-white"
            } px-4 py-1.5 rounded-full text-sm font-medium`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const Portfolio = () => {
  const videos = [
    {
      thumbnail: "https://www.youtube.com/embed/fg0t5rMbI74?si=LeAomKEbIwOa6jKe",
      title:
        "I Tried Andrew Tate's Hustlers University 4.0 With $1000 (REALISTIC Results)",
      tags: ["Scripting", "ideation", "Editing", "SEO"],
    },
    {
      thumbnail: "https://www.youtube.com/embed/rHfibRZisjI?si=W0h2BsNyEYZINQ-N",
      title: "I AUTOMATED a Faceless YouTube Channel with AI in 30 mins",
      tags: ["Scripting", "ideation", "Editing", "SEO", "Thumbnails"],
    },
    {
      thumbnail: "https://www.youtube.com/embed/5q1njhBzdF0?si=VzTTvt4Kre5BJ0d2",
      title: "I found an UNTAPPED Faceless YouTube Niche",
      tags: ["Scripting", "ideation", "Editing", "SEO", "Thumbnails"],
    },
    {
      thumbnail: "https://www.youtube.com/embed/lpKpHIhXdy0?si=d6nKjM0JKx52zfgE",
      title: "Exposing the reality of the Day Trading Industry",
      tags: ["Scripting", "ideation", "Editing", "SEO", "Thumbnails"],
    },
    {
          thumbnail: "https://www.youtube.com/embed/EaCH1Xwp9Aw?si=Q70kjgYytfgJ4o23",

      title: "Here's Why America Will Collapse In Less Than 50 Years",
      tags: ["Scripting", "ideation", "Editing"],
    },
    {
      thumbnail: "https://www.youtube.com/embed/x4gjRFvwoxc?si=3xOoMNmF9tQICtnc",
      title:
        "This Scalping Strategy is Boring, But It Made Me $28,000 in Just 30 Days!",
      tags: ["Scripting", "ideation", "Editing", "SEO", "Thumbnails"],
    },
    {
      thumbnail:
       "https://www.youtube.com/embed/Ybkqf_NjiEs?si=B4qVD8y19yQOI18u",
      title: "The Guy Behind Anime Blades… (Organic Drop Shipping)",
      tags: ["ideation", "Editing", "SEO", "Thumbnails"],
    },
    {
      thumbnail: "https://www.youtube.com/embed/hlH5Plu6XYI?si=gIqIFOZzIy5jgEbA",
      title: "Organic Dropshipping Masterclass (6+ HOUR FREE COURSE)",
      tags: ["ideation", "Editing", "Thumbnails"],
    },
    {
      thumbnail: "https://www.youtube.com/embed/tmOJgK6R-is?si=CnaPrGReOwYke86U",
      title:
        "How to ACTUALLY Design Emails With Figma for Klaviyo Email Marketing (Live Walkthrough)",
      tags: ["ideation", "Editing", "SEO", "Thumbnails"],
    },
    {
      thumbnail: "https://www.youtube.com/embed/yAK8UcNmsgs?si=-pMxJvMFQAoacAse",
      
      title:
        "How to Start Your Affiliate Marketing Business using A.I - in 15 days",
      tags: ["Scripting", "ideation", "Editing", "Thumbnails"],
    },
  ];

  return (
   <div id="videos"
  className="min-h-screen bg-contain bg-center bg-no-repeat relative py-20 px-4"
  style={{
    backgroundImage: "url('/images/herobg.png')",
    fontFamily: "poppins",
  }}
>
  {/* Overlay for better text visibility */}
  <div className="absolute inset-0 bg-black/70"></div>

  {/* Content Wrapper */}
  <div className="relative max-w-4xl mx-auto z-10">
    {/* Header */}
    <div
      className="mb-16 flex flex-col items-center text-center"
      style={{ fontFamily: "poppins" }}
    >
      <h2
        className="text-4xl md:text-5xl mb-4 font-bold lg:text-[2.8rem] text-transparent bg-clip-text tracking-wider bg-linear-to-r from-[#48A2FF] to-[#C9E4FF]"
        style={{ fontFamily: "michroma" }}
      >
        Portfolio
      </h2>
      <p className="text-gray-300 text-lg">
        Explore our latest projects and success stories
      </p>
    </div>

    {/* Video Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {videos.map((video, index) => (
        <VideoCard
          key={index}
          thumbnail={video.thumbnail}
          title={video.title}
          tags={video.tags}
        />
      ))}
    </div>
  </div>
</div>

  );
};

export default Portfolio;
