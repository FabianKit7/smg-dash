import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
// import sproutyLogo from "../images/sprouty.svg";
import { useClickOutside } from "react-click-outside-hook";
import { FaAngleDown, FaBars } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineSetting } from "react-icons/ai";
import { MdAdminPanelSettings } from "react-icons/md";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

export const locales = [
  { value: 'de', text: "French", flag: '/flag_de-DE.png' },
  { value: 'en', text: "English", flag: '/british_flag.svg' },
]

export default function Nav({ setShowWelcomeModal, userD, admin }) {
  let { username } = useParams();
  const currentUsername = username
  const [parentRef, isClickedOutside] = useClickOutside();
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [data, setData] = useState("");
  const [error, setError] = useState(false);
  const [pending] = useState(false)
  const [accounts, setAccounts] = useState([])
  const langModalRef = useRef(null)
  const [showLangOptions, setShowLangOptions] = useState(false)
  const [openMobileMenu, setOpenMobileMenu] = useState(false)
  const mobileMenuRef = useRef(null)
  error && console.log("🚀 ~ file: Nav.jsx:9 ~ Nav ~ error", error);

  const { t } = useTranslation();

  useEffect(() => {
    if (isClickedOutside) {
      setIsOpen(false)
    };
  }, [isClickedOutside]);

  // langModalRef
  useEffect(() => {
    function handleClickOutside(event) {
      if (langModalRef.current && !langModalRef.current.contains(event.target)) {
        setShowLangOptions(false);
        setOpenMobileMenu(false);
      }
    }

    if (showLangOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLangOptions]);

  // mobileMenuRef
  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setOpenMobileMenu(false);
        setIsOpen(false)
      }
    }

    if (openMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMobileMenu]);


  useEffect(() => {
    const getData = async () => {
      if (!userD) {
        const { data, error } = await supabase.from("users").select().eq('username', currentUsername).single();

        if (error) {
          console.log(error);
          setError(error);
          return;
        }
        setData(data);
      } else {
        setData(userD);
      }

      const getAllAccounts = await supabase.from('users').select().eq('username', currentUsername).order('created_at', { ascending: true })
      setAccounts(getAllAccounts?.data)
    };

    getData();
  }, [currentUsername, userD]);

  const [lng, setLang] = useState({ value: 'de', text: "French", flag: '/french_flag.png' });

  useEffect(() => {
    const lng = localStorage.getItem('lng') || 'de';
    const selectedLang = locales.find(l => l.value === lng)
    setLang(selectedLang)
  }, [])


  const handleChange = e => {
    const el = document.getElementsByTagName('html')[0]
    setLang(e);
    i18next.changeLanguage(e.value)
    localStorage.setItem('lng', e.value);
    el.lang = e.value;
    // window.location.reload();
    setShowLangOptions(false)
  }

  return (
    <nav className="mb-[30px]" ref={parentRef}>
      <div
        className="flex justify-between items-center mt-2 md:mt-[20px]"
      >
        <Link to={`${data?.username ? `/dashboard/${data?.username}` : "/"}`} className="navbar-brand" href="#">
          <div className=" text-[20px] md:text-[25px]">
            <img alt="" className="md:hidden w-[36px] h-[36px]" src="/logo.png" />
            <div className="items-center hidden gap-2 md:flex">
              <img src={'/Socialmediagains-Logo-r.png'} alt="" className="w-[102px] h-[40px]" />
              {/* <img src={LOGO} alt="" className="w-[38px] h-[34.26px]" /> */}
              {/* <b className="text-[32px]">SMG</b> */}
            </div>
          </div>
        </Link>

        <div className="hidden lg:block">
          <ul className="flex items-center gap-3 -mb-2 font-[600] uppercase">
            <NewMenuItems t={t} />
          </ul>
        </div>

        <div className="flex items-center">
          {/* {'1' === '1' && */}
          {setShowWelcomeModal && pending &&
            <span className="fill-black stroke-black font-[none] w-[15px] h-[15px] cursor-pointer" onClick={() => setShowWelcomeModal(true)}>
              <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M15.0003 28.3333C16.7516 28.3356 18.4861 27.9917 20.1041 27.3215C21.722 26.6513 23.1916 25.6679 24.4283 24.428C25.6683 23.1913 26.6517 21.7217 27.3219 20.1037C27.9921 18.4857 28.3359 16.7513 28.3337 15C28.3359 13.2487 27.992 11.5142 27.3218 9.89626C26.6516 8.27829 25.6683 6.80871 24.4283 5.57197C23.1916 4.33199 21.722 3.34864 20.1041 2.67843C18.4861 2.00822 16.7516 1.66437 15.0003 1.66664C13.2491 1.6644 11.5146 2.00827 9.89662 2.67848C8.27865 3.34869 6.80907 4.33202 5.57234 5.57197C4.33238 6.80871 3.34905 8.27829 2.67884 9.89626C2.00864 11.5142 1.66477 13.2487 1.667 15C1.66473 16.7513 2.00858 18.4857 2.67879 20.1037C3.349 21.7217 4.33235 23.1913 5.57234 24.428C6.80907 25.6679 8.27865 26.6513 9.89662 27.3215C11.5146 27.9917 13.2491 28.3355 15.0003 28.3333V28.3333Z" fill="none" stroke-width="2.5" stroke-linejoin="round"></path>
                <path d="M15 18.0833V15.4166C15.7911 15.4166 16.5645 15.182 17.2223 14.7425C17.8801 14.303 18.3928 13.6783 18.6955 12.9474C18.9983 12.2165 19.0775 11.4122 18.9231 10.6363C18.7688 9.86034 18.3878 9.14761 17.8284 8.5882C17.269 8.02879 16.5563 7.64783 15.7804 7.49349C15.0044 7.33915 14.2002 7.41836 13.4693 7.72111C12.7384 8.02386 12.1136 8.53655 11.6741 9.19435C11.2346 9.85214 11 10.6255 11 11.4166" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0007 24.0833C15.4427 24.0833 15.8666 23.9077 16.1792 23.5952C16.4917 23.2826 16.6673 22.8587 16.6673 22.4167C16.6673 21.9746 16.4917 21.5507 16.1792 21.2382C15.8666 20.9256 15.4427 20.75 15.0007 20.75C14.5586 20.75 14.1347 20.9256 13.8221 21.2382C13.5096 21.5507 13.334 21.9746 13.334 22.4167C13.334 22.8587 13.5096 23.2826 13.8221 23.5952C14.1347 23.9077 14.5586 24.0833 15.0007 24.0833Z" stroke="none"></path>
              </svg>
            </span>
          }
          {/* {!admin && <Link className="w-[50px] h-[50px] p-[10px]" to={"/dashboard/" + data?.username + "/manage"}>
            <FiGrid size={30} className="w-[30px] h-[30px]" />
          </Link>} */}

          {process.env.NODE_ENV !== 'production' && <div id="languageSwitcher" ref={langModalRef} className="relative text-sm transition-all bg-[#DBC8BE] rounded-lg">
            <div className="flex items-center gap-2 p-1 cursor-pointer" onClick={() => {
              setShowLangOptions(!showLangOptions)
              setIsOpen(false)
              setOpenMobileMenu(false);
            }}>
              <img src={lng.flag} alt={lng.value} className="w-[20px] h-[20px]" />
              <span className="font-bold capitalize">{lng.value}</span>
              <FaAngleDown />
            </div>

            <div className={`${showLangOptions ? 'flex' : 'hidden'} flex-col gap-1 absolute top-[calc(100%-3px)] pt-3 left-0 w-full z-10 transition-all bg-[#DBC8BE] text-white rounded-b-lg overflow-hidden`}>
              {locales.map(item => {
                return (<div
                  key={`lng-${item.value}`}
                  value={item.value}
                  className="flex items-center gap-3 p-1 cursor-pointer hover:bg-black"
                  onClick={() => {
                    handleChange(item)
                    setShowLangOptions(false);
                  }}>
                  <div className="flex items-center gap-2">
                    <img src={item.flag} alt={item.value} className="w-[20px] h-[20px]" />
                    <span className="uppercase">{item.value}</span>
                  </div>
                </div>);
              })}
            </div>
          </div>}

          {data?.full_name && <div className="flex justify-center items-center md:gap-[10px] p-[10px] cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <img
              src={data?.profile_pic_url}
              className="rounded-full w-[32px] h-[32px]"
              alt={data?.username?.charAt(0)?.toUpperCase()}
              loading="lazy"
            />

            <div className="relative flex items-center gap-2 text-lg ">
              <p className="font-semibold cursor-pointer text-sm after:ml-[2px] after:text-lg"><span className="hidden text-lg lg:inline ">@{data?.username}</span></p>
              {/* <FaAngleDown className="hidden lg:block" /> */}

              <ul className={`hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} absolute z-10 bg-[#DBC8BE] text-white py-2 w-[250px] top-[130%] right-[5%] shadow-[0_0_3px_#1C1A2640] rounded-[10px] `}
                style={{
                  transition: "opacity .15s ease-in"
                }}
              >
                <div className="text-[#757575] px-6 mb-2 text-[16px] font-semibold">
                  {t("Accounts")}
                </div>

                <div className="max-h-[360px] overflow-auto pb-4 flex flex-col">
                  {accounts.map(account => {
                    return (
                      <Link key={`account_nav_${account?.username}`} className="font-normal text-sm hover:bg-black" to={"/dashboard/" + account?.username}
                        onClick={() => {
                          setIsOpen(!isOpen);
                          setActiveLink("Profile");
                        }}
                      >
                        <li className={`py-2 px-6 flex items-center gap-3 ${currentUsername === account?.username ? "bg-activelink" : ""}`}>
                          <img
                            src={account?.profile_pic_url}
                            className="rounded-full w-[32px] h-[32px]"
                            alt={data?.username?.charAt(0)?.toUpperCase()}
                            loading="lazy"
                          />
                          {account?.username}
                        </li>
                      </Link>
                    )
                  })}
                </div>

                {!admin && <div className="">
                  <div className="text-[#757575] px-6 mb-2 text-[16px] font-semibold">Options</div>

                  {/* <Link className="font-normal text-sm cursor-pointer" to={"/dashboard/" + data?.username + "/manage"}
                    onClick={() => {
                      setIsOpen(!isOpen);
                      setActiveLink("Profile");
                    }}
                  >
                    <li className={`py-2 px-6 flex items-center gap-3`}>
                      <FiGrid size={32} className="w-[32px] h-[32px]" />
                      {t('Manage Accounts')}
                    </li>
                  </Link> */}

                  {/* <Link className="font-normal text-sm" to={"/search/?username=add_account"}
                    onClick={() => {
                      setIsOpen(!isOpen);
                      setActiveLink("Profile");
                    }}
                  >
                    <li className={`py-2 px-6 flex items-center gap-3`}>
                      <AiOutlinePlus size={32} className="rounded-full w-[32px] h-[32px]" />
                      {t('Add Account')}
                    </li>
                  </Link> */}

                  <Link to={`/${data?.username}/settings`} className="font-normal text-sm"
                    onClick={() => {
                      setIsOpen(!isOpen);
                      setActiveLink("Settings");
                    }}
                  >
                    <li className={`py-2 px-6 flex items-center gap-3 ${activeLink === "Settings" ? "bg-activelink" : ""}`}>
                      <AiOutlineSetting size={32} className="rounded-full w-[32px] h-[32px]" />
                      {t('Settings')}
                    </li>
                  </Link>

                  {data?.admin && <Link className="font-normal text-sm" to={"/admin"}
                    onClick={() => {
                      setIsOpen(!isOpen);
                      setActiveLink("Admin");
                    }}
                  >
                    <li className={`py-2 px-6 flex items-center gap-3 ${activeLink === "Admin" ? "bg-activelink" : ""}`}>
                      <MdAdminPanelSettings size={32} className="rounded-full w-[32px] h-[32px]" />
                      {t('Admin')}
                    </li>
                  </Link>}

                  <li className="py-2 px-6 cursor-pointer flex items-center gap-3 hover:bg-black"
                    onClick={async () => {
                      setIsOpen(!isOpen);
                      await supabase.auth.signOut();
                      window.onbeforeunload = function () {
                        localStorage.clear();
                      }
                      window.location.pathname = "/search";
                    }}
                  >
                    <FiLogOut size={32} className="rounded-full w-[32px] h-[32px]" />
                    <p className="text-sm font-normal" >
                      {t('Log out')}
                    </p>
                  </li>
                </div>}
              </ul>
            </div>
          </div>}

          <div ref={mobileMenuRef} className="">
            <FaBars className="lg:hidden cursor-pointer" onClick={() => {
              setIsOpen(false)
              setOpenMobileMenu(!openMobileMenu)
              }} />
            <div className="lg:hidden">
              {openMobileMenu && <MobileMenu t={t} />}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}


