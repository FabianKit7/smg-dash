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

const pathname = window.location.pathname;

function App() {
  // useEffect(() => {
  //   window.Chargebee.init({
  //     site: "honeycomics-v3-test",
  //     publishableKey: "test_qoH22RugUvm5IcxoqUD5Svdcu9mX5figf"
  //   })
  // }, [])

  // console.log(pathname) // "/dashboard"

  useEffect(() => {
    const scriptText = `
      (function(t,a,p){t.TapfiliateObject=a;t[a]=t[a]||function(){
      (t[a].q=t[a].q||[]).push(arguments)}})(window,'tap');

      tap('create', '40122-96e787', { integration: "chargebee" });
      tap('detect');

      var setupCb = function() {
          
          if (typeof Chargebee === 'undefined') return;

          var cbInstance = Chargebee.getInstance();
          cbInstance.setCheckoutCallbacks(function(cart) {
              return {
                  success: function(hostedPageId, data) {
                      tap('trial', data.subscription.customer_id);
                  }
              };
          });
      };

      "complete"===document.readyState||"loading"!==document.readyState&&!document.documentElement.doScroll?setupCb():document.addEventListener("DOMContentLoaded",setupCb);
    `
    const script = document.createElement('script');
    script.type = "text/javascript"
    script.innerHTML = scriptText

    if (pathname === '/dashboard/') return;
    if (pathname === '/dashboard') return;
    if (pathname.includes('/dashboard/edit')) return;
    document.querySelector('#affiliateScript').appendChild(script)
  }, [])
  

  return (
    <>
    {/* <nav>slkdfjl</nav> */}
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route index element={<Login />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" exact element={<Login />} />
        <Route path="/signUp" exact element={<SignUp />} />
        <Route path="/forget-password" exact element={<ForgetPassword />} />
        <Route path="/reset-password" exact element={<ResetPassword />} />
        <Route path="/settings" exact element={<Settings />} />
        <Route path="/admin" exact element={<Admin />} />
        <Route
          path="/subscriptions/:username"
          exact
          element={<Subscriptions />}
        />
        <Route path="/chat/:id" exact element={<Chat />} />
        <Route path="/dashboard/:id" exact element={<Dashboard />} />
        <Route path="/dashboard" exact element={<DashboardApp />} />
        <Route path="/dashboard/edit/:id" exact element={<Edit />} />
        <Route path="/dashboard/login" exact element={<AdminLogin />} />
      </Routes>
    </>
  );
}

export default App;
