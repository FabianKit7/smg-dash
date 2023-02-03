import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Blacklist from "./Blacklist";
import ChartSection from "./ChartSection";
import StatsCard from "./StatsCard";
import StatsSection from "./StatsSection";
import Targeting from "./Targeting";
import Whitelist from "./Whitelist";

const Error = ({ value }) => {
  return (
    <aside style={{ color: "red" }} className="px-3 py-4 px-sm-5">
      The account @{value} was not found on Instagram.
    </aside>
  );
};

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [FilterModal, setFilterModal] = useState(false);
  const [user, setUser] = useState(null)

  let { id } = useParams();

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return navigate("/login")
      setUser(user)
      // console.log(user);
      // console.log("🚀 ~ file: Dashboard.jsx:31 ~ getData ~ user", user)
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('user_id', user.id).order('created_at', { ascending: false })
      // console.log("🚀 ~ file: Dashboard.jsx:34 ~ getData ~ data", data)
      setData(data)
      setError(error)
    };

    getData();
  }, [id, navigate]);

  const [sessionsData, setSessionsData] = useState([])

  // console.log(userDefaultData?.[0]?.username);
  useEffect(() => {
    const fetch = async () => {
      const resData = await supabase
        .from('sessions')
        .select()
        .eq('username', data?.[0]?.username)
      resData.error && console.log(resData.error);
      const d = JSON.parse(resData.data[0].data)
      console.log(d);
      setSessionsData(d)
    }
    const username = data?.[0]?.username;
    if (username) {
      fetch()
    }
  }, [data])

  // console.log({data});

  const setFilterModalCallback = useCallback(() => {
    setFilterModal(false);
  }, [setFilterModal]);

  if (error) return <Error value={id} />;

  return (
    <div className="container mx-auto px-6">
      <StatsSection
        user={user}
        user_id={data?.[0]?.id}
        userId={data?.[0]?.user_id}
        username={data?.[0]?.username}
        avatar={data?.[0]?.profile_pic_url}
        isVerified={data?.[0]?.is_verified}
        name={data?.[0]?.full_name}
        bio={data?.[0]?.biography}
        url={`https://www.instagram.com/${data?.[0]?.username}`}
        currMediaCount={data?.[0]?.posts}
        currFollowers={data?.[0]?.followers}
        currFollowing={data?.[0]?.following}
        setFilterModal2={setFilterModalCallback}
        filterModal2={FilterModal}
      />
      <StatsCard userData={data?.[0]} sessionsData={sessionsData} />
      <ChartSection
        data={data}
        sessionsData={sessionsData}
        isPrivate={false}

      />
      <Targeting
        userId={id}
        avatar={data?.[0]?.profile_pic_url}
        username={data?.[0]?.username}
      />
      <Blacklist userId={id} />
      <Whitelist userId={id} />

    </div>
  );
}