const NewMenuItems = ({ t }) => {
  return (<>  
    <li className="hover:border-b pb-2"><a href="https://socialmediagains.com/" target="_blank" rel="noreferrer">{t("Home")}</a></li>
    {/* <li className="hover:border-b pb-2"><a href="https://socialmediagains.com/pakete/" target="_blank" rel="noreferrer">{t("PACKAGES & PRICES")}</a></li>
    <li className="hover:border-b pb-2"><a href="https://socialmediagains.com/faq/" target="_blank" rel="noreferrer">{t("FAQ")}</a></li>
    <li className="hover:border-b pb-2"><a href="https://socialmediagains.com/uberuns/" target="_blank" rel="noreferrer">{t("About Us")}</a></li>
    <li className="hover:border-b pb-2"><a href="https://socialmediagains.com/ghost-follower-analyse/" target="_blank" rel="noreferrer">{t("Ghost Analysis")}</a></li>
    <li className="hover:border-b pb-2"><a href="https://socialmediagains.com/affiliate/" target="_blank" rel="noreferrer">{t("Affiliate")}</a></li> */}
    <li className="hover:border-b pb-2"><a href="https://socialmediagains.com/membership/" target="_blank" rel="noreferrer">{t("Membership")}</a></li>
  </>)
}


const MobileMenu = ({ t }) => {
  return (<>
    <div className="absolute z-50 top-[100px] left-0 w-full h-[calc(100vh-100px)] bg-white text-black">
      <ul className="flex flex-col gap-3 font-[600] p-5">
        <NewMenuItems t={t} />
      </ul>
    </div>
  </>)
}