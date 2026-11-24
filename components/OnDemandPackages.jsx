"use client";

import React, { Suspense, use } from "react";
import Link from "next/link";
import { House, MonitorPlay, Smartphone } from "lucide-react";
import { Plus_Jakarta_Sans, Playfair_Display } from "@/app/lib/fonts";
import { ON_DEMAND_PACKAGES, withPricingDefaults } from "@/app/lib/pricingPlans";

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
const ICONS = { short: Smartphone, realEstate: House, youtube: MonitorPlay };

// "$1,000" (fixed locale so server and browser render the same text)
const formatPrice = (n) => `$${n.toLocaleString("en-US")}`;

// Middle column = dark featured cards (like the reference); the first one gets the pill
const FEATURED = new Set(["realEstate5", "realEstate10"]);
const POPULAR = "realEstate5";

const PRICE_TEXT = "text-[32px] sm:text-[34px] leading-none font-semibold tracking-tight";

// Same box as the real price, so nothing moves when it arrives
const PriceSkeleton = ({ dark }) => (
  <span role="status" className="inline-flex">
    <span className="sr-only">Loading price</span>
    <span
      aria-hidden="true"
      className={`price-shimmer ${dark ? "price-shimmer-dark" : ""} inline-block rounded-md text-transparent select-none ${PRICE_TEXT}`}
    >
      $0000
    </span>
  </span>
);

// Price from the live event (admin → Events → Pricing), defaults otherwise.
// `eventPromise` never rejects (getActiveEvent returns null on failure).
function PackagePrice({ eventPromise, id, dark }) {
  const event = eventPromise ? use(eventPromise) : null;
  const price = withPricingDefaults(event?.prices).packages[id];
  return <span className={`${PRICE_TEXT} ${dark ? "text-white" : "text-gray-950"}`}>{formatPrice(price)}</span>;
}

export default function OnDemandPackages({ eventPromise = null }) {
  return (
    <section id="packages" className={`${jakarta.className} scroll-mt-16 relative bg-[#FAFAFA] text-black py-14 sm:py-20 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-950 leading-[1.15]">
            Editing <span className={`${playfair.className} italic font-normal`}>Packages</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            Purchase a pre-paid package to start submitting projects
          </p>
        </div>

        <ul className="grid grid-cols-1 min-[520px]:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {ON_DEMAND_PACKAGES.map(({ id, title, description, kind }) => {
            const Icon = ICONS[kind];
            const dark = FEATURED.has(id);
            return (
              <li
                key={id}
                className={`relative flex flex-col rounded-2xl border p-4 sm:p-5 ${
                  dark
                    ? "bg-[#1C1C1E] border-[#1C1C1E] text-white shadow-[0_16px_36px_-16px_rgba(0,0,0,0.55)]"
                    : "bg-white border-gray-200 text-gray-950 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="flex items-center gap-1.5 text-[15px] font-semibold tracking-tight">
                    <Icon
                      className="w-4 h-4 shrink-0 text-gray-400"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    {title}
                  </h3>
                  {id === POPULAR && (
                    <span className="shrink-0 rounded-full bg-[#CEFF00] px-2 py-0.5 text-[10px] font-bold tracking-[0.06em] text-black">
                      POPULAR
                    </span>
                  )}
                </div>
                <p className={`mt-0.5 text-[13px] ${dark ? "text-gray-400" : "text-gray-500"}`}>{description}</p>

                <div className="mt-10 sm:mt-12 flex items-baseline gap-1.5 min-h-[34px]">
                  <Suspense fallback={<PriceSkeleton dark={dark} />}>
                    <PackagePrice eventPromise={eventPromise} id={id} dark={dark} />
                  </Suspense>
                  <span className={`text-[13px] ${dark ? "text-gray-400" : "text-gray-500"}`}>one-time</span>
                </div>

                <Link
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-3 flex items-center justify-center h-10 rounded-[10px] text-sm font-semibold transition-colors active:scale-[0.98] ${
                    dark
                      ? "bg-[#CEFF00] text-black hover:bg-[#BFEF00]"
                      : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Get started
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
