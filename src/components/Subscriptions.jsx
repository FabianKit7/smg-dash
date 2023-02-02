import Axios from "axios";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { RxCaretRight } from "react-icons/rx";
import { TbRefresh, TbChecks } from "react-icons/tb";
import { CardComponent, CardNumber, CardExpiry, CardCVV } from "@chargebee/chargebee-js-react-wrapper";
import { FaCaretLeft } from "react-icons/fa";
import axios from 'axios'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const urlEncode = function (data) {
  var str = [];
  for (var p in data) {
    if (data.hasOwnProperty(p) && (!(data[p] === undefined || data[p] == null))) {
      str.push(encodeURIComponent(p) + "=" + (data[p] ? encodeURIComponent(data[p]) : ""));
    }
  }
  return str.join("&");
}

export default function Subscriptions() {
  // const baseUrl = "http://localhost:8000"
  const baseUrl = 'https://sproutysocial-api.onrender.com'
  let { username } = useParams();
  const [userResults, setUserResults] = useState(null);
  const [error, setError] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [showCardComponent, setShowCardComponent] = useState(false);
  const [cbInstance, setCbInstance] = useState()
  // error && console.log("🚀 ~ file: subscriptions.jsx:14 ~ Subscriptions ~ error", error)
  // username && console.log("🚀 ~ file: subscriptions.jsx:14 ~ Subscriptions ~ error", username)

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
    const fetch = async () => {
      // console.log('happening....');
      window.Chargebee.init({
        site: "sproutysocial",
        publishableKey: "live_JtEKTrE7pAsvrOJar1Oc8zhdk5IbvWzE",
      })
      const instance = window?.Chargebee?.getInstance()
      // console.log(instance);
      setCbInstance(instance);
      const { data: { user } } = await supabase.auth.getUser()
      instance.setPortalSession(async () => {
        // https://apidocs.chargebee.com/docs/api/portal_sessions#create_a_portal_session
        return await axios.post(`${baseUrl}/api/generate_portal_session`, urlEncode({ customer_id: user.id })).then((response) => response.data);
      });
    }
    fetch()
  }, [baseUrl])

  const handleOnClick = async () => {
    // console.log('yo');
    // setLoading(true);

    if (userResults.data[0].name === "INVALID_USERNAME") return setError(true);
    const { data: { user } } = await supabase.auth.getUser()
    // console.log("🚀 ~ file: subscriptions.jsx:46 ~ handelOnClick ~ user", user)

    await cbInstance.openCheckout({
      async hostedPage() {
        return await axios.post(`${baseUrl}/api/generate_checkout_new_url`,
          urlEncode({ plan_id: "Monthly-Plan-USD-Monthly" }))
          .then((response) => response.data)

        // const response = await axios.post(
        //   'https://sproutysociall.chargebee.com/api/v2/hosted_pages/checkout_new_for_items',
        //   'subscription_items[item_price_id][0]=Monthly-Plan-USD-Monthly&subscription_items[quantity][0]=1&subscription_items[item_price_price][0]=9995&subscription_items[currency_code][0]=USD',
        //   {
        //     headers: {
        //       'Content-Type': 'application/x-www-form-urlencoded'
        //     },
        //     auth: {
        //       api_key: 'live_JtEKTrE7pAsvrOJar1Oc8zhdk5IbvWzE'
        //     }
        //   }
        // );
      },
      async success(hostedPageId) {
        console.log(hostedPageId);
        let customer = await axios.post(`${baseUrl}/api/customer_list`,
          urlEncode({ email: user?.email }))
          .then((response) => response.data)

        let subscription = await axios.post(`${baseUrl}/api/subscription_list`,
          urlEncode({ customer_id: customer?.id }))
          .then((response) => response.data)

        let data = {
          chargebee_subscription: JSON.stringify(subscription),
          chargebee_subscription_id: subscription?.id,
          chargebee_customer: JSON.stringify(customer),
          chargebee_customer_id: customer?.id,

          username,
          followers: userResults?.data[0].follower_count,
          following: userResults?.data[0].following_count,
          profile_pic_url: userResults?.data[0]?.profile_pic_url,
          is_verified: userResults?.data[0]?.is_verified,
          biography: userResults?.data[0]?.biography,
          start_time: getStartingDay(),
          posts: userResults?.data[0].media_count,
          subscribed: true,
        }
        console.log(data);
        await supabase
          .from("users")
          .update(data).eq('user_id', user.id);
        // console.log("🚀 ~ file: subscriptions.jsx:52 ~ handelOnClick ~ data", data)

        setLoading(false);
        // navigate(`/dashboard/${user.id}`);
        window.location = `/dashboard/${user.id}`;
      },
      async close() {
        // console.log('done');
        console.log("checkout new closed");

      },
      step(step) {
        console.log("checkout", step);
      }
    })

    // cardRef?.current?.tokenize()
    //   .then(async (data) => {
    //     console.log('chargebee token', data.token)
    //   });

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
    if (cardRef) {
      // Call tokenize method on card element
      cardRef.current.tokenize().then((data) => {
        console.log('chargebee token', data.token)
      });
    }
  }

  // const onChange = (status) => {
  //   // console.log(status);
  //   // let errors = {
  //   //   [status.field]: status.error
  //   // };
  //   // let errMessages = Object.values(errors).filter(message => !!message);
  //   // var a = ({
  //   //   errors,
  //   //   errorMessage: errMessages.pop() || '',
  //   // })
  //   // console.log(a);
  // }

  const onReady = (el) => {
    console.log('ready');
    el.focus();
  }

  const onFocus = (el) => {
    // el.focus();
  }

  const onBlur = (el) => {
    // el.focus();
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
                  {showCardComponent && <FaCaretLeft className="cursor-pointer" onClick={() => setShowCardComponent(false)} />}
                  Payment method</h3>
                <p className="font-bold text-sm opacity-40 pb-5">
                  You may cancel during your free trial and won't be billed,
                  no risk.
                </p>
                {/* <CardComponent ref={cardRef} onChange={(e) => onChange(e)} /> */}
                {/* <CardComponent ref={cardRef} onChange={(e) => onChange(e)} /> */}
                <>
                  {showCardComponent &&
                    // <Provider cbInstance={cbInstance}>
                    <CardComponent
                      ref={cardRef}
                      className="fieldset field"
                      // onChange={(e) => onChange(e)}
                      styles={styles}
                      // classes={classes}
                      locale={'en'}
                      placeholder={'placeholder'}
                      fonts={fonts}
                      onSubmit={onSubmit}
                      onReady={onReady}
                    >
                      <div className="ex1-field mb-5">
                        <CardNumber className="ex1-input" onFocus={onFocus} onBlur={onBlur} />
                        <label className="ex1-label">Card Number</label><i className="ex1-bar"></i>
                      </div>

                      <div className="ex1-fields">
                        <div className="ex1-field mb-5">
                          <CardExpiry className="ex1-input" onFocus={onFocus} onBlur={onBlur} />
                          <label className="ex1-label">Expiry</label><i className="ex1-bar"></i>
                        </div>

                        <div className="ex1-field">
                          <CardCVV className="ex1-input" onFocus={onFocus} onBlur={onBlur} />
                          <label className="ex1-label">CVC</label><i className="ex1-bar"></i>
                        </div>

                      </div>
                    </CardComponent>
                    // </Provider>
                  }
                </>
                {/* {showCardComponent && <button className="mt-5 bg-[#2255FF] w-full py-4 rounded-[10px] text-base text-white font-bold mb-4" onClick={() => handleOnClick()}>
                  <span> {Loading ? "Loading " : "Card / Debit Card"}  </span>
                </button>}

                {!showCardComponent && <button className="bg-[#2255FF] w-full py-4 rounded-[10px] text-base text-white font-bold mb-4" onClick={() => setShowCardComponent(true)}>
                  <span>Card / Debit Card</span>
                </button>} */}

                <button className="mt-5 bg-[#2255FF] w-full py-4 rounded-[10px] text-base text-white font-bold mb-4" onClick={() => handleOnClick()}>
                  <span> {Loading ? "Loading " : "Card / Debit Card"}  </span>
                </button>
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
