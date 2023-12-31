import React, { useEffect, useState } from 'react'
import Header from './components/header'
import { Chargebee } from '../../dashboard'
import { supabase } from '../../supabaseClient'
import { Link, useNavigate } from 'react-router-dom'
import { countDays } from '../../helpers'
import copy from 'copy-to-clipboard';
import { ChangeStatusModal, calculateLast7DaysGrowth, statuses } from './ManagePage'
import { useTranslation } from 'react-i18next'

export default function Retention() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [fetchingUser, setFetchingUser] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sectionName, setSectionName] = useState('active')
  const [sectionTotal, setSectionTotal] = useState(0)
  const [selectedUser, setSelectedUser] = useState()
  const [showChargebee, setShowChargebee] = useState(false)
  const [users, setUsers] = useState([])
  const [refreshUsers, setRefreshUsers] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ sectionName: '', value: '' })

  // verity user
  useEffect(() => {
    const getData = async () => {
      const authUserRes = await supabase.auth.getUser()
      // console.log(authUserRes?.error);
      if (authUserRes?.error) return navigate("/search")
      const authUser = authUserRes?.data?.user
      const getSuperUser = await supabase.from('users').select().eq("email", authUser.email)
      const superUserFirstAccount = getSuperUser?.data?.find(user => user.first_account)
      if (!superUserFirstAccount || !superUserFirstAccount?.admin) return navigate("/search")
      setFetchingUser(false)
    };

    getData();
  }, [navigate]);

  useEffect(() => {
    const fetch = async () => {
      if (!sectionName) return;
      setLoading(true)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq("status", sectionName.toLocaleLowerCase())
        .limit(3000)
      error && console.log(error);
      if (error) return;

      setUsers([]);
      setSectionTotal(0)
      setTimeout(() => {
        setUsers(data);
        setSectionTotal(data?.length)
        setLoading(false)
      }, 500);
    }
    fetch()
  }, [sectionName, refreshUsers])

  useEffect(() => {
    if (users.length > 0) {
      users.forEach(async user => {
        const resData = await supabase
          .from('sessions')
          .select()
          .eq('username', user?.username)
        resData.error && console.log(resData.error);
        var d = resData?.data?.[0]?.data
        // console.log(d);
        const growthDifference = calculateLast7DaysGrowth(d)
        // console.log(growthDifference);
        var v;
        if (growthDifference) {
          v = `
          <div class="${growthDifference > 0 ? "text-[#dbc8be]" : `${parseInt(growthDifference) === 0 ? "text-[#000]" : "text-[#E9C81B]"}`} font-black">${growthDifference}</div>
          `
        } else {
          v = `
          <div class="font-black">N/A</div>
          `
        }
        document.getElementById(`last_7_days_growth_${user?.username}`).innerHTML = v
      })
    }
  }, [users])

  if (fetchingUser) {
    return (<>
      Loading...
    </>)
  }

  return (
    <div className=" max-w-[1600px] mx-auto">
      {showChargebee && <Chargebee k={selectedUser?.id} user={selectedUser} setShowChargebee={setShowChargebee} />}
      <Header
        setUsers={setUsers}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setLoading={setLoading}
      />

      <div className="mt-[30px] h-[82px] w-full rounded-[10px] border shadow-[0px_0px_5px_0px_#E7E7E7] px-5 flex items-center gap-2">
        {statuses.map(status => {
          return (
            <div key={`retention_page-${status}`} className="h-[59px] rounded-[10px] bg-[#DBC8BE] text-[25px] font-bold  text-black-r px-4 flex justify-center items-center relative">
              <div className="flex items-center justify-center capitalize cursor-pointer select-none" onClick={() => { setSectionName(status) }}>{status}
                {status === sectionName && <span className="px-[15px] h-[37px] rounded-[10px] text-center text-white button-gradient select-none ml-5">{sectionTotal}</span>}
              </div>
            </div>
          )
        })}
      </div>

      {loading && <div className="flex items-center justify-center">
        <img src="/logo.png" alt="Loading" className="w-10 h-10 animate-spin" />
      </div>}

      <table className="mt-[30px] w-full table-auto border-separate border-spacing-y-2">
        <thead>
          <tr>
            <th></th>
            <th>Account</th>
            <th>Email</th>
            <th>Followers</th>
            <th>Following</th>
            <th>Last 7 Days Growth</th>
            <th>Updated</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => {
            if (!user) {
              return ("Loading")
            }

            return (
              <tr key={`${user?.username}_row`} className='rounded-[10px] bg-[#DBC8BE] text-white h-[64px] w-full'>
                <td>
                  <img src={user?.profile_pic_url} alt="" className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-full bg-black ml-4" />
                </td>
                <td>
                  <div className="relative cursor-pointer max-w-[180px] break-words" onClick={() => {
                    copy(user?.username, {
                      debug: true,
                      message: 'Press #{key} to copy',
                    })
                    setMessage({ sectionName: `username-${user?.username}`, value: 'copied' })
                    setTimeout(() => {
                      setMessage({ sectionName: '', value: '' })
                    }, 1000);
                  }}>@{user?.username}
                    {message.sectionName === `username-${user?.username}` && <div className="absolute font-bold text-black-r">{message.value}</div>}
                  </div>
                </td>
                <td>
                  <div className="max-w-[200px] break-words">
                    <a href={`mailto:${user?.email}`} className="">{user?.email}</a>
                  </div>
                </td>
                <td>{user?.followers}</td>
                <td>{user?.following}</td>
                <td>
                  <div id={`last_7_days_growth_${user?.username}`}>N/A
                  </div>
                </td>
                <td>{user?.session_updated_at ? countDays(user?.session_updated_at, t) : "N/A"}</td>
                <td>
                  <div className="w-[35px] h-[35px] grid place-items-center rounded-[10px] bg-black cursor-pointer" onClick={() => {
                    setSelectedUser(user)
                    setShowChargebee(true)
                  }}>
                    <img src="/icons/monetization.svg" alt="" className="w-[18px] h-[18px]" />
                  </div>
                </td>
                <td>
                  <Link to={`/dashboard/${user?.username}?uuid=${user?.user_id}`} target='_blank' className="w-[35px] h-[35px] grid place-items-center rounded-[10px] bg-black">
                    <img src="/icons/user-settings.svg" alt="" className="w-[18px] h-[18px]" />
                  </Link>
                </td>
                <td>
                  <div className="relative w-full">
                    <ChangeStatusModal user={user} refreshUsers={refreshUsers} setRefreshUsers={setRefreshUsers} />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
