"use client";

import React from "react";
import Link from "next/link";
import { LogIn, UserRound } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { Avatar } from "@/components/auth/ui";

// Login button / profile avatar for the Navbar.
// `isLight` = page has a light background (dark text).
export default function NavbarAuth({ variant = "desktop", isLight = false, onNavigate }) {
    const { data, isPending } = authClient.useSession();
    const user = data?.user;

    if (variant === "mobile") {
        if (isPending) return <div className="h-12 rounded-lg bg-white/5" aria-hidden="true" />;
        if (user) {
            return (
                <Link
                    href="/profile"
                    onClick={onNavigate}
                    className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 hover:bg-white/10 transition-colors"
                >
                    <Avatar src={user.image} name={user.name} email={user.email} size={36} />
                    <span className="min-w-0">
                        <span className="block text-sm font-semibold text-white truncate">{user.name}</span>
                        <span className="block text-xs text-gray-300">View my profile</span>
                    </span>
                </Link>
            );
        }
        return (
            <div className="grid grid-cols-2 gap-2.5">
                <Link
                    href="/login"
                    onClick={onNavigate}
                    className="flex items-center justify-center gap-2 text-sm font-semibold px-4 py-3 rounded-lg border border-white/25 text-white hover:bg-white/10 transition-colors"
                >
                    <LogIn size={16} /> Log in
                </Link>
                <Link
                    href="/signup"
                    onClick={onNavigate}
                    className="flex items-center justify-center text-sm font-semibold px-4 py-3 rounded-lg bg-white text-[#0A2540] hover:bg-gray-100 transition-colors"
                >
                    Sign up
                </Link>
            </div>
        );
    }

    // Desktop
    if (isPending) {
        return <span className="inline-block w-[84px] h-9" aria-hidden="true" />;
    }

    if (user) {
        return (
            <Link
                href="/profile"
                aria-label="My profile"
                title="My profile"
                className={`flex items-center gap-2 rounded-full pl-1 pr-3 py-1 border transition-colors ${
                    isLight ? "border-black/10 hover:bg-black/5 text-black" : "border-white/20 hover:bg-white/10 text-white"
                }`}
            >
                <Avatar src={user.image} name={user.name} email={user.email} size={30} />
                <span className="text-sm font-semibold max-w-[110px] truncate">{user.name?.split(" ")[0] || "Profile"}</span>
            </Link>
        );
    }

    return (
        <Link
            href="/login"
            className={`inline-flex items-center gap-1.5 text-xs lg:text-sm font-semibold px-4 py-2.5 rounded-lg border transition-colors ${
                isLight
                    ? "border-black/15 text-black hover:border-[#59B7FF] hover:text-[#59B7FF]"
                    : "border-white/30 text-white hover:border-[#59B7FF] hover:text-[#59B7FF]"
            }`}
        >
            <UserRound size={16} />
            Log in
        </Link>
    );
}
