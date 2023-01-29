import Axios from "axios";
import React, { useState, useEffect, useCallback, createRef, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { RxCaretRight } from "react-icons/rx";
import { TbRefresh, TbChecks } from "react-icons/tb";
import { RiPaypalFill } from "react-icons/ri";
import { CardComponent, CardNumber, CardExpiry, CardCVV, Provider } from "@chargebee/chargebee-js-react-wrapper";
import { FaCaretLeft } from "react-icons/fa";

export default function Subscriptions() {
  let { username } = useParams();
  const [userResults, setUserResults] = useState(null);
  const [error, setError] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [showCardComponent, setShowCardComponent] = useState(false);
  const [cbInstance, setCbInstance] = useState()
  error && console.log("🚀 ~ file: subscriptions.jsx:14 ~ Subscriptions ~ error", error)
  username && console.log("🚀 ~ file: subscriptions.jsx:14 ~ Subscriptions ~ error", username)

  const navigate = useNavigate();

  const getStartingDay = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + "/" + dd + "/" + yyyy;

    return today
  };

  const getData = useCallback(async () => {
    const options = {
      method: "GET",
      url: "https://instagram-bulk-profile-scrapper.p.rapidapi.com/clients/api/ig/ig_profile",
      params: { ig: username, response_type: "short", corsEnabled: "true" },
      headers: {
        "X-RapidAPI-Key": "47e2a82623msh562f6553fe3aae6p10b5f4jsn431fcca8b82e",
        "X-RapidAPI-Host": "instagram-bulk-profile-scrapper.p.rapidapi.com",
      },
    };

    try {
      const response = await Axios.request(options);
      setUserResults(response);
    } catch (error) {
      console.log(error)
    }
  }, [username]);

  useEffect(() => {
    getData();
  }, [getData]);

  const goBack = () => {
    navigate(`/search`)
  }

  const cardRef = useRef();

  useEffect(() => {
    // if (!window?.Chargebee?.getInstance()){
      console.log('happening....');
      window.Chargebee.init({
        // site: 'http://localhost:3000', //"sproutysocial",
        site: "Sprouty Social",
        publishableKey: "live_JtEKTrE7pAsvrOJar1Oc8zhdk5IbvWzE"
      })
      const instance = window?.Chargebee?.getInstance()
      // console.log(instance);
      setCbInstance(instance);
    // }
  }, [])

  const handleOnClick = async () => {
    setLoading(true);

    if (userResults.data[0].name === "INVALID_USERNAME") return setError(true);
    const { data: { user } } = await supabase.auth.getUser()
    // console.log("🚀 ~ file: subscriptions.jsx:46 ~ handelOnClick ~ user", user)

    cardRef?.current?.tokenize()
      .then((data) => {
        console.log('chargebee token', data.token)
      });

    await supabase
       .from("users")
       .update({
         username,
         followers: userResults?.data[0].follower_count,
         following: userResults?.data[0].following_count,
         profile_pic_url: userResults?.data[0]?.profile_pic_url,
         is_verified: userResults?.data[0]?.is_verified,
         biography: userResults?.data[0]?.biography,
         start_time: getStartingDay(),
         posts: userResults?.data[0].media_count
       }).eq('user_id', user.id);
    // console.log("🚀 ~ file: subscriptions.jsx:52 ~ handelOnClick ~ data", data)

     setLoading(false);
    // navigate(`/dashboard/${user.id}`);
     window.location = `/dashboard/${user.id}`;
  };


  const fonts = [
    'https://fonts.googleapis.com/css?family=Open+Sans'
  ]
  // Style customizations
  const styles = {
    base: {
      color: '#fff',
      fontWeight: 600,
      fontFamily: 'Quicksand, Open Sans, Segoe UI, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',

      ':focus': {
        color: '#424770',
      },

      '::placeholder': {
        color: '#9BACC8',
      },

      ':focus::placeholder': {
        color: '#CFD7DF',
      },
    },
    invalid: {
      color: '#fff',
      ':focus': {
        color: '#FA755A',
      },
      '::placeholder': {
        color: '#FFCCA5',
      },
    },
  }

  const onSubmit = (e) => {
    if (e) e.preventDefault()
    if (this.cardRef) {
      // Call tokenize method on card element
      this.cardRef.current.tokenize().then((data) => {
        console.log('chargebee token', data.token)
      });
    }
  }

  const onChange = (status) => {
    let errors = {
      ...this.state.errors,
      [status.field]: status.error
    };
    let errMessages = Object.values(errors).filter(message => !!message);
    this.setState({
      errors,
      errorMessage: errMessages.pop() || '',
    })
  }

  const onReady = (el) => {
    el.focus();
  }

  return (
    <>
      <script src="https://js.chargebee.com/v2/chargebee.js" ></script>
      <div className="container mx-auto px-6">
        <div className="flex flex-col justify-center items-center mt-12 md:mt-20">
          <div className="flex items-center gap-4 md:gap-5 text-semibold mb-10 text-center">
            <p className="opacity-40 text-sm font-bold">Select Your Account</p>
            <div className="rounded-[4px] bg-[#D9D9D9] relative w-6 h-[18px] md:w-5 md:h-5 cursor-pointer">
              <RxCaretRight className="absolute text-[#8C8C8C] font-semibold text-[17px]" />
            </div>
            <p className="text-primaryblue opacity-40 text-sm font-bold">Complete Setup</p>
            <div className="rounded-[4px] bg-[#D9D9D9] relative w-6 h-[18px] md:w-5 md:h-5 cursor-pointer">
              <RxCaretRight className="absolute text-[#8C8C8C] font-semibold text-[17px]" />
            </div>
            <p className="text-gray20 opacity-40 text-sm font-bold">Enter Dashboard</p>
          </div>

          <div className="grid lg:grid-cols-2 sm:grid-cols-1 justify-center gap-8 mb-12">
            <div>
              {/* instagram name */}
              <div className="shadow-subs flex justify-between items-center mb-10 py-6 px-7 rounded-[10px]">
                <div className="flex gap-[14px]">
                  <img className="rounded-[50%]" width={90} height={90} src={userResults?.data[0]?.profile_pic_url} alt="" />
                  <div className="text-gray20 pt-4">
                    <p className="font-bold text-lg">@{username}</p>
                    <p className="font-medium text-sm">{userResults?.data[0].full_name}</p>
                  </div>
                </div>
                <div className="rounded-[4px] bg-[#D9D9D9] p-3 relative w-10 h-10 cursor-pointer">
                  <TbRefresh className="absolute text-[#8C8C8C] font-semibold cursor-pointer" onClick={goBack} />
                </div>
              </div>

              {/* Payment method */}
              <div className="shadow-subs px-7 py-6 rounded-[10px]">
                <h3 className="font-bold text-[20px] text-gray20 pb-2 flex items-center gap-2">
                  {showCardComponent && <FaCaretLeft className="cursor-pointer" onClick={() => setShowCardComponent(false) } />}
                  Payment method</h3>
                <p className="font-bold text-sm opacity-40 pb-5">
                  You may cancel during your free trial and won't be billed,
                  no risk.
                </p>
                {/* <CardComponent ref={cardRef} onChange={(e) => onChange(e)} /> */}
                {/* <CardComponent ref={cardRef} onChange={(e) => onChange(e)} /> */}
                <>
                  {showCardComponent && <Provider cbInstance={cbInstance}>
                    <CardComponent ref={cardRef} className="fieldset field"
                      styles={styles}
                      // classes={classes}
                      locale={'en'}
                      placeholder={'placeholder'}
                      fonts={fonts}
                    >
                      <div className="ex1-field mb-5">
                        {/* Card number component */}
                        <CardNumber className="ex1-input" />
                        <label className="ex1-label">Card Number</label><i className="ex1-bar"></i>
                      </div>

                      <div className="ex1-fields">
                        <div className="ex1-field mb-5">
                          {/* Card expiry component */}
                          <CardExpiry className="ex1-input" />
                          <label className="ex1-label">Expiry</label><i className="ex1-bar"></i>
                        </div>

                        <div className="ex1-field">
                          {/* Card cvv component */}
                          <CardCVV className="ex1-input" />
                          <label className="ex1-label">CVC</label><i className="ex1-bar"></i>
                        </div>

                      </div>
                    </CardComponent>
                  </Provider>}
                </>
                {showCardComponent && <button className="mt-5 bg-[#2255FF] w-full py-4 rounded-[10px] text-base text-white font-bold mb-4" onClick={() => handleOnClick()}>
                  <span> {Loading ? "Loading " : "Card / Debit Card"}  </span>
                </button>}
                {!showCardComponent && <button className="bg-[#2255FF] w-full py-4 rounded-[10px] text-base text-white font-bold mb-4" onClick={() => setShowCardComponent(true)}>
                  <span>Card / Debit Card</span>
                </button>}

                {/* <button className="bg-[#FFC439] w-full py-4 pl-[30px] rounded-[10px] text-base text-white font-bold relative" onClick={() => handleOnClick()}>
                  <RiPaypalFill className="text-[#003087] text-2xl absolute top-[25%] left-[36%] md:left-[44%] lg:left-[41%]" />
                  {Loading ? "Loading" : "Paypal"}
                </button> */}
              </div>
            </div>

            <div className="shadow-subs px-7 py-6 rounded-[10px]">
              <p className="bg-bgicongreen rounded-[70px] text-btngreen font-bold text-sm py-[6px] px-4 w-36">7-Day Free Trial</p>
              <h3 className="font-bold text-[20px] mt-4 mb-3">Start Your 7-Day Trial</h3>
              <p className="font-bold text-sm opacity-40 mb-4">
                It's time to get the real exposure you've been waiting for. After
                signing up, you will be introduced to your personal account manager
                and start growing in under 2 minutes.
              </p>
              <h2 className="font-bold text-[40px] ">Free</h2>
              <p className="text-sm opacity-40 font-normal">Then $24.99 per week, billed monthly.</p>
              <ul className="pt-8">
                <li className="flex gap-3 items-center mb-3">
                  <div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10 cursor-pointer">
                    <TbChecks className="absolute text-btngreen font-semibold" />
                  </div>
                  <p className="font-bold text-sm opacity-40">Grow ~1-10k Real Monthly Followers</p>
                </li>
                <li className="flex gap-3 items-center mb-3">
                  <div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10 cursor-pointer">
                    <TbChecks className="absolute text-btngreen font-semibold" />
                  </div>
                  <p className="font-bold text-sm opacity-40">Target Followers Relevant To You</p>
                </li>
                <li className="flex gap-3 items-center mb-3">
                  <div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10 cursor-pointer">
                    <TbChecks className="absolute text-btngreen font-semibold" />
                  </div>
                  <p className="font-bold text-sm opacity-40">Detailed Analytics & Results Tracking</p>
                </li>
                <li className="flex gap-3 items-center mb-3">
                  <div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10 cursor-pointer">
                    <TbChecks className="absolute text-btngreen font-semibold" />
                  </div>
                  <p className="font-bold text-sm opacity-40">Automated 24/7 Growth, Set & Forget</p>
                </li>
                <li className="flex gap-3 items-center mb-3">
                  <div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10 cursor-pointer">
                    <TbChecks className="absolute text-btngreen font-semibold" />
                  </div>
                  <p className="font-bold text-sm opacity-40">No Fakes Or Bots, 100% Real People</p>
                </li>
                <li className="flex gap-3 items-center mb-3">
                  <div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10 cursor-pointer">
                    <TbChecks className="absolute text-btngreen font-semibold" />
                  </div>
                  <p className="font-bold text-sm opacity-40">Personal Account Manager</p>
                </li>
                <li className="flex gap-3 items-center mb-3">
                  <div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10 cursor-pointer">
                    <TbChecks className="absolute text-btngreen font-semibold" />
                  </div>
                  <p className="font-bold text-sm opacity-40">Boost Likes, Comments & DMs</p>
                </li>
                <li className="flex gap-3 items-center mb-3">
                  <div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10 cursor-pointer">
                    <TbChecks className="absolute text-btngreen font-semibold" />
                  </div>
                  <p className="font-bold text-sm opacity-40">Safest Instagram Growth Service</p>
                </li>
                <li className="flex gap-3 items-center mb-3">
                  <div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10 cursor-pointer">
                    <TbChecks className="absolute text-btngreen font-semibold" />
                  </div>
                  <p className="font-bold text-sm opacity-40">Access Dashboard On All Devices</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
