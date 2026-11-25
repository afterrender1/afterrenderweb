// /llms.txt: a plain-text brief of AfterRender for AI assistants and AI search (llmstxt.org).
// Prices come from the live event (admin → Events → Pricing), like the pricing pages.
import { getActiveEvent } from "@/app/lib/heroEvents";
import { withPricingDefaults, ON_DEMAND_PACKAGES } from "@/app/lib/pricingPlans";
import { GENERAL_FAQS, WEBSITE_FAQS, REAL_ESTATE_FAQS } from "@/app/lib/faqData";
import { SITE_URL, SITE_DESCRIPTION, CONTACT, SOCIAL_PROFILES, CALENDLY_URL } from "@/app/lib/seo";

export const revalidate = 3600;

const faqBlock = (faqs) => faqs.map(({ question, answer }) => `- **${question}** ${answer}`).join("\n");

export async function GET() {
  const event = await getActiveEvent();
  const prices = withPricingDefaults(event?.prices);
  const discount = event?.offer?.discountPercent > 0 ? event.offer.discountPercent : 0;
  const monthly = (plan) => {
    const price = prices[plan].monthly;
    return discount ? Math.round(price * (1 - discount / 100)) : price;
  };
  const packages = ON_DEMAND_PACKAGES.map(({ id, title }) => `${title} $${prices.packages[id]}`).join(", ");

  const body = `# AfterRender

> ${SITE_DESCRIPTION}

AfterRender is a remote video editing and creative agency serving creators, coaches, agencies and businesses across the United States (all 50 states, including California, New York, Texas and Florida). Clients get a dedicated editor and post-production manager on an unlimited monthly subscription, or buy pay-per-project packages with no subscription.

## Services
- Unlimited video editing: short-form (Instagram Reels, TikTok, YouTube Shorts) and long-form (YouTube, podcasts, webinars, courses)
- Motion graphics and After Effects animation, speed ramps, animated captions, color grading and sound design
- SaaS product demo and explainer videos, video ads and UGC ads
- Real estate video production: scripting, filming twice a week, editing and posting for realtors and local businesses
- Wedding video editing (Plus and Ultra plans)
- Graphic design (Adobe Illustrator or Canva), thumbnails and Lightroom photo editing
- AI avatar videos: a lifelike digital twin that presents, teaches and sells on camera in any language
- Website design and development: custom, fast, SEO-ready business websites, landing pages and e-commerce

## Pricing (USD)
- Unlimited subscription, unlimited requests and revisions: Basic $${monthly("basic")}/mo, Plus $${monthly("plus")}/mo, Ultra $${monthly("ultra")}/mo (billed monthly; quarterly and semi-annual billing cost less per month)
- Average monthly output: Basic 12-30 short-form or 4-8 long-form videos; Plus 24-60 short-form or 8-16 long-form; Ultra 48-110 short-form or 12-24 long-form
- Delivery (standard edits): short-form next day and long-form 1 to 3 days on Basic and Plus; short-form and long-form same day on Ultra
- On Demand packages (no subscription): ${packages}

## Key pages
- [Home](${SITE_URL}/): unlimited video editing, graphic design and AI avatars
- [Pricing](${SITE_URL}/pricing): subscription plans, features and delivery times
- [On Demand pricing](${SITE_URL}/pricing/on-demand): pay-per-project packages
- [Our Work](${SITE_URL}/our-work): video editing portfolio
- [Real Estate video](${SITE_URL}/real-estate): done-for-you video content for local businesses
- [AI Avatars](${SITE_URL}/ai-avatars): AI avatar video service
- [Website design](${SITE_URL}/website): website design and development
- [About](${SITE_URL}/about-us)
- [Blog](${SITE_URL}/blogs): guides on video editing, design and marketing
- [Book a call](${CALENDLY_URL})

## FAQ
${faqBlock(GENERAL_FAQS)}

### Websites
${faqBlock(WEBSITE_FAQS)}

### Real estate and local business video
${faqBlock(REAL_ESTATE_FAQS)}

## Contact
- Phone: ${CONTACT.telephone}
- Address: ${CONTACT.streetAddress}, ${CONTACT.addressLocality}, ${CONTACT.addressRegion} ${CONTACT.postalCode}, United States
- Book a call: ${CALENDLY_URL}
- Social: ${SOCIAL_PROFILES.join(", ")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
