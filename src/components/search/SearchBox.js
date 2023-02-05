import Axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { TiTimes } from 'react-icons/ti'
import { searchAccount } from '../../helpers'

export default function SearchBox() {
  const [loadingSpinner, setLoadingSpinner] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)
  const [input, setInput] = useState('')
  const [searchedAccounts, setSearchedAccounts] = useState([])
  const [selected, setSelected] = useState()
  const inputRef = useRef()

  // useEffect(() => {
  //   setTimeout(async () => {
  //     setLoadingSpinner(true)
  //     // console.log(input);
  //     const data = await searchAccount(input);
  //     const users = data?.users;
  //     if (users.length > 0) {
  //       setSearchedAccounts(users)
  //       setShowResultModal(true)
  //     }
  //     setLoadingSpinner(false)
  //   }, 0);
  // }, [input])

  const handleChange = async (query) => {
    setSearchedAccounts([]);
    // if (!query) {
    //   return;
    // }
    setLoadingSpinner(true)
    const data = await searchAccount(query);
    const users = data?.users;
    if (users?.length > 0) {
      // console.log("Original Array: ");
      // console.log(users);

      // let reversed_array = [];
      // for (let i = users.length - 1; i >= 0; i--) {
      //   reversed_array.push(users[i]);
      // }

      // console.log("Reversed Array: ");
      // console.log(reversed_array);
      // setSearchedAccounts(reversed_array)

      const obj = users.find(item => item.username === query);
      console.log(obj);
      const el = document.getElementById(obj?.username);
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "center"
        });
      }

      setSearchedAccounts(users)
      setShowResultModal(true)
    }
    setLoadingSpinner(false)

  }

  const handleSubmit = async () => {
    if (selected) {
      const params = { ig: selected, response_type: "short", corsEnabled: "false" };
      const options = {
        method: "GET",
        url: "https://instagram-bulk-profile-scrapper.p.rapidapi.com/clients/api/ig/ig_profile",
        params,
        headers: {
          "X-RapidAPI-Key": "47e2a82623msh562f6553fe3aae6p10b5f4jsn431fcca8b82e",
          "X-RapidAPI-Host": "instagram-bulk-profile-scrapper.p.rapidapi.com",
        },
      };
      const userResults = await Axios.request(options);
      console.log(userResults.data[0].username);
      // if (!userResults.data[0].username) return setError(true);
      // window.location = `/subscriptions/${userResults.data[0].username}`;

    } else {
      alert('choose your account');
    }
  };

  return (<>
    <div className="flex flex-col items-center w-[320px] relative">
      <div className="flex items-center border rounded-md shadow-md w-full py-3 px-4">
        <input
          type="text"
          className="w-full outline-none"
          placeholder="@username"
          value={input}
          ref={inputRef}
          onChange={(e) => {
            handleChange(e.target.value);
            setInput(e.target.value)
          }}
          onFocus={(e) => {
            // handleChange(e.target.value);
            // setInput(e.target.value)
            setShowResultModal(true)
          }}
        />
        <div className="relative flex items-center justify-center">
          <span className="absolute z-10">{loadingSpinner && (<Spinner animation="border" />)}</span>
          {input && <TiTimes className='cursor-pointer' onClick={() => { setInput('') }} />}
        </div>
      </div>

      {showResultModal && <div className="absolute top-[60px] z-50 w-full h-[300px] overflow-auto shadow-md border rounded-md bg-white py-3 px-4 flex flex-col gap-4">
        <div className="absolute -top-1 -left-1">
          <TiTimes className='cursor-pointer' onClick={() => { setShowResultModal(false) }} size={25} />
        </div>
        {searchedAccounts.map((data) => {
          return (<>
            <div
              key={data?.username}
              className='w-full flex items-center cursor-pointer hover:bg-[#02a1fd]/20'
              onClick={() => {
                setSelected(data?.username);
                setInput(data?.username)
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
                <span>{data.username}</span>
                <span className="opacity-40">{data.full_name}</span>
              </div>
            </div>
          </>)
        })}
      </div>}

      <button className='bg-black w-32 mt-4 md:w-40 py-[15px] rounded-lg font-semibold text-white'
        onClick={() => handleSubmit()}
      >Select Account</button>
    </div>
  </>)
}
