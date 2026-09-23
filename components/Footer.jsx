"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Youtube, Facebook, Phone } from "lucide-react";
import { Space_Grotesk } from "next/font/google";
import { usePathname } from "next/navigation";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const Footer = ({ theme }) => {
  const pathname = usePathname();
  const isRealEstate = pathname === "/real-estate";
  const isLight =
    theme === "light" ||
    pathname === "/pricing" ||
    pathname === "/our-work" ||
    pathname === "/about-us" ||
    isRealEstate ||
    pathname === "/privacy-policy" ||
    pathname === "/refund-policy" ||
    pathname === "/terms-conditions";

  const [currentYear, setCurrentYear] = useState(null);
  const [form, setForm] = useState({ email: "" });
  const [messageSent, setMessageSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessageSent(false);
    setError("");

    try {
      const res = await fetch("/api/footer-send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ email: "" });
        setMessageSent(true);
        setTimeout(() => setMessageSent(false), 3000);
      } else {
        setError("Failed to send message. Please try again later.");
        setTimeout(() => setError(""), 3000);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setError("Something went wrong. Try again.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`${spaceGrotesk.className} relative ${
        isLight
          ? "mx-4 sm:mx-6 mt-8 mb-0 rounded-3xl bg-[#F4F4F5] text-gray-900 border border-gray-200/90 shadow-sm"
          : "m-4 sm:m-6 mt-10 rounded-3xl text-gray-100 border border-white/5"
      } overflow-hidden`}
    >
      {/* Background Decor */}
      {!isLight ? (
        <>
          <div className="absolute inset-0 bg-white/5 backdrop-blur-xl z-0" />
          <Image
            src="/images/herobg.png"
            alt="background glow"
            width={700}
            height={700}
            className="absolute bg-cover top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-100 pointer-events-none object-cover"
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFA] to-[#F0F2F5] z-0" />
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8">
        {/* Col 1: Brand */}
        <div className="lg:col-span-3">
          <Link href="/" className="text-2xl font-semibold inline-block mb-3">
            <Image
              src={isRealEstate ? "/images/argold.webp" : "/logos/arlogo.png"}
              alt="AfterRender Logo"
              width={180}
              height={46}
              priority={isRealEstate}
              loading={isRealEstate ? "eager" : undefined}
              className="w-[160px] sm:w-[180px] h-auto object-contain"
            />
          </Link>
          <p
            className={`leading-relaxed mb-4 text-xs sm:text-sm ${
              isLight ? "text-gray-600" : "text-[#9FC8F1]"
            }`}
          >
            Creative studio building digital experiences that inspire and convert.
          </p>
          <div className="flex space-x-3 mt-4">
            {[
              {
                Icon: Instagram,
                name: "Follow AfterRender on Instagram",
                url: "https://www.instagram.com/afterrender/?hl=en",
              },
              {
                Icon: Youtube,
                name: "Subscribe to AfterRender on YouTube",
                url: "https://www.youtube.com/@AfterRender",
              },
              {
                Icon: Facebook,
                name: "Follow AfterRender on Facebook",
                url: "https://www.facebook.com/p/AfterRender-61563053082911/",
              },
            ].map(({ Icon, name, url }, i) => (
              <motion.a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                whileHover={{ scale: 1.15, y: -2 }}
                className={`p-2.5 rounded-full transition ${
                  isLight
                    ? isRealEstate
                      ? "bg-white border border-gray-200 text-gray-700 hover:bg-yellow-50 hover:text-[#B8860B] hover:border-[#B8860B]/40 shadow-2xs"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-black shadow-2xs"
                    : "bg-[#5E748C]/40 hover:bg-[#48A2FF]/50 text-[#C9E4FF]"
                }`}
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="lg:col-span-2">
          <h3
            className={`text-base font-bold mb-4 ${
              isLight ? "text-gray-950" : "text-[#C9E4FF]"
            }`}
          >
            Navigation
          </h3>
          <ul
            className={`space-y-2.5 text-sm font-medium ${
              isLight ? "text-gray-600" : "text-[#9FC8F1]"
            }`}
          >
            {[
              { name: "Our Work", href: "/our-work" },
              { name: "Pricing", href: "/pricing" },
              { name: "Blogs", href: "/blogs" },
              { name: "About Us", href: "/about-us" },
              { name: "Contact", href: "/#contact" },
            ].map((item, i) => (
              <motion.li
                key={i}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={item.href}
                  className={`transition-colors ${
                    isLight
                      ? isRealEstate
                        ? "hover:text-[#B8860B]"
                        : "hover:text-black"
                      : "hover:text-[#48A2FF]"
                  }`}
                >
                  {item.name}
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Col 3: Address */}
        <div className="lg:col-span-3">
          <h3
            className={`text-base font-bold mb-4 ${
              isLight ? "text-gray-950" : "text-[#C9E4FF]"
            }`}
          >
            Address
          </h3>

          {/* Flag image slot & USA on its right */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="relative w-6 h-4 rounded-[2px] overflow-hidden border border-black/10 shadow-2xs shrink-0 bg-gray-200">
              <Image
                src="/images/usa.png"
                alt="USA Flag"
                fill
                className="object-cover"
              />
            </div>
            <span
              className={`text-sm font-bold tracking-wide ${
                isLight ? "text-gray-900" : "text-white"
              }`}
            >
              USA
            </span>
          </div>

          {/* Full Address */}
          <p
            className={`text-xs sm:text-[13px] leading-relaxed mb-3.5 ${
              isLight ? "text-gray-600" : "text-[#9FC8F1]"
            }`}
          >
            30 N Gould St Ste N,
            <br />
            Sheridan, WY 82801,
            <br />
            United States
          </p>

          {/* Phone Number */}
          <div className="flex items-center gap-2 text-xs sm:text-[13px] font-medium">
            <Phone
              className={`w-3.5 h-3.5 shrink-0 ${
                isRealEstate ? "text-[#B8860B]" : "text-[#48A2FF]"
              }`}
            />
            <a
              href="tel:+13076677665"
              className={`transition-colors ${
                isLight
                  ? isRealEstate
                    ? "text-gray-700 hover:text-[#B8860B]"
                    : "text-gray-700 hover:text-[#48A2FF]"
                  : "text-[#C9E4FF] hover:text-white"
              }`}
            >
              +1 (307) 667-7665
            </a>
          </div>
        </div>

        {/* Col 4: Get a Quote */}
        <div className="lg:col-span-4">
          <h3
            className={`text-base font-bold mb-3 ${
              isLight ? "text-gray-950" : "text-[#C9E4FF]"
            }`}
          >
            Get a Quote
          </h3>
          <p
            className={`mb-4 text-xs sm:text-[13px] leading-relaxed ${
              isLight ? "text-gray-600" : "text-[#9FC8F1]"
            }`}
          >
            Enter your email below — our team will get back to you with a
            personalized quote.
          </p>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className={`flex flex-col sm:flex-row items-center rounded-2xl p-1.5 backdrop-blur-lg shadow-sm transition-all duration-300 w-full ${
              isLight
                ? isRealEstate
                  ? "bg-white border border-yellow-600/30 shadow-2xs hover:border-[#B8860B] focus-within:border-[#B8860B]"
                  : "bg-white border border-gray-300/80 shadow-2xs hover:border-gray-400"
                : "bg-white/10 border border-[#48A2FF]/30 hover:shadow-[#48A2FF]/40"
            }`}
          >
            <div className="flex-1 w-full">
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full bg-transparent text-xs sm:text-sm px-3.5 py-2.5 outline-none rounded-xl sm:rounded-full transition-all duration-300 ${
                  isLight
                    ? isRealEstate
                      ? "text-gray-900 placeholder:text-gray-400 focus:bg-yellow-50/20"
                      : "text-gray-900 placeholder:text-gray-400 focus:bg-gray-50/50"
                    : "text-white placeholder-[#9FC8F1] focus:ring-2 focus:ring-[#48A2FF] focus:bg-white/5"
                }`}
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              disabled={loading}
              style={
                isRealEstate
                  ? {
                      background:
                        "linear-gradient(135deg, #FFD700 0%, #B8860B 100%)",
                      color: "#000",
                    }
                  : undefined
              }
              className={`mt-2.5 sm:mt-0 sm:ml-2 text-xs sm:text-[13px] font-bold w-full sm:w-auto cursor-pointer px-4 py-2.5 rounded-xl sm:rounded-full shadow-2xs transition-all duration-300 shrink-0 ${
                isRealEstate
                  ? "text-black shadow-[0_4px_14px_rgba(218,165,32,0.35)]"
                  : "bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] text-[#0C1A2A]"
              } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? "Sending..." : "Get Quote"}
            </motion.button>
          </motion.form>

          {messageSent && (
            <p className="text-green-600 font-medium text-xs mt-2.5 transition-opacity duration-500">
              ✅ Message sent successfully!
            </p>
          )}
          {error && (
            <p className="text-red-500 font-medium text-xs mt-2.5 transition-opacity duration-500">
              ❌ {error}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
            <span
              className={`text-[11px] font-medium ${
                isLight ? "text-gray-400" : "text-[#9FC8F1]"
              }`}
            >
              Fast response guaranteed
            </span>
            <span
              className={`text-[11px] font-semibold ${
                isLight ? "text-gray-700" : "text-white"
              }`}
            >
              arham@afterrender.com
            </span>
          </div>
        </div>
      </div>

      {/* Copyright & Legal Bar */}
      <div
        className={`py-5 px-6 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium relative z-10 ${
          isLight
            ? "border-t border-gray-200/80 text-gray-500"
            : "border-t border-[#48A2FF]/20 text-[#9FC8F1]"
        }`}
      >
        <div>© {currentYear || ""} AfterRender. All rights reserved.</div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11.5px] sm:text-xs">
          <Link
            href="/privacy-policy"
            className={`transition-colors ${
              isLight
                ? isRealEstate
                  ? "hover:text-[#B8860B]"
                  : "hover:text-black"
                : "hover:text-white"
            }`}
          >
            Privacy Policy
          </Link>
          <Link
            href="/refund-policy"
            className={`transition-colors ${
              isLight
                ? isRealEstate
                  ? "hover:text-[#B8860B]"
                  : "hover:text-black"
                : "hover:text-white"
            }`}
          >
            Refund Policy
          </Link>
          <Link
            href="/terms-conditions"
            className={`transition-colors ${
              isLight
                ? isRealEstate
                  ? "hover:text-[#B8860B]"
                  : "hover:text-black"
                : "hover:text-white"
            }`}
          >
            Terms & Conditions
          </Link>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
