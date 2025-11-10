"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Facebook, Instagram, Youtube, Menu, X } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenMenu(null);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 text-white">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-semibold tracking-wide z-50">
          <Image
            src="/logos/logo.png"
            alt="AfterRender Logo"
            width={180}
            height={45}
            className="sm:w-[220px] sm:h-14"
          />
        </Link>

        {/* Desktop Nav Links - Hidden on mobile/tablet */}
        <div className="hidden lg:flex items-center space-x-8" style={{ fontFamily: "montserrat" }}>
          
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

          <Link href="/social-media" className="hover:text-[#59B7FF] transition-colors">
            Social Media Presence
          </Link>
          <Link href="#contact" className="hover:text-[#59B7FF] transition-colors">
            Contact
          </Link>
        </div>

        {/* Desktop Social + CTA - Hidden on mobile/tablet */}
        <div className="hidden lg:flex items-center space-x-5">
          
      

          <Link
            href="/book-call"
            style={{ fontFamily: "montserrat" }}
            className="cursor-pointer ml-4 bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] text-base text-[#0A2540] font-semibold px-8 py-3 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl hover:brightness-110 transition-all duration-300"
          >
            Book a Call
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden z-50 p-2 hover:text-[#59B7FF] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
<AnimatePresence>
  {mobileMenuOpen && (
    <motion.div
      key="mobile-menu"
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
      className="lg:hidden fixed top-0 right-0 h-screen w-full sm:w-80  overflow-hidden rounded-l-2xl shadow-2xl"
    >
      {/* --- Background Image --- */}
      <motion.div
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/herobg.png')", // 👈 replace with your image path
        }}
      />

      {/* --- Black Gradient Overlay --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-black "
      />

      {/* --- Menu Content --- */}
      <div
        className="relative   flex flex-col h-full pt-20 px-6 text-white z-10"
        style={{ fontFamily: "montserrat" }}
      >
        {/* Videos Dropdown */}
        <div className="mb-4">
          <button
            onClick={() => toggleMenu("videos-mobile")}
            className="flex items-center justify-between w-full py-3 text-white hover:text-[#59B7FF] transition-colors text-xl font-semibold"
          >
            VIDEOS
            <ChevronDown
              size={20}
              className={`transform transition-transform ${
                openMenu === "videos-mobile" ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {openMenu === "videos-mobile" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden pl-4 mt-2"
              >
                {[
                  { name: "VSL Videos", href: "/videos/vsl" },
                  { name: "SaaS Videos", href: "/videos/saas" },
                  { name: "Talking Head Videos", href: "/videos/talking-head" },
                  { name: "Documentaries", href: "/videos/documentaries" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMobileMenu}
                      className=" py-2.5 text-lg text-gray-200 hover:text-[#59B7FF] transition-all flex items-center gap-2"
                    >
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full bg-[#48A2FF]"
                        whileHover={{
                          scale: 1.5,
                          boxShadow: "0 0 6px #48A2FF",
                        }}
                      />
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Other Links */}
        <Link
          href="/social-media"
          onClick={closeMobileMenu}
          className="py-3 text-white hover:text-[#59B7FF] font-semibold transition-colors text-xl"
        >
          Social Media Presence
        </Link>

        <Link
          href="#contact"
          onClick={closeMobileMenu}
          className="py-3 text-white hover:text-[#59B7FF] transition-colors  font-semibold text-xl"
        >
          Contact
        </Link>

        {/* Social Icons */}
        <div className="flex items-center space-x-6 py-6 border-t border-white/20 mt-6">
          <Link href="https://www.facebook.com/p/AfterRender-61563053082911/" target="_blank" className="hover:text-[#59B7FF]">
            <Facebook size={24} />
          </Link>
          <Link href="https://www.instagram.com/afterrender/?hl=en" target="_blank" className="hover:text-[#59B7FF]">
            <Instagram size={24} />
          </Link>
          <Link href="https://www.youtube.com/@AfterRender" target="_blank" className="hover:text-[#59B7FF]">
            <Youtube size={24} />
          </Link>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            href="/book-call"
            onClick={closeMobileMenu}
            className="mt-4 block text-center bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] text-[#0A2540] font-semibold px-6 py-3 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            Book a Call
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )}
</AnimatePresence>


      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 bg-black/10 backdrop-blur-sm -z-10"
            onClick={closeMobileMenu}
          />
        )}
      </AnimatePresence>
    </nav>
  );
}