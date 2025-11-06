"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Facebook, Instagram, Youtube } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 text-white">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-semibold tracking-wide">
          <Image
            src="/logos/logo.png"
            alt="AfterRender Logo"
            width={220}
            height={56}
          />
        </Link>

        {/* Center Nav Links */}
        <div className="flex items-center space-x-8" style={{fontFamily : "montserrat"}}>
          <Link href="/" className="hover:text-[#59B7FF] transition-colors">Home</Link>
          <Link href="/about" className="hover:text-[#59B7FF] transition-colors">About</Link>

          {/* Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1 hover:text-[#59B7FF] transition-colors"
            >
              Services <ChevronDown size={18} />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-10 left-0 bg-white text-black shadow-lg rounded-xl w-48 py-2"
                >
                  <Link
                    href="/services/video-editing"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Video Editing
                  </Link>
                  <Link
                    href="/services/web-development"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Web Development
                  </Link>
                  <Link
                    href="/services/reels-shorts"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Reels & Shorts
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/contact" className="hover:text-[#59B7FF] transition-colors">Contact</Link>
        </div>

        {/* Social + CTA */}
        <div className="flex items-center space-x-5">
          <Link href="https://facebook.com" target="_blank" className="hover:text-[#00FFC6]">
            <Facebook size={20} />
          </Link>
          <Link href="https://instagram.com" target="_blank" className="hover:text-[#00FFC6]">
            <Instagram size={20} />
          </Link>
          <Link href="https://youtube.com" target="_blank" className="hover:text-[#00FFC6]">
            <Youtube size={20} />
          </Link>

          <Link
            href="/book-call"
            style={{fontFamily : "montserrat"}} className="cursor-pointer ml-4 bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] text-base text-[#0A2540] font-semibold px-8 py-3 rounded-lg  shadow-lg hover:scale-105 hover:shadow-xl hover:brightness-110 transition-all duration-300"
          >
            Book a Call
          </Link>
        </div>
      </div>
    </nav>
  );
}
