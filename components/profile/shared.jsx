"use client";

import React from "react";
import { Loader2 } from "lucide-react";

// UTC so the server-rendered and browser-rendered text always match (no hydration mismatch).
export const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" }).format(date);
};

// Local time, only for data fetched in the browser (e.g. sessions list).
export const formatDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
};

/* ---------- Layout ---------- */

export const PageHeader = ({ title, description }) => (
    <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
    </div>
);

export const Section = ({ title, description, children, footer }) => (
    <section className="rounded-xl border border-zinc-200 bg-white">
        {(title || description) && (
            <div className="px-5 pt-5 pb-1 sm:px-6">
                {title && <h2 className="text-base font-semibold text-zinc-900">{title}</h2>}
                {description && <p className="mt-0.5 text-sm text-zinc-500">{description}</p>}
            </div>
        )}
        <div className="divide-y divide-zinc-100">{children}</div>
        {footer && <div className="border-t border-zinc-100 bg-zinc-50/60 px-5 py-3 sm:px-6 rounded-b-xl">{footer}</div>}
    </section>
);

// One "label | value | action" line, Google-account style. Stacks on mobile.
export const Row = ({ label, children, action, below }) => (
    <div className="px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-6">
            <div className="text-sm text-zinc-500 sm:w-40 sm:shrink-0">{label}</div>
            <div className="min-w-0 flex-1 text-sm text-zinc-900 break-words">{children}</div>
            {action && <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">{action}</div>}
        </div>
        {below && <div className="mt-3 sm:ml-46">{below}</div>}
    </div>
);

/* ---------- Controls ---------- */

const buttonBase =
    "inline-flex items-center justify-center gap-1.5 h-9 rounded-md px-3.5 text-sm font-medium transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40";

const variants = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-800",
    outline: "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
    ghost: "text-zinc-700 hover:bg-zinc-100",
    danger: "border border-zinc-200 bg-white text-red-600 hover:bg-red-50",
};

export const Button = ({ variant = "outline", loading, disabled, className = "", children, ...props }) => (
    <button className={`${buttonBase} ${variants[variant]} ${className}`} disabled={disabled || loading} {...props}>
        {loading && <Loader2 size={14} className="animate-spin" />}
        {children}
    </button>
);

export const Input = ({ className = "", ...props }) => (
    <input
        className={`h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/20 ${className}`}
        {...props}
    />
);

export const Label = ({ children, htmlFor }) => (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-zinc-700">
        {children}
    </label>
);

export const Badge = ({ tone = "neutral", children }) => {
    const tones = {
        success: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
        warning: "bg-amber-50 text-amber-700 ring-amber-600/15",
        neutral: "bg-zinc-100 text-zinc-600 ring-zinc-500/10",
    };
    return (
        <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone]}`}>
            {children}
        </span>
    );
};

export const Message = ({ type = "error", children }) =>
    children ? (
        <p role={type === "error" ? "alert" : "status"} className={`text-sm ${type === "error" ? "text-red-600" : "text-emerald-600"}`}>
            {children}
        </p>
    ) : null;

export const Spinner = ({ label = "Loading…" }) => (
    <span className="inline-flex items-center gap-2 text-sm text-zinc-500">
        <Loader2 size={14} className="animate-spin" /> {label}
    </span>
);
