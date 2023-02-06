import { useState, useCallback } from "react"
import { FaCheckCircle } from "react-icons/fa"
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

  return (
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
  )
}


export default StatsSection