"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";

export default function CrispChat() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.$crisp = window.$crisp || [];

      window.$crisp.push([
        "on",
        "chat:opened",
        () => setIsOpen(true),
      ]);

      window.$crisp.push([
        "on",
        "chat:closed",
        () => setIsOpen(false),
      ]);
    }
  }, []);

  const handleOpenChat = () => {
    if (typeof window !== "undefined" && window.$crisp) {
      window.$crisp.push(["do", "chat:open"]);
    }
  };

  return (
    <>
      <Script
        id="crisp-widget-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.$crisp = [];
            window.CRISP_WEBSITE_ID = "2b65f8c8-17b7-4ff3-858f-8e344ef31a0b";
            (function(){
              var d = document;
              var s = d.createElement("script");
              s.src = "https://client.crisp.chat/l.js";
              s.async = 1;
              d.getElementsByTagName("head")[0].appendChild(s);
            })();
          `,
        }}
      />

      {/* Clean & Normal Live Chat Pill */}
      {!isOpen && (
        <button
          type="button"
          onClick={handleOpenChat}
          className="fixed bottom-[22px] right-[80px] sm:right-[86px] z-40 flex items-center gap-2 bg-[#0D111A] text-white text-xs font-semibold px-3.5 py-2 rounded-full border border-white/15 shadow-lg hover:bg-[#141A26] transition-all cursor-pointer select-none"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span>Live Chat</span>
        </button>
      )}
    </>
  );
}
