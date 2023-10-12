import React from "react";
// import { RxCaretRight } from "react-icons/rx"
// import CrispChat from "./CrispChat";
// import Nav from "./Nav";
// import SearchBox from "./search/SearchBox";
import OnboardingSearchBox from "./search/OnboardingSearchBox";
import { useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useState } from "react";
import { MdLogout } from "react-icons/md";
import { useClickOutside } from "react-click-outside-hook";
import { LangSwitcher } from "./Login";
import { useTranslation } from "react-i18next";

export default function Search() {
  const { t } = useTranslation();
  const urlParams = new URLSearchParams(window.location.search);
  const currentUsername = urlParams.get("username");
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
    {/* <CrispChat /> */}

    <div className="bg-black text-[#757575]-r text-white relative">
      <div className="max-w-[1600px] mx-auto ">
        <div className="hidden absolute top-[14px] right-[14px] z-[1] bg-[#242424] rounded-[30px] lg:flex">
          <LangSwitcher />

          <div className="w-1 my-auto h-[20px] mr-3 bg-white border-2 border-white"></div>

          <div className="flex items-center gap-3 cursor-pointer" onClick={() => {
            setShowMenu(!showMenu);
          }}>
            <span className=""> {user?.full_name} </span>
            <div className={`${showMenu && ' border-red-300'} border-2 rounded-full`}>
              <div className={`w-[32px] h-[32px] rounded-full button-gradient text-white grid place-items-center`}>
                <span className="text-[22px] pointer-events-none select-none font-[400] uppercase">{user?.full_name && (user?.full_name)?.charAt(0)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden bg-black fixed top-0 left-0 z-[5] flex items-center justify-between w-full px-5 py-4 gap-2 font-[600]  shadow-[0_2px_4px_#00000026]" onClick={() => {
          showMenu && setShowMenu(false);
        }}>
          <div className="flex">
            <img alt="" className="w-[36px] h-[36px]" src="/logo.png" />
          </div>
          <div className="flex items-center">
            <LangSwitcher />
            <div className={`${showMenu && ' border-red-300'} border-2 rounded-full`}>
              <div className={`w-[32px] h-[32px] rounded-full button-gradient text-white grid place-items-center cursor-pointer`} onClick={() => {
                setShowMenu(!showMenu);
              }}>
                <span className={`text-[22px] pointer-events-none select-none font-[400] uppercase`}>{user?.full_name && (user?.full_name)?.charAt(0)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`${!showMenu && 'opacity-0 pointer-events-none hidden'} absolute top-0 left-0 w-full h-screen z-10`}>
          <div className="absolute top-0 left-0 z-10 w-full h-screen cursor-pointer bg-black/0" onClick={() => {
            setShowMenu(!showMenu);
          }}></div>
          <div className={`${!showMenu && 'opacity-0 pointer-events-none hidden'} absolute top-0 lg:top-14 z-10 left-5 lg:left-[unset] right-5 bg-black w-[calc(100%-40px)] lg:w-[350px] lg:max-w-[400px] rounded-[10px] shadow-[0_5px_10px_#0a17530d] transition-all duration-150 ease-in`} ref={parentRef} tabIndex={0}>
            <div className="flex items-center gap-3 p-5">
              <div className="w-[50px] h-[50px] rounded-full button-gradient text-white grid place-items-center">
                <span className="text-[22px] pointer-events-none select-none font-[400] uppercase">{user?.full_name && (user?.full_name)?.charAt(0)}</span>
              </div>
              <div className="">
                <div className="text-black-r font-bold  text-[14px]">{user?.full_name}</div>
                <div className="text-[12px]">{user?.email}</div>
              </div>
            </div>

            <div className="border-t border-[#f8f8f8] flex items-center gap-3 h-[53px] text-black-r px-5 cursor-pointer hover:bg-[#333333]" onClick={async () => {
              setShowMenu(!showMenu)
              await supabase.auth.signOut();
              window.onbeforeunload = function () {
                localStorage.clear();
              }
              window.location.pathname = "/search";
            }}>
              <MdLogout size={22} /> <span className="">{t("Logout")}</span>
            </div>
          </div>
        </div>

        <OnboardingSearchBox user={user} currentUsername={currentUsername} />
      </div>
    </div>
  </>)
}
