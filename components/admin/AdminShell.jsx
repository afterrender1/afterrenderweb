"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Video, Lock } from "lucide-react";
import AdminLogin from "./AdminLogin";

const NAV_ITEMS = [
    { label: "Blogs", href: "/admin", icon: FileText },
    { label: "Video Reviews", href: "/admin/video-reviews", icon: Video },
];

const AdminShell = ({ children }) => {
    const pathname = usePathname();
    // null = still checking the session
    const [authenticated, setAuthenticated] = useState(null);

    useEffect(() => {
        fetch("/api/admin/session")
            .then((res) => res.json())
            .then((data) => setAuthenticated(Boolean(data.authenticated)))
            .catch(() => setAuthenticated(false));
    }, []);

    const handleLogout = async () => {
        await fetch("/api/admin/login", { method: "DELETE" });
        setAuthenticated(false);
    };

    if (authenticated === null) {
        return <div className="min-h-screen bg-neutral-50" />;
    }

    if (!authenticated) {
        return <AdminLogin onSuccess={() => setAuthenticated(true)} />;
    }

    return (
        <div className="min-h-screen bg-neutral-100 md:flex">
            <aside className="md:w-60 md:shrink-0 md:h-screen md:sticky md:top-0 flex md:flex-col gap-2 md:gap-0 items-center md:items-stretch justify-between md:justify-start px-4 py-3 md:p-4 bg-neutral-100 border-b md:border-b-0 border-neutral-200">
                <div className="flex items-center gap-3 md:px-2 md:pb-6">
                    <div className="w-9 h-9 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-semibold">
                        A
                    </div>
                    <div className="hidden md:block leading-tight">
                        <p className="text-sm font-semibold text-neutral-900">AfterRender</p>
                        <p className="text-[11px] text-neutral-500">Admin Panel</p>
                    </div>
                </div>

                <nav className="flex md:flex-col gap-1">
                    <p className="hidden md:block px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                        Content
                    </p>
                    {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                                    active
                                        ? "bg-white text-neutral-900 font-medium shadow-sm"
                                        : "text-neutral-600 hover:bg-white/60"
                                }`}
                            >
                                <Icon size={16} />
                                <span>{label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <button
                    onClick={handleLogout}
                    className="md:mt-auto flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-600 hover:bg-white/60 hover:text-red-600 transition cursor-pointer"
                >
                    <Lock size={16} />
                    <span className="hidden md:inline">Lock Studio</span>
                </button>
            </aside>

            <main className="flex-1 min-w-0 md:p-3">
                <div className="min-h-full bg-white md:rounded-2xl border border-neutral-200 p-5 sm:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminShell;
