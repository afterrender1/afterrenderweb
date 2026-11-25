"use client";

import React, { Suspense, use, useEffect, useState } from "react";
import {
  motion,
  animate,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { Plus_Jakarta_Sans, Playfair_Display } from "@/app/lib/fonts";
import { Check, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import OfferBadge from "./OfferBadge";
import EventHeroBackdrop from "./EventHeroBackdrop";
import { BILLING_PERIODS, withPricingDefaults } from "@/app/lib/pricingPlans";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "600", "700"],
});

const CALENDLY_URL = "https://calendly.com/afterrenderagency/new-meeting";

const INTRO = {
  lead: "Unlimited requests and revisions.",
  detail: "Continuous editing on a rolling basis. As soon as you approve a request, we start the next.",
};

const BASIC_FEATURES = [
  { label: "Same editor for all projects*" },
  { label: "Same post-production manager for all projects" },
  { label: "No limits on duration" },
  { label: "Unlimited brands and/or businesses" },
  { label: "Animations", note: "(motion graphics)" },
  { label: "Speed ramps" },
  { label: "Photography editing", note: "(Lightroom)" },
  { label: "Graphic design", note: "(Adobe Illustrator or Canva)" },
];

const NONSTOP_FEATURE = {
  label: "Unlimited requests and revisions",
  note: "(one at a time, nonstop workflow)",
  highlight: true,
};

// Plan text only. Prices come from admin (Events → Pricing) via the `prices` prop.
const PLANS = [
  {
    id: "basic",
    name: "Basic",
    description: "For all kinds of content (except weddings)",
    output: [
      { count: "12-30", label: "Short-form" },
      { count: "4-8", label: "Long-form" },
    ],
    standard: [
      { label: "Short-form", time: "Next day", batch: "Batch of 3" },
      { label: "Long-form", time: "1 to 3 days" },
    ],
    complex: [
      { label: "Short-form", time: "1 to 2 days" },
      { label: "Long-form", time: "2 to 5 days" },
    ],
    featuresTitle: "Features",
    features: {
      monthly: BASIC_FEATURES,
      quarterly: [NONSTOP_FEATURE, ...BASIC_FEATURES],
      semiAnnual: [NONSTOP_FEATURE, ...BASIC_FEATURES],
    },
    theme: "peach",
  },
  {
    id: "plus",
    name: "Plus",
    description: "For all kinds of content (including weddings)",
    output: [
      { count: "24-60", label: "Short-form" },
      { count: "8-16", label: "Long-form" },
    ],
    standard: [
      { label: "Short-form", time: "Next day", batch: "Batch of 6" },
      { label: "Long-form", time: "1 to 3 days", batch: "Batch of 2" },
    ],
    complex: [
      { label: "Short-form", time: "1 to 2 days", batch: "Batch of 2" },
      { label: "Long-form", time: "2 to 5 days", batch: "Batch of 2" },
      { label: "1 Wedding Edit", time: "10 days" },
    ],
    featuresTitle: "All features in BASIC and also:",
    features: [{ label: "Video edits for weddings" }],
    theme: "indigo",
    featured: true,
  },
  {
    id: "ultra",
    name: "Ultra",
    description: "For all kinds of content (including weddings)",
    output: [
      { count: "48-110", label: "Short-form" },
      { count: "12-24", label: "Long-form" },
    ],
    standard: [
      { label: "6 Short-form", time: "Same day", badge: "fast" },
      { label: "2 Long-form", time: "Same day", badge: "fast" },
    ],
    complex: [
      { label: "2 Short-form", time: "Same day", badge: "fast" },
      { label: "1 Long-form", time: "Next day", badge: "next" },
      { label: "1 Wedding Edit", time: "5 days" },
    ],
    featuresTitle: "All features in PLUS and also:",
    features: [
      { label: "Same day deliveries where it applies" },
      { label: "Weekly calls with the team", note: "(upon request)" },
      { label: "Software integration", note: "(BETA)" },
    ],
    theme: "sky",
  },
];

