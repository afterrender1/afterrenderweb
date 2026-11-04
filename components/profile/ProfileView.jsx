"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { LogOut, Pencil, Receipt, ShieldCheck, UserRound } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { Avatar } from "@/components/auth/ui";
import { Badge } from "./shared";
import OverviewTab from "./OverviewTab";
import EditProfileTab from "./EditProfileTab";
import SecurityTab from "./SecurityTab";
import PurchasesTab from "./PurchasesTab";

const fetchAccounts = async () => {
    const { data, error } = await authClient.listAccounts();
    if (error) throw error;
    return Array.isArray(data) ? data : [];
};

const PROFILE_TABS = [
    { id: "overview", label: "Overview", icon: UserRound },
    { id: "edit", label: "Edit profile", icon: Pencil },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "purchases", label: "Purchases", icon: Receipt },
];

export default function ProfileView({ initialUser, initialSessionId, initialTab = "overview", linkError = "", googleEnabled = false }) {
    const { data: sessionData, isPending, error: sessionError } = authClient.useSession();
    const router = useRouter();
    const [tab, setTab] = useState(initialTab);
    const [signingOut, setSigningOut] = useState(false);

    // Live session data (updates right after name / photo changes), server data until it loads.
    const user = sessionData?.user ?? initialUser;
    const currentSessionId = sessionData?.session?.id ?? initialSessionId;

    // Signed out in another tab, or the session was revoked -> back to login.
    useEffect(() => {
        if (!isPending && !sessionError && sessionData === null && !signingOut) {
            router.replace("/login?next=%2Fprofile");
            router.refresh();
        }
    }, [isPending, sessionError, sessionData, signingOut, router]);

    // Drop ?error= from the address bar once it has been shown.
    useEffect(() => {
        if (linkError) window.history.replaceState(null, "", "/profile?tab=security");
    }, [linkError]);

    // Sign-in methods (email/password, Google). undefined while loading.
    const {
        data: accountsData,
        error: accountsFetchError,
        mutate: refreshAccounts,
    } = useSWR("auth:accounts", fetchAccounts, { revalidateOnFocus: false });
    const accounts = accountsFetchError ? [] : (accountsData ?? null); // null = loading
    const accountsError = accountsFetchError ? "Couldn't load your sign-in methods." : "";
    const loadAccounts = useCallback(() => refreshAccounts(), [refreshAccounts]);

    const selectTab = (id) => {
        setTab(id);
        const url = id === "overview" ? "/profile" : `/profile?tab=${id}`;
        window.history.replaceState(null, "", url);
    };

    const handleSignOut = async () => {
        setSigningOut(true);
        await authClient.signOut().catch(() => {});
        router.replace("/");
        router.refresh();
    };

    const hasPassword = Boolean(accounts?.some((a) => a.providerId === "credential"));
    const hasGoogle = Boolean(accounts?.some((a) => a.providerId === "google"));

    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* Header */}
            <div className="bg-white border border-black/[0.06] rounded-2xl shadow-[0_4px_24px_rgba(10,37,64,0.05)] p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-5">
                <Avatar src={user.image} name={user.name} email={user.email} size={76} />
                <div className="min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#0A2540] break-words">{user.name}</h1>
                    <p className="mt-0.5 text-sm text-[#425466] break-all">{user.email}</p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                        {user.emailVerified ? <Badge tone="success">Verified email</Badge> : <Badge tone="warning">Email not verified</Badge>}
                        <Badge tone="neutral">No active plan</Badge>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="self-start sm:self-center inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-black/10 bg-white text-sm font-semibold text-[#0A2540] hover:bg-[#f6f9fc] transition-colors cursor-pointer disabled:opacity-60"
                >
                    <LogOut size={16} />
                    {signingOut ? "Signing out…" : "Sign out"}
                </button>
            </div>

            {/* Tabs */}
            <div
                role="tablist"
                aria-label="Profile sections"
                className="mt-6 flex gap-1 overflow-x-auto rounded-2xl bg-white border border-black/[0.06] p-1.5 [scrollbar-width:none]"
            >
                {PROFILE_TABS.map(({ id, label, icon: Icon }) => {
                    const active = tab === id;
                    return (
                        <button
                            key={id}
                            type="button"
                            role="tab"
                            id={`tab-${id}`}
                            aria-selected={active}
                            aria-controls={`panel-${id}`}
                            onClick={() => selectTab(id)}
                            className={`flex-1 min-w-max inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                                active
                                    ? "bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] text-[#0A2540] shadow-sm"
                                    : "text-[#425466] hover:text-[#0A2540] hover:bg-[#f6f9fc]"
                            }`}
                        >
                            <Icon size={16} />
                            {label}
                        </button>
                    );
                })}
            </div>

            <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="mt-6">
                {tab === "overview" && (
                    <OverviewTab
                        user={user}
                        accounts={accounts}
                        accountsError={accountsError}
                        onGoTo={selectTab}
                    />
                )}
                {tab === "edit" && <EditProfileTab user={user} />}
                {tab === "security" && (
                    <SecurityTab
                        user={user}
                        currentSessionId={currentSessionId}
                        accounts={accounts}
                        hasPassword={hasPassword}
                        hasGoogle={hasGoogle}
                        googleEnabled={googleEnabled}
                        linkError={linkError}
                        onAccountsChange={loadAccounts}
                    />
                )}
                {tab === "purchases" && <PurchasesTab />}
            </div>
        </div>
    );
}
