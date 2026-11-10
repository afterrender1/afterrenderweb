"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader, Section } from "./shared";

// Plan + payment history. Both are filled from Stripe once it's connected;
// until then every account has no plan and no payments.
export default function BillingTab({ purchases = [] }) {
    return (
        <>
            <PageHeader title="Plan &" accent="billing." description="Your subscription and payment history." />
            <div className="space-y-8">
                <section
                    data-reveal
                    className="relative overflow-hidden rounded-2xl border border-[#48A2FF]/25 bg-linear-to-br from-[#eaf4ff] via-white to-white p-6 shadow-2xs sm:p-7"
                >
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Current plan</p>
                    <p className="mt-2 text-2xl font-extrabold tracking-tight text-gray-950">No active plan</p>
                    <p className="mt-1.5 max-w-md text-sm leading-relaxed text-gray-600">
                        Unlimited creatives with one subscription. Pick the plan that fits your content volume.
                    </p>
                    <Link
                        href="/pricing"
                        className="group mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] px-5 text-[13px] font-bold text-[#0A2540] shadow-[0_2px_10px_rgba(72,162,255,0.35)] transition-all duration-200 hover:brightness-105 hover:shadow-[0_4px_16px_rgba(72,162,255,0.45)]"
                    >
                        View plans
                        <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                </section>

                <Section title="Payment history">
                    {purchases.length === 0 && (
                        <div className="px-5 py-10 text-center sm:px-6">
                            <p className="text-sm font-semibold text-gray-900">No payments yet</p>
                            <p className="mt-1 text-[13px] text-gray-500">Invoices show up here after your first purchase.</p>
                        </div>
                    )}
                </Section>
            </div>
        </>
    );
}
