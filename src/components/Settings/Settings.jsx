import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import axios from 'axios'
import { FaTimesCircle } from "react-icons/fa";
import { BsFillEnvelopeFill } from "react-icons/bs";
import Nav from "../Nav";

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

export default function Settings() {
  // const BASE_URL = "http://localhost:8000"
  const BASE_URL = 'https://sproutysocial-api.onrender.com'
  // const BASE_URL = 'https://sproutysocial-api.up.railway.app'
  const [supaData, setData] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  // const [error, setError] = useState(false);
  const [loading, setloading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [cbInstance, setCbInstance] = useState()
  const [showModal, setShowModal] = useState(false);

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
      }
    }
  }, [])

  // chargebee initialization
  useEffect(() => {
    const fetch = async () => {
      window.Chargebee.init({
        site: "sproutysocial",
        // domain: 'app.sproutysocial.com',
        iframeOnly: true,
        publishableKey: "live_JtEKTrE7pAsvrOJar1Oc8zhdk5IbvWzE",
      })
      const instance = window?.Chargebee?.getInstance()
      // console.log(instance);
      setCbInstance(instance);
      const { data: { user } } = await supabase.auth.getUser()
      instance.setPortalSession(async () => {
        // https://apidocs.chargebee.com/docs/api/portal_sessions#create_a_portal_session
        return await axios.post(`${process.env.REACT_APP_BASE_URL}/api/generate_portal_session`, urlEncode({ customer_id: user?.id })).then((response) => response.data);
      });
    }
    fetch()
  }, [BASE_URL])

  useEffect(() => {
    const getData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return Navigate("/login");
      setEmail(user.email);
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("user_id", user.id);
      setData(data[0]);
      error && console.log(error);
    };

    getData();
  }, []);

  const onUpdate = async () => {
    setloading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const data = await supabase
      .from("users")
      .update({
        full_name: fullname.length ? fullname : supaData.full_name,
      }).eq("user_id", user.id);
    console.log("🚀 ~ file: Settings.jsx:41 ~ onUpdate ~ data", data)

    if (newEmail.length > 4) {
      if (newEmail !== email) {
        console.log("noo")
        const { data, error } = await supabase.auth.updateUser({
          email: newEmail,
        });
        alert("check your email and click on the confirmation link")
        console.log("🚀 ~ file: Settings.jsx:46 ~ onUpdate ~ data", data);
        console.log("🚀 ~ file: Settings.jsx:46 ~ onUpdate ~ error", error);
      }
    }
    setloading(false)
  };

  const renewSubscription = async () => {
    setSubLoading(true)
    await cbInstance.openCheckout({
      async hostedPage() {
        return await axios.post(`${process.env.REACT_APP_BASE_URL}/api/generate_checkout_new_url`,
          urlEncode({
            plan_id: "Monthly-Plan-USD-Monthly" //"Free-Trial-USD-Monthly"
          }))
          .then((response) => response.data)
      },
      async success(hostedPageId) {
        console.log(hostedPageId);
        let customer = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/customer_list`,
          urlEncode({ email: supaData?.email }))
          .then((response) => response.data)

        let subscription = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/subscription_list`,
          urlEncode({ customer_id: customer?.id }))
          .then((response) => response.data)

        let data = {
          chargebee_subscription: JSON.stringify(subscription),
          chargebee_subscription_id: subscription?.id,
          chargebee_customer: JSON.stringify(customer),
          chargebee_customer_id: customer?.id,
          subscribed: true,
        }
        console.log(data);
        const { data: { user } } = await supabase.auth.getUser();
        await supabase
          .from("users")
          .update(data).eq('user_id', user.id);
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
    setSubLoading(false)
    // const { data: { user } } = await supabase.auth.getUser();

    // await supabase
    //   .from('users')
    //   .update({ onTrail: false, subscribed: true })
    //   .eq('user_id', user.id)

  }

  const cancelSubscription = async () => {
    if (window.confirm("Are you sure you want to cancel your subscription")) {
      setSubLoading(true)
      try {
        let a = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/cancel_for_items`,
          urlEncode({ subscription_item_id: supaData.chargebee_subscription_id }))
          .then((response) => response?.data)
          .catch((error) => {
            console.log(error);
          })
        // console.log(a);
        // if (a.subscription?.status === 'cancelled') {
        if (a.status === 'valid') {
          const { data: { user } } = await supabase.auth.getUser();
          await supabase
            .from('users')
            .update({ onTrail: false, subscribed: false, status: 'cancelled' })
            .eq('user_id', user.id)
          alert('Your subscription has been successfully canceled.');
          window.location = '/'
        }
      } catch (error) {
        console.log(error);
      }
      setSubLoading(false)
    } else {
      console.log("aborted!")
    }
  }

  return (<>
  <Nav />

    <div className="container m-auto mt-9 px-6">
      <div className="grid justify-center items-center bg-white mb-5">
        <div className="flex justify-center items-center py-3">
          <img src={supaData.profile_pic_url} className="w-32 h-w-32 object-cover rounded-[50%] mb-10" alt="" />
        </div>
        <h4 className="pb-4 text-gray20 font-bold text-[20px] font-MontserratBold">Account settings</h4>
        <div className="py-2 font-MontserratRegular">
          <div className="form-outline mb-4">
            <input
              type="text"
              className="bg-inputbkgrd rounded-[10px] py-4 px-4 w-full"
              value={fullname}
              onChange={({ target }) => setFullname(target.value)}
              placeholder={supaData.full_name}
            />
          </div>
          <div className="form-outline mb-4">
            <input
              type="text"
              value={newEmail}
              onChange={({ target }) => setNewEmail(target.value)}
              className="bg-inputbkgrd rounded-[10px] py-4 px-4  w-full"
              placeholder={email}
            />
          </div>

          <div className="form-outline mb-4">
            <input
              type="password"
              id="form2Example2"
              className="bg-inputbkgrd rounded-[10px] py-4 px-4  w-full"
              placeholder="Password"
            />
          </div>
          <div className="py-3 pb-4 d-flex ">
            <button className="bg-secondaryblue font-MontserratBold font-bold text-base text-white rounded-[10px] py-3 w-full" onClick={() => onUpdate()} > {loading ? "Loading..." : "Save Changes"}</button>
          </div>

          <div className="shadow-subs2 w-full mb-8 mt-10 rounded-[10px]">
            <div className="px-4 py-5">
              <h3 className="font-bold text-xl text-gray20 pb-2 font-MontserratSemiBold">Subscription Settings</h3>
              <p className="font-bold text-sm text-[#333] pb-9 font-MontserratRegular">Here you can renew or cancel your subscription with ease. <br /> You can resubscribe at any time.</p>
              {!supaData.subscribed ? <button onClick={renewSubscription} className="text-btngreen w-full rounded-[10px] border-solid border-[0.4px] border-black py-3 mb-3">{subLoading ? "Loading..." : "Renew"}</button> :
                <button
                  onClick={() => {
                    // cancelSubscription()
                    setShowModal(true)
                  }} className="bg-red-700 text-white font-MontserratBold w-full rounded-[10px] border-solid border-[0.4px] py-3">{subLoading ? "Loading..." : "Cancel"}</button>}
            </div>
          </div>
        </div>
      </div>
    </div>

    {showModal && <div className="fixed top-0 left-0 w-full h-screen bg-black/40 grid place-items-center">
      <div className="bg-white to-black py-7 pt-12 px-10 relative max-w-[300px] md:max-w-[500px] lg:max-w-[600px] font-MontserratRegular">
        <FaTimesCircle className="absolute top-3 right-3 flex flex-col items-center" 
        onClick={() => {
          setShowModal(false)
        }} />
        <h1 className="text-lg font-bold text-center font-MontserratSemiBold text-[#333]">Submit your cancellation request</h1>
        <p className="text-center">
          All cancellations requests have to be processed by our support team. Please request a cancellation and provide us with your reason for cancelling by emailing <a href="mailto:support@sproutysocial.com" className="text-blue-500">support@sproutysocial.com</a>. We appreciate your feedback and are always looking to improve
        </p>
        <br />
        <p className="text-center">
          Our expert account managers are always on standby and ready to help. If you are not getting results, or need help, schedule a time to speak with our expert team who can help you reach your full instagram growth potential.
        </p>
        <a href="mailto:support@sproutysocial.com" className="mt-8 m-auto w-fit py-3 rounded-[10px] font-MontserratRegular px-10 bg-blue-500 text-white flex justify-center items-center gap-3">
          <BsFillEnvelopeFill />
          Send an email
        </a>
      </div>
    </div>}
  </>);
}
