/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { supabase, supabaseAdmin } from "../supabaseClient";
import { AiOutlineDashboard, AiOutlineSetting, AiOutlineSortAscending } from 'react-icons/ai'
import { BiLogOutCircle, BiUserCircle } from 'react-icons/bi'
import { FaTimes, FaUserCheck, FaUserClock, FaUserTimes } from 'react-icons/fa'
import Datepicker from 'flowbite-datepicker/Datepicker';
import axios from 'axios';
import { useClickOutside } from 'react-click-outside-hook';
import { Link, useNavigate } from 'react-router-dom';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const urlEncode = function (data) {
  var str = [];
  for (var p in data) {
    if (data.hasOwnProperty(p) && (!(data[p] === undefined || data[p] == null))) {
      str.push(encodeURIComponent(p) + "=" + (data[p] ? encodeURIComponent(data[p]) : ""));
    }
  }
  return str.join("&");
}

export default function DashboardApp() {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState()
  const [originalUsers, setOriginalUsers] = useState()
  const [selectedUser, setSelectedUser] = useState()
  const [showChargebee, setShowChargebee] = useState(false)
  const [sortByStatus, setSortByStatus] = useState('All')
  const [showStatusOptions, setShowStatusOptions] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return navigate("/login")
      // console.log(user);

      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('user_id', user.id).order('created_at', { ascending: false })

        error && console.console.log(error);
        console.log(data[0]);
        setUser(data[0]);
        if(!data[0]?.admin){
          alert("You are not allowed to access this page.")
        }
    }
    fetch()
  }, [navigate])
  

  useEffect(() => {
    const datepickerEl = document.getElementById('datepickerId');
    new Datepicker(datepickerEl, {
      title: "Sort by date added",
      // date: new Date(),
      placement: 'bottom',
      triggerType: 'click',
      offsetSkidding: 0,
      offsetDistance: 10,
      delay: 300,
      onHide: () => {
        console.log('dropdown has been hidden');
      },
      onShow: () => {
        console.log('dropdown has been shown');
      },
      onToggle: () => {
        console.log('dropdown has been toggled');
      }
    });
  }, [])


  useEffect(() => {
    if (originalUsers) {
      const sidenav = document.getElementById("datepickerId");
      sidenav.addEventListener("changeDate", (event) => {
        if (event?.target?.value) {
          // var filtered = users.filter(user => new Date(user.created_at).getTime() === new Date(event.target.value).getTime())
          var filtered = originalUsers?.filter(user => {
            var d1 = new Date(user.created_at).getDate()
            var m1 = new Date(user.created_at).getMonth() + 1
            var y1 = new Date(user.created_at).getFullYear()
            const a = (d1 + m1 + y1);
            var d2 = new Date(event.target.value).getDate()
            var m2 = new Date(event.target.value).getMonth() + 1
            var y2 = new Date(event.target.value).getFullYear()
            const b = (d2 + m2 + y2);
            return a === b
          })
          setUsers(filtered)
        }
      });
      return sidenav.removeEventListener("changeDate", () => { })
    }
  }, [originalUsers])

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
      error && console.log(error);
      if (error) return;

      const filtered = data.filter(user => user.username !== '')
      setUsers(filtered);
      setOriginalUsers(filtered);
      var active = filtered.filter(user => (user.status).toLowerCase() === 'active')
      var pending = filtered.filter(user => (user.status).toLowerCase() === 'pending')
      var cancelled = filtered.filter(user => (user.status).toLowerCase() === 'cancelled')
      document.querySelector('#Tactive').textContent = active.length
      document.querySelector('#Tpending').textContent = pending.length
      document.querySelector('#Tcancelled').textContent = cancelled.length
      // console.log(filtered[0]);
    }
    fetch()
  }, [])

  const filterByStatus = (status) => {
    document.getElementById("datepickerId").value = ''
    document.getElementById("table-search").value = ''
    var a = originalUsers.filter(user => (user.status).toLowerCase() === status.toLowerCase())
    setUsers()
    setTimeout(() => {
      setUsers(a)
    }, 10);
  }

  useEffect(() => {
    if(searchTerm){
      setTimeout(async () => {
        const { data, error } = await supabase
          .from('users')
          .select()
          .like('username', `%${searchTerm}%`)

        error && console.log(error);
        if(data){
          setUsers(data)
        }else{
          setUsers(originalUsers)
        }
      }, 1000);
    }
  }, [originalUsers, searchTerm])

  return (
    <div className="bg-[#F8F8F8]">
      <div className="max-w-[1580px] mx-auto flex gap-2 md:gap-6 h-screen">
        <div className="flex-1 bg-white py-10 px-3">
          <img src="/sprouty.svg" alt="" className="mx-auto" />
          <div className="flex flex-col gap-9 lg:gap-4 mt-10 font-semibold">
            <Link to="/dashboard" className="flex flex-col lg:flex-row items-center gap-3 py-2 px-4 bg-[#F8F8F8] hover:bg-[#F8F8F8]/70 cursor-pointer rounded-lg">
              <AiOutlineDashboard size={30} className="w-[24px] md:w-[30px]" />
              <span className="hidden md:block text-md">Dashboard</span>
            </Link>
            <div className="flex flex-col lg:flex-row items-center gap-3 py-2 px-4 hover:bg-[#F8F8F8]/70 cursor-pointer rounded-lg" onClick={async () => {
              await supabase.auth.signOut();
              window.onbeforeunload = function () {
                localStorage.clear();
              }
              window.location.pathname = "/login";
            }}>
              <BiLogOutCircle size={30} className="w-[24px] md:w-[30px]" />
              <span className="hidden md:block text-md">Logout</span>
            </div>
          </div>
        </div>
        <div className="flex-[5] pb-4 h-screen overflow-auto">
          <div className="">
            <div className="flex overflow-auto flex-wrap justify-evenly items-center py-6 lg:px-2 gap-2 bg-white">
              <div className="w-[30%] lg:w-[260px] py-[8px] lg:py-[20px] px-[10px] md:px-[14px] lg:px-[32px] bg-[#314796] text-white rounded-[8px]">
                <div className="flex items-center gap-1 md:gap-3">
                  <FaUserCheck
                    color="white"
                    size={37}
                    className="w-[20px] md:w-[37px]"
                  />
                  <span className="font-semibold md:font-black lg:text-xl" id="Tactive">0</span>
                </div>
                <p className="font-semibold md:font-black text-[10px] lg:text-xl">
                  Total active users
                </p>
              </div>
              <div className="w-[30%] lg:w-[260px] py-[8px] lg:py-[20px] px-[10px] md:px-[14px] lg:px-[32px] bg-[#763196] text-white rounded-[8px]">
                <div className="flex items-center gap-1 md:gap-3">
                  <FaUserClock
                    color="white"
                    size={37}
                    className="w-[20px] md:w-[37px]"
                  />
                  <span className="font-semibold md:font-black lg:text-xl" id="Tpending">0</span>
                </div>
                <p className="font-semibold md:font-black text-[10px] lg:text-xl">
                  Total pending users
                </p>
              </div>
              <div className="w-[30%] lg:w-[260px] py-[8px] lg:py-[20px] px-[10px] md:px-[14px] lg:px-[32px] bg-[#96317A] text-white rounded-[8px]">
                <div className="flex items-center gap-1 md:gap-3">
                  <FaUserTimes
                    color="white"
                    size={37}
                    className="w-[20px] md:w-[37px]"
                  />
                  <span className="font-semibold md:font-black lg:text-xl" id="Tcancelled">0</span>
                </div>
                <p className="font-semibold md:font-black text-[10px] lg:text-xl">
                  Total inactive users
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white text-[#626262]">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <div className="py-4 bg-white dark:bg-gray-900 flex gap-4 items-center px-4">
                <div className="">
                  <label htmlFor="table-search" className="sr-only">Search</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                    </div>
                    <input type="text" id="table-search" className="w-80 block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for items" 
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                    }}
                    />
                  </div>
                </div>

                <div className="relative max-w-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                  </div>
                  <input datepicker datepicker-title="Date added" id='datepickerId' type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Date added" onChange={(e) => {
                    // console.log(e.target.value);
                  }} />
                </div>

              </div>

              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex gap-1 items-center">
                        Users
                        <a href="#" onClick={(e) => {
                          e.preventDefault()
                          const sorted = users.sort(function (a, b) {
                            const nameA = a.username.toUpperCase(); // ignore upper and lowercase
                            const nameB = b.username.toUpperCase(); // ignore upper and lowercase
                            if (nameA > nameB) {
                              return 1;
                            }
                            if (nameA < nameB) {
                              return -1;
                            }

                            // names must be equal
                            return 0;
                          });
                          // console.log(sorted)
                          setUsers()
                          setTimeout(() => {
                            setUsers(sorted)
                          }, 10);
                        }}>
                          <AiOutlineSortAscending size={16} className="" />
                        </a>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center relative">
                        <div className="flex flex-col">
                          <span>Status</span>
                          <span className='text-[10px] font-extralight'>{sortByStatus}</span>
                        </div>
                        <a href="#" onClick={() => {
                          setShowStatusOptions(!showStatusOptions)
                        }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3 ml-1"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 320 512"
                          >
                            <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                          </svg>
                        </a>
                        {showStatusOptions && <div className="z-50 absolute top-12 -left-4 py-3 w-[130px] px-4 bg-white text-gray-600 shadow-2xl flex flex-col gap-6">
                          <div className="hover:text-gray-400 cursor-pointer"
                            onClick={() => {
                              setUsers(originalUsers)
                              setSortByStatus("All")
                              setShowStatusOptions(false)
                            }}
                          >All</div>
                          <div className="hover:text-gray-400 cursor-pointer"
                            onClick={() => {
                              setSortByStatus("Active")
                              filterByStatus("Active")
                              setShowStatusOptions(false)
                            }}
                          >Active</div>
                          <div className="hover:text-gray-400 cursor-pointer"
                            onClick={() => {
                              setSortByStatus("Pending")
                              filterByStatus("Pending")
                              setShowStatusOptions(false)
                            }}
                          >Pending</div>
                          <div className="hover:text-gray-400 cursor-pointer"
                            onClick={() => {
                              setSortByStatus("Checking")
                              filterByStatus("Checking")
                              setShowStatusOptions(false)
                            }}
                          >Checking</div>
                          <div className="hover:text-gray-400 cursor-pointer"
                            onClick={() => {
                              setSortByStatus("Not-active")
                              filterByStatus("Not-active")
                              setShowStatusOptions(false)
                            }}
                          >Not-active</div>
                          <div className="hover:text-gray-400 cursor-pointer"
                            onClick={() => {
                              setSortByStatus("Cancelled")
                              filterByStatus("Cancelled")
                              setShowStatusOptions(false)
                            }}
                          >Cancelled</div>
                        </div>}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                        Followers
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                        Following
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                        Targeting
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                        Mode
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                        Chargebee
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <span className="sr-only">ddEdit</span>
                    </th>
                  </tr>
                </thead>

                <tbody className=''>
                  {users && users.map((user) => {
                    const username = user?.username;
                    var sessionData = '';
                    const fetch = async () => {
                      const resData = await supabase
                        .from('sessions')
                        .select()
                        .eq('username', user?.username)
                      resData.error && console.log(resData.error);
                      if (resData?.data[0]?.data) {
                        const d = JSON.parse(resData?.data[0]?.data)
                        // console.log(d[0]);
                        document.querySelector(`#followers_${username}`).textContent = d[0].profile.followers
                        document.querySelector(`#following_${username}`).textContent = d[0].profile.following
                        sessionData = d[0]
                      }
                    }

                    if (username) {
                      fetch()
                    }

                    const getTargetingAccounts = async () => {
                      // console.log(user);
                      const { data, error } = await supabase
                        .from("targeting")
                        .select()
                        .eq("user_id", user?.user_id)
                        .order('id', { ascending: false });
                      error && console.log(
                        "🚀 ~ file: Targeting.jsx:63 ~ getTargetingAccounts ~ error",
                        error
                      );
                      // console.log(data);
                      const targeting = document.querySelector(`#targeting_${username}`)
                      if (targeting) {
                        targeting.textContent = data?.length
                      }
                      return data;
                      // setTargetingAccounts(data);
                    };

                    getTargetingAccounts();

                    sessionData && console.log(sessionData);
                    if (username) {
                      return (
                        <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200">
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {username}
                          </th>
                          <td className="px-6 py-4">{user.status}</td>
                          <td className="px-6 py-4" id={`followers_${username}`}>{user.profile.followers}</td>
                          <td className="px-6 py-4" id={`following_${username}`}>{user.profile.following}</td>
                          <td className="px-6 py-4 w-full flex justify-center" id={`targeting_${username}`}>0</td>
                          <td className="px-6 py-4">{user.userMode}</td>
                          <td className="px-6 py-4">
                            <BiUserCircle size={24} className="ml-5" onClick={() => {
                              setSelectedUser(user)
                              setShowChargebee(true)
                            }} />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link to={`/dashboard/edit/${user?.user_id}`} target="_blank" rel="noopener noreferrer"
                              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            >
                              <AiOutlineSetting size={24} />
                            </Link>
                          </td>
                        </tr>
                      )
                    } else {
                      return null
                    }
                  })}
                </tbody>
              </table>

              {users?.length > 100 && <nav className="mb-10 px-4 flex items-center justify-between pt-4" aria-label="Table navigation">
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Showing <span className="font-semibold text-gray-900 dark:text-white">1-20</span> of <span className="font-semibold text-gray-900 dark:text-white">{users?.length}</span></span>
                <ul className="inline-flex items-center -space-x-px">
                  <li>
                    <a href="#" className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                      <span className="sr-only">Previous</span>
                      <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
                  </li>
                  <li>
                    <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
                  </li>
                  <li>
                    <a href="#" aria-current="page" className="z-10 px-3 py-2 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
                  </li>
                  <li>
                    <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">...</a>
                  </li>
                  <li>
                    <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">{users?.length}</a>
                  </li>
                  <li>
                    <a href="#" className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                      <span className="sr-only">Next</span>
                      <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                    </a>
                  </li>
                </ul>
              </nav>}

              <br /><br /><br /><br /><br />

            </div>
          </div>
        </div>
      </div>
      {showChargebee && <Chargebee key={selectedUser.username} user={selectedUser} setShowChargebee={setShowChargebee} />}
    </div>
  );
}

