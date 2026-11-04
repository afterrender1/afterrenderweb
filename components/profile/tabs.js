// Plain module (no "use client") so the server page can validate ?tab= too.
export const PROFILE_TAB_IDS = ["profile", "security", "billing"];

// Old tab names still work in links.
export const resolveProfileTab = (value) => {
    if (value === "purchases") return "billing";
    if (value === "overview" || value === "edit") return "profile";
    return PROFILE_TAB_IDS.includes(value) ? value : "profile";
};
