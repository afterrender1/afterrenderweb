"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2, MoreVertical } from "lucide-react";

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
            {/* Value + action share one line on every screen size (action on the right). */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="min-w-0 flex-1 text-sm text-zinc-900 break-words">{children}</div>
                {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
            </div>
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
    destructive: "bg-red-600 text-white hover:bg-red-700",
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

/* ---------- Confirm dialog ---------- */

// Small modal asking "are you sure?" before an important action.
// Closes on Esc / backdrop click (unless the action is running).
export const ConfirmDialog = ({
    open,
    title,
    description,
    confirmLabel = "Confirm",
    destructive = false,
    loading = false,
    error = "",
    onConfirm,
    onCancel,
}) => {
    const titleId = useId();
    const descId = useId();
    const cancelRef = useRef(null);
    // Latest values for the Esc handler without re-running the open/close effect.
    const latest = useRef({ loading, onCancel });
    useEffect(() => {
        latest.current = { loading, onCancel };
    });

    useEffect(() => {
        if (!open) return;
        const previouslyFocused = document.activeElement;
        cancelRef.current?.focus();
        const onKey = (e) => {
            if (e.key === "Escape" && !latest.current.loading) latest.current.onCancel();
        };
        const { overflow } = document.body.style;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = overflow;
            if (previouslyFocused?.isConnected) previouslyFocused.focus?.();
        };
    }, [open]);

    if (!open || typeof document === "undefined") return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => !loading && onCancel()} aria-hidden="true" />
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={description ? descId : undefined}
                className="relative w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-5 shadow-xl sm:p-6"
            >
                <h2 id={titleId} className="text-base font-semibold text-zinc-900">
                    {title}
                </h2>
                {description && (
                    <p id={descId} className="mt-1.5 text-sm leading-relaxed text-zinc-500">
                        {description}
                    </p>
                )}
                {error && (
                    <p role="alert" className="mt-3 text-sm text-red-600">
                        {error}
                    </p>
                )}
                <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button ref={cancelRef} onClick={onCancel} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        variant={destructive ? "destructive" : "primary"}
                        onClick={onConfirm}
                        loading={loading}
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// Convenience state for a ConfirmDialog: open(config) -> run the action on confirm.
export const useConfirm = () => {
    const [state, setState] = useState(null); // { title, description, confirmLabel, destructive, action }
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const ask = (config) => {
        setError("");
        setState(config);
    };
    const close = () => {
        if (loading) return;
        setState(null);
        setError("");
    };
    const confirm = async () => {
        if (!state) return;
        setLoading(true);
        setError("");
        try {
            // The action returns an error message string to keep the dialog open, or nothing to close it.
            const result = await state.action();
            if (typeof result === "string" && result) {
                setError(result);
            } else {
                setState(null);
            }
        } catch (err) {
            setError(err?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const dialog = (
        <ConfirmDialog
            open={Boolean(state)}
            title={state?.title}
            description={state?.description}
            confirmLabel={state?.confirmLabel}
            destructive={state?.destructive}
            loading={loading}
            error={error}
            onConfirm={confirm}
            onCancel={close}
        />
    );

    return { ask, dialog, busy: loading };
};

/* ---------- Three-dots menu ---------- */

export const DotsMenu = ({ label = "More options", items, disabled = false }) => {
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);
    const menuId = useId();

    useEffect(() => {
        if (!open) return;
        const onDown = (e) => {
            if (!rootRef.current?.contains(e.target)) setOpen(false);
        };
        const onKey = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("pointerdown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("pointerdown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const visible = items.filter(Boolean);

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                aria-label={label}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls={open ? menuId : undefined}
                disabled={disabled}
                onClick={() => setOpen((v) => !v)}
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:pointer-events-none disabled:opacity-50"
            >
                <MoreVertical size={17} />
            </button>
            {open && (
                <div
                    id={menuId}
                    role="menu"
                    className="absolute right-0 z-20 mt-1 min-w-40 overflow-hidden rounded-lg border border-zinc-200 bg-white p-1 shadow-lg"
                >
                    {visible.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                setOpen(false);
                                item.onSelect();
                            }}
                            className={`flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors ${
                                item.destructive ? "text-red-600 hover:bg-red-50" : "text-zinc-700 hover:bg-zinc-100"
                            }`}
                        >
                            {item.icon && <item.icon size={15} />}
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export const Spinner = ({ label = "Loading…" }) => (
    <span className="inline-flex items-center gap-2 text-sm text-zinc-500">
        <Loader2 size={14} className="animate-spin" /> {label}
    </span>
);
