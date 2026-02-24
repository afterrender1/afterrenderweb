import { NextResponse } from "next/server";
import Blog from "@/app/models/Post";

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ message: "Id is required" });
        }
        const deletedBlog = await Blog.findByIdAndDelete(id)

        return NextResponse.json({ message: "Blog deleted successfully!", deletedBlog }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });

    }

}