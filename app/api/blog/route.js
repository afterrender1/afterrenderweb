import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import cloudinary from "@/app/lib/cloudinary";
import Blog from "@/app/models/Post"
import slugify from "slugify"


export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const { title, content, image, author, category, tags } = body;
        const slug = slugify(title, {
            lower: true,
            strict: true
        })
        let imageUrl = "";

        if (image && image.startsWith("data:image")) {
            console.log("Uploading to Cloudinary...");

            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: "blogs",
                resource_type: "auto",
            });

            imageUrl = uploadResponse.secure_url;
            console.log("Upload Success URL:", imageUrl);
        } else {
            console.log("No valid image data found in request");
        }

        const newBlog = await Blog.create({
            title,
            slug,
            content,
            category,
            tags,
            image: imageUrl, // DB mein URL jayega
            author: author || "Admin",
        });

        return NextResponse.json({ success: true, blog: newBlog });
    } catch (err) {
        console.error("Error in POST /api/blogs:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await dbConnect();
        const blogs = await Blog.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, blogs });
    } catch (err) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}