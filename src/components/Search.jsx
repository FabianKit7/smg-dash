import React from "react";
// import { RxCaretRight } from "react-icons/rx"
import CrispChat from "./CrispChat";
// import Nav from "./Nav";
// import SearchBox from "./search/SearchBox";
import OnboardingSearchBox from "./search/OnboardingSearchBox";
import { useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useState } from "react";
import { MdLogout } from "react-icons/md";
import { useClickOutside } from "react-click-outside-hook";

export default function Search() {
  const [user, setUser] = useState(null)
  const [showMenu, setShowMenu] = useState(false)
  const [parentRef, isClickedOutside] = useClickOutside();

  useEffect(() => {
    if (isClickedOutside) {
      setShowMenu(false)
    };
  }, [isClickedOutside]);

  useEffect(() => {
    const getData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data } = await supabase
        .from("users")
        .select()
        .eq("user_id", user.id);
      setUser(data?.[0]);
    };

    getData();
  }, []);

  // console.log(user);

  return (<>
    <div id="affiliateScript"></div>
    <CrispChat />

    <div className="text-[#757575] relative">
      <div className="hidden lg:block absolute top-[14px] right-[14px] z-[1] cursor-pointer">
        <div className="flex items-center gap-3" onClick={() => {
          const menu = document.querySelector('#menu')
          if(menu){
            console.log('sdl');
            menu.focus()
          }
          setShowMenu(!showMenu);
        }}>
          <span className=""> {user?.full_name} </span>
          <div className="w-[32px] h-[32px] rounded-full bg-[#23DF85] text-white grid place-items-center">
            <span className="text-[22px] pointer-events-none select-none font-[400] uppercase">{user?.full_name && (user?.full_name)?.charAt(0)}</span>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed top-0 left-0 z-[5] flex items-center justify-between w-full px-5 py-4 gap-2 font-[600] font-MontserratRegular shadow-[0_2px_4px_#00000026]">
        <div className="flex">
          <img alt="" className="w-[36px] h-[36px]" src="/logo.png" />
        </div>
        <div className="w-[32px] h-[32px] rounded-full bg-[#23DF85] text-white grid place-items-center cursor-pointer" onClick={() => {
          const menu = document.querySelector('#menu')
          if (menu) {
            console.log('sdl');
            menu.focus()
          }
          setShowMenu(!showMenu);
        }}>
          <span className="text-[22px] pointer-events-none select-none font-[400] uppercase">{user?.full_name && (user?.full_name)?.charAt(0)}</span>
        </div>
      </div>

      <div id="menu" className={`${!showMenu && 'opacity-0 pointer-events-none hidden'} absolute top-0 lg:top-14 z-10 left-5 lg:left-[unset] right-5 bg-white w-[calc(100%-40px)] lg:w-[350px] lg:max-w-[400px] rounded-[10px] shadow-[0_5px_10px_#0a17530d] transition-[all_.15s_ease-in]`} ref={parentRef} tabIndex="0">
        <div className="flex items-center gap-3 p-5">
          <div className="w-[50px] h-[50px] rounded-full bg-[#23DF85] text-white grid place-items-center">
            <span className="text-[22px] pointer-events-none select-none font-[400] uppercase">{user?.full_name && (user?.full_name)?.charAt(0)}</span>
          </div>
          <div className="">
            <div className="text-black font-bold font-MontserratSemiBold text-[14px]">{user?.username}</div>
            <div className="text-[12px]">{user?.email}</div>
          </div>
        </div>
        <div className="border-t border-[#f8f8f8] flex items-center gap-3 h-[53px] text-black px-5 cursor-pointer hover:bg-blue-gray-100" onClick={async () => {
          setShowMenu(!showMenu)
          await supabase.auth.signOut();
          window.onbeforeunload = function () {
            localStorage.clear();
          }
          window.location.pathname = "/login";
        }}>
          <MdLogout size={22} /> <span className="">Logout</span>
        </div>
      </div>

      <OnboardingSearchBox />
    </div>
  </>)

  // return (<>
  //   <div id="affiliateScript"></div>

  //   <CrispChat />
  //   <Nav />

  //   <div className="container mx-auto px-6">
  //     <div className="flex flex-col justify-center items-center mt-12 md:mt-20">
  //       <div className="flex items-center gap-4 md:gap-5 text-semibold mb-10 text-center font-MontserratSemiBold">
  //         <p className="text-[#1b89ff] text-xs md:text-sm font-bold">Select Your Account</p>
  //         <div className="rounded-[4px] bg-[#D9D9D9] relative w-6 h-[18px] md:w-5 md:h-5 cursor-pointer">
  //           <RxCaretRight className="absolute text-[#8C8C8C] font-semibold text-[17px]" />
  //         </div>
  //         <p className="text-[#333] text-xs md:text-sm font-bold">Complete Setup</p>
  //         <div className="rounded-[4px] bg-[#D9D9D9] relative w-6 h-[18px] md:w-5 md:h-5 cursor-pointer">
  //           <RxCaretRight className="absolute text-[#8C8C8C] font-semibold text-[17px]" />
  //         </div>
  //         <p className="text-[#333] text-xs md:text-sm font-bold">Enter Dashboard</p>
  //       </div>

  //       <div className="grid justify-center items-center">
  //         {/* <h5 className="font-bold text-[2.625rem] text-black font-MADEOKINESANSPERSONALUSE">Create an account</h5>
  //         <p className="text-center text-[0.75rem] font-MontserratRegular text-[#333]">Start growing <span className="font-bold">~1-10k</span> real and targeted Instagram <br /><span className="font-bold">followers</span> every month.</p> */}


  //         <h1 className='font-bold text-black font-MADEOKINESANSPERSONALUSE text-[36px] md:text-[40px] text-center pb-3'>Search your account</h1>
  //         <p className='font-bold text-[0.75rem] font-MontserratRegular text-[#333] text-center md:px-[100px]'>Find your Instagram account and start growing followers with Sprouty Social</p>

  //         <div className="flex justify-center mt-3"><SearchBox /></div>

  //         <p className='font-bold text-[0.75rem] font-MontserratRegular text-[#333] text-center md:px-[120px] pt-14'>Don’t worry. You will be able to check if you’ve entered in a correct format in the next step.</p>
  //       </div>
  //     </div>
  //   </div>
  // </>);
}
