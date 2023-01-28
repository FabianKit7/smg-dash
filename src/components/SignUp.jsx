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
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (data) {
        console.log(data?.user?.username);
        const { error } = await supabase
          .from("users")
          .insert({
            user_id: data.user.id,
            full_name: fullName, 
            username: data?.user?.username || '',
            
            
            
            // status: 'pending', // active, pending
            // userMode: 'auto', // auto, folloew, unfolloew, off
            // instagramPassword: '',
            // targetingFilter: {
            //   "followersMin": 1,
            //   "followersMax": 20000,
            //   "followingMin": 1,
            //   "followingMax": 10000,
            //   "mediaMin": 1,
            //   "mediaMax": 1000,
            //   "privacy": "All",
            //   "gender": "All",
            //   "lang": "All",
            //   "margicFilter": false
            // },
            // "privacy": 'All', // All, Public, Private
            // "gender": 'All', // All, Male, Female
            // "lang": 'All', // All, English, French
            // profile: {
            //   "posts": 223,
            //   "followers": 17200,
            //   "following": 665
            // },
            // finish_time: '', //"2023-01-27 17:51:16.819373"
            // total_interactions: 0,
          });
        // console.log("🚀 ~ file: SignUp.jsx:29 ~ handleLogin ~ error", error)
        navigate("/search")
      }


      if (error) throw error;
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="shadow-2-strong p-5">
        <div className="flex flex-col justify-center items-center pb-10">
          <img className="w-48 h-40 mt-10 lg:mt-14" src={sproutyLogo} alt="sprouty social" />
          <h5 className="font-bold text-[40px] text-gray20">Create an account</h5>
          <p className="text-center font-bold text-sm opacity-40">Start growing ~1-10k real and targeted Instagram followers every month.</p>
        </div>
        <form action="" className="flex flex-col items-center justify-start">
          <div className="form-outline mb-4">
            <input
              type="email"
              id="form2Example1"
              className="bg-inputbkgrd rounded-[10px] py-4 px-4 w-80"
              value={fullName}
              placeholder="Full Name"
              onChange={({ target }) => setFullName(target.value)}
            />
          </div>
          <div className="form-outline mb-4">
            <input
              type="email"
              id="form2Example1"
              className="bg-inputbkgrd rounded-[10px] py-4 px-4 w-80"
              value={email}
              placeholder="Email Address"
              onChange={({ target }) => setEmail(target.value)}
            />
          </div>

          <div className="form-outline mb-4">
            <input
              type="password"
              id="form2Example2"
              className="bg-inputbkgrd rounded-[10px] py-4 px-4 w-80"
              value={password}
              placeholder="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>

          <button
            type="button"
            className="bg-primaryblue rounded-[10px] py-2 px-6 text-slate-50 font-semibold text-base mb-1"
            onClick={() => handleLogin()}
          >
            Sign Up Now
          </button>
        </form>

        <div className="text-center">
          <p className="font-bold text-sm opacity-40 text-gray20">
            Already have an account? <Link to="/login"><span className="text-primaryblue">Sign in</span></Link>
          </p>
        </div>
      </div>
    </div>
  );
}
