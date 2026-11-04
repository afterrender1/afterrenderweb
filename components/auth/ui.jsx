"use client";

import React, { useId, useState } from "react";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { cloudinaryImage } from "@/app/lib/cloudinaryUrl";

/* ---------- Error messages ---------- */

const ERROR_MESSAGES = {
    INVALID_EMAIL_OR_PASSWORD: "Incorrect email or password.",
    INVALID_EMAIL: "Please enter a valid email address.",
    INVALID_PASSWORD: "Your current password is incorrect.",
    EMAIL_NOT_VERIFIED: "Please verify your email first. We've sent you a new verification link.",
    PASSWORD_TOO_SHORT: "Password must be at least 8 characters.",
    PASSWORD_TOO_LONG: "Password must be at most 128 characters.",
    USER_ALREADY_EXISTS: "An account with this email already exists.",
    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "An account with this email already exists. Try logging in instead.",
    INVALID_TOKEN: "This link is invalid or has already been used. Please request a new one.",
    TOKEN_EXPIRED: "This link has expired. Please request a new one.",
    CREDENTIAL_ACCOUNT_NOT_FOUND: "This account doesn't have a password yet.",
    SESSION_EXPIRED: "For your security, please log in again to do this.",
    SESSION_NOT_FRESH: "For your security, please log in again to do this.",
    FAILED_TO_UNLINK_LAST_ACCOUNT: "You can't disconnect your only sign-in method.",
    SOCIAL_ACCOUNT_ALREADY_LINKED: "This Google account is already connected to another user.",
    LINKED_ACCOUNT_ALREADY_EXISTS: "This Google account is already connected.",
};

// Errors that come back as `?error=` after a Google redirect.
const OAUTH_ERROR_MESSAGES = {
    account_not_linked:
        "An account with this email already exists but isn't verified yet. Log in with your email and password (we'll email you a verification link), then you can use Google.",
    access_denied: "Google sign-in was cancelled.",
    email_not_found: "Your Google account didn't share an email address.",
    email_does_not_match: "That Google account uses a different email than your profile.",
    account_already_linked_to_different_user: "That Google account is already connected to another user.",
    unable_to_link_account: "We couldn't connect that Google account. Please try again.",
    INVALID_TOKEN: "This link is invalid or has already been used. Please request a new one.",
    TOKEN_EXPIRED: "This link has expired. Please request a new one.",
};

export const authErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
    if (!error) return fallback;
    if (error.status === 429) return "Too many attempts. Please wait a minute and try again.";
    if (error.code && ERROR_MESSAGES[error.code]) return ERROR_MESSAGES[error.code];
    if (typeof error.message === "string" && error.message.length < 160) return error.message;
    return fallback;
};

export const oauthErrorMessage = (code) => {
    if (!code) return "";
    return OAUTH_ERROR_MESSAGES[code] || "Sign-in failed. Please try again.";
};

/* ---------- Layout ---------- */

export const AuthCard = ({ title, subtitle, children, footer }) => (
    <div className="w-full max-w-md">
        <div className="bg-white border border-black/[0.06] rounded-2xl shadow-[0_8px_40px_rgba(10,37,64,0.08)] px-6 py-8 sm:px-9 sm:py-10">
            <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#0A2540]">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-[#425466] leading-relaxed">{subtitle}</p>}
            <div className="mt-7">{children}</div>
        </div>
        {footer && <div className="mt-6 text-center text-sm text-[#425466]">{footer}</div>}
    </div>
);

/* ---------- Form controls ---------- */

const inputClass =
    "w-full h-11 rounded-xl border border-black/10 bg-white px-3.5 text-[15px] text-[#0A2540] placeholder:text-[#8898aa] outline-none transition focus:border-[#48A2FF] focus:ring-4 focus:ring-[#48A2FF]/15 disabled:bg-[#f6f9fc] disabled:text-[#8898aa]";

export const Field = ({ label, hint, rightLabel, className = "", ...props }) => {
    const id = useId();
    return (
        <div className={className}>
            <div className="flex items-center justify-between mb-1.5">
                <label htmlFor={id} className="text-sm font-medium text-[#0A2540]">
                    {label}
                </label>
                {rightLabel}
            </div>
            <input id={id} className={inputClass} {...props} />
            {hint && <p className="mt-1.5 text-xs text-[#8898aa]">{hint}</p>}
        </div>
    );
};

