"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Facebook, Instagram, Youtube } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

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
        <div className="flex items-center space-x-8" style={{ fontFamily: "montserrat" }}>
          
          {/* --- VIDEOS Dropdown --- */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("videos")}
              className="flex items-center gap-1 hover:text-[#59B7FF] transition-colors"
            >
              Videos <ChevronDown size={18} />
            </button>

            <AnimatePresence>
              {openMenu === "videos" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-10 left-0 bg-white text-black shadow-xl rounded-xl w-56 py-2 overflow-hidden"
                >
            {[
  { name: "VSL Videos", href: "/videos/vsl" },
  { name: "SaaS Videos", href: "/videos/saas" },
  { name: "Talking Head Videos", href: "/videos/talking-head" },
  { name: "Documentaries", href: "/videos/documentaries" },
].map((item, i) => (
  <motion.div
    key={i}
    whileHover={{ x: 4 }}
    transition={{ duration: 0.15 }}
  >
    <Link
      href={item.href}
      className="block px-4 py-2.5 text-sm text-gray-800 relative overflow-hidden group transition-all duration-300"
    >
      {/* Left hover accent line */}
      <span className="absolute left-0 top-0 h-full w-0.5 bg-[#48A2FF] opacity-0 group-hover:opacity-100 group-hover:w-1 transition-all duration-300" />

      <span className="relative z-10 group-hover:text-[#48A2FF] transition-colors duration-300">
        {item.name}
      </span>
    </Link>
  </motion.div>
))}

                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/about" className="hover:text-[#59B7FF] transition-colors">
            About
          </Link>
          <Link href="/services" className="hover:text-[#59B7FF] transition-colors">
            Services
          </Link>
          <Link href="/contact" className="hover:text-[#59B7FF] transition-colors">
            Contact
          </Link>
        </div>

        {/* Social + CTA */}
        <div className="flex items-center space-x-5">
          <Link href="https://facebook.com" target="_blank" className="hover:text-[#59B7FF]">
            <Facebook size={20} />
          </Link>
          <Link href="https://instagram.com" target="_blank" className="hover:text-[#59B7FF]">
            <Instagram size={20} />
          </Link>
          <Link href="https://youtube.com" target="_blank" className="hover:text-[#59B7FF]">
            <Youtube size={20} />
          </Link>

          <Link
            href="/book-call"
            style={{ fontFamily: "montserrat" }}
            className="cursor-pointer ml-4 bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] text-base text-[#0A2540] font-semibold px-8 py-3 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl hover:brightness-110 transition-all duration-300"
          >
            Book a Call
          </Link>
        </div>
      </div>
    </nav>
  );
}
