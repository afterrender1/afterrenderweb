"use client";

import React, { useId, useMemo, useState } from "react";
import useSWR from "swr";
import { Check, KeyRound, Laptop, Smartphone } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { GoogleIcon, authErrorMessage, oauthErrorMessage } from "@/components/auth/ui";
import { SettingsButton as Button, Expand, Input, Label, Message, Spinner, formatDateTime, useConfirm } from "./shared";

const MIN_PASSWORD = 8;

const SecuritySection = ({ title, description, children, footer }) => {
    const titleId = useId();
    return (
        <section data-reveal aria-labelledby={titleId} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
                <h2 id={titleId} className="text-[15px] font-semibold text-gray-950">{title}</h2>
                <p className="mt-1 text-[13px] leading-5 text-gray-500">{description}</p>
            </div>
            <div className="divide-y divide-gray-100">{children}</div>
            {footer && <div className="border-t border-gray-200 px-5 py-3 sm:px-6">{footer}</div>}
        </section>
    );
};

const MethodRow = ({ icon, title, description, status, action, children }) => (
    <div className="px-5 py-5 sm:px-6">
        <div className="grid grid-cols-[40px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 sm:grid-cols-[40px_minmax(0,1fr)_auto]">
            <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600">
                {icon}
            </span>
            <div className="min-w-0">
                <h3 className="text-sm font-medium text-gray-950">{title}</h3>
                <p className="mt-1 text-[13px] leading-5 text-gray-500">{description}</p>
            </div>
            {(status || action) && <div className="col-start-2 flex flex-wrap items-center gap-3 sm:col-start-auto">
                {status}
                {action}
            </div>}
        </div>
        {children && <div className="mt-4 sm:pl-14">{children}</div>}
    </div>
);

/* ---------- Password ---------- */

const ChangePasswordForm = ({ onDone, onCancel }) => {
    const [current, setCurrent] = useState("");
    const [next, setNext] = useState("");
    const [confirm, setConfirm] = useState("");
    const [signOutOthers, setSignOutOthers] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (next.length < MIN_PASSWORD) return setError(`New password must be at least ${MIN_PASSWORD} characters.`);
        if (next !== confirm) return setError("New passwords don't match.");
        if (next === current) return setError("New password must be different from the current one.");

        setSaving(true);
        const { error: err } = await authClient.changePassword({
            currentPassword: current,
            newPassword: next,
            revokeOtherSessions: signOutOthers,
        });
        setSaving(false);
        if (err) return setError(authErrorMessage(err, "Could not change your password."));
        onDone(signOutOthers ? "Password changed. Other devices were signed out." : "Password changed.");
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-sm space-y-3.5 pb-1 pt-1 sm:pt-0">
            <div>
                <Label htmlFor="pw-current">Current password</Label>
                <Input id="pw-current" className="rounded-md!" type="password" autoComplete="current-password" autoFocus required maxLength={128} value={current} onChange={(e) => setCurrent(e.target.value)} />
            </div>
            <div>
                <Label htmlFor="pw-new">New password</Label>
                <Input id="pw-new" className="rounded-md!" type="password" autoComplete="new-password" required minLength={MIN_PASSWORD} maxLength={128} value={next} onChange={(e) => setNext(e.target.value)} placeholder="At least 8 characters" />
            </div>
            <div>
                <Label htmlFor="pw-confirm">Confirm new password</Label>
                <Input id="pw-confirm" className="rounded-md!" type="password" autoComplete="new-password" required minLength={MIN_PASSWORD} maxLength={128} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
            <label className="flex cursor-pointer select-none items-center gap-2.5 text-[13px] text-gray-600">
                <input type="checkbox" checked={signOutOthers} onChange={(e) => setSignOutOthers(e.target.checked)} className="h-4 w-4 accent-gray-950" />
                Sign out of my other devices
            </label>
            <Message>{error}</Message>
            <div className="flex gap-2 pt-0.5">
                <Button type="submit" variant="primary" loading={saving}>
                    Update password
                </Button>
                <Button variant="ghost" onClick={onCancel} disabled={saving}>
                    Cancel
                </Button>
            </div>
        </form>
    );
};

