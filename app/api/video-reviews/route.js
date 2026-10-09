import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import VideoReview from "@/app/models/VideoReview";
import { ADMIN_COOKIE, isValidSessionToken } from "@/app/lib/adminAuth";

export async function POST(req) {
    if (!isValidSessionToken(req.cookies.get(ADMIN_COOKIE)?.value)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { clientName, role, videoUrl, poster, fit } = await req.json();

        if (!clientName?.trim() || !role?.trim() || !videoUrl?.trim()) {
            return NextResponse.json(
                { success: false, error: "Client name, role and video URL are required" },
                { status: 400 }
            );
        }

        await dbConnect();
        const review = await VideoReview.create({
            clientName,
            role,
            videoUrl,
            poster: poster || "",
            fit: fit === "contain" ? "contain" : "cover",
        });

        return NextResponse.json({ success: true, review }, { status: 201 });
    } catch (err) {
        console.error("Error in POST /api/video-reviews:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        await dbConnect();
        const reviews = await VideoReview.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, reviews });
    } catch (err) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
