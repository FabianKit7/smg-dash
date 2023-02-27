import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import sproutyLogo from "../images/sprouty.svg"

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  // console.log("🚀 ~ file: SignUp.jsx:7 ~ SignUp ~ loading", loading)
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  // console.log("🚀 ~ file: SignUp.jsx:8 ~ SignUp ~ email", email);
  const [password, setPassword] = useState("");
  // console.log("🚀 ~ file: SignUp.jsx:9 ~ SignUp ~ password", password);


  const navigate = useNavigate();


  const handleLogin = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error){
      console.log(error.message);
      alert(error.message);

    } 

    if (data) {
      console.log(data?.user?.username);
      const { error } = await supabase
        .from("users")
        .insert({
          user_id: data.user.id,
          full_name: fullName, 
          username: data?.user?.username || ''
        });
      if (error) console.log(error);
      navigate("/search")
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="shadow-2-strong p-5">
        <div className="flex flex-col justify-center items-center pb-10">
          {/* <img className="w-48 h-40 mt-10 lg:mt-14" src={sproutyLogo} alt="sprouty social" /> */}
          <div className="font-MADEOKINESANSPERSONALUSE text-[28px]"><strong className="text-[25px] text-left">SPROUTYSOCIAL</strong></div>
          <hr className="mb-7 w-full border-[#ef5f3c]" />

          <h5 className="font-bold text-[2.625rem] text-center text-black font-MADEOKINESANSPERSONALUSE">Create an account</h5>
          <p className="text-center text-[0.75rem] font-MontserratRegular text-[#333]">Start growing <span className="font-bold">~1-10k</span> real and targeted Instagram <br /><span className="font-bold">followers</span> every month.</p>
        </div>
        <form action="" className="flex flex-col items-center justify-start">
          <div className="form-outline mb-4">
            <input
              type="email"
              id="form2Example1"
              className="rounded-[10px] py-4 px-4 w-80 text-[1.25rem] bg-transparent border shadow-[inset_0_0px_2px_rgba(0,0,0,0.4)]"
              value={fullName}
              placeholder="Full Name"
              onChange={({ target }) => setFullName(target.value)}
            />
          </div>
          <div className="form-outline mb-4">
            <input
              type="email"
              id="form2Example1"
              className="rounded-[10px] py-4 px-4 w-80 text-[1.25rem] bg-transparent border shadow-[inset_0_0px_2px_rgba(0,0,0,0.4)]"
              value={email}
              placeholder="Email Address"
              onChange={({ target }) => setEmail(target.value)}
            />
          </div>

          <div className="form-outline mb-4">
            <input
              type="password"
              id="form2Example2"
              className="rounded-[10px] py-4 px-4 w-80 text-[1.25rem] bg-transparent border shadow-[inset_0_0px_2px_rgba(0,0,0,0.4)]"
              value={password}
              placeholder="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>

          <button
            type="button"
            className="text-white font-MontserratSemiBold text-[16px] mt-[14px] mb-[12px] rounded-[5px] py-2 px-6 h-[52px] w-80 font-semibold"
            style={{
              backgroundColor: '#ef5f3c',
              color: 'white',
              boxShadow: '0 20px 30px -12px rgb(255 132 102 / 47%)'
            }}
            onClick={() => handleLogin()}
          >
            Sign Up Now
          </button>
        </form>

        <div className="text-center font-MontserratSemiBold">
          <p className="font-bold text-sm text-[#333]">
            Already have an account? <Link to="/login"><span className="text-[#1b89ff]">Sign in</span></Link>
          </p>
        </div>
        <br /><br />
      </div>
    </div>
  );
}
