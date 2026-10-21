"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Plus_Jakarta_Sans, Playfair_Display } from "@/app/lib/fonts";
import { cloudinaryImage, cloudinarySrcSet } from "@/app/lib/cloudinaryUrl";
import { SectionTag, SECTION_TITLE, SECTION_TEXT } from "./WebsiteSections";
import PortfolioDetailsModal, { hostnameOf } from "./PortfolioDetailsModal";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "600", "700"],
});

const EASE = [0.16, 1, 0.3, 1];

// Card width also shrinks with viewport height so the pinned section fits short laptop screens
// (the extra room covers the "Read about" button under each card)
const CARD_WIDTH = "min(540px, 82vw, calc((100svh - 350px) * 1.45))";

// Lines the track's first card up with the max-w-6xl container used by the header
const TRACK_PADDING = "max(var(--gutter), calc((100% - 72rem) / 2 + var(--gutter)))";

// The card holds two actions (visit site, read about), so it's a div with separate links/buttons
const PortfolioCard = ({ item, index, onReadAbout }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "0px -40px" }}
    transition={{ duration: 0.5, delay: Math.min(index, 3) * 0.06, ease: EASE }}
    style={{ width: CARD_WIDTH }}
    className="group shrink-0 snap-start flex flex-col rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-zinc-300 hover:shadow-[0_4px_16px_-6px_rgba(0,0,0,0.12)] transition-[border-color,box-shadow] duration-200"
  >
    {/* Screenshot */}
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${item.name} website`}
      className="relative block aspect-[16/10] overflow-hidden bg-zinc-100 border-b border-zinc-200 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1a73e8]/50"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cloudinaryImage(item.image, { width: 1100 })}
        srcSet={cloudinarySrcSet(item.image, [600, 900, 1200])}
        sizes="(min-width: 768px) 540px, 82vw"
        alt={`${item.name} website`}
        loading="lazy"
        draggable={false}
        // Tall full-page screenshots slowly scroll to the bottom on hover
        className="w-full h-full object-cover object-top group-hover:object-bottom transition-[object-position] duration-[3200ms] ease-in-out"
      />
    </a>

    {/* Details */}
    <div className="px-4 pt-3.5 pb-4">
      <h3 className="text-[15px] font-semibold text-zinc-900 leading-tight truncate">{item.name}</h3>
      <p className="mt-1 text-[13px] text-zinc-500 truncate">{hostnameOf(item.url)}</p>

      <div className="mt-3.5 flex items-center gap-2">
        {item.tabs?.length > 0 && (
          <button
            type="button"
            onClick={() => onReadAbout(item)}
            className="min-w-0 flex-1 h-8 px-3 rounded-md border border-zinc-200 bg-white text-[13px] font-medium text-zinc-900 hover:bg-zinc-50 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/40"
          >
            <span className="block truncate">Read about {item.name}</span>
          </button>
        )}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`shrink-0 inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-md bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] hover:brightness-105 text-[13px] font-semibold text-[#0A2540] transition-[filter] outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/40 focus-visible:ring-offset-2 ${
            item.tabs?.length > 0 ? "" : "flex-1"
          }`}
        >
          Visit site
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  </motion.div>
);

const Header = ({ count, progress, pinned }) => (
  <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
    <SectionTag label="Our Portfolio" />
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 sm:gap-4 mb-6 sm:mb-10">
      <div className="max-w-2xl">
        <h2 className={SECTION_TITLE}>
          <span>Websites We&apos;ve </span>
          <span className={`${playfair.className} italic font-normal text-gray-900 block sm:inline`}>
            Brought To Life
          </span>
        </h2>
        <p className={SECTION_TEXT}>
          Real sites for real businesses. Click any project to see it live.
        </p>
      </div>

      <div className="flex items-center gap-3 text-[12px] font-semibold text-gray-500 shrink-0">
        <span className="tabular-nums">{String(count).padStart(2, "0")} projects</span>
        {pinned ? (
          <span className="block w-28 h-[3px] rounded-full bg-gray-200 overflow-hidden">
            <motion.span
              style={{ scaleX: progress }}
              className="block h-full origin-left rounded-full bg-gradient-to-r from-[#48A2FF] to-[#93C5FD]"
            />
          </span>
        ) : (
          <span className="md:hidden text-gray-400">Swipe →</span>
        )}
      </div>
    </div>
  </div>
);

const PortfolioScroller = ({ items }) => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [pinned, setPinned] = useState(false);
  const [distance, setDistance] = useState(0);
  const [openItem, setOpenItem] = useState(null);
  // Stable so the modal's scroll lock / Escape listener isn't re-attached on every render
  const closeModal = useCallback(() => setOpenItem(null), []);

  const distanceMV = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const rawX = useTransform([scrollYProgress, distanceMV], ([p, d]) => -p * d);
  const x = useSpring(rawX, { stiffness: 140, damping: 30, mass: 0.4 });

  // Pin + horizontal scroll only on md+ screens, with motion allowed, when the cards overflow
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const mq = window.matchMedia("(min-width: 768px)");

    const measure = () => {
      const overflow = Math.max(0, track.scrollWidth - window.innerWidth);
      distanceMV.set(overflow);
      setDistance(overflow);
      setPinned(mq.matches && !reduceMotion && overflow > 0);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    mq.addEventListener("change", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      mq.removeEventListener("change", measure);
    };
  }, [reduceMotion, distanceMV]);

  // Same elements in both modes (only classes change) so the measured track never remounts
  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className={`${jakarta.className} relative bg-[#FAFAFA]`}
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      {/* Soft dotted backdrop */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#dbe4f0_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] opacity-70" />

      <div
        className={
          pinned
            ? "sticky top-0 h-screen overflow-hidden flex flex-col justify-center"
            : "relative py-14 sm:py-20 lg:py-24"
        }
      >
        <Header count={items.length} progress={scrollYProgress} pinned={pinned} />
        <div
          className={
            pinned
              ? ""
              : "overflow-x-auto snap-x snap-mandatory overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [scroll-padding-inline:1rem]"
          }
        >
          <motion.div
            ref={trackRef}
            style={{ x: pinned ? x : 0, paddingInline: TRACK_PADDING }}
            className="flex w-max gap-5 sm:gap-6 py-4 [--gutter:1rem] sm:[--gutter:1.5rem] lg:[--gutter:2rem] will-change-transform"
          >
            {items.map((item, index) => (
              <PortfolioCard key={item.id} item={item} index={index} onReadAbout={setOpenItem} />
            ))}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {openItem && (
          <PortfolioDetailsModal
            key={openItem.id}
            item={openItem}
            onClose={closeModal}
            fontClass={jakarta.className}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

// Hooks live in PortfolioScroller so useScroll's target ref always mounts
const WebsitePortfolio = ({ items = [] }) => (items.length ? <PortfolioScroller items={items} /> : null);

export default WebsitePortfolio;
