"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Urbanist } from "next/font/google";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export default function Navbar({ hideHiring = false } = {}) {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isPricing = pathname === "/pricing" || pathname === "/our-work";

  const toggleMenu = (menu) => setOpenMenu(openMenu === menu ? null : menu);
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenMenu(null);
  };

  return (
    <>

      <nav className={`${urbanist.className} fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 text-white">
          <Link href="/" className="text-2xl font-semibold tracking-wide z-50">
            <Image
              src="/logos/arlogo.png"
              alt="AfterRender"
              width={180}
              height={45}
              priority
              className="w-[145px] xs:w-[170px] sm:w-[190px] lg:w-[185px] h-auto object-contain"
            />
          </Link>

          <div
            className="hidden lg:flex items-center space-x-7 text-sm font-medium"
           >
            <Link
              href="/our-work"
              className={`transition-colors ${
                isPricing
                  ? "text-black hover:text-[#59B7FF]"
                  : "hover:text-[#59B7FF]"
              }`}
            >
              Our Work
            </Link>


            <Link
              href="/pricing"
              className={`transition-colors ${
                isPricing
                  ? "text-black hover:text-[#59B7FF]"
                  : "hover:text-[#59B7FF]"
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/blogs"
              className={`transition-colors ${
                isPricing
                  ? "text-black hover:text-[#59B7FF]"
                  : "hover:text-[#59B7FF]"
              }`}
            >
              Blogs
            </Link>
            <Link
              href="#contact"
              className={`transition-colors ${
                isPricing
                  ? "text-black hover:text-[#59B7FF]"
                  : "hover:text-[#59B7FF]"
              }`}
            >
              Contact
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <Link
              target="_blank"
              href="https://calendly.com/afterrenderagency/new-meeting"
              className="cursor-pointer ml-3 bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] text-xs lg:text-sm text-[#0A2540] font-semibold px-5 py-2.5 rounded-lg shadow-md hover:scale-105 hover:shadow-lg hover:brightness-110 transition-all duration-300"
            >
              Book a Call
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden z-50 p-2 transition-colors ${
              isPricing
                ? "text-black hover:text-[#59B7FF]"
                : "hover:text-[#59B7FF]"
            }`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Dim Backdrop - Clean & lag-free (no heavy dynamic blur) */}
              <motion.div
                key="mobile-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden fixed inset-0 bg-black/70 z-40"
                onClick={closeMobileMenu}
                aria-hidden="true"
              />

              {/* Mobile Drawer (Old Theme + 60FPS Lag-Free Hardware Acceleration) */}
              <motion.div
                key="mobile-menu"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "transform", transform: "translateZ(0)" }}
                className="lg:hidden fixed top-0 right-0 h-screen w-full sm:w-80 overflow-y-auto z-50 flex flex-col justify-between text-white shadow-2xl bg-[#080B10]"
              >
                {/* Background Layer with old theme */}
                <div
                  className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-40"
                  style={{ backgroundImage: "url('/images/herobg.png')" }}
                />
                <div className="absolute inset-0 bg-black/65 pointer-events-none" />

                {/* Drawer Content */}
                <div className="relative z-10 flex flex-col h-full pt-6 pb-8 px-6 justify-between">
                  <div>
                    {/* Top Bar: Back & Cancel Header */}
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/15">
                      <button
                        type="button"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-200 hover:text-white bg-white/10 hover:bg-white/20 active:scale-95 px-3 py-1.5 rounded-full transition-all cursor-pointer"
                        aria-label="Back / Cancel"
                      >
                        <ArrowLeft size={14} />
                        <span>Back</span>
                      </button>

                      <button
                        type="button"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-1 text-xs font-medium text-gray-300 hover:text-white px-2.5 py-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                        aria-label="Cancel / Close"
                      >
                        <X size={18} />
                        <span>Cancel</span>
                      </button>
                    </div>

                    {/* Apply Now Banner (Old Theme) */}
                    <div className="mb-5 text-center">
                      <div className="relative inline-block w-full">
                        <span className="absolute -top-1 -right-1 z-10 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white shadow-xs"></span>
                        </span>

                        <Link
                          href="/apply"
                          onClick={closeMobileMenu}
                          className="relative flex flex-col items-center justify-center gap-0.5 py-3 px-6 bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] text-[#0A2540] rounded-xl text-center shadow-lg transition-all duration-200 hover:brightness-105 active:scale-[0.98]"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 leading-none">
                            Hiring Talent
                          </span>
                          <span className="text-base font-bold tracking-tight">
                            Apply Now
                          </span>
                        </Link>
                      </div>
                    </div>



                    {/* Navigation Links (Old Theme) */}
                    <div className="flex flex-col space-y-1 mt-1">
                      <Link
                        href="/our-work"
                        onClick={closeMobileMenu}
                        className="py-2.5 text-white hover:text-[#59B7FF] transition-colors font-semibold text-lg sm:text-xl"
                      >
                        Our Work
                      </Link>

                      <Link
                        href="/pricing"
                        onClick={closeMobileMenu}
                        className="py-2.5 text-white hover:text-[#59B7FF] transition-colors font-semibold text-lg sm:text-xl"
                      >
                        Pricing
                      </Link>

                      <Link
                        href="/blogs"
                        onClick={closeMobileMenu}
                        className="py-2.5 text-white hover:text-[#59B7FF] transition-colors font-semibold text-lg sm:text-xl"
                      >
                        Blogs
                      </Link>

                      <Link
                        href="#contact"
                        onClick={closeMobileMenu}
                        className="py-2.5 text-white hover:text-[#59B7FF] transition-colors font-semibold text-lg sm:text-xl"
                      >
                        Contact
                      </Link>
                    </div>
                  </div>

                  {/* Book a Call Button (Old Theme) */}
                  <div className="pt-4 mt-6">
                    <Link
                      href="https://calendly.com/afterrenderagency/new-meeting"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                      className="block text-center bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] text-[#0A2540] font-semibold text-sm sm:text-base px-6 py-3 rounded-lg shadow-lg hover:brightness-105 active:scale-[0.98] transition-all duration-200"
                    >
                      Book a Call
                    </Link>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

    </>

  );
}