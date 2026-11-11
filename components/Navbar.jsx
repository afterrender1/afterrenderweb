"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Urbanist } from "@/app/lib/fonts";
import ServicesDropdown, { SERVICES } from "./ServicesDropdown";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export default function Navbar({ hideHiring = false, logo = null } = {}) {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // The drawer stays in the DOM for its CSS transition; only load its
  // background image once it has actually been opened.
  const [menuOpenedOnce, setMenuOpenedOnce] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isPricing =
    pathname === "/pricing" ||
    pathname === "/our-work" ||
    pathname === "/about-us" ||
    pathname === "/real-estate" ||
    pathname === "/website" ||
    pathname === "/ai-avatars" ||
    pathname === "/privacy-policy" ||
    pathname === "/refund-policy" ||
    pathname === "/terms-conditions";

  const currentLogo =
    logo || "/logos/arlogo.png";

  const toggleMenu = (menu) => setOpenMenu(openMenu === menu ? null : menu);
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenMenu(null);
  };

  // Lock background scroll while the mobile drawer is open
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [mobileMenuOpen]);

  // Mobile drawer: "Services" expands its links inline
  const mobileServicesOpen = openMenu === "services";

  // Scroll to #contact on page navigation if hash exists
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.location.hash === "#contact") {
      const scrollToContact = () => {
        const el = document.getElementById("contact");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      };

      scrollToContact();
      const t1 = setTimeout(scrollToContact, 150);
      const t2 = setTimeout(scrollToContact, 400);
      const t3 = setTimeout(scrollToContact, 800);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [pathname]);

  const handleContactClick = (e) => {
    e.preventDefault();
    closeMobileMenu();

    if (pathname === "/") {
      const el = document.getElementById("contact");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", "#contact");
      }
    } else {
      router.push("/#contact");
    }
  };

  return (
    <>

      <nav className={`${urbanist.className} fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 text-white">
          <Link href="/" className="text-2xl font-semibold tracking-wide z-50">
            <Image
              src={currentLogo}
              alt="AfterRender"
              width={180}
              height={45}
              priority
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 640px) 145px, (max-width: 1024px) 170px, 185px"
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
            <ServicesDropdown
              triggerClassName={isPricing ? "text-black hover:text-[#59B7FF]" : "hover:text-[#59B7FF]"}
            />
            <Link
              href="/about-us"
              className={`transition-colors ${
                isPricing
                  ? "text-black hover:text-[#59B7FF]"
                  : "hover:text-[#59B7FF]"
              }`}
            >
              About Us
            </Link>
            <Link
              href="/#contact"
              onClick={handleContactClick}
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
              className="cursor-pointer ml-3 text-xs lg:text-sm font-bold px-5 py-2.5 rounded-lg shadow-md hover:scale-105 hover:shadow-lg hover:brightness-105 transition-all duration-300 bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] text-[#0A2540]"
            >
              Book a Call
            </Link>
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setMenuOpenedOnce(true);
            }}
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

        {/* CSS transitions instead of framer-motion: keeps animation code out of the initial JS */}
        <>
              {/* Dim Backdrop - Clean & lag-free (no heavy dynamic blur) */}
              <div
                className={`lg:hidden fixed inset-0 bg-black/70 z-40 transition-opacity duration-200 ${
                  mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={closeMobileMenu}
                aria-hidden="true"
              />

              {/* Mobile Drawer (Old Theme + 60FPS Lag-Free Hardware Acceleration) */}
              <div
                inert={!mobileMenuOpen}
                aria-hidden={!mobileMenuOpen}
                className={`lg:hidden fixed top-0 right-0 h-dvh w-full max-w-sm sm:w-80 overflow-y-auto overscroll-contain z-50 flex flex-col justify-between text-white shadow-2xl bg-[#080B10] will-change-transform transition-[translate,visibility] duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  mobileMenuOpen ? "translate-x-0 visible" : "translate-x-full invisible"
                }`}
              >
                {/* Background Layer with old theme */}
                <div
                  className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-40"
                  style={menuOpenedOnce ? { backgroundImage: "url('/images/herobg.png')" } : undefined}
                />
                <div className="absolute inset-0 bg-black/65 pointer-events-none" />

                {/* Drawer Content */}
                <div className="relative z-10 flex min-h-full flex-col justify-between gap-8 px-6 pt-5 pb-8">
                  <div>
                    <div className="flex items-center justify-between pb-6">
                      <Link href="/" onClick={closeMobileMenu} aria-label="AfterRender home">
                        <Image src={currentLogo} alt="AfterRender" width={140} height={35} className="h-8 w-auto" />
                      </Link>
                      <button
                        type="button"
                        onClick={closeMobileMenu}
                        className="p-2 -mr-2 text-white hover:text-[#59B7FF] transition-colors cursor-pointer"
                        aria-label="Close menu"
                      >
                        <X size={28} />
                      </button>
                    </div>

                    <div className="flex flex-col">
                      {[
                        { href: "/our-work", label: "Our Work" },
                        { href: "/pricing", label: "Pricing" },
                      ].map(({ href, label }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={closeMobileMenu}
                          aria-current={pathname === href ? "page" : undefined}
                          className={`border-b border-white/10 py-4 text-xl font-semibold transition-colors ${
                            pathname === href ? "text-[#59B7FF]" : "text-white hover:text-[#59B7FF]"
                          }`}
                        >
                          {label}
                        </Link>
                      ))}

                      <div className="border-b border-white/10">
                        <button
                          type="button"
                          onClick={() => toggleMenu("services")}
                          aria-expanded={mobileServicesOpen}
                          aria-controls="mobile-services"
                          className="flex w-full items-center justify-between py-4 text-left text-xl font-semibold text-white hover:text-[#59B7FF] transition-colors cursor-pointer"
                        >
                          <span>Services</span>
                          <ChevronDown
                            size={20}
                            className={`opacity-70 transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`}
                          />
                        </button>

                        {/* Expands with a grid-rows transition (no height measuring, no JS animation) */}
                        <div
                          id="mobile-services"
                          inert={!mobileServicesOpen}
                          className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${
                            mobileServicesOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="flex flex-col gap-3 pb-4">
                              {SERVICES.map(({ href, title, image, badge }) => (
                                <Link
                                  key={href}
                                  href={href}
                                  onClick={closeMobileMenu}
                                  aria-current={pathname === href ? "page" : undefined}
                                  className={`flex items-center gap-3 text-base font-medium transition-colors ${
                                    pathname === href ? "text-[#59B7FF]" : "text-gray-200 hover:text-[#59B7FF]"
                                  }`}
                                >
                                  <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-white/10">
                                    {image && (
                                      <Image src={image} alt={title} fill sizes="36px" className="object-cover" />
                                    )}
                                  </span>
                                  <span>{title}</span>
                                  {badge && (
                                    <span className="rounded-full bg-[#59B7FF]/15 px-1.5 py-px text-[10px] font-semibold text-[#8ccbff]">
                                      {badge}
                                    </span>
                                  )}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Link
                        href="/about-us"
                        onClick={closeMobileMenu}
                        aria-current={pathname === "/about-us" ? "page" : undefined}
                        className={`border-b border-white/10 py-4 text-xl font-semibold transition-colors ${
                          pathname === "/about-us" ? "text-[#59B7FF]" : "text-white hover:text-[#59B7FF]"
                        }`}
                      >
                        About Us
                      </Link>
                      <Link
                        href="/#contact"
                        onClick={handleContactClick}
                        className="border-b border-white/10 py-4 text-xl font-semibold text-white hover:text-[#59B7FF] transition-colors"
                      >
                        Contact
                      </Link>
                    </div>
                  </div>

                  <Link
                    href="https://calendly.com/afterrenderagency/new-meeting"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMobileMenu}
                    className="block text-center font-bold text-base px-6 py-3.5 rounded-lg shadow-lg hover:brightness-105 active:scale-[0.98] transition-all duration-200 bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] text-[#0A2540]"
                  >
                    Book a Call
                  </Link>
                </div>
              </div>
        </>
      </nav>
    </>

  );
}