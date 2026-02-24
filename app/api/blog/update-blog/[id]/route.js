import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import cloudinary from "@/app/lib/cloudinary";
import Blog from "@/app/models/Post";
import slugify from "slugify";

export async function PUT(req, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();
        const { title, content, image, category, tags } = body;

        // 1. Validate ID exists
        if (!id) {
            return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
        }

        const existingBlog = await Blog.findById(id);
        if (!existingBlog) {
            return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
        }

        let imageUrl = existingBlog.image;

        // 2. Handle Cloudinary Upload if image is a new base64 string
        if (image && image.startsWith("data:image")) {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: "blogs",
                resource_type: "auto",
            });
            imageUrl = uploadResponse.secure_url;
        } else if (image) {
            // If it's just a URL string, keep it as is
            imageUrl = image;
        }

        // 3. Update Slug if title changed
        const updatedSlug = title
            ? slugify(title, { lower: true, strict: true })
            : existingBlog.slug;

        // 4. Perform Update
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            {
                title: title || existingBlog.title,
                slug: updatedSlug,
                content: content || existingBlog.content,
                category: category || existingBlog.category,
                tags: tags || existingBlog.tags,
                image: imageUrl,
            },
            { new: true }
        );

        return NextResponse.json({
            success: true,
            blog: updatedBlog,
        });

    } catch (err) {
        console.error("Update Error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}