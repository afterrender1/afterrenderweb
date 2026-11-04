"use client";

import React, { useMemo, useState } from "react";
import useSWR from "swr";
import { Laptop, Loader2, Smartphone } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import {
    Alert,
    GoogleIcon,
    PasswordField,
    PrimaryButton,
    SecondaryButton,
    authErrorMessage,
    oauthErrorMessage,
} from "@/components/auth/ui";
import { Badge, Panel, formatDateTime } from "./shared";

const MIN_PASSWORD = 8;

/* ---------- Password ---------- */

const ChangePasswordForm = () => {
    const [current, setCurrent] = useState("");
    const [next, setNext] = useState("");
    const [confirm, setConfirm] = useState("");
    const [signOutOthers, setSignOutOthers] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (next.length < MIN_PASSWORD) return setError(`New password must be at least ${MIN_PASSWORD} characters.`);
        if (next !== confirm) return setError("New passwords don't match.");
        if (next === current) return setError("New password must be different from your current one.");

        setSaving(true);
        const { error: err } = await authClient.changePassword({
            currentPassword: current,
            newPassword: next,
            revokeOtherSessions: signOutOthers,
        });
        setSaving(false);
        if (err) return setError(authErrorMessage(err, "Could not change your password."));
        setCurrent("");
        setNext("");
        setConfirm("");
        setSuccess(signOutOthers ? "Password changed. You've been signed out on all other devices." : "Password changed.");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <PasswordField
                label="Current password"
                name="current-password"
                autoComplete="current-password"
                required
                maxLength={128}
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
            />
            <PasswordField
                label="New password"
                name="new-password"
                autoComplete="new-password"
                required
                minLength={MIN_PASSWORD}
                maxLength={128}
                value={next}
                onChange={(e) => setNext(e.target.value)}
                placeholder="At least 8 characters"
            />
            <PasswordField
                label="Confirm new password"
                name="confirm-password"
                autoComplete="new-password"
                required
                minLength={MIN_PASSWORD}
                maxLength={128}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
            />
            <label className="flex items-center gap-2.5 text-sm text-[#425466] cursor-pointer select-none">
                <input
                    type="checkbox"
                    checked={signOutOthers}
                    onChange={(e) => setSignOutOthers(e.target.checked)}
                    className="w-4 h-4 accent-[#48A2FF]"
                />
                Sign out of all other devices
            </label>
            <Alert type="error">{error}</Alert>
            <Alert type="success">{success}</Alert>
            <PrimaryButton type="submit" loading={saving} className="sm:w-auto sm:px-8">
                Change password
            </PrimaryButton>
        </form>
    );
};

const SetPasswordByEmail = ({ email }) => {
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);

    const handleSend = async () => {
        setError("");
        setSending(true);
        const { error: err } = await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" });
        setSending(false);
        if (err) return setError(authErrorMessage(err));
        setSent(true);
    };

    return (
        <div className="space-y-4 max-w-lg">
            <p className="text-sm text-[#425466] leading-relaxed">
                You sign in with Google. If you&apos;d also like to log in with your email and a password, we&apos;ll email you a
                secure link to create one.
            </p>
            {sent ? (
                <Alert type="success">
                    Check <span className="font-semibold break-all">{email}</span> for a link to set your password. It expires in 1
                    hour.
                </Alert>
            ) : (
                <SecondaryButton type="button" onClick={handleSend} loading={sending}>
                    Email me a link to set a password
                </SecondaryButton>
            )}
            <Alert type="error">{error}</Alert>
        </div>
    );
};

/* ---------- Connected accounts ---------- */