const PasswordRow = () => {
    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState("");
    return (
        <MethodRow
            icon={<KeyRound size={18} strokeWidth={1.75} />}
            title="Password"
            description="Use your email and password to sign in."
            action={
                !open && (
                    <Button
                        onClick={() => {
                            setSuccess("");
                            setOpen(true);
                        }}
                    >
                        Change password
                    </Button>
                )
            }
        >
            {open ? (
                <Expand>
                    <ChangePasswordForm
                        onCancel={() => setOpen(false)}
                        onDone={(text) => {
                            setOpen(false);
                            setSuccess(text);
                        }}
                    />
                </Expand>
            ) : success ? <Message type="success">{success}</Message> : null}
        </MethodRow>
    );
};

/* ---------- Google ---------- */

const GoogleRow = ({ hasGoogle, canDisconnect, onAccountsChange, linkError }) => {
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState(oauthErrorMessage(linkError));
    const { ask, dialog } = useConfirm();

    const connect = async () => {
        setError("");
        setConnecting(true);
        const { error: err } = await authClient.linkSocial({
            provider: "google",
            callbackURL: "/profile?tab=security",
            errorCallbackURL: "/profile?tab=security",
        });
        // On success the browser goes to Google.
        if (err) {
            setConnecting(false);
            setError(authErrorMessage(err, "Could not connect Google."));
        }
    };

    const confirmDisconnect = () => {
        setError("");
        ask({
            title: "Disconnect Google?",
            description: "You won't be able to log in with Google anymore. Your email and password will still work.",
            confirmLabel: "Disconnect",
            destructive: true,
            action: async () => {
                const { error: err } = await authClient.unlinkAccount({ providerId: "google" });
                if (err) return authErrorMessage(err, "Could not disconnect Google.");
                onAccountsChange();
            },
        });
    };

    return (
        <>
            {dialog}
            <MethodRow
                icon={<GoogleIcon size={19} />}
                title="Google"
                description="Sign in with your Google account."
                status={hasGoogle ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600">
                        <Check size={14} className="text-emerald-600" aria-hidden="true" />
                        Connected
                    </span>
                ) : null}
                action={
                    hasGoogle ? (
                        canDisconnect && <Button onClick={confirmDisconnect}>Disconnect</Button>
                    ) : (
                        <Button onClick={connect} loading={connecting}>
                            Connect
                        </Button>
                    )
                }
            >
                {error ? <Message>{error}</Message> : null}
            </MethodRow>
        </>
    );
};

/* ---------- Devices ---------- */

const describeDevice = (userAgent = "") => {
    const ua = String(userAgent);
    const browser = /Edg\//.test(ua) ? "Edge" : /OPR\/|Opera/.test(ua) ? "Opera" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Browser";
    const os = /Windows/.test(ua) ? "Windows" : /iPhone|iPad|iPod/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Mac OS X|Macintosh/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "";
    return { label: os ? `${browser} on ${os}` : browser, mobile: /Mobile|Android|iPhone|iPad/.test(ua) };
};

const fetchSessions = async () => {
    const { data, error } = await authClient.listSessions();
    if (error) throw error;
    return Array.isArray(data) ? data : [];
};

