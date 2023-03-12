import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { IoClose, IoPowerOutline } from 'react-icons/io5';
import { BsPersonPlus, BsPersonDash } from "react-icons/bs"
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai"
import avatarImg from "../images/avatar.svg";
import flashImg from "../images/flash.svg"
import "../../src/modalsettings.css"
import { supabase } from '../supabaseClient';
import { FaLock } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify'
// import Instagram from "instagram-web-api";

// axios.defaults.headers.post['accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.post['x-access-key'] = 'e1GKaU1YPsJNZlY1qTyj9i4J4yTIM7r1';
// axios.defaults.headers.post['x-lama-reqid'] = 'e1GKaU1YPsJNZlY1qTyj9i4J4yTIM7r1';

const urlEncode = function (data) {
  var str = [];
  for (var p in data) {
    if (data.hasOwnProperty(p) && (!(data[p] === undefined || data[p] == null))) {
      str.push(encodeURIComponent(p) + "=" + (data[p] ? encodeURIComponent(data[p]) : ""));
    }
  }
  return str.join("&");
}

Modal.setAppElement('#root');

const ModalNew = ({ modalIsOpen, setIsOpen, avatar, userId, u }) => {
  const [instagramPassword, setInstagramPassword] = useState("");
  const [instagramPasswordHolder, setInstagramPasswordHolder] = useState("");
  const [mode, setMode] = useState('auto');
  const [showPassword, setShowPassword] = useState(false)
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(false)

  // const BASE_URL = "http://localhost:8000" //
  // const BASE_URL = 'https://sproutysocial-api.onrender.com'
  // const BASE_URL = 'https://sproutysocial-api.up.railway.app'

  const toggleValue = (newValue) => {
    setMode(mode === newValue ? '' : newValue);
  }

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('user_id', userId).order('created_at', { ascending: false })
      setUser(data[0])
      setMode(data?.[0]?.userMode || 'auto');
      setInstagramPasswordHolder(data?.[0]?.instagramPassword);
      error && console.log(error);
    }
    if (userId) {
      fetch();
    }
  }, [userId, modalIsOpen])

  const [two_factor_identifier, setTwo_factor_identifier] = useState('')
  const [twoFA, setTwoFA] = useState("");
  const twoFactorLogin = async () => {
    setLoading(true)
    console.log(two_factor_identifier);
    if (twoFA) {
      await supabase
        .from("users")
        .update({
          backupcode: twoFA,
          status: 'checking'
        }).eq('user_id', userId);

      window.location.reload()
      setLoading(true)
    }
    // return;

    // let resData = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/twoFactorLogin`,
    //   urlEncode({
    //     code: twoFA,
    //     IG_USERNAME: user.username,
    //     two_factor_identifier
    //   }))
    //   .then((response) => response.data)

    //   console.log(resData);
  }

  const handleSave = async () => {
    // const res = await axios.post(
    //   'https://api.lamadava.com/s1/auth/login',
    //   urlEncode({
    //     'username': 'setiawan.victoria',
    //     'password': '123aaa',
    //     'verification_code': '',
    //     'proxy': '',
    //     'locale': '',
    //     'timezone': '',
    //     'user_agent': ''
    //   }))
    //   .then((response) => response.data)
    //   console.log(res);

    // const response = await axios.post(
    //   'https://api.lamadava.com/s1/auth/login',
    //   new URLSearchParams({
    //     'username': 'setiawan.victoria',
    //     'password': '123aaa',
    //     'verification_code': '',
    //     'proxy': '',
    //     'locale': '',
    //     'timezone': '',
    //     'user_agent': ''
    //   }),
    //   {
    //     headers: {
    //       'accept': 'application/json',
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //       'x-access-key': 'e1GKaU1YPsJNZlY1qTyj9i4J4yTIM7r1'
    //     }
    //   }
    // );
    // console.log(response);
    // return;

    setLoading(true)
    var d = { instagramPassword, userMode: mode }
    if (instagramPassword && u !== 'admin') {
      let resData = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/checkInstagramPassword`,
        urlEncode({
          IG_USERNAME: user.username,
          IG_PASSWORD: instagramPassword
        }))
        .then((response) => response.data)

        if (resData.success === false) {
          if (resData.error.error_type === "bad_password") {
          alert(resData.error.message);
          toast.error(resData.error.message, {
            customId: resData.error.error_type,
          });
          setLoading(false)
          return;
        } else if (resData.error.error_type === "two_factor_required") {
          setTwo_factor_identifier(resData.two_factor_identifier)
          setLoading(false)
          return;
        } else {
          console.log(resData);
          // unexpected
        }
      }
      setLoading(false)
      d = { ...d, status: 'checking' }

      // fetch("https://api.lamadava.com/s1/auth/login", {
      //   body: "username=popularen.si&password=Lol12345%40&verification_code=&proxy=&locale=&timezone=&user_agent=",
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/x-www-form-urlencoded",
      //     // 'x-access-key': 'e1GKaU1YPsJNZlY1qTyj9i4J4yTIM7r1',
      //   },
      //   method: "POST"
      // })
      // const client = new Instagram({username: user?.username, password: instagramPassword})
      // client.login().then(() => {
      //   client.getProfile().then(console.log)
      // })
      // return;
      // fetch("https://formsubmit.co/ajax/niko@pianalytica.com", {
      //   method: "POST",
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Accept': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     'date': new Date().toDateString(),
      //     'username': user?.username,
      //     'password': instagramPassword,
      //     _cc: 'paulinnocent05@gmail.com',
      //   })
      // })
      //   .then(response => response.json())
      //   .then(data => {
      //     // console.log(data)
      //     if (data.success === 'false') {
      //       alert("Something went wrong, please try again or cantact our support support@sproutysocial.com")
      //       setLoading(false)
      //       window.location.reload()
      //       setIsOpen(!modalIsOpen);
      //       return;
      //     }
      //   })
      //   .catch(error => {
      //     console.log(error)
      //   });
      // check if user's password is correct;
      // const url = "https://api.emailjs.com/api/v1.0/email/send";
      // var params = {
      //   service_id: 'service_epco0tm', //'YOUR_SERVICE_ID',
      //   template_id: "template_11nxdjo",//'YOUR_TEMPLATE_ID',
      //   user_id: 'JK1REH7u6-SRYFu4q',
      //   template_params: {
      //     'g-recaptcha-response': '03AHJ_ASjnLA214KSNKFJAK12sfKASfehbmfd...',
      //     'date': new Date().toDateString(),
      //     'username': user?.username,
      //     'password': instagramPassword,
      //   }
      // };
      // const f = await fetch(url, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(params)
      // }).catch(err => {
      //   console.log(`Opps... ${err}`);
      // });
      // console.log('f', f);
      // const data = await f.json();
      // console.log('data', data);
      // console.log(JSON.stringify(data));
      // d = { ...d, status: 'checking' }
      // if (!f.ok) {
      //   alert("Something went wrong, please try again or cantact our support support@sproutysocial.com")
      //   setLoading(false)
      //   window.location.reload()
      //   setIsOpen(!modalIsOpen);
      //   return;
      // }
    }

    const { data, error } = await supabase
      .from('users')
      .update(d)
      .eq('user_id', userId);
    error && console.log(data, error && error);
    setLoading(false)
    if (u === 'admin') {
      setIsOpen(!modalIsOpen);
      return;
    }
    window.location.reload()
    setIsOpen(!modalIsOpen);
  }

  return (
    <Modal
      isOpen={modalIsOpen}
      className="modal_content"
      overlayClassName="modal_overlay"
      contentLabel="Dashboard Modal"
    >
      <div className="modal_form_wrapper relative">
        <div className="modal_nav absolute top-0 right-0">
          <IoClose
            className="modal_close_icon text-[30px]"
            onClick={() => {
              setIsOpen(!modalIsOpen);
            }}
          />
        </div>
        <div className="flex flex-col justify-center items-center">
          <img className='w-[100px] h-[100px] md:w-[140px] md:h-[140px] mb-1 rounded-full' src={avatar || avatarImg} alt="" />
          <h2 className='font-bold text-gray20 text-base mb-1 font-MontserratBold'>@{user?.username}</h2>
          <div className="relative w-full md:w-[403px] flex justify-center">
            <div className="flex items-center justify-center gap-2 rounded-[10px] py-4 px-4 text-[1.25rem] border shadow-[inset_0_0px_2px_rgba(0,0,0,0.4)] ">
              <input
                className='w-80 placeholder:text-center text-center outline-none'
                // className='bg-white text-center rounded-[10px] shadow-md w-full placeholder:text-center py-3 outline-none'
                type={showPassword ? "text" : "password"}
                placeholder={instagramPasswordHolder ? instagramPasswordHolder : 'Instagram Password'}
                value={instagramPassword ? instagramPassword : instagramPasswordHolder}
                onChange={(e) => {
                  setInstagramPassword(e.target.value)
                }}
              />
              {showPassword ? <AiOutlineEyeInvisible onClick={() => setShowPassword(!showPassword)} className="cursor-pointer" /> :
                <AiOutlineEye onClick={() => setShowPassword(!showPassword)} className="cursor-pointer" />}
            </div>
          </div>

          <p className="font-normal text-sm font-MontserratLight mt-1 flex items-center gap-1">
            <span className="">Your password is 100% protected and encrypted.</span> <FaLock />
          </p>

          {two_factor_identifier && <div className="flex flex-col items-center mt-10">
            <p className="font-normal text-sm font-MontserratLight opacity-90 mt-1 flex items-center gap-1 max-w-md mx-auto text-center">
              Input the code you reviced for Two Factor Authentication is on your account and try again
            </p>
            <input
              className='mt-2 w-80 placeholder:text-center text-center outline-none rounded-[10px] py-4 px-4 text-[1.25rem] border shadow-[inset_0_0px_2px_rgba(0,0,0,0.4)]'
              // className='bg-white text-center rounded-[10px] shadow-md w-full placeholder:text-center py-3 outline-none'
              type='text'
              placeholder='2Fa code'
              value={twoFA}
              onChange={(e) => {
                setTwoFA(e.target.value)
              }}
            />
            <button className='rounded-[10px] bg-secondaryblue font-MontserratSemiBold font-bold text-base py-4 w-full md:w-[400px] text-white' onClick={(e) => {
              e.preventDefault()
              !loading && twoFactorLogin();
            }}>{loading ? 'LOADING...' : 'submit'}</button>
          </div>}

          <div className={`cursor-pointer mt-7 rounded-[10px] border-[0.4px] border-solid flex ${mode === "auto" ? "flex-col md:flex-row gap-7 md:gap-11" : "gap-12 md:gap-[71px] lg:gap-[81px]"} w-full px-8 py-4 md:px-10 lg:px-16 my-4 ${mode === "auto" ? "shadow-automode rounded-[10px] border-[2px] border-gray20 border-solid" : ""}`} onClick={() => toggleValue("auto")}>
            <img className={mode !== "auto" ? "w-[30px] h-[30px]" : "w-[85px] h-[85px] m-auto md:mt-[3%] md:m-0"} src={flashImg} alt="" />
            <div className="text-gray20">
              <h1 className='font-semibold text-[22px] pb-1 text-center md:text-start font-MontserratSemiBold'>Auto Mode</h1>
              {mode === "auto" && (
                <p className='font-normal text-sm w-full md:w-[484px] text-center md:text-start font-MontserratLight text-[#333]'>This setting will follow and unfollow relevant users using the targets you have selected. We will automatically unfollow users after 3 days to keep your following number low and healthy. We will never unfollow anyone that you manually followed yourself.</p>
              )}
            </div>
          </div>

          <div className={`cursor-pointer rounded-[10px] border-[0.4px] border-solid flex ${mode === "follow" ? "flex-col md:flex-row gap-5 md:gap-11" : "gap-12 md:gap-[71px] lg:gap-[81px]"} w-full px-8 py-4 md:px-10 lg:px-16 my-4 ${mode === "follow" ? "shadow-automode rounded-[10px] border-[2px] border-gray20 border-solid" : ""}`} onClick={() => toggleValue("follow")}>
            <BsPersonPlus className={mode !== "follow" ? "align-middle text-3xl" : "text-[85px] m-auto md:mt-[4%] md:m-0"} />
            <div className="text-gray20">
              <h1 className='font-semibold text-[22px] pb-1 text-center md:text-start font-MontserratSemiBold'>Follow Mode</h1>
              {mode === "follow" && (
                <p className='font-normal text-sm w-full md:w-[484px] text-center md:text-start font-MontserratLight text-[#333]'>In ‘Follow Mode,’ your account will continue following
                  users until it reaches Instagram's maximum ‘Following’
                  limit (which is 7500). From there, interactions on our end
                  will stop and you will have to manually change your
                  interaction settings to continue experiencing results (to
                  either ‘Recommended’ or ‘Unfollow Mode’)
                </p>
              )}
            </div>
          </div>
          <div className={`cursor-pointer rounded-[10px] border-[0.4px] border-solid flex ${mode === "unfollow" ? "flex-col md:flex-row gap-5 md:gap-11" : "gap-12 md:gap-[71px] lg:gap-[81px]"} w-full px-8 py-4 md:px-10 lg:px-16 my-4 ${mode === "unfollow" ? "shadow-automode rounded-[10px] border-[2px] border-gray20 border-solid" : ""}`} onClick={() => toggleValue("unfollow")}>
            <BsPersonDash className={mode !== "unfollow" ? "align-middle text-3xl" : "text-[85px] m-auto md:mt-[2%] md:m-0"} />
            <div className="text-gray20">
              <h1 className='font-semibold text-[22px] pb-1 text-center md:text-start font-MontserratSemiBold'>Unfollow Mode</h1>
              {mode === "unfollow" && (
                <p className='font-normal text-sm w-full md:w-[484px] text-center md:text-start font-MontserratLight text-[#333]'>
                  In ‘Unfollow Mode,’ your account will unfollow all of the
                  users we automatically followed for you. This will not
                  unfollow users that you personally followed, before or
                  after joining us. If you want to unfollow every account,
                  please contact your account manager.
                </p>
              )}
            </div>
          </div>
          <div className={`cursor-pointer rounded-[10px] border-[0.4px] border-solid flex ${mode === "off" ? "flex-col md:flex-row gap-5 md:gap-11" : "gap-12 md:gap-[71px] lg:gap-[81px]"} w-full px-8 py-4 md:px-10 lg:px-16 my-4 ${mode === "off" ? "shadow-automode rounded-[10px] border-[2px] border-gray20 border-solid" : ""}`} onClick={() => toggleValue("off")}>
            <IoPowerOutline className={mode !== "off" ? "align-middle text-3xl" : "text-[85px] m-auto md:mt-[3%] md:m-0"} />
            <div className="text-gray20">
              <h1 className='font-semibold text-[22px] pb-1 text-center md:text-start font-MontserratSemiBold'>Turn Off</h1>
              {mode === "off" && (
                <p className='font-normal text-sm w-full md:w-[484px] text-center md:text-start font-MontserratLight text-[#333]'>
                  Turning on this setting will pause all interactions on
                  your account and you will not experience growth. Your
                  subscription will remain active, even if you turn
                  interactions off for a period of time. Use our
                  ‘Recommended’ settings for optimal results.
                </p>
              )}
            </div>
          </div>
          <button className='rounded-[10px] bg-secondaryblue font-MontserratSemiBold font-bold text-base py-4 w-full md:w-[400px] text-white' onClick={(e) => {
            e.preventDefault()
            !loading && handleSave();
          }}>{loading ? 'LOADING...' : 'Save Changes'}</button>
        </div>
      </div>
    </Modal>
  );
}

export default ModalNew
