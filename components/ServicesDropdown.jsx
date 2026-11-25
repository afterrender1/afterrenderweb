"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
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
  {
    href: "/pricing",
    title: "Video Editing",
    description: "Pro editing for reels, YouTube and ads, delivered fast.",
    image: "/images/ai-avatars-images/video-edit.webp",
  },
];

// The pricing icons sit in the middle of a wide white canvas; this zoom crops them
// so the icon itself fills the small square thumbnail.
export const PRICING_ICON_ZOOM = "scale-[1.52]";

// Navbar "Pricing" dropdown (desktop + mobile drawer)
export const PRICING_LINKS = [
  {
    href: "/pricing",
    title: "AfterRender Subscription",
    description: "Unlimited edits for one monthly price.",
    image: "/images/price-images/AfterRender-Subscription-Icon.webp",
    imageClassName: PRICING_ICON_ZOOM,
    // Rendered ~82px wide (3:2 canvas, zoomed 1.52x into a 36px box); ask for ~2x that so the
    // browser fetches a 256-640px copy and the icon stays crisp on normal and retina screens
    imageSizes: "168px",
  },
  {
    href: "/pricing/on-demand",
    title: "AfterRender On Demand",
    description: "Pay per project, no subscription.",
    image: "/images/price-images/On-Demand-Play-Clapperboard-Icon.webp",
    imageClassName: PRICING_ICON_ZOOM,
    // Rendered ~82px wide (3:2 canvas, zoomed 1.52x into a 36px box); ask for ~2x that so the
    // browser fetches a 256-640px copy and the icon stays crisp on normal and retina screens
    imageSizes: "168px",
  },
];

// Grace period before a hover-opened menu closes, so a slightly wobbly mouse path doesn't shut it
const HOVER_CLOSE_DELAY = 150;
// A click this soon after hover opened the menu is the same "open it" intent, so it must not
// immediately close it again (the classic hover + click double-trigger bug)
const HOVER_CLICK_GRACE = 450;

// Only one navbar dropdown is open at a time: opening one closes the other right away
let closeActiveDropdown = null;

// Desktop navbar dropdown ("Services" by default, also used for "Pricing"). CSS transitions
// only (opacity/transform), no animation library and no blur, so it stays light on low-end devices.
//
// Opens on mouse hover AND on click/tap/keyboard:
// - Mouse hover opens it; leaving closes it after a short delay.
// - Clicking the trigger pins it open (it then stays open when the mouse leaves); clicking again closes it.
// - Touch devices ignore hover and simply toggle on tap.
// - Outside click, Esc, picking a link, or tabbing out also close it.
export default function ServicesDropdown({
  triggerClassName = "",
  label = "Services",
  items = SERVICES,
  menuId = "services-dropdown",
  // Pages that shouldn't light up this trigger (e.g. /pricing belongs to the Pricing menu)
  ignoreActive = [],
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const closeTimerRef = useRef(null);
  const pinnedRef = useRef(false);
  const hoverOpenedAtRef = useRef(0);

  const isServicePage = !ignoreActive.includes(pathname) && items.some((item) => item.href === pathname);

  const cancelScheduledClose = () => {
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  };

  const closeMenu = useCallback(() => {
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
    pinnedRef.current = false;
    hoverOpenedAtRef.current = 0;
    setOpen(false);
  }, []);

  const openMenu = useCallback(() => {
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
    if (closeActiveDropdown && closeActiveDropdown !== closeMenu) closeActiveDropdown();
    closeActiveDropdown = closeMenu;
    setOpen(true);
  }, [closeMenu]);

  // No longer the open dropdown once closed
  useEffect(() => {
    if (!open && closeActiveDropdown === closeMenu) closeActiveDropdown = null;
  }, [open, closeMenu]);

  // Unmount: drop any pending timer and the shared "open dropdown" slot
  useEffect(
    () => () => {
      clearTimeout(closeTimerRef.current);
      if (closeActiveDropdown === closeMenu) closeActiveDropdown = null;
    },
    [closeMenu]
  );

  // Close on outside click and on Esc
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) closeMenu();
    };
    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      // Keep keyboard users on the trigger instead of losing focus inside a hidden menu
      if (rootRef.current?.contains(document.activeElement)) triggerRef.current?.focus();
      closeMenu();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closeMenu]);

  const handlePointerEnter = (e) => {
    if (e.pointerType !== "mouse") return;
    cancelScheduledClose();
    if (!open) {
      hoverOpenedAtRef.current = Date.now();
      openMenu();
    }
  };

  const handlePointerLeave = (e) => {
    if (e.pointerType !== "mouse" || pinnedRef.current) return;
    cancelScheduledClose();
    closeTimerRef.current = setTimeout(closeMenu, HOVER_CLOSE_DELAY);
  };

  const handleTriggerClick = () => {
    if (!open) {
      pinnedRef.current = true;
      openMenu();
      return;
    }
    // Hover opened it a moment ago: keep it open (and pinned) instead of closing it
    if (!pinnedRef.current && Date.now() - hoverOpenedAtRef.current < HOVER_CLICK_GRACE) {
      pinnedRef.current = true;
      return;
    }
    closeMenu();
  };

  // Tabbing out of the dropdown closes it (clicks on non-focusable spots have no relatedTarget)
  const handleBlur = (e) => {
    if (open && e.relatedTarget && !rootRef.current?.contains(e.relatedTarget)) closeMenu();
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onBlur={handleBlur}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={handleTriggerClick}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        className={`inline-flex items-center gap-1 transition-colors cursor-pointer outline-none ${
          isServicePage ? "text-[#59B7FF]" : triggerClassName
        }`}
      >
        {label}
        <ChevronDown
          size={15}
          strokeWidth={2.4}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* pt-4 (not mt-4) so the gap under the trigger is part of the menu: the mouse can
          travel from the trigger to the panel without "leaving" and closing it */}
      <div
        id={menuId}
        inert={!open}
        className={`absolute left-1/2 top-full z-10 w-[320px] -translate-x-1/2 pt-4 origin-top transition-[opacity,scale,translate,visibility] duration-150 ease-out motion-reduce:transition-none ${
          open ? "visible opacity-100 scale-100 translate-y-0" : "invisible opacity-0 scale-[0.97] -translate-y-1"
        }`}
      >
        <ul className="rounded-xl border border-zinc-200 bg-white p-1.5 text-zinc-950 shadow-[0_10px_38px_-10px_rgba(15,23,42,0.25),0_10px_20px_-15px_rgba(15,23,42,0.2)]">
          {items.map(({ href, title, description, image, imageClassName = "", imageSizes = "36px", badge }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={closeMenu}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-start gap-3 rounded-lg p-2.5 transition-colors outline-none focus-visible:bg-zinc-100 ${
                    active ? "bg-zinc-100" : "hover:bg-zinc-100"
                  }`}
                >
                  <span className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-zinc-200 bg-zinc-50">
                    {image && (
                      <Image src={image} alt="" fill sizes={imageSizes} className={`object-cover ${imageClassName}`} />
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
