import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useClickOutside } from "react-click-outside-hook";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BiMessageSquareDots } from "react-icons/bi";
import { BsHeadset } from "react-icons/bs";
import { FaAngleDown, FaCaretDown, FaCaretUp, FaTrash, FaUser } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { TiTimes } from "react-icons/ti";
import { Spinner } from 'react-bootstrap';
import { Link, useNavigate, useParams } from "react-router-dom";
import { countDays, deleteAccount, getAccount, numFormatter, searchAccount, updateUserProfilePicUrl, uploadImageFromURL } from "../helpers";
import { supabase } from "../supabaseClient";
import ChartSection from "./ChartSection";
import Nav from "./Nav";
import TargetingFilterModal from './TargetingFilterModal'

const Error = ({ value }) => {
  return (
    <aside style={{ color: "red" }} classNameName="px-3 py-4 px-sm-5">
      The account @{value} was not found on Instagram.
    </aside>
  );
};

export default function Dashboard() {
  let { id } = useParams();
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  // const [user, setUser] = useState(null)
  const [, setUser] = useState(null)
  const [sessionsData, setSessionsData] = useState([])
  const [showDateOptions, setShowDateOptions] = useState(false)
  const [selectedDate, setSelectedDate] = useState({ title: "Last 7 days", value: 7 })

  !!!sessionsData && console.log(sessionsData)

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return navigate("/login")
      setUser(user)
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('user_id', user.id)

      if (user && !data[0]?.subscribed) {
        window.location.pathname = `subscriptions/${data[0].username}`;
      }
      setUserData(data[0])
      setError(error)
    };

    getData();
  }, [id, navigate]);

  // setSessionsData
  useEffect(() => {
    const fetch = async () => {
      const resData = await supabase
        .from('sessions')
        .select()
        .eq('username', userData?.username)
      resData.error && console.log(resData.error);
      var d = resData.data[0].data
      try {
        const c = JSON.parse(resData.data[0].data);
        if (c) { d = c }
      } catch (error) {
        // console.log(error);
      }
      // console.log(d);
      setSessionsData(d)
    }
    const username = userData?.username;
    if (username) {
      fetch()
    }
  }, [userData])

  if (error) return <Error value={id} />;

  // console.log(data)

  return (
    <>
      <Nav />

      <div>
        <div
          className="flex justify-between items-center rounded-[10px] h-[84px] px-4 mb-10"
          style={{
            boxShadow: '0 0 3px #00000040',
          }}
        >
          <div className="ml-3 flex items-center gap-[10px]">
            <img
              alt=""
              className="platform-logo"
              src="/instagram.svg"
              width="28px"
              height="28px"
            />
            <div className="font-black text-2xl text-black font-MontserratBold capitalize">
              {userData?.username}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-[52px] h-[52px] rounded-[10px] flex items-center justify-center cursor-pointer bg-black">
              <img
                alt=""
                className="settings-logo"
                src="/settings.svg"
                width="31px"
                height="31px"
              />
            </div>
            <div className="relative rounded-[10px] bg-black text-white text-lg font-bold">
              <div
                className="flex items-center justify-center h-[52px] cursor-pointer"
                onClick={() => setShowDateOptions(!showDateOptions)}
              >
                <AiOutlineClockCircle
                  size={28}
                  className="mr-[10px] ml-[16px]"
                />
                <span className="p-0 flex items-center">
                  {selectedDate?.title}
                </span>
                <FaAngleDown className="w-[12px] mr-[16px] ml-[7px]" />
              </div>
              <div
                className={`absolute w-full top-full left-0 rounded-[10px] z-[2] text-black bg-white ${showDateOptions ? 'opacity-100' : 'opacity-0'
                  }`}
                style={{
                  boxShadow: '0 0 3px #00000040',
                  transform: 'translteY(8px)',
                  transition: 'opacity .15s ease-in',
                }}
              >
                <div
                  className="py-4 px-[30px] hover:bg-[#f8f8f8] cursor-pointer"
                  onClick={() => {
                    setSelectedDate({ title: 'Last 7 days', value: 7 });
                    setShowDateOptions(false);
                  }}
                >
                  Last 7 days
                </div>
                <div
                  className="py-4 px-[30px] hover:bg-[#f8f8f8] cursor-pointer"
                  onClick={() => {
                    setSelectedDate({ title: 'Last 30 days', value: 30 });
                    setShowDateOptions(false);
                  }}
                >
                  Last 30 days
                </div>
                <div
                  className="py-4 px-[30px] hover:bg-[#f8f8f8] cursor-pointer"
                  onClick={() => {
                    setSelectedDate({ title: 'Last 60 days', value: 60 });
                    setShowDateOptions(false);
                  }}
                >
                  Last 60 days
                </div>
                <div
                  className="py-4 px-[30px] hover:bg-[#f8f8f8] cursor-pointer"
                  onClick={() => {
                    setSelectedDate({ title: 'Last 90 days', value: 90 });
                    setShowDateOptions(false);
                  }}
                >
                  Last 90 days
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mx-[40px] flex justify-between items-center font-MontserratRegular">
          <div className="flex items-center">
            <img
              className="w-[100px] h-[100px] rounded-full mr-[20px]"
              src={userData?.profile_pic_url}
              alt=""
            />
            <div className="flex flex-col text-2xl">
              <div> {userData?.username} </div>
              <div className="font-semibold text-[#757575]">
                @{userData?.username}
              </div>
              <div className="flex items-center">
                <div className="font-semibold font-MontserratSemiBold text-[#23df85] capitalize">
                  {userData?.userMode}
                </div>

                <apptooltip className="ml-[8px] cursor-pointer group relative">
                  <div className="flex items-center">
                    <svgicon
                      className="w-[20px] h-[20px] cursor-pointer fill-[#c4c4c4] group-hover:fill-[orange]"
                      style={{
                        transition: 'all .1s ease-in',
                      }}
                    >
                      <svg
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path d="M10 0.625C4.8225 0.625 0.625 4.8225 0.625 10C0.625 15.1775 4.8225 19.375 10 19.375C15.1775 19.375 19.375 15.1775 19.375 10C19.375 4.8225 15.1775 0.625 10 0.625ZM11.5625 16.1719H8.4375V8.67188H11.5625V16.1719ZM10 6.95312C9.5856 6.95312 9.18817 6.78851 8.89515 6.49548C8.60212 6.20245 8.4375 5.80503 8.4375 5.39062C8.4375 4.97622 8.60212 4.5788 8.89515 4.28577C9.18817 3.99275 9.5856 3.82812 10 3.82812C10.4144 3.82812 10.8118 3.99275 11.1049 4.28577C11.3979 4.5788 11.5625 4.97622 11.5625 5.39062C11.5625 5.80503 11.3979 6.20245 11.1049 6.49548C10.8118 6.78851 10.4144 6.95312 10 6.95312Z" />
                      </svg>
                      <span className="font-medium font-MontserratSemiBold leading-5 tooltiptext opacity-0 group-hover:opacity-100 group-hover:visible" style={{
                        transition: 'all .5s ease-in-out',
                      }}>How your account is currently interacting with new users. You can change this in your interaction settings.</span>
                    </svgicon>
                  </div>
                </apptooltip>
              </div>
            </div>
          </div>

          <Starts />
        </div>
      </div>

      <div className="flex items-center px-10">
        <div
          className="min-w-[calc(100%-450px)]"
          style={{ padding: '10px 40px 10px 0' }}
        >
          <ChartSection
            sessionsData={sessionsData}
            days={selectedDate.value}
            isPrivate={false}
          />
        </div>
        <div className="my-10">
          <div>
            <div
              className="p-[35px] relative rounded-[10px] w-[450px]"
              style={{ boxShadow: '0 0 3px #00000040' }}
            >

              <apptooltip className="absolute top-[25px] right-[20px] ml-[8px] z-10 group cursor-pointer">
                <div className="flex items-center">
                  <svgicon
                    className="w-[20px] h-[20px] cursor-pointer fill-[#c4c4c4] group-hover:fill-[orange]"
                    style={{
                      transition: 'all .1s ease-in',
                    }}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M10 0.625C4.8225 0.625 0.625 4.8225 0.625 10C0.625 15.1775 4.8225 19.375 10 19.375C15.1775 19.375 19.375 15.1775 19.375 10C19.375 4.8225 15.1775 0.625 10 0.625ZM11.5625 16.1719H8.4375V8.67188H11.5625V16.1719ZM10 6.95312C9.5856 6.95312 9.18817 6.78851 8.89515 6.49548C8.60212 6.20245 8.4375 5.80503 8.4375 5.39062C8.4375 4.97622 8.60212 4.5788 8.89515 4.28577C9.18817 3.99275 9.5856 3.82812 10 3.82812C10.4144 3.82812 10.8118 3.99275 11.1049 4.28577C11.3979 4.5788 11.5625 4.97622 11.5625 5.39062C11.5625 5.80503 11.3979 6.20245 11.1049 6.49548C10.8118 6.78851 10.4144 6.95312 10 6.95312Z" />
                    </svg>
                    <span className="font-medium font-MontserratSemiBold leading-5 tooltiptext2 opacity-0 group-hover:opacity-100 group-hover:visible" style={{
                      transition: 'all .5s ease-in-out',
                    }}>Your personal account manager and growth consultant ‘Alex’ is our most senior expert with 5+ years of experience in Instagram marketing. Feel free to reach out at any time for help selecting optimal targets, using the dashboard, creating content, engaging followers and much more! Alex is here to provide his expertise and ensure you maximize your time with us.</span>
                  </svgicon>
                </div>
              </apptooltip>

              <div className="flex items-center">
                <img
                  alt=""
                  className="mr-5 w-[87px] h-[87px] rounded-full"
                  src="https://demo.engagementboost.com/assets/images/engagement/manager.png"
                ></img>
                <div>
                  <img alt="" className="w-[28px] h-[28px]" src="/logo.png" />
                  <div
                    _ngcontent-cuk-c74=""
                    className="font-bold font-MontserratBold text-2xl text-black"
                  >
                    Alexander A
                  </div>
                  <div className="font-normal text-base">
                    Personal account manager
                  </div>
                </div>
              </div>
              <div className="mt-5 text-black text-sm font-normal">
                Hey! My name is Alex and I am super excited to be your personal
                account manager. I’ve been an Instagram marketing consultant
                since 2017 and am here to help you get the real and targeted
                growth you’ve been waiting for! Ask me any questions related to
                targeting, account settings, content and more!
              </div>
            </div>
            <div className="mt-[10px] gap-[10px] flex items-center">
              <Link to="#" className="bg-[#23df85] text-white w-full flex items-center justify-center text-sm font-semibold rounded-[10px] h-[52px] min-h-[52px] cursor-pointer">
                <BsHeadset size={18} className="mr-1" />
                <span> Shedule a call</span>
              </Link>
              <a href="mailto:paulinnocent05@gmail.com" className="bg-[#1b89ff] text-white w-full flex items-center justify-center text-sm font-semibold rounded-[10px] h-[52px] min-h-[52px] cursor-pointer">
                <BiMessageSquareDots size={18} className="mr-1" />
                <span> Send an email</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <TargetingCompt user={userData} />

      <WhiteListCompt userId={userData?.user_id} />
    </>
  );
}