const Devices = ({ currentSessionId }) => {
    const { data, error: loadError, mutate } = useSWR("auth:sessions", fetchSessions, { revalidateOnFocus: false });
    const { ask, dialog } = useConfirm();

    // This device first, then most recently active. null = loading.
    const sessions = useMemo(() => {
        if (loadError) return [];
        if (!data) return null;
        return [...data].sort((a, b) => {
            if (a.id === currentSessionId) return -1;
            if (b.id === currentSessionId) return 1;
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        });
    }, [data, loadError, currentSessionId]);

    const others = sessions?.filter((s) => s.id !== currentSessionId) ?? [];

    const confirmRevoke = (session) =>
        ask({
            title: "Sign out this device?",
            description: `${describeDevice(session.userAgent).label} will be signed out within a few minutes.`,
            confirmLabel: "Sign out device",
            destructive: true,
            action: async () => {
                const { error } = await authClient.revokeSession({ token: session.token });
                if (error) return authErrorMessage(error, "Could not sign out that device.");
                mutate();
            },
        });

    const confirmRevokeOthers = () =>
        ask({
            title: "Sign out all other devices?",
            description: "Every device except this one will be signed out within a few minutes.",
            confirmLabel: "Sign out all",
            destructive: true,
            action: async () => {
                const { error } = await authClient.revokeOtherSessions();
                if (error) return authErrorMessage(error, "Could not sign out other devices.");
                mutate();
            },
        });

    return (
        <SecuritySection
            title="Devices"
            description="Where you're logged in right now."
            footer={
                others.length > 0 ? (
                    <div className="flex sm:justify-end">
                        <Button onClick={confirmRevokeOthers}>
                            Sign out all other devices
                        </Button>
                    </div>
                ) : null
            }
        >
            {dialog}
            {sessions === null ? (
                <div role="status" className="px-5 py-6 sm:px-6">
                    <Spinner label="Loading devices…" />
                </div>
            ) : loadError ? (
                <div className="flex flex-wrap items-center gap-3 px-5 py-5 sm:px-6">
                    <Message>Couldn&apos;t load your devices.</Message>
                    <Button onClick={() => mutate()}>Try again</Button>
                </div>
            ) : sessions.length === 0 ? (
                <p className="px-5 py-6 text-[13px] text-gray-500 sm:px-6">No active devices to show.</p>
            ) : (
                sessions.map((s) => {
                    const { label, mobile } = describeDevice(s.userAgent);
                    const current = s.id === currentSessionId;
                    const Icon = mobile ? Smartphone : Laptop;
                    return (
                        <div key={s.id} className="grid grid-cols-[40px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 px-5 py-5 sm:grid-cols-[40px_minmax(0,1fr)_auto] sm:px-6">
                            <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600">
                                <Icon size={19} strokeWidth={1.75} />
                            </span>
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                                    <h3 className="text-sm font-medium text-gray-950">{label}</h3>
                                    {current && (
                                        <span className="shrink-0 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[11px] leading-4 text-gray-600">
                                            This device
                                        </span>
                                    )}
                                </div>
                                <p className="mt-1 flex items-center gap-1.5 text-[13px] leading-5 text-gray-500">
                                    {current && <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />}
                                    {current ? "Active now" : `Last active ${formatDateTime(s.updatedAt)}`}
                                </p>
                            </div>
                            {!current && s.token && (
                                <div className="col-start-2 sm:col-start-auto">
                                    <Button aria-label={`Sign out ${label}`} onClick={() => confirmRevoke(s)}>
                                        Sign out
                                    </Button>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </SecuritySection>
    );
};

/* ---------- Tab ---------- */

export default function SecurityTab({ currentSessionId, accounts, hasPassword, hasGoogle, googleEnabled, linkError, onAccountsChange }) {
    const showGoogle = googleEnabled || hasGoogle;

    return (
        <>
            <header data-reveal className="mb-7 sm:mb-8">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-950 sm:text-[28px]">Sign-in &amp; security</h1>
                <p className="mt-2 text-sm leading-6 text-gray-500">Manage how you sign in and the devices you use.</p>
            </header>
            <div className="space-y-6">
                <SecuritySection title="Sign-in methods" description="Manage the ways you sign in to your account.">
                    {accounts === null ? (
                        <div role="status" className="px-5 py-6 sm:px-6">
                            <Spinner label="Loading sign-in methods…" />
                        </div>
                    ) : (
                        <>
                            {showGoogle && (
                                <GoogleRow
                                    hasGoogle={hasGoogle}
                                    canDisconnect={hasPassword}
                                    onAccountsChange={onAccountsChange}
                                    linkError={linkError}
                                />
                            )}
                            {hasPassword && <PasswordRow />}
                        </>
                    )}
                </SecuritySection>
                <Devices currentSessionId={currentSessionId} />
            </div>
        </>
    );
}
