import axios from "axios";
import React, { useState } from "react";
import { Spinner } from "react-bootstrap";
import { updateUserProfilePicUrl } from "../../helpers";
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
    if (!username) return setLoading(false);
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

  const updateSub = async () => {
    setLoading(true);

    const manulaFrom = 'targeting';
    const { data, error } = await supabase
      .from(manulaFrom)
      .select('*')
      .limit(100)
      .eq("imageUrlChanged", false)
      console.log(data);

    error && console.log(error);
    if (error) return;
    
    var count = 0
    console.log('initial: ', count);

    await data.reduce(async (ref, user) => {
      await ref;
      await new Promise(resolve => setTimeout(resolve, 500));
      user?.account && await updateUserProfilePicUrl(user, manulaFrom)
      count += 1
    }, Promise.resolve());
    // if (count === data.length) return setLoading(false);
    console.log(count);
    setLoading(false);
  }

  // const update = async () => {
  //   setLoading(true);

  //   const manulaFrom = 'users';
  //   const { data, error } = await supabase
  //     .from('users')
  //     .select('profile_pic_url, status, username, user_id')
  //     .neq('status', 'pending')

  //   error && console.log(error);
  //   if (error) return;
    
  //   var count = 0
  //   console.log('initial: ', count);

  //   await data.reduce(async (ref, user) => {
  //     await ref;
  //     await new Promise(resolve => setTimeout(resolve, 500));
  //     user?.username && await updateUserProfilePicUrl(user)
  //     count += 1
  //   }, Promise.resolve());
  //   // if (count === data.length) return setLoading(false);
  //   console.log(count);
  //   setLoading(false);
  // }


  return (<>
    <Nav />
    <div className="h-screen grid place-items-center">
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


    <button className={`${!Loading ? 'bg-secondaryblue' : 'bg-gray-600'} hidden w-full mt-10 rounded-[10px] py-4 text-base text-white font-bold`}
      onClick={updateSub}
    >
      {Loading ? "updating " : "update"}
    </button>
  </>);
}