export const PasswordField = ({ label, hint, rightLabel, className = "", ...props }) => {
    const id = useId();
    const [visible, setVisible] = useState(false);
    return (
        <div className={className}>
            <div className="flex items-center justify-between mb-1.5">
                <label htmlFor={id} className="text-sm font-medium text-[#0A2540]">
                    {label}
                </label>
                {rightLabel}
            </div>
            <div className="relative">
                <input id={id} type={visible ? "text" : "password"} className={`${inputClass} pr-11`} {...props} />
                <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg text-[#8898aa] hover:text-[#0A2540] hover:bg-black/[0.04] cursor-pointer"
                    aria-label={visible ? "Hide password" : "Show password"}
                >
                    {visible ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
            </div>
            {hint && <p className="mt-1.5 text-xs text-[#8898aa]">{hint}</p>}
        </div>
    );
};

export const PrimaryButton = ({ loading, children, className = "", disabled, ...props }) => (
    <button
        disabled={disabled || loading}
        className={`w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl font-bold text-sm text-[#0A2540] bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] shadow-md hover:brightness-105 hover:shadow-lg active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 ${className}`}
        {...props}
    >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {children}
    </button>
);

export const SecondaryButton = ({ loading, children, className = "", disabled, ...props }) => (
    <button
        disabled={disabled || loading}
        className={`h-10 inline-flex items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold border border-black/10 bg-white text-[#0A2540] hover:bg-[#f6f9fc] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
        {...props}
    >
        {loading && <Loader2 size={15} className="animate-spin" />}
        {children}
    </button>
);

export const Alert = ({ type = "error", children }) => {
    if (!children) return null;
    const isError = type === "error";
    return (
        <div
            role={isError ? "alert" : "status"}
            className={`flex items-start gap-2.5 rounded-xl px-3.5 py-3 text-sm leading-relaxed ${
                isError ? "bg-red-50 text-red-700 border border-red-100" : "bg-emerald-50 text-emerald-800 border border-emerald-100"
            }`}
        >
            {isError ? <AlertCircle size={17} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={17} className="mt-0.5 shrink-0" />}
            <div className="min-w-0 break-words">{children}</div>
        </div>
    );
};

export const Divider = ({ children = "or" }) => (
    <div className="flex items-center gap-3 my-6 text-xs uppercase tracking-wider text-[#8898aa]">
        <span className="h-px flex-1 bg-black/[0.08]" />
        {children}
        <span className="h-px flex-1 bg-black/[0.08]" />
    </div>
);

export const GoogleIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
);

export const GoogleButton = ({ loading, children = "Continue with Google", ...props }) => (
    <button
        type="button"
        disabled={loading}
        className="w-full h-11 inline-flex items-center justify-center gap-2.5 rounded-xl border border-black/10 bg-white text-sm font-semibold text-[#0A2540] hover:bg-[#f6f9fc] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        {...props}
    >
        {loading ? <Loader2 size={17} className="animate-spin" /> : <GoogleIcon />}
        {children}
    </button>
);

/* ---------- Avatar ---------- */

const initialsOf = (name, email) => {
    const source = (name || email || "?").trim();
    const parts = source.split(/\s+/).filter(Boolean);
    const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : source.slice(0, 2);
    return letters.toUpperCase();
};

export const Avatar = ({ src: rawSrc, name, email, size = 40, className = "" }) => {
    const [failedSrc, setFailedSrc] = useState(null);
    // Cloudinary avatars get a right-sized WebP/AVIF; Google photos are used as-is.
    const src = rawSrc ? cloudinaryImage(rawSrc, { width: Math.min(512, size * 2) }) : null;
    const showImage = src && failedSrc !== src;
    return (
        <span
            className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden bg-linear-to-br from-[#48A2FF] to-[#C9E4FF] text-[#0A2540] font-bold select-none ${className}`}
            style={{ width: size, height: size, fontSize: Math.max(11, Math.round(size * 0.36)) }}
        >
            {showImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={src}
                    alt=""
                    referrerPolicy="no-referrer"
                    onError={() => setFailedSrc(src)}
                    className="w-full h-full object-cover"
                />
            ) : (
                initialsOf(name, email)
            )}
        </span>
    );
};
