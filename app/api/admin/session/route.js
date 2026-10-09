import { NextResponse } from "next/server";
import { ADMIN_COOKIE, isValidSessionToken } from "@/app/lib/adminAuth";

export async function GET(req) {
    const token = req.cookies.get(ADMIN_COOKIE)?.value;
    return NextResponse.json({ authenticated: isValidSessionToken(token) });
}
