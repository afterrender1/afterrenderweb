"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, KeyRound } from "lucide-react";
import { GoogleIcon } from "@/components/auth/ui";
import { Badge, InfoRow, Panel, formatDate } from "./shared";

const MethodChip = ({ providerId }) =>
    providerId === "google" ? (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-2.5 py-1 text-xs font-semibold text-[#0A2540]">
            <GoogleIcon size={13} /> Google
        </span>
    ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-2.5 py-1 text-xs font-semibold text-[#0A2540]">
            <KeyRound size={13} /> Email &amp; password
        </span>
    );

export default function OverviewTab({ user, accounts, accountsError, onGoTo }) {
    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <Panel
                    title="Account details"
                    description="Your personal information on AfterRender."
                    action={
                        <button
                            type="button"
                            onClick={() => onGoTo("edit")}
                            className="text-sm font-semibold text-[#48A2FF] hover:underline cursor-pointer"
                        >
                            Edit
                        </button>
                    }
                >
                    <dl>
                        <InfoRow label="Full name">{user.name}</InfoRow>
                        <InfoRow label="Email">
                            <span className="inline-flex flex-wrap items-center gap-2">
                                <span className="break-all">{user.email}</span>
                                {user.emailVerified ? (
                                    <Badge tone="success">Verified</Badge>
                                ) : (
                                    <Badge tone="warning">Not verified</Badge>
                                )}
                            </span>
                        </InfoRow>
                        <InfoRow label="Sign-in methods">
                            {accounts === null ? (
                                <span className="text-sm text-[#8898aa]">Loading…</span>
                            ) : accountsError ? (
                                <span className="text-sm text-red-600">{accountsError}</span>
                            ) : (
                                <span className="flex flex-wrap gap-2">
                                    {accounts.map((a) => (
                                        <MethodChip key={a.id} providerId={a.providerId} />
                                    ))}
                                </span>
                            )}
                        </InfoRow>
                        <InfoRow label="Member since">{formatDate(user.createdAt)}</InfoRow>
                        <InfoRow label="Last updated">{formatDate(user.updatedAt)}</InfoRow>
                    </dl>
                </Panel>
            </div>

            <div className="space-y-6">
                <Panel title="Your plan">
                    <p className="text-sm text-[#425466] leading-relaxed">
                        You don&apos;t have an active plan yet. Pick a plan to get unlimited creatives with one subscription.
                    </p>
                    <Link
                        href="/pricing"
                        className="mt-5 w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl font-bold text-sm text-[#0A2540] bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] shadow-md hover:brightness-105"
                    >
                        View pricing <ArrowRight size={16} />
                    </Link>
                    <button
                        type="button"
                        onClick={() => onGoTo("purchases")}
                        className="mt-3 w-full text-sm font-semibold text-[#425466] hover:text-[#0A2540] cursor-pointer"
                    >
                        View purchase history
                    </button>
                </Panel>
                <Panel title="Security">
                    <p className="text-sm text-[#425466] leading-relaxed">
                        Manage your password, connected accounts and the devices you&apos;re logged in on.
                    </p>
                    <button
                        type="button"
                        onClick={() => onGoTo("security")}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#48A2FF] hover:underline cursor-pointer"
                    >
                        Security settings <ArrowRight size={15} />
                    </button>
                </Panel>
            </div>
        </div>
    );
}
