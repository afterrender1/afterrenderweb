const isHttpUrl = (value) => {
    try {
        const { protocol } = new URL(value);
        return protocol === "https:" || protocol === "http:";
    } catch {
        return false;
    }
};

export const MAX_TABS = 12;
export const MAX_TAB_IMAGES = 2;
const MAX_TAB_TITLE = 60;
const MAX_TAB_DESCRIPTION = 4000;

// Validates the "Read about" tabs; each needs a title and 1–2 images
const parseTabs = (raw) => {
    if (raw === undefined || raw === null) return { tabs: [] };
    if (!Array.isArray(raw)) return { error: "Tabs must be a list" };
    if (raw.length > MAX_TABS) return { error: `You can add up to ${MAX_TABS} tabs` };

    const tabs = [];
    for (const [i, tab] of raw.entries()) {
        const label = `Tab ${i + 1}`;
        const title = String(tab?.title ?? "").trim();
        const description = String(tab?.description ?? "").trim();
        const images = (Array.isArray(tab?.images) ? tab.images : [])
            .map((u) => String(u ?? "").trim())
            .filter(Boolean);

        if (!title) return { error: `${label} needs a title` };
        if (title.length > MAX_TAB_TITLE) return { error: `${label} title must be ${MAX_TAB_TITLE} characters or less` };
        if (!images.length) return { error: `${label} needs at least one image` };
        if (images.length > MAX_TAB_IMAGES) return { error: `${label} can have up to ${MAX_TAB_IMAGES} images` };
        if (!images.every(isHttpUrl)) return { error: `${label} has an invalid image URL` };
        if (description.length > MAX_TAB_DESCRIPTION) {
            return { error: `${label} description must be ${MAX_TAB_DESCRIPTION} characters or less` };
        }
        tabs.push({ title, images, description });
    }
    return { tabs };
};

// Picks and validates the portfolio fields from a request body
export const parsePortfolioInput = (body) => {
    if (!body || typeof body !== "object") return { error: "Invalid request body" };

    const name = String(body.name ?? "").trim();
    let url = String(body.url ?? "").trim();
    const image = String(body.image ?? "").trim();

    if (!name) return { error: "Website name is required" };
    if (!url) return { error: "Website URL is required" };
    if (!image) return { error: "Upload a website screenshot" };

    // Let the admin type "example.com" without the protocol
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
    if (!isHttpUrl(url)) return { error: "Website URL must be a valid link" };
    if (!isHttpUrl(image)) return { error: "Screenshot must be a valid image URL" };

    const { tabs, error } = parseTabs(body.tabs);
    if (error) return { error };

    return { data: { name, url, image, tabs } };
};

// Used by the public /website page. Never throws: on failure the section just hides.
export async function getPortfolioItems() {
    try {
        // Imported lazily so a missing DB config can't break the page
        const { default: dbConnect } = await import("@/app/lib/db");
        const { default: PortfolioItem } = await import("@/app/models/PortfolioItem");
        await dbConnect();
        const items = await PortfolioItem.find().sort({ createdAt: -1 }).lean();
        return items.map((item) => ({
            id: String(item._id),
            name: item.name,
            url: item.url,
            image: item.image,
            // Plain objects only: this crosses the server -> client component boundary
            tabs: (item.tabs || []).map((tab) => ({
                title: tab.title,
                images: [...(tab.images || [])],
                description: tab.description || "",
            })),
        }));
    } catch (err) {
        console.error("Failed to load portfolio items:", err);
        return [];
    }
}
