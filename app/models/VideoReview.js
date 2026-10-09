import mongoose from "mongoose";

const VideoReviewSchema = new mongoose.Schema(
    {
        clientName: {
            type: String,
            required: true,
            trim: true,
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

export default mongoose.models.VideoReview || mongoose.model("VideoReview", VideoReviewSchema);
