"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Montserrat , Poppins } from "next/font/google";
import Footer from "./Footer";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "700"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400"] });

const projects = [
    {
        id: 1,
        title: "Jave – E-Commerce Platform",
        category: "E-Commerce",
        thumbnail: "/images/our-work/jave.png",
        liveUrl: "https://javexafterrender.vercel.app",
        tags: ["E-Commerce", "Next.js", "Stripe"],
    },
    {
        id: 2,
        title: "Daily World – Blogging Platform",
        category: "Business",
        thumbnail: "/images/our-work/daily-world.png",
        liveUrl: "https://dailyworldxar.vercel.app",
        tags: ["Blog", "Node.js", "MongoDB", "Admin Panel"],
    },
    {
        id: 3,
        title: "Mobee Medical – Healthcare Website",
        category: "Healthcare",
        thumbnail: "/images/our-work/mobeemedical.png",
        liveUrl: "https://mobeemedical.vercel.app",
        tags: ["Healthcare", "Next.js", "UI/UX"],
    },
    {
        id: 4,
        title: "TMG Van – Trade Motor Group",
        category: "Business",
        thumbnail: "/images/our-work/tmgvan.png",
        liveUrl: "https://tmgvan.vercel.app",
        tags: ["Next.js", "Node.js", "Stripe", "MongoDB"],
    },
    {
        id: 5,
        title: "Ajwa Tour & Travel",
        category: "Business",
        thumbnail: "/images/our-work/att.png",
        liveUrl: "https://attxar.vercel.app",
        tags: ["Next.js", "Travel", "Landing Page"],
    },
    {
        id: 6,
        title: "Render Store – Online Shop",
        category: "E-Commerce",
        thumbnail: "/images/our-work/renderstore.png",
        liveUrl: "https://renderstore.vercel.app",
        tags: ["Next.js", "Stripe", "Firebase"],
    },
    {
        id: 7,
        title: "Deigo Hair Studio",
        category: "Business",
        thumbnail: "/images/our-work/deigo.png",
        liveUrl: "https://deigo.vercel.app",
        tags: ["Next.js", "Salon", "UI/UX"],
    },
];

const categories = ["All", "E-Commerce", "Healthcare", "Business"];

const tagColors = {
    "E-Commerce": "bg-purple-500/20 text-purple-300",
    Healthcare: "bg-emerald-500/20 text-emerald-300",
    Business: "bg-yellow-500/20 text-yellow-300",
    "Next.js": "bg-sky-500/20 text-sky-300",
    Stripe: "bg-indigo-500/20 text-indigo-300",
    MongoDB: "bg-green-500/20 text-green-300",
    "Node.js": "bg-lime-500/20 text-lime-300",
    Firebase: "bg-orange-500/20 text-orange-300",
    "UI/UX": "bg-pink-500/20 text-pink-300",
};


const WorkCard = ({ title, category, thumbnail, tags, liveUrl }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 30 }}
    transition={{ duration: 0.4 }}
    className={`group h-full rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 hover:border-blue-500/40 transition ${montserrat.className}`}
  >
    <div className="flex flex-col h-full">
      
      <div className="relative rounded-2xl overflow-hidden mb-6 aspect-video bg-gray-900">
        <span className="absolute top-3 left-3 z-10 bg-black/50 backdrop-blur px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-lg border border-white/10 text-white">
          {category}
        </span>

        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
          <span className="text-white text-xs tracking-wider">
            Visit Website →
          </span>
        </div>
      </div>

      <h3 className="text-white text-xl font-semibold mb-4  transition">
        {title}
      </h3>

      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`${tagColors[tag] || "bg-white/10 text-white/70"} px-3 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider`}
          >
            {tag}
          </span>
        ))}
      </div>

      <a
        href={liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto block text-center rounded-xl bg-white/10 py-3 text-sm font-semibold text-white hover:bg-white hover:text-black transition"
      >
        View Live Project
      </a>
    </div>
  </motion.div>
);


const OurWork = () => {
    const [activeTab, setActiveTab] = useState("All");

    const filteredProjects =
        activeTab === "All"
            ? projects
            : projects.filter((p) => p.category === activeTab);

    return (
   <>
        <section className="relative min-h-screen bg-[#050505] py-28 px-6 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/herobg.png')] bg-cover opacity-20" />
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full" />

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className={`max-w-3xl mb-16 ${poppins.className }`}>
                    <span className="text-blue-400 text-sm font-bold tracking-[0.3em] uppercase block mb-4">
                        Our Work
                    </span>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Real projects.
                        <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300">
                            Real results.
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg">
                        A selection of production-ready websites built with modern
                        technologies like Next.js, Node.js, MongoDB, Stripe, and Firebase.
                    </p>
                </div>

                {/* Filters */}
                <div className={`flex flex-wrap gap-3 mb-12 ${poppins.className}`}>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`px-6 py-2 rounded-full cursor-pointer text-sm font-medium border transition ${activeTab === cat
                                    ? "bg-white text-black border-white"
                                    : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project) => (
                            <WorkCard key={project.id} {...project} />
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>


        </section>



   </>
        
    );
};

export default OurWork;