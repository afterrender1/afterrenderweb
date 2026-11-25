import Home from "@/components/Home";
import JsonLd from "@/components/JsonLd";
import { GENERAL_FAQS } from "@/app/lib/faqData";
import {
  KEYWORDS,
  pageMetadata,
  jsonLdGraph,
  webPageJsonLd,
  servicesJsonLd,
  faqJsonLd,
} from "@/app/lib/seo";

// Event changes revalidate "/" immediately; this is just a safety net
export const revalidate = 600;

const TITLE = "Unlimited Video Editing Services in the USA | AfterRender";
const DESCRIPTION =
  "Unlimited video editing, graphic design and AI avatars for one monthly price. US agency for YouTube, Reels, TikTok, ads and real estate. Unlimited revisions.";

export const metadata = pageMetadata({
  absoluteTitle: TITLE,
  description: DESCRIPTION,
  path: "/",
  keywords: [...KEYWORDS.core, ...KEYWORDS.usa.slice(0, 20), ...KEYWORDS.shortForm.slice(0, 8), ...KEYWORDS.design.slice(0, 3)],
});

export default function page() {
  return (
    <>
      <JsonLd
        data={jsonLdGraph(
          webPageJsonLd({ path: "/", name: TITLE, description: DESCRIPTION }),
          servicesJsonLd(),
          faqJsonLd(GENERAL_FAQS, "/")
        )}
      />
      <div className="scroll-smooth">
        <Home />
      </div>
    </>
  );
}