const Starts = () => {
  return (<>
    <div className="flex items-center gap-4">
      <div
        className="bg-[#1b89ff] text-white w-[220px] cursor-pointer rounded-[10px]"
        style={{
          padding: '12px 16px 2px 20px',
          transition: 'all .15s ease-in',
        }}
      >
        <div className="text-[16px] font-[500]">Followers</div>
        <div className="flex justify-between items-center">
          <div className="text-4xl leading-[54px] font-MontserratBold font-bold">
            49.6k
          </div>
          <div className="py-1 px-2 rounded-[7px] bg-[#c8f7e1] text-[#23df85] mt-1 flex items-center gap-1 text-[12px] font-bold font-MontserratBold">
            123 <FaCaretUp color="#1B89FF" size={12} />
          </div>
        </div>
      </div>

      <div
        className="text-black w-[220px] cursor-pointer rounded-[10px]"
        style={{
          boxShadow: '0 0 3px #00000040',
          padding: '12px 16px 2px 20px',
          transition: 'all .15s ease-in',
        }}
      >
        <div className="text-[16px] font-[500] text-[#757575]">
          Followings
        </div>
        <div className="text-4xl leading-[54px] font-MontserratBold font-bold">
          300
        </div>
      </div>

      <div
        className="text-black w-[220px] cursor-pointer rounded-[10px]"
        style={{
          boxShadow: '0 0 3px #00000040',
          padding: '12px 16px 2px 20px',
          transition: 'all .15s ease-in',
        }}
      >
        <div className="text-[16px] font-[500] text-[#757575]">
          Interactions
        </div>
        <div className="text-4xl leading-[54px] font-MontserratBold font-bold">
          4.6k
        </div>
      </div>
    </div>
  </>)
}

