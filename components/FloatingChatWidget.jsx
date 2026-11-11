"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const AUTO_OPEN_MS = 9000;

export default function FloatingChatWidget() {
  const pathname = usePathname();
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
  // Set once the visitor opens/closes the chat or dismisses the bubble, so auto-open never overrides them
  const userInteracted = useRef(false);

  // Show a gentle greeting tooltip after 3 seconds if not opened yet
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-open the chat 9s after the visitor lands (the widget itself mounts lazily, so count from
  // navigation start). It lives in the root layout, so this runs once per visit, not per page.
  useEffect(() => {
    let timer;

    const tryOpen = () => {
      if (userInteracted.current) return;
      // Another overlay (intro video, a dialog) has locked the page: wait until it closes
      if (getComputedStyle(document.documentElement).overflowY === "hidden") {
        timer = setTimeout(tryOpen, 1000);
        return;
      }
      setIsOpen(true);
      setShowTooltip(false);
    };

    timer = setTimeout(tryOpen, Math.max(0, AUTO_OPEN_MS - performance.now()));
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

    if (!formData.email.trim()) {
      setStatus({
        type: "error",
        message: "Please provide your email address.",
      });
      return;
    }

    if (!formData.message.trim()) {
      setStatus({
        type: "error",
        message: "Please enter your question.",
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

  if (pathname?.startsWith("/admin")) return null;

  return (
    <aside aria-label="Floating Live Chat Widget">
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
        {/* Subtle Greeting Bubble */}
        <AnimatePresence>
          {!isOpen && showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              onClick={() => {
                userInteracted.current = true;
                setIsOpen(true);
                setShowTooltip(false);
              }}
              className="mb-3 max-w-[240px] cursor-pointer bg-[#0d1117] border border-white/15 text-white text-xs px-3.5 py-2.5 rounded-lg shadow-lg flex items-center gap-2.5 hover:border-white/30 transition-colors"
            >
            
              <div className="flex-1">
                <p className="font-semibold text-[12px] text-white">
                  Have a question?
                </p>
                <p className="text-[11px] text-gray-400">
                  Chat with us
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  userInteracted.current = true;
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
            userInteracted.current = true;
            setIsOpen((prev) => !prev);
            setShowTooltip(false);
          }}
          whileTap={{ scale: 0.95 }}
          aria-label={isOpen ? "Close chat" : "Open chat with representative"}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
            isOpen
              ? "bg-[#1E293B] text-white border border-white/20 hover:bg-[#334155]"
              : "bg-[#59B7FF] text-[#0A2540] hover:bg-[#7cc6ff]"
          }`}
        >
          {!isOpen && (
            <span
              aria-hidden="true"
              className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#22c55e] border-2 border-white"
            />
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
                <MessageSquare size={24} />
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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] max-h-[85vh] flex flex-col rounded-xl bg-[#0d1117] border border-white/10 shadow-2xl overflow-hidden overscroll-contain"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            {/* Header */}
            <div className="relative flex items-center gap-3 px-5 py-4 border-b border-white/10">
              <Image
                src="/images/logos/logoxar.png"
                alt="AfterRender"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
              <div className="flex-1 pr-6">
                <h2 className="text-white text-base font-semibold leading-tight">Have a question?</h2>
                <p className="text-gray-400 text-xs mt-0.5">A representative will get back to you.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white p-1.5 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4 overflow-y-auto overscroll-contain touch-pan-y">
              {status.type === "success" ? (
                <div className="py-6 text-center">
                  <CheckCircle2 size={36} className="mx-auto text-emerald-400" />
                  <h3 className="mt-3 text-white font-semibold text-base">Message sent</h3>
                  <p className="mt-1.5 text-gray-300 text-sm leading-relaxed">{status.message}</p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-4 text-sm font-medium text-[#59B7FF] hover:underline cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  {status.type === "error" && (
                    <div className="flex items-center gap-2 rounded-md bg-red-500/10 border border-red-500/30 px-3 py-2 text-red-300 text-xs">
                      <AlertCircle size={15} className="shrink-0" />
                      <p className="flex-1 leading-tight">{status.message}</p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="chat-name" className="block text-gray-300 text-xs mb-1">
                      Name
                    </label>
                    <input
                      id="chat-name"
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full bg-transparent border border-white/15 rounded-md px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#59B7FF] transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="chat-email" className="block text-gray-300 text-xs mb-1">
                      Email
                    </label>
                    <input
                      id="chat-email"
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@email.com"
                      className="w-full bg-transparent border border-white/15 rounded-md px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#59B7FF] transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="chat-phone" className="block text-gray-300 text-xs mb-1">
                      Phone <span className="text-gray-500">(optional)</span>
                    </label>
                    <input
                      id="chat-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 555 000 0000"
                      className="w-full bg-transparent border border-white/15 rounded-md px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#59B7FF] transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="chat-message" className="block text-gray-300 text-xs mb-1">
                      Message
                    </label>
                    <textarea
                      id="chat-message"
                      name="message"
                      rows={3}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className="w-full bg-transparent border border-white/15 rounded-md px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#59B7FF] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-md text-sm font-semibold text-[#0A2540] bg-[#59B7FF] hover:bg-[#7cc6ff] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>

                  <p className="text-[11px] text-gray-500 leading-snug">
                    By sending, you agree to be contacted by SMS or email. Rates may apply.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
