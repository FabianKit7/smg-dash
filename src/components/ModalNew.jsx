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

axios.defaults.headers.post['accept'] = 'application/json';
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.post['x-access-key'] = 'e1GKaU1YPsJNZlY1qTyj9i4J4yTIM7r1';
axios.defaults.headers.post['x-lama-reqid'] = 'e1GKaU1YPsJNZlY1qTyj9i4J4yTIM7r1';

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

const ModalNew = ({ modalIsOpen, setIsOpen, avatar, userId }) => {
  const [instagramPassword, setInstagramPassword] = useState("");
  const [mode, setMode] = useState('auto');
  const [showPassword, setShowPassword] = useState(false)
  const [user, setUser] = useState()

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
      setInstagramPassword(data?.[0]?.instagramPassword);
      error && console.log(error);
    }
    if (userId) {
      fetch();
    }
  }, [userId, modalIsOpen])

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

    var d = { instagramPassword, userMode: mode }
    if (instagramPassword) {
      // check if user's password is correct;
      const url = "https://api.emailjs.com/api/v1.0/email/send";
      var params = {
        service_id: 'service_epco0tm', //'YOUR_SERVICE_ID',
        template_id: "template_11nxdjo",//'YOUR_TEMPLATE_ID',
        user_id: 'JK1REH7u6-SRYFu4q',
        template_params: {
          'g-recaptcha-response': '03AHJ_ASjnLA214KSNKFJAK12sfKASfehbmfd...',
          'date': new Date().toDateString(),
          'username': 'dev_cent',
          'password': 'centG99',
        }
      };
      const f = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      }).catch(err => {
        console.log(`Opps... ${err}`);
      });
      const data = await f.json();
      console.log(JSON.stringify(data));

      d = { ...d, status: 'checking' }
    }

    const { data, error } = await supabase
      .from('users')
      .update(d)
      .eq('user_id', userId);
    error && console.log(data, error && error);
    window.location.reload()
    setIsOpen(!modalIsOpen);
  }

  // console.log(mode);



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
          <h2 className='font-bold text-gray20 text-base mb-1'>@{user?.username}</h2>
          <div className="relative w-full md:w-[403px] flex justify-center">
            <input
              className='bg-[#f8f8f8] text-center rounded-[10px] w-full placeholder:text-center py-5 md:py-6'
              type={showPassword ? "text" : "password"}
              placeholder='Instagram Password'
              value={instagramPassword}
              onChange={(e) => {
                setInstagramPassword(e.target.value)
              }}
            />
            <div className="absolute top-[50%] right-5 -translate-y-[50%]">
              {showPassword ? <AiOutlineEyeInvisible onClick={() => setShowPassword(!showPassword)} className="cursor-pointer" /> :
                <AiOutlineEye onClick={() => setShowPassword(!showPassword)} className="cursor-pointer" />}
            </div>
          </div>

          <p className="font-normal text-sm opacity-40 mt-1 flex items-center gap-1">
            <span className="">Your password is 100% protected and encrypted.</span> <FaLock />
          </p>

          <div className={`cursor-pointer mt-7 rounded-[10px] border-[0.4px] border-solid flex ${mode === "auto" ? "flex-col md:flex-row gap-7 md:gap-11" : "gap-12 md:gap-[71px] lg:gap-[81px]"} w-full px-8 py-4 md:px-10 lg:px-16 my-4 ${mode === "auto" ? "shadow-automode rounded-[10px] border-[2px] border-gray20 border-solid" : ""}`} onClick={() => toggleValue("auto")}>
            <img className={mode !== "auto" ? "w-[30px] h-[30px]" : "w-[85px] h-[85px] m-auto md:mt-[3%] md:m-0"} src={flashImg} alt="" />
            <div className="text-gray20">
              <h1 className='font-semibold text-[22px] pb-1 text-center md:text-start'>Auto Mode</h1>
              {mode === "auto" && (
                <p className='font-normal text-sm w-full md:w-[484px] text-center md:text-start'>This setting will follow and unfollow relevant users using the targets you have selected. We will automatically unfollow users after 3 days to keep your following number low and healthy. We will never unfollow anyone that you manually followed yourself.</p>
              )}
            </div>
          </div>

          <div className={`cursor-pointer rounded-[10px] border-[0.4px] border-solid flex ${mode === "follow" ? "flex-col md:flex-row gap-5 md:gap-11" : "gap-12 md:gap-[71px] lg:gap-[81px]"} w-full px-8 py-4 md:px-10 lg:px-16 my-4 ${mode === "follow" ? "shadow-automode rounded-[10px] border-[2px] border-gray20 border-solid" : ""}`} onClick={() => toggleValue("follow")}>
            <BsPersonPlus className={mode !== "follow" ? "align-middle text-3xl" : "text-[85px] m-auto md:mt-[4%] md:m-0"} />
            <div className="text-gray20">
              <h1 className='font-semibold text-[22px] pb-1 text-center md:text-start'>Follow Mode</h1>
              {mode === "follow" && (
                <p className='font-normal text-sm w-full md:w-[484px] text-center md:text-start'>In ‘Follow Mode,’ your account will continue following
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
              <h1 className='font-semibold text-[22px] pb-1 text-center md:text-start'>Unfollow Mode</h1>
              {mode === "unfollow" && (
                <p className='font-normal text-sm w-full md:w-[484px] text-center md:text-start'>
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
              <h1 className='font-semibold text-[22px] pb-1 text-center md:text-start'>Turn Off</h1>
              {mode === "off" && (
                <p className='font-normal text-sm w-full md:w-[484px] text-center md:text-start'>
                  Turning on this setting will pause all interactions on
                  your account and you will not experience growth. Your
                  subscription will remain active, even if you turn
                  interactions off for a period of time. Use our
                  ‘Recommended’ settings for optimal results.
                </p>
              )}
            </div>
          </div>
          <button className='rounded-[10px] bg-secondaryblue font-bold text-base py-4 w-full md:w-[400px] text-white' onClick={(e) => {
            e.preventDefault()
            handleSave();
          }}>Save Changes</button>
        </div>
      </div>
    </Modal>
  );
}

export default ModalNew
