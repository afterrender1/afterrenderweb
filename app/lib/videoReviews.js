// Used by the public /website page. Never throws: on failure the section just hides.
export async function getVideoReviewsByIds(ids) {
    try {
        // Imported lazily so a missing DB config can't break the page
        const { default: mongoose } = await import("mongoose");
        const { default: dbConnect } = await import("@/app/lib/db");
        const { default: VideoReview } = await import("@/app/models/VideoReview");
        const validIds = ids.filter((id) => mongoose.isValidObjectId(id));
        if (!validIds.length) return [];

        await dbConnect();
        const docs = await VideoReview.find({ _id: { $in: validIds } })
            .select("clientName role videoUrl poster fit")
            .lean();
        const byId = new Map(docs.map((d) => [String(d._id), d]));

        // Keep the requested order and drop reviews that no longer exist
        return validIds
            .map((id) => byId.get(String(id)))
            .filter(Boolean)
            .map((d) => ({
                id: String(d._id),
                clientName: d.clientName || "",
                role: d.role || "",
                videoUrl: d.videoUrl,
                poster: d.poster || "",
                fit: d.fit === "contain" ? "contain" : "cover",
            }));
    } catch (err) {
        console.error("Failed to load video reviews:", err);
        return [];
    }
}

// Every video review, newest first, for the client testimonials strip (home, pricing, on demand,
// AI avatars). Loaded on the server so the client names and roles are in the HTML instead of
// appearing only after a browser fetch. Same shape as GET /api/video-reviews.
// Returns null (not []) on failure, so the strip can still load in the browser.
export async function getAllVideoReviews() {
    try {
        const { default: dbConnect } = await import("@/app/lib/db");
        const { default: VideoReview } = await import("@/app/models/VideoReview");
        await dbConnect();
        const docs = await VideoReview.find()
            .sort({ createdAt: -1 })
            .select("clientName role videoUrl poster fit")
            .lean();
        return docs.map((d) => ({
            _id: String(d._id),
            clientName: d.clientName || "",
            role: d.role || "",
            videoUrl: d.videoUrl,
            poster: d.poster || "",
            fit: d.fit === "contain" ? "contain" : "cover",
        }));
    } catch (err) {
        console.error("Failed to load video reviews:", err);
        return null;
    }
}
