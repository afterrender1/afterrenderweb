import Navbar from "@/components/Navbar";
import AiAvatarsHero from "@/components/AiAvatarsHero";
import AiAvatarsMembership from "@/components/AiAvatarsMembership";
import ShortVideoClientTestimonials from "@/components/VideoClientTestimonials";
import PricingTestimonials from "@/components/PricingTestimonials";
import Footer from "@/components/Footer";
import React from "react";
import { getActiveEvent } from "@/app/lib/heroEvents";
import JsonLd from "@/components/JsonLd";
import { KEYWORDS, pageMetadata, jsonLdGraph, webPageJsonLd, serviceJsonLd, breadcrumbJsonLd } from "@/app/lib/seo";

// Event changes revalidate this page immediately; this is just a safety net
export const revalidate = 600;

const TITLE = "AI Avatar Videos: Your Digital Twin";
const DESCRIPTION =
  "Get a lifelike AI avatar of yourself that presents, teaches and sells on camera. Post more videos every week without filming, in any language.";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/ai-avatars",
  keywords: KEYWORDS.aiAvatars,
});

const AiAvatarsPage = async () => {
  // Live event background for the hero (null when no event -> default look)
  const event = await getActiveEvent();

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-black pb-8">
      <JsonLd
        data={jsonLdGraph(
          webPageJsonLd({ path: "/ai-avatars", name: TITLE, description: DESCRIPTION }),
          serviceJsonLd({
            name: "AI Avatar Videos",
            serviceType: "AI avatar video creation",
            description: DESCRIPTION,
            path: "/ai-avatars",
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "AI Avatars", path: "/ai-avatars" },
          ])
        )}
      />
      <Navbar />
      <AiAvatarsHero backgroundUrl={event?.backgroundUrl} plansId="plans" />

      <AiAvatarsMembership />

      <ShortVideoClientTestimonials isLight={true} />

      <PricingTestimonials
        eyebrow="Testimonials"
        titleMain="Stories from "
        titleItalic="Real Clients."
        subtitle="Creators and brands share what it is like to work with AfterRender."
      />
      <Footer />
    </main>
  );
};

export default AiAvatarsPage;
