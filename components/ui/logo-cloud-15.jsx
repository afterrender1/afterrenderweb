"use client";

import React, { useEffect, useRef } from "react";
import { Marquee } from "@/components/ui/logo-cloud-15-utils/marquee";
import { BorderBeam } from "@/components/ui/logo-cloud-15-utils/border-beam";

const WAVE_GRADIENT = (from, to) =>
  `linear-gradient(90deg, currentColor 0%, currentColor 45%, ${from} 47%, ${to} 50%, ${from} 53%, currentColor 55%, currentColor 100%)`;

// Logo cloud with a beam running around the card border; when the beam passes behind the
// title, a colored wave sweeps across the text.
//
// Performance (stays light on low-end phones):
// - one requestAnimationFrame loop moves BOTH the beam and the text wave, so they stay in sync
// - the loop only runs while the card is on screen (IntersectionObserver)
// - sizes are measured on resize only (ResizeObserver), never inside the frame loop
// - prefers-reduced-motion: no beam/wave loop, marquee paused
//
// `title`: text on the top border. `children`: the logos (rendered inside the marquee).
// `labelBg`: must match the background behind the card so the title "cuts" the border line.
const LogoCloud = ({
  title,
  children,
  className = "",
  labelBg = "bg-[#FAFAFA]",
  duration = 8, // seconds for one lap of the beam
  beamSize = 100,
  colorFrom = "#48A2FF",
  colorTo = "#a855f7",
  marqueeClassName = "[--duration:25s] [--gap:2.5rem] sm:[--gap:3.5rem]",
}) => {
  const cardRef = useRef(null);
  const textRef = useRef(null);
  const waveSpanRef = useRef(null);
  const beamRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const text = textRef.current;
    const span = waveSpanRef.current;
    const beam = beamRef.current;
    if (!(card && text && span && beam)) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Where the title sits on the border path, as % of the perimeter (path starts top-left, clockwise)
    let textStart = 0;
    let textEnd = 0;
    const measure = () => {
      const cardRect = card.getBoundingClientRect();
      const textRect = text.getBoundingClientRect();
      const perimeter = 2 * (cardRect.width + cardRect.height);
      if (!perimeter) return;
      const left = Math.max(0, textRect.left - cardRect.left);
      const right = Math.min(cardRect.width, textRect.right - cardRect.left);
      textStart = (left / perimeter) * 100;
      textEnd = (right / perimeter) * 100;
    };
    measure();

    let frame = null;
    let last = null;
    let elapsed = 0; // only advances while visible, so beam and wave never drift apart
    let lastWave = "";

    const tick = (now) => {
      if (last !== null) elapsed = (elapsed + (now - last) / 1000) % duration;
      last = now;

      const offset = (elapsed / duration) * 100;
      beam.style.offsetDistance = `${offset}%`;

      // Beam behind the text: sweep the wave 95% -> 5% (both ends show only currentColor, no flash).
      // Before the text: parked right (0%). After: parked left (100%).
      let wave;
      if (offset >= textStart && offset <= textEnd && textEnd > textStart) {
        const t = (offset - textStart) / (textEnd - textStart);
        wave = `${95 - t * 90}% center`;
      } else {
        wave = offset < textStart ? "0% center" : "100% center";
      }
      if (wave !== lastWave) {
        span.style.backgroundPosition = wave;
        lastWave = wave;
      }

      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame !== null) return;
      last = null;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (frame === null) return;
      cancelAnimationFrame(frame);
      frame = null;
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(card);
    resizeObserver.observe(text);

    const visibilityObserver = new IntersectionObserver(([entry]) =>
      entry.isIntersecting ? start() : stop()
    );
    visibilityObserver.observe(card);

    return () => {
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [duration]);

  return (
    <div ref={cardRef} className={`relative w-full rounded-xl border border-zinc-200 ${className}`}>
      <BorderBeam
        beamRef={beamRef}
        className="isolate -z-1"
        size={beamSize}
        colorFrom={colorFrom}
        colorTo={colorTo}
      />

      {title && (
        <div className="absolute inset-x-0 top-0 flex -translate-y-1/2 items-center justify-center px-6 sm:px-10">
          <p
            ref={textRef}
            className={`${labelBg} px-3 sm:px-6 text-center font-medium text-zinc-700 text-sm sm:text-lg md:text-xl tracking-[-0.01em]`}
          >
            <span
              ref={waveSpanRef}
              style={{
                // The wave lives in the narrow 47–53% band of a 250%-wide gradient; the loop
                // above slides it across the text only while the beam is behind it.
                backgroundImage: WAVE_GRADIENT(colorFrom, colorTo),
                backgroundSize: "250% 100%",
                backgroundRepeat: "no-repeat",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundPosition: "0% center",
              }}
            >
              {title}
            </span>
          </p>
        </div>
      )}

      <div className="grid">
        <div className="flex min-w-0 items-center justify-center px-4 pt-10 pb-7 sm:px-10 sm:pt-12 sm:pb-10">
          <Marquee className={`mask-x-from-75% w-full items-center ${marqueeClassName}`} pauseOnHover repeat={6}>
            {children}
          </Marquee>
        </div>
      </div>
    </div>
  );
};

export default LogoCloud;
