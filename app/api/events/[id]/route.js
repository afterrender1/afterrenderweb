import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/db";
import HeroEvent from "@/app/models/HeroEvent";
import { ADMIN_COOKIE, isValidSessionToken } from "@/app/lib/adminAuth";
import { parseEventInput, validateComplete } from "@/app/lib/heroEvents";

const unauthorized = () => NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
const notFound = () => NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });

// Partial update: the full edit form and the live toggle both use this
export async function PATCH(req, { params }) {
    if (!isValidSessionToken(req.cookies.get(ADMIN_COOKIE)?.value)) return unauthorized();

    try {
        const { id } = await params;
        if (!mongoose.isValidObjectId(id)) return notFound();

        const { data, error } = parseEventInput(await req.json().catch(() => null), { partial: true });
        if (error) return NextResponse.json({ success: false, error }, { status: 400 });

        await dbConnect();
        const existing = await HeroEvent.findById(id);
        if (!existing) return notFound();

        const incomplete = validateComplete({ ...existing.toObject(), ...data });
        if (incomplete) return NextResponse.json({ success: false, error: incomplete }, { status: 400 });

        if (data.isActive) await HeroEvent.updateMany({ _id: { $ne: id }, isActive: true }, { isActive: false });
        existing.set(data);
        await existing.save();

        revalidatePath("/");
        revalidatePath("/pricing");
        return NextResponse.json({ success: true, event: existing });
    } catch (err) {
        console.error("Error in PATCH /api/events/[id]:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    if (!isValidSessionToken(req.cookies.get(ADMIN_COOKIE)?.value)) return unauthorized();

    try {
        const { id } = await params;
        if (!mongoose.isValidObjectId(id)) return notFound();

        await dbConnect();
        const event = await HeroEvent.findByIdAndDelete(id);
        if (!event) return notFound();

        revalidatePath("/");
        revalidatePath("/pricing");
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Error in DELETE /api/events/[id]:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
