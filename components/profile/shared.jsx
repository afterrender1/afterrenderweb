"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Loader2, MoreVertical } from "lucide-react";
import { Playfair_Display, Plus_Jakarta_Sans } from "@/app/lib/fonts";

gsap.registerPlugin(useGSAP);

const playfair = Playfair_Display({ subsets: ["latin"], style: ["italic"], weight: ["400"] });
// Same typeface as the pricing / about pages.
export const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const reduceMotion = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// UTC so the server-rendered and browser-rendered text always match (no hydration mismatch).
export const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(date);
};

// Local time, only for data fetched in the browser (e.g. the devices list).
export const formatDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    // Skip the year when it's this year, so the line stays short on phones.
    const sameYear = date.getFullYear() === new Date().getFullYear();
    return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        ...(sameYear ? {} : { year: "numeric" }),
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
};

/* ---------- Layout ---------- */

// Same heading style as the rest of the site: heavy sans + one italic serif word.
export const PageHeader = ({ title, accent, description }) => (
    <header data-reveal className="mb-7 sm:mb-8">
        <h1 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-gray-950 sm:text-4xl">
            {title} <span className={`${playfair.className} font-normal italic text-gray-900`}>{accent}</span>
        </h1>
        {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}
    </header>
);

export const Section = ({ title, description, children, footer }) => (
    <section data-reveal>
        {title && (
            <div className="mb-3 px-1">
                <h2 className="text-sm font-bold tracking-tight text-gray-950">{title}</h2>
                {description && <p className="mt-0.5 text-[13px] text-gray-500">{description}</p>}
            </div>
        )}
        <div className="rounded-2xl border border-gray-200/90 bg-white shadow-2xs">
            <div className="divide-y divide-gray-100">{children}</div>
            {footer && <div className="rounded-b-2xl border-t border-gray-100 px-5 py-3 sm:px-6">{footer}</div>}
        </div>
    </section>
);

