"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { CreditCard, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { Avatar } from "@/components/auth/ui";
import { useConfirm } from "./shared";
import ProfileTab from "./ProfileTab";
import SecurityTab from "./SecurityTab";
import PurchasesTab from "./PurchasesTab";

const fetchAccounts = async () => {
    const { data, error } = await authClient.listAccounts();
    if (error) throw error;
    return Array.isArray(data) ? data : [];
};

const NAV = [
    { id: "profile", label: "Profile", icon: UserRound },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "billing", label: "Billing", icon: CreditCard },
];

export default function ProfileView({ initialUser, initialSessionId, initialTab = "profile", linkError = "", googleEnabled = false }) {
    const router = useRouter();
    const { data: sessionData, isPending, error: sessionError } = authClient.useSession();
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

    const { data: accountsData, error: accountsError, mutate: refreshAccounts } = useSWR("auth:accounts", fetchAccounts, {
        revalidateOnFocus: false,
    });
    const accounts = accountsError ? [] : (accountsData ?? null); // null = loading
    const onAccountsChange = useCallback(() => refreshAccounts(), [refreshAccounts]);
    const hasPassword = Boolean(accounts?.some((a) => a.providerId === "credential"));
    const hasGoogle = Boolean(accounts?.some((a) => a.providerId === "google"));

    const selectTab = (id) => {
        setTab(id);
        window.history.replaceState(null, "", id === "profile" ? "/profile" : `/profile?tab=${id}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const { ask, dialog } = useConfirm();

    const handleSignOut = () =>
        ask({
            title: "Sign out?",
            description: "You'll need to log in again to access your account.",
            confirmLabel: "Sign out",
            action: async () => {
                setSigningOut(true);
                const { error } = await authClient.signOut().catch((err) => ({ error: err }));
                if (error) {
                    setSigningOut(false);
                    return "Couldn't sign you out. Please try again.";
                }
                router.replace("/");
                router.refresh();
            },
        });

    return (
        <div className="mx-auto w-full max-w-6xl lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
            {dialog}
            {/* Sidebar (desktop) / top bar (mobile) */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
                <div className="flex items-center gap-3 px-1 lg:px-2">
                    <Avatar src={user.image} name={user.name} email={user.email} size={40} />
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-zinc-900">{user.name}</p>
                        <p className="truncate text-xs text-zinc-500">{user.email}</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleSignOut}
                        disabled={signingOut}
                        aria-label="Sign out"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer disabled:opacity-50 lg:hidden"
                    >
                        <LogOut size={17} />
                    </button>
                </div>

                <nav
                    aria-label="Account sections"
                    className="mt-5 -mx-4 flex gap-1 overflow-x-auto border-b border-zinc-200 px-4 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-0.5 lg:border-0 lg:px-0"
                >
                    {NAV.map(({ id, label, icon: Icon }) => {
                        const active = tab === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => selectTab(id)}
                                aria-current={active ? "page" : undefined}
                                className={`relative inline-flex shrink-0 cursor-pointer items-center gap-2.5 px-3 py-2.5 text-sm transition-colors lg:rounded-md lg:py-2 ${
                                    active
                                        ? "text-zinc-900 font-medium lg:bg-zinc-100"
                                        : "text-zinc-500 hover:text-zinc-900 lg:hover:bg-zinc-50"
                                }`}
                            >
                                <Icon size={16} className={active ? "text-zinc-900" : "text-zinc-400"} />
                                {label}
                                {active && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-zinc-900 lg:hidden" />}
                            </button>
                        );
                    })}

                    <div className="my-2 hidden h-px bg-zinc-200 lg:block" />
                    <button
                        type="button"
                        onClick={handleSignOut}
                        disabled={signingOut}
                        className="hidden cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:opacity-50 lg:inline-flex"
                    >
                        <LogOut size={16} className="text-zinc-400" />
                        {signingOut ? "Signing out…" : "Sign out"}
                    </button>
                </nav>
            </aside>

            <div className="mt-8 min-w-0 lg:mt-0">
                {tab === "profile" && <ProfileTab user={user} />}
                {tab === "security" && (
                    <SecurityTab
                        currentSessionId={currentSessionId}
                        accounts={accounts}
                        hasPassword={hasPassword}
                        hasGoogle={hasGoogle}
                        googleEnabled={googleEnabled}
                        linkError={linkError}
                        onAccountsChange={onAccountsChange}
                    />
                )}
                {tab === "billing" && <PurchasesTab />}
            </div>
        </div>
    );
}
