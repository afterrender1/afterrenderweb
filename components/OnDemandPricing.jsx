import React from "react";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { Plus_Jakarta_Sans, Playfair_Display } from "@/app/lib/fonts";
import OnDemandTicker from "./OnDemandTicker";

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

// Hero for /pricing/on-demand (On Demand plans can be added below it later).
// Background videos come from OnDemandTicker.
export default function OnDemandPricing() {
  return (
    <section
      className={`${jakarta.className} relative isolate min-h-[680px] sm:min-h-[780px] bg-[#FAFAFA] text-black pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden flex items-center`}
    >
      {/* Background: long + short form videos drifting in two arcs. Starts below the fixed
          navbar (~60px phones, ~80px sm+) and fades out at its top and bottom edges, so cards
          never slide behind the navbar or get cut off where the hero ends. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[72px] sm:top-[84px] bottom-0 -z-20"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0, black 56px, black calc(100% - 140px), transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0, black 56px, black calc(100% - 140px), transparent 100%)",
        }}
      >
        <OnDemandTicker />
      </div>
      {/* Soft light behind the text so it stays readable over the videos (wider on phones,
          where the text spans the full width) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 sm:hidden"
        style={{
          background:
            "radial-gradient(ellipse 95% 34% at 50% 50%, rgba(250,250,250,0.97) 0%, rgba(250,250,250,0.88) 55%, rgba(250,250,250,0) 85%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 hidden sm:block"
        style={{
          background:
            "radial-gradient(ellipse 60% 42% at 50% 52%, rgba(250,250,250,0.96) 0%, rgba(250,250,250,0.82) 45%, rgba(250,250,250,0) 78%)",
        }}
      />

      <div className="relative w-full max-w-2xl mx-auto text-center">
        <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-700 shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
          <Zap className="w-3.5 h-3.5 text-[#1a73e8]" strokeWidth={2.4} aria-hidden="true" />
          AfterRender On Demand
        </span>

        <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-950 leading-[1.15]">
          Pay Per Project.{" "}
          <span className={`${playfair.className} italic font-normal`}>No Subscription.</span>
        </h1>

        <p className="mt-4 mx-auto max-w-xl text-sm sm:text-base leading-relaxed text-gray-600">
          Get high quality video edited without the commitment of a monthly subscription.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <Link
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] text-[#0A2540] text-sm font-bold shadow-[0_8px_22px_-8px_rgba(72,162,255,0.7)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
          >
            Book a Call
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-white border border-gray-200 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 hover:border-gray-300"
          >
            See Subscription Plans
          </Link>
        </div>
      </div>
    </section>
  );
}
