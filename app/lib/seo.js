// Central SEO config: site identity, keyword sets, page metadata and JSON-LD (schema.org) builders.
// Pure data/helpers (no DB, no React), safe to import from server pages, route handlers and sitemap.

// Canonical host. Always www: the non-www host 301-redirects here (next.config.mjs).
// Hard-coded on purpose: NEXT_PUBLIC_BASE_URL is the non-www host, which split the
// sitemap/canonical signals between two hosts.
export const SITE_URL = "https://www.afterrender.com";
export const SITE_NAME = "AfterRender";
export const OG_IMAGE = { url: "/og-image.png", width: 1200, height: 630 };
export const LOGO_URL = `${SITE_URL}/logos/logoxar.png`;
export const CALENDLY_URL = "https://calendly.com/afterrenderagency/new-meeting";

export const SITE_DESCRIPTION =
  "AfterRender is a US video editing agency: unlimited video editing, graphic design and AI avatar videos for one flat monthly price. YouTube, Reels, TikTok, ads, SaaS and real estate videos, with fast turnaround and unlimited revisions.";

export const CONTACT = {
  telephone: "+1-307-667-7665",
  streetAddress: "30 N Gould St Ste N",
  addressLocality: "Sheridan",
  addressRegion: "WY",
  postalCode: "82801",
  addressCountry: "US",
};

export const SOCIAL_PROFILES = [
  "https://www.instagram.com/afterrender/",
  "https://www.youtube.com/@AfterRender",
  "https://www.facebook.com/p/AfterRender-61563053082911/",
];

// ---------------------------------------------------------------------------
// Keywords (US search terms). Used for meta keywords per page and for the
// `knowsAbout` / `serviceType` fields of the structured data.
// ---------------------------------------------------------------------------

