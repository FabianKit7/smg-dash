import Axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useClickOutside } from "react-click-outside-hook";
import { Spinner } from 'react-bootstrap'
import { TiTimes } from 'react-icons/ti'
import { searchAccount } from '../../helpers'

export default function SearchBox() {
  const [parentRef, isClickedOutside] = useClickOutside();
  const [loadingSpinner, setLoadingSpinner] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)
  const [input, setInput] = useState('')
  const [searchedAccounts, setSearchedAccounts] = useState([])
  const [selected, setSelected] = useState()
  const inputRef = useRef()

  useEffect(() => {
    if (isClickedOutside) {
      setShowResultModal(false)
    };
  }, [isClickedOutside]);

  const handleChange = async (query) => {
    setSearchedAccounts([]);
    setLoadingSpinner(true)
    const data = await searchAccount(query);
    const users = data?.users;
    if (users?.length > 0) {
      setSearchedAccounts(users)
      setShowResultModal(true)
    }
    setLoadingSpinner(false)
  }

  // useEffect(() => {
  //   const li = document.querySelectorAll('.accounts')
  //   for (let i = 0; i < li.length; i++) {
  //     var a = li[i].getElementsByTagName("p")[0];
  //     var txtValue = a.textContent || a.innerText;
  //     var x = txtValue.toLowerCase(), y = input.toLowerCase();
  //     // console.log('x,y', x,y);
  //     if (x.indexOf(y) > -1) {
  //       console.log('hello', li[i]);
  //       li[i].classList.add('flex')
  //       li[i].classList.remove('hidden')
  //     } else {
  //       li[i].classList.remove('flex')
  //       li[i].classList.add('hidden')
  //     }
  //   }
  // }, [input, loadingSpinner])
  

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
      window.location = `/subscriptions/${userResults.data[0].username}`;

    } else {
      alert('choose your account');
    }
  };

  return (<>
    <div className="flex flex-col items-center w-[320px] relative" ref={parentRef}>
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
        {searchedAccounts.map((data, index) => {
          return (<>
            <div
              key={index}
              className='accounts w-full flex items-center cursor-pointer hover:bg-[#02a1fd]/20'
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
                <p>{data.username}</p>
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
