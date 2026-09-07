import Link from 'next/link';
import React from 'react';
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


const OfferCard = ({ label, title, subtitle, buttonText, includes, small }) => {
  return (
    <div
      className={`bg-white/4 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-800/80 transition-all duration-300 flex flex-col 
      ${small ? 'scale-100 lg:scale-[0.98] lg:translate-y-2' : ''}`}
    >
      <div className="mb-3 sm:mb-5" style={{ fontFamily: 'poppins' }}>
        <p className="text-gray-400 font-semibold text-[11px] sm:text-xs mb-1">{label}</p>
        <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">
          {title}
        </h3>
        {subtitle && <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{subtitle}</p>}
      </div>

      <Link href="https://calendly.com/afterrenderagency/new-meeting" target="_blank" rel="noopener noreferrer">
        <button
          style={{ fontFamily: 'poppins' }}
          className="cursor-pointer w-full font-bold 
             bg-black/40 backdrop-blur-md text-white text-xs sm:text-sm
             py-2.5 sm:py-3 px-5 rounded-xl 
             border border-gray-700 
             hover:border-gray-500 
             transition-all duration-300 ease-in-out 
             mb-4 sm:mb-6 hover:scale-[1.01] hover:shadow-md"
        >
          {buttonText}
        </button>
      </Link>

      <div className="grow">
        <p className="text-gray-200 text-xs mb-2.5 font-semibold">Includes:</p>
        <ul className="space-y-2 sm:space-y-2.5">
          {includes.map((item, index) => (
            <li key={index} className="flex items-start gap-2.5">
              <svg
                className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-gray-300 text-xs sm:text-sm leading-snug">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const OurOffers = () => {
  const offers = [
    {
      label: 'Slots currently open for',
      title: 'ONE-TIME OFFER',
      subtitle: '20 Coaching Videos (Get cuts, editing, motion graphics, and design)',
      buttonText: 'I need this',
      includes: [
        'Multiple hook-based video variations',
        'Proven video script templates',
        'Talking head coaching video options',
        'High-quality VSLs (Video Sales Letters)',
        'Recreation of proven, high-performing video styles',
        '40 custom thumbnails (two variations for each video)',
      ],
    },
    {
      label: 'Slots currently open for',
      title: 'YouTube Growth',
      subtitle:
        "You bring the brand - we'll build you a long-form content powerhouse, completely DFY.",
      buttonText: 'I need this',
      includes: [
        '4-6 premium long form videos monthly',
        'SEO and algorithm optimization',
        'Proven content strategy and guidance',
        'Monthly reporting to track your progress',
        'AI driven production + voiceover (optional)',
      ],
    },
  ];

  return (
    <div className="relative bg-black py-10 sm:py-14 px-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('/images/herobg.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black via-black/90 to-black" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-10" style={{ fontFamily: 'poppins' }}>
          <h2
            className={`${urbanist.className} text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1.5 sm:mb-2 tracking-tight`}
          >
            Our{" "}
            <span
              className={`${playfair.className} italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#48A2FF] via-[#7EC0FF] to-[#C9E4FF]`}
            >
              Offers
            </span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto">
            Choose the perfect package for your business growth
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto items-start">
          {offers.map((offer, index) => (
            <OfferCard
              key={index}
              label={offer.label}
              title={offer.title}
              subtitle={offer.subtitle}
              buttonText={offer.buttonText}
              includes={offer.includes}
              small={index === 1}
            />
          ))}
        </div>
      </div>

      <div
        className="absolute 
             md:left-[400px] lg:left-[600px] xl:left-[800px] 2xl:left-[900px]  
             md:top-1/2 lg:top-1/2
             left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
             w-96 h-96 
             bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] 
             rounded-full blur-3xl opacity-40 
             pointer-events-none"
      />
    </div>
  );
};

export default OurOffers;
