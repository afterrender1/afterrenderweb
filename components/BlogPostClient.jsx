"use client";
import React, { useEffect, useRef, useState } from "react";
import { Check, Link2 } from "lucide-react";

// Thin bar at the very top showing how far the page has been read.
// Writes the transform directly (no React re-render per scroll event).
export const ReadingProgress = () => {
    const barRef = useRef(null);

    useEffect(() => {
        let frame = null;
        const update = () => {
            frame = null;
            const doc = document.documentElement;
            const max = doc.scrollHeight - window.innerHeight;
            const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
            if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
        };
        const onScroll = () => {
            if (frame === null) frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (frame !== null) cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <div className="fixed inset-x-0 top-0 z-[60] h-0.5 pointer-events-none" aria-hidden="true">
            <div ref={barRef} className="h-full origin-left bg-[#48A2FF]" style={{ transform: "scaleX(0)" }} />
        </div>
    );
};

// Copies the post URL; falls back to a hidden textarea where the Clipboard API isn't available
export const CopyLinkButton = ({ url, className = "" }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const t = setTimeout(() => setCopied(false), 2000);
        return () => clearTimeout(t);
    }, [copied]);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
        } catch {
            const area = document.createElement("textarea");
            area.value = url;
            area.setAttribute("readonly", "");
            area.style.position = "fixed";
            area.style.opacity = "0";
            document.body.appendChild(area);
            area.select();
            try {
                if (document.execCommand("copy")) setCopied(true);
            } finally {
                area.remove();
            }
        }
    };

    return (
        <button type="button" onClick={copy} className={className} aria-live="polite">
            {copied ? <Check size={14} /> : <Link2 size={14} />}
            {copied ? "Copied" : "Copy link"}
        </button>
    );
};
