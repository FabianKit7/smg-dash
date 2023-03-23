import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {
  //   const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) return navigate(`/dashboard/${user?.id}`)
    };

    getData();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (data.user) {
      window.location = `/dashboard/${data.user?.id}`;
    }
    if (error) console.log(error.message);
    if (error.message === 'Invalid login credentials') {
      alert(`${error.message}, please check your credentials and try again`);
      return;
    }
    if (error?.message === `Cannot read properties of null (reading 'id')`) {
      alert('User not found please try again or register')
    } else {
      alert('An error occurred, please try again')
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="p-5 shadow-lg rounded-lg">
        <div className="flex flex-col justify-center items-center pb-10">
          {/* <img className="w-48 h-40 mt-10 lg:mt-14" src={sproutyLogo} alt="sprouty social" /> */}
          <div className="font-MADEOKINESANSPERSONALUSE text-[28px]"><strong className="text-[25px] text-left">SPROUTYSOCIAL</strong></div>
          <hr className="mb-7 w-full border-[#ef5f3c]" />

          <h5 className="font-bold text-[2.625rem] text-black font-MADEOKINESANSPERSONALUSE">Welcome Back</h5>
          <p className="text-center text-[0.75rem] font-MontserratRegular text-[#333]">Start growing <span className="font-bold">~1-10k</span> real and targeted Instagram <br /><span className="font-bold">followers</span> every month.</p>
        </div>
        <form action="" className="flex flex-col items-center justify-start" onSubmit={handleLogin}>
          <div className="form-outline mb-4 font-MontserratRegular">
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
            /> <br />
            <Link to="/forget-password"><span className="text-[#1b89ff] font-MontserratSemiBold font-[600] text-[14px] mt-3">Forgot Password?</span></Link>
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
            Continue
          </button>
        </form>

        <div className="text-center font-MontserratSemiBold">
          <p className="font-bold text-sm text-[#333]">
            Don't have an account? <Link to="/SignUp"><span className="text-[#1b89ff]">Sign Up</span></Link>
          </p>
        </div>
        <br /><br />
      </div>
    </div>
  );
}
