import { useEffect, useState } from 'react';
import Modal from "react-bootstrap/Modal";
import { IoClose } from 'react-icons/io5';
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai"
import flashImg from "../images/flash.svg"
import "../../src/modalsettings.css"
import { supabase } from '../supabaseClient';
import { FaLock } from 'react-icons/fa';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

axios.defaults.headers.post['accept'] = 'application/json';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.post['x-access-key'] = 'e1GKaU1YPsJNZlY1qTyj9i4J4yTIM7r1';
axios.defaults.headers.post['x-lama-reqid'] = 'e1GKaU1YPsJNZlY1qTyj9i4J4yTIM7r1';

const SettingsModal = (props) => {
  const { t } = useTranslation()
  const { modalIsOpen, setIsOpen, user, setRefreshUser, u } = props

  const [instagramPassword, setInstagramPassword] = useState("");
  const [mode, setMode] = useState('auto');
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState('fr')

  useEffect(() => {
    const lng = localStorage.getItem('lng') || 'fr';
    setLang(lng)
  }, [])

  const toggleValue = (newValue) => {
    setMode(newValue);
  }

  useEffect(() => {
    setMode(user?.userMode);
    setInstagramPassword(user?.instagramPassword);
  }, [user])

  const handleSave = async () => {
    setLoading(true)
    var d = { instagramPassword, userMode: mode }
    if (user?.instagramPassword !== instagramPassword && u !== "admin") {
      // try {
      //   fetch("https://api.lamadava.com/s1/auth/login", {
      //     body: `username=${user?.username}&password=${instagramPassword}&verification_code=&proxy=&locale=&timezone=&user_agent=`,
      //     headers: {
      //       Accept: "application/json",
      //       "Content-Type": "application/x-www-form-urlencoded",
      //       // 'x-access-key': 'e1GKaU1YPsJNZlY1qTyj9i4J4yTIM7r1',
      //     },
      //     method: "POST"
      //   }).then(res => res.json()).then((data) => {
      //     console.log(data);          
      //   })
      // } catch (error) {
      //   console.log(error);
      // }
      d = { ...d, status: 'new' }
    }

    const { error } = await supabase
      .from('users')
      .update(d)
      .eq("user_id", user?.user_id).eq("username", user?.username);
    error && console.log(error);
    setLoading(false)
    if (u === 'admin') {
      setIsOpen(!modalIsOpen);
      return;
    }

    setLoading(false)
    // window.location.reload()
    setIsOpen(!modalIsOpen);
    setRefreshUser(true);
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      // dialogClassName="modal-90w"
      // className="modal-90w"
      size="xl"
      fullscreen={"xl-down"}
      aria-labelledby="example-custom-modal-styling-title"
      centered
    >
      <div className="relative h-screen overflow-auto xl:h-full">
        <div className="absolute modal_nav top-2 right-2">
          <IoClose
            className="modal_close_icon text-[30px]"
            onClick={() => {
              setIsOpen(!modalIsOpen);
            }}
          />
        </div>

        <div className="flex flex-col xl:flex-row justify-between gap-2 p-7 md:p-10 bg-[#242424] rounded-lg">
          <div className="flex flex-col justify-center md:justify-start items-center md:mt-[39px]">
            <div className="relative w-[100px] h-[100px] md:w-[140px] md:h-[140px] rounded-full">
              <img className='w-full h-full mb-1 rounded-full' src={user?.profile_pic_url} alt="" />
              <div className="w-5 h-5 rounded-full bg-green-600 absolute bottom-[10px] right-[10px]"></div>
            </div>
            <h2 className='font-bold text-[#757575] text-[24px] my-1 font-MontserratBold'>{user?.full_name}</h2>
            <h2 className='font-bold text-[#b16cea] text-[20px] my-1 font-MontserratBold'>@{user?.username}</h2>
            <div className="relative w-full md:w-[403px] flex justify-center mt-4">
              <div className="flex items-center justify-center gap-2 rounded-[10px] py-4 px-4 text-[1.25rem] border shadow-[inset_0_0px_2px_rgba(0,0,0,0.4)] ">
                <input
                  className='w-full text-center bg-transparent outline-none md:w-80 placeholder:text-center'
                  // className='bg-white text-center rounded-[10px] shadow-md w-full placeholder:text-center py-3 outline-none'
                  type={showPassword ? "text" : "password"}
                  placeholder={t('Instagram Password')}
                  autoComplete='new-password'
                  value={instagramPassword}
                  onChange={(e) => {
                    setInstagramPassword(e.target.value)
                  }}
                />
                {showPassword ? <AiOutlineEyeInvisible onClick={() => setShowPassword(!showPassword)} className="cursor-pointer" /> :
                  <AiOutlineEye onClick={() => setShowPassword(!showPassword)} className="cursor-pointer" />}
              </div>
            </div>

            <p className="mt-1 text-xs font-normal md:text-sm font-MontserratLight opacity-90">
              <span className="">{t("pass_is_protected")}</span> <FaLock className='inline' />
            </p>
          </div>

          <div className="w-full">
            <div className="flex flex-col gap-5">
              <div className="xl:mb-[10px] mt-4 xl:mt-0 text-[18px] xl:font-bold xl:font-MontserratBold">{t("Interaction settings")}</div>

              <div className={`${mode === "auto" ? `border-[4px] border-[#b16cea] 
              ${lang === 'fr' ? 'h-[340px] sm:h-[230px] md:h-[150px] lg:h-[210px] xl:h-[250px]' : 'h-[230px] md:h-[110px] lg:h-[200px]' } 
              ` : "h-[52px]"} overflow-hidden py-[14px] md:py-5 px-[14px] md:px-10 cursor-pointer shadow-[0_0_3px_#1C1A2640] rounded-[10px] flex items-center gap-2 md:gap-5`} style={{
                transition: 'all .3s ease-in,border .1s ease-in'
              }} onClick={() => toggleValue("auto")}>
                <img className={`${mode === "auto" ? "w-[60px] h-[60px] lg:w-[100px] lg:h-[100px]" : "w-[20px] h-[20px] lg:w-[30px] lg:h-[30px]"}`} src={flashImg} alt="" style={{
                  transition: "all .3s linear"
                }} />
                <div className="">
                  <h3 className={`${mode === "auto" ? "text-[18px] lg:text-[24px]" : "text-[16px] lg:text-[18px]"} font-bold font-MontserratBold`}>{t("Auto Mode")}</h3>
                  <p className={`${mode === "auto" ? "opacity-100" : "opacity-0 max-h-0"} text-[12px] lg:text-base font-MontserratRegular`} style={{
                    transition: "all .3s linear .2s"
                  }}>
                    {t('auto_mode_text')}
                  </p>
                </div>
              </div>

              <div className={`${mode === "unfollow" ? `border-[4px] border-[#b16cea] 
              ${lang === 'fr' ? 'h-[310px] sm:h-[230px] md:h-[150px] lg:h-[210px] xl:h-[250px]' : 'h-[230px] md:h-[110px] lg:h-[200px]'}` : "h-[52px]"} overflow-hidden py-[14px] md:py-5 px-[14px] md:px-10 cursor-pointer shadow-[0_0_3px_#1C1A2640] rounded-[10px] flex items-center gap-2 md:gap-5`} style={{
                transition: 'all .3s ease-in,border .1s ease-in'
              }} onClick={() => toggleValue("unfollow")}>
                <span className={`${mode === "unfollow" ? "min-w-[40px] lg:min-w-[100px] h-[40px] lg:h-[100px]" : "min-w-[20px] lg:min-w-[30px] h-[20px] lg:h-[30px]"} fill-black font-[none] ng-tns-c112-40`} style={{
                  transition: "all .3s linear"
                }}>
                  <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M10.5984 10.2406C10.9765 10.0375 11.4094 9.92188 11.8703 9.92188H11.8719C11.9187 9.92188 11.9406 9.86563 11.9062 9.83438C11.4269 9.40419 10.8793 9.05673 10.2859 8.80625C10.2797 8.80312 10.2734 8.80156 10.2672 8.79844C11.2375 8.09375 11.8687 6.94844 11.8687 5.65625C11.8687 3.51562 10.1375 1.78125 8.00154 1.78125C5.8656 1.78125 4.13592 3.51562 4.13592 5.65625C4.13592 6.94844 4.76717 8.09375 5.73904 8.79844C5.73279 8.80156 5.72654 8.80312 5.72029 8.80625C5.02185 9.10156 4.39529 9.525 3.85623 10.0656C3.32028 10.6006 2.89359 11.2348 2.59998 11.9328C2.31109 12.6163 2.15518 13.3487 2.1406 14.0906C2.14019 14.1073 2.14311 14.1239 2.14921 14.1394C2.1553 14.1549 2.16444 14.1691 2.17609 14.181C2.18774 14.193 2.20166 14.2025 2.21703 14.2089C2.23241 14.2154 2.24892 14.2188 2.2656 14.2188H3.20154C3.26873 14.2188 3.32498 14.1641 3.32654 14.0969C3.35779 12.8906 3.8406 11.7609 4.69529 10.9047C5.5781 10.0188 6.7531 9.53125 8.0031 9.53125C8.88904 9.53125 9.73904 9.77656 10.4719 10.2359C10.4907 10.2478 10.5123 10.2544 10.5345 10.2553C10.5567 10.2561 10.5788 10.251 10.5984 10.2406ZM8.0031 8.34375C7.28748 8.34375 6.61404 8.06406 6.10623 7.55625C5.85638 7.30705 5.6583 7.01087 5.52342 6.68478C5.38853 6.35869 5.31949 6.00914 5.32029 5.65625C5.32029 4.93906 5.59998 4.26406 6.10623 3.75625C6.61248 3.24844 7.28592 2.96875 8.0031 2.96875C8.72029 2.96875 9.39217 3.24844 9.89998 3.75625C10.1498 4.00545 10.3479 4.30163 10.4828 4.62772C10.6177 4.95381 10.6867 5.30336 10.6859 5.65625C10.6859 6.37344 10.4062 7.04844 9.89998 7.55625C9.39217 8.06406 8.71873 8.34375 8.0031 8.34375ZM13.75 12.0625H9.99998C9.93123 12.0625 9.87498 12.1187 9.87498 12.1875V13.0625C9.87498 13.1313 9.93123 13.1875 9.99998 13.1875H13.75C13.8187 13.1875 13.875 13.1313 13.875 13.0625V12.1875C13.875 12.1187 13.8187 12.0625 13.75 12.0625Z"></path>
                  </svg>
                </span>
                <div className="">
                  <h3 className={`${mode === "unfollow" ? "text-[18px] lg:text-[24px]" : "text-base lg:text-[18px]"} font-bold font-MontserratBold`}>{t("Unfollow Mode")}</h3>
                  <p className={`${mode === "unfollow" ? "opacity-100" : "opacity-0 max-h-0"} text-[12px] lg:text-base font-MontserratRegular`} style={{
                    transition: "all .3s linear .2s"
                  }}>
                    {t("unfollow_mode_text")}
                  </p>
                </div>
              </div>

              <div className={`${mode === "off" ? `border-[4px] border-[#b16cea] 
              ${lang === 'fr' ? 'h-[270px] sm:h-[230px] md:h-[150px] lg:h-[210px] xl:h-[250px]' : 'h-[230px] md:h-[110px] lg:h-[200px]' }` : "h-[52px]"} overflow-hidden py-[14px] md:py-5 px-[14px] md:px-10 cursor-pointer shadow-[0_0_3px_#1C1A2640] rounded-[10px] flex items-center gap-2 md:gap-5`} style={{
                transition: 'all .3s ease-in,border .1s ease-in'
              }} onClick={() => toggleValue("off")}>
                <span className={`${mode === "off" ? "min-w-[40px] lg:min-w-[100px] h-[40px] lg:h-[100px]" : "min-w-[20px] lg:min-w-[30px] h-[20px] lg:h-[30px]"} fill-black font-[none] ng-tns-c112-40`} style={{
                  transition: "all .3s linear"
                }}>
                  <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M31.25 4.22656C36.1719 7.74219 39.375 13.4922 39.375 20C39.375 30.6875 30.7188 39.3516 20.0391 39.375C9.37501 39.3984 0.640639 30.7031 0.625014 20.0312C0.617202 13.5234 3.82033 7.75781 8.73439 4.23437C9.64845 3.58594 10.9219 3.85937 11.4688 4.83594L12.7031 7.03125C13.1641 7.85156 12.9453 8.89062 12.1875 9.45312C8.94533 11.8594 6.87501 15.6719 6.87501 19.9922C6.8672 27.2031 12.6953 33.125 20 33.125C27.1563 33.125 33.1719 27.3281 33.125 19.9141C33.1016 15.8672 31.1953 11.9609 27.8047 9.44531C27.0469 8.88281 26.8359 7.84375 27.2969 7.03125L28.5313 4.83594C29.0781 3.86719 30.3438 3.57812 31.25 4.22656ZM23.125 20.625V1.875C23.125 0.835937 22.2891 0 21.25 0H18.75C17.711 0 16.875 0.835937 16.875 1.875V20.625C16.875 21.6641 17.711 22.5 18.75 22.5H21.25C22.2891 22.5 23.125 21.6641 23.125 20.625Z"></path>
                  </svg>
                </span>
                <div className="">
                  <h3 className={`${mode === "off" ? "text-[18px] lg:text-[24px]" : "text-base lg:text-[18px]"} font-bold font-MontserratBold`}>{t("Off Mode")}</h3>
                  <p className={`${mode === "off" ? "opacity-100" : "opacity-0 max-h-0"} text-[12px] lg:text-base font-MontserratRegular`} style={{
                    transition: "all .3s linear .2s"
                  }}>
                    {t('off_mode_text')}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center my-4">
              <button className='rounded-[10px] mx-auto font-MontserratSemiBold font-bold text-base py-4 w-full xl:w-[300px] h-[72px] button-gradient2 text-white' onClick={(e) => {
                e.preventDefault()
                !loading && handleSave();
              }}>{loading ? 'Saving...' : t('Apply and Close')}</button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default SettingsModal