const AddOthers = ({ pageProp, userId, addSuccess, setAddSuccess }) => {
  const buttonText = pageProp.title === 'Targeting' ? 'Add Target' : pageProp.title + " Account"
  const from = (pageProp.title).toLowerCase();
  const [parentRef, isClickedOutside] = useClickOutside();
  const [showResultModal, setShowResultModal] = useState(false)
  const [selected, setSelected] = useState()
  const [searchedAccounts, setSearchedAccounts] = useState([])
  const [input, setInput] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState(input)

  const [loadingSpinner, setLoadingSpinner] = useState(false)
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef()

  useEffect(() => {
    if (isClickedOutside) {
      setShowResultModal(false)
    };
  }, [isClickedOutside]);

  useEffect(() => {
    var i = debouncedQuery;
    if (debouncedQuery.startsWith('@')) {
      i = debouncedQuery.substring(1)
    }
    const timer = setTimeout(() => setInput(i), 1000);
    return () => clearTimeout(timer)
  }, [debouncedQuery]);

  useEffect(() => {
    const fetch = async () => {
      setLoadingSpinner(true)
      const data = await searchAccount(input);
      const users = data?.users;
      if (users?.length > 0) {
        const filtered = users?.filter(user => {
          var x = (user?.username)?.toLowerCase()
          var y = input?.toLowerCase()
          return x?.startsWith(y)
        })
        // console.log(filtered);
        setSearchedAccounts(filtered)
        setShowResultModal(true)
      }
      setLoadingSpinner(false)
    }
    setSearchedAccounts([])
    fetch()
  }, [input])

  const add = async () => {
    if (!selected) return;
    var filteredSelected = selected;
    if (filteredSelected.startsWith('@')) {
      filteredSelected = filteredSelected.substring(1)
    }
    if (filteredSelected) {
      setProcessing(true);
      setLoadingSpinner(true)
      const theAccount = await getAccount(filteredSelected);
      // console.log(theAccount);
      var profile_pic_url = '';
      const uploadImageFromURLRes = await uploadImageFromURL(filteredSelected, theAccount?.data?.[0]?.profile_pic_url)
      if (uploadImageFromURLRes?.status === 'success') {
        profile_pic_url = uploadImageFromURLRes?.data
      }

      const res = await supabase.from(from).insert({
        account: filteredSelected,
        followers: theAccount.data[0].follower_count,
        avatar: profile_pic_url,
        user_id: userId,
      });
      res?.error && console.log(
        "🚀 ~ file: Whitelist.jsx:33 ~ const{error}=awaitsupabase.from ~ error",
        res.error
      );

      setSelected("");
      setDebouncedQuery('')
      setProcessing(false);
      setLoadingSpinner(false)
      setAddSuccess(!addSuccess);
    }
  };

  return (<>
    <div key={pageProp.id} className="w-[430px] mt-[50px] pl-4 h-[380px] relative">
      <div
        className="h-full relative"
        style={{ transition: 'opacity .25s ease-in' }}
      >
        <div>
          <div className="font-bold font-MontserratBold text-2xl text-black">
            Add {pageProp.title} {pageProp.title !== "Targeting" && "Accounts"}
          </div>
          <div className="font-normal text-[14px]">
            {pageProp.addDescription}
          </div>
        </div>

        <div className="mt-5 relative" ref={parentRef}>
          <div className="flex items-center text-base font-medium text-black border border-black h-[60px] p-[18px] rounded-[10px] w-full outline-none box-border">
            <input
              type="text"
              placeholder="@accountname"
              className="border-none outline-none w-full"
              value={debouncedQuery}
              ref={inputRef}
              onChange={(e) => {
                setDebouncedQuery(e.target.value);
              }}
              onFocus={() => {
                setShowResultModal(true)
              }}
            />
            <div className="relative flex items-center justify-center">
              <span className="absolute z-10">{loadingSpinner && (<Spinner animation="border" />)}</span>
              {input && <TiTimes className='cursor-pointer' onClick={() => { setDebouncedQuery('') }} />}
            </div>
          </div>

          <div
            className={`${!showResultModal && 'hidden'} ${pageProp.title === 'Targeting' ? "top-[calc(100%-35px)]" : "top-[calc(100%-7px)]"} opacity-100 max-h-[400px] overflow-y-auto absolute w-full left-0 translate-y-2 rounded-[10px] z-10 bg-white`}
            style={{
              pointerEvents: 'all',
              boxShadow: '0 0 3px #00000040',
              transition: 'opacity .15s ease-in',
            }}
          >
            {debouncedQuery && <div className="flex items-center gap-[12px] border-b hover:bg-[#c4c4c4]/20 py-5 px-[30px] pb-2 cursor-pointer"
              onClick={() => {
                setSelected(debouncedQuery);
                // setInput(debouncedQuery)
                setLoadingSpinner(false)
                setShowResultModal(false);
              }}
            >
              <div className="p-3 rounded-full bg-black">
                <FaUser size={14} color="white w-[46px] h-[46px]" />
              </div>
              <div className="">
                <div className="">{debouncedQuery}</div>
                <div className="mt-1 opacity-40 text-[.9rem]">click here to select account</div>
              </div>
            </div>}

            {searchedAccounts?.map(account => {
              return <div key={account?.pk}>
                <div>
                  <div className="cursor-pointer hover:bg-[#c4c4c4]/20 py-5 px-[30px] flex items-center justify-between" onClick={() => {
                    setDebouncedQuery(account?.username)
                    setSelected(account?.username);
                    // setInput(data?.username)
                    setLoadingSpinner(false)
                    setShowResultModal(false);
                  }}>
                    <div className="flex items-center">
                      <img
                        alt=""
                        className="w-[46px] h-[46px] bg-[#c4c4c4] rounded-full mr-[12px]"
                        src={account?.profile_pic_url}
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <div className="text-black text-base font-medium ">
                            {account?.full_name}
                          </div>
                          {account?.is_verified && <MdVerified
                            className="ml-[5px] w-[18px] h-[18px]"
                            size={18}
                          />}
                        </div>
                        <div className="text-[#757575] text-base font-semibold font-MontserratSemiBold">
                          @{account?.username}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            })}
          </div>
          {pageProp.title === 'Targeting' && <div className="text-[#1b89ff] cursor-pointer mt-2 ml-5 text-[14px] font-medium font-MontserratSemiBold">
            Need help picking targets?
          </div>}
        </div>

        <button
          className={`${selected ? "bg-[#23df85]" : "bg-gray-400"} text-white font-medium text-base mt-7 absolute bottom-0 font-MontserratSemiBold w-full rounded-[10px] h-[52px] max-h-[52px] border-none cursor-pointer`}
          // disabled={selected ? true : false}
          style={{ transition: 'background-color .15s ease-in' }}
          onClick={() => add()}
        >
          {processing ? <span className="animate-pulse">Processing…</span> : buttonText}
        </button>
      </div>
    </div>
  </>)
}

