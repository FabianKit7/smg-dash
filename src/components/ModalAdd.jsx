import { useState, useEffect } from 'react';
import { supabase } from "../supabaseClient";
import Modal from 'react-modal';
import { AsyncTypeahead } from "react-bootstrap-typeahead"
import { IoClose } from 'react-icons/io5';
import "../../src/modalsettings.css"
import { getAccount, searchAccount } from '../helpers';
import { Spinner } from 'react-bootstrap';
import { TiTimes } from 'react-icons/ti';
import { useRef } from 'react';

Modal.setAppElement('#root');

const ModalAdd = ({ from, modalIsOpen, setIsOpen, title, subtitle, extraSubtitle, userId, setAddSuccess, addSuccess }) => {
  const [loadingSpinner, setLoadingSpinner] = useState(false)
  const [selectAccountName, setSelectedAccountName] = useState("");
  const [searchAccounts, setSearchAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef()

    const add = async () => {
        if (selectAccountName) {
        setLoading(true);
        const theAccount = await getAccount(selectAccountName);
        const res = await supabase.from(from).insert({
          account: selectAccountName,
          followers: theAccount.data[0].follower_count,
          avatar: theAccount.data[0].profile_pic_url,
          user_id: userId,
        });
          res?.error && console.log(
          "🚀 ~ file: Whitelist.jsx:33 ~ const{error}=awaitsupabase.from ~ error",
          res.error
        );

      setSelectedAccountName("");
      setLoading(false);
      setAddSuccess(!addSuccess);
      setIsOpen(!modalIsOpen);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState(input)
  
  useEffect(() => {
    var i = debouncedQuery;
    if (debouncedQuery.startsWith('@')) {
      i = debouncedQuery.substring(1)
    }
    const timer = setTimeout(() => setInput(i), 1000);
    return () => clearTimeout(timer)
  }, [debouncedQuery]);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setLoadingSpinner(true);
    setDebouncedQuery(query)
  };

  useEffect(() => {
    const fetch = async () => {
      const data = await searchAccount(input);
      // console.log(data?.users);
      data?.users && setSearchAccounts(data?.users);
      setIsLoading(false);
      setLoadingSpinner(false);
    }
    fetch()
  }, [input])
  
  const filterBy = (user) => {
    var x = (user?.username)?.toLowerCase()
    var y = input?.toLowerCase()
    return x?.startsWith(y)
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      className="modal_add_content"
      overlayClassName="modal_add_overlay"
      contentLabel="Modal"
    >
      <div className="modal_form_wrapper relative">
        <div className="flex justify-end">
          <IoClose
            className="text-[30px] text-[#8c8c8c]"
            onClick={() => {
              setIsOpen(!modalIsOpen);
            }}
          />
        </div>
        <div className="grid grid-cols-1 justify-center items-center">
          <h1 className='font-bold text-black text-[40px] text-center pb-3 font-MADEOKINESANSPERSONALUSE'>{title}</h1>
          <p className='font-bold font-MontserratSemiBold text-[#333] text-sm text-center lg:px-[100px]'>{subtitle}</p>
          <div className="flex items-center justify-center w-full mt-4">
            <div className="relative w-full">
              <AsyncTypeahead
                filterBy={filterBy}
                id="async-example"
                isLoading={isLoading}
                ref={inputRef}
                labelKey="username"
                inputProps={
                  { className: 'w-full bg-inputbkgrd rounded py-[25px] font-semibold' }
                }
                className='w-full'
                placeholder="Search Account..."
                minLength={2}
                onSearch={handleSearch}
                onChange={(selected) => {
                  setSelectedAccountName(selected[0]?.username);
                }}
                options={searchAccounts}
                renderMenuItemChildren={(option) => (
                  <div className='min-w-[300px] flex items-center'>
                    <img
                      alt=''
                      src={option.profile_pic_url}
                      style={{
                        height: '40px',
                        marginRight: '10px',
                        width: '40px',
                        borderRadius: '99999px'
                      }}
                    />
                    <div className="">
                      <div>{option.username}</div>
                      <div className="opacity-40">{option.full_name}</div>
                    </div>
                  </div>
                )}
              />
              <div className="absolute right-5 top-[40%] translate-y-[-40%] flex items-center justify-center">
                <span className="absolute z-10">{loadingSpinner && (<Spinner animation="border" />)}</span>
                {/* {input && <TiTimes className='cursor-pointer' onClick={() => { setDebouncedQuery(''); inputRef.current.getInput().value=''; }} />} */}
              </div>
            </div>
            <button className='bg-black w-32 md:w-40 py-[25px] font-semibold rounded text-white'
              onClick={() => add()}
            >{loading ? "Loading..." : "Add"}</button>
          </div>
          <p className='font-bold font-MontserratSemiBold text-sm text-center lg:px-[120px] pt-8 pb-5'>{extraSubtitle}</p>
        </div>
      </div>
    </Modal>
  );
}

export default ModalAdd