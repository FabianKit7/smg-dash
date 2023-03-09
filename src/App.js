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

const pathname = window.location.pathname;

function App() {
  useEffect(() => {
    window.Chargebee.init({
      site: "honeycomics-v3-test",
      publishableKey: "test_qoH22RugUvm5IcxoqUD5Svdcu9mX5figf"
    })
  }, [])

  return (
    <>
      {/* {pathname === "/" ||
        pathname === "/login" ||
        pathname === "/login/" ||
        pathname === "/signUp" ||
        pathname === "/SignUp" ||
        pathname === "/SignUp/" ||
        pathname === "/dashboard" ||
        pathname === "/dashboard/" ||
        pathname === "/dashboard/login" ||
        pathname.startsWith("/subscription") ||
        pathname.startsWith("/dashboard/edit/")
        ? "" : <Nav />} */}
      {/* <Nav /> */}
      <Routes>
        {/* <Route index element={<Home />} /> */}
        <Route index element={<Login />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" exact element={<Login />} />
        <Route path="/signUp" exact element={<SignUp />} />
        <Route path="/settings" exact element={<Settings />} />
        <Route path="/admin" exact element={<Admin />} />
        <Route
          path="/subscriptions/:username"
          exact
          element={<Subscriptions />}
        />
        <Route path="/dashboard/:id" exact element={<Dashboard />} />
        <Route path="/dashboard" exact element={<DashboardApp />} />
        <Route path="/dashboard/edit/:id" exact element={<Edit />} />
        <Route path="/dashboard/login" exact element={<AdminLogin />} />
      </Routes>
    </>
  );
}

export default App;