const OtherUsers = ({ account, addSuccess, setAddSuccess, from }) => {

  return (<>
    <div
      className="bg-[#f8f8f8] text-[#757575] flex rounded-[10px] items-center w-full h-[64px] min-h-[64px] text-[14px] font-medium font-MontserratSemiBold px-[10px]"
      style={{ transition: 'all .1s ease-in' }}
    >
      <div className="w-[60%] flex items-center whitespace-nowrap overflow-hidden text-ellipsis justify-start pl-5">
        <div className="w-[40px] h-[40px] mr-[10px] relative">
          <img alt="click" className="h-[40px] w-[40px] rounded-full" src={account?.avatar || "/avatar.svg"} onClick={async () => {
            await updateUserProfilePicUrl(account, from)
            setAddSuccess(!addSuccess)
          }} />
        </div>
        <div className="font-normal text-base text-black whitespace-nowrap overflow-hidden text-ellipsis">
          @{account?.account}
        </div>
      </div>
      <div className="w-[15%] flex items-center justify-end text-[#757575] text-base font-normal">
        {numFormatter(account?.followers)}
      </div>
      <div className="w-[21%] flex items-center justify-end">
        {countDays(account?.created_at)}
      </div>
      <div className="w-[4%] flex items-center justify-end">
        <FaTrash className="cursor-pointer" onClick={async () => {
          await deleteAccount(from, account.id);
          setAddSuccess(!addSuccess)
        }} />
      </div>
    </div>
  </>)
}