export const KEYWORDS = {
  core: [
    "video editing services",
    "professional video editing services",
    "video editing agency",
    "video editing company",
    "online video editing services",
    "outsource video editing",
    "hire a video editor",
    "video editor for hire",
    "unlimited video editing",
    "unlimited video editing subscription",
    "video editing subscription",
    "monthly video editing service",
    "video editing retainer",
    "dedicated video editor",
    "done for you video editing",
    "video post production services",
    "post production company",
    "motion graphics services",
    "color grading services",
    "sound design for video",
    "video editing for businesses",
    "corporate video editing",
    "commercial video editing",
    "video ad editing",
    "social media video editing",
    "short form video editing",
    "long form video editing",
    "podcast video editing",
    "video editing for coaches",
    "video editing for agencies",
    "white label video editing",
    "fast video editing turnaround",
    "same day video editing",
    "affordable video editing services",
    "best video editing services",
    "video editing packages",
    "after effects animation services",
    "premiere pro video editing",
    "davinci resolve color grading",
    "freelance video editor alternative",
  ],
  usa: [
    "video editing services USA",
    "video editing services in the United States",
    "American video editing company",
    "US based video editors",
    "video editor USA",
    "video editing services near me",
    "video editing services California",
    "video editor California",
    "video editing Los Angeles",
    "video editor Los Angeles",
    "video editing San Francisco",
    "video editing San Diego",
    "video editing San Jose",
    "video editing services New York",
    "video editor NYC",
    "video editing services Texas",
    "video editing Houston",
    "video editing Dallas",
    "video editing Austin",
    "video editing San Antonio",
    "video editing services Florida",
    "video editing Miami",
    "video editing Orlando",
    "video editing Tampa",
    "video editing services Chicago",
    "video editing services Illinois",
    "video editing Seattle",
    "video editing services Washington",
    "video editing Phoenix",
    "video editing services Arizona",
    "video editing Las Vegas",
    "video editing services Nevada",
    "video editing Denver",
    "video editing services Colorado",
    "video editing Atlanta",
    "video editing services Georgia",
    "video editing Boston",
    "video editing services Massachusetts",
    "video editing Philadelphia",
    "video editing services Pennsylvania",
    "video editing Nashville",
    "video editing services Tennessee",
    "video editing Charlotte",
    "video editing services North Carolina",
    "video editing services New Jersey",
    "video editing services Virginia",
    "video editing Washington DC",
    "video editing services Ohio",
    "video editing services Michigan",
    "video editing services Minnesota",
    "video editing Portland",
    "video editing services Oregon",
    "video editing Salt Lake City",
    "video editing services Utah",
    "video editing services Wyoming",
    "video editing services Maryland",
    "video editing services Indiana",
    "video editing services Missouri",
    "video editing services Wisconsin",
    "video editing services Louisiana",
    "video editing services South Carolina",
    "video editing services Connecticut",
  ],
  shortForm: [
    "short form video editing service",
    "Instagram Reels editing",
    "reels editing service",
    "TikTok video editing",
    "TikTok editor for hire",
    "YouTube Shorts editing",
    "social media video editor",
    "viral short form videos",
    "short video editing for creators",
    "vertical video editing",
    "animated captions for videos",
    "talking head video editing",
    "faceless video editing",
    "content repurposing service",
    "podcast clips editing",
    "long form to short form repurposing",
    "social media content agency",
    "Instagram video editing service",
    "Facebook video ad editing",
    "LinkedIn video editing",
    "UGC ads editing",
    "influencer video editing",
    "personal brand video editing",
    "B-roll editing",
    "speed ramp editing",
  ],
  youtube: [
    "YouTube video editing services",
    "YouTube video editor for hire",
    "YouTube editing agency",
    "YouTube growth agency",
    "long form YouTube editing",
    "YouTube thumbnail design",
    "faceless YouTube channel editing",
    "documentary style YouTube editing",
    "vlog editing service",
    "educational video editing",
    "course video editing",
    "webinar video editing",
    "explainer video editing",
    "SaaS demo video editing",
    "SaaS explainer video",
    "product demo video",
  ],
  realEstate: [
    "real estate video editing",
    "real estate video editor",
    "real estate video production",
    "realtor video marketing",
    "real estate reels",
    "property video editing",
    "listing video editing",
    "real estate drone video editing",
    "luxury real estate videos",
    "real estate agent videos",
    "real estate social media videos",
    "done for you video content",
    "video content for local businesses",
    "real estate marketing videos",
    "realtor content creation",
    "home tour video editing",
    "video production for small businesses",
    "local business video marketing",
  ],
  wedding: [
    "wedding video editing",
    "wedding video editor",
    "wedding film editing",
    "outsource wedding video editing",
    "cinematic wedding edits",
    "wedding highlight video editing",
    "event video editing",
  ],
  design: [
    "unlimited graphic design",
    "graphic design subscription",
    "unlimited graphic design services",
    "social media graphic design",
    "Canva design services",
    "Adobe Illustrator design services",
    "ad creative design",
    "thumbnail design service",
    "Lightroom photo editing",
    "photo editing services",
    "motion graphics design",
    "logo animation",
  ],
  website: [
    "website design services",
    "website development company",
    "custom website design",
    "business website design",
    "small business website design",
    "SEO friendly website",
    "landing page design",
    "ecommerce website development",
    "web design agency USA",
    "responsive website design",
    "website redesign services",
    "fast loading website",
    "conversion focused website",
    "website design for coaches",
    "website for real estate agents",
    "Next.js website development",
  ],
  aiAvatars: [
    "AI avatar videos",
    "AI avatar of yourself",
    "digital twin video",
    "AI video spokesperson",
    "AI clone videos",
    "AI generated videos for business",
    "AI talking head videos",
    "AI video creation service",
    "AI avatar for YouTube",
    "AI avatar for social media",
    "multilingual AI videos",
    "AI video presenter",
    "AI UGC videos",
  ],
  pricing: [
    "video editing pricing",
    "video editing cost",
    "how much does video editing cost",
    "video editing rates",
    "video editing plans",
    "unlimited video editing plans",
    "pay per video editing",
    "on demand video editing",
    "pay as you go video editing",
    "no contract video editing",
    "video editing subscription cost",
    "video editing quote",
  ],
};

export const ALL_KEYWORDS = [...new Set(Object.values(KEYWORDS).flat())];

// ---------------------------------------------------------------------------
// Page metadata
// ---------------------------------------------------------------------------

const absoluteUrl = (path = "/") => (path === "/" ? SITE_URL : `${SITE_URL}${path}`);

// Full metadata for a page: canonical, Open Graph and Twitter card all point at this page.
// `title` gets " | AfterRender" from the root layout template; `absoluteTitle` is used as-is.
// Every page MUST set its own canonical (the root layout no longer sets one).
export function pageMetadata({
  title,
  absoluteTitle,
  description,
  path,
  keywords = [],
  images,
  type = "website",
  noIndex = false,
}) {
  const fullTitle = absoluteTitle || `${title} | ${SITE_NAME}`;
  const ogImages = images || [{ ...OG_IMAGE, alt: fullTitle }];

  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    keywords: [...new Set(keywords)],
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: SITE_NAME,
      locale: "en_US",
      title: fullTitle,
      description,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ogImages.map((image) => image.url),
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

// ---------------------------------------------------------------------------
// JSON-LD (schema.org)
// ---------------------------------------------------------------------------

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
];

