import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
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

export default function Settings() {
  // const baseUrl = "http://localhost:8000"
  const baseUrl = 'https://sproutysocial-api.onrender.com'
  const [supaData, setData] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  // const [error, setError] = useState(false);
  const [loading, setloading] = useState(false);
  const [cbInstance, setCbInstance] = useState()

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
        publishableKey: "live_JtEKTrE7pAsvrOJar1Oc8zhdk5IbvWzE",
      })
      const instance = window?.Chargebee?.getInstance()
      // console.log(instance);
      setCbInstance(instance);
      const { data: { user } } = await supabase.auth.getUser()
      instance.setPortalSession(async () => {
        // https://apidocs.chargebee.com/docs/api/portal_sessions#create_a_portal_session
        return await axios.post(`${baseUrl}/api/generate_portal_session`, urlEncode({ customer_id: user?.id })).then((response) => response.data);
      });
    }
    fetch()
  }, [baseUrl])

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
      console.log(error);
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
    await cbInstance.openCheckout({
      async hostedPage() {
        return await axios.post(`${baseUrl}/api/generate_checkout_new_url`,
          urlEncode({ plan_id: "Monthly-Plan-USD-Monthly" }))
          .then((response) => response.data)
      },
      async success(hostedPageId) {
        console.log(hostedPageId);
        let customer = await axios.post(`${baseUrl}/api/customer_list`,
          urlEncode({ email: supaData?.email }))
          .then((response) => response.data)

        let subscription = await axios.post(`${baseUrl}/api/subscription_list`,
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
    // const { data: { user } } = await supabase.auth.getUser();

    // await supabase
    //   .from('users')
    //   .update({ onTrail: false, subscribed: true })
    //   .eq('user_id', user.id)

  }

  const cancelSubscription = async () => {
    if (window.confirm("Are you sure you want to cancel your subscription")) {
      let a = await axios.post(`${baseUrl}/api/cancel_for_items`,
        urlEncode({ subscription_item_id: supaData.chargebee_subscription_id }))
        .then((response) => response.data)
        console.log(a);
      if (a.subscription?.status === 'cancelled') {
        const { data: { user } } = await supabase.auth.getUser();
        await supabase
          .from('users')
          .update({ onTrail: false, subscribed: false })
          .eq('user_id', user.id)
          alert('you have successfully cancelled the subscription');
          window.location = '/'
      }
    }else{
      console.log("aborted!")
    }
  }

  // console.log(supaData)

  return (
    <div className="container m-auto mt-9 px-6">
      <div className="grid justify-center items-center bg-white mb-5">
        <div className="flex justify-center items-center py-3">
          <img src={supaData.profile_pic_url} className="w-32 h-w-32 object-cover rounded-[50%] mb-10" alt="" />
        </div>
        <h4 className="pb-4 text-gray20 font-bold text-[20px]">Account settings</h4>
        <div className="py-2">
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
            <button className="bg-secondaryblue font-bold text-base text-white rounded-[10px] py-3 w-full" onClick={() => onUpdate()} > {loading ? "Loading..." : "Save Changes"}</button>
          </div>

          <div className="shadow-subs w-full mb-8 mt-10 rounded-[10px]">
            <div className="px-4 py-5">
              <h3 className="font-bold text-xl text-gray20 pb-2">Subscription Settings</h3>
              <p className="font-bold text-sm opacity-40 pb-9">Here you can renew or cancel your subscription with ease. <br /> You can resubscribe at any time.</p>
              {!supaData.subscribed ? <button onClick={renewSubscription} className="text-btngreen w-full rounded-[10px] border-solid border-[0.4px] border-black py-3 mb-3">Renew</button>:
              <button onClick={cancelSubscription} className="text-btnred w-full rounded-[10px] border-solid border-[0.4px] border-black py-3">Cancel</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
