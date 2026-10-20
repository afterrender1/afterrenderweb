// Shared by the server (getActiveEvent) and the admin editor. Pure, no DB imports.

// "20% OFF" -> 20; null when the text has no usable whole percentage
export const percentFromText = (text) => {
    const match = /(\d{1,2})\s*%/.exec(String(text || ""));
    const pct = match ? Number(match[1]) : NaN;
    return pct > 0 && pct <= 90 ? pct : null;
};

// Discount to apply on /pricing. Events saved before `discountPercent` existed
// fall back to the percentage in their badge text, so "20% OFF" means 20% off.
export const resolveDiscount = (event) => {
    const stored = event?.discountPercent;
    if (stored === undefined || stored === null || stored === "") return percentFromText(event?.offerText) ?? 0;
    const pct = Number(stored);
    return Number.isInteger(pct) ? Math.min(90, Math.max(0, pct)) : 0;
};
