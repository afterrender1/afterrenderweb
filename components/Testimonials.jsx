
import React from "react";
import Image from "next/image";

const TestimonialCard = ({ rating, quote, name, title, img, className }) => {
  return (
    <div
      className={`backdrop-blur-md bg-white/5 border border-white/10 hover:border-[#48A2FF]/30 cursor-default transition-all duration-500 rounded-3xl p-6 flex flex-col justify-between shadow-lg hover:shadow-[#48A2FF]/20 ${className}`}
    >
      {/* Rating Stars */}
      <div className="flex gap-1 mb-6">
        {[...Array(rating)].map((_, i) => (
          <span key={i} className="text-white text-xl">★</span>
        ))}
      </div>

      {/* Quote */}
      <p className="text-gray-200 text-base leading-relaxed mb-8 grow" style={{fontFamily : "poppins"}}>
        "{quote}"
      </p>

      {/* Author */}
 <div className="flex items-center gap-5 mt-auto">
  <div className="relative w-20 h-20 rounded-full overflow-hidden flex items-center justify-center">
    <Image
      loading="lazy"
      src={img}
      alt={name}
      fill
      className="object-cover rounded-full"
    />
  </div>
  <div>
    <h4 className="text-white font-semibold text-lg">{name}</h4>
    <p className="text-gray-400 text-sm">{title}</p>
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
      className="relative bg-cover bg-center py-20 px-6"
     
    >
      <div className="absolute inset-0 "></div>
      <div className="relative max-w-6xl mx-auto z-10 bg-no-repeat bg-contain bg-center "  style={{
        backgroundImage: "url('/images/herobg.png')",
      }}>
        {/* Heading */}
        <div className="text-center mb-20">
          <p className="text-white text-sm  tracking-wider mb-4 rounded-full px-3 py-1 inline-block border border-gray-600">
            Client Testimonials
          </p>
          <h2 className="text-2xl xs:text-2xl sm:text-3xl md:text-[2.8rem] font-bold text-white mb-4" style={{fontFamily : "poppins"}}>
            Trusted by{" "}
            <span className="text-transparent bg-clip-text tracking-wider bg-linear-to-r from-[#48A2FF] to-[#C9E4FF]">
              creators & <br /> brands
            </span>
          </h2>
          <p className="text-gray-400 text-lg">and there's a good reason why</p>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 w-full">
          <TestimonialCard {...testimonials[0]} className="mb-8 lg:col-span-2" />
          <TestimonialCard {...testimonials[1]} className="mb-26 lg:col-span-2" />
          <TestimonialCard {...testimonials[2]} className="lg:col-span-2" />
          <TestimonialCard {...testimonials[3]} className="mb-10 lg:col-span-2" />
          <TestimonialCard {...testimonials[4]} className="mb-2 lg:col-span-2" />
          <TestimonialCard {...testimonials[5]} className="lg:col-span-2" />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