// Soft tinted corner + pattern at the top of each card, plus one quiet accent color for the body
const CARD_THEMES = {
  peach: {
    glow: "radial-gradient(120% 75% at 0% 0%, rgba(255,190,160,0.55) 0%, rgba(255,222,205,0.28) 35%, rgba(255,255,255,0) 65%)",
    pattern: null,
    dot: "bg-[#EE9F78]",
    check: "text-[#D9784C]",
  },
  indigo: {
    glow: "radial-gradient(120% 80% at 50% 0%, rgba(150,165,255,0.45) 0%, rgba(205,212,255,0.25) 40%, rgba(255,255,255,0) 70%)",
    pattern: {
      backgroundImage: "radial-gradient(rgba(96,112,212,0.28) 1px, transparent 1.4px)",
      backgroundSize: "16px 16px",
      maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 85%)",
      WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 85%)",
    },
    dot: "bg-[#5F6FD3]/80",
    check: "text-[#5F6FD3]",
  },
  sky: {
    glow: "radial-gradient(120% 75% at 100% 0%, rgba(150,210,255,0.5) 0%, rgba(200,232,255,0.26) 40%, rgba(255,255,255,0) 68%)",
    pattern: {
      backgroundImage:
        "linear-gradient(rgba(56,140,200,0.13) 1px, transparent 1px), linear-gradient(90deg, rgba(56,140,200,0.13) 1px, transparent 1px)",
      backgroundSize: "22px 22px",
      maskImage: "radial-gradient(90% 100% at 100% 0%, rgba(0,0,0,0.95), transparent 75%)",
      WebkitMaskImage: "radial-gradient(90% 100% at 100% 0%, rgba(0,0,0,0.95), transparent 75%)",
    },
    dot: "bg-sky-400",
    check: "text-sky-600",
  },
};

// Gradient border for the featured (Plus) card: strong indigo at the top (meets the
// "Most popular" cap) and the bottom, fading softly through the middle
const FEATURED_BORDER = {
  border: "1.5px solid transparent",
  background:
    "linear-gradient(#fff, #fff) padding-box, linear-gradient(180deg, #5F6FD3 0%, rgba(95,111,211,0.35) 28%, rgba(95,111,211,0.16) 50%, rgba(124,108,240,0.45) 78%, #6D5FE0 100%) border-box",
};

// Counts up/down from the previous value to the new one whenever `value` changes
function AnimatedNumber({ value }) {
  const motionValue = useMotionValue(value);
  const [display, setDisplay] = useState(value);

  useMotionValueEvent(motionValue, "change", (latest) =>
    setDisplay(Math.round(latest))
  );

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 0.6,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [motionValue, value]);

  return <>{display}</>;
}

const SectionTitle = ({ children, hint }) => (
  <div className="mb-3.5">
    <h4 className="text-[14px] font-semibold text-gray-950 tracking-tight leading-snug">
      {children}
    </h4>
    {hint && <p className="mt-0.5 text-[12.5px] text-gray-500">{hint}</p>}
  </div>
);

// Same-day deliveries (Ultra) just get a small bolt in front; no colored pill
function DeliveryTime({ time, badge }) {
  return (
    <span className="inline-flex items-baseline gap-1 text-[13.5px] font-semibold text-gray-950 whitespace-nowrap">
      {badge === "fast" && (
        <Zap className="self-center w-3 h-3 text-gray-900" fill="currentColor" strokeWidth={0} aria-hidden="true" />
      )}
      {time}
    </span>
  );
}

// Menu-style rows: what you get on the left, how fast on the right, dotted leader in between
const DeliveryGroup = ({ title, rows, dot }) => (
  <div>
    <p className="flex items-center gap-2 text-[12.5px] font-medium text-gray-500">
      <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      {title}
    </p>
    <ul className="mt-2.5 space-y-2.5">
      {rows.map(({ label, time, batch, badge }) => (
        <li key={label}>
          <div className="flex items-baseline gap-2">
            <span className="text-[13.5px] text-gray-700 whitespace-nowrap">{label}</span>
            <span
              aria-hidden="true"
              className="flex-1 min-w-4 border-b border-dotted border-gray-300 -translate-y-[3px]"
            />
            <DeliveryTime time={time} badge={badge} />
          </div>
          {batch && <p className="mt-0.5 text-[12px] text-gray-500">{batch}</p>}
        </li>
      ))}
    </ul>
  </div>
);

// Live event (admin → Events) from the server, streamed in. Never rejects (getActiveEvent
// returns null on failure); no promise = defaults. Must be read inside a <Suspense>.
const useLiveEvent = (eventPromise) => (eventPromise ? use(eventPromise) : null);

const discountOf = (offer) => (offer?.discountPercent > 0 ? offer.discountPercent : 0);

