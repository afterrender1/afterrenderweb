import React from 'react';

const OfferCard = ({ label, title, subtitle, buttonText, includes, small }) => {
  return (
    <div
      className={`bg-white/4 backdrop-blur-md rounded-3xl p-8 border border-gray-900 transition-all duration-300 flex flex-col 
      ${small ? 'scale-[0.95] lg:translate-y-6' : ''}`} // 👈 slightly smaller and shifted
    >
      {/* Header */}
      <div className="mb-8" style={{ fontFamily: 'poppins' }}>
        <p className="text-gray-400 font-semibold text-base mb-4">{label}</p>
        <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {title}
        </h3>
        {subtitle && <p className="text-gray-400 text-base">{subtitle}</p>}
      </div>

      {/* CTA Button */}
      <button
        style={{ fontFamily: 'poppins' }}
        className="cursor-pointer w-full font-bold 
             bg-black/25 backdrop-blur-md text-white text-xl 
             py-4 px-6 rounded-2xl 
             border border-gray-700 
             hover:border-gray-500 
             transition-all duration-300 ease-in-out 
             mb-8 hover:scale-[1.02] hover:shadow-lg"
      >
        {buttonText}
      </button>

      {/* Includes Section */}
      <div className="grow">
        <p className="text-gray-200 text-sm mb-4 font-medium">Includes:</p>
        <ul className="space-y-3">
          {includes.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-white mt-0.5 shrink-0"
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
              <span className="text-white text-base">{item}</span>
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
      title: 'ONE TIME OFFERS',
      subtitle:
        '20 FB / IG CREATIVES ( GET CPC,CPL CPA DOWN IN ONE MONTH )',
      buttonText: 'I need this',
      includes: [
        'Multiple hook based variation creatives',
        'Proven winning video scripts',
        'Faceless organic creatives',
        'High Quality VSLs',
        'Dedicated UGC/Spokesperson',
        'Recreating already winning ad creative formulas',
        '5 Static Creatives',
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
    <div className="relative min-h-screen bg-black py-20 px-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('/images/herobg.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black via-black/90 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16" style={{ fontFamily: 'poppins' }}>
          <h2
            className="text-4xl md:text-5xl lg:text-[2.8rem] font-bold text-white mb-4"
          >
            Our{' '}
            <span
              className="text-transparent bg-clip-text tracking-wider bg-linear-to-r from-[#48A2FF] to-[#C9E4FF]"
              style={{ fontFamily: 'michroma' }}
            >
              Offers
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choose the perfect package for your business growth
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[960px] mx-auto items-start">
          {offers.map((offer, index) => (
            <OfferCard
              key={index}
              label={offer.label}
              title={offer.title}
              subtitle={offer.subtitle}
              buttonText={offer.buttonText}
              includes={offer.includes}
              small={index === 1} // 👈 make 2nd card slightly smaller
            />
          ))}
        </div>
      </div>

      {/* Decorative Blur Elements */}
   <div className="absolute top-1/2 left-180 w-96 h-96 bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] rounded-full blur-3xl opacity-40 pointer-events-none" />

    </div>
  );
};

export default OurOffers;
