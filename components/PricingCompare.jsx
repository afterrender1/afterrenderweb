"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { Plus_Jakarta_Sans } from "@/app/lib/fonts";
import { PLANS } from "./PricingHero";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const CALENDLY_URL = "https://calendly.com/afterrenderagency/new-meeting";
const PLAN_IDS = PLANS.map((plan) => plan.id);
const ALL = ["basic", "plus", "ultra"];

// Same colors as the plan cards: Basic peach, Plus indigo, Ultra sky
const PLAN_STYLES = {
  basic: {
    bar: "bg-[#F0AE8D]",
    check: "text-[#D9784C]",
    tab: "border-[#E0875D] text-gray-950",
  },
  plus: {
    bar: "bg-[#5F6FD3]",
    check: "text-[#5F6FD3]",
    tab: "border-[#5F6FD3] text-gray-950",
  },
  ultra: {
    bar: "bg-sky-400",
    check: "text-sky-600",
    tab: "border-sky-500 text-gray-950",
  },
};

// Text rows: one value per plan, in PLAN_IDS order
const TEXT_ROWS = [
  {
    label: "Editing requests",
    values: Array(3).fill({ text: "Unlimited requests & revisions", note: "One at a time, nonstop workflow" }),
  },
  {
    label: "Types of content",
    values: [
      { text: "All kinds of content", note: "Except weddings" },
      { text: "All kinds of content", note: "Including weddings" },
      { text: "All kinds of content", note: "Including weddings" },
    ],
  },
  { label: "Duration of final edits", values: Array(3).fill({ text: "No limits" }) },
  { label: "Brands or businesses", values: Array(3).fill({ text: "Unlimited" }) },
  { label: "Revisions", values: Array(3).fill({ text: "Unlimited" }) },
];

// Check rows: which plans include the feature
const CHECK_ROWS = [
  { label: "Color grading", plans: ALL },
  { label: "Thumbnails / covers", plans: ALL },
  { label: "Captions", plans: ALL },
  { label: "Stock footage and music", plans: ALL },
  { label: "Same editor for all your projects", plans: ALL },
  { label: "Post-production manager", plans: ALL },
  { label: "Animations", note: "Motion graphics", plans: ALL },
  { label: "Speed ramps", plans: ALL },
  { label: "Photography editing", note: "Lightroom", plans: ALL },
  { label: "Graphic design", note: "Adobe Illustrator or Canva", plans: ALL },
  { label: "Video edits for weddings", plans: ["plus", "ultra"] },
  { label: "Same day deliveries", plans: ["ultra"] },
  { label: "Weekly calls with the team", note: "Upon request", plans: ["ultra"] },
  { label: "Software integration", note: "Beta", plans: ["ultra"] },
];

// Plan cells: all three columns on desktop; on phones only the plan picked above the table.
// The Plus column carries a faint indigo tint, like its card.
const planCell = (id, active, pad = "py-2.5") =>
  `${id === active ? "table-cell" : "hidden"} md:table-cell align-top px-3 lg:px-5 ${pad} ${
    id === "plus" ? "md:bg-[#5F6FD3]/[0.04]" : ""
  }`;

const LABEL_CELL = "align-top pl-4 sm:pl-6 pr-3 py-2.5 text-left text-[13px] font-medium text-gray-700";

const SectionRow = ({ title, text }) => (
  <tr className="border-y border-[#5F6FD3]/10 bg-gradient-to-r from-[#EEF1FF] via-[#F5F7FF] to-[#EFF8FF]">
    <th colSpan={4} scope="colgroup" className="pl-4 sm:pl-6 pr-4 py-2.5 text-left">
      <span className="text-[13px] font-bold text-[#0A2540]">{title}</span>
      {text && <span className="block sm:inline sm:ml-2 text-[12px] font-normal text-gray-500">{text}</span>}
    </th>
  </tr>
);

const DeliveryList = ({ rows }) => (
  <ul className="space-y-1.5">
    {rows.map(({ label, time, batch, badge }) => (
      <li key={label} className="text-[12.5px] leading-snug">
        <span className="text-gray-600">{label}: </span>
        <span
          className={`inline-flex items-baseline gap-0.5 font-semibold ${badge === "fast" ? "text-sky-700" : "text-gray-950"}`}
        >
          {badge === "fast" && <Zap className="self-center w-3 h-3" fill="currentColor" strokeWidth={0} aria-hidden="true" />}
          {time}
        </span>
        {batch && <span className="text-gray-400"> · {batch}</span>}
      </li>
    ))}
  </ul>
);

