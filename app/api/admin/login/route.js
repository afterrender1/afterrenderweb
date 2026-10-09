import { NextResponse } from "next/server";
import { ADMIN_COOKIE, checkCredentials, createSessionToken } from "@/app/lib/adminAuth";

export async function POST(req) {
    const { email, password } = await req.json().catch(() => ({}));

    if (!email || !password || !checkCredentials(email, password)) {
        return NextResponse.json({ success: false, error: "Access denied" }, { status: 401 });
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set(ADMIN_COOKIE, createSessionToken(), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });
    return res;
}

export async function DELETE() {
    const res = NextResponse.json({ success: true });
    res.cookies.delete(ADMIN_COOKIE);
    return res;
}
