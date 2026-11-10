import React from "react";

// Infinite marquee (Magic UI style). Pure CSS animation (`animate-marquee` in globals.css),
// so it runs on the compositor with no JS per frame.
// Tune per use with CSS vars on className: [--duration:20s] [--gap:3rem]
// (defaults 40s / 1rem live in the var() fallbacks, so overrides never fight a default class).
export function Marquee({
  className = "",
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 4,
  children,
  ...props
}) {
  return (
    <div
      {...props}
      className={`group flex overflow-hidden p-2 [gap:var(--gap,1rem)] ${
        vertical ? "flex-col" : "flex-row"
      } ${className}`}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          // Copies are only there to fill the loop; screen readers read the first one
          aria-hidden={i > 0 ? true : undefined}
          className={`flex shrink-0 justify-around [gap:var(--gap,1rem)] motion-reduce:[animation-play-state:paused] ${
            vertical ? "animate-marquee-vertical flex-col" : "animate-marquee flex-row items-center"
          } ${pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""} ${
            reverse ? "[animation-direction:reverse]" : ""
          }`}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
