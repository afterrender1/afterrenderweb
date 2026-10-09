import mongoose from "mongoose";

const VideoReviewSchema = new mongoose.Schema(
    {
        clientName: {
            type: String,
            trim: true,
            default: "",
        },
        role: {
            type: String,
            required: true,
            trim: true,
        },
        videoUrl: {
            type: String,
            required: true,
            trim: true,
        },
        poster: {
            type: String,
            trim: true,
            default: "",
        },
        fit: {
            type: String,
            enum: ["cover", "contain"],
            default: "cover",
        },
    },
    { timestamps: true }
);

// In dev, hot reload keeps the old compiled model, so schema edits would be ignored
if (process.env.NODE_ENV !== "production") delete mongoose.models.VideoReview;

export default mongoose.models.VideoReview ||mongoose.model("VideoReview", VideoReviewSchema);
