"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus_Jakarta_Sans, Playfair_Display } from "@/app/lib/fonts";
import { ArrowUpRight } from "lucide-react";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "600", "700"],
});

const testimonials = [
  {
    id: 1,
    name: "DEBORAH",
    company: "Medical Creator",
    image: "/images/clients/deborah.png",
    quotePrefix: "AfterRender really are the ",
    highlight: "ultimate content team",
    quoteSuffix:
      ". The videos came out clean, educational, and engaging — not easy to pull off.",
    metrics: [
      { value: "700+hrs", label: "Editing time saved" },
      { value: "$14k+", label: "Cost Saving" },
      { value: "120+", label: "Videos Delivered" },
    ],
  },
  {
    id: 2,
    name: "TRACTION",
    company: "Digital Entrepreneur",
    image: "/images/clients/traction.png",
    quotePrefix: "Been great working with them, ",
    highlight: "always super fast",
    quoteSuffix: " and smooth. My content finally looks and feels like my brand.",
    metrics: [
      { value: "1.9k+hrs", label: "Editing time saved" },
      { value: "$35k+", label: "Cost Saving" },
      { value: "150+", label: "Videos Delivered" },
    ],
  },
  {
    id: 3,
    name: "FINEPOINT",
    company: "SaaS Company",
    image: "/images/clients/finep.png",
    quotePrefix: "AfterRender built a full creative system for us. ",
    highlight: "The quality & communication",
    quoteSuffix: " is top tier, with better engagement and lower ad costs.",
    metrics: [
      { value: "3k+hrs", label: "Editing time saved" },
      { value: "$50k+", label: "Cost Saving" },
      { value: "200+", label: "Videos Delivered" },
    ],
  },
  {
    id: 4,
    name: "CRYPTO SIMBA",
    company: "Crypto Trader",
    image: "/images/clients/crypto.png",
    quotePrefix: "The turnaround time is unbelievable. Every video hits the right tone with ",
    highlight: "clean edits and high watch time",
    quoteSuffix: " across our channels.",
    metrics: [
      { value: "1.2k+hrs", label: "Editing time saved" },
      { value: "$22k+", label: "Cost Saving" },
      { value: "180+", label: "Videos Delivered" },
    ],
  },
  {
    id: 5,
    name: "AUDREY",
    company: "Fitness Coach",
    image: "/images/clients/metabolic.png",
    quotePrefix: "Loved how simple the process was. ",
    highlight: "The best subscription decision",
    quoteSuffix: " — I just sent my clips and the final videos came back polished.",
    metrics: [
      { value: "2.4k+hrs", label: "Editing time saved" },
      { value: "$40k+", label: "Cost Saving" },
      { value: "250+", label: "Videos Delivered" },
    ],
  },
];

