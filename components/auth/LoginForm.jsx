"use client";

import React, { useState } from "react";
import Link from "next/link";
import { authClient } from "@/app/lib/auth-client";
import {
    Alert,
    AuthCard,
    Divider,
    Field,
    GoogleButton,
    PasswordField,
    PrimaryButton,
    authErrorMessage,
    oauthErrorMessage,
} from "./ui";

export default function LoginForm({ next = "/profile", oauthError = "", notice = "", googleEnabled = false }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState(oauthErrorMessage(oauthError));
    const [info, setInfo] = useState(notice);

    const nextQuery = next !== "/profile" ? `?next=${encodeURIComponent(next)}` : "";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setError("");
        setInfo("");
        setLoading(true);

        const { error: err } = await authClient.signIn.email({
            email: email.trim(),
            password,
            rememberMe: true,
            // On success the client navigates here; also used for the verification link if needed.
            callbackURL: next,
        });

        if (err) {
            setLoading(false);
            if (err.code === "EMAIL_NOT_VERIFIED") {
                setInfo(`Your email isn't verified yet. We've sent a new verification link to ${email.trim()}. Please check your inbox (and spam folder).`);
            } else {
                setError(authErrorMessage(err));
            }
            return;
        }
        // Success: because `callbackURL` was sent, the auth client does a full-page navigation
        // to `next` itself. The button stays in its loading state until that page loads.
    };

    const handleGoogle = async () => {
        setError("");
        setInfo("");
        setGoogleLoading(true);
        const { error: err } = await authClient.signIn.social({
            provider: "google",
            callbackURL: next,
            errorCallbackURL: `/login${nextQuery}`,
        });
        if (err) {
            setGoogleLoading(false);
            setError(authErrorMessage(err, "Google sign-in failed. Please try again."));
        }
    };

    return (
        <AuthCard
            title="Welcome back"
            subtitle="Log in to your AfterRender account."
            footer={
                <>
                    Don&apos;t have an account?{" "}
                    <Link href={`/signup${nextQuery}`} className="font-semibold text-[#0A2540] hover:text-[#48A2FF]">
                        Sign up
                    </Link>
                </>
            }
        >
            {googleEnabled && (
                <>
                    <GoogleButton loading={googleLoading} onClick={handleGoogle} disabled={loading}>
                        Continue with Google
                    </GoogleButton>
                    <Divider />
                </>
            )}

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
                <PasswordField
                    label="Password"
                    name="password"
                    autoComplete="current-password"
                    required
                    maxLength={128}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    rightLabel={
                        <Link href="/forgot-password" className="text-xs font-semibold text-[#48A2FF] hover:underline">
                            Forgot password?
                        </Link>
                    }
                />

                <Alert type="error">{error}</Alert>
                <Alert type="success">{info}</Alert>

                <PrimaryButton type="submit" loading={loading} disabled={googleLoading}>
                    Log in
                </PrimaryButton>
            </form>
        </AuthCard>
    );
}
