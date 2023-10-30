import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
// import Home from "./components/Home";
import Settings from "./components/Settings/Settings";
import Admin from "./components/Admin/Admin";
// import Nav from "./components/Nav";
import { useEffect } from "react";
import DashboardApp from "./dashboard";
import Edit from "./dashboard/edit";
import AdminLogin from "./dashboard/adminLogin";
import Chat from "./pages/chat";
import Tap from "@tapfiliate/tapfiliate-js";
import Thankyou from "./pages/Thankyou";
import { useState } from "react";
import ManageAccounts from "./pages/ManageAccounts";
import ManagePage from "./pages/admin/ManagePage";
import Retention from "./pages/admin/Retention";
import i18next from "i18next";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)

function App() {
  const pathname = window.location.pathname;

  useEffect(() => {
    // const clickId = getCookie('_vid_t')
    // console.log(clickId);
    Tap.init(
      process.env.REACT_APP_TAPFILIATE_ACCOUNT_ID, // your account ID
      { integration: 'javascript' }, // createOptions with cookie domain set to your main domain
      // createCallback function
      function () {
        // console.log('Tracking code initialized');
      },
      { cookie_domain: '.sproutysocial.com', always_callback: true }, // detectOptions with always_callback set to true to ensure detectCallback is always called
      function (error, result) {
        // console.log("error: ", error);
        // console.log('Click tracked successfully');
        // console.log("result: ", result);
        // You can set the click ID to a cookie here if necessary
      } // detectCallback function
    );
  }, [])

  const [addPadding, setAddPadding] = useState(true)
  useEffect(() => {
    // console.log(pathname);
    if (pathname.includes('/search') || pathname.startsWith('/subscriptions')) {
      setAddPadding(false);
    }
  }, [pathname])

  useEffect(() => {
    const el = document.getElementsByTagName('html')[0]
    const lng = localStorage.getItem('lng') || 'de';    
    el.lang = lng;
    i18next.changeLanguage(lng)
  }, [])


  return (
    <>
      {/* <div className="max-w-[1600px] mx-auto p-5 "> */}

      <div className={`${addPadding ? 'p-5 max-w-[1400px] mx-auto' : 'p-0'}  bg-white text-black font-poppins`}>
        {/* <nav>slkdfjl</nav> */}
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route index element={<Login />} />
          {/* <Route path="/search" element={<Search />} /> */}
          <Route path="/search" exact element={<Login />} />
          {/* <Route path="/signUp" exact element={<SignUp />} /> */}
          {/* <Route path="/forget-password" exact element={<ForgetPassword />} />
          <Route path="/reset-password" exact element={<ResetPassword />} /> */}
          {/* <Route path="/subscriptions/:username" element={
            // <Elements stripe={stripePromise}>
            <Subscriptions />
            // </Elements>
          } /> */}
          <Route path="/:username" exact element={<Dashboard />} />
          <Route path="/:username/settings" exact element={<Settings />} />
          <Route path="/thankyou" exact element={<Thankyou />} />
          <Route path="/dashboard/:username" exact element={<Dashboard />} />
          <Route path="/dashboard/:username/manage" exact element={<ManageAccounts />} />

          <Route path="/upload-session" exact element={<Admin />} />
          <Route path="/admin" exact element={<Admin />} />
          <Route path="/admin/manage" exact element={<ManagePage />} />
          <Route path="/admin/retention" exact element={<Retention />} />

          <Route path="/chat/:username" exact element={<Chat />} />
          <Route path="/dashboard" exact element={<DashboardApp />} />
          <Route path="/dashboard/edit/:username" exact element={<Edit />} />
          <Route path="/login" exact element={<AdminLogin />} />

          <Route path="*" exact element={<Login />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
