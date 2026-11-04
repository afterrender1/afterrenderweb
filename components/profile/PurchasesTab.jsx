"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Receipt } from "lucide-react";
import { Panel } from "./shared";

// Purchase history. Stripe payments will be listed here (plan, amount, status, date, invoice)
// once Stripe is connected; until then every account starts empty.
export default function PurchasesTab({ purchases = [] }) {
    return (
        <div className="space-y-6">
            <Panel title="Current plan" description="Your active AfterRender subscription.">
                <div className="rounded-xl border border-dashed border-black/10 bg-[#f6f9fc] p-5 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-[#0A2540]">No active plan</p>
                        <p className="mt-0.5 text-sm text-[#425466]">Choose a plan to get started with AfterRender.</p>
                    </div>
                    <Link
                        href="/pricing"
                        className="inline-flex items-center gap-2 h-10 px-5 rounded-xl font-bold text-sm text-[#0A2540] bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] shadow-md hover:brightness-105"
                    >
                        View plans <ArrowRight size={16} />
                    </Link>
                </div>
            </Panel>

            <Panel title="Purchase history" description="Every payment you make, with date and status.">
                {purchases.length === 0 ? (
                    <div className="flex flex-col items-center text-center py-10">
                        <span className="w-14 h-14 rounded-full bg-[#48A2FF]/10 text-[#48A2FF] flex items-center justify-center">
                            <Receipt size={24} />
                        </span>
                        <p className="mt-4 text-sm font-semibold text-[#0A2540]">No purchases yet</p>
                        <p className="mt-1 text-sm text-[#425466] max-w-sm">
                            When you buy a plan, your payments and invoices will show up here.
                        </p>
                    </div>
                ) : null}
            </Panel>
        </div>
    );
}
