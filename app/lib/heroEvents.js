import { DEFAULT_ANNOUNCEMENT_STYLE, isValidHex, parseAnnouncementStyle, withStyleDefaults } from "@/app/lib/announcementStyle";

const STRING_FIELDS = [
    "name",
    "backgroundUrl",
    "topLeftUrl",
    "topRightUrl",
    "announcementText",
    "announcementLink",
    "offerText",
    "offerButtonColor",
    "offerButtonTextColor",
    "offerBadgeColor",
];
const BOOL_FIELDS = ["isActive", "showBackground", "showTopLeft", "showTopRight", "showAnnouncement", "showOffer"];
const OFFER_COLOR_FIELDS = ["offerButtonColor", "offerButtonTextColor", "offerBadgeColor"];

export const EVENT_DEFAULTS = {
    name: "",
    isActive: false,
    showBackground: true,
    backgroundUrl: "",
    showTopLeft: true,
    topLeftUrl: "",
    showTopRight: true,
    topRightUrl: "",
    showAnnouncement: true,
    announcementText: "",
    announcementLink: "",
    announcementStyle: DEFAULT_ANNOUNCEMENT_STYLE,
    showOffer: false,
    offerText: "20% OFF",
    offerButtonColor: "#FF7A00",
    offerButtonTextColor: "#FFFFFF",
    offerBadgeColor: "#EF4444",
};

const isHttpUrl = (value) => {
    try {
        const { protocol } = new URL(value);
        return protocol === "https:" || protocol === "http:";
    } catch {
        return false;
    }
};

// Picks known fields from a request body and validates them.
// `partial` allows updates that only touch some fields (e.g. toggling isActive).
export const parseEventInput = (body, { partial = false } = {}) => {
    if (!body || typeof body !== "object") return { error: "Invalid request body" };

    const data = {};
    for (const key of STRING_FIELDS) {
        if (body[key] !== undefined) data[key] = String(body[key] ?? "").trim();
    }
    for (const key of BOOL_FIELDS) {
        if (body[key] !== undefined) data[key] = Boolean(body[key]);
    }

    if (body.announcementStyle !== undefined) {
        const { style, error } = parseAnnouncementStyle(body.announcementStyle);
        if (error) return { error };
        data.announcementStyle = style;
    }

    if (!partial && !data.name) return { error: "Event name is required" };
    if (data.name !== undefined && !data.name) return { error: "Event name can't be empty" };

    for (const key of OFFER_COLOR_FIELDS) {
        if (data[key] !== undefined && !isValidHex(data[key])) return { error: "Offer colors must be hex values like #FF7A00" };
    }
    if (data.offerText && data.offerText.length > 24) return { error: "Offer text must be 24 characters or less" };

    for (const key of ["backgroundUrl", "topLeftUrl", "topRightUrl"]) {
        if (data[key] && !isHttpUrl(data[key])) return { error: "Images must be valid URLs" };
    }
    if (data.announcementLink && !isHttpUrl(data.announcementLink) && !data.announcementLink.startsWith("/")) {
        return { error: "Announcement link must be a full URL or a path like /pricing" };
    }

    return { data };
};

// Enabled elements must have content, otherwise the hero would render empty slots
export const validateComplete = (event) => {
    if (event.showBackground && !event.backgroundUrl) return "Upload a hero background or turn it off";
    if (event.showTopLeft && !event.topLeftUrl) return "Upload the top-left image or turn it off";
    if (event.showTopRight && !event.topRightUrl) return "Upload the top-right image or turn it off";
    if (event.showAnnouncement && !event.announcementText) return "Add announcement text or turn it off";
    if (event.showOffer && !event.offerText) return "Add offer text (e.g. 20% OFF) or turn the offer off";
    return null;
};

const offerFor = (event) => {
    const color = (key) => (isValidHex(event[key]) ? event[key] : EVENT_DEFAULTS[key]);
    return {
        text: event.offerText,
        buttonColor: color("offerButtonColor"),
        buttonTextColor: color("offerButtonTextColor"),
        badgeColor: color("offerBadgeColor"),
    };
};

// Used by the public hero. Never throws: on any failure the default hero shows.
export async function getActiveEvent() {
    try {
        // Imported lazily so a missing DB config can't break the home page
        const { default: dbConnect } = await import("@/app/lib/db");
        const { default: HeroEvent } = await import("@/app/models/HeroEvent");
        await dbConnect();
        const event = await HeroEvent.findOne({ isActive: true }).sort({ updatedAt: -1 }).lean();
        if (!event) return null;

        return {
            name: event.name,
            backgroundUrl: event.showBackground ? event.backgroundUrl : "",
            topLeftUrl: event.showTopLeft ? event.topLeftUrl : "",
            topRightUrl: event.showTopRight ? event.topRightUrl : "",
            announcementText: event.showAnnouncement ? event.announcementText : "",
            announcementLink: event.showAnnouncement ? event.announcementLink : "",
            announcementStyle: withStyleDefaults(event.announcementStyle),
            offer: event.showOffer && event.offerText ? offerFor(event) : null,
        };
    } catch (err) {
        console.error("Failed to load active hero event:", err);
        return null;
    }
}