const TargetingCompt = ({ user }) => {
  const userId = user?.user_id
  const pageProp = { id: 1, title: "Targeting", addDescription: 'Set up your targeting by adding relevant Usernames and Hashtags.' }
  const [targetingAccounts, setTargetingAccounts] = useState([]);
  const [addSuccess, setAddSuccess] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
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

  useEffect(() => {
    const getTargetingAccounts = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from("targeting")
        .select()
        .eq("user_id", userId)
        .order('id', { ascending: false });

      if (error) return console.log(error);
      setTargetingAccounts(data);
    };

    getTargetingAccounts();
  }, [userId, addSuccess]);

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

  return (<>
    <div>
      <div>
        <div
          className="flex justify-between items-center rounded-[10px] h-[84px] px-4 mb-10"
          style={{
            boxShadow: '0 0 3px #00000040',
          }}
        >
          <div className="flex items-center">
            <div className="bg-[#f8f8f8] font-bold font-MontserratBold text-[26px] flex items-center relatve h-[60px] rounded-[10px] px-6">
              Targeting
              <span className="bg-[#23df85] text-white rounded-[10px] h-9 leading-9 px-[10px] ml-[12px]">
                {targetingAccounts.length}
              </span>
            </div>

            <apptooltip className="ml-[8px] cursor-pointer group relative">
              <div className="flex items-center">
                <svgicon
                  className="w-[20px] h-[20px] cursor-pointer fill-[#c4c4c4] group-hover:fill-[orange]"
                  style={{
                    transition: 'all .1s ease-in',
                  }}
                >
                  <svg
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M10 0.625C4.8225 0.625 0.625 4.8225 0.625 10C0.625 15.1775 4.8225 19.375 10 19.375C15.1775 19.375 19.375 15.1775 19.375 10C19.375 4.8225 15.1775 0.625 10 0.625ZM11.5625 16.1719H8.4375V8.67188H11.5625V16.1719ZM10 6.95312C9.5856 6.95312 9.18817 6.78851 8.89515 6.49548C8.60212 6.20245 8.4375 5.80503 8.4375 5.39062C8.4375 4.97622 8.60212 4.5788 8.89515 4.28577C9.18817 3.99275 9.5856 3.82812 10 3.82812C10.4144 3.82812 10.8118 3.99275 11.1049 4.28577C11.3979 4.5788 11.5625 4.97622 11.5625 5.39062C11.5625 5.80503 11.3979 6.20245 11.1049 6.49548C10.8118 6.78851 10.4144 6.95312 10 6.95312Z" />
                  </svg>
                  <span className="font-medium font-MontserratSemiBold leading-5 tooltiptext opacity-0 group-hover:opacity-100 group-hover:visible" style={{
                    transition: 'all .5s ease-in-out',
                  }}>All your targets will appear here after you have added them. You can track their performance and make adjustments. For optimal results, aim for a follow-back rate of 15%+ across all targets.</span>
                </svgicon>
              </div>
            </apptooltip>
          </div>

          <button className="bg-[#1b89ff] text-white font-bold font-MontserratBold text-[16px] flex items-center px-6 rounded-[10px] h-[52px] min-h-[52px] border-none cursor-pointer" onClick={() => setFilterModal(true)}>
            Targeting Filters
            <img alt="" className="ml-2" src="/ic_filters.svg" />
          </button>
        </div>
      </div>

      <div className="m-10 mt-0 flex items-center">
        <div className="grow">
          <div className="text-[#757575] flex items-center w-full h-[50px] text-[14px] font-medium font-MontserratSemiBold pr-[30px]">
            <div className="w-[60%] flex items-center justify-start pl-5">
              <span className="ml-[60px]">Account</span>
            </div>
            <div className="w-[15%] flex items-center justify-end">
              Followers
            </div>
            <div className="w-[20%] flex items-center justify-end">Added</div>
            <div className="w-[5%]"></div>
          </div>

          <div className="h-[380px] overflow-y-auto flex flex-col gap-[11px] pr-4">
            {targetingAccounts.map(account => {
              return <OtherUsers
                key={account?.id}
                account={account}
                addSuccess={addSuccess}
                setAddSuccess={setAddSuccess}
                from={'targeting'}
              />
            })}
          </div>
        </div>

        <AddOthers
          pageProp={pageProp}
          userId={userId}
          addSuccess={addSuccess}
          setAddSuccess={setAddSuccess}
        />
      </div>
    </div>

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
  </>)
}

