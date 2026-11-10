"use client";

import React, { useId } from "react";
import Link from "next/link";
import { ArrowRight, ReceiptText } from "lucide-react";

// Plan + payment history. Both are filled from Stripe once it's connected;
// until then every account has no plan and no payments.
export default function BillingTab({ purchases = [] }) {
    const headingId = useId();

    return (
        <>
            <header data-reveal className="mb-7 sm:mb-8">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-950 sm:text-[28px]">Plan &amp; billing</h1>
                <p className="mt-2 text-sm leading-6 text-gray-500">Your subscription and payment history.</p>
            </header>
            <div className="space-y-6">
                <section
                    data-reveal
                    aria-labelledby={`${headingId}-plan`}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                >
                    <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
                        <h2 id={`${headingId}-plan`} className="text-[15px] font-semibold text-gray-950">Current plan</h2>
                    </div>
                    <div className="flex flex-col gap-5 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6">
                        <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-semibold tracking-tight text-gray-950">No active plan</h3>
                            <p className="mt-1.5 max-w-sm text-[13px] leading-6 text-gray-500">
                                Unlimited creatives with one subscription. Pick the plan that fits your content volume.
                            </p>
                        </div>
                        <Link
                            href="/pricing"
                            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 self-start rounded-md border border-gray-950 bg-gray-950 px-3 text-xs font-medium text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 sm:self-center"
                        >
                            View plans
                            <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                    </div>
                </section>

                <section
                    data-reveal
                    aria-labelledby={`${headingId}-payments`}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                >
                    <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
                        <h2 id={`${headingId}-payments`} className="text-[15px] font-semibold text-gray-950">Payment history</h2>
                    </div>
                    {purchases.length === 0 && (
                        <div className="flex flex-col items-center px-5 py-10 text-center sm:px-6">
                            <span aria-hidden="true" className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-500">
                                <ReceiptText size={19} strokeWidth={1.75} />
                            </span>
                            <h3 className="text-sm font-medium text-gray-950">No payments yet</h3>
                            <p className="mt-1 text-[13px] leading-5 text-gray-500">Invoices show up here after your first purchase.</p>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
