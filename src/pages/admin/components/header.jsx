import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RefreshModal } from '../../../dashboard'
import { supabase } from '../../../supabaseClient'

export default function Header({ setUsers, searchTerm, setSearchTerm, setLoading }) {
    const navigate = useNavigate()
    const [openRefreshModal, setOpenRefreshModal] = useState(false)

    const hangleSearch = async () => {
        var searchString = searchTerm
        if (!searchString) return;
        setLoading(true)
        var column;
        if (searchString.startsWith("@")){
            column = 'username'
            searchString = searchTerm.substring(1);
        } else if (searchString.includes("@")){
            column = 'email'
        }else {
            column = 'customer_id'
        }
        
        const res = await supabase
            .from('users')
            .select()
            .like(column, `%${searchString}%`)

        // error && console.log(error);
        res.error && console.log(res.error);
        // if(error) return;
        if (res.error) return;
        
        setUsers([]);
        setTimeout(() => {
            setUsers(res?.data);
            setLoading(false)
        }, 500);
    }

    return (
        <div className="">
            {openRefreshModal && <RefreshModal openRefreshModal={openRefreshModal} setOpenRefreshModal={setOpenRefreshModal} />}

            <nav className="flex items-center justify-between">
                <Link to={"/"} className="navbar-brand" href="#">
                    <div className=" text-[20px] md:text-[25px]">
                        <img alt="" className="md:hidden w-[36px] h-[36px]" src="/logo.png" />
                        <div className="items-center hidden gap-2 md:flex">
                            <img src="/logo.png" alt="" className="w-[38px] h-[34.26px]" />
                            <b className="text-[32px]">SocialMediaGains</b>
                        </div>
                    </div>
                </Link>

                <div className="flex justify-end items-center text-[18px] font-semibold  tracking-[-0.36px]">
                    <button className="rounded-[10px] bg-black-r text-white-r bg-[#d6b8a8] text-white w-[203px] h-[59px] ml-5" onClick={() => navigate('/upload-session')}>Upload Session</button>

                    <button className="rounded-[10px] bg-black-r text-white-r bg-[#d6b8a8] text-white w-[203px] h-[59px] ml-5" onClick={() => setOpenRefreshModal(!openRefreshModal)}>Refresh Account</button>
                    <button className="rounded-[10px] bg-black-r text-white-r bg-[#d6b8a8] text-white w-[203px] h-[59px] ml-5" onClick={async () => {
                        await supabase.auth.signOut();
                        window.onbeforeunload = function () {
                            localStorage.clear();
                        }
                        window.location.pathname = "/search";
                    }}>Log Out</button>
                </div>
            </nav>

            <form className="h-[82px] w-full rounded-[10px] border shadow-[0px_0px_5px_0px_#E7E7E7] flex items-center px-[28px] py-[23px] mt-[22px]" onSubmit={(e) => { e.preventDefault(); hangleSearch() }}>
                <button type='submit' className="w-[40px] h-[40px] grid place-items-center rounded-[10px] bg-black">
                    <img src="/icons/user-search.svg" alt="" className="w-[24px] h-[24px]" />
                </button>
                <input
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value) }}
                    type="search" className="placeholder-[#C4C4C4] bg-transparent text-white outline-none border-none ml-5 w-full" placeholder='Search by @account, email or CB Customer ID' />
            </form>
        </div>
    )
}
