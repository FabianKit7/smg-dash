import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
// import sproutyLogo from "../images/sprouty.svg";
import { CiDark } from "react-icons/ci"
import { useClickOutside } from "react-click-outside-hook";

export default function Nav() {
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
    <nav className="bg-white shadow-nav py-2" ref={parentRef}>
      <div
        className="container mx-auto px-6 flex justify-between"
      >
        <Link to="/" className="navbar-brand" href="#">
          {/* <img src={sproutyLogo} alt="sprouty social" /> */}
          <div className="font-MADEOKINESANSPERSONALUSE text-[20px] md:text-[25px]">
            <img src="/LogoSprouty2.svg" alt="" className="w-[220px]" />
            {/* <strong className="text-left">SPROUTYSOCIAL</strong> */}
            </div>

        </Link>

        {data?.full_name && <div className="flex justify-center items-center gap-2 md:gap-[10px]">
          {/* <CiDark className="text-[25px] mr-4" /> */}
          <div className="img">
            <Link to="">
              <img
                src={data?.profile_pic_url}
                className="rounded-circle"
                height={32}
                width={32}
                alt={data?.username?.charAt(0)?.toUpperCase()}
                loading="lazy"
              />
            </Link>
          </div>
          <div className="relative font-MontserratRegular">
            <p className="font-semibold cursor-pointer text-sm after:content-['▾'] after:ml-[2px] after:text-lg" onClick={() => setIsOpen(!isOpen)}><span className="hidden md:inline font-MontserratSemiBold">{data?.full_name}</span></p>
            {isOpen && (
              <ul className="absolute z-10 bg-white py-2 shadow-targeting w-36 top-[130%] right-[5%]">
                <Link className="font-normal text-sm" to={"/dashboard/" + data?.user_id}
                  onClick={() => {
                    setIsOpen(!isOpen);
                    setActiveLink("Profile");
                  }}
                >
                  <li className={`py-2 px-6 ${activeLink === "Profile" ? "bg-activelink" : ""}`}>
                    Profile
                  </li>
                </Link>

                <a className="font-normal text-sm" href="/settings"
                  onClick={() => {
                    setIsOpen(!isOpen);
                    setActiveLink("Settings");
                  }}
                >
                  <li className={`py-2 px-6 ${activeLink === "Settings" ? "bg-activelink" : ""}`}>
                    Settings
                  </li>
                </a>

                {data?.admin && <Link className="font-normal text-sm" to={"/admin"}
                  onClick={() => {
                    setIsOpen(!isOpen);
                    setActiveLink("Admin");
                  }}
                >
                  <li className={`py-2 px-6 ${activeLink === "Admin" ? "bg-activelink" : ""}`}>
                    Admin
                  </li>
                </Link>}

                <li className="py-2 px-6 cursor-pointer" onClick={async () => {
                  setIsOpen(!isOpen);
                  await supabase.auth.signOut();
                  window.onbeforeunload = function () {
                    localStorage.clear();
                  }
                  window.location.pathname = "/login";
                }}>
                  <p className="font-normal text-sm" >
                    Log out
                  </p>
                </li>
              </ul>
            )}
          </div>
        </div>}
      </div>
    </nav>
  );
}
