import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { ShieldCheck, Lock, Mail, MapPin, Phone, CheckCircle2, ArrowRight } from "lucide-react";

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
  title: "Privacy & Compliance Policy | AfterRender",
  description:
    "Learn how AfterRender collects, protects, and handles client personal information and data in full compliance with global standards.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className={`${jakarta.className} min-h-screen bg-[#FAFAFA] text-black pb-8`}>
      <Navbar />

      {/* Header Section */}
      <section className="pt-32 sm:pt-36 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-2.5 text-xs font-bold tracking-widest uppercase text-[#0E4A86] bg-[#F0F6FF] border border-[#D5E6F8] px-3.5 py-1.5 rounded-full w-fit mb-5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#48A2FF]" />
          <span>Legal & Compliance</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] tracking-tight leading-[1.15]">
          <span>Privacy & </span>
          <span className={`${playfair.className} italic font-normal text-gray-900`}>
            Compliance Policy
          </span>
        </h1>

        <p className="mt-4 text-gray-600 text-sm sm:text-base leading-relaxed max-w-3xl">
          At AfterRender, we treat your privacy and business data with the highest standard of
          confidentiality, transparency, and security. Please review our detailed policy below.
        </p>

        {/* Policy Quick Tabs */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-6 pt-6 border-t border-gray-200">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">
            Policies:
          </span>
          <span className="text-xs font-bold bg-[#0A2540] text-white px-3.5 py-1.5 rounded-full shadow-2xs">
            Privacy Policy
          </span>
          <Link
            href="/refund-policy"
            className="text-xs font-semibold text-gray-600 hover:text-black bg-white border border-gray-200 hover:border-gray-300 px-3.5 py-1.5 rounded-full transition-all"
          >
            Refund Policy
          </Link>
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

   
          {/* Section 1 */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-3">
              1. About The Policy
            </h2>
            <p>
              The privacy of our clients is our top priority and we respect it as our own. Even
              though we collect information from our clients, it is strictly to enhance and improve
              our customer support, deliver high-quality video and design assets, and streamline
              collaborative workflows. AfterRender recognizes that the maintenance and secure use of
              our clients’ information is our solemn responsibility.
            </p>
            <p className="mt-3 font-semibold text-gray-900">
              We DO NOT rent, sell, or trade the personal or project information that our clients
              provide to us online under any circumstances.
            </p>
            <p className="mt-3">
              This policy describes how client personal information collected by AfterRender is
              used, why we collect it, and the choices you can make regarding how your data is
              gathered and utilized.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-3">
              2. Personal Information Collected
            </h2>
            <p>
              The information collected by AfterRender includes the client’s name, email address,
              phone number, billing address, and transaction details provided while placing orders,
              subscribing to our services, or scheduling introductory consultations. We may also use
              email addresses received through our communication channels to answer queries, provide
              support, and confirm project milestones.
            </p>
            <p className="mt-3">
              Our company maintains internal records of creative briefs, project history, and online
              service subscriptions to deliver consistent creative direction over time.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-3">
              3. Use of Collected Data
            </h2>
            <p>
              Information collected is applied across diversified, operational methods:
            </p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>Processing video editing, graphic design, and subscription orders efficiently.</li>
              <li>
                Sending order confirmation emails, delivery notifications, and status updates.
              </li>
              <li>
                Contacting clients via email, phone, or communication channels regarding project
                briefs, revisions, or account notifications.
              </li>
              <li>
                Improving our website architecture, user experience, and creative service tiers
                based on client interests.
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-3">
              4. 3rd Party Sharing & Non-Disclosure
            </h2>
            <p>
              Personal information will not be released to external third parties other than our
              own secure operational domains, verified payment gateways, and direct service
              infrastructure necessary to process your subscriptions. There are no circumstances
              under which we provide, license, or sell personal information to external marketers or
              data brokers.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-3">
              5. Communication & Consent Policy
            </h2>
            <p>
              When you provide AfterRender with your contact information (such as an email address or
              phone number), you consent to receive direct service-related communications,
              production updates, and project coordination messages.
            </p>
            <p className="mt-3">
              <strong>Managing Consent & Unsubscribing:</strong> You can withdraw your consent at any
              time by following the unsubscribe instructions included in our emails or by contacting
              our support team at{" "}
              <a
                href="mailto:arham@afterrender.com"
                className="text-[#0E4A86] font-bold underline"
              >
                arham@afterrender.com
              </a>
              .
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-3">
              6. Consumer Data Safety & PCI Compliance
            </h2>
            <p>
              We respect your right to privacy and keep all information provided by you strictly
              confidential. We follow standards set by PCI-DSS and global consumer data protection
              regulations.
            </p>
            <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-xs sm:text-sm text-gray-700">
                <strong>Important Notice:</strong> AfterRender representatives are never authorized
                to ask for raw, unencrypted credit card numbers, passwords, or sensitive financial
                credentials directly over chat, phone, or unverified channels. All payments must be
                processed through our official, encrypted checkout portals.
              </p>
            </div>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-3">
              7. Pseudonym Policy
            </h2>
            <p>
              To maintain the security and privacy of our internal team members, AfterRender may
              utilize operational pseudonyms for support staff and project coordinators. This
              prevents unauthorized disclosure of personal identity data without prior consent and
              ensures smooth, accessible communication for our international clientele.
            </p>
          </div>

          {/* Section 8 */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-3">
              8. Global Production & Development Network
            </h2>
            <p>
              AfterRender operates an international network of specialized video editors, graphic
              designers, and creative production facilities to ensure 24–48 hour rapid delivery
              across multiple time zones. All team members and creative nodes operate under strict
              non-disclosure agreements (NDAs) and rigorous data security protocols.
            </p>
          </div>

          {/* Section 9 */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-3">
              9. Security of Personal Information (SSL / TLS)
            </h2>
            <p>
              All client information is secured during transmission using industry-standard Secure
              Sockets Layer (SSL/TLS) encryption technology. This ensures all payment details,
              uploaded assets, and communications are encrypted and safeguarded from interception.
            </p>
          </div>

          {/* Section 10 */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-3">
              10. Cookies and Their Use
            </h2>
            <p>
              Cookies are small alphanumeric identifiers transferred to your device through your
              web browser. They allow our systems to recognize your preferences, maintain secure
              sessions, and optimize website loading speeds. You may adjust your browser settings to
              refuse cookies; however, enabling them ensures the best interactive experience across
              our platform.
            </p>
          </div>

          {/* Section 11: Official Contact Information */}
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-4">
              11. Contact & Legal Inquiries
            </h2>
            <p className="mb-4">
              If you have any questions or concerns regarding our Privacy Policy or your personal
              data, please contact us directly through our official channels:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#F8FAFC] ">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#48A2FF] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <strong className="block text-gray-900 mb-0.5">Mailing Address:</strong>
                  30 N Gould St Ste N,<br />
                  Sheridan, WY 82801,<br />
                  United States
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#48A2FF] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <strong className="block text-gray-900 mb-0.5">Email Inquiries:</strong>
                  <a
                    href="mailto:arham@afterrender.com"
                    className="text-[#0E4A86] hover:underline"
                  >
                    arham@afterrender.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#48A2FF] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <strong className="block text-gray-900 mb-0.5">Phone Support:</strong>
                  <a href="tel:+13075550123" className="text-[#0E4A86] hover:underline">
                    +1 (307) 555-0123
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