// Same box as the real price row, so nothing jumps when the price arrives
function PriceSkeleton({ billedText }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1" role="status">
      <span className="sr-only">Loading price</span>
      {/* Invisible "$0000" in the price's own font: same height, width and baseline as the real price */}
      <span
        aria-hidden="true"
        className="price-shimmer inline-block rounded-lg text-transparent select-none text-[30px] min-[380px]:text-[34px] sm:text-[36px] leading-none font-bold tracking-tight"
      >
        $0000
      </span>
      <span className="text-[12.5px] font-medium text-gray-600">{billedText}</span>
    </div>
  );
}

// Price from the live event (custom prices + real discount), defaults otherwise
function PlanPrice({ eventPromise, planId, period }) {
  const event = useLiveEvent(eventPromise);
  const offer = event?.offer || null;
  const discount = discountOf(offer);
  const price = withPricingDefaults(event?.prices)[planId][period.id];
  const finalPrice = discount ? Math.round(price * (1 - discount / 100)) : price;

  return (
    <>
      {discount > 0 && (
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="text-sm font-semibold text-gray-400 tracking-tight line-through decoration-2"
            style={{ textDecorationColor: offer.badgeColor }}
          >
            <span className="sr-only">Regular price </span>
            $<AnimatedNumber value={price} />
          </span>
          <span
            className="inline-flex items-center h-5 px-2 rounded-full text-[11px] font-bold leading-none text-black"
            style={{ backgroundColor: `${offer.badgeColor}1F` }}
          >
            -{discount}%
          </span>
        </div>
      )}
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-[30px] min-[380px]:text-[34px] sm:text-[36px] leading-none font-bold text-gray-950 tracking-tight">
          {discount > 0 && <span className="sr-only">Offer price </span>}
          $<AnimatedNumber value={finalPrice} />
        </span>
        <span className="text-[12.5px] font-medium text-gray-600">{period.billedText}</span>
      </div>
    </>
  );
}

// Offer badge pinned above the CTA while the live event has an offer
function CtaOfferBadge({ eventPromise }) {
  const offer = useLiveEvent(eventPromise)?.offer;
  return offer ? <OfferBadge text={offer.text} color={offer.badgeColor} /> : null;
}

// Event background; the wrapper's data attribute turns on `isolation` for the section (globals.css)
function LiveBackdrop({ eventPromise }) {
  const url = useLiveEvent(eventPromise)?.backgroundUrl;
  if (!url) return null;
  return (
    <div data-event-backdrop="" className="contents">
      <EventHeroBackdrop url={url} />
    </div>
  );
}

