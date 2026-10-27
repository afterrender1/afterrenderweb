"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Video, PartyPopper, Globe, Lock, Menu, X } from "lucide-react";
import AdminLogin from "./AdminLogin";
import { Skeleton } from "./ui";

const NAV_ITEMS = [
    { label: "Blogs", href: "/admin", icon: FileText },
    { label: "Video Reviews", href: "/admin/video-reviews", icon: Video },
    { label: "Events", href: "/admin/events", icon: PartyPopper },
    { label: "Portfolio", href: "/admin/portfolio", icon: Globe },
];

// /admin only matches exactly; nested pages match by prefix
const isActive = (pathname, href) => (href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

const Brand = ({ compact = false }) => (
    <div className="flex items-center gap-2.5 min-w-0">
        <div className="size-8 shrink-0 rounded-md bg-stone-900 text-stone-50 grid place-items-center text-sm font-semibold">A</div>
        <div className={`leading-tight min-w-0 ${compact ? "hidden lg:block" : ""}`}>
            <p className="text-sm font-semibold text-stone-900 truncate">AfterRender</p>
            <p className="text-[11px] text-stone-500">Admin</p>
        </div>
    </div>
);

// icon-only on the md rail, labelled on lg+ and inside the mobile drawer
const NavLinks = ({ pathname, onNavigate, rail = false }) => (
    <nav className="flex flex-col gap-1" aria-label="Admin">
        <p className={`px-2.5 pb-1 text-[11px] font-medium uppercase tracking-wider text-stone-400 ${rail ? "hidden lg:block" : ""}`}>Content</p>
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
                <Link
                    key={href}
                    href={href}
                    onClick={onNavigate}
                    title={label}
                    aria-label={label}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2.5 h-10 md:h-9 px-2.5 rounded-md text-sm border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20 ${
                        rail ? "md:justify-center lg:justify-start" : ""
                    } ${
                        active
                            ? "bg-white border-stone-200 shadow-xs text-stone-900 font-medium"
                            : "border-transparent text-stone-600 hover:bg-stone-100"
                    }`}
                >
                    <Icon size={16} className="shrink-0" />
                    <span className={rail ? "hidden lg:inline truncate" : "truncate"}>{label}</span>
                </Link>
            );
        })}
    </nav>
);

const LockButton = ({ onClick, rail = false }) => (
    <button
        onClick={onClick}
        title="Lock Studio"
        aria-label="Lock Studio"
        className={`flex items-center gap-2.5 w-full h-10 md:h-9 px-2.5 rounded-md text-sm text-stone-600 hover:bg-stone-100 hover:text-red-600 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20 ${
            rail ? "md:justify-center lg:justify-start" : ""
        }`}
    >
        <Lock size={16} className="shrink-0" />
        <span className={rail ? "hidden lg:inline" : ""}>Lock Studio</span>
    </button>
);

const ShellSkeleton = () => (
    <div className="min-h-dvh bg-stone-50 md:flex">
        <div className="hidden md:block md:w-16 lg:w-60 border-r border-stone-200 p-3 space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
        </div>
        <div className="flex-1 p-4 sm:p-6 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-40 w-full" />
        </div>
    </div>
);

const AdminShell = ({ children }) => {
    const pathname = usePathname();
    // null = still checking the session
    const [authenticated, setAuthenticated] = useState(null);
    // remembers which path the drawer was opened on, so it closes itself on navigation
    const [drawerPath, setDrawerPath] = useState(null);
    const drawerOpen = drawerPath === pathname;

    useEffect(() => {
        fetch("/api/admin/session")
            .then((res) => res.json())
            .then((data) => setAuthenticated(Boolean(data.authenticated)))
            .catch(() => setAuthenticated(false));
    }, []);

    // Scroll lock + Escape while the mobile drawer is open
    useEffect(() => {
        if (!drawerOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e) => e.key === "Escape" && setDrawerPath(null);
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [drawerOpen]);

    const handleLogout = async () => {
        await fetch("/api/admin/login", { method: "DELETE" });
        setAuthenticated(false);
    };

    if (authenticated === null) return <ShellSkeleton />;

    if (!authenticated) {
        return <AdminLogin onSuccess={() => setAuthenticated(true)} />;
    }

    const current = NAV_ITEMS.find((item) => isActive(pathname, item.href));

    return (
        <div className="min-h-dvh bg-stone-50 md:flex overflow-x-clip">
            {/* md+: icon rail, lg+: full sidebar */}
            <aside className="hidden md:flex md:flex-col md:w-16 lg:w-60 shrink-0 h-dvh sticky top-0 bg-stone-50 border-r border-stone-200 p-3 lg:p-4">
                <div className="pb-5 md:flex md:justify-center lg:block lg:px-1">
                    <Brand compact />
                </div>
                <NavLinks pathname={pathname} rail />
                <div className="mt-auto">
                    <LockButton onClick={handleLogout} rail />
                </div>
            </aside>

            {/* Mobile top bar */}
            <header className="md:hidden sticky top-0 z-30 h-14 flex items-center gap-3 px-4 bg-white/90 backdrop-blur border-b border-stone-200">
                <Brand />
                <p className="flex-1 min-w-0 text-sm font-medium text-stone-600 truncate text-right">{current?.label}</p>
                <button
                    onClick={() => setDrawerPath(pathname)}
                    className="size-10 -mr-2 grid place-items-center rounded-md text-stone-700 hover:bg-stone-100 cursor-pointer"
                    aria-label="Open menu"
                    title="Open menu"
                    aria-expanded={drawerOpen}
                >
                    <Menu size={20} />
                </button>
            </header>

            {/* Mobile drawer */}
            {drawerOpen && (
                <div className="md:hidden fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Menu">
                    <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm" onClick={() => setDrawerPath(null)} />
                    <div className="relative flex flex-col w-72 max-w-[85vw] h-full bg-stone-50 border-r border-stone-200 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                        <div className="flex items-center justify-between pb-5">
                            <Brand />
                            <button
                                autoFocus
                                onClick={() => setDrawerPath(null)}
                                className="size-9 -mr-2 grid place-items-center rounded-md text-stone-500 hover:bg-stone-100 cursor-pointer"
                                aria-label="Close menu"
                                title="Close menu"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <NavLinks pathname={pathname} onNavigate={() => setDrawerPath(null)} />
                        <div className="mt-auto">
                            <LockButton onClick={handleLogout} />
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-1 min-w-0">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-5 sm:py-8">{children}</div>
            </main>
        </div>
    );
};

export default AdminShell;
