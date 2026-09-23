"use client";

import React, { useState, useEffect, useRef } from "react";
import { Loader, Calendar } from "lucide-react";
import { Urbanist, Playfair_Display } from "next/font/google";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const CALENDLY_SRC =
  "https://calendly.com/afterrenderagency/new-meeting?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=0b0f17&text_color=ffffff&primary_color=48a2ff";

const WorkWithUs = () => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // If URL already has #contact hash, load immediately
    if (typeof window !== "undefined" && window.location.hash === "#contact") {
      setShouldLoad(true);
      return;
    }

    // Lazy load the iframe when user scrolls within 300px of this section
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "300px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative bg-black text-white py-16 sm:py-20 lg:py-24 px-4 sm:px-6 overflow-hidden"
      style={{
        backgroundImage: "url('/images/casebg.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="relative max-w-5xl mx-auto z-10">
        {/* ==========================================
            SECTION HEADER
            ========================================== */}
        <div className="text-center mb-8 sm:mb-12">
          <h2
            className={`${urbanist.className} text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight`}
          >
            <span>Work </span>
            <span
              className={`${playfair.className} italic font-normal text-[#F4EBD9]`}
            >
              With Us
            </span>
          </h2>
          <p className="mt-3.5 text-gray-400 text-xs sm:text-sm md:text-[15px] leading-relaxed max-w-md mx-auto font-normal">
            Book an intro call to walk through your launch.
            <br />
            We take a limited number of projects each month.
          </p>
        </div>

        <div className="relative max-w-2xl sm:max-w-3xl mx-auto bg-[#0B0F17]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          {/* Subtle top specular accent highlight */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-10" />

          <div className="relative w-full min-h-[640px] sm:min-h-[690px] bg-[#0B0F17] flex items-center justify-center">
            {!shouldLoad ? (
              /* Performance placeholder before scrolling near contact */
              <div className="flex flex-col items-center justify-center p-8 text-center max-w-md z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-[#48A2FF]">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="text-white text-lg font-bold mb-2">
                  Schedule an Intro Meeting
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-6">
                  Select a date and time that works best for you.
                </p>
                <button
                  type="button"
                  onClick={() => setShouldLoad(true)}
                  className="bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] text-[#0A2540] font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Open Calendar Now
                </button>
              </div>
            ) : (
              <>
                {/* Subtle Loading Spinner while iframe initializes */}
                {!iframeLoaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-400 z-10">
                    <Loader className="w-6 h-6 animate-spin text-[#48A2FF]" />
                    <span className="text-xs font-medium tracking-wide">
                      Loading Schedule Calendar...
                    </span>
                  </div>
                )}

                {/* Calendly Interactive Iframe with lazy loading */}
                <iframe
                  src={CALENDLY_SRC}
                  width="100%"
                  height="100%"
                  loading="lazy"
                  frameBorder="0"
                  title="Schedule an Intro Call with AfterRender"
                  onLoad={() => setIframeLoaded(true)}
                  className="w-full h-full min-h-[640px] sm:min-h-[750px] rounded-2xl"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkWithUs;
