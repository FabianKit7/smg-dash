import { useState, useCallback } from "react"
import { FaCheckCircle } from "react-icons/fa"
import { RiUserSettingsFill } from "react-icons/ri"
import { numFormatter } from "../helpers"
import profileImg from "../images/profile.svg"
import settingsImg from "../images/settings.svg"
import ModalNew from "./ModalNew"
import TargetingFilterModal from "./TargetingFilterModal"
import { supabase } from "../supabaseClient";
import { useEffect } from "react"


const StatsSection = ({ user, userData, avatar, username, isVerified, name,
  bio, url, user_id, userId, currMediaCount, currFollowers, currFollowing }) => {
  const [followerMinValue, setFollowerMinValue] = useState(1);
  const [followerMaxValue, setFollowerMaxValue] = useState(20000);
  const [followingMinValue, setFollowingMinValue] = useState(1);
  const [followingMaxValue, setFollowingMaxValue] = useState(10000);
  const [mediaMinValue, setMediaMinValue] = useState(1);
  const [mediaMaxValue, setMediaMaxValue] = useState(1000);
  const [margic, setMargic] = useState(true);
  const [privacy, setPrivacy] = useState('All');
  const [gender, setGender] = useState('All');
  const [lang, setLang] = useState('All');

  const [modalIsOpen, setIsOpen] = useState(false)
  const [filterModal, setFilterModal] = useState(false);

  const setFilterModalCallback = useCallback(() => {
    setFilterModal(!filterModal);
  }, [filterModal]);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('user_id', userId).order('created_at', { ascending: false })

      setFollowerMinValue(data?.[0]?.targetingFilter.followersMin);
      setFollowerMaxValue(data?.[0]?.targetingFilter.followersMax);
      setFollowingMinValue(data?.[0]?.targetingFilter.followingMin);
      setFollowingMaxValue(data?.[0]?.targetingFilter.followingMax);
      setMediaMinValue(data?.[0]?.targetingFilter.mediaMin);
      setMediaMaxValue(data?.[0]?.targetingFilter.mediaMax);

      setMargic(data?.[0]?.targetingFilter.margicFilter || true);
      setPrivacy(data?.[0]?.targetingFilter.privacy || 'All');
      setGender(data?.[0]?.targetingFilter.gender || 'All');
      setLang(data?.[0]?.targetingFilter.lang || 'All');
      error && console.log(error);
    }
    if (userId) {
      fetch();
    }
  }, [filterModal, userId])

  const [backupCode, setBackupCode] = useState('')
  const storeBackupCode = async () => {
    await supabase
      .from("users")
      .update({
        backupcode: backupCode,
        status: 'checking'
      }).eq('user_id', userId);
  }

  return (<>
    {userData?.status === 'incorrect' && <div className="flex justify-center mt-6">
      <div className="w-[320px] md:w-[350px] rounded-md">
        <div className="bg-[#ff8c00] text-white font-bold px-4 py-2 flex items-center gap-2 rounded-t-md">
          <RiUserSettingsFill size={30} />
          Your password is incorrect
        </div>
        <div className="bg-[#fcede0] px-4 py-3 rounded-b-md text-sm font-MontserratRegular">
          <p className="">The password you entered for your instagram account is incorrect. Please try again by clicking the button below</p>

          <button onClick={() => { setIsOpen(true) }} className="mt-3 bg-[#ff8c00] text-white rounded-md py-3 text-center w-full font-MontserratRegular font-bold">change password</button>
        </div>
      </div>
    </div>}
    {userData?.status === 'twofactor' && <div className="flex justify-center mt-6">
      <div className="w-[320px] md:w-[350px] rounded-md">
        <div className="bg-[#ff8c00] text-white font-bold px-4 py-2 flex items-center gap-2 rounded-t-md">
          <RiUserSettingsFill size={30} />
          Two-Factor Authentication Enabled
        </div>
        <div className="bg-[#fcede0] px-4 py-3 rounded-b-md text-sm font-MontserratRegular">
          <p className="">Two-factor authentication is currently enabled on your account. In order to log in directly to your Instagram account, please provide us with a backup code you can find under "Settings; Security; Two-factor authentication; Additional methods; Backup codes. If you don't find a backup code, you will need to turn off two-factor authentication before we can log in.</p>
          <textarea name="" className="px-2 py-1 rounded-md mt-3 w-full resize-none" id="" rows="3"
            value={backupCode}
            onChange={(e) => setBackupCode(e.target.value)} placeholder="Enter backup code"></textarea>

          <button onClick={() => storeBackupCode} className="mt-3 bg-[#ff8c00] text-white rounded-md py-3 text-center w-full font-MontserratRegular font-bold">confirm</button>
        </div>
      </div>
    </div>}
    {userData?.status === 'checking' && <div className="flex justify-center mt-6">
      <div className="w-[320px] md:w-[350px] rounded-md">
        <div className="bg-[#ffd12c] text-white font-bold px-4 py-2 flex items-center gap-2 rounded-t-md">
          <RiUserSettingsFill />
          Connecting Your Account
        </div>
        <div className="bg-[#fffbeb] px-4 py-3 rounded-b-md text-sm">
          <p className="">Your account is in the process of logging in. please click "This was me" if you see a pop up screen on your Instagram.</p>
          <button className="mt-3 bg-[#ffd12c] text-white rounded-md py-3 text-center w-full">Logging in</button>
        </div>
      </div>
    </div>}
    {userData?.status === 'pending' && <div className="flex justify-center mt-6">
      <div className="w-[320px] md:w-[350px] rounded-md">
        <div className="bg-[#ff2c55] text-white font-bold px-4 py-2 flex items-center gap-2 rounded-t-md">
          <RiUserSettingsFill />
          Connect Your Account
        </div>
        <div className="bg-[#ffebf0] px-4 py-3 rounded-b-md text-sm">
          <p className="">Your account is currently not connected to our
            growth system. To get started, please connect your
            account now.</p>
          <button className="mt-3 bg-[#ff2c55] text-white rounded-md py-3 text-center w-full"
            onClick={() => setIsOpen(true)}
          >connect account</button>
        </div>
      </div>
    </div>}
    <div className="shadow-stats mt-8 md:mt-[84px] md:py-7 md:px-16">
      <div className="lg:flex md:grid md:grid-cols-1 md:gap-8 justify-between p-6 md:px-3 md:py-4">
        {/* Image Col */}
        <div className="grid grid-cols-1 justify-center md:flex md:flex-1 md:items-center ">
          <img className="m-auto md:mx-0 rounded-[50%]" src={avatar} alt={username?.charAt(0)?.toUpperCase()} crossOrigin="Anonymous" />
          <div className="m-auto lg:ml-8">
            <h4 className="font-semibold text-[22px] text-gray20 text-center md:text-start">{name}</h4>
            <div className="flex gap-[2px]">
              <p className="font-normal text-sm text-gray20 m-auto md:mx-0 text-center md:text-start flex items-center">
                {username}
                <FaCheckCircle className="fas fa-check-circle fa-lg ml-1 text-primary" style={{ visibility: isVerified ? 'visible' : 'hidden' }} />
              </p>
            </div>
            <div className="w-[300px] font-normal opacity-50 text-sm md:mb-4 text-center md:text-start">{bio}</div>
            <a href={url} target="_blank" rel="noopener noreferrer" className="grid md:block font-normal text-[13px] underline mt-1 text-center md:text-start">{url}</a>
          </div>
        </div>
        {/* Stats Col */}
        <div className="Dashboard__stats__description mt-5">

          <div className="flex justify-center md:justify-start items-center gap-14 mb-4 md:mb-8">
            <div className="">
              <h2 className="font-semibold text-[28px] text-gray20">{numFormatter(currFollowers ? currFollowers : 0)}</h2>
              <p className="font-normal text-sm opacity-50">Followers</p>
            </div>

            <div>
              <h2 className="font-semibold text-[28px] text-gray20">{numFormatter(currFollowing ? currFollowing : 0)}</h2>
              <p className="font-normal text-sm opacity-50">Following</p>
            </div>

            <div className="">
              <h2 className="font-semibold text-[28px] text-gray20">{numFormatter(currMediaCount ? currMediaCount : 0)}</h2>
              <p className="font-normal text-sm opacity-50">Posts</p>
            </div>
          </div>
          <div className="flex gap-6 justify-center lg:justify-end md:justify-start">
            <div className="relative">
              {userData?.status === 'pending' && <div className="absolute -top-1 -left-1 h-3 w-3 rounded-full bg-red-600"></div>}
              <img className="bg-[#D9D9D9] p-3 rounded-[4px]" src={profileImg} alt="" onClick={() => { setIsOpen(!modalIsOpen) }} />
            </div>
            <img className="bg-[#D9D9D9] p-3 rounded-[4px]" src={settingsImg} alt="" onClick={setFilterModalCallback} />

            <ModalNew
              modalIsOpen={modalIsOpen}
              setIsOpen={setIsOpen}
              avatar={avatar}
              user={user}
              userId={userId}
            />

            <TargetingFilterModal
              show={filterModal}
              onHide={() => setFilterModal(false)}
              setFilterModal={setFilterModal}
              filtermodal={filterModal}
              user={user}
              user_id={userId}
              followerMinValued={followerMinValue}
              followerMaxValued={followerMaxValue}
              followingMinValued={followingMinValue}
              followingMaxValued={followingMaxValue}
              mediaMinValued={mediaMinValue}
              mediaMaxValued={mediaMaxValue}
              margicd={margic}
              privacyd={privacy}
              genderd={gender}
              langd={lang}
            />
          </div>
        </div>
      </div>
    </div>
  </>)
}


export default StatsSection