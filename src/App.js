import "./App.css";
import { Routes, Route } from "react-router-dom";
import Search from "./components/Search";
import Dashboard from "./components/Dashboard";
import Subscriptions from "./components/Subscriptions";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
// import Home from "./components/Home";
import Settings from "./components/Settings/Settings";
import Admin from "./components/Admin/Admin";
// import Nav from "./components/Nav";
import { useEffect } from "react";
import DashboardApp from "./dashboard";
import Edit from "./dashboard/edit";
import AdminLogin from "./dashboard/adminLogin";
import ForgetPassword from "./pages/forgetPassword";
import ResetPassword from "./pages/resetPassword";
import Chat from "./pages/chat";
import Tap from "@tapfiliate/tapfiliate-js";
import Thankyou from "./pages/Thankyou";
import { useState } from "react";
// import { getCookie } from "./helpers";


function App() {
  const pathname = window.location.pathname;
  useEffect(() => {
    // const clickId = getCookie('_vid_t')
    // console.log(clickId);
    Tap.init(
      '40122-96e787', // your account ID
      { integration: 'javascript' }, // createOptions with cookie domain set to your main domain
      function () { console.log('Tracking code initialized'); }, // createCallback function
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
    if (pathname.includes('/search') || pathname.startsWith('/subscriptions')){
      setAddPadding(false);
    }
  }, [pathname])
  

  return (
    <>
      {/* <div className="max-w-[1600px] mx-auto p-5 font-MontserratRegular"> */}
      <div className={`${addPadding ? 'p-5 max-w-[1600px] mx-auto' : 'p-0' } font-MontserratRegular`}>
        {/* <nav>slkdfjl</nav> */}
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route index element={<Login />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signUp" exact element={<SignUp />} />
          <Route path="/forget-password" exact element={<ForgetPassword />} />
          <Route path="/reset-password" exact element={<ResetPassword />} />
          <Route
            path="/subscriptions/:username"
            element={<Subscriptions />}
          />
          <Route path="/settings" exact element={<Settings />} />
          <Route path="/thankyou" exact element={<Thankyou />} />
          <Route path="/dashboard/:id" exact element={<Dashboard />} />

          <Route path="/admin" exact element={<Admin />} />
          <Route path="/chat/:id" exact element={<Chat />} />
          <Route path="/dashboard" exact element={<DashboardApp />} />
          <Route path="/dashboard/edit/:id" exact element={<Edit />} />
          <Route path="/dashboard/login" exact element={<AdminLogin />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
