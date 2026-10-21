"use client";
import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cloudinaryImage, cloudinarySrcSet } from "@/app/lib/cloudinaryUrl";

const SPEED = 32; // auto-scroll speed in px per second
const RESUME_MS = 1800; // pause after the visitor scrolls/swipes/clicks before auto-scroll continues

// Inline on purpose: globals.css sets `* { scrollbar-width: thin }` outside any layer, which beats
// Tailwind's layered utilities, so a class can't hide this scrollbar
const HIDE_SCROLLBAR = { scrollbarWidth: "none", msOverflowStyle: "none" };

// Distance from the first card to its copy: scrolling that far looks identical to the start
const loopWidthOf = (track, count) => {
  const first = track?.children[0];
  const copy = track?.children[count];
  return first && copy ? copy.offsetLeft - first.offsetLeft : 0;
};

const ShowcaseCard = ({ item, duplicate }) => (
  <a
    href={item.url}
    target="_blank"
    rel="noopener noreferrer"
    draggable={false}
    title={duplicate ? undefined : item.name}
    aria-label={duplicate ? undefined : `Visit ${item.name} website`}
    // The looped copy is only visual: keep it out of the tab order and screen readers
    aria-hidden={duplicate || undefined}
    tabIndex={duplicate ? -1 : undefined}
    className="group shrink-0 block w-[240px] sm:w-[270px] aspect-[16/10] rounded-xl border border-zinc-200 bg-zinc-100 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-zinc-300 hover:shadow-[0_6px_18px_-8px_rgba(15,23,42,0.25)] transition-[border-color,box-shadow] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/40"
  >
    {/* Image fills the card edge to edge */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={cloudinaryImage(item.image, { width: 560 })}
      srcSet={cloudinarySrcSet(item.image, [280, 560, 840])}
      sizes="270px"
      alt=""
      loading="lazy"
      draggable={false}
      className="block w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
    />
  </a>
);

const ArrowButton = ({ dir, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={dir < 0 ? "Previous websites" : "Next websites"}
    className="flex items-center justify-center w-8 h-8 rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-zinc-50 hover:text-zinc-950 active:scale-95 transition cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/40"
  >
    {dir < 0 ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
  </button>
);

// Portfolio screenshots that drift sideways on their own and can also be swiped/scrolled by hand
// or moved with the arrow buttons. It's a real scroll container (not a CSS marquee), so thumbs,
// trackpads and wheels just work; auto-scroll steps aside whenever the visitor takes over.
const WebsiteShowcaseCarousel = ({ items = [] }) => {
  const scrollerRef = useRef(null);
  const trackRef = useRef(null);
  const pauseRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const count = items.length;
  const loop = count > 1;

  useEffect(() => {
    const el = scrollerRef.current;
    const track = trackRef.current;
    if (!el || !track || !loop || reduceMotion) return;

    let raf;
    let resumeTimer;
    let last = performance.now();
    let pos = el.scrollLeft; // float position; scrollLeft itself may be rounded
    let lastSet = el.scrollLeft;
    let paused = false;
    let hovering = false;

    const syncFromScroll = () => {
      pos = el.scrollLeft;
      const w = loopWidthOf(track, count);
      if (w > 0 && pos >= w) {
        pos -= w;
        el.scrollLeft = pos;
      }
      lastSet = el.scrollLeft;
    };

    const tick = (now) => {
      const dt = Math.min(now - last, 64);
      last = now;
      if (!paused && !hovering) {
        const w = loopWidthOf(track, count);
        pos += (SPEED * dt) / 1000;
        if (w > 0 && pos >= w) pos -= w;
        el.scrollLeft = pos;
        lastSet = el.scrollLeft;
      }
      raf = requestAnimationFrame(tick);
    };

    const pauseForUser = () => {
      paused = true;
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        syncFromScroll();
        paused = false;
      }, RESUME_MS);
    };
    pauseRef.current = pauseForUser;

    // Any scroll we didn't cause (swipe, momentum, wheel, trackpad, arrows) hands control to the visitor
    const onScroll = () => {
      if (Math.abs(el.scrollLeft - lastSet) > 1) pauseForUser();
    };
    // Mouse hover pauses so the cards can be looked at; touch "hover" is ignored
    const onEnter = (e) => {
      if (e.pointerType === "mouse") hovering = true;
    };
    const onLeave = (e) => {
      if (e.pointerType !== "mouse") return;
      hovering = false;
      syncFromScroll();
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("pointerdown", pauseForUser);
    el.addEventListener("touchstart", pauseForUser, { passive: true });
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      pauseRef.current = null;
      cancelAnimationFrame(raf);
      clearTimeout(resumeTimer);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointerdown", pauseForUser);
      el.removeEventListener("touchstart", pauseForUser);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [loop, reduceMotion, count]);

  // Move by one card. Near either end it first jumps by one loop (the copy looks identical),
  // so the arrows never get stuck and keep going in both directions.
  const nudge = (dir) => {
    const el = scrollerRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    pauseRef.current?.();

    const card = track.children[0];
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = card ? card.offsetWidth + gap : 280;
    const w = loopWidthOf(track, count);
    const max = el.scrollWidth - el.clientWidth;

    if (w > 0) {
      if (dir < 0 && el.scrollLeft - step < 0) el.scrollLeft += w;
      else if (dir > 0 && el.scrollLeft + step > max) el.scrollLeft -= w;
    }
    el.scrollBy({ left: dir * step, behavior: reduceMotion ? "auto" : "smooth" });
  };

  if (!count) return null;

  return (
    <div className="text-left">
      <div className="mb-3 px-4 sm:px-0 flex items-center justify-between gap-3">
        <p className="text-[12.5px] font-medium text-zinc-500">Recent websites we&apos;ve built</p>
        {loop && (
          <div className="flex items-center gap-1.5">
            <ArrowButton dir={-1} onClick={() => nudge(-1)} />
            <ArrowButton dir={1} onClick={() => nudge(1)} />
          </div>
        )}
      </div>
      <div
        ref={scrollerRef}
        style={HIDE_SCROLLBAR}
        className="w-full overflow-x-auto overscroll-x-contain [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
      >
        <div ref={trackRef} className="flex w-max gap-3 py-1 px-[6%]">
          {items.map((item) => (
            <ShowcaseCard key={item.id} item={item} />
          ))}
          {/* Second copy makes the loop seamless */}
          {loop && items.map((item) => <ShowcaseCard key={`${item.id}-copy`} item={item} duplicate />)}
        </div>
      </div>
    </div>
  );
};

export default WebsiteShowcaseCarousel;
