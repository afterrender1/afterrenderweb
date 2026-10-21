"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { cloudinaryImage, cloudinarySrcSet } from "@/app/lib/cloudinaryUrl";

export const hostnameOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

// "Read about" dialog: tab list on the left, the active tab's images + details on the right.
// Portalled to <body> because the portfolio track is transformed, which would trap `position: fixed`.
const PortfolioDetailsModal = ({ item, onClose, fontClass = "" }) => {
  const [active, setActive] = useState(0);
  const closeRef = useRef(null);
  const contentRef = useRef(null);
  const tabs = item.tabs || [];
  const tab = tabs[Math.min(active, tabs.length - 1)];
  const pair = tab?.images?.length > 1;

  useEffect(() => {
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    const prevGutter = root.style.scrollbarGutter;
    // Lock only <html>: hiding <body> overflow turns it into a scroll container, which
    // un-sticks the pinned portfolio section and leaves a blank page behind the modal.
    // scrollbar-gutter keeps the scrollbar's space so the layout doesn't jump.
    root.style.scrollbarGutter = "stable";
    root.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prevOverflow;
      root.style.scrollbarGutter = prevGutter;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const selectTab = (index) => {
    setActive(index);
    contentRef.current?.scrollTo({ top: 0 });
  };

  // Arrow keys move between tabs, like native tab controls
  const onTabKeyDown = (e) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (active + step + tabs.length) % tabs.length;
    selectTab(next);
    e.currentTarget.querySelectorAll('[role="tab"]')[next]?.focus();
  };

  if (!tab) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className={`${fontClass} fixed inset-0 z-[120] flex items-end sm:items-center justify-center sm:p-6`}
    >
      {/* touch-none: on iOS a drag on the backdrop would otherwise scroll the page behind */}
      <div className="absolute inset-0 bg-black/40 touch-none" onClick={onClose} />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="portfolio-modal-title"
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="relative w-full sm:max-w-4xl max-h-[90svh] md:h-[min(620px,85vh)] flex flex-col bg-white border border-zinc-200 rounded-t-xl sm:rounded-xl shadow-[0_10px_38px_-10px_rgba(22,23,24,0.35),0_10px_20px_-15px_rgba(22,23,24,0.2)] overflow-hidden"
      >
        {/* Header */}
        <div className="shrink-0 px-5 py-4 pr-14 border-b border-zinc-200">
          <h2 id="portfolio-modal-title" className="text-base font-semibold text-zinc-900 leading-tight truncate">
            {item.name}
          </h2>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 max-w-full text-[13px] text-zinc-500 hover:text-[#1a73e8] transition-colors"
          >
            <span className="truncate">{hostnameOf(item.url)}</span>
            <ExternalLink size={12} className="shrink-0" />
          </a>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/40"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 min-h-0 flex flex-col md:flex-row">
          {/* Tabs: segmented row on phones, side nav on tablets and up */}
          <div className="shrink-0 px-4 py-3 md:p-2 md:w-52 border-b md:border-b-0 md:border-r border-zinc-200 md:overflow-y-auto">
            <div
              role="tablist"
              aria-orientation="vertical"
              onKeyDown={onTabKeyDown}
              className="flex md:flex-col gap-1 p-1 md:p-0 rounded-lg md:rounded-none bg-zinc-100 md:bg-transparent overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {tabs.map((t, index) => {
                const isActive = index === active;
                return (
                  <button
                    key={`${t.title}-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => selectTab(index)}
                    className={`shrink-0 md:w-full h-8 md:h-9 px-3 rounded-md text-left text-[13px] md:text-sm whitespace-nowrap md:truncate transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/40 ${
                      isActive
                        ? "bg-white md:bg-zinc-100 text-zinc-900 font-medium shadow-sm md:shadow-none"
                        : "text-zinc-600 hover:text-zinc-900 md:hover:bg-zinc-50"
                    }`}
                  >
                    {t.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active tab */}
          <div ref={contentRef} role="tabpanel" className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="p-4 sm:p-5"
              >
                <h3 className="text-sm font-semibold text-zinc-900">{tab.title}</h3>

                <div className={`mt-3 grid gap-3 items-start ${pair ? "sm:grid-cols-2" : ""}`}>
                  {tab.images.map((src, i) => (
                    <a
                      key={`${src}-${i}`}
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50 hover:border-zinc-300 transition-colors"
                      aria-label={`Open image ${i + 1} full size`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cloudinaryImage(src, { width: pair ? 900 : 1400 })}
                        srcSet={cloudinarySrcSet(src, pair ? [500, 900, 1200] : [700, 1100, 1600])}
                        sizes={pair ? "(min-width: 1024px) 340px, (min-width: 640px) 45vw, 90vw" : "(min-width: 1024px) 700px, 90vw"}
                        alt={`${item.name} – ${tab.title}${pair ? ` (${i + 1})` : ""}`}
                        className="w-full h-auto"
                      />
                    </a>
                  ))}
                </div>

                {tab.description && (
                  <p className="mt-4 text-sm leading-6 text-zinc-600 whitespace-pre-line">{tab.description}</p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-end gap-2 px-5 py-3 border-t border-zinc-200 bg-zinc-50/60 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-3">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-md border border-zinc-200 bg-white text-sm font-medium text-zinc-900 hover:bg-zinc-50 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/40"
          >
            Close
          </button>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md bg-[#1a73e8] hover:bg-[#1765cc] text-sm font-medium text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/40 focus-visible:ring-offset-2"
          >
            Visit website
            <ExternalLink size={14} />
          </a>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default PortfolioDetailsModal;
