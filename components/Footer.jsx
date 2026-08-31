"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Youtube, Facebook } from "lucide-react";
import { Space_Grotesk } from "next/font/google";
import { usePathname } from "next/navigation";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const Footer = ({ theme }) => {
  const pathname = usePathname();
  const isLight = theme === "light" || pathname === "/pricing";

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

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Col 1: Brand */}
        <div>
          <Link href="/" className="text-2xl font-semibold inline-block mb-3">
            <Image
              src="/logos/arlogo.png"
              alt="AfterRender Logo"
              width={220}
              height={56}
            />
          </Link>
          <p
            className={`leading-relaxed mb-4 text-sm ${
              isLight ? "text-gray-600" : "text-[#9FC8F1]"
            }`}
          >
            Creative studio building digital experiences that inspire and convert.
          </p>
          <div className="flex space-x-3 mt-4">
            {[
              {
                Icon: Instagram,
                url: "https://www.instagram.com/afterrender/?hl=en",
              },
              {
                Icon: Youtube,
                url: "https://www.youtube.com/@AfterRender",
              },
              {
                Icon: Facebook,
                url: "https://www.facebook.com/p/AfterRender-61563053082911/",
              },
            ].map(({ Icon, url }, i) => (
              <motion.a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15, y: -2 }}
                className={`p-2.5 rounded-full transition ${
                  isLight
                    ? "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-black shadow-2xs"
                    : "bg-[#5E748C]/40 hover:bg-[#48A2FF]/50 text-[#C9E4FF]"
                }`}
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div>
          <h4
            className={`text-base font-bold mb-4 ${
              isLight ? "text-gray-950" : "text-[#C9E4FF]"
            }`}
          >
            Navigation
          </h4>
          <ul
            className={`space-y-2.5 text-sm font-medium ${
              isLight ? "text-gray-600" : "text-[#9FC8F1]"
            }`}
          >
            {["Videos", "Contact"].map((item, i) => (
              <motion.li
                key={i}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={`/#${item.toLowerCase()}`}
                  className={`transition-colors ${
                    isLight ? "hover:text-black" : "hover:text-[#48A2FF]"
                  }`}
                >
                  {item}
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Col 3: Get a Quote */}
        <div>
          <h4
            className={`text-base font-bold mb-3 ${
              isLight ? "text-gray-950" : "text-[#C9E4FF]"
            }`}
          >
            Get a Quote
          </h4>
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
                ? "bg-white border border-gray-300/80 shadow-2xs hover:border-gray-400"
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
                    ? "text-gray-900 placeholder:text-gray-400 focus:bg-gray-50/50"
                    : "text-white placeholder-[#9FC8F1] focus:ring-2 focus:ring-[#48A2FF] focus:bg-white/5"
                }`}
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              disabled={loading}
              className={`mt-2.5 sm:mt-0 sm:ml-2 text-xs sm:text-[13px] font-bold w-full sm:w-auto cursor-pointer bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] text-[#0C1A2A] px-4 py-2.5 rounded-xl sm:rounded-full shadow-2xs transition-all duration-300 shrink-0 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
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

          <p
            className={`text-[11px] mt-2.5 font-medium ${
              isLight ? "text-gray-400" : "text-[#9FC8F1]"
            }`}
          >
            We respect your time — expect a fast, personalized response.
          </p>
        </div>

        {/* Col 4: Contact */}
        <div>
          <h4
            className={`text-base font-bold mb-4 ${
              isLight ? "text-gray-950" : "text-[#C9E4FF]"
            }`}
          >
            Contact
          </h4>
          <ul
            className={`space-y-2 text-sm font-medium ${
              isLight ? "text-gray-600" : "text-[#9FC8F1]"
            }`}
          >
            <li>arham@afterrender.com</li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div
        className={`text-center py-5 text-xs font-medium relative z-10 ${
          isLight
            ? "border-t border-gray-200/80 text-gray-500"
            : "border-t border-[#48A2FF]/20 text-[#9FC8F1]"
        }`}
      >
        © {currentYear || ""} AfterRender. All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
