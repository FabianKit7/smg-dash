import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Blacklist from "./Blacklist";
import ChartSection from "./ChartSection";
import Nav from "./Nav";
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
  let { id } = useParams();
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [FilterModal, setFilterModal] = useState(false);
  const [user, setUser] = useState(null)
  const [sessionsData, setSessionsData] = useState([])

  !!!sessionsData && console.log(sessionsData)

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return navigate("/login")
      setUser(user)
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('user_id', user.id)

      if (user && !data[0]?.subscribed) {
        window.location.pathname = `subscriptions/${data[0].username}`;
      }
      setData(data[0])
      setError(error)
    };

    getData();
  }, [id, navigate]);

  // setSessionsData
  useEffect(() => {
    const fetch = async () => {
      const resData = await supabase
        .from('sessions')
        .select()
        .eq('username', data?.username)
      resData.error && console.log(resData.error);
      var d = resData.data[0].data
      try {
        const c = JSON.parse(resData.data[0].data);
        if (c) { d = c }
      } catch (error) {
        // console.log(error);
      }
      // console.log(d);
      setSessionsData(d)
    }
    const username = data?.username;
    if (username) {
      fetch()
    }
  }, [data])

  const setFilterModalCallback = useCallback(() => {
    setFilterModal(false);
  }, [setFilterModal]);

  if (error) return <Error value={id} />;

  return (<>
    <Nav />
    <div className="container mx-auto px-6">
      <StatsSection
        user={user}
        userData={data}
        user_id={data?.id}
        userId={data?.user_id}
        username={data?.username}
        avatar={data?.profile_pic_url}
        isVerified={data?.is_verified}
        name={data?.full_name}
        bio={data?.biography}
        url={`https://www.instagram.com/${data?.username}`}
        currMediaCount={data?.posts}
        currFollowers={data?.followers}
        currFollowing={data?.following}
        setFilterModal2={setFilterModalCallback}
        filterModal2={FilterModal}
      />
      <StatsCard userData={data} sessionsData={sessionsData} />
      <ChartSection
        sessionsData={sessionsData}
        isPrivate={false}
      />
      {data?.user_id && <>
        <Targeting userId={data?.user_id} />
        <Blacklist userId={data?.user_id} />
        <Whitelist userId={data?.user_id} />
      </>}

    </div>
  </>);
}
