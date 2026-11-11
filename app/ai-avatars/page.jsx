import Navbar from "@/components/Navbar";
import AiAvatarsHero from "@/components/AiAvatarsHero";
import AiAvatarsMembership from "@/components/AiAvatarsMembership";
import ShortVideoClientTestimonials from "@/components/ShortVideoClientTestimonials";
import PricingTestimonials from "@/components/PricingTestimonials";
import Footer from "@/components/Footer";
import React from "react";
import { getActiveEvent } from "@/app/lib/heroEvents";

// Event changes revalidate this page immediately; this is just a safety net
export const revalidate = 600;

export const metadata = {
  title: "AI Avatars",
  description:
    "Get a lifelike AI avatar of yourself that presents, teaches and sells on camera. Post more videos every week without filming, in any language.",
  alternates: {
    canonical: "/ai-avatars",
  },
};

const AiAvatarsPage = async () => {
  // Live event background for the hero (null when no event -> default look)
  const event = await getActiveEvent();

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-black pb-8">
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
