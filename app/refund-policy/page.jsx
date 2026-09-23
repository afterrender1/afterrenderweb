import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { RefreshCcw, CheckCircle2, AlertCircle, Mail, MapPin, Phone } from "lucide-react";

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
  title: "Refund & Cancellation Policy | AfterRender",
  description:
    "Review AfterRender's transparent refund policy, money-back satisfaction guarantee, revision arrangements, and claim process.",
};

export default function RefundPolicyPage() {
  return (
    <main className={`${jakarta.className} min-h-screen bg-[#FAFAFA] text-black pb-8`}>
      <Navbar />

      {/* Header Section */}
      <section className="pt-32 sm:pt-36 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-2.5 text-xs font-bold tracking-widest uppercase text-[#0E4A86] bg-[#F0F6FF] border border-[#D5E6F8] px-3.5 py-1.5 rounded-full w-fit mb-5">
          <RefreshCcw className="w-3.5 h-3.5 text-[#48A2FF]" />
          <span>Client Guarantee</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] tracking-tight leading-[1.15]">
          <span>Refund & </span>
          <span className={`${playfair.className} italic font-normal text-gray-900`}>
            Cancellation Policy
          </span>
        </h1>

        <p className="mt-4 text-gray-600 text-sm sm:text-base leading-relaxed max-w-3xl">
          At AfterRender, our commitment is 100% client satisfaction. We believe in transparent,
          straightforward terms that protect both your creative investment and our studio team.
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
          <span className="text-xs font-bold bg-[#0A2540] text-white px-3.5 py-1.5 rounded-full shadow-2xs">
            Refund Policy
          </span>
          <Link
            href="/terms-conditions"
            className="text-xs font-semibold text-gray-600 hover:text-black bg-white border border-gray-200 hover:border-gray-300 px-3.5 py-1.5 rounded-full transition-all"
          >
            Terms & Conditions
          </Link>
        </div>
      </section>

      {/* Main Content Card */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pb-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-gray-200/90 shadow-[0_10px_35px_rgba(0,0,0,0.03)] space-y-10 text-gray-700 text-sm sm:text-[15px] leading-relaxed">

          {/* 100% Satisfaction Guarantee Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#F0F7FF] via-[#E8F3FF] to-[#D5EAFF] border border-[#B8DCFF]">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0A2540] mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#48A2FF]" />
              <span>100% Satisfaction & Money Back Guarantee</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
              At AfterRender, we are confident in the creative caliber of our video editing and
              design services. If you are not completely satisfied with the initial design or video
              concept provided, a refund claim can be initiated according to the staged arrangements
              below prior to approving revisions or final files.
            </p>
          </div>

          {/* Section 1 */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-3">
              1. Refund Arrangement & Timeframes
            </h2>
            <p>
              All refund requests are handled systematically according to project milestones and
              onboarding status:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0E4A86] block mb-1">
                  Within 48h of Onboarding
                </span>
                <span className="text-2xl font-black text-gray-900 block mb-1">Up to 66%</span>
                <p className="text-xs text-gray-500">
                  Less 10% administrative and account setup expense.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0E4A86] block mb-1">
                  Within 48h of Initial Delivery
                </span>
                <span className="text-2xl font-black text-gray-900 block mb-1">Up to 33%</span>
                <p className="text-xs text-gray-500">
                  Less 10% creative processing fee, before revisions begin.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-xs font-bold uppercase tracking-wider text-red-600 block mb-1">
                  After 96 Hours
                </span>
                <span className="text-2xl font-black text-gray-900 block mb-1">No Refund</span>
                <p className="text-xs text-gray-500">
                  Revisions and customer satisfaction adjustments apply.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-3">
              2. Disqualification & Non-Refundable Scenarios
            </h2>
            <p>
              A refund claim will not be eligible under the following specific circumstances:
            </p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>
                <strong>Concept Approval:</strong> Once you have approved the primary design concept,
                video cut, or shared positive feedback on revisions.
              </li>
              <li>
                <strong>Revision Phase Entered:</strong> Once a project has entered the active
                revision cycle, the refund offer is void. Our team will continue revising until you
                are satisfied.
              </li>
              <li>
                <strong>Final File Delivery:</strong> No refund can be claimed or processed after
                final, high-resolution source files (e.g. 4K renders, project files, vector files)
                have been delivered.
              </li>
              <li>
                <strong>Urgent / Rush Projects:</strong> Priority turnarounds and express design
                deliveries are non-refundable.
              </li>
              <li>
                <strong>Client Inaction & Non-Responsiveness:</strong> If the client goes
                unresponsive for 5 consecutive business days, or remains inactive for more than 7
                working days.
              </li>
              <li>
                <strong>Subjective External Reasons:</strong> Reasons such as change of mind, internal
                business partner disagreements, or business closure do not qualify for a refund.
              </li>
              <li>
                <strong>Bundled Services:</strong> If a client subscribes to a multi-service bundle
                and is dissatisfied with a specific component, refunds are evaluated strictly for
                that individual service and not the entire bundle.
              </li>
              <li>
                <strong>Ancillary Services:</strong> Third-party domain registrations, web hosting,
                and ad spends are non-refundable under any circumstances.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-3">
              3. Design Ownership Post-Refund
            </h2>
            <p>
              Following the issuance of a refund or dispute resolution:
            </p>
            <p className="mt-2 font-medium text-gray-900">
              The client loses all rights, licenses, and permissions to use, display, or reproduce
              any draft concepts, visual assets, or video cuts created by AfterRender. All artwork,
              storyboards, and assets remain the exclusive legal intellectual property of
              AfterRender.
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-3">
              4. Mutual Good Faith & Professional Conduct
            </h2>
            <p>
              Our satisfaction guarantee is rooted in good faith and collaborative partnership.
              Both parties agree to address feedback constructively and professionally. Any
              instances where services are ordered with the pre-meditated intention of claiming
              refunds will be formally declined.
            </p>
          </div>

          {/* Section 5: How To Claim */}
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-3">
              5. How To Claim Your Refund
            </h2>
            <p className="mb-4">
              To submit a formal refund request, please contact our billing department with your
              project ID, order details, and specific creative brief feedback:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#F8FAFC]">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#48A2FF] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <strong className="block text-gray-900 mb-0.5">Billing & Support:</strong>
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
                  <strong className="block text-gray-900 mb-0.5">Direct Line:</strong>
                  <a href="tel:+13076677665" className="text-[#0E4A86] hover:underline font-semibold">
                    +1 (307) 667-7665
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#48A2FF] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <strong className="block text-gray-900 mb-0.5">Headquarters:</strong>
                  30 N Gould St Ste N,<br />
                  Sheridan, WY 82801, USA
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
