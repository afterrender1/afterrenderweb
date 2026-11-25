import JsonLd from "./JsonLd";
import { BILLING_PERIODS, ON_DEMAND_PACKAGES, PLAN_TIERS, withPricingDefaults } from "@/app/lib/pricingPlans";
import { SITE_URL, SITE_NAME, AREA_SERVED } from "@/app/lib/seo";

// Offers (schema.org) built from the SAME live prices the cards show, so the structured data
// never disagrees with the page. Rendered inside <Suspense> next to the cards: the JSON-LD
// streams in once the event resolves, without delaying the rest of the page.

const PROVIDER = { "@id": `${SITE_URL}/#organization` };
const PERIOD_MONTHS = { monthly: 1, quarterly: 3, semiAnnual: 6 };

const offerBase = (path) => ({
  "@type": "Offer",
  priceCurrency: "USD",
  availability: "https://schema.org/InStock",
  url: `${SITE_URL}${path}`,
  seller: PROVIDER,
  areaServed: { "@type": "Country", name: "United States" },
});

// /pricing: Basic / Plus / Ultra, one offer per billing period (price per month, live discount applied)
export async function SubscriptionPlansJsonLd({ eventPromise }) {
  const event = eventPromise ? await eventPromise : null;
  const prices = withPricingDefaults(event?.prices);
  const discount = event?.offer?.discountPercent > 0 ? event.offer.discountPercent : 0;
  const finalPrice = (price) => (discount ? Math.round(price * (1 - discount / 100)) : price);

  const offers = PLAN_TIERS.flatMap(({ id, name }) =>
    BILLING_PERIODS.map(({ id: period, label, billedText }) => ({
      ...offerBase("/pricing"),
      name: `${name} plan (${label})`,
      description: `${SITE_NAME} ${name} unlimited video editing subscription, ${billedText.replace("USD/mo - ", "")}.`,
      price: finalPrice(prices[id][period]),
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: finalPrice(prices[id][period]),
        priceCurrency: "USD",
        unitCode: "MON",
        referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
        billingDuration: { "@type": "QuantitativeValue", value: PERIOD_MONTHS[period], unitCode: "MON" },
      },
    }))
  );

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${SITE_URL}/pricing#subscription`,
        name: "Unlimited Video Editing Subscription",
        serviceType: "Video editing subscription",
        description:
          "Unlimited video editing and graphic design for one flat monthly price. Unlimited requests and revisions, same editor for all projects, Basic, Plus and Ultra plans.",
        provider: PROVIDER,
        areaServed: AREA_SERVED,
        offers,
      }}
    />
  );
}

// /pricing/on-demand: pre-paid packages, no subscription
export async function OnDemandPackagesJsonLd({ eventPromise }) {
  const event = eventPromise ? await eventPromise : null;
  const prices = withPricingDefaults(event?.prices).packages;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${SITE_URL}/pricing/on-demand#packages`,
        name: "On Demand Video Editing Packages",
        serviceType: "Pay-per-project video editing",
        description:
          "Pre-paid video editing packages with no subscription: short-form, real estate and YouTube video edits.",
        provider: PROVIDER,
        areaServed: AREA_SERVED,
        offers: ON_DEMAND_PACKAGES.map(({ id, title, description }) => ({
          ...offerBase("/pricing/on-demand"),
          name: title,
          description,
          price: prices[id],
        })),
      }}
    />
  );
}
