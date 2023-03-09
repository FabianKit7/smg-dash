import React, { } from "react";
import { RxCaretRight } from "react-icons/rx"
import Nav from "./Nav";
import SearchBox from "./search/SearchBox";

export default function Search() {

  return (<>
    <Nav />
    
    <div className="container mx-auto px-6">
      <div className="flex flex-col justify-center items-center mt-12 md:mt-20">
        <div className="flex items-center gap-4 md:gap-5 text-semibold mb-10 text-center font-MontserratSemiBold">
          <p className="text-[#1b89ff] text-xs md:text-sm font-bold">Select Your Account</p>
          <div className="rounded-[4px] bg-[#D9D9D9] relative w-6 h-[18px] md:w-5 md:h-5 cursor-pointer">
            <RxCaretRight className="absolute text-[#8C8C8C] font-semibold text-[17px]" />
          </div>
          <p className="text-[#333] text-xs md:text-sm font-bold">Complete Setup</p>
          <div className="rounded-[4px] bg-[#D9D9D9] relative w-6 h-[18px] md:w-5 md:h-5 cursor-pointer">
            <RxCaretRight className="absolute text-[#8C8C8C] font-semibold text-[17px]" />
          </div>
          <p className="text-[#333] text-xs md:text-sm font-bold">Enter Dashboard</p>
        </div>

        <div className="grid justify-center items-center">
          {/* <h5 className="font-bold text-[2.625rem] text-black font-MADEOKINESANSPERSONALUSE">Create an account</h5>
          <p className="text-center text-[0.75rem] font-MontserratRegular text-[#333]">Start growing <span className="font-bold">~1-10k</span> real and targeted Instagram <br /><span className="font-bold">followers</span> every month.</p> */}


          <h1 className='font-bold text-black font-MADEOKINESANSPERSONALUSE text-[36px] md:text-[40px] text-center pb-3'>Search your account</h1>
          <p className='font-bold text-[0.75rem] font-MontserratRegular text-[#333] text-center md:px-[100px]'>Find your Instagram account and start growing followers with Sprouty Social</p>
          <div className="flex justify-center mt-3"><SearchBox /></div>
          <p className='font-bold text-[0.75rem] font-MontserratRegular text-[#333] text-center md:px-[120px] pt-14'>Don’t worry. You will be able to check if you’ve entered in a correct format in the next step.</p>
        </div>
      </div>
    </div>
  </>);
}
