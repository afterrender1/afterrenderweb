import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        content: {
            type: String,
            required: true,
        },
        image: {
            type: String, // Cloudinary URL
        },
        author: {
            type: String,
            default: "Admin",
        },
        category: {
            type: String,
        },
        tags: {
            type: [String],
        },
    },
    { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
