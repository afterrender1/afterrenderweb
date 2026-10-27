"use client";
import React, { useEffect } from "react";
import { X, Inbox } from "lucide-react";

/* ---------- Design tokens: stone palette, compact controls ----------
   text-base on mobile keeps iOS from zooming on focus; sm+ goes compact. */
export const inputClass =
    "h-10 sm:h-9 w-full min-w-0 rounded-md border border-stone-200 bg-white px-3 text-base sm:text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-colors hover:border-stone-300 focus:border-stone-400 focus:ring-2 focus:ring-stone-900/10 disabled:opacity-50";

export const textareaClass = inputClass.replace("h-10 sm:h-9", "min-h-[96px] h-auto py-2 resize-y leading-relaxed");

export const selectClass = `${inputClass} appearance-none pr-8 cursor-pointer bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%2378716c' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-[length:16px] bg-[right_0.6rem_center] bg-no-repeat`;

export const labelClass = "block text-[13px] font-medium text-stone-700 mb-1.5";

const btnBase =
    "inline-flex items-center justify-center gap-2 h-10 sm:h-9 px-3.5 rounded-md text-sm font-medium whitespace-nowrap shrink-0 transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20 cursor-pointer";

export const primaryBtn = `${btnBase} bg-stone-900 text-stone-50 hover:bg-stone-800`;
export const secondaryBtn = `${btnBase} bg-white border border-stone-200 text-stone-900 hover:bg-stone-50`;
export const ghostBtn = `${btnBase} text-stone-700 hover:bg-stone-100`;
export const dangerBtn = `${btnBase} bg-white border border-stone-200 text-red-600 hover:bg-red-50 hover:border-red-200`;
export const iconBtn =
    "size-9 shrink-0 grid place-items-center rounded-md text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20 cursor-pointer";
export const iconBtnDanger = iconBtn.replace("hover:bg-stone-100 hover:text-stone-900", "hover:bg-red-50 hover:text-red-600");

/* ---------- Small building blocks ---------- */
export const Card = ({ className = "", children }) => (
    <div className={`bg-white border border-stone-200 rounded-lg shadow-xs ${className}`}>{children}</div>
);

const BADGE = {
    default: "bg-stone-900 text-stone-50",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    muted: "bg-stone-100 text-stone-600",
};

export const Badge = ({ variant = "muted", className = "", children }) => (
    <span className={`inline-flex items-center gap-1.5 h-5 px-2 rounded-md text-[11px] font-medium whitespace-nowrap ${BADGE[variant]} ${className}`}>
        {children}
    </span>
);

export const PageHeader = ({ title, description, actions }) => (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between pb-5 mb-5 border-b border-stone-200">
        <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 break-words">{title}</h1>
            {description && <p className="text-sm text-stone-500 mt-1 break-words">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2 [&>*]:flex-1 sm:[&>*]:flex-none">{actions}</div>}
    </div>
);

export const EmptyState = ({ icon: Icon = Inbox, title, description, action }) => (
    <div className="flex flex-col items-center text-center px-4 py-14 sm:py-16 border border-dashed border-stone-300 rounded-lg bg-white">
        <div className="size-11 rounded-lg bg-stone-100 text-stone-600 grid place-items-center mb-4">
            <Icon size={20} />
        </div>
        <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
        {description && <p className="text-sm text-stone-500 mt-1 mb-5 max-w-sm break-words">{description}</p>}
        {action}
    </div>
);

export const Skeleton = ({ className = "" }) => <div className={`animate-pulse rounded-md bg-stone-200/70 ${className}`} />;

/* ---------- Snackbar ---------- */
export const Snackbar = ({ toast, onClose }) => {
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [toast, onClose]);

    if (!toast) return null;
    return (
        <div
            role="status"
            className="fixed inset-x-4 sm:inset-x-auto sm:right-6 sm:max-w-sm z-[70] bottom-[max(1rem,env(safe-area-inset-bottom))] sm:bottom-6 flex items-start gap-3 pl-4 pr-2 py-2.5 rounded-lg bg-stone-900 text-stone-50 text-sm shadow-xl"
        >
            <span className={`flex-1 min-w-0 break-words py-1 ${toast.type === "error" ? "text-red-300" : ""}`}>{toast.message}</span>
            <button onClick={onClose} className="p-1.5 rounded-md hover:bg-white/10 cursor-pointer shrink-0" aria-label="Dismiss" title="Dismiss">
                <X size={14} />
            </button>
        </div>
    );
};

/* ---------- Modal: bottom sheet on phones, centered dialog on sm+ ----------
   `className` sizes the dialog (e.g. "sm:max-w-3xl"); put modalPanel on the child. */
export const modalPanel =
    "w-full max-h-[92dvh] sm:max-h-[88dvh] flex flex-col overflow-hidden bg-white rounded-t-xl sm:rounded-xl shadow-xl pb-[env(safe-area-inset-bottom)] sm:pb-0";

// Ref-counted page scroll lock, so stacked dialogs/drawers can never leave the page stuck unscrollable
let lockCount = 0;
let savedBody = null;
export const lockPageScroll = () => {
    const { body, documentElement } = document;
    if (lockCount++ === 0) {
        savedBody = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
        // Keep layout from jumping when the scrollbar disappears
        const scrollbar = window.innerWidth - documentElement.clientWidth;
        body.style.overflow = "hidden";
        if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    }
    return () => {
        if (--lockCount === 0 && savedBody) {
            body.style.overflow = savedBody.overflow;
            body.style.paddingRight = savedBody.paddingRight;
            savedBody = null;
        }
    };
};

export const Modal = ({ onClose, children, className = "" }) => {
    useEffect(() => {
        const unlock = lockPageScroll();
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => {
            unlock();
            window.removeEventListener("keydown", onKey);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-full min-w-0 ${className}`}>{children}</div>
        </div>
    );
};

export const ModalHeader = ({ title, onClose, disabled = false, children }) => (
    <div className="flex items-center gap-3 px-4 sm:px-6 h-14 border-b border-stone-200 shrink-0">
        <h2 className="flex-1 min-w-0 text-base font-semibold text-stone-900 truncate" title={typeof title === "string" ? title : undefined}>
            {title}
        </h2>
        {children}
        <button type="button" onClick={onClose} disabled={disabled} className={`${iconBtn} -mr-2`} aria-label="Close" title="Close">
            <X size={18} />
        </button>
    </div>
);

export const ModalBody = ({ className = "", children }) => (
    <div className={`flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-6 py-5 ${className}`}>{children}</div>
);

export const ModalFooter = ({ children }) => (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end px-4 sm:px-6 py-3 border-t border-stone-200 bg-white shrink-0 [&>button]:w-full sm:[&>button]:w-auto">
        {children}
    </div>
);

export const friendlyError = (err, fallback = "Something went wrong.") => {
    if (err?.message === "Failed to fetch") return "Network error — check your connection.";
    return err?.message || fallback;
};

// fetch wrapper: always resolves to parsed JSON or throws a readable Error
export const api = async (url, options = {}) => {
    const res = await fetch(url, {
        ...options,
        headers: options.body ? { "Content-Type": "application/json" } : undefined,
    });
    const data = await res.json().catch(() => null);
    if (res.status === 401) throw new Error("Session expired — please log in again.");
    if (!res.ok || !data?.success) throw new Error(data?.error || `Request failed (${res.status})`);
    return data;
};
