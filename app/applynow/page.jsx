import React from "react";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Clock3, PhoneCall, Globe, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Book a Consultation | AfterRender",
  description:
    "Speak with our publishing team and get personalised guidance on editing, cover design, printing, distribution and marketing options for your book.",
};

const ApplyNowPage = () => {
  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between selection:bg-[#48A2FF]/30">
      <Navbar />

      <main className="pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 flex-1 max-w-7xl mx-auto w-full flex flex-col justify-center">
        {/* Subtle Ambient Background Mesh */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-radial from-[#48A2FF]/10 via-[#48A2FF]/5 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Calendly Embed */}
          <div className="lg:col-span-7 order-2 lg:order-1 bg-[#0D111A]/90 border border-white/[0.08] rounded-3xl p-3 sm:p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md overflow-hidden">
            <div
              className="calendly-inline-widget w-full rounded-2xl overflow-hidden"
              data-url="https://calendly.com/afterrenderagency/30min?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=0d111a&text_color=ffffff&primary_color=48a2ff"
              style={{ minWidth: "320px", height: "700px" }}
            />
          </div>

          {/* Right Column: High-End Agency Info Panel */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col">
            <div className="bg-[#0D111A]/90 border border-white/[0.08] rounded-3xl p-6 sm:p-8 lg:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md flex flex-col justify-between">
              <div>
                {/* Live Availability Status */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#48A2FF]/10 border border-[#48A2FF]/20 text-[#C9E4FF] text-xs font-medium mb-6">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Calendar open for this week</span>
                </div>

                {/* Main Heading */}
                <h1
                  className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-white tracking-tight leading-[1.2] mb-4"
                  style={{ fontFamily: "poppins" }}
                >
                  Let’s Plan Your{" "}
                  <span
                    className="text-transparent bg-clip-text bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF]"
                    style={{ fontFamily: "michroma" }}
                  >
                    Book Publishing
                  </span>{" "}
                  Journey
                </h1>

                {/* Subtitle Description */}
                <p className="text-gray-400 text-sm sm:text-[15px] leading-relaxed mb-8">
                  Speak with our publishing team and get personalised guidance on
                  editing, cover design, printing, distribution and marketing
                  options for your book.
                </p>

                {/* Feature Highlights Grid */}
                <div className="space-y-3.5 mb-8">
                  {/* Item 1 */}
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-[#48A2FF]/30 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-[#48A2FF]/10 border border-[#48A2FF]/20 flex items-center justify-center shrink-0 text-[#48A2FF] mt-0.5">
                      <Clock3 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        30 Minute Consultation
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5 leading-normal">
                        Focused 1-on-1 strategy & roadmap planning
                      </p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-[#48A2FF]/30 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-[#48A2FF]/10 border border-[#48A2FF]/20 flex items-center justify-center shrink-0 text-[#48A2FF] mt-0.5">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Phone Call Meeting
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5 leading-normal">
                        Direct conversation over phone or Zoom
                      </p>
                    </div>
                  </div>

             
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Script
        type="text/javascript"
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />

      <Footer />
    </div>
  );
};

export default ApplyNowPage;