import React, { useState } from "react";
// import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { getRefCode } from "../helpers";
import { supabase } from "../supabaseClient";
import AlertModal from "./AlertModal";
import { useTranslation } from "react-i18next";
import { LangSwitcher } from "./Login";
// import { BsFacebook } from "react-icons/bs";

export default function SignUp() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState({ title: 'Alert', message: 'something went wrong' })
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");


  const navigate = useNavigate();


  const handleSignUp = async (e) => {
    e.preventDefault()
    if (loading) return;
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.log(error?.message);
      // alert(error?.message);
      setIsModalOpen(true);
      setErrorMsg({ title: 'Registration Error', message: error?.message })
      setLoading(false);
      return;
    }

    const contd = await regContd(data?.user)
    if (contd?.status !== 200) {
      // alert(contd?.message)
      setIsModalOpen(true);
      setErrorMsg({ title: 'Registration Error', message: contd?.message })
    }
    setLoading(false);
  };

  // async function handleOAuthSignIn(provider) {
  //   const { error } = await supabase.auth.signInWithOAuth({ provider })
  //   if (error) {
  //     // alert("Error occurred while signing in with Google, please try again")
  //     console.log(error);
  //     setIsModalOpen(true);
  //     setErrorMsg({ title: 'Registration Error', message: error?.message })
  //   }

  //   const getUser = await supabase.auth.getUser()

  //   if (getUser?.error) {
  //     console.log(error?.message);
  //     // alert(error?.message);
  //     setIsModalOpen(true);
  //     setErrorMsg({ title: 'Registration Error', message: getUser?.error?.message })
  //     setLoading(false);
  //     return;
  //   }

  //   const contd = await regContd(getUser?.data?.user)
  //   if (contd?.status !== 200) {
  //     // alert(contd.message)
  //     setIsModalOpen(true);
  //     setErrorMsg({ title: 'Registration Error', message: contd?.message })
  //   }
  //   setLoading(false);
  // }

  const regContd = async (user) => {
    if (user) {
      const { error } = await supabase
        .from("users")
        .insert({
          user_id: user?.id,
          full_name: fullName,
          email: email?.toLowerCase(),
          username: ''
        });
      if (error) {
        console.log(error);
        setLoading(false);
        alert('User record not recorded, try again or contact support');
        return { status: 500, message: "User record not recorded" }
      } else {
        const ref = getRefCode()
        if (ref) {
          navigate(`/search?ref=${ref}`)
        } else {
          navigate("/search")
        }
        return { status: 200, message: "success" }
      }
    } else {
      return { status: 500, message: "User not found" }
    }
  }

  return (<>
    <div className="fixed z-50 text-xs rounded-lg shadow-2xl shadow-white w-fit h-fit top-1 md:top-4 right-4 backdrop-blur-md md:text-base">
      <LangSwitcher />
    </div>

    <AlertModal
      isOpen={isModalOpen}
      onClose={() => { setIsModalOpen(false) }}
      title={errorMsg?.title}
      message={errorMsg?.message}
    />

    <div id="affiliateScript"></div>

    <div className="flex flex-col items-center justify-center h-screen">
      <div className="p-5 md:p-10 md:shadow-lg rounded-[10px] w-full md:w-[458px]">
        <div className="flex flex-col items-center justify-center">
          {/* <img className="w-48 h-40 mt-10 lg:mt-14" src={sproutyLogo} alt="sprouty social" /> */}
          <div className=" text-[28px]">
            <div className="items-center hidden gap-2 md:flex">
              <img src="/logo.png" alt="" className="w-[38px] h-[34.26px]" />
              <b className="text-[32px]">SocialMediaGains</b>
            </div>
            {/* <img src="/sproutysocial-light.svg" alt="" className="w-[220px]" /> */}
            {/* <img src="/LogoSprouty2.svg" alt="" className="w-[220px]" /> */}
            {/* <strong className="text-[25px] text-left">SPROUTYSOCIAL</strong> */}
          </div>
          {/* <hr className="mb-7 w-full border-[#ef5f3c]" /> */}

          <h5 className="font-semibold text-[2rem] text-center text-black-r  mt-[30px]">{t("Partner With Us")}</h5>
          {/* <p className="text-center text-[0.75rem]  text-[#333]">Start growing <span className="font-bold">~1-10k</span> real and targeted Instagram <br /><span className="font-bold">followers</span> every month.</p> */}
          {/* <p className="text-center text-[0.8rem] mt-2 mb-6  text-black-r max-w-[320px]">Join more than <span className="font-bold">25,000</span> users that trust SproutySocial to grow on Instagram. <br className="md:hidden" /> Create an account.</p> */}
          <p className="text-center text-[0.8rem] mt-2 mb-6  text-black-r max-w-[320px]">{t('reg_desc')}</p>
        </div>

        <form action="" className="flex flex-col items-center justify-start" onSubmit={handleSignUp}>
          <div className="mb-3 form-outline">
            <input
              type="text"
              id="form2Example1"
              className="rounded-[5px] h-[52px] px-4 w-72 md:w-80 text-[1rem] bg-transparent border shadow-[inset_0_0px_1px_rgba(0,0,0,0.4)]"
              value={fullName}
              placeholder={t("Full Name")}
              onChange={({ target }) => setFullName(target.value)}
            />
          </div>
          <div className="mb-3 form-outline">
            <input
              type="email"
              id="form2Example2"
              className="rounded-[5px] h-[52px] px-4 w-72 md:w-80 text-[1rem] bg-transparent border shadow-[inset_0_0px_1px_rgba(0,0,0,0.4)]"
              value={email}
              placeholder={t("email_address")}
              onChange={({ target }) => setEmail(target.value)}
            />
          </div>

          <div className="form-outline">
            <input
              type="password"
              id="form2Example3"
              className="rounded-[5px] h-[52px] px-4 w-72 md:w-80 text-[1rem] bg-transparent border shadow-[inset_0_0px_1px_rgba(0,0,0,0.4)]"
              value={password}
              placeholder={t("Password")}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>

          <button
            type="submit"
            className="button-gradient2 text-white  text-[16px] mt-6 mb-2 rounded-[5px] h-[52px] px-4 w-72 md:w-80 font-semibold"
            style={{
              boxShadow: '0 10px 30px -12px rgb(255 132 102 / 47%)'
            }}
          >
            {loading ? `${t('Processing')}...` : t('Sign Up Now')}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-black-r ">
            {t("Already have an account?")} <Link to="/search"><span className=" text-[#3d3d3d]">{t("Sign in")}</span></Link>
          </p>
        </div>

        {/* signup with oAuth */}

        {/* <div className="relative items-center justify-center hidden my-8 del-flex">
          <hr className="w-full" />
          <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] px-4 bg-[#DBC8BE] text-white-r">OR</div>
        </div>

        <div className="flex items-center justify-center mt-8 mb-[12px]">
          <button
            onClick={() => handleOAuthSignIn('google')}
            type="button"
            className="flex items-center justify-center gap-2  text-[16px] rounded-[5px] h-[52px] px-6 w-72 md:w-80 font-semibold bg-[#DBC8BE] text-white-r"
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

        <div className="flex items-center justify-center mt-8 mb-[12px]">
          <button
            onClick={() => handleOAuthSignIn('facebook')}
            type="button"
            className="flex items-center justify-center gap-2  text-[16px] rounded-[5px] h-[52px] px-6 w-72 md:w-80 font-semibold bg-[#DBC8BE] text-white-r"
            style={{
              border: '1px solid #ef5f3c',
              color: 'white',
              boxShadow: '0 10px 30px -12px rgb(255 132 102 / 47%)'
            }}
          >
            <BsFacebook />
            <span>Continue with Facebook</span>
          </button>
        </div> */}
      </div>
    </div>
  </>
  );
}