const Chargebee = ({ key, user, setShowChargebee }) => {
  const [customer, setCustomer] = useState('')
  const [subscription, setsubscription] = useState()
  const [currentUser, setCurrentUser] = useState()
  const [parentRef, isClickedOutside] = useClickOutside();

  const baseUrl = 'https://sproutysocial-api.up.railway.app'
  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabaseAdmin.auth.admin.getUserById(user.user_id)
      setCurrentUser(data.user)
      error && console.log(error)

      let customer = await axios.post(`${baseUrl}/api/customer_list`,
        urlEncode({ email: user?.email }))
        .then((response) => response.data)
      setCustomer(customer)

      if (customer) {
        let subscription = await axios.post(`${baseUrl}/api/subscription_list`,
          urlEncode({ customer_id: customer?.id }))
          .then((response) => response.data)
        setsubscription(subscription)
      }

    }
    fetch()
  }, [user])

  useEffect(() => {
    if (isClickedOutside) {
      setShowChargebee(false)
    };
  }, [isClickedOutside, setShowChargebee]);

  return (
    <div key={key} className="fixed top-0 left-0 h-screen w-full grid place-items-center bg-black/70">
      <div className="bg-white w-[400px] py-4 rounded-xl" ref={parentRef}>
        <div className="py-2 px-6 border-b flex justify-between">
          <div className="font-bold text-lg">User Chargebee details</div>
          <FaTimes className='cursor-pointer' onClick={() => setShowChargebee(false)} />
        </div>
        <div className="mt-4 flex flex-col gap-4 px-6">
          <div className="flex justify-between border-b gap-10">
            <div className="">USERNAME:</div>
            <div className="">{user?.username}</div>
          </div>
          <div className="flex justify-between border-b gap-10">
            <div className="">ACCOUNT STATUS:</div>
            <div className="">{user?.status}</div>
          </div>
          <div className="flex justify-between border-b gap-10">
            <div className="">SUBSCRIPTION STATUS:</div>
            <div className="">{subscription?.status}</div>
          </div>
          <div className="flex justify-between border-b gap-10">
            <div className="">NAME:</div>
            <div className="">{user?.full_name}</div>
          </div>
          <div className="flex justify-between border-b gap-10">
            <div className="">EMAIL:</div>
            <div className="">{currentUser?.email}</div>
          </div>
          <div className="flex justify-between border-b gap-10">
            <div className="">CUSTOMER_ID:</div>
            {/* <div className="">{d?.customer_id}</div> */}
            <div className="">{customer?.id}</div>
          </div>
          <div className="flex justify-between border-b gap-10">
            <div className="">SUBSCRIPTION_ID:</div>
            <div className="">{subscription?.id}</div>
          </div>
        </div>
      </div>
    </div>
  )
}