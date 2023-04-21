import Axios from "axios";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { RxCaretRight } from "react-icons/rx";
import { TbRefresh, TbChecks } from "react-icons/tb";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CardComponent, CardNumber, CardExpiry, CardCVV } from "@chargebee/chargebee-js-react-wrapper";
import axios from 'axios'
import CrispChat from "./CrispChat";
import { uploadImageFromURL } from "../helpers";

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
  // const BASE_URL = "http://localhost:8000" //
  // const BASE_URL = 'https://sproutysocial-api.onrender.com'
  // const BASE_URL = 'https://sproutysocial-api.up.railway.app'


  let { username } = useParams();
  const [userResults, setUserResults] = useState(null);
  // const [error, setError] = useState(false);
  const [Loading, setLoading] = useState(false);
  // const [showCardComponent, setShowCardComponent] = useState(true);
  // const [cbInstance, setCbInstance] = useState()
  // error && console.log("🚀 ~ file: subscriptions.jsx:14 ~ Subscriptions ~ error", error)
  // username && console.log("🚀 ~ file: subscriptions.jsx:14 ~ Subscriptions ~ error", username)

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

  const getStartingDay = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + "/" + dd + "/" + yyyy;

    return today
  };

  const getData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) navigate('/');
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
  }, [navigate, username]);

  useEffect(() => {
    getData();
  }, [getData]);

  const goBack = () => {
    navigate(`/search`)
  }

  const cardRef = useRef();

  // chargebee initiallization
  useEffect(() => {
    const fetch = async () => {
      window.Chargebee.init({
        site: "sproutysocial",
        // domain: 'app.sproutysocial.com',
        iframeOnly: true,
        publishableKey: "live_JtEKTrE7pAsvrOJar1Oc8zhdk5IbvWzE",
      })
      const instance = window?.Chargebee?.getInstance()
      // setCbInstance(instance);
      const { data: { user } } = await supabase.auth.getUser()
      instance.setPortalSession(async () => {
        // https://apidocs.chargebee.com/docs/api/portal_sessions#create_a_portal_session
        return await axios.post(`${process.env.REACT_APP_BASE_URL}/api/generate_portal_session`, urlEncode({ customer_id: user.id })).then((response) => response.data);
      });
    }
    fetch()
  }, [])

  const handleOnClick = async () => {
    setLoading(true);

    if (userResults.data[0].name === "INVALID_USERNAME") {
      console.log("INVALID_USERNAME")
      alert('An error has occurred, please try again')
      setLoading(false);
      return;
    };
    const { data: { user } } = await supabase.auth.getUser()


    if (cardRef) {
      // cardRef.current.tokenize().then(data => {
      //   console.log(data);
      //   // return data.token
      // }).catch(err => {
      //   console.log(err);
      // });
      const token = await cardRef.current.tokenize().then(data => {
        return data.token
      }).catch(err => {
        console.log(err);
        if (err === "Error: Could not mount master component") return alert("Please check your card")
        alert(err)
        // alert("something is wrong, please try again")
        setLoading(false);
        return;
      });

      if (!token) {
        setLoading(false);
        return;
      }

      const create_customer_data = {
        allow_direct_debit: true,
        first_name: userResults.data[0].full_name,
        last_name: '',
        email: user.email,
        token_id: token
      }
      // console.log(create_customer_data);

      let customer = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/create_customer`,
        urlEncode(create_customer_data))
        .then((response) => response.data)
      // console.log(customer);

      if (customer.message === 'success') {
        var profile_pic_url = '';
        const create_subscription_for_customer_data = {
          customer_id: customer?.customer?.id,
          plan_id: "Monthly-Plan-7-Day-Free-Trial-USD-Monthly"
          // plan_id: "Free-Trial-USD-Monthly" //Monthly-Plan-USD-Monthly
          // plan_id: "Monthly-Plan-USD-Monthly"
        }
        let subscriptionResult = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/create_subscription_for_customer`,
          urlEncode(create_subscription_for_customer_data))
          .then((response) => response.data)
        // console.log(subscriptionResult);
        if (subscriptionResult.message === 'success') {
          const uploadImageFromURLRes  = await uploadImageFromURL(username, userResults?.data[0]?.profile_pic_url)
          // console.log(uploadImageFromURLRes);

          if (uploadImageFromURLRes?.status === 'success') {
            profile_pic_url = uploadImageFromURLRes?.data
          }
          
          let data = {
            chargebee_subscription: JSON.stringify(subscriptionResult.subscription),
            chargebee_subscription_id: subscriptionResult.subscription?.id,
            chargebee_customer: JSON.stringify(customer.customer),
            chargebee_customer_id: customer?.customer?.id,

            username,
            email: user.email,
            followers: userResults?.data[0].follower_count,
            following: userResults?.data[0].following_count,
            // profile_pic_url: userResults?.data[0]?.profile_pic_url,
            profile_pic_url,
            is_verified: userResults?.data[0]?.is_verified,
            biography: userResults?.data[0]?.biography,
            start_time: getStartingDay(),
            posts: userResults?.data[0].media_count,
            subscribed: true,
          }
          // console.log(data);
          await supabase
            .from("users")
            .update(data).eq('user_id', user.id);
          // console.log("🚀 ~ file: subscriptions.jsx:52 ~ handelOnClick ~ data", data)

          setLoading(false);
          navigate(`/dashboard/${username}`);
        } else {
          console.log('Error creating subscription:', subscriptionResult.error);
          alert('An error occurred, please try again or contact support')
        }
      } else {
        console.log('Error creating customer:', customer.error);
        alert('An error occurred, please try again or contact support')
      }
    }

    // await cbInstance.openCheckout({
    //   async hostedPage() {
    //     return await axios.post(`${process.env.REACT_APP_BASE_URL}/api/generate_checkout_new_url`,
    //       urlEncode({ 
    //         plan_id: "Free-Trial-USD-Monthly" //Monthly-Plan-USD-Monthly
    //        }))
    //       .then((response) => response.data)

    //     // const response = await axios.post(
    //     //   'https://sproutysociall.chargebee.com/api/v2/hosted_pages/checkout_new_for_items',
    //     //   'subscription_items[item_price_id][0]=Monthly-Plan-USD-Monthly&subscription_items[quantity][0]=1&subscription_items[item_price_price][0]=9995&subscription_items[currency_code][0]=USD',
    //     //   {
    //     //     headers: {
    //     //       'Content-Type': 'application/x-www-form-urlencoded'
    //     //     },
    //     //     auth: {
    //     //       api_key: 'live_JtEKTrE7pAsvrOJar1Oc8zhdk5IbvWzE'
    //     //     }
    //     //   }
    //     // );
    //   },
    //   async success(hostedPageId) {
    //     console.log(hostedPageId);
    //     let customer = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/customer_list`,
    //       urlEncode({ email: user?.email }))
    //       .then((response) => response.data)

    //     let subscription = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/subscription_list`,
    //       urlEncode({ customer_id: customer?.id }))
    //       .then((response) => response.data)

    //     let data = {
    //       chargebee_subscription: JSON.stringify(subscription),
    //       chargebee_subscription_id: subscription?.id,
    //       chargebee_customer: JSON.stringify(customer),
    //       chargebee_customer_id: customer?.id,

    //       username,
    //       followers: userResults?.data[0].follower_count,
    //       following: userResults?.data[0].following_count,
    //       profile_pic_url: userResults?.data[0]?.profile_pic_url,
    //       is_verified: userResults?.data[0]?.is_verified,
    //       biography: userResults?.data[0]?.biography,
    //       start_time: getStartingDay(),
    //       posts: userResults?.data[0].media_count,
    //       subscribed: true,
    //     }
    //     console.log(data);
    //     await supabase
    //       .from("users")
    //       .update(data).eq('user_id', user.id);
    //     // console.log("🚀 ~ file: subscriptions.jsx:52 ~ handelOnClick ~ data", data)

    //     setLoading(false);
    //     // navigate(`/dashboard/${user.id}`);
    //     window.location = `/dashboard/${user.id}`;
    //   },
    //   async close() {
    //     // console.log('done');
    //     console.log("checkout new closed");

    //   },
    //   step(step) {
    //     console.log("checkout", step);
    //   }
    // })

    setLoading(false);
  };


  const fonts = [
    'https://fonts.googleapis.com/css?family=Open+Sans'
  ]
  // Style customizations
  const styles = {
    base: {
      color: '#000',
      fontWeight: 600,
      fontFamily: 'Montserrat-Regular, Open Sans, Segoe UI, sans-serif',
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
      color: '#f00',
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

  // const [errors, setErrors] = useState({})
  // const [errorMessages, setErrorMessages] = useState('')

  // const onChange = (event) => {
  //   console.log(event);

  //   // const errors = this.state.errors;
  //   let errorMessage = '';

  //   if (event.error) {
  //     // If error is present, setState and display the error
  //     errors[event.field] = event.error
  //     errorMessage = event.error.message
  //   } else {
  //     errors[event.field] = null
  //     // If there's no error, check for existing error
  //     const _errors = Object.values(errors).filter(val => val)

  //     // The errorObject holds a message and code
  //     // Custom error messages can be displayed based on the error code
  //     const errorObj = _errors.pop();

  //     // Display existing message
  //     if (errorObj) errorMessage = errorObj.message
  //     else errorMessage = ''
  //   }
  //   setErrors(errors)
  //   setErrorMessages(errorMessage)
  // }

  // useEffect(() => {
  //   if(errorMessages){
  //     alert(errorMessages)
  //   }
  // }, [errorMessages])


  const onReady = (el) => {
    // console.log('ready');
    el.focus();
  }

  const onFocus = (el) => {
    // el.focus();
  }

  const onBlur = (el) => {
    // el.focus();
  }

  useEffect(() => {
    const scriptText = `
      (function(t,a,p){t.TapfiliateObject=a;t[a]=t[a]||function(){ (t[a].q=t[a].q||[]).push(arguments)}})(window,'tap');

      tap('create', '40122-96e787', { integration: "javascript" });
      tap('detect');
    `
    const script = document.createElement('script');
    script.type = "text/javascript"
    script.innerHTML = scriptText
    document.querySelector('#affiliateScript').appendChild(script)
  }, [])

  return (
    <>
      <div id="affiliateScript"></div>
      <CrispChat />
      <script src="https://js.chargebee.com/v2/chargebee.js" ></script>
      <div className="container mx-auto px-6">
        <div className="flex flex-col justify-center items-center mt-12 md:mt-20">
          <div className="flex items-center gap-4 md:gap-5 text-semibold mb-10 text-center">
            <p className="text-[#333] text-sm font-bold">Select Your Account</p>
            <div className="rounded-[4px] bg-[#D9D9D9] relative w-6 h-[18px] md:w-5 md:h-5 cursor-pointer">
              <RxCaretRight className="absolute text-[#8C8C8C] font-semibold text-[17px]" />
            </div>
            <p className="text-[#1b89ff] text-sm font-bold">Complete Setup</p>
            <div className="rounded-[4px] bg-[#D9D9D9] relative w-6 h-[18px] md:w-5 md:h-5 cursor-pointer">
              <RxCaretRight className="absolute text-[#8C8C8C] font-semibold text-[17px]" />
            </div>
            <p className="text-[#333] text-sm font-bold">Enter Dashboard</p>
          </div>

          <div className="grid lg:grid-cols-2 sm:grid-cols-1 justify-center gap-8 mb-12">
            <div>
              {/* instagram name */}
              <div className="shadow-subs flex justify-between flex-wrap items-center mb-10 py-6 px-7 rounded-[10px]">
                <div className="flex gap-[14px]">
                  <img className="rounded-[50%]" width={90} height={90} src={userResults?.data[0]?.profile_pic_url} alt="" />
                  <div className="text-gray20 pt-4">
                    <p className="font-bold text-md md:text-lg font-MontserratBold text-black">@{username}</p>
                    <p className="font-medium text-sm font-MontserratSemiBold text-[#333]">{userResults?.data[0].full_name}</p>
                  </div>
                </div>
                <div className="rounded-[4px] bg-[#D9D9D9] p-3 relative w-10 h-10 cursor-pointer">
                  <TbRefresh className="absolute text-[#8C8C8C] font-semibold cursor-pointer" onClick={goBack} />
                </div>
              </div>

              {/* Payment method */}
              <div className="shadow-subs px-7 py-6 rounded-[10px]">
                <h3 className="font-bold font-MontserratBold text-[20px] text-black pb-2 flex items-center gap-2">
                  {/* {showCardComponent && <FaCaretLeft className="cursor-pointer" onClick={() => setShowCardComponent(false)} />} */}
                  Payment method</h3>
                <p className="font-[500] text-xs md:text-sm font-MontserratSemiBold text-[#333] pb-5">
                  You may cancel during your free trial and won't be billed,
                  no risk.
                </p>
                {/* <CardComponent ref={cardRef} onChange={(e) => onChange(e)} /> */}
                {/* <CardComponent ref={cardRef} onChange={(e) => onChange(e)} /> */}
                <>
                  <CardComponent
                    ref={cardRef}
                    className="fieldset field"
                    onChange={() => { }}
                    styles={styles}
                    // classes={classes}
                    locale={'en'}
                    placeholder={'placeholder'}
                    fonts={fonts}
                    onSubmit={onSubmit}
                    onReady={onReady}
                  >
                    <div className="ex1-field mb-5" id='num'>
                      <CardNumber className="ex1-input" onFocus={onFocus} onBlur={onBlur} onChange={(e) => { }} />
                      <label className="ex1-label font-MontserratLight">Card Number</label><i className="ex1-bar"></i>
                    </div>

                    <div className="ex1-fields">
                      <div className="ex1-field mb-5">
                        <CardExpiry className="ex1-input" onFocus={onFocus} onBlur={onBlur} onChange={(e) => { }} />
                        <label className="ex1-label font-MontserratLight">Expiry</label><i className="ex1-bar"></i>
                      </div>

                      <div className="ex1-field">
                        <CardCVV className="ex1-input" onFocus={onFocus} onBlur={onBlur} onChange={(e) => { }} />
                        <label className="ex1-label font-MontserratLight">CVC</label><i className="ex1-bar"></i>
                      </div>

                    </div>
                  </CardComponent>
                  {/* {showCardComponent &&
                    // <Provider cbInstance={cbInstance}>
                    // </Provider>
                  } */}
                </>
                  <button className={`font-MontserratSemiBold text-[.8rem] md:text-[1.125rem] mt-5 w-full py-4 rounded-[10px] font-[600] mb-4 ${Loading && 'cursor-wait'}`}
                    style={{
                      backgroundColor: '#ef5f3c',
                      color: 'white',
                      boxShadow: '0 20px 30px -12px rgb(255 132 102 / 47%)'
                    }}
                    onClick={() => {
                      if (Loading) return alert('Please wait');
                      handleOnClick()
                    }}>
                    <span> {Loading ? "Loading..." : "Pay $0.00 & Start Free Trial"}  </span>
                  </button>
                {/* {showCardComponent && <></>} */}
                {Loading && <div className="flex items-center py-3 gap-2 justify-center">
                  <AiOutlineLoading3Quarters className="animate-spin" />
                  <p className="font-[500] text-xs md:text-sm font-MontserratSemiBold text-[#333] animate-pulse">
                    We're processing your request, please wait...
                  </p>
                </div>}

                {/* {showCardComponent && <button className="bg-[#1b89ff] text-white font-MontserratSemiBold text-[16px] mt-5 w-full py-4 rounded-[10px] font-bold mb-4" onClick={() => handleOnClick()}>
                  <span> {Loading ? "Loading " : "Pay $0.00 & Start Free Trial"}  </span>
                </button>} */}

                {/* {!showCardComponent && <button className="bg-[#2255FF] w-full py-4 rounded-[10px] text-base text-white font-bold mb-4" onClick={() => setShowCardComponent(true)}>
                  <span>Card / Debit Card</span>
                </button>} */}

                {/* <button className="mt-5 bg-[#2255FF] w-full py-4 rounded-[10px] text-base text-white font-bold mb-4" onClick={() => handleOnClick()}>
                  <span> {Loading ? "Loading " : "Pay $0.00 & Start Free Trial"}  </span>
                </button> */}
              </div>
            </div>

            <div className="shadow-subs px-7 py-6 rounded-[10px] font-MontserratRegular">
              <p className="bg-bgicongreen rounded-[70px] text-btngreen font-bold text-xs md:text-sm py-[6px] px-4 w-36">7-Day Free Trial</p>
              <h3 className="font-bold text-[20px] mt-4 mb-3 font-MontserratBold">Start Your 7-Day Trial</h3>
              <p className="font-bold text-xs md:text-sm text-[#333] mb-4">
                It's time to get the real exposure you've been waiting for. After
                signing up, you will be introduced to your personal account manager
                and start growing in under 2 minutes.
              </p>
              <h2 className="font-bold text-[40px] font-MADEOKINESANSPERSONALUSE">Free</h2>
              <p className="text-xs md:text-sm text-[#333] font-normal">Then $24.99 per week, billed monthly.</p>
              <ul className="pt-8">
                <li className="flex gap-3 items-center mb-3">
                  <div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10 cursor-pointer">
                    <TbChecks className="absolute text-btngreen font-semibold" />
                  </div>
                  <p className="font-bold text-xs md:text-sm text-[#333]">Grow ~1-10k Real Monthly Followers</p>
                </li>
                <li className="flex gap-3 items-center mb-3">
                  <div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10 cursor-pointer">
                    <TbChecks className="absolute text-btngreen font-semibold" />
                  </div>
                  <p className="font-bold text-xs md:text-sm text-[#333]">Target Followers Relevant To You</p>
                </li>
                <li className="flex gap-3 items-center mb-3">
                  <div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10 cursor-pointer">
                    <TbChecks className="absolute text-btngreen font-semibold" />
                  </div>
                  <p className="font-bold text-xs md:text-sm text-[#333]">Detailed Analytics & Results Tracking</p>
                </li>
                <li className="flex gap-3 items-center mb-3">
                  <div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10 cursor-pointer">
                    <TbChecks className="absolute text-btngreen font-semibold" />
                  </div>
                  <p className="font-bold text-xs md:text-sm text-[#333]">Automated 24/7 Growth, Set & Forget</p>
                </li>
                <li className="flex gap-3 items-center mb-3">
                  <div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10 cursor-pointer">
                    <TbChecks className="absolute text-btngreen font-semibold" />
                  </div>
                  <p className="font-bold text-xs md:text-sm text-[#333]">No Fakes Or Bots, 100% Real People</p>
                </li>
                <li className="flex gap-3 items-center mb-3">
                  <div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10 cursor-pointer">
                    <TbChecks className="absolute text-btngreen font-semibold" />
                  </div>
                  <p className="font-bold text-xs md:text-sm text-[#333]">Personal Account Manager</p>
                </li>
                <li className="flex gap-3 items-center mb-3">
                  <div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10 cursor-pointer">
                    <TbChecks className="absolute text-btngreen font-semibold" />
                  </div>
                  <p className="font-bold text-xs md:text-sm text-[#333]">Boost Likes, Comments & DMs</p>
                </li>
                <li className="flex gap-3 items-center mb-3">
                  <div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10 cursor-pointer">
                    <TbChecks className="absolute text-btngreen font-semibold" />
                  </div>
                  <p className="font-bold text-xs md:text-sm text-[#333]">Safest Instagram Growth Service</p>
                </li>
                <li className="flex gap-3 items-center mb-3">
                  <div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10 cursor-pointer">
                    <TbChecks className="absolute text-btngreen font-semibold" />
                  </div>
                  <p className="font-bold text-xs md:text-sm text-[#333]">Access Dashboard On All Devices</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
