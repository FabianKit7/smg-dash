import "./App.css";
import { Routes, Route } from "react-router-dom";
import Search from "./components/Search";
import Dashboard from "./components/Dashboard";
import Subscriptions from "./components/Subscriptions";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Settings from "./components/Settings/Settings";
import Admin from "./components/Admin/Admin";
import Nav from "./components/Nav";

const pathname = window.location.pathname;

function App() {
  return (
    <>
      {pathname === "/" || pathname === "/login" || pathname === "/signUp" ? "" : <Nav />}
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
      </Routes>
    </>
  );
}

export default App;
