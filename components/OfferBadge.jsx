import React from "react";
import { Tag } from "lucide-react";

// Google-style chip (solid fill, elevation-1 shadow) pinned above a button.
// The parent must be `relative`.
const OfferBadge = ({ text, color = "#EF4444", className = "" }) => (
  <span
    className={`pointer-events-none absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-1 whitespace-nowrap rounded-full pl-1.5 pr-2 h-5 text-[11px] font-medium leading-none tracking-[0.01em] text-white shadow-[0_1px_2px_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] ${className}`}
    style={{ backgroundColor: color, fontFamily: "Roboto, Arial, sans-serif" }}
  >
    <Tag size={11} strokeWidth={2.5} className="shrink-0" />
    {text}
  </span>
);

export default OfferBadge;
