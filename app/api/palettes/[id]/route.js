import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/db";
import ColorPalette from "@/app/models/ColorPalette";
import { ADMIN_COOKIE, isValidSessionToken } from "@/app/lib/adminAuth";

const notFound = () => NextResponse.json({ success: false, error: "Palette not found" }, { status: 404 });

export async function DELETE(req, { params }) {
    if (!isValidSessionToken(req.cookies.get(ADMIN_COOKIE)?.value)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        if (!mongoose.isValidObjectId(id)) return notFound();

        await dbConnect();
        const palette = await ColorPalette.findByIdAndDelete(id);
        if (!palette) return notFound();

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Error in DELETE /api/palettes/[id]:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
