import React from 'react';

const OfferCard = ({ label, title, subtitle, buttonText, includes }) => {
  return (
    <div className="bg-black/60 backdrop-blur-md rounded-3xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-300 flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <p className="text-gray-400 text-sm mb-4">{label}</p>
        <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {title}
        </h3>
        {subtitle && (
          <p className="text-gray-400 text-base">
            {subtitle}
          </p>
        )}
      </div>

      {/* CTA Button */}
      <button className="w-full bg-gray-900/80 hover:bg-gray-800 text-white font-medium py-4 px-6 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 mb-8">
        {buttonText}
      </button>

      {/* Includes Section */}
      <div className="grow">
        <p className="text-gray-400 text-sm mb-4 font-medium">Includes:</p>
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
      label: "Slots currently open for",
      title: "ONE TIME OFFERS",
      subtitle: "20 FB / IG CREATIVES ( GET CPC,CPL CPA DOWN IN ONE MONTH )",
      buttonText: "I need this",
      includes: [
        "Multiple hook based variation creatives",
        "Proven winning video scripts",
        "Faceless organic creatives",
        "High Quality VSLs",
        "Dedicated UGC/Spokesperson",
        "Recreating already winning ad creative formulas",
        "5 Static Creatives"
      ]
    },
    {
      label: "Slots currently open for",
      title: "YouTube Growth",
      subtitle: "You bring the brand - we'll build you a long-form content powerhouse, completely DFY.",
      buttonText: "I need this",
      includes: [
        "4-6 premium long form videos monthly",
        "SEO and algorithm optimization",
        "Proven content strategy and guidance",
        "Monthly reporting to track your progress",
        "AI driven production + voiceover (optional)"
      ]
    }
  ];

  return (
    <div className="relative min-h-screen bg-black py-20 px-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `/iamges/herobg.png`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-cyan-400 text-sm uppercase tracking-wider mb-4">
            Our Services
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            What We Offer
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choose the perfect package for your business growth
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[950px] mx-auto">
          {offers.map((offer, index) => (
            <OfferCard
              key={index}
              label={offer.label}
              title={offer.title}
              subtitle={offer.subtitle}
              buttonText={offer.buttonText}
              includes={offer.includes}
            />
          ))}
        </div>
      </div>

      {/* Decorative Blur Elements */}
      <div className="absolute top-1/4 left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default OurOffers;