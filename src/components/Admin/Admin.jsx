import axios from "axios";
import React, { useState } from "react";
import { Spinner } from "react-bootstrap";
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

  const update = async () => {
    setLoading(true);
    // const { data, error } = await supabase
    //   .from('users')
    //   .select('profile_pic_url, status, username, user_id')
    //   .eq('username', 'dev_cent')

    // error && console.log(error);
    // if (error) return;

    // console.log(data[0]);

    // updateUser(data[0])

    // const { data, error } = await supabase
    //   .from('users')
    //   .select('profile_pic_url, status, username, user_id')
    //   .neq('status', 'pending')

    // error && console.log(error);
    // if (error) return;

    // var count = 0
    // data.forEach(async (user) => {
    //   count += 1
    //   await new Promise(resolve => setTimeout(resolve, 30000));
    //   user && await updateUser(user)
    //   console.log(count);
    // })
    var a;

    // const res = await axios.post(
    //   'https://api.lamadava.com/s1/auth/login',
    //   urlEncode({
    //     'username': 'setiawan.victoria',
    //     'password': '123aaa',
    //     'verification_code': '',
    //     'proxy': '',
    //     'locale': '',
    //     'timezone': '',
    //     'user_agent': ''
    //   }))
    //   .then((response) => response.data)
    //   console.log(res);

    // const response = await axios.post(
    //   'https://api.lamadava.com/s1/auth/login',
    //   new URLSearchParams({
    //     'username': 'setiawan.victoria',
    //     'password': '123aaa',
    //     'verification_code': '',
    //     'proxy': '',
    //     'locale': '',
    //     'timezone': '',
    //     'user_agent': ''
    //   }),
    //   {
    //     headers: {
    //       'accept': 'application/json',
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //       'x-access-key': 'e1GKaU1YPsJNZlY1qTyj9i4J4yTIM7r1'
    //     }
    //   }
    // );
    // console.log(response);
    // return;

    var username = 'dev_cent'
    const options = {
      method: 'GET',
      url: `https://instagram-profile1.p.rapidapi.com/getprofile/${username}`,
      headers: {
        'X-RapidAPI-Key': '019c5aa355msh5056f6d15f2383bp1da51bjsn918a55ff5806',
        'X-RapidAPI-Host': 'instagram-profile1.p.rapidapi.com'
      }
    };

    const response = await axios.request(options).then(function (response) {
      // console.log(response.data);
      return response.data
    }).catch(function (error) {
      console.error(error);
    });
    console.error(response.profile_pic_url);
    // 'username=dev_cent&password=Innocent@2918&verification_code=<123213>&proxy=&locale=&timezone=',
    // .headers: {
    //   'accept': 'application/json',
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // }
    setLoading(false);
  }


  return (<>
    <Nav />
    <div className="h-screen delete-grid place-items-center mt-10">
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
      onClick={update}
    >
      {Loading ? "updating " : "update"}
    </button>
  </>);
}
