import mongoose from "mongoose";

// One "Read about" tab: a title, 1–2 images and a description
const PortfolioTabSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        images: { type: [String], default: [] },
        description: { type: String, trim: true, default: "" },
    },
    { _id: false }
);

const PortfolioItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        url: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            required: true,
            trim: true,
        },
        tabs: {
            type: [PortfolioTabSchema],
            default: [],
        },
    },
    { timestamps: true }
);

// In dev, hot reload keeps the old compiled model, so schema edits would be ignored
if (process.env.NODE_ENV !== "production") delete mongoose.models.PortfolioItem;

export default mongoose.models.PortfolioItem || mongoose.model("PortfolioItem", PortfolioItemSchema);
