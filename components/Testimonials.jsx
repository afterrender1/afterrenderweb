
import React from "react";
import Image from "next/image";
import { Urbanist, Playfair_Display } from "next/font/google";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const TestimonialCard = ({ rating, quote, name, title, img, className }) => {
  return (
    <div
      className={`backdrop-blur-md bg-white/5 border border-white/10 hover:border-[#48A2FF]/30 cursor-default transition-all duration-300 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg hover:shadow-[#48A2FF]/15 ${className}`}
    >
      <div className="flex gap-1 mb-2.5">
        {[...Array(rating)].map((_, i) => (
          <span key={i} className="text-white text-base sm:text-lg">★</span>
        ))}
      </div>

      <p className="text-gray-200 text-xs sm:text-sm leading-relaxed mb-4 grow" style={{ fontFamily: "poppins" }}>
        "{quote}"
      </p>

      <div className="flex items-center gap-3 mt-auto">
        <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-white/10">
          <Image
            loading="lazy"
            decoding="async"
            src={img}
            alt={name}
            width={44}
            height={44}
            sizes="44px"
            className="object-cover rounded-full w-10 h-10 sm:w-11 sm:h-11"
          />
        </div>
        <div>
          <h3 className="text-white font-semibold text-xs sm:text-sm">{name}</h3>
          <p className="text-gray-400 text-[11px] sm:text-xs">{title}</p>
        </div>
      </div>

    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      rating: 5,
      quote:
        "What I liked most was how Arham and his team understood the medical space. The videos came out clean, educational, and still engaging — not easy to pull off.",
      name: "Deborah",
      title: "Medical Creator",
      img: "/images/clients/deborah.png",
    },
    {
      rating: 5,
      quote:
        "My content finally looks and feels like my brand. Working with Arham’s team was smooth and easy. They just understand how to speak to coaches.",
      name: "Traction",
      title: "Digital Entrepreneur",
      img: "/images/clients/traction.png",
    },
    {
      rating: 5,
      quote:
        "AfterRender didn’t just make videos; they built a full creative system that fits perfectly with our SaaS funnel. We saw better engagement and lower ad costs within weeks.",
      name: "FinePoint Design and Marketing",
      title: "SaaS Company",
      img: "/images/clients/finep.png",
    },
    {
      rating: 5,
      quote:
        "Arham and his team really get the trading world. Every video hits the right tone with clean edits and high watch time.",
      name: "Crypto Simba",
      title: "Crypto Trader",
      img: "/images/clients/crypto.png",
    },
    {
      rating: 5,
      quote:
        "Loved how simple the process was. I sent my clips, and the final videos came back polished and ready to post.",
      name: "Audrey",
      title: "Fitness Coach",
      img: "/images/clients/metabolic.png",
    },
    {
      rating: 5,
      quote:
        "Super smooth process. I just record, send the footage, and they handle everything else.",
      name: "BigHots",
      title: "YouTube Creator",
      img: "/images/clients/bighot.png",
    },
  ];



  return (
    <section
      className="relative bg-cover bg-center py-10 sm:py-14 px-4 sm:px-6"
    >
      <div className="absolute inset-0"></div>
      <div className="relative max-w-5xl mx-auto z-10 bg-no-repeat bg-contain bg-center" style={{
        backgroundImage: "url('/images/casebg.png')",
      }}>
        <div className="text-center mb-6 sm:mb-10">
          <p className="text-white text-xs font-medium tracking-wider mb-2 sm:mb-3 rounded-full px-3 py-1 inline-block border border-gray-600">
            Client Testimonials
          </p>
          <h2 className={`${urbanist.className} text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight`}>
            Trusted by creators &{" "}
            <span className={`${playfair.className} italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#48A2FF] via-[#7EC0FF] to-[#C9E4FF]`}>
              brands
            </span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm">and there's a good reason why</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
          <TestimonialCard {...testimonials[0]} className="lg:translate-y-2" />
          <TestimonialCard {...testimonials[1]} className="lg:translate-y-4" />
          <TestimonialCard {...testimonials[2]} className="lg:translate-y-1" />
          <TestimonialCard {...testimonials[3]} className="lg:translate-y-3" />
          <TestimonialCard {...testimonials[4]} className="lg:translate-y-1" />
          <TestimonialCard {...testimonials[5]} className="lg:translate-y-4" />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
