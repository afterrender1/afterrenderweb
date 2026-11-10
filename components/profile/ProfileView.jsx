"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CreditCard, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { jakarta, reduceMotion, useConfirm } from "./shared";
import ProfileTab from "./ProfileTab";
import SecurityTab from "./SecurityTab";
import BillingTab from "./BillingTab";

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
    const { ask, dialog } = useConfirm();

    const root = useRef(null);
    const panel = useRef(null);
    const nav = useRef(null);
    const pill = useRef(null);
    const navButtons = useRef({});
    const pillPlaced = useRef(false);

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

    /* ---------- Motion ---------- */

    // Slide the highlight under the active nav item (works for the vertical and the horizontal layout).
    const placePill = useCallback((id, animate) => {
        const button = navButtons.current[id];
        if (!button || !pill.current) return;
        const to = { x: button.offsetLeft, y: button.offsetTop, width: button.offsetWidth, height: button.offsetHeight };
        if (animate && pillPlaced.current && !reduceMotion()) {
            gsap.to(pill.current, { ...to, duration: 0.45, ease: "power3.out", overwrite: true });
        } else {
            gsap.set(pill.current, { ...to, autoAlpha: 1 });
        }
        pillPlaced.current = true;
    }, []);

    // Page entrance (once). The root is hidden until this runs, so nothing flashes before it animates.
    useGSAP(
        () => {
            gsap.set(root.current, { autoAlpha: 1 });
            if (reduceMotion()) return;
            gsap.from("[data-enter]", {
                y: 12,
                autoAlpha: 0,
                duration: 0.5,
                ease: "power3.out",
                stagger: 0.07,
                clearProps: "transform,opacity,visibility",
            });
        },
        { scope: root }
    );

    // Move the highlight when the tab changes (before paint, so it never lags behind the text colour).
    const tabRef = useRef(tab);
    useLayoutEffect(() => {
        tabRef.current = tab;
        placePill(tab, true);
    }, [tab, placePill]);

    // Each tab's sections rise in one after another.
    useGSAP(
        () => {
            if (reduceMotion()) return;
            gsap.from(gsap.utils.toArray("[data-reveal]", panel.current), {
                y: 14,
                autoAlpha: 0,
                duration: 0.5,
                ease: "power3.out",
                stagger: 0.07,
                clearProps: "transform,opacity,visibility",
            });
        },
        { dependencies: [tab], scope: root }
    );

    // Keep the highlight aligned when the layout changes (resize, breakpoint switch, font load).
    useEffect(() => {
        if (!nav.current || typeof ResizeObserver === "undefined") return;
        let width = nav.current.offsetWidth;
        let height = nav.current.offsetHeight;
        const observer = new ResizeObserver(() => {
            const el = nav.current;
            if (!el || (el.offsetWidth === width && el.offsetHeight === height)) return;
            width = el.offsetWidth;
            height = el.offsetHeight;
            placePill(tabRef.current, false);
        });
        observer.observe(nav.current);
        return () => observer.disconnect();
    }, [placePill]);

    /* ---------- Actions ---------- */

    const selectTab = (id) => {
        if (id === tab) return;
        setTab(id);
        window.history.replaceState(null, "", id === "profile" ? "/profile" : `/profile?tab=${id}`);
        if (window.scrollY > 160) window.scrollTo({ top: 0, behavior: reduceMotion() ? "auto" : "smooth" });
    };

    const handleSignOut = () =>
        ask({
            title: "Sign out?",
            description: "You'll need to log in again to get back to your account.",
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
        <div ref={root} style={{ visibility: "hidden" }} className={`${jakarta.className} mx-auto w-full max-w-5xl`}>
            {dialog}

            {/* Section tag, same as the rest of the site */}
            <div data-enter className="mb-7 flex items-center gap-3 sm:mb-9">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-400 sm:text-xs">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#CEFF00]" />
                    <span>Account</span>
                </div>
                <div className="h-px flex-1 bg-gray-200" />
                <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-gray-500 transition-colors hover:text-gray-950 disabled:opacity-50 lg:hidden"
                >
                    <LogOut size={14} />
                    Sign out
                </button>
            </div>

            <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16">
                <aside data-enter className="lg:sticky lg:top-28 lg:self-start">
                    <nav
                        ref={nav}
                        aria-label="Account sections"
                        className="relative flex rounded-full border border-gray-200/70 bg-[#EFEFEF] p-1 shadow-inner lg:flex-col lg:gap-1 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none"
                    >
                        <span
                            ref={pill}
                            aria-hidden="true"
                            className="invisible absolute left-0 top-0 rounded-full bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] shadow-[0_2px_10px_rgba(72,162,255,0.35)] will-change-transform"
                        />
                        {NAV.map(({ id, label, icon: Icon }) => {
                            const active = tab === id;
                            return (
                                <button
                                    key={id}
                                    ref={(el) => {
                                        navButtons.current[id] = el;
                                    }}
                                    type="button"
                                    onClick={() => selectTab(id)}
                                    aria-current={active ? "page" : undefined}
                                    className={`relative z-10 inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full px-3 text-[13px] font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48A2FF]/50 lg:h-10 lg:flex-none lg:justify-start lg:px-4 ${
                                        active ? "text-[#0A2540]" : "text-gray-500 hover:text-gray-950"
                                    }`}
                                >
                                    <Icon size={15} />
                                    {label}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="hidden lg:block">
                        <div className="my-4 h-px bg-gray-200" />
                        <button
                            type="button"
                            onClick={handleSignOut}
                            disabled={signingOut}
                            className="inline-flex h-10 w-full cursor-pointer items-center gap-2 rounded-full px-4 text-[13px] font-semibold text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48A2FF]/50 disabled:opacity-50"
                        >
                            <LogOut size={15} />
                            Sign out
                        </button>
                    </div>
                </aside>

                <div key={tab} ref={panel} className="mt-8 min-w-0 lg:mt-0">
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
                    {tab === "billing" && <BillingTab />}
                </div>
            </div>
        </div>
    );
}
