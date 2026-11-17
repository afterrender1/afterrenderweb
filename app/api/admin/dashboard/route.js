import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import Blog from "@/app/models/Post";
import PortfolioItem from "@/app/models/PortfolioItem";
import VideoReview from "@/app/models/VideoReview";
import HeroEvent from "@/app/models/HeroEvent";
import ColorPalette from "@/app/models/ColorPalette";
import { ADMIN_COOKIE, isValidSessionToken } from "@/app/lib/adminAuth";
import { isYouTubeUrl } from "@/app/lib/video";

// Always computed from the live database, never cached
export const dynamic = "force-dynamic";

const MONTHS = 12;
const DAY_MS = 24 * 60 * 60 * 1000;
const TOP_CATEGORIES = 6;

// "YYYY-MM" keys (UTC) for the last `count` months, oldest first, ending with the current month
const monthKeys = (now, count) => {
    const keys = [];
    for (let i = count - 1; i >= 0; i--) {
        const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
        keys.push(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`);
    }
    return keys;
};

// { "YYYY-MM": count } for documents created on/after `since`
const countByMonth = async (Model, since) => {
    const rows = await Model.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt", timezone: "UTC" } }, count: { $sum: 1 } } },
    ]);
    return Object.fromEntries(rows.map((r) => [r._id, r.count]));
};

export async function GET(req) {
    if (!isValidSessionToken(req.cookies.get(ADMIN_COOKIE)?.value)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();

        const now = new Date();
        const last30 = new Date(now.getTime() - 30 * DAY_MS);
        const keys = monthKeys(now, MONTHS);
        const windowStart = new Date(`${keys[0]}-01T00:00:00.000Z`);

        const [
            blogTotal,
            portfolioTotal,
            reviewTotal,
            eventTotal,
            paletteTotal,
            blog30,
            portfolio30,
            review30,
            blogMonths,
            portfolioMonths,
            reviewMonths,
            categoryRows,
            reviewVideos,
            activeEvent,
            recentBlogs,
            recentPortfolio,
            recentReviews,
            recentEvents,
        ] = await Promise.all([
            Blog.countDocuments(),
            PortfolioItem.countDocuments(),
            VideoReview.countDocuments(),
            HeroEvent.countDocuments(),
            ColorPalette.countDocuments(),
            Blog.countDocuments({ createdAt: { $gte: last30 } }),
            PortfolioItem.countDocuments({ createdAt: { $gte: last30 } }),
            VideoReview.countDocuments({ createdAt: { $gte: last30 } }),
            countByMonth(Blog, windowStart),
            countByMonth(PortfolioItem, windowStart),
            countByMonth(VideoReview, windowStart),
            Blog.aggregate([
                {
                    $group: {
                        _id: {
                            $let: {
                                vars: { c: { $trim: { input: { $ifNull: ["$category", ""] } } } },
                                in: { $cond: [{ $eq: ["$$c", ""] }, "Uncategorized", "$$c"] },
                            },
                        },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { count: -1, _id: 1 } },
            ]),
            VideoReview.find().select("videoUrl poster").lean(),
            HeroEvent.findOne({ isActive: true })
                .select("name showOffer offerText discountPercent showAnnouncement announcementText updatedAt")
                .lean(),
            Blog.find().sort({ createdAt: -1 }).limit(6).select("title slug createdAt").lean(),
            PortfolioItem.find().sort({ createdAt: -1 }).limit(6).select("name url createdAt").lean(),
            VideoReview.find().sort({ createdAt: -1 }).limit(6).select("clientName role createdAt").lean(),
            HeroEvent.find().sort({ createdAt: -1 }).limit(6).select("name isActive createdAt").lean(),
        ]);

        // Items created before the 12-month window (or without a createdAt) start the running total
        const inWindow = (months) => Object.values(months).reduce((a, b) => a + b, 0);
        let running =
            blogTotal + portfolioTotal + reviewTotal -
            inWindow(blogMonths) - inWindow(portfolioMonths) - inWindow(reviewMonths);

        const monthly = keys.map((month) => {
            const blogs = blogMonths[month] || 0;
            const portfolio = portfolioMonths[month] || 0;
            const reviews = reviewMonths[month] || 0;
            running += blogs + portfolio + reviews;
            return { month, blogs, portfolio, reviews, total: running };
        });

        // Top categories; the rest fold into "Other"
        const top = categoryRows.slice(0, TOP_CATEGORIES).map((r) => ({ name: r._id, count: r.count }));
        const otherCount = categoryRows.slice(TOP_CATEGORIES).reduce((a, r) => a + r.count, 0);
        const categories = otherCount ? [...top, { name: "Other", count: otherCount }] : top;

        const youtube = reviewVideos.filter((r) => isYouTubeUrl(r.videoUrl)).length;
        const withPoster = reviewVideos.filter((r) => r.poster?.trim()).length;

        const recent = [
            ...recentBlogs.map((d) => ({ type: "Blog", title: d.title, href: `/blog/${d.slug}`, createdAt: d.createdAt })),
            ...recentPortfolio.map((d) => ({ type: "Portfolio", title: d.name, href: d.url, createdAt: d.createdAt })),
            ...recentReviews.map((d) => ({
                type: "Video review",
                title: d.clientName?.trim() || d.role,
                href: "/admin/video-reviews",
                createdAt: d.createdAt,
            })),
            ...recentEvents.map((d) => ({
                type: "Event",
                title: d.isActive ? `${d.name} (live)` : d.name,
                href: "/admin/events",
                createdAt: d.createdAt,
            })),
        ]
            .filter((item) => item.createdAt)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 8);

        return NextResponse.json({
            success: true,
            generatedAt: now.toISOString(),
            totals: {
                blogs: blogTotal,
                portfolio: portfolioTotal,
                reviews: reviewTotal,
                events: eventTotal,
                palettes: paletteTotal,
            },
            last30: { blogs: blog30, portfolio: portfolio30, reviews: review30 },
            monthly,
            categories,
            reviewSources: { youtube, uploaded: reviewVideos.length - youtube, withPoster },
            activeEvent: activeEvent
                ? {
                      name: activeEvent.name,
                      offer: activeEvent.showOffer ? activeEvent.offerText || `${activeEvent.discountPercent}% OFF` : "",
                      discountPercent: activeEvent.showOffer ? activeEvent.discountPercent : 0,
                      announcement: activeEvent.showAnnouncement ? activeEvent.announcementText : "",
                      updatedAt: activeEvent.updatedAt,
                  }
                : null,
            recent,
        });
    } catch (err) {
        console.error("Error in GET /api/admin/dashboard:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
