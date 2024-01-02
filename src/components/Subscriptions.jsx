import Axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { TbRefresh } from "react-icons/tb";
import axios from 'axios'
// import CrispChat from "./CrispChat";
import { MdLogout } from "react-icons/md";
import { useClickOutside } from "react-click-outside-hook";
// import { FaAngleLeft } from "react-icons/fa";
import AlertModal from './AlertModal'
// import { useRef } from "react";
// import { CardComponent, CardNumber, CardExpiry, CardCVV } from "@chargebee/chargebee-js-react-wrapper"
// import { getRefCode, uploadImageFromURL } from "../helpers";
import { getRefCode } from "../helpers";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BACKEND_URL, NOT_CONNECTED_TEMPLATE, SUBSCRIPTION_PLANS, X_RAPID_API_HOST, X_RAPID_API_KEY } from "../config";
import { useTranslation } from 'react-i18next';
import { LangSwitcher } from "./Login";
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// const urlEncode = function (data) {
//   var str = [];
//   for (var p in data) {
//     if (data.hasOwnProperty(p) && (!(data[p] === undefined || data[p] == null))) {
//       str.push(encodeURIComponent(p) + "=" + (data[p] ? encodeURIComponent(data[p]) : ""));
//     }
//   }
//   return str.join("&");
// }

