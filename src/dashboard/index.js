/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { supabase, supabaseAdmin } from "../supabaseClient";
import { FaTimes } from 'react-icons/fa'
import axios from 'axios';
import { useClickOutside } from 'react-click-outside-hook';
import copy from 'copy-to-clipboard';
import { updateUserProfilePicUrl } from '../helpers';

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
  return(<></>)
}

export const RefreshModal = ({ openRefreshModal, setOpenRefreshModal }) => {
  const [parentRef, isClickedOutside] = useClickOutside();
  const [message, setMessage] = useState('')
  const [profilePicture, setProfilePicture] = useState()
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')

  useEffect(() => {
    if (isClickedOutside) {
      setOpenRefreshModal(false)
    };
  }, [isClickedOutside, setOpenRefreshModal]);

  const handleRefresh = async () => {
    try {
      if (username) {
        setLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select('profile_pic_url, status, username, user_id')
          .eq('username', username)
        if (error) {
          setMessage(error.message)
          setLoading(false);
          return;
        }
        data.forEach(async data => {
          data?.profile_pic_url && setProfilePicture(data.profile_pic_url)

          if (data?.username) {
            const { ppu } = await updateUserProfilePicUrl(data)
            if (ppu) {
              setProfilePicture(ppu)
              setMessage('success');
            } else {
              setMessage('error');
            }
          } else {
            setMessage('error');
          }
        })
        setLoading(false);
      }
    } catch (error) {
      console.log("handleRefresh: ", error)
    }
  }

  return (
    <div className="fixed top-0 left-0 z-50 grid w-full h-screen place-items-center bg-black/70">
      <div className="bg-[#242424] pb-4 w-[300px] max-h-[80%] my-auto overflow-y-auto md:min-w-[400px] py-4 rounded-xl" ref={parentRef}>
        <div className="flex justify-between px-6 py-2 border-b">
          <div className="text-green-400">{message}</div>
          <FaTimes className='cursor-pointer' onClick={() => setOpenRefreshModal(false)} />
        </div>
        <div className="flex flex-col items-center gap-4 px-6 mt-4">
          <div className="w-[60px] h-[60px] rounded-full button-gradient2">
            <img src={profilePicture} className="w-full h-full rounded-full" alt="" />
          </div>
          <input type="text" className="p-3 bg-transparent border border-black rounded-lg w-52" placeholder='enter username' onChange={(e) => setUsername(e.target.value)} />
          <button onClick={() => { !loading && handleRefresh() }} className="w-[200px] py-2 mb-4 button-gradient text-white">{loading ? 'refreshing...' : 'refresh'}</button>
        </div>
      </div>
    </div>
  )
}

export const Chargebee = ({ k, user, setShowChargebee }) => {
  const [customer, setCustomer] = useState('')
  const [subscription, setsubscription] = useState()
  const [currentUser, setCurrentUser] = useState()
  const [parentRef, isClickedOutside] = useClickOutside();
  const [message, setMessage] = useState('')

  const baseUrl = 'https://sproutysocial-api.up.railway.app'
  // console.log(user);
  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabaseAdmin.auth.admin.getUserById(user.user_id)
      // console.log(data?.user);
      data?.user && setCurrentUser(data?.user)
      error && console.log(error)

      // console.log(currentUser?.email);
      if (user?.email) {
        let customer = await axios.post(`${baseUrl}/api/customer_list`,
          urlEncode({ email: user?.email }))
          .then((response) => response.data)
        // console.log(user?.email)
        // console.log(customer)
        setCustomer(customer)

        if (customer?.id) {
          let subscription = await axios.post(`${baseUrl}/api/subscription_list`,
            urlEncode({ customer_id: customer?.id }))
            .then((response) => response.data)
          // console.log(subscription)
          setsubscription(subscription)
        }
      }

    }
    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isClickedOutside) {
      setShowChargebee(false)
    };
  }, [isClickedOutside, setShowChargebee]);

  return (
    <div key={k} className="fixed top-0 left-0 z-50 grid w-full h-screen place-items-center bg-black/70">
      <div className="absolute text-green-400 top-3 right-3">{message}</div>
      <div className="bg-white w-[300px] md:w-[500px] min-h-[400px] max-h-[80%] my-auto overflow-y-auto md:min-w-[400px] py-4 rounded-xl" ref={parentRef}>
        <div className="flex justify-between px-6 py-2 border-b">
          <div className="text-lg font-bold">User Chargebee details</div>
          <FaTimes className='cursor-pointer' onClick={() => setShowChargebee(false)} />
        </div>
        <div className="flex flex-col gap-4 px-6 mt-4">
          <div className="flex flex-col justify-between gap-10 border-b md:flex-row">
            <div className="">USERNAME:</div>
            <div className="">{user?.username}</div>
          </div>
          <div className="flex flex-col justify-between gap-10 border-b md:flex-row">
            <div className="">ACCOUNT STATUS:</div>
            <div className="">{user?.status}</div>
          </div>
          <div className="flex flex-col justify-between gap-10 border-b md:flex-row">
            <div className="">SUBSCRIPTION STATUS:</div>
            <div className={`
            ${(subscription?.status === 'active' && subscription?.due_invoices_count === 0) && "text-green-600"} 
            ${(subscription?.status === 'active' && subscription?.due_invoices_count > 0) && "text-red-600"} 
            ${subscription?.status === 'in_trial' && "text-orange-600"} 
            ${subscription?.status === 'cancelled' && "text-red-600"} 
            font-semibold capitalize`}>{
                (subscription?.status === 'active' && subscription?.due_invoices_count > 0) ? 
                  `Invoice Due ( ${subscription?.due_invoices_count} )` : subscription?.status
            }</div>
          </div>
          <div className="flex flex-col justify-between gap-10 border-b md:flex-row">
            <div className="">NAME:</div>
            <div className="">{user?.full_name}</div>
          </div>
          <div className="flex flex-col justify-between gap-10 border-b md:flex-row">
            <div className="">EMAIL:</div>
            <div className="cursor-pointer" onClick={() => {
              copy(currentUser?.email, {
                debug: true,
                message: 'Press #{key} to copy',
              })
              setMessage('copied')
              setTimeout(() => {
                setMessage('')
              }, 1000);
            }}>{currentUser?.email}</div>
          </div>
          <div className="flex flex-col justify-between gap-10 border-b md:flex-row">
            <div className="">CUSTOMER_ID:</div>
            {/* <div className="">{d?.customer_id}</div> */}
            <div className="cursor-pointer" onClick={() => {
              copy(customer?.id, {
                debug: true,
                message: 'Press #{key} to copy',
              })
              setMessage('copied')
              setTimeout(() => {
                setMessage('')
              }, 1000);
            }}>{customer?.id}</div>
          </div>
          <div className="flex flex-col justify-between gap-10 border-b md:flex-row">
            <div className="">SUBSCRIPTION_ID:</div>
            <div className="cursor-pointer" onClick={() => {
              copy(subscription?.id, {
                debug: true,
                message: 'Press #{key} to copy',
              })
              setMessage('copied')
              setTimeout(() => {
                setMessage('')
              }, 1000);
            }}>{subscription?.id}</div>
          </div>
        </div>
      </div>
    </div>
  )
}