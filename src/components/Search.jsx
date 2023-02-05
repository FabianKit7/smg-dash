import React, {  } from "react";
import { RxCaretRight } from "react-icons/rx"
import SearchBox from "./search/SearchBox";

export default function Search() {

  return (
    <div className="container mx-auto px-6">
      <div className="flex flex-col justify-center items-center mt-12 md:mt-20">
        <div className="flex items-center gap-4 md:gap-5 text-semibold mb-10 text-center">
          <p className="text-primaryblue opacity-40 text-sm font-bold">Select Your Account</p>
          <div className="rounded-[4px] bg-[#D9D9D9] relative w-6 h-[18px] md:w-5 md:h-5 cursor-pointer">
            <RxCaretRight className="absolute text-[#8C8C8C] font-semibold text-[17px]" />
          </div>
          <p className="text-gray20 opacity-40 text-sm font-bold">Complete Setup</p>
          <div className="rounded-[4px] bg-[#D9D9D9] relative w-6 h-[18px] md:w-5 md:h-5 cursor-pointer">
            <RxCaretRight className="absolute text-[#8C8C8C] font-semibold text-[17px]" />
          </div>
          <p className="text-gray20 opacity-40 text-sm font-bold">Enter Dashboard</p>
        </div>

        <div className="grid justify-center items-center">
          <h1 className='font-bold text-black text-[40px] text-center pb-3'>Search your account</h1>
          <p className='font-bold text-sm opacity-40 text-center md:px-[100px]'>Find your Instagram account and start growing followers with Sprouty Social</p>
          <div className="flex justify-center mt-3"><SearchBox /></div>
          <p className='font-bold text-sm opacity-40 text-center md:px-[120px] pt-14'>Don’t worry. You will be able to check if you’ve entered in a correct format in the next step.</p>
        </div>
      </div>
    </div>
  );
}
