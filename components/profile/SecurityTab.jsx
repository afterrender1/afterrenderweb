"use client";

import React, { useMemo, useState } from "react";
import useSWR from "swr";
import { Laptop, Smartphone } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { GoogleIcon, authErrorMessage, oauthErrorMessage } from "@/components/auth/ui";
import { Badge, Button, Input, Label, Message, PageHeader, Row, Section, Spinner, formatDateTime, useConfirm } from "./shared";

const MIN_PASSWORD = 8;

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
        <form onSubmit={handleSubmit} className="max-w-sm space-y-3">
            <div>
                <Label htmlFor="pw-current">Current password</Label>
                <Input id="pw-current" type="password" autoComplete="current-password" required maxLength={128} value={current} onChange={(e) => setCurrent(e.target.value)} />
            </div>
            <div>
                <Label htmlFor="pw-new">New password</Label>
                <Input id="pw-new" type="password" autoComplete="new-password" required minLength={MIN_PASSWORD} maxLength={128} value={next} onChange={(e) => setNext(e.target.value)} placeholder="At least 8 characters" />
            </div>
            <div>
                <Label htmlFor="pw-confirm">Confirm new password</Label>
                <Input id="pw-confirm" type="password" autoComplete="new-password" required minLength={MIN_PASSWORD} maxLength={128} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
            <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-zinc-600">
                <input type="checkbox" checked={signOutOthers} onChange={(e) => setSignOutOthers(e.target.checked)} className="h-4 w-4 accent-zinc-900" />
                Sign out of other devices
            </label>
            <Message>{error}</Message>
            <div className="flex gap-2 pt-1">
                <Button type="submit" variant="primary" loading={saving}>
                    Update password
                </Button>
                <Button type="button" variant="ghost" onClick={onCancel}>
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
        <Row
            label="Password"
            action={!open && <Button onClick={() => { setSuccess(""); setOpen(true); }}>Change</Button>}
            below={
                open ? (
                    <ChangePasswordForm
                        onCancel={() => setOpen(false)}
                        onDone={(text) => {
                            setOpen(false);
                            setSuccess(text);
                        }}
                    />
                ) : success ? (
                    <Message type="success">{success}</Message>
                ) : null
            }
        >
            <span className="tracking-widest text-zinc-400">••••••••</span>
        </Row>
    );
};

/* ---------- Google ---------- */

const GoogleRow = ({ hasGoogle, canDisconnect, onAccountsChange, linkError }) => {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(oauthErrorMessage(linkError));

    const connect = async () => {
        setError("");
        setBusy(true);
        const { error: err } = await authClient.linkSocial({
            provider: "google",
            callbackURL: "/profile?tab=security",
            errorCallbackURL: "/profile?tab=security",
        });
        if (err) {
            setBusy(false);
            setError(authErrorMessage(err, "Could not connect Google."));
        }
    };

    const { ask, dialog, busy: disconnecting } = useConfirm();

    const confirmDisconnect = () => {
        setError("");
        ask({
            title: "Disconnect Google?",
            description: "You won't be able to log in with Google anymore. You can still log in with your email and password.",
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
        <Row
            label="Google"
            action={
                hasGoogle ? (
                    canDisconnect && (
                        <Button onClick={confirmDisconnect} loading={disconnecting}>
                            Disconnect
                        </Button>
                    )
                ) : (
                    <Button onClick={connect} loading={busy}>
                        Connect
                    </Button>
                )
            }
            below={error ? <Message>{error}</Message> : null}
        >
            {dialog}
            <span className="inline-flex items-center gap-2">
                <GoogleIcon size={16} />
                {hasGoogle ? "Connected" : <span className="text-zinc-500">Not connected</span>}
            </span>
        </Row>
    );
};

/* ---------- Devices ---------- */

const describeDevice = (userAgent = "") => {
    const ua = String(userAgent);
    const browser = /Edg\//.test(ua) ? "Edge" : /OPR\/|Opera/.test(ua) ? "Opera" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Browser";
    const os = /Windows/.test(ua) ? "Windows" : /iPhone|iPad|iPod/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Mac OS X|Macintosh/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "Unknown";
    return { label: `${browser} on ${os}`, mobile: /Mobile|Android|iPhone|iPad/.test(ua) };
};

const fetchSessions = async () => {
    const { data, error } = await authClient.listSessions();
    if (error) throw error;
    return Array.isArray(data) ? data : [];
};

const Devices = ({ currentSessionId }) => {
    const { data, error: loadError, mutate } = useSWR("auth:sessions", fetchSessions, { revalidateOnFocus: false });
    const { ask, dialog } = useConfirm();

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

    const errorText = loadError ? "Couldn't load your devices." : "";

    return (
        <Section
            title="Your devices"
            description="Where you're currently logged in."
            footer={
                others.length > 0 || errorText ? (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <Message>{errorText}</Message>
                        {others.length > 0 && (
                            <Button variant="danger" onClick={confirmRevokeOthers} className="ml-auto">
                                Sign out all other devices
                            </Button>
                        )}
                    </div>
                ) : null
            }
        >
            {dialog}
            {sessions === null ? (
                <div className="px-5 py-4 sm:px-6">
                    <Spinner />
                </div>
            ) : (
                sessions.map((s) => {
                    const { label, mobile } = describeDevice(s.userAgent);
                    const current = s.id === currentSessionId;
                    const Icon = mobile ? Smartphone : Laptop;
                    return (
                        <div key={s.id} className="flex items-center gap-3 px-5 py-3.5 sm:px-6">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                                <Icon size={17} />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="flex flex-wrap items-center gap-2 text-sm text-zinc-900">
                                    {label}
                                    {current && <Badge tone="success">This device</Badge>}
                                </p>
                                <p className="truncate text-xs text-zinc-500">
                                    {current ? "Active now" : `Last active ${formatDateTime(s.updatedAt)}`}
                                    {s.ipAddress ? ` · ${s.ipAddress}` : ""}
                                </p>
                            </div>
                            {!current && s.token && (
                                <Button variant="ghost" onClick={() => confirmRevoke(s)}>
                                    Sign out
                                </Button>
                            )}
                        </div>
                    );
                })
            )}
        </Section>
    );
};

/* ---------- Tab ---------- */

export default function SecurityTab({ currentSessionId, accounts, hasPassword, hasGoogle, googleEnabled, linkError, onAccountsChange }) {
    const showGoogle = googleEnabled || hasGoogle;

    return (
        <>
            <PageHeader title="Security" description="Manage how you sign in and where you're logged in." />
            <div className="space-y-6">
                <Section title="Sign-in methods">
                    {accounts === null ? (
                        <div className="px-5 py-4 sm:px-6">
                            <Spinner />
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
                </Section>
                <Devices currentSessionId={currentSessionId} />
            </div>
        </>
    );
}
