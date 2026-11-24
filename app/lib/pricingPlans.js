// Plan prices for /pricing. Shared by the server (getActiveEvent), the admin event
// editor and the pricing page. Pure, no DB imports.
// Only the prices are editable from admin (Events → Pricing); plan text lives in PricingHero.

export const BILLING_PERIODS = [
    { id: "monthly", label: "Monthly", billedText: "USD/mo - billed monthly" },
    { id: "quarterly", label: "Quarterly", billedText: "USD/mo - billed every 3 months" },
    { id: "semiAnnual", label: "Semi-Annual", billedText: "USD/mo - billed every 6 months" },
];

export const PLAN_TIERS = [
    { id: "basic", name: "Basic" },
    { id: "plus", name: "Plus" },
    { id: "ultra", name: "Ultra" },
];

// Monthly price (USD) per plan for each billing period
export const DEFAULT_PRICES = {
    basic: { monthly: 699, quarterly: 629, semiAnnual: 559 },
    plus: { monthly: 1199, quarterly: 1079, semiAnnual: 959 },
    ultra: { monthly: 2099, quarterly: 1889, semiAnnual: 1679 },
};

export const MAX_PRICE = 100000;

export const isValidPrice = (value) => Number.isInteger(value) && value >= 1 && value <= MAX_PRICE;

const toNumber = (raw) => (raw === "" || raw === null || raw === undefined ? NaN : Number(raw));

// Strict (used when saving): every plan × period must be a whole dollar amount
export const parsePricing = (input) => {
    if (!input || typeof input !== "object") return { error: "Invalid plan prices" };

    const pricing = {};
    for (const { id: plan, name } of PLAN_TIERS) {
        pricing[plan] = {};
        for (const { id: period, label } of BILLING_PERIODS) {
            const value = toNumber(input[plan]?.[period]);
            if (!isValidPrice(value)) {
                return { error: `${name} ${label} price must be a whole number from 1 to ${MAX_PRICE}` };
            }
            pricing[plan][period] = value;
        }
    }
    return { pricing };
};

// Lenient (used when showing): anything missing or invalid falls back to the default price.
// Always returns a fresh object.
export const withPricingDefaults = (input) => {
    const pricing = {};
    for (const { id: plan } of PLAN_TIERS) {
        pricing[plan] = {};
        for (const { id: period } of BILLING_PERIODS) {
            const value = toNumber(input?.[plan]?.[period]);
            pricing[plan][period] = isValidPrice(value) ? value : DEFAULT_PRICES[plan][period];
        }
    }
    return pricing;
};
