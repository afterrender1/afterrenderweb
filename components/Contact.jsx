"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader, Mail } from "lucide-react";
import { Urbanist, Playfair_Display } from "next/font/google";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
    phone: "",
    link: "",
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
          message: "✅ Message sent successfully! We'll reach out soon.",
        });
        setForm({
          name: "",
          email: "",
          service: "",
          message: "",
          phone: "",
          link: "",
        });
      } else {
        setStatus({
          type: "error",
          message: "❌ Failed to send message. Please try again later.",
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
      id="contact"
      className="relative w-full py-10 sm:py-14 bg-black text-white overflow-hidden"
    >
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url('/images/herobg.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black via-black/90 to-black" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[400px] lg:w-[500px] h-[300px] md:h-[400px] lg:h-[500px] bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] rounded-full blur-3xl opacity-30 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="space-y-4 sm:space-y-6 text-center lg:text-left lg:sticky lg:top-24 self-start"
          style={{ fontFamily: "poppins" }}
        >
          <div>
            <h2 className={`${urbanist.className} text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 leading-tight`}>
              Let’s{" "}
              <span className={`${playfair.className} italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#48A2FF] via-[#7EC0FF] to-[#C9E4FF]`}>
                Collaborate
              </span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto lg:mx-0">
              We’d love to hear about your ideas, projects, or challenges.
              Reach out and we’ll get back within 24 hours.
            </p>
          </div>

          <div className="space-y-4 w-full max-w-md mx-auto lg:mx-0">
            <div className="flex items-center gap-3.5 bg-white/5 border border-white/10 rounded-xl p-3 sm:p-3.5 backdrop-blur-lg hover:bg-white/10 transition-all">
              <Mail className="text-[#48A2FF] w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <div className="text-left">
                <p className="font-medium text-xs text-gray-300">Email</p>
                <p className="text-gray-200 text-xs sm:text-sm">
                arham@afterrender.com
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full backdrop-blur-xl bg-white/1 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4"
          style={{ fontFamily: "poppins" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-gray-300 mb-1.5 text-xs sm:text-xs font-medium">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="bg-black/20 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#48A2FF] transition-all"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-300 mb-1.5 text-xs sm:text-xs font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="bg-black/20 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#48A2FF] transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="service" className="text-gray-300 mb-1.5 text-xs sm:text-xs font-medium">
              Service
            </label>
            <select
              id="service"
              name="service"
              aria-label="Select a Service"
              value={form.service}
              onChange={handleChange}
              required
              className="bg-black/20 border cursor-pointer border-white/10 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#48A2FF] transition-all"
            >
              <option value="" className="bg-black">Select a Service</option>
              <option value="editing" className="bg-black">Video Editing</option>
              <option value="design" className="bg-black">Design</option>
              <option value="ads" className="bg-black">Ads</option>
              <option value="website" className="bg-black">Website Development</option>
              <option value="social" className="bg-black">Social Media Presence</option>
              <option value="other" className="bg-black">Other</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-300 mb-1.5 text-xs sm:text-xs font-medium">
              Phone Number{" "}
              <span className="text-gray-500 text-[11px]">(optional)</span>
            </label>
            <input
              type="number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Your Phone Number"
              className="bg-black/20 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#48A2FF] transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-300 mb-1.5 text-xs sm:text-xs font-medium">
              Website / YouTube Link{" "}
              <span className="text-gray-500 text-[11px]">(optional)</span>
            </label>
            <input
              type="text"
              name="link"
              value={form.link}
              onChange={handleChange}
              placeholder="Your Website / YouTube Link"
              className="bg-black/20 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#48A2FF] transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-300 mb-1.5 text-xs sm:text-xs font-medium">
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message..."
              required
              rows="4"
              className="bg-black/20 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#48A2FF] transition-all resize-none"
            />
          </div>

          <div className="text-center pt-1">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto font-semibold px-7 sm:px-9 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all duration-300 ${loading
                  ? "bg-gray-600 text-gray-200 cursor-not-allowed"
                  : "bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] text-[#0A2540] hover:shadow-lg"
                }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  Sending...
                </div>
              ) : (
                "Send Message"
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
            className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 z-50 rounded-full text-white text-sm sm:text-base shadow-xl ${status.type === "success" ? "bg-green-600" : "bg-red-600"
              }`}
          >
            {status.message}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ContactForm;
