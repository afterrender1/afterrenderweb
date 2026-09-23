"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader, Phone } from "lucide-react";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { industries } from "./RealEstateFAQ";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "600", "700"],
});

const CALENDLY_URL = "https://calendly.com/afterrenderagency/new-meeting";

const packageOptions = ["Starter", "Pro", "Premium", "Not sure yet"];

const RealEstateLeadForm = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    industry: "",
    packageInterest: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setStatus({
          type: "success",
          message: "✅ Got it! We'll reach out soon.",
        });
        setForm({
          name: "",
          businessName: "",
          email: "",
          phone: "",
          industry: "",
          packageInterest: "",
        });
      } else {
        setStatus({
          type: "error",
          message: "❌ Failed to send. Please try again later.",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "⚠️ Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus({ type: "", message: "" }), 4000);
    }
  };

  return (
    <section
      className={`${jakarta.className} relative bg-[#111111] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden`}
    >
      {/* Gold ambient glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[450px] h-[300px] md:h-[450px] bg-gradient-to-r from-[#FFD700] to-[#B8860B] rounded-full blur-3xl opacity-[0.08] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        {/* Left: Closing CTA copy */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold tracking-tight leading-[1.15] mb-4">
            <span>Not sure which </span>
            <span
              className={`${playfair.className} italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#B8860B]`}
            >
              package fits?
            </span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm md:text-[14.5px] leading-relaxed max-w-md mx-auto lg:mx-0 mb-6">
            Book a quick call and we&apos;ll tell you honestly what makes
            sense for your business, even if it&apos;s the smallest one.
          </p>

          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "linear-gradient(135deg, #FFD700 0%, #B8860B 100%)",
            }}
            className="hidden lg:inline-flex items-center gap-2 text-black font-bold text-xs sm:text-sm px-7 py-3 rounded-full shadow-[0_8px_20px_rgba(184,134,11,0.4)] hover:brightness-105 hover:scale-105 active:scale-95 transition-all duration-300 mb-8"
          >
            Book a Free Call
          </a>

          <div className="hidden lg:flex items-center gap-3.5 bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-lg max-w-xs">
            <Phone className="text-[#FFD700] w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <div className="text-left">
              <p className="font-medium text-xs text-gray-300">
                Prefer to talk first?
              </p>
              <p className="text-gray-200 text-xs sm:text-sm">
                Book a free call above
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right: Lead Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-2xl p-5 sm:p-7 shadow-xl space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-gray-300 mb-1.5 text-xs font-medium">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="bg-black/30 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#B8860B] transition-all"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-300 mb-1.5 text-xs font-medium">
                Business Name
              </label>
              <input
                type="text"
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                placeholder="Your Business"
                required
                className="bg-black/30 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#B8860B] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-gray-300 mb-1.5 text-xs font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@business.com"
                required
                className="bg-black/30 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#B8860B] transition-all"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-300 mb-1.5 text-xs font-medium">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Your Phone Number"
                required
                className="bg-black/30 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#B8860B] transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="industry"
              className="text-gray-300 mb-1.5 text-xs font-medium"
            >
              Industry
            </label>
            <select
              id="industry"
              name="industry"
              value={form.industry}
              onChange={handleChange}
              required
              className="bg-black/30 border cursor-pointer border-white/10 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#B8860B] transition-all"
            >
              <option value="" className="bg-black">
                Select your industry
              </option>
              {industries.map((industry) => (
                <option key={industry} value={industry} className="bg-black">
                  {industry}
                </option>
              ))}
              <option value="Other" className="bg-black">
                Other
              </option>
            </select>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="packageInterest"
              className="text-gray-300 mb-1.5 text-xs font-medium"
            >
              Which package are you interested in?
            </label>
            <select
              id="packageInterest"
              name="packageInterest"
              value={form.packageInterest}
              onChange={handleChange}
              required
              className="bg-black/30 border cursor-pointer border-white/10 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#B8860B] transition-all"
            >
              <option value="" className="bg-black">
                Select a package
              </option>
              {packageOptions.map((pkg) => (
                <option key={pkg} value={pkg} className="bg-black">
                  {pkg}
                </option>
              ))}
            </select>
          </div>

          <div className="text-center pt-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              style={
                loading
                  ? undefined
                  : {
                      background:
                        "linear-gradient(135deg, #FFD700 0%, #B8860B 100%)",
                    }
              }
              className={`w-full font-bold px-7 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all duration-300 ${
                loading
                  ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                  : "text-black hover:shadow-lg hover:brightness-105"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  Sending...
                </div>
              ) : (
                "Get My Free Plan"
              )}
            </motion.button>
          </div>
        </motion.form>
      </div>

      <AnimatePresence>
        {status.message && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4 }}
            className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 z-50 rounded-full text-white text-sm shadow-xl ${
              status.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {status.message}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default RealEstateLeadForm;