const WhiteListCompt = ({ userId }) => {
  const [total, setTotal] = useState({ whitelist: 0, blacklist: 0 })
  const [pageProp, setPageProp] = useState({ id: 2, title: "Whitelist", addDescription: 'Add users you wish to continue followingthat were followed by EngagementBoost. We will never unfollow anyone you manually followed.' })
  const [showPageModal, setShowPageModal] = useState(false)
  const [targetingAccounts, setTargetingAccounts] = useState([]);
  const [addSuccess, setAddSuccess] = useState(false);

  useEffect(() => {
    const getTargetingAccounts = async () => {
      if (!userId) return;
      const whiteList = await supabase
        .from('whitelist')
        .select()
        .eq("user_id", userId)
        .order('id', { ascending: false });
      const blackList = await supabase
        .from('blacklist')
        .select()
        .eq("user_id", userId)
        .order('id', { ascending: false });
      setTotal({ whitelist: whiteList?.data?.length, blacklist: blackList?.data?.length })

      pageProp?.title === 'Whitelist' ? setTargetingAccounts(whiteList.data) : setTargetingAccounts(blackList.data);
      if (blackList.error) console.log(blackList.error);
      if (whiteList.error) console.log(whiteList.error);
    };

    getTargetingAccounts();
  }, [userId, addSuccess, pageProp]);

  return (<>
    <div>
      <div>
        <div
          className="flex justify-between items-center rounded-[10px] h-[84px] px-4 mb-10"
          style={{
            boxShadow: '0 0 3px #00000040',
          }}
        >
          <div className="flex items-center">
            <div className="relative">
              <div className="bg-[#f8f8f8] font-bold font-MontserratBold text-[26px] flex items-center h-[60px] rounded-[10px] px-6 cursor-pointer relative z-[2]"
                onClick={() => setShowPageModal(true)}
              >
                {pageProp.title}
                <span className={`${pageProp.title === "Whitelist" ? "bg-[#1b89ff]" : "bg-[#000]"} text-white rounded-[10px] h-9 leading-9 px-[10px] ml-[12px]`}>
                  {total[(pageProp.title).toLowerCase()]}
                </span>
                <FaCaretDown className="w-[30px] h-[26px] ml-2" color="#C4C4C4" />
              </div>
              <div className={`${showPageModal ? 'opacity-100 z-10' : 'opacity-0 -z-10'} absolute top-0 left-0 w-full bg-white rounded-[10px]`} style={{
                boxShadow: "0 0 3px #00000040",
                transform: 'translteY(8px)',
                transition: 'opacity .15s ease-in',
              }}>
                <div className="font-bold font-MontserratBold text-[26px] flex items-center cursor-pointer h-[60px] rounded-[10px] px-6 hover:bg-[#f8f8f8]"
                  onClick={() => {
                    setPageProp({ id: 2, title: "Whitelist", addDescription: 'Add users you wish to continue followingthat were followed by EngagementBoost. We will never unfollow anyone you manually followed.' })
                    setShowPageModal(false)
                  }}>
                  Whitelist
                  <span className="bg-[#1b89ff] text-white rounded-[10px] h-9 leading-9 px-[10px] ml-[12px]">
                    {total?.whitelist}
                  </span>
                  <FaCaretDown className="w-[30px] h-[26px] ml-2" color="#C4C4C4" />
                </div>
                <div className="font-bold font-MontserratBold text-[26px] flex items-center cursor-pointer h-[60px] rounded-[10px] px-6 hover:bg-[#f8f8f8]"
                  onClick={() => {
                    setPageProp({
                      id: 3, title: "Blacklist", addDescription: "Blacklist users that you would not like to interact with and we won't follow them when growing your account."
                    })
                    setShowPageModal(false)
                  }}>
                  Blacklist
                  <span className="bg-[#000] text-white rounded-[10px] h-9 leading-9 px-[10px] ml-[12px]">
                    {total?.blacklist}
                  </span>
                </div>
              </div>
            </div>

            <apptooltip className="ml-[8px] cursor-pointer group relative">
              <div className="flex items-center">
                <svgicon
                  className="w-[20px] h-[20px] cursor-pointer fill-[#c4c4c4] group-hover:fill-[orange]"
                  style={{
                    transition: 'all .1s ease-in',
                  }}
                >
                  <svg
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M10 0.625C4.8225 0.625 0.625 4.8225 0.625 10C0.625 15.1775 4.8225 19.375 10 19.375C15.1775 19.375 19.375 15.1775 19.375 10C19.375 4.8225 15.1775 0.625 10 0.625ZM11.5625 16.1719H8.4375V8.67188H11.5625V16.1719ZM10 6.95312C9.5856 6.95312 9.18817 6.78851 8.89515 6.49548C8.60212 6.20245 8.4375 5.80503 8.4375 5.39062C8.4375 4.97622 8.60212 4.5788 8.89515 4.28577C9.18817 3.99275 9.5856 3.82812 10 3.82812C10.4144 3.82812 10.8118 3.99275 11.1049 4.28577C11.3979 4.5788 11.5625 4.97622 11.5625 5.39062C11.5625 5.80503 11.3979 6.20245 11.1049 6.49548C10.8118 6.78851 10.4144 6.95312 10 6.95312Z" />
                  </svg>
                  <span className="font-medium font-MontserratSemiBold leading-5 tooltiptext opacity-0 group-hover:opacity-100 group-hover:visible" style={{
                    transition: 'all .5s ease-in-out',
                  }}>{pageProp.title === "Whitelist" ? "If you wish to continue following a user that we automatically followed for you, add them here and we won’t unfollow them. Remember, we will never unfollow anyone you manually followed before or after using our service - this only applies to users we followed for you." : "Add accounts that you never want us to follow. Our system will ensure to avoid interacting with every user you blacklist."}</span>
                </svgicon>
              </div>
            </apptooltip>
          </div>
        </div>
      </div>

      <div className="m-10 mt-0 d-flex items-center">
        <div className="grow">
          <div className="text-[#757575] flex items-center w-full h-[50px] text-[14px] font-medium font-MontserratSemiBold pr-[30px]">
            <div className="w-[60%] flex items-center justify-start pl-5">
              <span className="ml-[60px]">Account</span>
            </div>
            <div className="w-[15%] flex items-center justify-end">
              Followers
            </div>
            <div className="w-[20%] flex items-center justify-end">Added</div>
            <div className="w-[5%]"></div>
          </div>

          <div className="h-[380px] overflow-y-auto flex flex-col gap-[11px] pr-4">
            {targetingAccounts.map(account => {
              return <OtherUsers
                key={account?.id}
                account={account}
                addSuccess={addSuccess}
                setAddSuccess={setAddSuccess}
                from={(pageProp.title).toLowerCase()}
              />
            })}
          </div>
        </div>

        <AddOthers
          pageProp={pageProp}
          userId={userId}
          addSuccess={addSuccess}
          setAddSuccess={setAddSuccess}
        />
      </div>
    </div>
  </>)
}