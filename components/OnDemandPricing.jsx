import React from "react";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { Plus_Jakarta_Sans, Playfair_Display } from "@/app/lib/fonts";

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

// Placeholder for /pricing/on-demand until the real On Demand plans are added.
// Self-contained (no data, no client JS), so it can be replaced or extended freely.
export default function OnDemandPricing() {
  return (
    <section
      className={`${jakarta.className} relative min-h-[80vh] bg-[#FAFAFA] text-black pt-32 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden flex items-center`}
    >
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
          On demand pricing is coming soon. Need a one-off edit right now? Book a quick call and
          we&apos;ll quote your project.
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
