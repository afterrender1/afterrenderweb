import mongoose from "mongoose";

const HeroEventSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        // Only one event is live at a time; with none live the default hero shows
        isActive: { type: Boolean, default: false },

        showBackground: { type: Boolean, default: true },
        backgroundUrl: { type: String, trim: true, default: "" },

        showTopLeft: { type: Boolean, default: true },
        topLeftUrl: { type: String, trim: true, default: "" },

        showTopRight: { type: Boolean, default: true },
        topRightUrl: { type: String, trim: true, default: "" },

        showAnnouncement: { type: Boolean, default: true },
        announcementText: { type: String, trim: true, default: "" },
        announcementLink: { type: String, trim: true, default: "" },
        // Colors / gradient for the bar; validated by app/lib/announcementStyle.js
        announcementStyle: { type: mongoose.Schema.Types.Mixed, default: undefined },
    },
    { timestamps: true }
);

// In dev, hot reload keeps the old compiled model, so schema edits would be ignored
if (process.env.NODE_ENV !== "production") delete mongoose.models.HeroEvent;

export default mongoose.models.HeroEvent || mongoose.model("HeroEvent", HeroEventSchema);
