import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteUserDetails } from "../helpers";
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
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('user_id', user.id).order('created_at', { ascending: false })
      if(user && !data[0].username){
        // console.log(data[0].username)
        const { data: user, error } = await supabase.auth.api.deleteUser(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoZWdwcHZscXJvdG5wZWpzaXljIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3Mjc2MzMzMywiZXhwIjoxOTg4MzM5MzMzfQ.3c2HtQvnQ8F8m5viFZWFS04hYYDUog0Lvl10YIvdY6A'
        )
        if(error) alert(error)
        if(user){
          await deleteUserDetails(user.id)
        }
        alert('Please re-register your account')
        await supabase.auth.signOut();
        window.location.pathname = "/login";
      }
      setData(data[0])
      setError(error)
    };

    getData();
  }, [id, navigate]);

  const [sessionsData, setSessionsData] = useState([])

  // console.log(userDefaultdata?.username);
  // sessions
  useEffect(() => {
    const fetch = async () => {
      const resData = await supabase
        .from('sessions')
        .select()
        .eq('username', data?.username)
      resData.error && console.log(resData.error);
      const d = JSON.parse(resData.data[0].data)
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

  return (
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
      <Targeting
        userId={id}
        avatar={data?.profile_pic_url}
        username={data?.username}
      />
      <Blacklist userId={id} />
      <Whitelist userId={id} />

    </div>
  );
}
