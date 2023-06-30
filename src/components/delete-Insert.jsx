import Axios from 'axios';
import React from 'react'
import { supabase } from '../supabaseClient';

export default function Insert() {

  const getStartingDay = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + "/" + dd + "/" + yyyy;

    return today
  };


  const insert = async () => {
    const { error } = await supabase
      .from("users")
      .insert({ full_name: "kasper", user_id: "5b6330ed-6d91-44e6-9120-38c5ef5c88b0" });
    console.log("🚀 ~ file: insert.jsx:23 ~ insert ~ error", error)

    const options = {
      method: "GET",
      url: "https://instagram-bulk-profile-scrapper.p.rapidapi.com/clients/api/ig/ig_profile",
      params: { ig: "leomessi", response_type: "short", corsEnabled: "true" },
      headers: {
        "X-RapidAPI-Key": "47e2a82623msh562f6553fe3aae6p10b5f4jsn431fcca8b82e",
        "X-RapidAPI-Host": "instagram-bulk-profile-scrapper.p.rapidapi.com",
      },
    };

    const userResults = await Axios.request(options);
    console.log("🚀 ~ file: subscriptions.jsx:44 ~ handelOnClick ~ userResults", userResults)

    if (userResults.data[0].name === "INVALID_USERNAME") return alert("error");
    const { data: { user } } = await supabase.auth.getUser()
    console.log("🚀 ~ file: subscriptions.jsx:46 ~ handelOnClick ~ user", user)

    const data = await supabase
      .from("users")
      .update({
        username: "leomessi",
        followers: userResults?.data[0].follower_count,
        following: userResults?.data[0].following_count,
        profile_pic_url: userResults?.data[0]?.profile_pic_url,
        is_verified: userResults?.data[0]?.is_verified,
        biography: userResults?.data[0]?.biography,
        start_time: getStartingDay(),
        posts: userResults?.data[0].media_count
      }).eq("user_id", user.id)
      .eq('first_account', true)
    console.log("🚀 ~ file: subscriptions.jsx:52 ~ handelOnClick ~ data", data)

  }

  return (
    <div>
      <button onClick={() => insert()} >
        insert
      </button>
    </div>
  )
}
