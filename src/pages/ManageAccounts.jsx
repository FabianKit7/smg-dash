import React, { useEffect, useState } from "react";
import { BsClock } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import Nav from "../components/Nav";
import { supabase } from "../supabaseClient";
import { AiOutlinePlus } from "react-icons/ai";
import { numFormatter } from "../helpers";
import { FaUserCog } from "react-icons/fa";
import ModalNew from "../components/ModalNew";

export default function ManageAccounts() {
    let { username } = useParams();
    const currentUsername = username
    const navigate = useNavigate()
    const [accounts, setAccounts] = useState([])
    const [showSettingsModal, setShowSettingsModal] = useState(false)
    const [accountToSet, setAccountToSet] = useState()
    const [refreshUser, setRefreshUser] = useState(false)

    useEffect(() => {
        const getData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return navigate("/login")
            const getAllAccounts = await supabase.from('users').select().eq('email', user.email)
            setAccounts(getAllAccounts?.data)
        };

        getData();
    }, [currentUsername, navigate, refreshUser]);

    return (
        <>
            <ModalNew
                show={showSettingsModal}
                onHide={() => setShowSettingsModal(false)}
                modalIsOpen={showSettingsModal}
                setIsOpen={setShowSettingsModal}
                user={accountToSet}
                u={'user'}
                setRefreshUser={setRefreshUser}
            />
            
            <div className="max-w-[1400px] mx-auto">
                <Nav />

                <div className="mt-4">
                    <div
                        className="flex justify-between items-center rounded-[10px] h-[84px] px-5 md:px-[30px] mb-10"
                        style={{
                            boxShadow: '0 0 3px #00000040',
                        }}
                    >
                        <h1 className="font-black font-MontserratBold text-[18px] md:text-[26px] text-black">Select an account</h1>

                        <div className="flex items-center gap-2 text-base">
                            <BsClock size={32} className="w-[32px] h-[32px]" />
                            <h3>Stats shown for last 30 days</h3>
                        </div>
                    </div>
                </div>

                <div className="relative grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 auto-rows-fr lg:gap-x-5 lg:gap-y-10 m-5 mt-0 items-center">
                    {accounts.map(account => {
                        return (
                            <Link to={"/dashboard/" + account?.username} key={"manage_" + account.username} className="items-center w-full lg:w-[384px] relative rounded-[10px] p-[24px] pb-0 lg:p-[26px] lg:min-h-full flex flex-col justify-between overflow-hidden shadow-[0_0_3px_#00000040] bg-white text-black">
                                <div className="flex lg:flex-col w-full">
                                    <div className="hidden lg:flex justify-center items-center gap-2">
                                        <img src="/icons/instagram.svg" alt="ig" className="w-[20px] h-[20px] rounded-full" />
                                        <div className="text-[18px] font-bold">Instagram Account</div>
                                    </div>
                                    
                                    <div className="flex justify-between lg:justify-center items-center w-full">
                                        <div className="flex items-center lg:flex-col gap-[14px]">
                                            <div className="relative w-[54px] h-[54px] lg:w-[160px] lg:h-[160px] lg:mt-10 lg:mx-auto">
                                                <img src={account?.profile_pic_url} alt="" className="w-full h-full rounded-full p-[3px]" />
                                                <div className="w-[20px] h-[20px] lg:w-[36px] lg:h-[36px] rounded-full border-[3px] lg:border-4 absolute right-0 bottom-0 lg:right-1 lg:bottom-1 bg-[#23df85]"></div>
                                            </div>
                                            <div className="lg:text-center">
                                                <div className="lg:hidden flex justify-center items-center gap-2">
                                                    <img src="/icons/instagram.svg" alt="ig" className="w-[20px] h-[20px] rounded-full" />
                                                    <div className="text-[12px] lg:text-[18px] font-bold">Instagram Account</div>
                                                </div>
                                                <div className="lg:mt-5 text-[16px] lg:text-[24px] font-bold">{account?.full_name}</div>
                                                <div className="text-[#1B89FF] text-[12px] lg:text-[18px] leading-[0.8] font-bold">@{account?.username}</div>
                                            </div>
                                        </div>
                                        <div className="lg:hidden w-[32px] h-[32px] rounded-lg bg-[#1B89FF] grid place-items-center cursor-pointer" onClick={() => {
                                            setAccountToSet(account)
                                            setShowSettingsModal(true);
                                        }}>
                                            <FaUserCog size={20} className="w-[19px] h-[19px] fill-white"/>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 flex justify-between items-center text-center w-full">
                                    <div className="">
                                        <div className="text-[14px] lg:text-[16px]">Followers</div>
                                        <div className="pb-1 text-[24px] lg:text-[32px] font-bold leading-[0.8]">{numFormatter(account.followers)}</div>
                                    </div>
                                    <div className="w-[2px] h-[47px] border bg-[#c4c4c4]"></div>
                                    <div className="">
                                        <div className="text-[14px] lg:text-[16px]">Following</div>
                                    </div>
                                    <div className="w-[2px] h-[47px] border bg-[#c4c4c4]"></div>
                                    <div className="">
                                        <div className="text-[14px] lg:text-[16px]">Interactions</div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                    
                    <Link to={"/search/?username=add_account"} className="items-center w-full lg:w-[384px] h-full relative rounded-[10px] p-[26px] min-h-full flex flex-col justify-center overflow-hidden shadow-[0_0_3px_#00000040] bg-white text-black">
                        <div className="relative w-[80px] h-[80px] lg:w-[160px] lg:h-[160px] mx-auto">
                            <div className="w-full h-full rounded-full bg-black text-white grid place-items-center">
                                <AiOutlinePlus size={50} className="w-[24px] h-[24px] lg:w-[50px] lg:h-[50px]" />
                            </div>
                            <div className="w-[20px] h-[20px] lg:w-[36px] lg:h-[36px] rounded-full border-2 lg:border-4 absolute right-0 bottom-0 lg:right-1 lg:bottom-1 bg-[#23df85]"></div>
                        </div>
                        <div className="mt-2 lg:mt-[32px] text-[16px] lg:text-[24px] font-bold text-center">Add Account</div>
                    </Link>
                </div>

            </div>
        </>
    );
}
