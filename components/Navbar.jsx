"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = (menu) => setOpenMenu(openMenu === menu ? null : menu);
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenMenu(null);
  };

  const handleVideoClick = (id) => {
    closeMobileMenu();
    if (pathname === "/") {
      const section = document.getElementById(id);
      section?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${id}`);
    }
  };

  // Fixed missing closing brace and logic for work click
  const handleWorkClick = (href) => {
    closeMobileMenu();
    router.push(href);
  };

  const videoLinks = [
    { name: "VSL Videos", id: "v1" },
    { name: "SaaS Videos", id: "v3" },
    { name: "Talking Head Videos", id: "v6" },
    { name: "Documentaries", id: "v9" },
  ];

  const workLinks = [
    { name: "Social Media Presence", href: "/social-media" },
    { name: "Live Web Projects", href: "/our-work" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 text-white">
        {/* Logo */}
        <Link href="/" className="text-2xl font-semibold tracking-wide z-50">
          <Image
            src="/logos/arlogo.png"
            alt="AfterRender"
            width={180}
            height={45}
            className="sm:w-[220px] sm:h-14"
          />
        </Link>

        {/* Desktop Nav Links */}
        <div
          className="hidden lg:flex items-center space-x-8"
          style={{ fontFamily: "montserrat" }}
        >
          {/* Videos Dropdown */}
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
                  {videoLinks.map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.15 }}
                    >
                      <button
                        onClick={() => handleVideoClick(item.id)}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-800 relative overflow-hidden group transition-all duration-300"
                      >
                        <span className="absolute left-0 top-0 h-full w-0.5 bg-[#48A2FF] opacity-0 group-hover:opacity-100 group-hover:w-1 transition-all duration-300" />
                        <span className="relative z-10 group-hover:text-[#48A2FF] transition-colors duration-300">
                          {item.name}
                        </span>
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Work Dropdown - Fixed Label */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("work")}
              className="flex items-center gap-1 hover:text-[#59B7FF] transition-colors"
            >
              Solutions <ChevronDown size={18} />
            </button>

            <AnimatePresence>
              {openMenu === "work" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-10 left-0 bg-white text-black shadow-xl rounded-xl w-56 py-2 overflow-hidden"
                >
                  {workLinks.map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.15 }}
                    >
                      <button
                        onClick={() => handleWorkClick(item.href)}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-800 relative overflow-hidden group transition-all duration-300"
                      >
                        <span className="absolute left-0 top-0 h-full w-0.5 bg-[#48A2FF] opacity-0 group-hover:opacity-100 group-hover:w-1 transition-all duration-300" />
                        <span className="relative z-10 group-hover:text-[#48A2FF] transition-colors duration-300">
                          {item.name}
                        </span>
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

         
          <Link
            href="#contact"
            className="hover:text-[#59B7FF] transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center space-x-5">
          <Link
            target="_blank"
            href="https://calendly.com/afterrenderagency/30min"
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
            className="lg:hidden fixed top-0 right-0 h-screen w-full sm:w-80 overflow-hidden rounded-l-2xl shadow-2xl"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/herobg.png')" }}
            />
            <div className="absolute inset-0 bg-black/60" />

            <div
              className="relative flex flex-col h-full pt-20 px-6 text-white z-10"
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
                    className={`transform transition-transform ${openMenu === "videos-mobile" ? "rotate-180" : ""
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
                      {videoLinks.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <button
                            onClick={() => handleVideoClick(item.id)}
                            className="py-2.5 text-lg text-gray-200 hover:text-[#59B7FF] transition-all flex items-center gap-2 w-full text-left"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#48A2FF]" />
                            {item.name}
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/social-media"
                onClick={closeMobileMenu}
                className="py-3 text-white hover:text-[#59B7FF] transition-colors font-semibold text-xl"
              >
                Social Media Presence
              </Link>
              <Link
                href="/our-work"
                onClick={closeMobileMenu}
                className="py-3 text-white hover:text-[#59B7FF] transition-colors font-semibold text-xl"
              >
                Live Web Projects <span></span>
              </Link>

              <Link
                href="#contact"
                onClick={closeMobileMenu}
                className="py-3 text-white hover:text-[#59B7FF] transition-colors font-semibold text-xl"
              >
                Contact
              </Link>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  href="https://calendly.com/afterrenderagency/30min"
                  target="_blank"
                  rel="noopener noreferrer"
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

      {/* Overlay */}
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