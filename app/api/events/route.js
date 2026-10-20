import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/app/lib/db";
import HeroEvent from "@/app/models/HeroEvent";
import { ADMIN_COOKIE, isValidSessionToken } from "@/app/lib/adminAuth";
import { EVENT_DEFAULTS, parseEventInput, validateComplete } from "@/app/lib/heroEvents";

const unauthorized = () => NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

export async function GET(req) {
    if (!isValidSessionToken(req.cookies.get(ADMIN_COOKIE)?.value)) return unauthorized();

    try {
        await dbConnect();
        const events = await HeroEvent.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, events });
    } catch (err) {
        console.error("Error in GET /api/events:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function POST(req) {
    if (!isValidSessionToken(req.cookies.get(ADMIN_COOKIE)?.value)) return unauthorized();

    try {
        const { data, error } = parseEventInput(await req.json().catch(() => null));
        if (error) return NextResponse.json({ success: false, error }, { status: 400 });

        const incomplete = validateComplete({ ...EVENT_DEFAULTS, ...data });
        if (incomplete) return NextResponse.json({ success: false, error: incomplete }, { status: 400 });

        await dbConnect();
        if (data.isActive) await HeroEvent.updateMany({ isActive: true }, { isActive: false });
        const event = await HeroEvent.create(data);

        revalidatePath("/");
        return NextResponse.json({ success: true, event }, { status: 201 });
    } catch (err) {
        console.error("Error in POST /api/events:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
