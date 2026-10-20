import React from "react";
import { ArrowRight } from "lucide-react";
import { announcementBackground, withStyleDefaults } from "@/app/lib/announcementStyle";

// Inline styles for the bar wrapper (background + text color)
export const announcementWrapperStyle = (style) => {
    const s = withStyleDefaults(style);
    return { background: announcementBackground(s), color: s.textColor };
};

// Two identical tracks sliding by -100% give a seamless infinite loop.
// The wrapper (positioning, height, background) is supplied by the caller.
const AnnouncementTrack = ({ text, style, showArrow = false, repeat = 6, compact = false }) => {
    const { accentColor } = withStyleDefaults(style);

    const track = (key) => (
        <div key={key} aria-hidden="true" className="flex shrink-0 items-center animate-announcement-track will-change-transform">
            {Array.from({ length: repeat }).map((_, i) => (
                <span
                    key={i}
                    className={`flex items-center whitespace-nowrap ${compact ? "gap-1.5 px-3" : "gap-3 px-6"}`}
                >
                    <span
                        className={`rounded-full shrink-0 ${compact ? "w-1 h-1" : "w-1.5 h-1.5"}`}
                        style={{ backgroundColor: accentColor }}
                    />
                    {text}
                    {showArrow && (
                        <ArrowRight size={compact ? 9 : 14} className="shrink-0" style={{ color: accentColor }} />
                    )}
                </span>
            ))}
        </div>
    );

    return (
        <>
            <span className="sr-only">{text}</span>
            {track(0)}
            {track(1)}
        </>
    );
};

export default AnnouncementTrack;
