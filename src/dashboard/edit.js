import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Blacklist from '../components/Blacklist';
import ModalNew from '../components/ModalNew';
import Targeting from '../components/Targeting';
import Whitelist from '../components/Whitelist';
import { supabase, supabaseAdmin } from '../supabaseClient';
import profileImg from "../images/profile.svg"
import settingsImg from "../images/settings.svg"
import { useCallback } from 'react';
import TargetingFilterModal from '../components/TargetingFilterModal';

const Error = ({ value }) => {
    return (
        <aside style={{ color: "red" }} className="px-3 py-4 px-sm-5">
            The account @{value} was not found on Instagram.
        </aside>
    );
};

export default function Edit() {
    let { id } = useParams();
    const navigate = useNavigate();
    // const [userAuth, setUserAuth] = useState(null)
    const [user, setUser] = useState(null)
    const [error, setError] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(false)
    const [filterModal, setFilterModal] = useState(false);

    const [followerMinValue, setFollowerMinValue] = useState(1);
    const [followerMaxValue, setFollowerMaxValue] = useState(20000);
    const [followingMinValue, setFollowingMinValue] = useState(1);
    const [followingMaxValue, setFollowingMaxValue] = useState(10000);
    const [mediaMinValue, setMediaMinValue] = useState(1);
    const [mediaMaxValue, setMediaMaxValue] = useState(1000);
    const [margic, setMargic] = useState(true);
    const [privacy, setPrivacy] = useState('All');
    const [gender, setGender] = useState('All');
    const [lang, setLang] = useState('All');

    useEffect(() => {
        const getData = async () => {
            // const { data: { userAuth }, error} = await supabaseAdmin.auth.admin.getUserById(id)
            // error && console.log(error);
            // // if (!userAuth) return navigate('/dashboard')
            // setUserAuth(userAuth)

            const { data, error } = await supabase
                .from('users')
                .select()
                .eq('user_id', id).order('created_at', { ascending: false })

            // console.log(data[0]);
            setUser(data[0])
            setError(error)
        };

        getData();
    }, [id, navigate]);

    const setFilterModalCallback = useCallback(() => {
        setFilterModal(!filterModal);
    }, [filterModal]);

    useEffect(() => {
        const fetch = async () => {
            const { data, error } = await supabase
                .from('users')
                .select()
                .eq('user_id', id).order('created_at', { ascending: false })

            setFollowerMinValue(data?.[0]?.targetingFilter.followersMin);
            setFollowerMaxValue(data?.[0]?.targetingFilter.followersMax);
            setFollowingMinValue(data?.[0]?.targetingFilter.followingMin);
            setFollowingMaxValue(data?.[0]?.targetingFilter.followingMax);
            setMediaMinValue(data?.[0]?.targetingFilter.mediaMin);
            setMediaMaxValue(data?.[0]?.targetingFilter.mediaMax);

            setMargic(data?.[0]?.targetingFilter.margicFilter || true);
            setPrivacy(data?.[0]?.targetingFilter.privacy || 'All');
            setGender(data?.[0]?.targetingFilter.gender || 'All');
            setLang(data?.[0]?.targetingFilter.lang || 'All');
            error && console.log(error);
        }
        if (id) {
            fetch();
        }
    }, [filterModal, id])

    if (error) return <Error value={id} />;
    return (
        <div className="max-w-[1400px] mx-auto bg-white">
            <div className="flex flex-col items-center w-full py-20">
                <ModalNew
                    modalIsOpen={modalIsOpen}
                    setIsOpen={setIsOpen}
                    avatar={user?.profile_pic_url}
                    user={user}
                    userId={id}
                    u="admin"
                />
                
                <TargetingFilterModal
                    show={filterModal}
                    onHide={() => setFilterModal(false)}
                    setFilterModal={setFilterModal}
                    filtermodal={filterModal}
                    user={user}
                    user_id={id}
                    followerMinValued={followerMinValue}
                    followerMaxValued={followerMaxValue}
                    followingMinValued={followingMinValue}
                    followingMaxValued={followingMaxValue}
                    mediaMinValued={mediaMinValue}
                    mediaMaxValued={mediaMaxValue}
                    margicd={margic}
                    privacyd={privacy}
                    genderd={gender}
                    langd={lang}
                />
                <div className="flex items-center gap-4">
                    <img className="bg-[#D9D9D9] p-3 rounded-[4px]" src={profileImg} alt="" onClick={() => { setIsOpen(!modalIsOpen) }} />
                    <img className="bg-[#D9D9D9] p-3 rounded-[4px]" src={settingsImg} alt="" onClick={setFilterModalCallback} />
                </div>
                <Targeting
                    userId={id} page={'admin'}
                />
                <Blacklist userId={id} page={'admin'} />
                <Whitelist userId={id} page={'admin'} />
            </div>
        </div>
    )
}