const PricingTestimonials = () => {
  const scrollRef = useRef(null);
  const firstTrackRef = useRef(null);
  const touchingRef = useRef(false);
  const hoverRef = useRef(false);
  const pausedRef = useRef(false);
  const pauseTimerRef = useRef(null);

  // Pause auto-scroll briefly after the visitor interacts (wheel, swipe momentum)
  const pauseAutoScroll = (ms = 2500) => {
    pausedRef.current = true;
    clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, ms);
  };

  // Auto-scrolls on its own but is a real scroll container, so it can be swiped with a thumb
  // or dragged/wheeled. Three identical tracks let it loop in both directions.
  useEffect(() => {
    const el = scrollRef.current;
    const track = firstTrackRef.current;
    if (!el || !track) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SPEED = 40; // px per second
    let raf;
    let last = 0;
    let pos = track.offsetWidth; // start on the middle copy
    el.scrollLeft = pos;

    const tick = (now) => {
      const dt = last ? Math.min(now - last, 64) / 1000 : 0;
      last = now;
      const w = track.offsetWidth;

      const paused =
        touchingRef.current || hoverRef.current || pausedRef.current || reduceMotion;

      if (paused) {
        pos = el.scrollLeft; // follow the user
      } else {
        pos += SPEED * dt;
        el.scrollLeft = pos;
      }

      // Jump one full copy to stay in the middle; invisible because the copies are identical
      if (w > 0 && !touchingRef.current) {
        if (el.scrollLeft >= 2 * w) {
          pos = el.scrollLeft - w;
          el.scrollLeft = pos;
        } else if (el.scrollLeft < w * 0.5) {
          pos = el.scrollLeft + w;
          el.scrollLeft = pos;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(pauseTimerRef.current);
    };
  }, []);

  return (
    <section
      className={`${jakarta.className} relative bg-[#FAFAFA] text-black py-14 sm:py-20 lg:py-24 overflow-hidden`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">
              Testimonial
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
              <span>Success Stories </span>
              <span className={`${playfair.className} italic font-normal text-gray-900`}>
                from the Creative Frontline.
              </span>
            </h2>
            <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed">
              From startups to global teams, our creative process fuels success
              stories built on strategy, design, and seamless execution.
            </p>
          </div>

          {/* Trustpilot link */}
          <Link
            href="https://www.trustpilot.com/review/afterrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 self-start md:self-auto shrink-0 text-sm font-semibold text-gray-800 hover:text-black transition-colors"
          >
            <span className="relative h-12 w-12 shrink-0">
              <Image src="/images/tp.png" alt="Trustpilot" fill sizes="48px" className="object-contain" />
            </span>
            <span>See more reviews on Trustpilot</span>
            <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-black transition-colors" />
          </Link>
        </div>
      </div>

      {/* Carousel: auto-scrolls and can be swiped */}
      <div className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 sm:w-20 bg-gradient-to-r from-[#FAFAFA] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 sm:w-20 bg-gradient-to-l from-[#FAFAFA] to-transparent z-10" />

        <div
          ref={scrollRef}
          className="w-full overflow-x-auto no-scrollbar"
          onTouchStart={() => {
            touchingRef.current = true;
          }}
          onTouchEnd={() => {
            touchingRef.current = false;
            pauseAutoScroll(3000); // let the swipe momentum finish
          }}
          onTouchCancel={() => {
            touchingRef.current = false;
            pauseAutoScroll(3000);
          }}
          onWheel={() => pauseAutoScroll()}
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") hoverRef.current = true;
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") hoverRef.current = false;
          }}
        >
          <div className="flex w-max">
            {["a", "b", "c"].map((track, trackIndex) => (
              <div
                key={track}
                ref={trackIndex === 0 ? firstTrackRef : undefined}
                className="flex gap-4 sm:gap-6 shrink-0 pr-4 sm:pr-6"
              >
                {testimonials.map((item) => (
                  <article
                    key={`${track}-${item.id}`}
                    className="flex flex-col justify-between w-[84vw] max-w-[340px] sm:w-[400px] sm:max-w-none lg:w-[440px] shrink-0 rounded-xl border border-gray-200 bg-white p-5 sm:p-6 select-none"
                  >
                    <p className="text-[15px] leading-relaxed text-gray-800">
                      {item.quotePrefix}
                      <span className="font-semibold text-black">{item.highlight}</span>
                      {item.quoteSuffix}
                    </p>

                    <div className="mt-5">
                      <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-gray-100">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="44px"
                            className="object-cover"
                            unoptimized
                          />
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-gray-950 uppercase tracking-tight truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">{item.company}</p>
                        </div>
                      </div>

                      <dl className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-gray-50 px-3 py-3">
                        {item.metrics.map((metric) => (
                          <div key={metric.label}>
                            <dt className="sr-only">{metric.label}</dt>
                            <dd className="text-sm sm:text-[15px] font-bold text-gray-950 tracking-tight">
                              {metric.value}
                            </dd>
                            <p className="mt-0.5 text-[11px] leading-tight text-gray-500" aria-hidden="true">
                              {metric.label}
                            </p>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingTestimonials;
