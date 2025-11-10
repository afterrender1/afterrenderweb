
import React from "react";
import Image from "next/image";

const TestimonialCard = ({ rating, quote, name, title, img, className }) => {
  return (
    <div
      className={`backdrop-blur-md bg-white/5 border border-white/10 hover:border-[#48A2FF]/60 transition-all duration-500 rounded-3xl p-6 flex flex-col justify-between shadow-lg hover:shadow-[#48A2FF]/20 ${className}`}
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
      <div className="flex items-center gap-4 mt-auto">
        <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#48A2FF] to-[#C9E4FF] flex items-center justify-center text-[#0A1A2F] font-bold text-lg">
         <Image
            loading="lazy"
           src={img}
           alt={name}
           width={48}
           height={48}
           className="rounded-full"
         />
        </div>
        <div>
          <h4 className="text-white font-semibold">{name}</h4>
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
      "What impressed me most about addx is how they weave AI into their creatives. It feels like they're operating one or two years ahead of the market — giving brands and creators a real unfair advantage.",
    name: "Recodemand",
    title: "Dropshipper",
    img: "/images/clients/c5.png",
  },
  {
    rating: 5,
    quote:
      "My mentorship offer went from crickets to $400K/month. ADDX just gets how to make content that prints attention.",
    name: "Casper SMC",
    title: "Trading Creator",
    img: "/images/clients/c.png",
  },
  {
    rating: 5,
    quote:
      "They didn’t just run ads – they really understood our brand and built creatives that actually felt like us.. What stood out most is how they nail not just the video side but also the copywriting — especially important in B2B, where the words matter as much as the visuals",
    name: "Deal fuel",
    title: "Ecom Creator",
    img: "/images/clients/c3.png",
  },
  {
    rating: 5,
    quote:
      "They don't just 'do content' — they run it. I haven't touched a single thing in weeks. Feels like cheating.",
    name: "Make Money Matt",
    title: "MMO Creator",
    img: "/images/clients/c4.png",
  },
  {
    rating: 5,
    quote:
      "If you're in the trading or faceless space, these guys are your unfair advantage. ADDX isn't just another agency—they're operators.",
    name: "AI Guy",
    title: "AI Faceless Content",
    img: "/images/clients/c6.png",
  },
  {
    rating: 5,
    quote:
      "Worked with Abdullah and the squad a few times—never missed. Every drop felt like they knew my brand better than I did.",
    name: "Sebastian Ghiorghiu",
    title: "Digital Entrepreneur",
    img: "/images/clients/c1.png",
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
          <h2 className="text-5xl md:text-[2.8rem] font-bold text-white mb-4" style={{fontFamily : "poppins"}}>
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
