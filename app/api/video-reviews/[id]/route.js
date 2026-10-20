import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/db";
import VideoReview from "@/app/models/VideoReview";
import { ADMIN_COOKIE, isValidSessionToken } from "@/app/lib/adminAuth";

const unauthorized = () => NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
const notFound = () => NextResponse.json({ success: false, error: "Video review not found" }, { status: 404 });

export async function PUT(req, { params }) {
    if (!isValidSessionToken(req.cookies.get(ADMIN_COOKIE)?.value)) return unauthorized();

    try {
        const { id } = await params;
        if (!mongoose.isValidObjectId(id)) return notFound();

        const { clientName, role, videoUrl, poster, fit } = await req.json();

        if (!role?.trim() || !videoUrl?.trim()) {
            return NextResponse.json(
                { success: false, error: "Role and video URL are required" },
                { status: 400 }
            );
        }

        await dbConnect();
        const review = await VideoReview.findByIdAndUpdate(
            id,
            {
                clientName: clientName || "",
                role,
                videoUrl,
                poster: poster || "",
                fit: fit === "contain" ? "contain" : "cover",
            },
            { new: true, runValidators: true }
        );
        if (!review) return notFound();

        return NextResponse.json({ success: true, review });
    } catch (err) {
        console.error("Error in PUT /api/video-reviews/[id]:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    if (!isValidSessionToken(req.cookies.get(ADMIN_COOKIE)?.value)) return unauthorized();

    try {
        const { id } = await params;
        if (!mongoose.isValidObjectId(id)) return notFound();

        await dbConnect();
        const review = await VideoReview.findByIdAndDelete(id);
        if (!review) return notFound();

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Error in DELETE /api/video-reviews/[id]:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
