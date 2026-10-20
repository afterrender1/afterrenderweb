"use client";
import { useEffect } from "react";

const GA_ID = "G-RD7E0KSRCH";
const PIXEL_ID = "1024339690404455";

// gtag.js (~175KB) and the Meta Pixel (~280KB) were the biggest main-thread cost on
// first load. Load them on the visitor's first interaction (a real visitor moves the
// mouse, scrolls or taps almost immediately), or a few seconds after page load as a
// fallback, so they stay out of the critical rendering window.
const INTERACTION_EVENTS = ["pointerdown", "pointermove", "keydown", "scroll", "touchstart", "wheel"];
const FALLBACK_DELAY_MS = 6000;

const addScript = (src) => {
  const s = document.createElement("script");
  s.src = src;
  s.async = true;
  document.head.appendChild(s);
};

const loadGoogleAnalytics = () => {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { page_path: window.location.pathname });
  addScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
};

const loadMetaPixel = () => {
  if (window.fbq) return;
  // Standard Meta Pixel queue stub: calls made before fbevents.js arrives are replayed
  const n = (window.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  });
  if (!window._fbq) window._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  addScript("https://connect.facebook.net/en_US/fbevents.js");
  window.fbq("init", PIXEL_ID);
  window.fbq("track", "PageView");
};

export default function DeferredAnalytics() {
  useEffect(() => {
    let timer;
    let done = false;

    const load = () => {
      if (done) return;
      done = true;
      cleanup();
      loadGoogleAnalytics();
      loadMetaPixel();
    };
    const startFallback = () => {
      timer = setTimeout(load, FALLBACK_DELAY_MS);
    };
    const cleanup = () => {
      INTERACTION_EVENTS.forEach((e) => window.removeEventListener(e, load));
      window.removeEventListener("load", startFallback);
      clearTimeout(timer);
    };

    INTERACTION_EVENTS.forEach((e) => window.addEventListener(e, load, { once: true, passive: true }));
    if (document.readyState === "complete") startFallback();
    else window.addEventListener("load", startFallback, { once: true });

    return cleanup;
  }, []);

  return null;
}
