import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/app/lib/db";
import PortfolioItem from "@/app/models/PortfolioItem";
import { ADMIN_COOKIE, isValidSessionToken } from "@/app/lib/adminAuth";
import { parsePortfolioInput } from "@/app/lib/portfolio";

export async function POST(req) {
    if (!isValidSessionToken(req.cookies.get(ADMIN_COOKIE)?.value)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { data, error } = parsePortfolioInput(await req.json().catch(() => null));
        if (error) return NextResponse.json({ success: false, error }, { status: 400 });

        await dbConnect();
        const item = await PortfolioItem.create(data);
        revalidatePath("/website");

        return NextResponse.json({ success: true, item }, { status: 201 });
    } catch (err) {
        console.error("Error in POST /api/portfolio:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        await dbConnect();
        const items = await PortfolioItem.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, items });
    } catch (err) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
