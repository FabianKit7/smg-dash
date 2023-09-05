import Axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useClickOutside } from "react-click-outside-hook";

import { Spinner } from 'react-bootstrap'
import { TiTimes } from 'react-icons/ti'
import { FaUser } from 'react-icons/fa'
import { getRefCode, searchAccount } from '../../helpers'
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../AlertModal';

export default function SearchBox() {
  const [parentRef, isClickedOutside] = useClickOutside();
  const [loadingSpinner, setLoadingSpinner] = useState(false)
  const [processing, setProcessing] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false)
  const [input, setInput] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState(input)
  const [searchedAccounts, setSearchedAccounts] = useState([])
  const [selected, setSelected] = useState()
  const [errorMsg, setErrorMsg] = useState({ title: 'Alert', message: 'something went wrong' })
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef()
  const navigate = useNavigate();

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

  const handleSubmit = async () => {
    var filteredSelected = selected;
    if (filteredSelected?.startsWith('@')) {
      filteredSelected = filteredSelected?.substring(1)
    }
    if (selected) {
      setProcessing(true);
      const params = { ig: filteredSelected, response_type: "short", corsEnabled: "false", storageEnabled: "true" };
      // const params = { ig: filteredSelected, response_type: "short", corsEnabled: "false" };
      const options = {
        method: "GET",
        url: "https://instagram-bulk-profile-scrapper.p.rapidapi.com/clients/api/ig/ig_profile",
        params,
        headers: {
          "X-RapidAPI-Key": X_RAPID_API_KEY,
          "X-RapidAPI-Host": X_RAPID_API_HOST,
        },
      };
      // console.log(options);
      const userResults = await Axios.request(options).catch(e => {
        setIsModalOpen(true);
        setErrorMsg({ title: 'Alert', message: 'Username not found!' })
      });
      console.log(userResults?.data[0]?.username);
      if (!userResults?.data[0]?.username) {
        // alert('Username not found!');
        setIsModalOpen(true);
        setErrorMsg({ title: 'Alert', message: 'Username not found!' })
        return
      }
      const { data: { user } } = await supabase.auth.getUser()

      const updateUsername = await supabase
        .from("users")
        .update({
          username: userResults.data[0].username,
        }).eq('user_id', user.id);
        
      if (updateUsername?.error){
        alert("")
      }
      // window.location = `/subscriptions/${userResults.data[0].username}`;
      const ref = getRefCode()
      if (ref) {
        navigate(`/subscriptions/${userResults.data[0].username}?ref=${ref}`)
        return
      } else {
        navigate(`/subscriptions/${userResults.data[0].username}`)
      }
      setProcessing(false);
      return;
    } else {
      setProcessing(false);
      alert('choose your account');
    }
    setProcessing(false);
  };

  return (<>
    <AlertModal
      isOpen={isModalOpen}
      onClose={() => { setIsModalOpen(false) }}
      title={errorMsg?.title}
      message={errorMsg?.message}
    />
    
    <div className="flex flex-col items-center w-[320px] relative" ref={parentRef}>
      <div className="flex items-center border rounded-md shadow-md w-full py-3 px-4">
        <input
          type="text"
          className="w-full outline-none"
          placeholder="@username"
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
          <span className="absolute z-10">{loadingSpinner && (<>
            <Spinner animation="border" />
          </>)}</span>
          {input && <TiTimes className='cursor-pointer' onClick={() => { setDebouncedQuery('') }} />}
        </div>
      </div>

      {showResultModal && !processing && <div className="absolute top-[60px] z-50 w-full h-[300px] overflow-auto shadow-md border rounded-md bg-white py-3 px-4 flex flex-col gap-4">
        {/* {showResultModal && debouncedQuery && !processing && <div className="absolute top-[60px] z-50 w-full h-fit overflow-auto shadow-md border rounded-md bg-white py-3 px-4 flex flex-col gap-4"> */}
        {debouncedQuery && <div className="flex items-center gap-2 border-b pb-2 cursor-pointer"
          onClick={() => {
            setSelected(debouncedQuery);
            // setInput(debouncedQuery)
            setLoadingSpinner(false)
            setShowResultModal(false);
          }}
        >
          <div className="p-3 rounded-full bg-black">
            <FaUser size={14} color="white" />
          </div>
          <div className="">
            <div className="">{debouncedQuery}</div>
            <div className="mt-1 opacity-40 text-[.9rem]">click here to open account profile</div>
          </div>
        </div>}
        {searchedAccounts.map((data, index) => {
          return (<>
            <div
              key={index}
              className='accounts w-full flex items-center cursor-pointer hover:bg-[#02a1fd]/20'
              onClick={() => {
                setDebouncedQuery(data?.username)
                setSelected(data?.username);
                // setInput(data?.username)
                setLoadingSpinner(false)
                setShowResultModal(false);
              }}
            >
              <img
                alt=''
                src={data.profile_pic_url}
                style={{
                  height: '40px',
                  marginRight: '10px',
                  width: '40px',
                  borderRadius: '9999px'
                }}
              />
              <div className="flex flex-col" id={data.username}>
                <p>{data.username}</p>
                <span className="opacity-40">{data.full_name}</span>
              </div>
            </div>
          </>)
        })}
      </div>}

      <button className={`button-gradient2 mt-4 w-80 py-[15px] rounded-[5px] text-[1.125rem] font-semibold text-white ${processing && 'cursor-wait bg-[#ffa58e]'}`}
        style={{
          boxShadow: '0 20px 30px -12px rgb(255 132 102 / 47%)'
        }}
        onClick={() => { !processing && handleSubmit() }}
      >{processing ? <span className="animate-pulse">Processing your account…</span> : 'Select Account'}</button>
    </div>
  </>)
}
