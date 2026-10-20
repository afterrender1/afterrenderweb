import mongoose from "mongoose";

// Saved announcement-bar color presets, reusable across events
const ColorPaletteSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, maxlength: 40 },
        // Shape defined and validated by app/lib/announcementStyle.js
        style: { type: mongoose.Schema.Types.Mixed, required: true },
    },
    { timestamps: true }
);

// In dev, hot reload keeps the old compiled model, so schema edits would be ignored
if (process.env.NODE_ENV !== "production") delete mongoose.models.ColorPalette;

export default mongoose.models.ColorPalette || mongoose.model("ColorPalette", ColorPaletteSchema);
