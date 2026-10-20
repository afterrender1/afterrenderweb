import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import ColorPalette from "@/app/models/ColorPalette";
import { ADMIN_COOKIE, isValidSessionToken } from "@/app/lib/adminAuth";
import { parseAnnouncementStyle } from "@/app/lib/announcementStyle";

const MAX_PALETTES = 50;

const unauthorized = () => NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

export async function GET(req) {
    if (!isValidSessionToken(req.cookies.get(ADMIN_COOKIE)?.value)) return unauthorized();

    try {
        await dbConnect();
        const palettes = await ColorPalette.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, palettes });
    } catch (err) {
        console.error("Error in GET /api/palettes:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function POST(req) {
    if (!isValidSessionToken(req.cookies.get(ADMIN_COOKIE)?.value)) return unauthorized();

    try {
        const body = (await req.json().catch(() => null)) || {};
        const name = String(body.name ?? "").trim();
        if (!name) return NextResponse.json({ success: false, error: "Palette name is required" }, { status: 400 });
        if (name.length > 40) {
            return NextResponse.json({ success: false, error: "Palette name must be 40 characters or less" }, { status: 400 });
        }

        const { style, error } = parseAnnouncementStyle(body.style);
        if (error) return NextResponse.json({ success: false, error }, { status: 400 });

        await dbConnect();
        if ((await ColorPalette.countDocuments()) >= MAX_PALETTES) {
            return NextResponse.json(
                { success: false, error: `You can save up to ${MAX_PALETTES} palettes — delete one first` },
                { status: 400 }
            );
        }

        const palette = await ColorPalette.create({ name, style });
        return NextResponse.json({ success: true, palette }, { status: 201 });
    } catch (err) {
        console.error("Error in POST /api/palettes:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
