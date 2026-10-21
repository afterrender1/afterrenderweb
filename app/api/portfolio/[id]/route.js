import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/db";
import PortfolioItem from "@/app/models/PortfolioItem";
import { ADMIN_COOKIE, isValidSessionToken } from "@/app/lib/adminAuth";
import { parsePortfolioInput } from "@/app/lib/portfolio";

const unauthorized = () => NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
const notFound = () => NextResponse.json({ success: false, error: "Portfolio item not found" }, { status: 404 });

export async function PUT(req, { params }) {
    if (!isValidSessionToken(req.cookies.get(ADMIN_COOKIE)?.value)) return unauthorized();

    try {
        const { id } = await params;
        if (!mongoose.isValidObjectId(id)) return notFound();

        const { data, error } = parsePortfolioInput(await req.json().catch(() => null));
        if (error) return NextResponse.json({ success: false, error }, { status: 400 });

        await dbConnect();
        const item = await PortfolioItem.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!item) return notFound();
        revalidatePath("/website");

        return NextResponse.json({ success: true, item });
    } catch (err) {
        console.error("Error in PUT /api/portfolio/[id]:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    if (!isValidSessionToken(req.cookies.get(ADMIN_COOKIE)?.value)) return unauthorized();

    try {
        const { id } = await params;
        if (!mongoose.isValidObjectId(id)) return notFound();

        await dbConnect();
        const item = await PortfolioItem.findByIdAndDelete(id);
        if (!item) return notFound();
        revalidatePath("/website");

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Error in DELETE /api/portfolio/[id]:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
