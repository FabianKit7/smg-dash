import Axios from 'axios'
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Nav from "../Nav";

export default function Admin() {
  const [files, setFiles] = useState([]);
  const [username, setUsername] = useState('')
  const [Loading, setLoading] = useState(false);
  const [reading, setReading] = useState(false)

  const handleChange = e => {
    setReading(true)
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = e => {
      // console.log("e.target.result", e.target.result);
      const data = JSON.parse(e.target.result)
      setUsername(data[0].args.username);
      setFiles(e.target.result);
    };
    setReading(false)
  };

  const handleUploadSessionFile = async () => {
    setLoading(true);
    // console.log(files);
    // await files.reduce(async (ref, data) => {
    //   await ref;
    //   const { error } = await supabase
    //     .from("sessions")
    //     .upsert({
    //       username: data.args.username,
    //       start_time: data.start_time,
    //       finish_time: data.finish_time,
    //       total_interactions: data.total_interactions,
    //       successful_interactions: data.successful_interactions,
    //       total_followed: data.total_followed,
    //       total_likes: data.total_likes,
    //       total_comments: data.total_comments,
    //       total_pm: data.total_pm,
    //       total_watched: data.total_watched,
    //       total_unfollowed: data.total_unfollowed,
    //       total_scraped: data.total_scraped,
    //       profile: data.profile
    //     })
    //   error && console.log(error)
    // }, Promise.resolve());

    const { error } = await supabase
      .from("sessions")
      .upsert({
        username: username,
        data: files
      })
    error && console.log(error);

    alert('Upload successfull!');
    document.getElementById('input').value = '';
    setFiles([])
    setLoading(false);
  }
  
  const updateUser = async (user) => {
    if (user?.username) {
      // const params = { ig: user?.username, response_type: "short", corsEnabled: "false", storageEnabled: "true" };
      const params = { ig: user?.username, response_type: "short", corsEnabled: "false" };
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
      // console.log(userResults?.data[0]?.username);
      if (!userResults?.data[0]?.username) return console.log('User account not found!: ', user?.username, ' =>: ', userResults?.data[0]?.username);
      await supabase
        .from("users")
        .update({
          profile_pic_url: userResults.data[0].profile_pic_url,
        }).eq('user_id', user?.user_id);

      console.log('fixed for: ', user?.username)
    }
  }

  const update = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('profile_pic_url, status, username, user_id')
      .eq('username', 'dev_cent')

    error && console.log(error);
    if (error) return;

    console.log(data[0]);

    updateUser(data[0])

    // const { data, error } = await supabase
    //   .from('users')
    //   .select('profile_pic_url, status, username, user_id')
    //   .neq('status', 'pending')

    // error && console.log(error);
    // if (error) return;

    // data.forEach(async (user) => {
    //   user && updateUser(user)
    // })

    setLoading(false);
  }


  return (<>
    <Nav />
    <div className="hidden h-screen delete-grid place-items-center -mt-10">
      <div>
        <h1 className="mb-5">Upload session file (Json)</h1>

        <div className="flex items-center gap-5">
          <input type="file" id="input" onChange={handleChange} />
          {reading && (<Spinner animation="border" />)}
        </div>

        <button className={`${files.length > 0 ? 'bg-secondaryblue' : 'bg-gray-600'} w-full mt-10 rounded-[10px] py-4 text-base text-white font-bold`}
          onClick={handleUploadSessionFile}
        >
          {Loading ? "Loading " : "Upload"}
        </button>
      </div>
    </div>


    <button className={`${!Loading ? 'bg-secondaryblue' : 'bg-gray-600'} w-full mt-10 rounded-[10px] py-4 text-base text-white font-bold`}
      onClick={update}
    >
      {Loading ? "updating " : "update"}
    </button>
  </>);
}
