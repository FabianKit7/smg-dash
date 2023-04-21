import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { getUser } from "../helpers";
import { supabase } from "../supabaseClient";

export default function Login() {
  //   const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const u = user ? await getUser(user?.id) : null
      if (u.status === 200) return navigate(`/dashboard/${u?.obj.username}`)
      console.log(u);
    };

    getData();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault()
    const authUserObj = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authUserObj?.data?.user) {
      const user = await getUser(authUserObj?.data?.user?.id)
      if (user.status === 500) {
        console.log(user.obj);
        alert('an error occured')
        return
      } else {
        navigate(`/dashboard/${user?.obj?.username}`)
        // window.location = `/dashboard/${authUser?.data?.user?.username}`;
      }
      return;
    }

    if (authUserObj.error) console.log(authUserObj.error.message);
    if (authUserObj.error.message === 'Invalid login credentials') {
      alert(`${authUserObj.error.message}, please check your credentials and try again`);
      return;
    }
    if (authUserObj.error?.message === `Cannot read properties of null (reading 'id')`) {
      alert('User not found please try again or register')
    } else {
      alert('An error occurred, please try again')
    }
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    const authUser = await supabase.auth.getUser()
    if (authUser?.data?.user) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', authUser?.data?.user?.id)

      if (data?.user) {
        // window.location = `/dashboard/${data.user?.user_id}`;
        window.location = `/dashboard/${authUser?.data.user?.username}`;
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

  // useEffect(() => {
  //   const scriptText = `
  //     (function(t,a,p){t.TapfiliateObject=a;t[a]=t[a]||function(){ (t[a].q=t[a].q||[]).push(arguments)}})(window,'tap');

  //     tap('create', '40122-96e787', { integration: "javascript" });
  //     tap('detect');
  //   `
  //   const script = document.createElement('script');
  //   script.type = "text/javascript"
  //   script.innerHTML = scriptText
  //   document.querySelector('#affiliateScript').appendChild(script)
  // }, [])

  return (<>
    <div id="affiliateScript"></div>
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="p-5 md:p-10 md:shadow-lg rounded-[10px] w-full md:w-[458px]">
        <div className="flex flex-col justify-center items-center">
          {/* <img className="w-48 h-40 mt-10 lg:mt-14" src={sproutyLogo} alt="sprouty social" /> */}
          <div className="font-MADEOKINESANSPERSONALUSE text-[28px]">
            <img src="/sproutysocial-light.svg" alt="" className="w-[220px]" />
            {/* <img src="/LogoSprouty2.svg" alt="" className="w-[220px]" /> */}
            {/* <strong className="text-[25px] text-left">SPROUTYSOCIAL</strong> */}
          </div>
          <hr className="mb-7 w-full border-[#ef5f3c]" />

          <h5 className="font-semibold text-[2rem] text-center text-black font-MontserratSemiBold mt-[30px]">Welcome Back</h5>
          <p className="text-center text-[0.8rem] mt-2 mb-6 font-MontserratRegular text-black max-w-[320px]">Start growing <span className="font-bold">~1-10k</span> real and targeted Instagram <span className="font-bold">followers</span> every month.</p>
        </div>
        <form action="" className="flex flex-col items-center justify-start" onSubmit={handleLogin}>
          <div className="form-outline mb-3 font-MontserratRegular">
            <input
              type="email"
              id="form2Example1"
              className="rounded-[5px] h-[52px] px-4 w-72 md:w-80 text-[1rem] bg-transparent border shadow-[inset_0_0px_1px_rgba(0,0,0,0.4)]"
              value={email}
              placeholder="Email Address"
              onChange={({ target }) => setEmail(target.value)}
            />
          </div>

          <div className="form-outline">
            <input
              type="password"
              id="form2Example2"
              className="rounded-[5px] h-[52px] px-4 w-72 md:w-80 text-[1rem] bg-transparent border shadow-[inset_0_0px_1px_rgba(0,0,0,0.4)]"
              value={password}
              placeholder="Password"
              onChange={({ target }) => setPassword(target.value)}
            /> <br />
            <Link to="/forget-password"><span className="text-[#1b89ff] font-MontserratSemiBold font-[600] text-[14px] mt-3">Forgot Password?</span></Link>
          </div>

          <button
            type="submit"
            className="text-white font-MontserratSemiBold text-[16px] mt-6 mb-2 rounded-[5px] py-2 px-6 h-[52px] w-72 md:w-80 font-semibold"
            style={{
              backgroundColor: '#ef5f3c',
              color: 'white',
              boxShadow: '0 10px 30px -12px rgb(255 132 102 / 47%)'
            }}
          >
            Continue
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-black font-MontserratRegular">
            Don't have an account? <Link to="/SignUp"><span className="font-MontserratSemiBold text-[#1b89ff]">Sign Up</span></Link>
          </p>
        </div>

        <div className="hidden del-flex justify-center items-center relative my-8">
          <hr className="w-full" />
          <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] px-4 bg-white text-black">OR</div>
        </div>

        <div className="hidden del-flex items-center justify-center">
          <button
            onClick={signInWithGoogle}
            type="button"
            className="flex items-center justify-center gap-2 font-MontserratSemiBold text-[16px] mt-8 mb-[12px] rounded-[5px] py-2 px-6 h-[52px] w-72 md:w-80 font-semibold bg-white text-black"
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
  </>
  );
}
