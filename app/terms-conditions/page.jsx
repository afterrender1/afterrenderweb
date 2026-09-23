import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { FileText, CheckCircle2, Shield, Scale, Mail, MapPin, Phone } from "lucide-react";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "600", "700"],
});

export const metadata = {
  title: "Terms & Conditions | AfterRender",
  description:
    "Read the terms and conditions governing the use of AfterRender's website, video editing, and graphic design subscription services.",
};

export default function TermsConditionsPage() {
  return (
    <main className={`${jakarta.className} min-h-screen bg-[#FAFAFA] text-black pb-8`}>
      <Navbar />

      {/* Header Section */}
      <section className="pt-32 sm:pt-36 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-2.5 text-xs font-bold tracking-widest uppercase text-[#0E4A86] bg-[#F0F6FF] border border-[#D5E6F8] px-3.5 py-1.5 rounded-full w-fit mb-5">
          <Scale className="w-3.5 h-3.5 text-[#48A2FF]" />
          <span>User Agreement</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] tracking-tight leading-[1.15]">
          <span>Terms & </span>
          <span className={`${playfair.className} italic font-normal text-gray-900`}>
            Conditions
          </span>
        </h1>

        <p className="mt-4 text-gray-600 text-sm sm:text-base leading-relaxed max-w-3xl">
          Please read these terms and conditions carefully before subscribing to our creative
          services. Engaging with AfterRender constitutes your acceptance of this user agreement.
        </p>

        {/* Policy Quick Tabs */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-6 pt-6 border-t border-gray-200">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">
            Policies:
          </span>
          <Link
            href="/privacy-policy"
            className="text-xs font-semibold text-gray-600 hover:text-black bg-white border border-gray-200 hover:border-gray-300 px-3.5 py-1.5 rounded-full transition-all"
          >
            Privacy Policy
          </Link>
          <Link
            href="/refund-policy"
            className="text-xs font-semibold text-gray-600 hover:text-black bg-white border border-gray-200 hover:border-gray-300 px-3.5 py-1.5 rounded-full transition-all"
          >
            Refund Policy
          </Link>
          <span className="text-xs font-bold bg-[#0A2540] text-white px-3.5 py-1.5 rounded-full shadow-2xs">
            Terms & Conditions
          </span>
        </div>
      </section>

      {/* Main Content Card */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pb-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-gray-200/90 shadow-[0_10px_35px_rgba(0,0,0,0.03)] space-y-10 text-gray-700 text-sm sm:text-[15px] leading-relaxed">

          {/* Section 1 */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-3">
              1. Acceptance of Terms & Site Usage
            </h2>
            <p>
              By accessing the website of AfterRender, scheduling calls, placing an order, or
              activating an ongoing monthly subscription, you agree to comply with and be bound by
              these Terms & Conditions. If you do not agree with any part of these terms, please do
              not utilize our services.
            </p>
            <p className="mt-3">
              All website materials, visual demonstrations, icons, and written copy are intellectual
              property owned or licensed by AfterRender and are provided for informational and
              service-evaluation purposes only.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-3">
              2. Intellectual Property & Deliverables
            </h2>
            <p>
              Upon complete payment of all due subscription fees and final project approval, the
              client receives full commercial rights to use the delivered customized video files,
              graphics, and design assets for their business marketing and brand distribution.
            </p>
            <p className="mt-3">
              AfterRender retains the non-exclusive right to display approved client work,
              thumbnails, and video excerpts in its online portfolio, agency reels, and case studies
              unless a strict custom Non-Disclosure Agreement (NDA) has been formally signed prior
              to project commencement.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-3">
              3. Quality Assurance & Unlimited Revisions
            </h2>
            <p>
              We pride ourselves on studio-caliber craftsmanship. Our unlimited revisions policy
              guarantees that within the active scope of your subscribed tier, our editors and
              designers will continue refining your drafts until you are satisfied.
            </p>
            <p className="mt-3">
              Turnaround on standard revisions is typically 24–48 hours. Revisions requiring
              completely new creative briefs or shifting from one service type to another outside
              the selected package will be treated as new requests.
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-3">
              4. Turnaround & Delivery Standards
            </h2>
            <p>
              Most standard requests (such as short-form videos, single reels, or static ad
              creatives) are delivered within 24 to 48 business hours (Monday to Friday). Complex
              motion graphic sequences, long-form podcast edits, or multi-page slide decks may require
              additional production time based on scope complexity.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-3">
              5. Official Communication Policy
            </h2>
            <p>
              To protect both our clients and our studio, AfterRender is only responsible for
              communications, project confirmations, and financial agreements conducted via our
              verified company channels:
            </p>
            <ul className="mt-2 space-y-1.5 list-disc pl-5">
              <li>Official Domain Emails ending in <strong>@afterrender.com</strong></li>
              <li>Official Project Portals, Trello, or Slack workspace links provided by our team.</li>
              <li>Direct telephone lines listed on our official website.</li>
            </ul>
            <p className="mt-3 text-xs text-gray-500">
              We are not responsible for communications or transactions conducted through unofficial
              third-party accounts or unauthorized representatives.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-3">
              6. Record Maintenance & File Archival
            </h2>
            <p>
              AfterRender maintains digital records and cloud backups of completed, approved client
              projects for a reasonable operational period. However, we advise clients to download
              and locally back up their high-resolution master files upon delivery.
            </p>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-3">
              7. Applicable Law & Jurisdiction
            </h2>
            <p>
              These Terms & Conditions and any related service contracts are governed by and
              construed in accordance with the laws of the State of Wyoming, United States of
              America, without regard to conflict of law principles. Any legal proceedings or
              disputes shall be resolved in the state or federal courts situated in Wyoming, USA.
            </p>
          </div>

          {/* Section 8: Official Contact Information */}
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-3">
              8. Contact & Legal Notices
            </h2>
            <p className="mb-4">
              For any notices, contract inquiries, or legal documentation, please contact our
              management team:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#F8FAFC]">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#48A2FF] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <strong className="block text-gray-900 mb-0.5">Corporate Office:</strong>
                  30 N Gould St Ste N,<br />
                  Sheridan, WY 82801,<br />
                  United States
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#48A2FF] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <strong className="block text-gray-900 mb-0.5">Legal & Inquiries:</strong>
                  <a
                    href="mailto:arham@afterrender.com"
                    className="text-[#0E4A86] hover:underline font-semibold"
                  >
                    arham@afterrender.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#48A2FF] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <strong className="block text-gray-900 mb-0.5">Telephone:</strong>
                  <a href="tel:+13076677665" className="text-[#0E4A86] hover:underline font-semibold">
                    +1 (307) 667-7665
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer theme="light" />
    </main>
  );
}
