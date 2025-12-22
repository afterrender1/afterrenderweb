"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Youtube, Facebook } from "lucide-react";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const Footer = () => {
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
      className={`${spaceGrotesk.className} relative m-6 rounded-3xl text-gray-100 mt-10 overflow-hidden`}
    >
      <div className="absolute inset-0 bg-white/5 backdrop-blur-xl z-0" />
      <Image
        src="/images/herobg.png"
        alt="background glow"
        width={700}
        height={700}
        className="absolute bg-cover top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-100 pointer-events-none object-cover"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Link href="/" className="text-2xl font-semibold">
            <Image src="/logos/arlogo.png" alt="AfterRender Logo" width={220} height={56} />
          </Link>
          <p className="text-[#9FC8F1] leading-relaxed mb-4">
            Creative studio building digital experiences that inspire and convert.
          </p>
          <div className="flex space-x-4 mt-4">
            {[
              { Icon: Instagram, url: "https://www.instagram.com/afterrender/?hl=en" },
              { Icon: Youtube, url: "https://www.youtube.com/@AfterRender" },
              { Icon: Facebook, url: "https://www.facebook.com/p/AfterRender-61563053082911/" },
            ].map(({ Icon, url }, i) => (
              <motion.a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -2 }}
                className="p-2 rounded-full bg-[#5E748C]/40 hover:bg-[#48A2FF]/50 transition"
              >
                <Icon className="w-5 h-5 text-[#C9E4FF]" />
              </motion.a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-[#C9E4FF] mb-4">Navigation</h4>
          <ul className="space-y-2 text-[#9FC8F1]">
            {["Videos", "Contact"].map((item, i) => (
              <motion.li key={i} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                <Link href={`/#${item.toLowerCase()}`} className="hover:text-[#48A2FF] transition-colors">
                  {item}
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-[#C9E4FF] mb-4">Get a Quote</h4>
          <p className="text-[#9FC8F1] mb-4">
            Enter your email below — our team will get back to you with a personalized quote.
          </p>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center bg-white/10 border border-[#48A2FF]/30 rounded-2xl p-2 backdrop-blur-lg shadow-md hover:shadow-[#48A2FF]/40 transition-all duration-300 w-full"
          >
            <div className="flex-1 w-full">
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full bg-transparent text-sm px-4 py-3 text-white placeholder-[#9FC8F1] outline-none focus:ring-2 focus:ring-[#48A2FF] focus:bg-white/5 rounded-xl sm:rounded-full transition-all duration-300"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(72,162,255,0.6)" }}
              whileTap={{ scale: 0.96 }}
              disabled={loading}
              className={`mt-3 sm:mt-0 sm:ml-3 font-sm w-full sm:w-auto cursor-pointer bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] text-[#0C1A2A] font-semibold px-3 py-3 rounded-xl sm:rounded-full transition-all duration-300 ${loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              {loading ? "Sending..." : "Get Quote"}
            </motion.button>
          </motion.form>

          {messageSent && (
            <p className="text-green-400 text-sm mt-3 transition-opacity duration-500">
              ✅ Message sent successfully!
            </p>
          )}
          {error && (
            <p className="text-red-400 text-sm mt-3 transition-opacity duration-500">
              ❌ {error}
            </p>
          )}

          <p className="text-xs text-[#9FC8F1] mt-3">
            We respect your time — expect a fast, personalized response.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-[#C9E4FF] mb-4">Contact</h4>
          <ul className="space-y-2 text-[#9FC8F1]">
            <li>afterrenderagency@gmail.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#48A2FF]/20 text-center py-6 text-[#9FC8F1] text-sm relative z-10">
        © {currentYear || ""} AfterRender. All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
