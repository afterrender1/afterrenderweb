// Prices for /pricing (subscription plans) and /pricing/on-demand (pre-paid packages).
// Shared by the server (getActiveEvent), the admin event editor and both pages. Pure, no DB imports.
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

// On Demand pre-paid packages (shown in this order). `kind` picks the card icon.
export const ON_DEMAND_PACKAGES = [
    { id: "short5", title: "5x Short Form", description: "5 short-form video edits", kind: "short" },
    { id: "realEstate5", title: "5x Real Estate", description: "5 real estate video edits", kind: "realEstate" },
    { id: "youtube2", title: "2x YouTube Video", description: "2 YouTube video edits", kind: "youtube" },
    { id: "short10", title: "10x Short Form", description: "10 short-form video edits", kind: "short" },
    { id: "realEstate10", title: "10x Real Estate", description: "10 real estate video edits", kind: "realEstate" },
    { id: "youtube4", title: "4x YouTube Video", description: "4 YouTube video edits", kind: "youtube" },
];

// Monthly price (USD) per plan for each billing period, plus the package prices (USD)
export const DEFAULT_PRICES = {
    basic: { monthly: 699, quarterly: 629, semiAnnual: 559 },
    plus: { monthly: 1199, quarterly: 1079, semiAnnual: 959 },
    ultra: { monthly: 2099, quarterly: 1889, semiAnnual: 1679 },
    packages: { short5: 325, realEstate5: 500, youtube2: 300, short10: 650, realEstate10: 1000, youtube4: 600 },
};

export const MAX_PRICE = 100000;

export const isValidPrice = (value) => Number.isInteger(value) && value >= 1 && value <= MAX_PRICE;

const toNumber = (raw) => (raw === "" || raw === null || raw === undefined ? NaN : Number(raw));

// Strict (used when saving): every plan × period (and every package) must be a whole dollar amount.
// Prices saved before packages existed have no `packages`: those get the default package prices.
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

    pricing.packages = {};
    const packages = input.packages;
    for (const { id, title } of ON_DEMAND_PACKAGES) {
        if (packages === undefined || packages === null) {
            pricing.packages[id] = DEFAULT_PRICES.packages[id];
            continue;
        }
        const value = toNumber(packages[id]);
        if (!isValidPrice(value)) return { error: `${title} price must be a whole number from 1 to ${MAX_PRICE}` };
        pricing.packages[id] = value;
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
    pricing.packages = {};
    for (const { id } of ON_DEMAND_PACKAGES) {
        const value = toNumber(input?.packages?.[id]);
        pricing.packages[id] = isValidPrice(value) ? value : DEFAULT_PRICES.packages[id];
    }
    return pricing;
};
