import { NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinary";
import { auth } from "@/app/lib/auth";
import {
    AVATAR_FORMATS,
    AVATAR_INCOMING_TRANSFORMATION,
    avatarPublicId,
} from "@/app/lib/avatar";

const getCloudinaryConfig = () => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
    return cloudName && apiKey && apiSecret ? { cloudName, apiKey, apiSecret } : null;
};

const unauthorized = () =>
    NextResponse.json({ success: false, error: "Please sign in again." }, { status: 401 });

const notConfigured = () =>
    NextResponse.json(
        { success: false, error: "Image uploads are not configured on the server." },
        { status: 500 }
    );

// POST: signs a direct browser -> Cloudinary upload for the signed-in user's avatar.
// Every signed parameter is fixed by the server, so the browser can only upload
// to `user-avatars/<their id>` in the allowed formats.
export async function POST(req) {
    const session = await auth.api.getSession({ headers: req.headers }).catch(() => null);
    if (!session?.user?.id) return unauthorized();

    const config = getCloudinaryConfig();
    if (!config) return notConfigured();

    try {
        const params = {
            public_id: avatarPublicId(session.user.id),
            overwrite: "true",
            invalidate: "true",
            allowed_formats: AVATAR_FORMATS.join(","),
            transformation: AVATAR_INCOMING_TRANSFORMATION,
            timestamp: String(Math.round(Date.now() / 1000)),
        };
        const signature = cloudinary.utils.api_sign_request(params, config.apiSecret);

        return NextResponse.json(
            {
                success: true,
                cloudName: config.cloudName,
                apiKey: config.apiKey,
                params,
                signature,
            },
            { headers: { "Cache-Control": "no-store" } }
        );
    } catch (err) {
        console.error("Error in POST /api/user/avatar:", err);
        return NextResponse.json({ success: false, error: "Could not prepare the upload." }, { status: 500 });
    }
}

// DELETE: removes the user's avatar file from Cloudinary (the profile field is cleared by the client).
export async function DELETE(req) {
    const session = await auth.api.getSession({ headers: req.headers }).catch(() => null);
    if (!session?.user?.id) return unauthorized();

    if (!getCloudinaryConfig()) return notConfigured();

    try {
        await cloudinary.uploader.destroy(avatarPublicId(session.user.id), {
            invalidate: true,
            resource_type: "image",
        });
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Error in DELETE /api/user/avatar:", err);
        return NextResponse.json({ success: false, error: "Could not delete the image." }, { status: 500 });
    }
}
