import { NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinary";
import { ADMIN_COOKIE, isValidSessionToken } from "@/app/lib/adminAuth";

const ALLOWED_FOLDERS = ["events"];

// Signs a direct browser -> Cloudinary upload, so large files skip our server
// and the API secret never leaves it.
export async function POST(req) {
    if (!isValidSessionToken(req.cookies.get(ADMIN_COOKIE)?.value)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
    if (!cloudName || !apiKey || !apiSecret) {
        return NextResponse.json(
            { success: false, error: "Cloudinary is not configured on the server" },
            { status: 500 }
        );
    }

    try {
        const { folder = "events" } = (await req.json().catch(() => null)) || {};
        if (!ALLOWED_FOLDERS.includes(folder)) {
            return NextResponse.json({ success: false, error: "Invalid upload folder" }, { status: 400 });
        }

        const timestamp = Math.round(Date.now() / 1000);
        const signature = cloudinary.utils.api_sign_request({ folder, timestamp }, apiSecret);

        return NextResponse.json({ success: true, signature, timestamp, folder, apiKey, cloudName });
    } catch (err) {
        console.error("Error in POST /api/admin/upload-signature:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
