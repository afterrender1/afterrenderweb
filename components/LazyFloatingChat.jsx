"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// The chat widget (and its framer-motion code) isn't needed for first paint, so
// load it once the page is idle instead of hydrating it with everything else.
const FloatingChatWidget = dynamic(() => import("./FloatingChatWidget"), { ssr: false });

export default function LazyFloatingChat() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId;
    let timer;
    const show = () => setReady(true);
    const schedule = () => {
      if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(show, { timeout: 3000 });
      else timer = setTimeout(show, 1500);
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      window.removeEventListener("load", schedule);
      if (idleId) window.cancelIdleCallback(idleId);
      clearTimeout(timer);
    };
  }, []);

  return ready ? <FloatingChatWidget /> : null;
}