function PlanCard({ plan, period, eventPromise, index }) {
  const theme = CARD_THEMES[plan.theme];
  const features = Array.isArray(plan.features) ? plan.features : plan.features[period.id];

  return (
    // Rendered visible straight away (no fade-in), so the cards show before any JS loads.
    // Non-featured cards drop by the cap height on desktop so all card tops line up.
    <div className={`flex flex-col min-w-0 ${plan.featured ? "" : "lg:mt-9"}`}>
      {/* "Most popular" cap: tucks 20px under the card so its rounded corners sit on it */}
      {plan.featured && (
        <div className="h-14 -mb-5 pb-5 px-5 sm:px-6 flex items-center justify-between rounded-t-[20px] bg-[#5F6FD3] text-white shadow-[0_10px_24px_-10px_rgba(95,111,211,0.7)]">
          <span className="text-[13px] font-semibold tracking-tight">Most popular</span>
          <Sparkles className="w-4 h-4" strokeWidth={2.25} aria-hidden="true" />
        </div>
      )}
      <div
        className={`relative flex-1 flex flex-col overflow-hidden rounded-[20px] ${
          plan.featured
            ? "shadow-[0_1px_2px_rgba(16,24,40,0.04),0_26px_50px_-22px_rgba(95,111,211,0.5)]"
            : "bg-white border border-gray-200/80 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_14px_36px_-14px_rgba(16,24,40,0.14)]"
        }`}
        style={plan.featured ? FEATURED_BORDER : undefined}
      >
        {/* Featured card: soft indigo glow along the bottom edge, under the gradient border */}
        {plan.featured && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-48"
            style={{
              background:
                "radial-gradient(90% 100% at 50% 100%, rgba(150,165,255,0.22) 0%, rgba(205,212,255,0.1) 45%, rgba(255,255,255,0) 75%)",
            }}
          />
        )}
        {/* Tinted corner glow + pattern */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-72" style={{ background: theme.glow }} />
        {theme.pattern && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-60" style={theme.pattern} />
        )}

        {/* Header: name, price, description, CTA */}
        <div className="relative p-5 min-[380px]:p-6 sm:p-7 lg:p-6 xl:p-7">
          <div className="flex items-center gap-2">
            <h3 className="text-[17px] font-semibold text-gray-950 tracking-tight">{plan.name}</h3>
            <span className="inline-flex items-center h-5 px-2 rounded-full bg-white/80 border border-gray-200 text-[10px] font-bold tracking-[0.08em] text-gray-600">
              UNLIMITED
            </span>
          </div>

          {/* Only the price waits for the server; the shimmer holds its place */}
          <div className="mt-5">
            <Suspense fallback={<PriceSkeleton billedText={period.billedText} />}>
              <PlanPrice eventPromise={eventPromise} planId={plan.id} period={period} />
            </Suspense>
          </div>

          <p className="mt-4 text-[13.5px] leading-relaxed text-gray-600 min-h-[22px]">{plan.description}</p>

          {/* Fixed top margin leaves room for the offer badge, so the button never shifts */}
          <div className="relative mt-6">
            <Suspense fallback={null}>
              <CtaOfferBadge eventPromise={eventPromise} />
            </Suspense>
            <Link
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`relative overflow-hidden isolate flex items-center justify-center w-full h-12 sm:h-11 rounded-[10px] text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                plan.featured
                  ? "bg-[#5F6FD3] text-white hover:bg-[#5262C9] shadow-[0_1px_2px_rgba(16,24,40,0.1),0_6px_16px_-6px_rgba(95,111,211,0.6)]"
                  : "bg-white text-gray-900 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-[0_1px_2px_rgba(16,24,40,0.06),0_2px_6px_rgba(16,24,40,0.04)]"
              }`}
            >
              {/* Auto shine sweeping across the button; staggered per card */}
              <span
                aria-hidden="true"
                className={`btn-shine ${plan.featured ? "btn-shine-light" : "btn-shine-tint"}`}
                style={{ animationDelay: `${index * 0.35}s` }}
              />
              <span className="relative">Get started</span>
            </Link>
          </div>
        </div>

        <div className="relative mx-5 min-[380px]:mx-6 sm:mx-7 lg:mx-6 xl:mx-7 border-t border-gray-200" />

        {/* Body: the promise, monthly output, delivery times, features — one section each */}
        <div className="relative flex-1 px-5 min-[380px]:px-6 sm:px-7 lg:px-6 xl:px-7 pb-2 divide-y divide-gray-100">
          <div className="py-5">
            <p className="text-[15px] font-semibold text-gray-950 tracking-tight leading-snug">
              {INTRO.lead}
            </p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-gray-600">{INTRO.detail}</p>
          </div>

          <div className="py-5">
            <SectionTitle>Average monthly output</SectionTitle>
            <div className="grid grid-cols-[1fr_auto_1fr] rounded-xl bg-gray-50 ring-1 ring-inset ring-gray-200/70">
              {[plan.output[0], null, plan.output[1]].map((item, i) =>
                item ? (
                  <div key={item.label} className="px-3 py-3.5 text-center">
                    <p className="text-[22px] font-bold text-gray-950 tracking-tight tabular-nums leading-none">
                      {item.count}
                    </p>
                    <p className="mt-1.5 text-[12.5px] text-gray-500">{item.label}</p>
                  </div>
                ) : (
                  <div key={`or-${i}`} className="flex flex-col items-center py-2.5">
                    <span aria-hidden="true" className="w-px flex-1 bg-gray-200" />
                    <span className="my-1 text-[11.5px] font-medium text-gray-400">or</span>
                    <span aria-hidden="true" className="w-px flex-1 bg-gray-200" />
                  </div>
                )
              )}
            </div>
            <p className="mt-2.5 text-center text-[12.5px] text-gray-500">Or a custom mix of both!</p>
          </div>

          <div className="py-5">
            <SectionTitle hint="On a rolling basis*">Estimated delivery times</SectionTitle>
            <div className="space-y-5">
              <DeliveryGroup title="Standard edits" rows={plan.standard} dot={theme.dot} />
              <DeliveryGroup
                title="Complex / Animated / After Effects"
                rows={plan.complex}
                dot={theme.dot}
              />
            </div>
          </div>

          <div className="py-5">
            <SectionTitle>{plan.featuresTitle}</SectionTitle>
            <ul className="space-y-2.5">
              {features.map(({ label, note, highlight }) => (
                <li key={label} className="flex items-start gap-2.5 text-[13.5px] leading-[1.45]">
                  <Check
                    aria-hidden="true"
                    className={`mt-[3px] w-3.5 h-3.5 shrink-0 ${highlight ? "text-gray-950" : theme.check}`}
                    strokeWidth={2.75}
                  />
                  <span className={highlight ? "font-semibold text-gray-950" : "text-gray-700"}>
                    {label}
                    {note && (
                      <>
                        {" "}
                        <span className="text-gray-500">{note}</span>
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// `eventPromise`: the live event (admin → Events) from the server, NOT awaited, so the whole
// section renders at once. Only the parts that depend on it wait (inside <Suspense>):
// `prices` replaces the default plan prices (shimmer until then), `offer` adds the CTA badge and,
// when offer.discountPercent > 0, really lowers the prices (original struck through),
// `backgroundUrl` swaps in the event background.
export default function PricingHero({ hideHeader = false, id = "plans", eventPromise = null }) {
  const [activePeriod, setActivePeriod] = useState(BILLING_PERIODS[0].id);
  const period = BILLING_PERIODS.find((p) => p.id === activePeriod) || BILLING_PERIODS[0];

  return (
    <section
      id={id}
      className={`${jakarta.className} pricing-hero relative min-h-screen bg-[#FAFAFA] text-black ${
        hideHeader ? "pt-8 sm:pt-12" : "pt-32 sm:pt-36"
      } pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col items-center justify-center`}
    >
      <Suspense fallback={null}>
        <LiveBackdrop eventPromise={eventPromise} />
      </Suspense>

      {/* Background Soft Mesh Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-b from-[#eaf4ff]/50 via-[#f5f8ff]/25 to-transparent blur-3xl pointer-events-none -z-10" />

      {!hideHeader && (
        <>
          {/* Floating Badges */}
          <div className="w-full max-w-3xl relative">
            {/* Left Floating Badge: @Subscribe */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, x: 0, rotate: -8 }}
              whileHover={{ scale: 1.06, rotate: -4 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute -top-7 left-1 sm:left-4 md:left-8 z-20 hidden sm:flex items-center gap-1 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] text-white text-[11px] md:text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-[0_8px_20px_rgba(59,130,246,0.3)] cursor-pointer select-none"
            >
              <span>@Subscribe</span>
            </motion.div>

            {/* Right Floating Badge: @Connect */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, x: 0, rotate: 10 }}
              whileHover={{ scale: 1.06, rotate: 6 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute -top-7 right-1 sm:right-4 md:right-8 z-20 hidden sm:flex items-center gap-1 bg-gradient-to-r from-[#c084fc] to-[#a855f7] text-white text-[11px] md:text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-[0_8px_20px_rgba(168,85,247,0.3)] cursor-pointer select-none"
            >
              <span>@Connect</span>
            </motion.div>
          </div>

          {/* Hero Title & Subtitle */}
          <div className="text-center max-w-2xl mx-auto z-10">
            <h1
              className="text-3xl sm:text-4xl md:text-[42px] tracking-tight text-[#111111] leading-[1.18]"
            >
              <span
                className={`${playfair.className} italic font-normal block sm:inline-block`}
              >
                Unlimited Creatives!
              </span>{" "}
              <span className="font-extrabold block sm:inline-block">One Subscription.</span>
            </h1>

            <p
              className="mt-3.5 text-[#555555] text-xs sm:text-sm md:text-[14.5px] leading-relaxed max-w-xl mx-auto font-medium"
            >
              From social media posts to full-scale video campaigns, choose the plan
              that matches your creative needs and watch your brand grow.
            </p>
          </div>
        </>
      )}

      {/* Billing Period Switcher */}
      <div className="relative mt-6 mb-9 sm:mb-10 z-10 max-w-full">
        <div
          role="group"
          aria-label="Billing period"
          className="bg-[#EFEFEF] p-1 rounded-full flex items-center shadow-inner border border-gray-200/70"
        >
          {BILLING_PERIODS.map((p) => {
            const isActive = activePeriod === p.id;
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActivePeriod(p.id)}
                className={`relative px-3.5 min-[380px]:px-4 sm:px-6 py-2 sm:py-1.5 rounded-full text-xs sm:text-[13px] whitespace-nowrap font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "text-[#0A2540] font-bold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeBillingBadge"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    className="absolute inset-0 bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] rounded-full shadow-[0_2px_12px_rgba(72,162,255,0.4)]"
                  />
                )}
                <span className="relative z-10">{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Plan Cards */}
      <div className="relative z-10 w-full max-w-[520px] lg:max-w-[1140px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">
        {PLANS.map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            period={period}
            eventPromise={eventPromise}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
