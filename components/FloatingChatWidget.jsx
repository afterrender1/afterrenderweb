"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "I want to know more",
  });
  const [showTooltip, setShowTooltip] = useState(false);
  const modalRef = useRef(null);

  // Show a gentle greeting tooltip after 3 seconds if not opened yet
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(e.target) &&
        !e.target.closest("#floating-chat-trigger")
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Prevent background scrolling on mobile when chat is open
  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncScrollLock = () => {
      if (isOpen && window.innerWidth < 768) {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      }
    };

    syncScrollLock();
    window.addEventListener("resize", syncScrollLock);

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      window.removeEventListener("resize", syncScrollLock);
    };
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (status.type === "error") {
      setStatus({ type: "", message: "" });
    }
  };

  const handleQuickPrompt = (text) => {
    setFormData((prev) => ({ ...prev, message: text }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setStatus({ type: "error", message: "Please provide your name." });
      return;
    }

    if (!formData.email.trim() && !formData.phone.trim()) {
      setStatus({
        type: "error",
        message: "Please provide an email or phone number so we can reach you.",
      });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({
          type: "success",
          message:
            data.message ||
            "Your question has been sent! A representative will get right back to you.",
        });
        setFormData({
          name: "",
          phone: "",
          email: "",
          message: "I want to know more",
        });
      } else {
        setStatus({
          type: "error",
          message: data.message || "Failed to send. Please try again.",
        });
      }
    } catch (err) {
      console.error("Chat form submission error:", err);
      setStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStatus({ type: "", message: "" });
    setFormData({
      name: "",
      phone: "",
      email: "",
      message: "I want to know more",
    });
  };

  return (
    <aside aria-label="Floating Live Chat Widget">
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
        {/* Subtle Greeting Bubble */}
        <AnimatePresence>
          {!isOpen && showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              onClick={() => {
                setIsOpen(true);
                setShowTooltip(false);
              }}
              className="mb-3 max-w-[240px] cursor-pointer bg-[#0c121e]/95 backdrop-blur-md border border-[#48A2FF]/30 text-white text-xs px-3.5 py-2.5 rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.6),0_0_20px_rgba(72,162,255,0.2)] flex items-center gap-2.5 group hover:border-[#48A2FF] transition-all"
            >
            
              <div className="flex-1">
                <p className="font-semibold text-[12px] text-white">
                  Have a question?
                </p>
                <p className="text-[11px] text-gray-400">
                  Chat with a representative
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
                className="text-gray-400 hover:text-white p-0.5 rounded transition-colors"
                aria-label="Dismiss tooltip"
              >
                <X size={13} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Trigger Button */}
        <motion.button
          id="floating-chat-trigger"
          type="button"
          onClick={() => {
            setIsOpen((prev) => !prev);
            setShowTooltip(false);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isOpen ? "Close chat" : "Open chat with representative"}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#48A2FF] focus:ring-offset-2 focus:ring-offset-[#070B11] ${
            isOpen
              ? "bg-[#1E293B] text-white border border-white/20 hover:bg-[#334155]"
              : "bg-gradient-to-r from-[#48A2FF] via-[#2F80ED] to-[#0052D4] text-white shadow-[0_0_25px_rgba(72,162,255,0.5)] hover:shadow-[0_0_35px_rgba(72,162,255,0.7)]"
          }`}
        >
          {/* Animated Status Dot */}
          {!isOpen && (
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5 -mt-0.5 -mr-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#0B0F17]"></span>
            </span>
          )}

          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close-icon"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="chat-icon"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageSquare size={24} className="fill-white/10" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Backdrop Overlay to block background touch gestures */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            onTouchMove={(e) => e.preventDefault()}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 sm:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 320 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[85vh] flex flex-col rounded-2xl bg-[#090E17]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(72,162,255,0.18)] overflow-hidden overscroll-contain"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            {/* Top Accent Gradient Bar */}
            <div className="h-1 w-full bg-gradient-to-r from-[#48A2FF] via-[#7EC0FF] to-[#C9E4FF]" />

            {/* Modal Header */}
            <div className="p-4 sm:p-5 pb-3 border-b border-white/10 relative bg-white/[0.02]">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <div className="flex items-start gap-3.5">
                {/* Avatar with Live Indicator */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#48A2FF]/60 shadow-[0_0_15px_rgba(72,162,255,0.3)] bg-[#131E30] flex items-center justify-center">
                    <Image
                      src="/images/ArhamKhan.webp"
                      alt="Representative Avatar"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        // Fallback in case of missing asset
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  {/* Status Indicator */}
                  <span className="absolute bottom-0 right-0 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#090E17]"></span>
                  </span>
                </div>

                {/* Header Text */}
                <div className="flex-1 pr-6">
                  <div className="flex items-center gap-2">
                    <h2 className="text-white text-base sm:text-lg font-bold tracking-tight">
                      Have a question?
                    </h2>
                    
                  </div>
                  <p className="text-gray-400 text-xs mt-1 leading-snug">
                    Enter your question below and a representative will get right
                    back to you.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body / Scrollable Area */}
            <div className="p-4 sm:p-5 overflow-y-auto max-h-[calc(85vh-140px)] space-y-4 overscroll-contain touch-pan-y">
              {status.type === "success" ? (
                /* Success Confirmation State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6 px-4 text-center space-y-3"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-white font-semibold text-base sm:text-lg">
                    Question Received!
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">
                    {status.message}
                  </p>
                  <p className="text-gray-400 text-[11px]">
                    We usually respond within 15–30 minutes during business hours.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-xs font-medium text-white bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition-colors"
                    >
                      Ask another question
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Form State */
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Error Notification */}
                  {status.type === "error" && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                      <AlertCircle size={15} className="shrink-0 text-red-400" />
                      <p className="flex-1 leading-tight">{status.message}</p>
                    </div>
                  )}

                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="chat-name"
                      className="block text-gray-300 text-xs font-medium mb-1"
                    >
                      Name <span className="text-[#48A2FF]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <User size={15} />
                      </div>
                      <input
                        id="chat-name"
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#48A2FF] focus:ring-1 focus:ring-[#48A2FF] transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Phone Input */}
                    <div>
                      <label
                        htmlFor="chat-phone"
                        className="block text-gray-300 text-xs font-medium mb-1"
                      >
                        Phone
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Phone size={15} />
                        </div>
                        <input
                          id="chat-phone"
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#48A2FF] focus:ring-1 focus:ring-[#48A2FF] transition-all"
                        />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div>
                      <label
                        htmlFor="chat-email"
                        className="block text-gray-300 text-xs font-medium mb-1"
                      >
                        E-mail
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Mail size={15} />
                        </div>
                        <input
                          id="chat-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@email.com"
                          className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#48A2FF] focus:ring-1 focus:ring-[#48A2FF] transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Question / Message */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="chat-message"
                        className="block text-gray-300 text-xs font-medium"
                      >
                        How can we help?
                      </label>
                
                    </div>
                    <textarea
                      id="chat-message"
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Enter your question here..."
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#48A2FF] focus:ring-1 focus:ring-[#48A2FF] transition-all resize-none"
                    />
                  </div>

                  {/* Disclaimer / Consent note */}
                  <p className="text-[11px] text-gray-400 leading-normal bg-white/[0.02] border border-white/5 rounded-lg p-2">
                    By submitting you agree to receive SMS or e-mails for the
                    provided channel. Rates may be applied.
                  </p>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl text-white font-medium text-xs sm:text-sm bg-gradient-to-r from-[#48A2FF] via-[#2F80ED] to-[#0052D4] hover:from-[#5cb0ff] hover:to-[#0066ee] shadow-[0_0_20px_rgba(72,162,255,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.99]"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin text-white" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send
                          size={15}
                          className="group-hover:translate-x-0.5 transition-transform"
                        />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
