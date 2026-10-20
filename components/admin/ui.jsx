"use client";
import React, { useEffect } from "react";
import { X } from "lucide-react";

export const inputClass =
    "w-full h-11 bg-white border border-neutral-300 rounded-lg px-3.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none hover:border-neutral-400 focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition";

export const labelClass = "block text-[13px] font-medium text-neutral-700 mb-1.5";

export const primaryBtn =
    "inline-flex items-center justify-center gap-2 h-10 px-5 rounded-full text-sm font-medium bg-[#1a73e8] text-white hover:bg-[#1765cc] hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer";

export const ghostBtn =
    "inline-flex items-center justify-center gap-2 h-10 px-5 rounded-full text-sm font-medium text-[#1a73e8] hover:bg-[#1a73e8]/[0.06] transition cursor-pointer";

/* ---------- Snackbar ---------- */
export const Snackbar = ({ toast, onClose }) => {
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [toast, onClose]);

    if (!toast) return null;
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-[60] flex items-center gap-4 pl-4 pr-2 py-2.5 rounded-lg bg-neutral-900 text-white text-sm shadow-lg">
            <span className={toast.type === "error" ? "text-red-300" : ""}>{toast.message}</span>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 cursor-pointer" aria-label="Dismiss">
                <X size={14} />
            </button>
        </div>
    );
};

/* ---------- Modal shell: blurred backdrop + page scroll lock ---------- */
export const Modal = ({ onClose, children, className = "" }) => {
    useEffect(() => {
        const { body, documentElement } = document;
        const prevOverflow = body.style.overflow;
        const prevPadding = body.style.paddingRight;
        // Keep layout from jumping when the scrollbar disappears
        const scrollbar = window.innerWidth - documentElement.clientWidth;
        body.style.overflow = "hidden";
        if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => {
            body.style.overflow = prevOverflow;
            body.style.paddingRight = prevPadding;
            window.removeEventListener("keydown", onKey);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6">
            <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-md" onClick={onClose} />
            <div className={`relative ${className}`}>{children}</div>
        </div>
    );
};


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

