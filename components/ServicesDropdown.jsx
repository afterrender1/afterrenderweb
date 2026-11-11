"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

// Add new services here; they show up in the navbar "Services" dropdown (desktop + mobile drawer)
export const SERVICES = [
  {
    href: "/ai-avatars",
    title: "AI Avatars",
    description: "Your digital twin makes videos for you, no camera needed.",
    image: "/images/ai-avatars-images/ai-avatar.webp",
    badge: "New",
  },
  {
    href: "/website",
    title: "Website",
    description: "Fast, custom and SEO-ready websites that win clients.",
       image: "/images/ai-avatars-images/website.webp",

  },
];

// Desktop "Services" dropdown. CSS transitions only (opacity/transform), no animation
// library and no blur, so it stays light on low-end devices.
export default function ServicesDropdown({ triggerClassName = "" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const isServicePage = SERVICES.some((service) => service.href === pathname);

  // Close on outside click and on Esc
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="services-dropdown"
        className={`inline-flex items-center gap-1 transition-colors cursor-pointer outline-none ${
          isServicePage ? "text-[#59B7FF]" : triggerClassName
        }`}
      >
        Services
        <ChevronDown
          size={15}
          strokeWidth={2.4}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        id="services-dropdown"
        inert={!open}
        className={`absolute left-1/2 top-full mt-4 w-[320px] -translate-x-1/2 origin-top rounded-xl border border-zinc-200 bg-white p-1.5 text-zinc-950 shadow-[0_10px_38px_-10px_rgba(15,23,42,0.25),0_10px_20px_-15px_rgba(15,23,42,0.2)] transition-[opacity,scale,translate,visibility] duration-150 ease-out motion-reduce:transition-none ${
          open ? "visible opacity-100 scale-100 translate-y-0" : "invisible opacity-0 scale-[0.97] -translate-y-1"
        }`}
      >
        <ul>
          {SERVICES.map(({ href, title, description, image, badge }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-start gap-3 rounded-lg p-2.5 transition-colors outline-none focus-visible:bg-zinc-100 ${
                    active ? "bg-zinc-100" : "hover:bg-zinc-100"
                  }`}
                >
                  <span className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-zinc-200 bg-zinc-50">
                    {image && (
                      <Image src={image} alt={title} fill sizes="36px" className="object-cover" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 text-sm font-semibold leading-tight">
                      {title}
                      {badge && (
                        <span className="rounded-full bg-[#E8F3FF] px-1.5 py-px text-[10px] font-semibold text-[#1a73e8]">
                          {badge}
                        </span>
                      )}
                    </span>
                    <span className="mt-1 block text-[13px] font-normal leading-snug text-zinc-500">
                      {description}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
