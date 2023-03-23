import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function SignUp() {
  // const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");


  const navigate = useNavigate();


  const handleSignUp = async (e) => {
    e.preventDefault()
    // setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
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
      if (error) return console.log(error);
      navigate("/search")
    }
    // setLoading(false);
  };

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    if (data.user) {
      const { data, error } = await supabase
        .from('users')
        .select('*')

      if (data?.user) {
        window.location = `/dashboard/${data.user?.user_id}`;
      } else {
        console.log({ error })
        alert(error.message)
      }
    } else {
      console.log({ error })
      navigate("/search")
      // alert(error.message)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="p-5 shadow-lg rounded-lg">
        <div className="flex flex-col justify-center items-center pb-10">
          {/* <img className="w-48 h-40 mt-10 lg:mt-14" src={sproutyLogo} alt="sprouty social" /> */}
          <div className="font-MADEOKINESANSPERSONALUSE text-[28px]"><strong className="text-[25px] text-left">SPROUTYSOCIAL</strong></div>
          <hr className="mb-7 w-full border-[#ef5f3c]" />

          <h5 className="font-bold text-[2.625rem] text-center text-black font-MADEOKINESANSPERSONALUSE">Partner With Us</h5>
          {/* <p className="text-center text-[0.75rem] font-MontserratRegular text-[#333]">Start growing <span className="font-bold">~1-10k</span> real and targeted Instagram <br /><span className="font-bold">followers</span> every month.</p> */}
          <p className="text-center text-[0.75rem] font-MontserratRegular text-[#333] max-w-[320px]">Join more than <span className="font-bold">25,000</span> users that trust SproutySocial to grow on Instagram. Create an account.</p>
        </div>
        <form action="" className="flex flex-col items-center justify-start" onSubmit={handleSignUp}>
          <div className="form-outline mb-4">
            <input
              type="text"
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
            type="submit"
            className="text-white font-MontserratSemiBold text-[16px] mt-[14px] mb-[12px] rounded-[5px] py-2 px-6 h-[52px] w-80 font-semibold"
            style={{
              backgroundColor: '#ef5f3c',
              color: 'white',
              boxShadow: '0 20px 30px -12px rgb(255 132 102 / 47%)'
            }}
          >
            Sign Up Now
          </button>
        </form>

        <div className="text-center font-MontserratSemiBold">
          <p className="font-bold text-sm text-[#333]">
            Already have an account? <Link to="/login"><span className="text-[#1b89ff]">Sign in</span></Link>
          </p>
        </div>

        <div className="hidden del-flex items-center justify-center">
          <button
            onClick={signInWithGoogle}
            type="button"
            className="flex items-center justify-center gap-2 font-MontserratSemiBold text-[16px] mt-8 mb-[12px] rounded-[5px] py-2 px-6 h-[52px] w-80 font-semibold bg-white text-black"
            style={{
              border: '1px solid #ef5f3c',
              color: 'white',
              boxShadow: '0 10px 30px -12px rgb(255 132 102 / 47%)'
            }}
          >
            <FcGoogle />
            <span>Continue with Google</span>
          </button>
        </div>
        <br /><br />
      </div>
    </div>
  );
}
