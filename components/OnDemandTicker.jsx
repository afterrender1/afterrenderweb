"use client";

// Hero background for /pricing/on-demand: two arced rows of video cards drifting in opposite
// directions (an "eye" shape). Adapted from Originkit's Eye Gallery to play videos:
// top row = long form (landscape), bottom row = short form (portrait).
// Fast + light: tiny 6-second Cloudinary clips (~20–130 KB, no audio), only cards that are
// on screen play, everything pauses while the hero is scrolled away, and nothing renders
// until the container is measured (no hydration mismatch, no wasted downloads).

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const CLOUDINARY_VIDEO = "https://res.cloudinary.com/dlurrugno/video/upload";
const CLIP = {
  long: { video: "du_6,q_auto:low,w_320,c_limit,vc_h264,ac_none", poster: "so_0,w_320,c_limit,q_auto" },
  short: { video: "du_6,q_auto:low,w_200,c_limit,vc_h264,ac_none", poster: "so_0,w_200,c_limit,q_auto" },
};

// All from Our Work
const LONG_FORM = [
  "v1789477081/6_subs_1_fjnezv",
  "v1789480611/how_to_get_rid_of_moss_on_roofs_q1prfb",
  "v1789473496/Harel_g4s1bp",
  "v1789474628/Faadi_1_asqfaz",
  "v1789483221/The_Hardest_Lesson_I_Learned_as_a_YouTuber_r0efqs",
  "v1789474516/Panda_Express1_f9yo42",
  "v1789474465/Spirit_airline_wcoflo",
  "v1789478131/PROFIT_MAX_vmv64g",
];
const SHORT_FORM = [
  "v1789471253/black_short_1_vzynuh",
  "v1789477840/Han_reel_1_ik1u7i",
  "v1789471166/Ali_reel_1_rev_rhealk",
  "v1789481191/Reel_01_p64dct",
  "v1789485735/Reel_5_ejbmvc",
  "v1789471135/reel_5_s0gu5p",
  "v1789472020/Reel_4_fnavvl",
  "v1789485068/reel-7_py9rkc",
  "v1789471214/Indulge_spa_1_dtgdmm",
  "v1789485082/Reel-9_qm1qmz",
  "v1789471770/Gage_reel_1_qeemre",
  "v1789485708/Reel_09_wszdtq",
  "v1789471786/Alex_short_1_agkwns",
  "v1789472093/Alexing_closing_jw0ln9",
];

// Card sizes at a 1200px wide hero; scaled with the hero width
const ROWS = {
  top: { kind: "long", ids: LONG_FORM, width: 200, height: 112, direction: "right" },
  bottom: { kind: "short", ids: SHORT_FORM, width: 104, height: 185, direction: "left" },
};
const GAP = 28;
const ROW_GAP = 170;
const ARC = 0.63; // how far the rows bow apart in the middle (0–1)
const PX_PER_SECOND = 56;
const EDGE_FADE = 12; // % faded at the left/right edges
const CARD_SHADOW = "0 18px 42px rgba(22, 24, 29, 0.14)";