// One "label | value | action" line. The label stacks above on phones; the action stays on the right.
// `top` aligns the label with the first line of a tall value (an inline form).
export const Row = ({ label, children, action, below, top = false }) => (
    <div className="px-5 py-4 sm:px-6">
        <div className={`flex flex-col gap-1 sm:flex-row sm:gap-6 ${top ? "sm:items-start" : "sm:items-center"}`}>
            <div className={`text-[13px] font-medium text-gray-500 sm:w-36 sm:shrink-0 ${top ? "sm:pt-0.5" : ""}`}>{label}</div>
            <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="min-w-0 flex-1 break-words text-sm font-medium text-gray-900">{children}</div>
                {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
            </div>
        </div>
        {below && <div className="mt-3 sm:pl-42">{below}</div>}
    </div>
);

/* ---------- Controls ---------- */

const buttonBase =
    "inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48A2FF]/50 disabled:pointer-events-none disabled:opacity-50";

const variants = {
    primary: "bg-gray-950 text-white hover:bg-gray-800",
    outline: "border border-gray-300/90 bg-white text-gray-900 hover:bg-gray-50",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-950",
    destructive: "bg-red-600 text-white hover:bg-red-700",
};

export const Button = ({ variant = "outline", loading, disabled, className = "", children, type = "button", ...props }) => (
    <button type={type} className={`${buttonBase} ${variants[variant]} ${className}`} disabled={disabled || loading} {...props}>
        {loading && <Loader2 size={14} className="animate-spin" />}
        {children}
    </button>
);

export const Input = ({ className = "", ...props }) => (
    <input
        className={`h-10 w-full rounded-xl border border-gray-300/90 bg-white px-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#48A2FF] focus:ring-4 focus:ring-[#48A2FF]/15 ${className}`}
        {...props}
    />
);

export const Label = ({ children, htmlFor }) => (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-medium text-gray-700">
        {children}
    </label>
);

export const Message = ({ type = "error", children }) =>
    children ? (
        <p role={type === "error" ? "alert" : "status"} className={`text-[13px] ${type === "error" ? "text-red-600" : "text-emerald-600"}`}>
            {children}
        </p>
    ) : null;

export const Spinner = ({ label = "Loading…" }) => (
    <span className="inline-flex items-center gap-2 text-[13px] text-gray-500">
        <Loader2 size={14} className="animate-spin" /> {label}
    </span>
);

// Slides its content open when it appears (inline forms).
export const Expand = ({ children }) => {
    const ref = useRef(null);
    useGSAP(() => {
        if (reduceMotion()) return;
        gsap.set(ref.current, { overflow: "hidden" });
        gsap.from(ref.current, {
            height: 0,
            opacity: 0,
            duration: 0.35,
            ease: "power3.out",
            clearProps: "height,opacity,overflow",
        });
    });
    return <div ref={ref}>{children}</div>;
};

/* ---------- Confirm dialog ---------- */

const ConfirmDialog = ({ title, description, confirmLabel = "Confirm", destructive = false, loading, error, closing, onConfirm, onCancel, onClosed }) => {
    const titleId = useId();
    const descId = useId();
    const root = useRef(null);
    const panel = useRef(null);
    const cancelRef = useRef(null);
    // Latest props for listeners / animation callbacks.
    const latest = useRef({ loading, onCancel, onClosed });
    useEffect(() => {
        latest.current = { loading, onCancel, onClosed };
    });

    // Focus, Esc to close, and keep Tab inside the dialog.
    useEffect(() => {
        const previouslyFocused = document.activeElement;
        cancelRef.current?.focus();
        const onKey = (e) => {
            if (e.key === "Escape" && !latest.current.loading) return latest.current.onCancel();
            if (e.key !== "Tab") return;
            const focusable = panel.current?.querySelectorAll("button:not([disabled])");
            if (!focusable?.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("keydown", onKey);
            if (previouslyFocused?.isConnected) previouslyFocused.focus?.();
        };
    }, []);

    // In
    useGSAP(
        () => {
            if (reduceMotion()) return;
            gsap.fromTo("[data-backdrop]", { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "none" });
            gsap.fromTo("[data-panel]", { opacity: 0, y: 16, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: "power3.out" });
        },
        { scope: root }
    );

    // Out, then tell the owner to unmount us
    useGSAP(
        () => {
            if (!closing) return;
            if (reduceMotion()) return latest.current.onClosed();
            gsap.to("[data-backdrop]", { opacity: 0, duration: 0.16, ease: "none", overwrite: true });
            gsap.to("[data-panel]", {
                opacity: 0,
                y: 8,
                scale: 0.98,
                duration: 0.16,
                ease: "power2.in",
                overwrite: true,
                onComplete: () => latest.current.onClosed(),
            });
        },
        { dependencies: [closing], scope: root }
    );

    return createPortal(
        <div ref={root} className={`${jakarta.className} fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center`}>
            <div data-backdrop className="absolute inset-0 bg-gray-950/45" onClick={() => !loading && onCancel()} aria-hidden="true" />
            <div
                ref={panel}
                data-panel
                role="alertdialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={description ? descId : undefined}
                className="relative w-full max-w-sm rounded-2xl border border-gray-200/90 bg-white p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] will-change-transform"
            >
                <h2 id={titleId} className="text-lg font-extrabold tracking-tight text-gray-950">
                    {title}
                </h2>
                {description && (
                    <p id={descId} className="mt-1.5 text-sm leading-relaxed text-gray-500">
                        {description}
                    </p>
                )}
                {error && (
                    <p role="alert" className="mt-3 text-[13px] text-red-600">
                        {error}
                    </p>
                )}
                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button ref={cancelRef} onClick={onCancel} disabled={loading} className="h-10 sm:h-9">
                        Cancel
                    </Button>
                    <Button variant={destructive ? "destructive" : "primary"} onClick={onConfirm} loading={loading} className="h-10 sm:h-9">
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// "Are you sure?" before an important action:
//   const { ask, dialog } = useConfirm();   ask({ title, description, confirmLabel, destructive, action })
// `action` returns an error message (string) to keep the dialog open, or nothing to close it.
export const useConfirm = () => {
    const [state, setState] = useState(null);
    const [closing, setClosing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const counter = useRef(0);

    const ask = (config) => {
        counter.current += 1;
        setError("");
        setClosing(false);
        setState({ ...config, id: counter.current });
    };

    const cancel = () => {
        if (!loading) setClosing(true);
    };

    const confirm = async () => {
        if (!state || loading || closing) return;
        setLoading(true);
        setError("");
        try {
            const result = await state.action();
            if (typeof result === "string" && result) setError(result);
            else setClosing(true);
        } catch (err) {
            setError(err?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const dialog = state ? (
        <ConfirmDialog
            key={state.id}
            title={state.title}
            description={state.description}
            confirmLabel={state.confirmLabel}
            destructive={state.destructive}
            loading={loading}
            error={error}
            closing={closing}
            onConfirm={confirm}
            onCancel={cancel}
            onClosed={() => {
                setState(null);
                setClosing(false);
                setError("");
            }}
        />
    ) : null;

    return { ask, dialog, busy: loading };
};

/* ---------- Three-dots menu ---------- */

const MenuPanel = ({ id, items, onPick }) => {
    const ref = useRef(null);
    useGSAP(() => {
        if (reduceMotion()) return;
        gsap.fromTo(
            ref.current,
            { opacity: 0, y: -6, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "power3.out", transformOrigin: "top right" }
        );
    });
    return (
        <div
            ref={ref}
            id={id}
            role="menu"
            className="absolute right-0 top-full z-30 mt-1.5 min-w-44 rounded-xl border border-gray-200/90 bg-white p-1 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18)]"
        >
            {items.map((item) => (
                <button
                    key={item.label}
                    type="button"
                    role="menuitem"
                    onClick={() => onPick(item)}
                    className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors ${
                        item.destructive ? "text-red-600 hover:bg-red-50" : "text-gray-800 hover:bg-gray-100"
                    }`}
                >
                    {item.icon && <item.icon size={15} />}
                    {item.label}
                </button>
            ))}
        </div>
    );
};

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
                className={`inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48A2FF]/50 disabled:pointer-events-none disabled:opacity-50 ${
                    open ? "bg-gray-100 text-gray-950" : "text-gray-500 hover:bg-gray-100 hover:text-gray-950"
                }`}
            >
                <MoreVertical size={17} />
            </button>
            {open && (
                <MenuPanel
                    id={menuId}
                    items={items.filter(Boolean)}
                    onPick={(item) => {
                        setOpen(false);
                        item.onSelect();
                    }}
                />
            )}
        </div>
    );
};
