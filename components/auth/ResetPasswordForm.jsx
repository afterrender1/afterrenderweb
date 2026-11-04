"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { Alert, AuthCard, PasswordField, PrimaryButton, authErrorMessage } from "./ui";

const MIN_PASSWORD = 8;

export default function ResetPasswordForm({ token }) {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setError("");
        if (password.length < MIN_PASSWORD) return setError(`Password must be at least ${MIN_PASSWORD} characters.`);
        if (password !== confirm) return setError("Passwords don't match.");

        setLoading(true);
        const { error: err } = await authClient.resetPassword({ newPassword: password, token });
        if (err) {
            setLoading(false);
            return setError(authErrorMessage(err));
        }
        // All sessions were revoked by the reset; also clear this browser's cookies so
        // the (up to 5 min) cached session can't keep the old login alive.
        await authClient.signOut().catch(() => {});
        router.replace("/login?reset=1");
    };

    return (
        <AuthCard
            title="Set a new password"
            subtitle="Choose a strong password you don't use anywhere else."
            footer={
                <Link href="/login" className="font-semibold text-[#0A2540] hover:text-[#48A2FF]">
                    Back to log in
                </Link>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <PasswordField
                    label="New password"
                    name="new-password"
                    autoComplete="new-password"
                    required
                    minLength={MIN_PASSWORD}
                    maxLength={128}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    placeholder="Repeat your new password"
                />
                <Alert type="error">{error}</Alert>
                <PrimaryButton type="submit" loading={loading}>
                    Update password
                </PrimaryButton>
            </form>
        </AuthCard>
    );
}