export default function PricingCompare() {
  const [active, setActive] = useState("plus");

  return (
    <section
      id="compare-plans"
      className={`${jakarta.className} bg-[#FAFAFA] text-black py-14 sm:py-20 px-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-[1140px] mx-auto">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-[34px] font-extrabold text-gray-950 tracking-tight">
            Compare{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF]">plans</span>
          </h2>
          <p className="mt-2 text-[13.5px] sm:text-[14.5px] text-gray-500">
            Delivery times and features for Basic, Plus and Ultra.
          </p>
        </div>

        {/* Phones: one plan at a time */}
        <div role="tablist" aria-label="Choose a plan" className="md:hidden mt-6 flex border-b border-gray-200">
          {PLANS.map(({ id, name }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active === id}
              onClick={() => setActive(id)}
              className={`flex-1 -mb-px pb-2.5 text-[14px] border-b-2 transition-colors cursor-pointer ${
                active === id ? `${PLAN_STYLES[id].tab} font-semibold` : "border-transparent text-gray-500"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="mt-4 md:mt-8 overflow-hidden rounded-[20px] border border-gray-200/80 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_14px_36px_-14px_rgba(16,24,40,0.14)]">
          <table className="w-full border-collapse">
            <caption className="sr-only">AfterRender plan comparison: delivery times and features</caption>
            <colgroup>
              <col className="w-[46%] md:w-[30%]" />
              {PLAN_IDS.map((id) => (
                <col key={id} />
              ))}
            </colgroup>

            <thead>
              <tr>
                <th scope="col" className="pl-4 sm:pl-6 pr-3 py-4 text-left align-bottom">
                  <span className="sr-only">Feature</span>
                </th>
                {PLANS.map(({ id, name, featured }) => (
                  <th key={id} scope="col" className={`${planCell(id, active, "py-4")} relative text-left align-bottom`}>
                    {/* Plan color strip along the top, like the tinted top of each card */}
                    <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 ${PLAN_STYLES[id].bar}`} />
                    <span className="flex items-center gap-2">
                      <span className="text-[17px] font-bold text-gray-950 tracking-tight">{name}</span>
                      {featured && (
                        <span className="rounded-full bg-[#5F6FD3]/10 px-2 py-0.5 text-[10.5px] font-semibold text-[#4D5EC4]">
                          Most popular
                        </span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <SectionRow
                title="Estimated delivery times*"
                text="Your team works on one delivery at a time. Once it’s completed, we move to the next."
              />
              {[
                { label: "Standard edits", key: "standard" },
                { label: "Complex / Animated / After Effects", key: "complex" },
              ].map(({ label, key }, i) => (
                <tr key={key} className={i ? "border-t border-gray-100" : ""}>
                  <th scope="row" className={`${LABEL_CELL} !py-3`}>
                    {label}
                  </th>
                  {PLANS.map((plan) => (
                    <td key={plan.id} className={planCell(plan.id, active, "py-3")}>
                      <DeliveryList rows={plan[key]} />
                    </td>
                  ))}
                </tr>
              ))}

              <SectionRow title="Features" />
              {TEXT_ROWS.map(({ label, values }, i) => (
                <tr key={label} className={i ? "border-t border-gray-100" : ""}>
                  <th scope="row" className={LABEL_CELL}>
                    {label}
                  </th>
                  {PLAN_IDS.map((id, j) => (
                    <td key={id} className={`${planCell(id, active)} text-[13px] leading-snug`}>
                      <span className="font-semibold text-gray-950">{values[j].text}</span>
                      {values[j].note && <span className="block text-[12px] text-gray-500">{values[j].note}</span>}
                    </td>
                  ))}
                </tr>
              ))}
              {CHECK_ROWS.map(({ label, note, plans }) => (
                <tr key={label} className="border-t border-gray-100">
                  <th scope="row" className={LABEL_CELL}>
                    {label}
                    {note && <span className="font-normal text-gray-400"> ({note})</span>}
                  </th>
                  {PLAN_IDS.map((id) => (
                    <td key={id} className={planCell(id, active)}>
                      {plans.includes(id) ? (
                        <>
                          <Check className={`h-[18px] w-[18px] md:h-5 md:w-5 lg:h-[22px] lg:w-[22px] ${PLAN_STYLES[id].check}`} strokeWidth={2.75} aria-hidden="true" />
                          <span className="sr-only">Included</span>
                        </>
                      ) : (
                        <>
                          <span aria-hidden="true" className="text-[14px] leading-none text-gray-300">—</span>
                          <span className="sr-only">Not included</span>
                        </>
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              <tr className="border-t border-gray-200/80">
                <td className="pl-4 sm:pl-6 pr-3 py-4" />
                {PLANS.map(({ id, name, featured }, index) => (
                  <td key={id} className={planCell(id, active, "py-4")}>
                    {/* Same look as the plan cards' "Get started": Plus solid indigo, others white, with the shine sweep */}
                    <Link
                      href={CALENDLY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`relative overflow-hidden isolate flex items-center justify-center w-full max-w-[200px] h-10 rounded-[10px] text-[13px] font-semibold transition-all duration-200 active:scale-[0.98] ${
                        featured
                          ? "bg-[#5F6FD3] text-white hover:bg-[#5262C9] shadow-[0_1px_2px_rgba(16,24,40,0.1),0_6px_16px_-6px_rgba(95,111,211,0.6)]"
                          : "bg-white text-gray-900 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-[0_1px_2px_rgba(16,24,40,0.06),0_2px_6px_rgba(16,24,40,0.04)]"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`btn-shine ${featured ? "btn-shine-light" : "btn-shine-tint"}`}
                        style={{ animationDelay: `${index * 0.35}s` }}
                      />
                      <span className="relative">Get {name}</span>
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
