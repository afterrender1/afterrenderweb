"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import {
    Alert,
    AuthCard,
    Divider,
    Field,
    GoogleButton,
    PasswordField,
    PrimaryButton,
    SecondaryButton,
    authErrorMessage,
} from "./ui";

const MIN_PASSWORD = 8;

export default function SignupForm({ next = "/profile", googleEnabled = false }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");
    const [sentTo, setSentTo] = useState("");
    const [resending, setResending] = useState(false);
    const [resendInfo, setResendInfo] = useState("");

    const nextQuery = next !== "/profile" ? `?next=${encodeURIComponent(next)}` : "";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setError("");

        const cleanName = name.trim();
        const cleanEmail = email.trim();
        if (!cleanName) return setError("Please enter your name.");
        if (password.length < MIN_PASSWORD) return setError(`Password must be at least ${MIN_PASSWORD} characters.`);
        if (password !== confirm) return setError("Passwords don't match.");

        setLoading(true);
        const { error: err } = await authClient.signUp.email({
            name: cleanName,
            email: cleanEmail,
            password,
            // Where the verification link sends the user once they're verified and signed in.
            callbackURL: next,
        });
        setLoading(false);

        if (err) return setError(authErrorMessage(err));
        setPassword("");
        setConfirm("");
        setSentTo(cleanEmail);
    };

    const handleResend = async () => {
        setResending(true);
        setResendInfo("");
        const { error: err } = await authClient.sendVerificationEmail({ email: sentTo, callbackURL: next });
        setResending(false);
        setResendInfo(err ? authErrorMessage(err) : "A new verification link is on its way.");
    };

    const handleGoogle = async () => {
        setError("");
        setGoogleLoading(true);
        const { error: err } = await authClient.signIn.social({
            provider: "google",
            callbackURL: next,
            errorCallbackURL: `/login${nextQuery}`,
        });
        if (err) {
            setGoogleLoading(false);
            setError(authErrorMessage(err, "Google sign-up failed. Please try again."));
        }
    };

    if (sentTo) {
        return (
            <AuthCard title="Check your email" subtitle="One last step to activate your account.">
                <div className="flex flex-col items-center text-center">
                    <span className="w-14 h-14 rounded-full bg-[#48A2FF]/10 text-[#48A2FF] flex items-center justify-center">
                        <MailCheck size={26} />
                    </span>
                    <p className="mt-5 text-sm text-[#425466] leading-relaxed">
                        We&apos;ve sent a verification link to{" "}
                        <span className="font-semibold text-[#0A2540] break-all">{sentTo}</span>. Click it to verify your
                        email. You&apos;ll be signed in automatically.
                    </p>
                    <p className="mt-3 text-xs text-[#8898aa]">Can&apos;t find it? Check your spam folder. The link expires in 24 hours.</p>
                    <div className="mt-6 w-full space-y-3">
                        <SecondaryButton type="button" onClick={handleResend} loading={resending} className="w-full">
                            Resend verification email
                        </SecondaryButton>
                        {resendInfo && <p className="text-xs text-[#425466]">{resendInfo}</p>}
                        <Link
                            href={`/login${nextQuery}`}
                            className="block text-sm font-semibold text-[#0A2540] hover:text-[#48A2FF]"
                        >
                            Back to log in
                        </Link>
                    </div>
                </div>
            </AuthCard>
        );
    }

    return (
        <AuthCard
            title="Create your account"
            subtitle="Sign up to manage your AfterRender plans and profile."
            footer={
                <>
                    Already have an account?{" "}
                    <Link href={`/login${nextQuery}`} className="font-semibold text-[#0A2540] hover:text-[#48A2FF]">
                        Log in
                    </Link>
                </>
            }
        >
            {googleEnabled && (
                <>
                    <GoogleButton loading={googleLoading} onClick={handleGoogle} disabled={loading}>
                        Sign up with Google
                    </GoogleButton>
                    <Divider />
                </>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Field
                    label="Full name"
                    name="name"
                    autoComplete="name"
                    required
                    maxLength={60}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                />
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
                    label="Confirm password"
                    name="confirm-password"
                    autoComplete="new-password"
                    required
                    minLength={MIN_PASSWORD}
                    maxLength={128}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
                />

                <Alert type="error">{error}</Alert>

                <PrimaryButton type="submit" loading={loading} disabled={googleLoading}>
                    Create account
                </PrimaryButton>

                <p className="text-xs text-center text-[#8898aa] leading-relaxed">
                    By signing up you agree to our{" "}
                    <Link href="/terms-conditions" className="underline hover:text-[#0A2540]">
                        Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy-policy" className="underline hover:text-[#0A2540]">
                        Privacy Policy
                    </Link>
                    .
                </p>
            </form>
        </AuthCard>
    );
}