const US_CITIES = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio",
  "San Diego", "Dallas", "Austin", "San Jose", "San Francisco", "Seattle", "Denver", "Boston",
  "Nashville", "Miami", "Atlanta", "Las Vegas", "Orlando", "Tampa", "Charlotte", "Portland",
  "Salt Lake City", "Washington, D.C.",
];

// Remote service for the whole US, with states and major cities spelled out for local intent
export const AREA_SERVED = [
  { "@type": "Country", name: "United States" },
  ...US_STATES.map((name) => ({ "@type": "State", name })),
  ...US_CITIES.map((name) => ({ "@type": "City", name })),
];

const SERVICE_CATALOG = [
  ["Video Editing", "Unlimited short-form and long-form video editing for YouTube, Instagram Reels, TikTok, ads and podcasts."],
  ["Short-Form Video Editing", "Reels, TikTok and YouTube Shorts edits with captions, B-roll, speed ramps and motion graphics."],
  ["YouTube Video Editing", "Long-form YouTube editing, thumbnails and channel growth support."],
  ["Motion Graphics & Animation", "After Effects animation, motion graphics and animated captions."],
  ["Real Estate Video Production", "Done-for-you scripting, filming, editing and posting for realtors and local businesses."],
  ["Wedding Video Editing", "Cinematic wedding films and highlight edits."],
  ["Graphic Design", "Social media graphics, ad creatives and thumbnails in Adobe Illustrator or Canva."],
  ["Photo Editing", "Lightroom photography editing."],
  ["AI Avatar Videos", "A lifelike AI avatar of you that presents, teaches and sells on camera in any language."],
  ["Website Design & Development", "Custom, fast and SEO-ready business websites, landing pages and e-commerce stores."],
];

export const organizationJsonLd = () => ({
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  alternateName: ["After Render", "AfterRender Agency"],
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: LOGO_URL, width: 256, height: 256 },
  image: `${SITE_URL}${OG_IMAGE.url}`,
  description: SITE_DESCRIPTION,
  telephone: CONTACT.telephone,
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACT.streetAddress,
    addressLocality: CONTACT.addressLocality,
    addressRegion: CONTACT.addressRegion,
    postalCode: CONTACT.postalCode,
    addressCountry: CONTACT.addressCountry,
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: CONTACT.telephone,
    contactType: "sales",
    areaServed: "US",
    availableLanguage: ["English"],
  },
  areaServed: { "@type": "Country", name: "United States" },
  sameAs: SOCIAL_PROFILES,
  knowsAbout: [
    "Video editing",
    "Short-form video editing",
    "YouTube video editing",
    "Motion graphics",
    "Color grading",
    "Sound design",
    "Real estate video production",
    "Wedding video editing",
    "Graphic design",
    "AI avatar videos",
    "Website design",
    "Social media marketing",
  ],
});

export const websiteJsonLd = () => ({
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  inLanguage: "en-US",
  publisher: { "@id": ORG_ID },
});

// Main service offering (home page): what AfterRender does, for whom and where
export const servicesJsonLd = () => ({
  "@type": "Service",
  "@id": `${SITE_URL}/#video-editing-service`,
  name: "Unlimited Video Editing Services",
  serviceType: "Video editing",
  description: SITE_DESCRIPTION,
  provider: { "@id": ORG_ID },
  url: SITE_URL,
  areaServed: AREA_SERVED,
  audience: { "@type": "BusinessAudience", name: "Creators, coaches, agencies and businesses in the United States" },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "AfterRender services",
    itemListElement: SERVICE_CATALOG.map(([name, description]) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name, description },
    })),
  },
});

// One focused service (sub pages such as /website, /ai-avatars, /real-estate)
export const serviceJsonLd = ({ name, serviceType, description, path }) => ({
  "@type": "Service",
  "@id": `${absoluteUrl(path)}#service`,
  name,
  serviceType,
  description,
  url: absoluteUrl(path),
  provider: { "@id": ORG_ID },
  areaServed: AREA_SERVED,
});

export const breadcrumbJsonLd = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map(({ name, path }, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name,
    item: absoluteUrl(path),
  })),
});

export const faqJsonLd = (faqs, path) => ({
  "@type": "FAQPage",
  "@id": `${absoluteUrl(path)}#faq`,
  mainEntity: faqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
});

export const webPageJsonLd = ({ path, name, description, type = "WebPage" }) => ({
  "@type": type,
  "@id": `${absoluteUrl(path)}#webpage`,
  url: absoluteUrl(path),
  name,
  description,
  inLanguage: "en-US",
  isPartOf: { "@id": WEBSITE_ID },
  about: { "@id": ORG_ID },
});

// Wraps nodes in a single @graph document
export const jsonLdGraph = (...nodes) => ({
  "@context": "https://schema.org",
  "@graph": nodes.filter(Boolean),
});
