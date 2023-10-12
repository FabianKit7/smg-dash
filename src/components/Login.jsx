import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser } from "../helpers";
import { supabase } from "../supabaseClient";
import { useTranslation } from "react-i18next";
import { FaAngleDown } from "react-icons/fa";
import i18next from "i18next";

export default function Login() {
  const { t } = useTranslation()
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // check_auth
  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const u = user ? await getUser(user?.id) : null
      if (u?.status === 200) return navigate(`/dashboard/${u?.obj.username}`)
      // console.log(u);
    };

    getData();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault()
    navigate(`/dashboard/${username}`)
  }

  return (<>
    <div className="fixed z-50 text-xs rounded-lg shadow-2xl shadow-white w-fit h-fit top-1 md:top-4 right-4 backdrop-blur-md md:text-base">
      <LangSwitcher />
    </div>

    <div id="affiliateScript"></div>
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="p-5 md:p-10 md:shadow-lg rounded-[10px] w-full md:w-[458px]">
        <div className="flex flex-col items-center justify-center mb-8">
          {/* <img className="w-48 h-40 mt-10 lg:mt-14" src={sproutyLogo} alt="sprouty social" /> */}
          <div className=" text-[28px]">
            <div className="items-center hidden gap-2 md:flex">
              <img src="/logo.png" alt="" className="w-[38px] h-[34.26px]" />
              <b className="text-[32px]">Social Media Gains</b>
            </div>
          </div>

          <h5 className="font-semibold text-[2rem] text-center text-black-r  mt-[30px]">{t("Search your username")}</h5>
          {/* <p className="text-center text-[0.8rem] mt-2  text-black-r max-w-[320px]">{t("login_page_desc")}</p> */}
        </div>
        <form action="" className="flex flex-col items-center justify-start" onSubmit={handleLogin}>
          <div className="mb-3 form-outline ">
            <input
              type="text"
              id=""
              className="rounded-[5px] h-[52px] px-4 w-72 md:w-80 text-[1rem] bg-transparent border shadow-[inset_0_0px_1px_rgba(0,0,0,0.4)]"
              value={username}
              placeholder={t("username")}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>

          <button
            type="submit"
            className="button-gradient2 text-white  text-[16px] mt-6 mb-2 rounded-[5px] py-2 px-6 h-[52px] w-72 md:w-80 font-semibold"
            style={{
              boxShadow: '0 10px 30px -12px rgb(255 132 102 / 47%)'
            }}
          >
            {t('Continue')}
          </button>
        </form>

        <br /><br />
      </div>
    </div>
  </>
  );
}

export const LangSwitcher = () => {
  const languages = [
    { value: 'de', text: "French", flag: '/french_flag.png' },
    { value: 'en', text: "English", flag: '/british_flag.svg' },
  ]

  const [lng, setLang] = useState('de');
  const [showLangOptions, setShowLangOptions] = useState(false)

  useEffect(() => {
    var urlParams = new URLSearchParams(window.location.search);
    var lng = urlParams.get('lng');
    if (lng) {
      const selectedLang = languages.find(l => l.value === lng)
      setLang(selectedLang?.value)
    } else {
      const lng = localStorage.getItem('lng') || 'de';
      const el = document.getElementsByTagName('html')[0]
      el.lang = lng
      setLang(lng)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = lng => {
    setLang(lng);
    i18next.changeLanguage(lng)
    localStorage.setItem('lng', lng);
    const el = document.getElementsByTagName('html')[0]
    el.lang = lng
    // window.location = `?lng=${lng}`;
    // window.location.reload();
    setShowLangOptions(false)
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-1 p-3 uppercase" onClick={() => setShowLangOptions(!showLangOptions)}>
        {lng} <FaAngleDown />
      </div>

      {showLangOptions && <div className="absolute top-0 flex flex-col right-full bg-[#242424] text-white">
        <button className="p-3 border-b border-gray20 hover:bg-[#242424]" onClick={() => handleChange('en')}>EN</button>
        <button className="p-3 hover:bg-[#242424]" onClick={() => handleChange('de')}>FR</button>
      </div>}
    </div>
  )
}