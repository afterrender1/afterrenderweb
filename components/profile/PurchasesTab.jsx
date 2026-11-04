"use client";

import React from "react";
import Link from "next/link";
import { Receipt } from "lucide-react";
import { Badge, PageHeader, Row, Section } from "./shared";

// Billing: current plan + payment history. Filled from Stripe once it's connected.
export default function PurchasesTab({ purchases = [] }) {
    return (
        <>
            <PageHeader title="Billing" description="Your plan and payment history." />
            <div className="space-y-6">
                <Section title="Plan">
                    <Row
                        label="Current plan"
                        action={
                            <Link
                                href="/pricing"
                                className="inline-flex h-9 items-center rounded-md bg-zinc-900 px-3.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
                            >
                                View plans
                            </Link>
                        }
                    >
                        <Badge>No active plan</Badge>
                    </Row>
                </Section>

                <Section title="Payment history">
                    {purchases.length === 0 && (
                        <div className="flex flex-col items-center px-6 py-12 text-center">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
                                <Receipt size={18} />
                            </span>
                            <p className="mt-3 text-sm font-medium text-zinc-900">No payments yet</p>
                            <p className="mt-1 max-w-xs text-sm text-zinc-500">Your payments and invoices will appear here after you buy a plan.</p>
                        </div>
                    )}
                </Section>
            </div>
        </>
    );
}
