// Shared by the API (validation), the public hero and the admin editor.
// Pure functions only, so it is safe to import on both server and client.

const HEX = /^#[0-9a-f]{6}$/i;

// Matches the original look: white text on 40% black with a blue dot
export const DEFAULT_ANNOUNCEMENT_STYLE = {
    textColor: "#FFFFFF",
    accentColor: "#7EC0FF",
    bgType: "solid",
    bgColor: "#000000",
    gradientFrom: "#FF7A00",
    gradientTo: "#6B21A8",
    gradientAngle: 90,
    bgOpacity: 40,
};

export const BUILT_IN_PALETTES = [
    { name: "Default", style: DEFAULT_ANNOUNCEMENT_STYLE },
    {
        name: "Halloween",
        style: { textColor: "#FFFFFF", accentColor: "#FFD166", bgType: "gradient", bgColor: "#000000", gradientFrom: "#FF7A00", gradientTo: "#6B21A8", gradientAngle: 90, bgOpacity: 100 },
    },
    {
        name: "Christmas",
        style: { textColor: "#FFFFFF", accentColor: "#FDE68A", bgType: "gradient", bgColor: "#000000", gradientFrom: "#B91C1C", gradientTo: "#166534", gradientAngle: 90, bgOpacity: 100 },
    },
    {
        name: "Midnight",
        style: { textColor: "#E0F2FE", accentColor: "#7EC0FF", bgType: "gradient", bgColor: "#000000", gradientFrom: "#0F172A", gradientTo: "#1E3A8A", gradientAngle: 90, bgOpacity: 100 },
    },
    {
        name: "Sunset",
        style: { textColor: "#FFFFFF", accentColor: "#FEF08A", bgType: "gradient", bgColor: "#000000", gradientFrom: "#F97316", gradientTo: "#DB2777", gradientAngle: 90, bgOpacity: 100 },
    },
    {
        name: "Gold",
        style: { textColor: "#FACC15", accentColor: "#FACC15", bgType: "solid", bgColor: "#111111", gradientFrom: "#FF7A00", gradientTo: "#6B21A8", gradientAngle: 90, bgOpacity: 100 },
    },
];

const clampInt = (value, min, max, fallback) => {
    const n = Math.round(Number(value));
    return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};

// Lenient: fills gaps/invalid values with defaults. Used when reading stored data.
export const withStyleDefaults = (input) => {
    const s = input && typeof input === "object" ? input : {};
    const d = DEFAULT_ANNOUNCEMENT_STYLE;
    const color = (key) => (HEX.test(s[key]) ? s[key].toUpperCase() : d[key]);
    return {
        textColor: color("textColor"),
        accentColor: color("accentColor"),
        bgType: s.bgType === "gradient" ? "gradient" : "solid",
        bgColor: color("bgColor"),
        gradientFrom: color("gradientFrom"),
        gradientTo: color("gradientTo"),
        gradientAngle: clampInt(s.gradientAngle, 0, 360, d.gradientAngle),
        bgOpacity: clampInt(s.bgOpacity, 0, 100, d.bgOpacity),
    };
};

// Strict: rejects bad input with a readable error. Used by the API on writes.
export const parseAnnouncementStyle = (input) => {
    if (!input || typeof input !== "object") return { error: "Invalid announcement style" };
    for (const key of ["textColor", "accentColor", "bgColor", "gradientFrom", "gradientTo"]) {
        if (input[key] !== undefined && !HEX.test(input[key])) {
            return { error: "Colors must be 6-digit hex values like #FF7A00" };
        }
    }
    return { style: withStyleDefaults(input) };
};

export const isValidHex = (value) => HEX.test(value);

const hexToRgba = (hex, opacity) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${opacity / 100})`;
};

// CSS `background` value for the bar
export const announcementBackground = (input) => {
    const s = withStyleDefaults(input);
    if (s.bgType === "gradient") {
        return `linear-gradient(${s.gradientAngle}deg, ${hexToRgba(s.gradientFrom, s.bgOpacity)}, ${hexToRgba(s.gradientTo, s.bgOpacity)})`;
    }
    return hexToRgba(s.bgColor, s.bgOpacity);
};
