import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import cloudinary from "@/app/lib/cloudinary";
import Blog from "@/app/models/Post";
import slugify from "slugify";
import { ADMIN_COOKIE, isValidSessionToken } from "@/app/lib/adminAuth";
import { sanitizeBlogHtml, toExcerpt } from "@/app/lib/blogContent";

export async function PUT(req, { params }) {
    if (!isValidSessionToken(req.cookies.get(ADMIN_COOKIE)?.value)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();
        const { title, image, category, tags } = body;
        let { content } = body;
        const isHtml = body.contentFormat === "html";
        let excerpt;
        if (isHtml) {
            content = sanitizeBlogHtml(content);
            excerpt = toExcerpt(content);
            if (!excerpt) {
                return NextResponse.json({ success: false, message: "Content cannot be empty" }, { status: 400 });
            }
        }

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
                // Only switch format when new html content was sent, so old posts stay markdown
                ...(isHtml ? { contentFormat: "html", excerpt } : {}),
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