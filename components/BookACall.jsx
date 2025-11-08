import React from 'react';

const BookACall = () => {
  return (
    <div className="flex justify-center">
      <button
        style={{ fontFamily: "montserrat" }}
        className="cursor-pointer 
                   bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] 
                   text-[#0A2540] font-semibold 
                   px-8 py-3 sm:px-10 sm:py-4 md:px-14 md:py-5 
                   text-lg sm:text-xl md:text-2xl 
                   rounded-lg mt-6 sm:mt-8 md:mt-10 
                   shadow-lg 
                   hover:scale-105 hover:shadow-xl hover:brightness-110 
                   transition-all duration-300"
      >
        Book a Call
      </button>
    </div>
  );
};

export default BookACall;
