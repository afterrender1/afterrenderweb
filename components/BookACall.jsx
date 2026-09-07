import Link from "next/link";
import React from "react";
import { ArrowRight, PhoneCall } from "lucide-react";

const BookACall = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3.5 mt-5 sm:mt-6 w-full max-w-sm mx-auto px-4">
      {/* Book a Call Button */}
      <Link
        href="https://calendly.com/afterrenderagency/new-meeting"
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontFamily: "montserrat" }}
        className="w-full sm:w-auto cursor-pointer 
                 bg-gradient-to-r from-[#48A2FF] to-[#C9E4FF] 
                 text-[#0A2540] font-bold 
                 px-6 py-2.5 sm:px-6 sm:py-2.5 
                 text-xs sm:text-sm whitespace-nowrap
                 rounded-full 
                 shadow-[0_6px_16px_rgba(72,162,255,0.3)] 
                 hover:scale-105 hover:shadow-[0_10px_20px_rgba(72,162,255,0.4)] hover:brightness-110 
                 active:scale-95 
                 transition-all duration-300 
                 flex items-center justify-center gap-2 text-center"
      >
        <PhoneCall className="w-3.5 h-3.5" />
        <span>Book a Call</span>
      </Link>

      {/* See Plans Button */}
      <Link
        href="/pricing"
        style={{ fontFamily: "montserrat" }}
        className="w-full sm:w-auto cursor-pointer 
                 bg-white/10 hover:bg-white/15 
                 text-white font-semibold 
                 border border-white/20 hover:border-white/30 
                 px-6 py-2.5 sm:px-6 sm:py-2.5 
                 text-xs sm:text-sm whitespace-nowrap
                 rounded-full 
                 shadow-sm 
                 hover:scale-105 hover:shadow-md 
                 active:scale-95 
                 backdrop-blur-md 
                 transition-all duration-300 
                 flex items-center justify-center gap-2 text-center group"
      >
        <span>See Plans</span>
        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
};

export default BookACall;
