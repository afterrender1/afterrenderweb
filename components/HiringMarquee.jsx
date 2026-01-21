"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const messages = [
    { icon: "🚀", role: "Top Talent" },
    { icon: "💻", role: "WordPress Dev" },
    { icon: "⚡", role: "Fullstack Dev" },
    { icon: "🌐", role: "MERN Dev" },
    { icon: "🛠️", role: "Backend Dev" },
    { icon: "🎨", role: "Frontend Dev" },
];

export default function CreativeHiringTicker() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % messages.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className={`${inter.className} w-full bg-[#0A2540] border-y border-white/5 py-0.5 overflow-hidden relative group`}>
            {/* Background Glow Effect */}
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <Link href="/apply" className="relative z-10 flex justify-center items-center h-6 gap-3">
                {/* Static Label */}
                <span className="text-[10px] font-black tracking-[0.3em] text-blue-400 uppercase">
                    Hiring
                </span>

                {/* Dynamic Slot */}
                <div className="h-full flex flex-col justify-center overflow-hidden border-l border-white/20 pl-3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ y: 20, opacity: 0, filter: "blur(5px)" }}
                            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                            exit={{ y: -20, opacity: 0, filter: "blur(5px)" }}
                            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                            className="flex items-center gap-2"
                        >
                            <span className="text-xs">{messages[index].icon}</span>
                            <p className="text-[10px] font-bold tracking-[0.2em] text-white/90 uppercase whitespace-nowrap">
                                {messages[index].role}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Action Label */}
                <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-[9px] font-bold tracking-widest text-white/40 uppercase group-hover:text-white transition-colors"
                >
                    Apply Now →
                </motion.span>
            </Link>
        </div>
    );
}