function TickerRow({ row, side, width, height, scale, running, still }) {
  const cardRefs = useRef([]);
  const videoRefs = useRef([]);
  const shown = useRef([]);

  const cardW = row.width * scale;
  const cardH = row.height * scale;
  const gap = GAP * scale;
  const radius = 12 * scale;
  const step = cardW + gap;
  const outside = Math.max(cardW * 0.75, width * 0.06);
  const pathWidth = Math.max(1, width - cardW + outside * 2);
  // Just enough cards to cover the visible stretch without one being needed twice
  const count = Math.max(2, Math.ceil((width + cardW * 1.5) / step) + 1);
  const loopLength = count * step;

  const bow = side === "top" ? -1 : 1;
  const baseline = height / 2 + (bow * ROW_GAP * scale) / 2;
  const amplitude = Math.max(0, height / 2 - cardH / 2) * ARC;
  const dirSign = row.direction === "left" ? -1 : 1;

  const placeAt = (index, travel) => {
    const wrapped = (((index * step + travel) % loopLength) + loopLength) % loopLength;
    const progress = Math.max(0, Math.min(1, wrapped / pathWidth));
    const x = wrapped - outside;
    const y = baseline + bow * amplitude * Math.sin(Math.PI * progress) - cardH / 2;
    const visible = x > -cardW * 1.25 && x < width + cardW * 0.25;
    return { x, y, visible, z: Math.round(dirSign * x) + 100000 };
  };

  useEffect(() => {
    // React doesn't reliably render `muted`; browsers only autoplay muted video
    for (const v of videoRefs.current) {
      if (v) {
        v.muted = true;
        v.defaultMuted = true;
      }
    }
    shown.current = [];

    const setVisible = (i, visible) => {
      if (shown.current[i] === visible) return;
      shown.current[i] = visible;
      const v = videoRefs.current[i];
      if (!v) return;
      if (visible && running) v.play()?.catch(() => {});
      else v.pause();
    };

    const sign = row.direction === "left" ? -1 : 1;
    const start = performance.now();
    let frame = 0;

    const tick = (now) => {
      const travel = still ? 0 : ((now - start) / 1000) * PX_PER_SECOND * scale * sign;
      for (let i = 0; i < count; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const { x, y, visible, z } = placeAt(i, travel);
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        el.style.opacity = visible ? "1" : "0";
        el.style.zIndex = String(z);
        setVisible(i, visible);
      }
      if (running && !still) frame = requestAnimationFrame(tick);
    };

    tick(performance.now());
    if (!running) for (const v of videoRefs.current) v?.pause();

    return () => cancelAnimationFrame(frame);
    // placeAt only depends on the values below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, step, loopLength, pathWidth, outside, baseline, amplitude, cardH, width, scale, running, still, row.direction]);

  const clip = CLIP[row.kind];
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const id = row.ids[i % row.ids.length];
        const at = placeAt(i, 0);
        return (
          <div
            key={i}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: cardW,
              height: cardH,
              borderRadius: radius,
              boxShadow: CARD_SHADOW,
              overflow: "hidden",
              background: "#e5e7eb",
              willChange: "transform",
              transform: `translate3d(${at.x}px, ${at.y}px, 0)`,
              opacity: at.visible ? 1 : 0,
              zIndex: at.z,
            }}
          >
            <video
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              src={`${CLOUDINARY_VIDEO}/${clip.video}/${id}.mp4`}
              poster={`${CLOUDINARY_VIDEO}/${clip.poster}/${id}.jpg`}
              muted
              loop
              playsInline
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              tabIndex={-1}
              aria-hidden="true"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function OnDemandTicker({ className = "" }) {
  const containerRef = useRef(null);
  const [size, setSize] = useState(null); // null until measured: render nothing before that
  const [inView, setInView] = useState(true);
  const [still, setStill] = useState(false);

  useIsoLayoutEffect(() => {
    const node = containerRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    // Fires once right away with the initial size, then on every resize
    const observer = new ResizeObserver(() => {
      const width = node.clientWidth;
      const height = node.clientHeight;
      if (width && height) setSize((prev) => (prev && prev.width === width && prev.height === height ? prev : { width, height }));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Pause everything (videos + animation) while the hero is scrolled away
  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Reduced motion: keep the cards (and videos) but stop the drifting
  useEffect(() => {
    const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!query) return;
    const update = () => setStill(query.matches);
    query.addEventListener?.("change", update);
    const t = setTimeout(update, 0);
    return () => {
      clearTimeout(t);
      query.removeEventListener?.("change", update);
    };
  }, []);

  const scale = size ? Math.max(0.62, Math.min(1.2, size.width / 1200)) : 1;
  const fadeMask = `linear-gradient(to right, transparent 0%, black ${EDGE_FADE}%, black ${100 - EDGE_FADE}%, transparent 100%)`;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-500 ${size ? "opacity-100" : "opacity-0"} ${className}`}
      style={{ isolation: "isolate", maskImage: fadeMask, WebkitMaskImage: fadeMask }}
    >
      {size && (
        <>
          <TickerRow row={ROWS.top} side="top" width={size.width} height={size.height} scale={scale} running={inView} still={still} />
          <TickerRow row={ROWS.bottom} side="bottom" width={size.width} height={size.height} scale={scale} running={inView} still={still} />
        </>
      )}
    </div>
  );
}
