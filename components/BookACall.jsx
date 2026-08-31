import Link from "next/link";
import React from "react";
import { ArrowRight, PhoneCall } from "lucide-react";

const BookACall = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 w-full max-w-md mx-auto px-4">
      {/* Book a Call Button */}
      <Link
        href="https://calendly.com/afterrenderagency/new-meeting"
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontFamily: "montserrat" }}
        className="w-full sm:w-auto cursor-pointer 
                 bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] 
                 text-[#0A2540] font-bold 
                 px-6 py-2.5 sm:px-7 sm:py-3 
                 text-xs sm:text-sm 
                 rounded-4xl 
                 shadow-[0_8px_20px_rgba(72,162,255,0.35)] 
                 hover:scale-105 hover:shadow-[0_12px_25px_rgba(72,162,255,0.45)] hover:brightness-110 
                 active:scale-95 
                 transition-all duration-300 
                 flex items-center justify-center gap-2 text-center"
      >
        <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span>Book a Call</span>
      </Link>

      {/* See Plans Button */}
      <Link
        href="/pricing"
        style={{ fontFamily: "montserrat" }}
        className="w-full sm:w-auto cursor-pointer 
                 bg-white/10 hover:bg-white/15 
                 text-white font-semibold 
                 border border-white/20 hover:border-white/40 
                 px-6 py-2.5 sm:px-7 sm:py-3 
                 text-xs sm:text-sm 
                 rounded-4xl 
                 shadow-md 
                 hover:scale-105 hover:shadow-lg 
                 active:scale-95 
                 backdrop-blur-md 
                 transition-all duration-300 
                 flex items-center justify-center gap-2 text-center group"
      >
        <span>See Plans</span>
        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
};

export default BookACall;
