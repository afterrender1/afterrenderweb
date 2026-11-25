import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RealEstateHero from "@/components/RealEstateHero";
import RealEstateWhatYouGet from "@/components/RealEstateWhatYouGet";
import RealEstatePackages from "@/components/RealEstatePackages";
import RealEstateProcess from "@/components/RealEstateProcess";
import RealEstateFAQ from "@/components/RealEstateFAQ";
import RealEstateLeadForm from "@/components/RealEstateLeadForm";
import JsonLd from "@/components/JsonLd";
import { REAL_ESTATE_FAQS } from "@/app/lib/faqData";
import {
  KEYWORDS,
  pageMetadata,
  jsonLdGraph,
  webPageJsonLd,
  serviceJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/app/lib/seo";

const TITLE = "Real Estate Video Production, Done For You";
const DESCRIPTION =
  "We write the scripts, film at your location twice a week, edit everything and post it. Done-for-you video content for realtors and local businesses.";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/real-estate",
  keywords: [...KEYWORDS.realEstate, "real estate video editing USA", "realtor video production company"],
});

const RealEstatePage = () => {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-black">
      <JsonLd
        data={jsonLdGraph(
          webPageJsonLd({ path: "/real-estate", name: TITLE, description: DESCRIPTION }),
          serviceJsonLd({
            name: "Real Estate Video Production",
            serviceType: "Real estate video production",
            description: DESCRIPTION,
            path: "/real-estate",
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate Video", path: "/real-estate" },
          ]),
          faqJsonLd(REAL_ESTATE_FAQS, "/real-estate")
        )}
      />
      <Navbar />

      <RealEstateHero />
      <RealEstateWhatYouGet />
      <RealEstatePackages />
      <RealEstateProcess />
      <RealEstateFAQ />
      <RealEstateLeadForm />

      <Footer />
    </main>
  );
};

export default RealEstatePage;
