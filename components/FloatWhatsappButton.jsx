import React from 'react'

const FloatWhatsappButton = () => {
  return (
    <div
      className="fixed bottom-10 right-5 z-50"
    >
      <a
        href="https://wa.me/923235100033"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        className="block w-14 h-14 rounded-full bg-green-100 hover:bg-green-200 transition-all duration-300 flex items-center justify-center shadow-2xl transform hover:scale-110"
      >
        <img
          src="/logos/wa.png"
          alt="WhatsApp"
          className="w-10 h-10 object-contain"
          width={40}
          height={40}
        />
        
      </a>
    </div>
  )
}

export default FloatWhatsappButton