export default function Subscriptions() {
  const { t } = useTranslation()
  const [user, setUser] = useState(null)
  const [showMenu, setShowMenu] = useState(false)
  const [parentRef, isClickedOutside] = useClickOutside();
  const [errorMsg, setErrorMsg] = useState({ title: 'Alert', message: 'something went wrong' })
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod] = useState({ id: 1, name: 'card' })
  const [Loading, setLoading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState({ planId: "", name: 'Monthly' })

  // set default selectedPlan
  useEffect(() => {
    const plan = SUBSCRIPTION_PLANS.find(plan => plan.name === 'Monthly')
    setSelectedPlan(plan)
  }, [])

  // setIsDesktop
  useEffect(() => {
    setIsDesktop(window.innerWidth > 768);
    // Update the isDesktop state when the window is resized
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768); // Adjust the threshold as needed
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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

  var { username } = useParams();
  const [userResults, setUserResults] = useState(null);
  const navigate = useNavigate();

  // clearCookies
  useEffect(() => {
    var cookies = document.cookie.split("; ");
    for (var c = 0; c < cookies.length; c++) {
      var d = window.location.hostname.split(".");
      while (d.length > 0) {
        var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
        var p = window.location.pathname.split('/');
        document.cookie = cookieBase + '/';
        while (p.length > 0) {
          document.cookie = cookieBase + p.join('/');
          p.pop();
        };
        d.shift();
        // console.log('done');
      }
    }
  }, [])

  const getData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) navigate('/');
    const options = {
      method: "GET",
      url: "https://instagram-bulk-profile-scrapper.p.rapidapi.com/clients/api/ig/ig_profile",
      params: { ig: username, response_type: "short", corsEnabled: "true" },
      headers: {
        "X-RapidAPI-Key": X_RAPID_API_KEY,
        "X-RapidAPI-Host": X_RAPID_API_HOST,
      },
    };

    try {
      const response = await Axios.request(options);
      setUserResults(response?.data?.[0]);
    } catch (error) {
      console.log(error)
    }
  }, [navigate, username]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      <AlertModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        title={errorMsg?.title}
        message={errorMsg?.message}
      />
      <div id="affiliateScript"></div>
      {/* <CrispChat /> */}

      <script src="https://js.chargebee.com/v2/chargebee.js"></script>

      <div className="bg-white-r text-[#757575]-r bg-black text-white relative">
        <div className="max-w-[1600px] mx-auto">
          <div className="hidden absolute top-[14px] right-[14px] z-[1] bg-[#242424] rounded-[30px] pl-4 lg:flex">
            <LangSwitcher />

            <div className="w-1 my-auto h-[20px] mr-3 bg-white border-2 border-white"></div>

            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => {
                setShowMenu(!showMenu);
              }}
            >
              <span className=""> {user?.full_name} </span>
              <div
                className={`${showMenu && ' border-red-300'
                  } border-2 rounded-full`}
              >
                <div
                  className={`w-[32px] h-[32px] rounded-full button-gradient text-white grid place-items-center`}
                >
                  <span className="text-[22px] pointer-events-none select-none font-[400] uppercase">
                    {user?.full_name && user?.full_name?.charAt(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* mobile start */}
          <div className="lg:hidden">
            <div
              className="fixed h-[65px] top-0 left-0 z-[50] bg-[#242424] flex items-center justify-between w-full px-5 py-4 gap-2 font-[600]  shadow-[0_2px_4px_#00000026]"
              onClick={() => {
                showMenu && setShowMenu(false);
              }}
            >
              <div className="flex">
                <img alt="" className="w-[36px] h-[36px]" src="/logo.png" />
              </div>
              <div className="flex items-center">
                <LangSwitcher />
                <div
                  className={`${showMenu && ' border-red-300'
                    } border-2 rounded-full`}
                >
                  <div
                    className={`w-[32px] h-[32px] rounded-full button-gradient text-white grid place-items-center cursor-pointer`}
                    onClick={() => {
                      setShowMenu(!showMenu);
                    }}
                  >
                    <span
                      className={`text-[22px] pointer-events-none select-none font-[400] uppercase`}
                    >
                      {user?.full_name && user?.full_name?.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-[65px] mb-[150px]">
              <div className="bg-white lg:hidden">
                <div className="flex flex-col gap-[1px]">
                  <div className="border-l-8 border-l-[#dbc8be] border-b h-[54px] pr-[20px] pl-3 flex items-center justify-between w-full bg-black">
                    <div className="flex items-center gap-[10px]">
                      <img
                        src={userResults?.profile_pic_url}
                        alt=""
                        className="w-[38px] h-[38px] rounded-full border-2 border-white"
                      />
                      <div className="flex flex-col">
                        <div className="text-[12px] -mb-1">{t("Account")}:</div>
                        <div className="text-[14px] text-black-r font-bold ">
                          @{userResults?.username}
                        </div>
                      </div>
                    </div>

                    <TbRefresh className="cursor-pointer" onClick={() => { navigate(`/search`) }} />
                  </div>

                  <div className="border-l-8 border-l-[#dbc8be] border-b h-[54px] pr-[20px] pl-3 flex items-center justify-between w-full bg-black">
                    <div className="flex items-center gap-[10px]">
                      <div className="flex items-center gap-3">
                        <div className="text-[12px] -mb-1">Plan:</div>
                        <div className="text-[14px] text-black-r font-bold ">
                          <div className="flex items-center justify-between gap-4">
                            {SUBSCRIPTION_PLANS.map(plan => (
                              <div key={`sub_plan-${plan.name}`} className={`w-[33%] h-[40px] cursor-pointer px-1 text-sm shadow-2xl rounded-lg grid place-items-center ${plan.name === selectedPlan.name ? "bg-[#3d3d3d]" : "bg-gray-600"}`} onClick={() => {
                                setSelectedPlan(plan)
                              }}>
                                {plan.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 pt-4 bg-black">
                <h1 className="text-black-r text-[20px] font-bold ">
                  {' '}
                  Start Your Free 7-Day Trial
                </h1>
                <p className="mt-1 mb-3 text-black-r text-[14px] font-normal">
                  Grow ~1-10k Real & Targeted Followers Every Month. Analytics &
                  Results Tracking. Boost Likes, Comments & DMs. Automated 24/7
                  Growth, Set & Forget. Personal Account Manager. No Fakes Or
                  Bots, 100% Real People.
                </p>

                {/* <div className="mb-[11px] flex gap-[10px] h-[80px] items-center">
                  <div className={`flex-1 bg-[#242424] rounded-[6px] cursor-pointer h-full relative transition-all duration-100 ease-in ${paymentMethod.name === 'card' && "border-[#3d3d3d] border-2"}`}
                    onClick={() => { setPaymentMethod({ id: 1, name: 'card' }) }}
                  >
                    <span
                      className={`${paymentMethod.name === 'card' ? 'top-[13px] left-[10px] w-[22px] h-[18px] translate-x-0 translate-y-0' : 'h-[25.5px] w-[32px] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'}
                        absolute transition-all duration-200 ease-in fill-[#3d3d3d] font-[none]`}
                    >
                      <svg
                        viewBox="0 0 28 28"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M0 7C0 6.07174 0.368749 5.1815 1.02513 4.52513C1.6815 3.86875 2.57174 3.5 3.5 3.5H24.5C25.4283 3.5 26.3185 3.86875 26.9749 4.52513C27.6313 5.1815 28 6.07174 28 7V15.75H0V7ZM20.125 8.75C19.8929 8.75 19.6704 8.84219 19.5063 9.00628C19.3422 9.17038 19.25 9.39294 19.25 9.625V11.375C19.25 11.6071 19.3422 11.8296 19.5063 11.9937C19.6704 12.1578 19.8929 12.25 20.125 12.25H23.625C23.8571 12.25 24.0796 12.1578 24.2437 11.9937C24.4078 11.8296 24.5 11.6071 24.5 11.375V9.625C24.5 9.39294 24.4078 9.17038 24.2437 9.00628C24.0796 8.84219 23.8571 8.75 23.625 8.75H20.125ZM0 19.25V21C0 21.9283 0.368749 22.8185 1.02513 23.4749C1.6815 24.1313 2.57174 24.5 3.5 24.5H24.5C25.4283 24.5 26.3185 24.1313 26.9749 23.4749C27.6313 22.8185 28 21.9283 28 21V19.25H0Z"
                          _ngcontent-esd-c92=""
                        ></path>
                      </svg>
                    </span>

                    <div
                      className={`${paymentMethod.name === 'card' ? "opacity-100 translate-y-0 text-[#3d3d3d]" : 'opacity-0 translate-y-full'}
                        absolute bottom-[10px] left-[10px] w-[22px] h-[18px] text-[14px] font-[500] transition-all duration-200 ease-in fill-[#3d3d3d] font-[none]`}
                    >
                      Card
                    </div>
                  </div>

                  <div className={`flex-1 bg-[#242424] rounded-[6px] cursor-pointer h-full relative transition-all duration-100 ease-in ${paymentMethod.name === 'paypal' && "border-[#3d3d3d] border-2"}`}
                    onClick={() => { setPaymentMethod({ id: 1, name: 'paypal' }) }}
                  >
                    <span
                      className={`${paymentMethod.name === 'paypal' ? 'top-[13px] left-[10px] translate-x-0 translate-y-0' : 'top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'}
                        absolute transition-all duration-200 ease-in fill-[#3d3d3d] font-[none]`}
                    >
                      <img src={'/icons/paypal-icon.svg'} alt="" className={`${paymentMethod.name === 'paypal' ? "h-[23.7px]" : "h-[37px]"}`} />
                    </span>

                    <div
                      className={`${paymentMethod.name === 'paypal' ? "opacity-100 translate-y-0 text-[#3d3d3d]" : 'opacity-0 translate-y-full'}
                        absolute bottom-[10px] left-[10px] w-[22px] h-[18px] text-[14px] font-[500] transition-all duration-200 ease-in fill-[#3d3d3d] font-[none]`}
                    >
                      PayPal
                    </div>
                  </div>
                </div> */}

                <div className={`opacity-100 pointer-events-auto transition-all duration-150 ease-in border rounded-md px-2 py-2`}>
                  {!isDesktop && <ChargeBeeCard
                    user={user}
                    userResults={userResults}
                    username={username}
                    setIsModalOpen={setIsModalOpen}
                    setErrorMsg={setErrorMsg}
                    mobile={true}
                    Loading={Loading}
                    setLoading={setLoading}
                    selectedPlan={selectedPlan}
                  />}
                </div>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full min-h-[85px] p-5 text-[14px] bg-black">
              {paymentMethod.name === 'card' ?
                <div className="">
                  <button
                    className={`${Loading ? 'button-gradient cursor-wait' : 'bg-[#3d3d3d] cursor-pointer'} w-full h-[50px] rounded-[10px] text-white flex items-center justify-center gap-2`}
                    type="submit"
                    form="cardForm"
                  // onClick={() => { }}
                  >
                    <div className="">{Loading ? "Loading..." : "Pay $0.00 & Start Free Trial"}</div>
                  </button>
                  <div className="mt-2 text-center text-black-r">
                    Then $24.99 per week, billed monthly. <br /> Cancel any time, no
                    risk.
                  </div>
                </div>
                :
                <div className="">
                  <button
                    className="cursor-pointer w-full h-[50px] rounded-[10px] bg-[#ffc439] text-white flex items-center justify-center gap-2"
                    onClick={() => {
                      setIsModalOpen(true);
                      setErrorMsg({ title: 'Alert', message: 'PayPal not available yet!' })
                    }}
                  >
                    <img src={'/icons/paypal-btn.svg'} alt="" className="h-[25px]" />
                  </button>
                  <div className="mt-2 text-center text-black-r">
                    Start Free 7-Day Trial. Then $24.99 per week, billed monthly. Cancel any time, no risk.
                  </div>
                </div>
              }

            </div>
          </div>
          {/* mobile end */}

          <div className="">
            <div
              className={`${!showMenu && 'opacity-0 pointer-events-none hidden'
                } absolute top-0 left-0 w-full h-screen z-10`}
            >
              <div
                className="absolute top-0 left-0 w-full h-screen bg-black/0 z-[99] cursor-pointer"
                onClick={() => {
                  setShowMenu(!showMenu);
                }}
              ></div>


              <div
                className={`${!showMenu && 'opacity-0 pointer-events-none hidden'
                  } absolute top-0 lg:top-14 z-[99] left-5 lg:left-[unset] right-5 bg-[#242424] w-[calc(100%-40px)] lg:w-[350px] lg:max-w-[400px] rounded-[10px] shadow-[0_5px_10px_#0a17530d] transition-all duration-150 ease-in`}
                ref={parentRef}
                tabIndex={0}
              >
                <div className="flex items-center gap-3 p-5">
                  <div className="w-[50px] h-[50px] rounded-full button-gradient text-white grid place-items-center">
                    <span className="text-[22px] pointer-events-none select-none font-[400] uppercase">
                      {user?.full_name && user?.full_name?.charAt(0)}
                    </span>
                  </div>
                  <div className="">
                    <div className="text-black-r font-bold  text-[14px]">
                      {user?.full_name}
                    </div>
                    <div className="text-[12px]">{user?.email}</div>
                  </div>
                </div>

                <div
                  className="border-t border-white flex items-center gap-3 h-[53px] text-black-r px-5 cursor-pointer hover:bg-[#333333]"
                  onClick={async () => {
                    setShowMenu(!showMenu);
                    await supabase.auth.signOut();
                    window.onbeforeunload = function () {
                      localStorage.clear();
                    };
                    // window.location.pathname = '/search';
                    window.location.pathname = '/';
                  }}
                >
                  <MdLogout size={22} /> <span className="">{t("Logout")}</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <Content
                user={user}
                userResults={userResults}
                navigate={navigate}
                setIsModalOpen={setIsModalOpen}
                setErrorMsg={setErrorMsg}
                username={username}
                Loading={Loading}
                setLoading={setLoading}
                t={t}
                isDesktop={isDesktop}
                selectedPlan={selectedPlan}
                setSelectedPlan={setSelectedPlan}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const Content =
  ({
    user,
    userResults,
    navigate,
    setIsModalOpen,
    setErrorMsg,
    username,
    Loading,
    setLoading,
    t,
    isDesktop,
    selectedPlan,
    setSelectedPlan
  }) => {
    const [showCreaditCardInput, setShowCreaditCardInput] = useState(true);

    return (
      <>
        <div className="h-[calc(100vh-75px)] lg:h-screen mt-[75px] lg:mt-0 lg:py-[20px] lg:px-[100px] bg-black">
          <div className="w-full max-w-full lg:max-w-[960px] xl:max-w-[1070px] h-[789px] overflow-auto my-auto 2xl:grid max-h-full lg:mx-auto relative">
            <div className="mb-4 hidden lg:flex items-center gap-2 font-[600] ">
              <div className="">{t('Select Your Account')}</div>
              <div className="">{`>`}</div>
              <div className="text-[#3d3d3d]">{t('Complete registration')}</div>
              <div className="">{`>`}</div>
              <div className="">{t('Go to your dashboard')}</div>
            </div>

            <div className="flex-col justify-between hidden h-full px-5 pb-4 lg:flex lg:justify-start lg:items-center text-start lg:px-0">
              <div className="flex flex-col w-full gap-5 lg:flex-row">
                <div className="basis-[45%] grow-[3] rounded-[20px] flex gap-5 flex-col">
                  <div className="rounded-[20px]">
                    <div className="text-start w-full h-[110px] shadow-[0_5px_10px_#0a17530d] rounded-[20px] py-[25px] px-4 lg:px-[50px] relative flex items-center justify-between bg-[#242424]">
                      <div className="w-full max-w-[420px] relative overflow-hidden flex items-center text-start py-5 pr-[30px]">
                        <div className="flex items-center w-full gap-4 ">
                          <div className="h-[60px] relative">
                            <img
                              src={userResults?.profile_pic_url}
                              alt=""
                              className="w-[60px] h-[60px] min-w-[60px] min-h-[60px] rounded-full"
                            />
                            <img
                              src="/icons/instagram.svg"
                              alt=""
                              className="absolute -bottom-1 -right-1 border-2 w-[22px] h-[22px] rounded-full"
                            />
                          </div>
                          <div className="">
                            <div className="font-bold text-black-r">
                              {userResults?.username}
                            </div>
                            <div className="">{userResults?.full_name}</div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="w-[40px] h-[40px] rounded-[10px] grid place-items-center shadow-[0_3px_8px_#0000001a] cursor-pointer bg-white text-[#242424]"
                        onClick={() => {
                          navigate(`/search`);
                        }}
                      >
                        <TbRefresh className="font-semibold" />
                      </div>
                    </div>

                    <div className="pt-[32px] pb-3 px-5 lg:px-[50px] -mt-5 rounded-bl-[20px] rounded-br-[20px] shadow-[0_3px_8px_#ffffff75] bg-black">
                      <div className="flex text-[12px]">Select plan</div>
                      <div className="flex items-center justify-between gap-4">
                        {SUBSCRIPTION_PLANS.map(plan => (
                          <div key={`sub_plan-${plan.name}`} className={`w-[33%] h-[50px] cursor-pointer shadow-2xl rounded-lg grid place-items-center ${plan.name === selectedPlan.name ? "bg-[#3d3d3d]" : "bg-gray-600"}`} onClick={() => {
                            setSelectedPlan(plan)
                          }}>
                            {plan.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="overflow-auto basis-[100%] rounded-[20px] py-10 px-4 lg:px-[50px] shadow-[0_5px_10px_#0a17530d] bg-[#242424]">
                    <div className="">
                      {/* <div className="flex items-center gap-3">
                    {showCreaditCardInput && <div className="w-[32px] h-[32px] rounded-full grid place-items-center shadow-[0_3px_8px_#0000001a] cursor-pointer bg-white text-[#242424]" onClick={() => { setShowCreaditCardInput(false) }}>
                      <FaAngleLeft className="font-semibold" />
                    </div>}
                    <h1 className="text-[20px] lg:text-[20px] font-bold text-black-r ">{t("Payment method")}</h1>
                  </div> */}
                      <p className="pt-2 pb-4 text-sm  text-start">
                        {t('payment_method_text')}
                      </p>

                      {!showCreaditCardInput && (
                        <div className="flex flex-col gap-4 mb-4">
                          <div
                            className="cursor-pointer w-full h-[60px] rounded-[8px] bg-[#3d3d3d] text-white flex items-center justify-center gap-2"
                            onClick={() => {
                              setShowCreaditCardInput(true);
                            }}
                          >
                            <span className="w-[28px] h-[28px] rounded-[8px] fill-white">
                              <svg
                                viewBox="0 0 28 28"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                              >
                                <path d="M0 7C0 6.07174 0.368749 5.1815 1.02513 4.52513C1.6815 3.86875 2.57174 3.5 3.5 3.5H24.5C25.4283 3.5 26.3185 3.86875 26.9749 4.52513C27.6313 5.1815 28 6.07174 28 7V15.75H0V7ZM20.125 8.75C19.8929 8.75 19.6704 8.84219 19.5063 9.00628C19.3422 9.17038 19.25 9.39294 19.25 9.625V11.375C19.25 11.6071 19.3422 11.8296 19.5063 11.9937C19.6704 12.1578 19.8929 12.25 20.125 12.25H23.625C23.8571 12.25 24.0796 12.1578 24.2437 11.9937C24.4078 11.8296 24.5 11.6071 24.5 11.375V9.625C24.5 9.39294 24.4078 9.17038 24.2437 9.00628C24.0796 8.84219 23.8571 8.75 23.625 8.75H20.125ZM0 19.25V21C0 21.9283 0.368749 22.8185 1.02513 23.4749C1.6815 24.1313 2.57174 24.5 3.5 24.5H24.5C25.4283 24.5 26.3185 24.1313 26.9749 23.4749C27.6313 22.8185 28 21.9283 28 21V19.25H0Z"></path>
                              </svg>
                            </span>
                            <div className="">Card / Debit Card</div>
                          </div>
                          <div
                            className="cursor-pointer w-full h-[60px] rounded-[8px] bg-[#ffc439] text-white flex items-center justify-center gap-2"
                            onClick={() => {
                              setIsModalOpen(true);
                              setErrorMsg({
                                title: 'Alert',
                                message: 'PayPal not available yet!',
                              });
                            }}
                          >
                            <img
                              src={'/icons/paypal-btn.svg'}
                              alt=""
                              className="h-[25px]"
                            />
                          </div>
                        </div>
                      )}

                      <div
                        className={`${!showCreaditCardInput
                          ? 'opacity-0 pointer-events-none hidden'
                          : 'opacity-100'
                          } transition-all duration-150 ease-out`}
                      >
                        {isDesktop && (
                          <ChargeBeeCard
                            user={user}
                            userResults={userResults}
                            username={username}
                            setIsModalOpen={setIsModalOpen}
                            setErrorMsg={setErrorMsg}
                            Loading={Loading}
                            setLoading={setLoading}
                            selectedPlan={selectedPlan}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="basis-[60%] grow-[4] rounded-[20px] shadow-[0_5px_10px_#0a17530d] p-4 lg:p-[50px_50px_50px] bg-[#242424] relative">
                  <div className="w-full h-full overflow-auto">
                    <span className="text-[14px] py-[5px] px-3 mb-3 rounded-[8px] text-[#dbc8be] bg-[#dbc8be33]">
                      7-Days Free Trial
                    </span>
                    <div className="text-[20px] lg:text-[26px] font-bold text-black-r ">
                      Start Your 7-Days Trial
                    </div>
                    <p className="text-[14px] mt-2 mb-5">
                      It's time to get the real exposure you've been waiting for.
                      After signing up, you will be introduced to your personal
                      account manager and start growing in under 2 minutes.
                    </p>
                    <div className="text-[72px] leading-[70px] text-black-r font-bold ">
                      Free
                    </div>
                    <p className="text-[14px] mb-5">
                      Then $24.99 per week, billed monthly.
                    </p>

                    <div className="flex flex-col gap-4 text-base text-black-r">
                      <div className="flex items-center gap-2">
                        <span className="w-[20px] h-[20px] green-checkbox fill-[#dbc8be] sroke-green font-[none]">
                          <svg
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            _ngcontent-gsj-c72=""
                            aria-hidden="true"
                          >
                            <rect
                              opacity="0.2"
                              x="0.5"
                              y="0.5"
                              width="19"
                              height="19"
                              rx="9.5"
                              _ngcontent-gsj-c72=""
                            ></rect>
                            <rect
                              x="4.5"
                              y="4.5"
                              width="11"
                              height="11"
                              rx="5.5"
                              _ngcontent-gsj-c72=""
                            ></rect>
                          </svg>
                        </span>
                        <p className="">Grow ~1-10k Real Monthly Followers</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-[20px] h-[20px] green-checkbox fill-[#dbc8be] sroke-green font-[none]">
                          <svg
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <rect
                              opacity="0.2"
                              x="0.5"
                              y="0.5"
                              width="19"
                              height="19"
                              rx="9.5"
                            ></rect>
                            <rect
                              x="4.5"
                              y="4.5"
                              width="11"
                              height="11"
                              rx="5.5"
                            ></rect>
                          </svg>
                        </span>
                        <p>Target Followers Relevant To You</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-[20px] h-[20px] green-checkbox fill-[#dbc8be] sroke-green font-[none]">
                          <svg
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <rect
                              opacity="0.2"
                              x="0.5"
                              y="0.5"
                              width="19"
                              height="19"
                              rx="9.5"
                            ></rect>
                            <rect
                              x="4.5"
                              y="4.5"
                              width="11"
                              height="11"
                              rx="5.5"
                            ></rect>
                          </svg>
                        </span>
                        <p>Detailed Analytics & Results Tracking</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-[20px] h-[20px] green-checkbox fill-[#dbc8be] sroke-green font-[none]">
                          <svg
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <rect
                              opacity="0.2"
                              x="0.5"
                              y="0.5"
                              width="19"
                              height="19"
                              rx="9.5"
                            ></rect>
                            <rect
                              x="4.5"
                              y="4.5"
                              width="11"
                              height="11"
                              rx="5.5"
                            ></rect>
                          </svg>
                        </span>
                        <p>Automated 24/7 Growth, Set & Forget</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-[20px] h-[20px] green-checkbox fill-[#dbc8be] sroke-green font-[none]">
                          <svg
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <rect
                              opacity="0.2"
                              x="0.5"
                              y="0.5"
                              width="19"
                              height="19"
                              rx="9.5"
                            ></rect>
                            <rect
                              x="4.5"
                              y="4.5"
                              width="11"
                              height="11"
                              rx="5.5"
                            ></rect>
                          </svg>
                        </span>
                        <p>No Fakes Or Bots, 100% Real People</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-[20px] h-[20px] green-checkbox fill-[#dbc8be] sroke-green font-[none]">
                          <svg
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <rect
                              opacity="0.2"
                              x="0.5"
                              y="0.5"
                              width="19"
                              height="19"
                              rx="9.5"
                            ></rect>
                            <rect
                              x="4.5"
                              y="4.5"
                              width="11"
                              height="11"
                              rx="5.5"
                            ></rect>
                          </svg>
                        </span>
                        <p>Personal Account Manager</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-[20px] h-[20px] green-checkbox fill-[#dbc8be] sroke-green font-[none]">
                          <svg
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <rect
                              opacity="0.2"
                              x="0.5"
                              y="0.5"
                              width="19"
                              height="19"
                              rx="9.5"
                            ></rect>
                            <rect
                              x="4.5"
                              y="4.5"
                              width="11"
                              height="11"
                              rx="5.5"
                            ></rect>
                          </svg>
                        </span>
                        <p>Boost Likes, Comments & DMs</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-[20px] h-[20px] green-checkbox fill-[#dbc8be] sroke-green font-[none]">
                          <svg
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <rect
                              opacity="0.2"
                              x="0.5"
                              y="0.5"
                              width="19"
                              height="19"
                              rx="9.5"
                            ></rect>
                            <rect
                              x="4.5"
                              y="4.5"
                              width="11"
                              height="11"
                              rx="5.5"
                            ></rect>
                          </svg>
                        </span>
                        <p>Safest Instagram Growth Service</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-[20px] h-[20px] green-checkbox fill-[#dbc8be] sroke-green font-[none]">
                          <svg
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <rect
                              opacity="0.2"
                              x="0.5"
                              y="0.5"
                              width="19"
                              height="19"
                              rx="9.5"
                            ></rect>
                            <rect
                              x="4.5"
                              y="4.5"
                              width="11"
                              height="11"
                              rx="5.5"
                            ></rect>
                          </svg>
                        </span>
                        <p>Access Dashboard On All Devices</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

export const getStartingDay = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;

  return today
};

export const ChargeBeeCard = ({ user, userResults, addCard, username, setIsModalOpen, setErrorMsg, mobile, Loading, setLoading, setRefresh, refresh, selectedPlan }) => {
  const { t } = useTranslation()
  const navigate = useNavigate();
  // const cardRef = useRef();
  const [nameOnCard, setNameOnCard] = useState('')
  const stripe = useStripe();
  const elements = useElements();

  // const fonts = [
  //   'https://fonts.googleapis.com/css?family=Open+Sans'
  // ]
  // Style customizations
  // const styles = {
  //   base: {
  //     color: '#000',
  //     fontWeight: 600,
  //     fontFamily: 'Montserrat-Regular, Open Sans, Segoe UI, sans-serif',
  //     fontSize: '16px',
  //     fontSmoothing: 'antialiased',

  //     ':focus': {
  //       color: '#424770',
  //     },

  //     '::placeholder': {
  //       color: mobile ? '#333' : '#757575',
  //     },

  //     ':focus::placeholder': {
  //       color: '#CFD7DF',
  //     },
  //   },
  //   invalid: {
  //     color: '#f00',
  //     ':focus': {
  //       color: '#FA755A',
  //     },
  //     '::placeholder': {
  //       color: '#FFCCA5',
  //     },
  //   },
  // }

  const handleAddCard = async () => {
    setLoading(true);
    if (user) {
      const cardElement = elements.getElement(CardElement);

      if (cardElement) {

        try {
          const { error, paymentMethod }
            = await stripe.createPaymentMethod({
              type: "card",
              card: cardElement,
            });
          if (error) {
            // setError(error.message);
            setIsModalOpen(true);
            setErrorMsg({ title: 'Failed to create subscription', message: `An error occured: ${error.message}` })
            setLoading(false);
            return;
          }

          // console.log("paymentMethod");
          console.log(paymentMethod);
          if (paymentMethod?.id) {
            let updateCustomerPaymentMethodRes = await axios.post(`${BACKEND_URL}/api/stripe/attach_payment_method_to_customer`,
              { customer_id: user?.customer_id, pm_id: paymentMethod?.id })
              .then((response) => response.data).catch(error => {
                console.log("attach_payment_method_to_customer error");
                console.log(error);
                return error
              })
            if (updateCustomerPaymentMethodRes?.id) {
              alert('Updated successfully!')
              setRefresh(!refresh)
              setLoading(false);
              setIsModalOpen(false);
            } else {
              console.log('Error add card:', updateCustomerPaymentMethodRes?.raw.message);
              // alert('An error occurred, please try again or contact support')
              setIsModalOpen(true);
              setErrorMsg({ title: 'Failed to adding card', message: `An error occurred: ${updateCustomerPaymentMethodRes?.raw.message}` })
            }
          }
        } catch (error) {
          // setError(error.message);
          setIsModalOpen(true);
          setErrorMsg({ title: 'Failed to create subscription', message: `An error occured: ${error.message}` })
        }
      }
    } else {
      setIsModalOpen(true);
      setErrorMsg({ title: 'Authentication Error', message: 'You have to login to continue' })
    }
    setLoading(false);
  }

  const handleCardPay = async () => {
    if (addCard) {
      await handleAddCard()
      return;
    }

    setLoading(true);
    if (userResults?.name === "INVALID_USERNAME") {
      console.log("INVALID_USERNAME")
      setIsModalOpen(true);
      setErrorMsg({ title: 'Alert', message: 'An error has occured, please try again' })
      setLoading(false);
      return;
    };

    if (user) {
      var userIsNew = true
      const cardElement = elements.getElement(CardElement);

      try {
        const { error, paymentMethod }
          = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
          });
        if (error) {
          // setError(error.message);
          setIsModalOpen(true);
          setErrorMsg({ title: 'Failed to create subscription', message: `An error occured: ${error.message}` })
          setLoading(false);
          return;
        }

        // const { id } = paymentMethod;
        // console.log("paymentMethod: ");
        // console.log(paymentMethod);
        if (paymentMethod?.id) {
          let createSubscription = await axios.post(`${BACKEND_URL}/api/stripe/create_subscription`, {
            name: nameOnCard,
            email: user?.email,
            paymentMethod: paymentMethod.id,
            price: selectedPlan.planId
          }
          ).catch(err => {
            console.error(err)
            return err
          })

          // console.log("createSubscription");
          // console.log(createSubscription);

          if (!createSubscription.data) {
            setIsModalOpen(true);
            setErrorMsg({ title: 'Failed to create subscription', message: `An error occured: ${createSubscription.response.data.message}` })
            setLoading(false);
            return;
          }

          const confirm = await stripe.confirmCardPayment(createSubscription?.data?.clientSecret)
          console.log("confirmCardPayment");
          console.log(confirm);
          if (confirm.error) {
            setIsModalOpen(true);
            setErrorMsg({ title: 'Failed to create subscription', message: `An error occured: ${confirm.error.message}` })
            setLoading(false);
            return;
          }

          if (confirm?.paymentIntent?.status === "succeeded" && createSubscription?.data?.message === "Subscription successful!") {
            await continueToSupabase(userIsNew, createSubscription.data.subscription)
            setLoading(false);
          } else {
            console.log("createSubscription error");
            console.log(createSubscription);
            setIsModalOpen(true);
            setErrorMsg({ title: 'Failed to create subscription', message: 'An error occured while creating your subscription' })
          }
        }
      } catch (error) {
        // setError(error.message);
        setIsModalOpen(true);
        setErrorMsg({ title: 'Failed to create subscription', message: `An error occured: ${error.message}` })
      }
    } else {
      setIsModalOpen(true);
      setErrorMsg({ title: 'Authentication Error', message: 'You have to login to continue' })
    }
    setLoading(false);
  };

  async function continueToSupabase(userIsNew, subscriptionObj) {
    let data = {
      nameOnCard,
      subscription_id: subscriptionObj?.id,
      customer_id: subscriptionObj?.customer,

      username: userResults?.username,
      email: user.email,
      full_name: user.full_name,
      followers: userResults?.follower_count,
      following: userResults?.following_count,
      is_verified: userResults?.is_verified,
      biography: userResults?.biography,
      start_time: getStartingDay(),
      posts: userResults?.media_count,
      subscribed: true
    }

    if (userIsNew) {
      if (!user) {
        setIsModalOpen(true);
        setErrorMsg({ title: 'Alert', message: `Error updating user's details` })
        setLoading(false);
        return;
      }

      // console.log({ data });

      const updateUser = await supabase
        .from("users")
        .update(data).eq('id', user.id);
      if (updateUser?.error) {
        console.log(updateUser.error);
        setIsModalOpen(true);
        setErrorMsg({ title: 'Alert', message: `Error updating user's details` })

        return;
      }
    } else {
      const addAccount = await supabase.from("users").insert({ ...data, user_id: user.id });
      if (addAccount?.error) {
        console.log(addAccount.error);
        setIsModalOpen(true);
        setErrorMsg({ title: 'Alert', message: `Error adding new account` })
      }
    }

    let sendEmail = await axios.post(`${BACKEND_URL}/api/send_email`, { email: user?.email, subject: "Your account is not connected", htmlContent: NOT_CONNECTED_TEMPLATE(user?.full_name) }).catch(err => err)
    if (sendEmail.status !== 200) {
      console.log(sendEmail);
    }

    const ref = getRefCode()
    if (ref) {
      navigate(`/thankyou?ref=${ref}`)
    } else {
      navigate(`/thankyou`)
    }
    setLoading(false);
  }

  const elementOptions = {
    style: {
      base: {
        iconColor: '#c4f0ff',
        color: '#fff',
        fontWeight: '500',
        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': {
          color: '#fce883',
        },
        '::placeholder': {
          color: '#87BBFD',
        },
      },
      invalid: {
        iconColor: '#FFC7EE',
        color: '#FFC7EE',
      },
    },
  };

  return (<>
    <div className={`ex1-field shadow-[0_2px_4px_#00000026] rounded-[8px] px-5 py-6 text-sm ${mobile ? 'placeholder-[#333]' : 'placeholder-[#757575]'} text-white font-[500] transition-all duration-280 ease mb-5`} id='num'>
      <input type="text" className="w-full bg-transparent border-none outline-none" placeholder="Name on Card" value={nameOnCard}
        onChange={(e) => { setNameOnCard(e.target.value) }} />
    </div>

    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (Loading) {
          // alert('Please wait');
          setIsModalOpen(true);          
          setErrorMsg({ title: `${t("processing")}...`, message: t('Please wait') })
          return
        }
        // await handleCardPay(setLoading, userResults, setIsModalOpen, setErrorMsg, user, cardRef, username, navigate, nameOnCard);
        await handleCardPay();
      }}
      id="cardForm">
      <CardElement options={elementOptions} />
    </form>

    <div className={`${addCard ? "block" : "hidden lg:block"}`}>
      <button className={`${Loading ? 'button-gradient cursor-wait' : 'bg-[#3d3d3d] cursor-pointer'} text-white  text-[.8rem] xl:text-[1.125rem] ${addCard ? "mt-[65px]" : "mt-5"} w-full py-4 rounded-[10px] font-[600] mb-4`}
        onClick={() => {
          if (Loading) {
            setIsModalOpen(true);
            setErrorMsg({ title: `${t("processing")}...`, message: t('Please wait') })
            return
          }
          // await handleCardPay(setLoading, userResults, setIsModalOpen, setErrorMsg, user, cardRef, username, navigate, nameOnCard);
          handleCardPay();
        }}>
        <span> {Loading ? `${t("Processing")}...` : `${addCard ? t("Add Payment Method") : t("Finalize registration")}`}  </span>
      </button>
      {/* {showCardComponent && <></>} */}
      {Loading && <div className="flex items-center justify-center gap-2 py-3">
        <AiOutlineLoading3Quarters className="animate-spin" />
        <p className="font-[500] text-xs md:text-sm  text-[#757575] animate-pulse">
          {t("We're processing your request, please wait")}...
        </p>
      </div>}
    </div>
  </>)
}