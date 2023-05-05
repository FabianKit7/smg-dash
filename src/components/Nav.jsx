import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
// import sproutyLogo from "../images/sprouty.svg";
import { useClickOutside } from "react-click-outside-hook";
import { FaAngleDown } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineSetting } from "react-icons/ai";
import { MdAdminPanelSettings } from "react-icons/md";
import { BsQuestionOctagon } from "react-icons/bs";

export default function Nav({ setShowWelcomeModal }) {
  const [parentRef, isClickedOutside] = useClickOutside();
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [data, setData] = useState("");
  const [error, setError] = useState(false);
  error && console.log("🚀 ~ file: Nav.jsx:9 ~ Nav ~ error", error);

  useEffect(() => {
    if (isClickedOutside) {
      setIsOpen(false)
    };
  }, [isClickedOutside]);

  useEffect(() => {
    const getData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      // if (!user) return Navigate("/login");
      // console.log("🚀 ~ file: Nav.jsx:31 ~ getData ~ user", user);
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("user_id", user.id);
      // console.log("🚀 ~ file: Dashboard.jsx:34 ~ getData ~ data", data);
      setData(data[0]);
      setError(error);
    };

    getData();
  }, []);

  return (
    <nav className="mb-[30px]" ref={parentRef}>
      <div
        className="flex justify-between items-center mt-2 md:mt-[20px]"
      >
        <Link to="/" className="navbar-brand" href="#">
          {/* <img src={sproutyLogo} alt="sprouty social" /> */}
          <div className="font-MADEOKINESANSPERSONALUSE text-[20px] md:text-[25px]">
            <img alt="" className="md:hidden w-[55px] h-[55px]" src="/logo.png" />
            <img src="/sproutysocial-light.svg" alt="" className="hidden md:inline  w-[346px]" />
            {/* <img src="/LogoSprouty2.svg" alt="" className="w-[220px]" /> */}
            {/* <strong className="text-left">SPROUTYSOCIAL</strong> */}
          </div>

        </Link>

<div className="flex items-center">
        {setShowWelcomeModal && <BsQuestionOctagon size={30} className="cursor-pointer mr-1" fill="blue" onClick={() => setShowWelcomeModal(true)} />}
        {data?.full_name && <div className="flex justify-center items-center md:gap-[10px] p-[10px] cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <img
            src={data?.profile_pic_url}
            className="rounded-full"
            height={32}
            width={32}
            alt={data?.username?.charAt(0)?.toUpperCase()}
            loading="lazy"
          />
          <div className="relative flex items-center gap-2 font-MontserratRegular text-lg">
            <p className="font-semibold cursor-pointer text-sm after:ml-[2px] after:text-lg"><span className="hidden md:inline font-MontserratSemiBold text-lg">@{data?.username}</span></p>
            <FaAngleDown className="hidden md:block" />
            <ul className={`${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} absolute z-10 bg-white py-2 w-[166px] top-[130%] right-[5%] shadow-[0_0_3px_#00000040] rounded-[10px] font-bold font-MontserratBold`}
            style={{
              transition: "opacity .15s ease-in"
            }}
            >
              <Link className="font-normal text-sm hover:bg-[#f8f8f8]" to={"/dashboard/" + data?.user_id}
                onClick={() => {
                  setIsOpen(!isOpen);
                  setActiveLink("Profile");
                }}
              >
                <li className={`py-2 px-6 flex items-center gap-3 ${activeLink === "Profile" ? "bg-activelink" : ""}`}>
                <img
                  src={data?.profile_pic_url}
                  className="rounded-full"
                  height={16}
                  width={16}
                  alt={data?.username?.charAt(0)?.toUpperCase()}
                  loading="lazy"
                />
                  Profile
                </li>
              </Link>

              <Link to="/settings" className="font-normal text-sm hover:bg-[#f8f8f8]"
                onClick={() => {
                  setIsOpen(!isOpen);
                  setActiveLink("Settings");
                }}
              >
                <li className={`py-2 px-6 flex items-center gap-3 ${activeLink === "Settings" ? "bg-activelink" : ""}`}>
                  <AiOutlineSetting size={18} />
                  Settings
                </li>
              </Link>

              {data?.admin && <Link className="font-normal text-sm hover:bg-[#f8f8f8]" to={"/admin"}
                onClick={() => {
                  setIsOpen(!isOpen);
                  setActiveLink("Admin");
                }}
              >
                <li className={`py-2 px-6 flex items-center gap-3 ${activeLink === "Admin" ? "bg-activelink" : ""}`}>
                <MdAdminPanelSettings size={18} />
                  Admin
                </li>
              </Link>}

              <li className="py-2 px-6 cursor-pointer hover:bg-[#f8f8f8] flex items-center gap-3" 
                onClick={async () => {
                  setIsOpen(!isOpen);
                  await supabase.auth.signOut();
                  window.onbeforeunload = function () {
                    localStorage.clear();
                  }
                  window.location.pathname = "/login";
                }}
              >
                <FiLogOut size={18} />
                <p className="font-normal text-sm" >
                  Log out
                </p>
              </li>
            </ul>
          </div>
        </div>}
</div>
      </div>
    </nav>
  );
}
