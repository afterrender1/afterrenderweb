import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/db";
import Blog from "@/app/models/Post";
import { ADMIN_COOKIE, isValidSessionToken } from "@/app/lib/adminAuth";

export async function DELETE(req, { params }) {
    if (!isValidSessionToken(req.cookies.get(ADMIN_COOKIE)?.value)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        if (!id || !mongoose.isValidObjectId(id)) {
            return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
        }

        await dbConnect();
        const deletedBlog = await Blog.findByIdAndDelete(id);
        if (!deletedBlog) {
            return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Blog deleted successfully!", deletedBlog }, { status: 200 });
    } catch (error) {
        console.error("Error in DELETE /api/blog/delete-blog/[id]:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
