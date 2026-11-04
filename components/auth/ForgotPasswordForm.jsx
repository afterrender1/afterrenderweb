"use client";

import React, { useState } from "react";
import Link from "next/link";
import { authClient } from "@/app/lib/auth-client";
import { Alert, AuthCard, Field, PrimaryButton, authErrorMessage } from "./ui";

export default function ForgotPasswordForm({ initialError = "" }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(initialError);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setError("");
        setLoading(true);
        const { error: err } = await authClient.requestPasswordReset({
            email: email.trim(),
            // The email link opens /reset-password?token=... (or ?error=INVALID_TOKEN).
            redirectTo: "/reset-password",
        });
        setLoading(false);
        if (err) return setError(authErrorMessage(err));
        setSent(true);
    };

    return (
        <AuthCard
            title="Forgot your password?"
            subtitle="Enter your account email and we'll send you a link to reset it."
            footer={
                <Link href="/login" className="font-semibold text-[#0A2540] hover:text-[#48A2FF]">
                    Back to log in
                </Link>
            }
        >
            {sent ? (
                <Alert type="success">
                    If an account exists for <span className="font-semibold break-all">{email.trim()}</span>, a reset link is
                    on its way. It expires in 1 hour. Check your spam folder if you don&apos;t see it.
                </Alert>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Field
                        label="Email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        maxLength={254}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                    />
                    <Alert type="error">{error}</Alert>
                    <PrimaryButton type="submit" loading={loading}>
                        Send reset link
                    </PrimaryButton>
                </form>
            )}
        </AuthCard>
    );
}
