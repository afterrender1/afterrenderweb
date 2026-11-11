import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Plus_Jakarta_Sans, Playfair_Display } from "@/app/lib/fonts";
import SatinCrescentBloom from "@/components/ui/satin-crescent-bloom";

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

const features = [
  "10 AI avatar videos every month",
  "Your custom AI avatar and voice",
  "Unlimited revisions",
  "Upgrade or downgrade anytime",
  "Dedicated project manager",
  "Pause or cancel anytime",
  "Unlimited brands",
  "No long-term contract",
  "Unlimited user seats",
  "Monday to Friday production",
];

const FeatureCheck = () => (
  <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M7.5 12.1 10.5 15.1 16.5 8.9" stroke="#1762A0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function AiAvatarsMembership() {
  return (
    <section
      id="plans"
      aria-labelledby="ai-membership-heading"
      className={`${jakarta.className} scroll-mt-24 bg-[#FAFAFA] px-4 pb-16 pt-4 text-black sm:px-6 sm:pb-24 lg:px-8`}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500 sm:text-xs">
            <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-[#48A2FF]" />
            <span>Membership</span>
          </div>
          <div aria-hidden="true" className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="mb-8 max-w-2xl sm:mb-10">
          <h2 id="ai-membership-heading" className="text-3xl font-extrabold leading-[1.15] tracking-tight text-gray-950 sm:text-4xl md:text-5xl">
            Your AI Avatar.{" "}
            <span className={`${playfair.className} block font-normal italic text-gray-900 sm:inline`}>
              One Simple Plan.
            </span>
          </h2>
          <p className="mt-3 max-w-xl text-[13px] font-medium leading-relaxed text-gray-500 sm:text-sm">
            Your face, your voice, without the filming. Get 10 AI avatar videos every month,
            ready to share. No setup fees.
          </p>
        </div>

        <div className="relative grid rounded-[28px] border border-gray-200 bg-white p-2 shadow-[0_12px_48px_-24px_rgba(10,37,64,0.2)] lg:grid-cols-[0.85fr_1.15fr]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/ai-avatars-images/50-off.webp"
            alt="50% off"
            width={1536}
            height={1024}
            draggable={false}
            className="pointer-events-none absolute -left-5 -top-9 z-20 h-auto w-32 select-none drop-shadow-lg sm:-left-8 sm:-top-12 sm:w-44"
          />
          <div className="relative isolate overflow-hidden rounded-[21px] bg-[#07111F] text-white">
            <div className="pointer-events-none absolute inset-0 -z-20">
              <SatinCrescentBloom />
            </div>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-[#07111F]/70 via-[#07111F]/80 to-[#07111F]/60" />

            <div className="flex h-full flex-col p-6 sm:p-8 xl:p-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] font-semibold tracking-[0.04em] text-blue-100/80">AfterRender</span>
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-medium text-blue-50">
                  Monthly membership
                </span>
              </div>

              <div className="mt-8 sm:mt-10">
                <h3 className="text-[28px] font-semibold tracking-tight sm:text-[32px]">AI CREATOR</h3>
                <p className="mt-2 max-w-xs text-[13px] leading-6 text-slate-300">
                  Your own AI avatar. A month of content.
                  More time for your business.
                </p>
              </div>

              <div className="my-7 sm:my-8">
                <p className="mb-2 text-xl font-semibold text-slate-300 sm:text-2xl">
                  <span className="sr-only">Regular price </span>
                  <del className="decoration-[#FF3B3B] decoration-[3px] [text-decoration-skip-ink:none]">$999</del>
                </p>
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <span className="text-[56px] font-semibold leading-none tracking-[-0.05em] sm:text-[64px]">$499</span>
                  <span className="text-[13px] font-medium text-slate-300">USD / month</span>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/15 pt-4 text-[13px]">
                  <span className="font-medium text-white">10 videos every month</span>
                  <span aria-hidden="true" className="h-1 w-1 rounded-full bg-slate-500" />
                  <span className="text-slate-300">No setup fees</span>
                </div>
              </div>

              <div className="mt-auto">
                <Link
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Subscribe to AI Lab"
                  className="group inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0A2540] transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48A2FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111F]"
                >
                  Subscribe
                  <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
                </Link>
                <p className="mt-3 text-center text-[11px] leading-5 text-slate-300">Pause or cancel anytime.</p>
              </div>
            </div>
          </div>

          <div className="px-4 py-7 sm:p-8 xl:p-10">
            <h4 className="text-xl font-semibold tracking-tight text-gray-950 sm:text-[22px]">Everything for your next video.</h4>
            <p className="mt-2 max-w-sm text-[13px] leading-6 text-gray-500">
              From your custom avatar to the final edit, our team takes care of the production.
            </p>

            <ul className="mt-7 space-y-4 border-b border-gray-100 pb-7">
              {features.slice(0, 2).map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm font-medium leading-6 text-gray-900">
                  <FeatureCheck />
                  {feature}
                </li>
              ))}
            </ul>

            <p className="mb-4 mt-6 text-xs font-medium text-gray-500">Also included in your membership</p>
            <ul className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
              {features.slice(2).map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-[13px] leading-[22px] text-gray-600">
                  <FeatureCheck />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