const ConnectedAccounts = ({ hasGoogle, hasPassword, onAccountsChange, linkError }) => {
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
        // On success the browser is redirected to Google.
        if (err) {
            setBusy(false);
            setError(authErrorMessage(err, "Could not connect Google."));
        }
    };

    const disconnect = async () => {
        setError("");
        setBusy(true);
        const { error: err } = await authClient.unlinkAccount({ providerId: "google" });
        setBusy(false);
        if (err) return setError(authErrorMessage(err, "Could not disconnect Google."));
        onAccountsChange();
    };

    return (
        <Panel title="Connected accounts" description="Use these to log in to AfterRender in one click.">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-black/[0.06] p-4">
                <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-[#f6f9fc] flex items-center justify-center">
                        <GoogleIcon size={20} />
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-[#0A2540]">Google</p>
                        <p className="text-xs text-[#8898aa]">{hasGoogle ? "Connected" : "Not connected"}</p>
                    </div>
                </div>
                {hasGoogle ? (
                    hasPassword ? (
                        <SecondaryButton type="button" onClick={disconnect} loading={busy}>
                            Disconnect
                        </SecondaryButton>
                    ) : (
                        <Badge tone="success">Main sign-in method</Badge>
                    )
                ) : (
                    <SecondaryButton type="button" onClick={connect} loading={busy}>
                        Connect
                    </SecondaryButton>
                )}
            </div>
            {!hasGoogle && (
                <p className="mt-3 text-xs text-[#8898aa]">The Google account must use the same email as your AfterRender account.</p>
            )}
            {error && (
                <div className="mt-4">
                    <Alert type="error">{error}</Alert>
                </div>
            )}
        </Panel>
    );
};

/* ---------- Sessions ---------- */

const describeDevice = (userAgent = "") => {
    const ua = String(userAgent);
    const browser = /Edg\//.test(ua)
        ? "Edge"
        : /OPR\/|Opera/.test(ua)
          ? "Opera"
          : /Chrome\//.test(ua)
            ? "Chrome"
            : /Firefox\//.test(ua)
              ? "Firefox"
              : /Safari\//.test(ua)
                ? "Safari"
                : "Browser";
    const os = /Windows/.test(ua)
        ? "Windows"
        : /iPhone|iPad|iPod/.test(ua)
          ? "iOS"
          : /Android/.test(ua)
            ? "Android"
            : /Mac OS X|Macintosh/.test(ua)
              ? "macOS"
              : /Linux/.test(ua)
                ? "Linux"
                : "Unknown device";
    const mobile = /Mobile|Android|iPhone|iPad/.test(ua);
    return { label: `${browser} on ${os}`, mobile };
};

const fetchSessions = async () => {
    const { data, error } = await authClient.listSessions();
    if (error) throw error;
    return Array.isArray(data) ? data : [];
};

const ActiveSessions = ({ currentSessionId }) => {
    const { data, error: loadError, mutate } = useSWR("auth:sessions", fetchSessions, { revalidateOnFocus: false });
    const [actionError, setActionError] = useState("");
    const [busyToken, setBusyToken] = useState(null);
    const [revokingAll, setRevokingAll] = useState(false);

    // Current device first, then most recently active. null = loading.
    const sessions = useMemo(() => {
        if (loadError) return [];
        if (!data) return null;
        return [...data].sort((a, b) => {
            if (a.id === currentSessionId) return -1;
            if (b.id === currentSessionId) return 1;
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        });
    }, [data, loadError, currentSessionId]);

    const error = actionError || (loadError ? "Couldn't load your devices." : "");

    const revoke = async (token) => {
        setActionError("");
        setBusyToken(token);
        const { error: err } = await authClient.revokeSession({ token });
        setBusyToken(null);
        if (err) return setActionError(authErrorMessage(err, "Could not sign out that device."));
        mutate();
    };

    const revokeOthers = async () => {
        setActionError("");
        setRevokingAll(true);
        const { error: err } = await authClient.revokeOtherSessions();
        setRevokingAll(false);
        if (err) return setActionError(authErrorMessage(err, "Could not sign out other devices."));
        mutate();
    };

    const others = sessions?.filter((s) => s.id !== currentSessionId) ?? [];

    return (
        <Panel
            title="Where you're logged in"
            description="Signed out devices may stay logged in for up to 5 more minutes."
            action={
                others.length > 0 && (
                    <SecondaryButton type="button" onClick={revokeOthers} loading={revokingAll}>
                        Sign out all other devices
                    </SecondaryButton>
                )
            }
        >
            {sessions === null ? (
                <div className="flex items-center gap-2 text-sm text-[#8898aa]">
                    <Loader2 size={16} className="animate-spin" /> Loading devices…
                </div>
            ) : (
                <ul className="divide-y divide-black/[0.05]">
                    {sessions.map((s) => {
                        const { label, mobile } = describeDevice(s.userAgent);
                        const current = s.id === currentSessionId;
                        const Icon = mobile ? Smartphone : Laptop;
                        return (
                            <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="w-10 h-10 rounded-xl bg-[#f6f9fc] text-[#425466] flex items-center justify-center shrink-0">
                                        <Icon size={18} />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-[#0A2540] flex flex-wrap items-center gap-2">
                                            {label}
                                            {current && <Badge tone="info">This device</Badge>}
                                        </p>
                                        <p className="text-xs text-[#8898aa] break-all">
                                            {s.ipAddress ? `${s.ipAddress} · ` : ""}Last active {formatDateTime(s.updatedAt)}
                                        </p>
                                    </div>
                                </div>
                                {!current && s.token && (
                                    <SecondaryButton
                                        type="button"
                                        onClick={() => revoke(s.token)}
                                        loading={busyToken === s.token}
                                        disabled={revokingAll}
                                    >
                                        Sign out
                                    </SecondaryButton>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
            {error && (
                <div className="mt-4">
                    <Alert type="error">{error}</Alert>
                </div>
            )}
        </Panel>
    );
};

/* ---------- Tab ---------- */

export default function SecurityTab({
    user,
    currentSessionId,
    accounts,
    hasPassword,
    hasGoogle,
    googleEnabled,
    linkError,
    onAccountsChange,
}) {
    return (
        <div className="space-y-6">
            <Panel
                title={hasPassword || accounts === null ? "Change password" : "Set a password"}
                description={hasPassword ? "Use at least 8 characters. Avoid passwords you use on other sites." : undefined}
            >
                {accounts === null ? (
                    <div className="flex items-center gap-2 text-sm text-[#8898aa]">
                        <Loader2 size={16} className="animate-spin" /> Loading…
                    </div>
                ) : hasPassword ? (
                    <ChangePasswordForm />
                ) : (
                    <SetPasswordByEmail email={user.email} />
                )}
            </Panel>

            {(googleEnabled || hasGoogle) && accounts !== null && (
                <ConnectedAccounts
                    hasGoogle={hasGoogle}
                    hasPassword={hasPassword}
                    onAccountsChange={onAccountsChange}
                    linkError={linkError}
                />
            )}

            <ActiveSessions currentSessionId={currentSessionId} />
        </div>
    );
}
