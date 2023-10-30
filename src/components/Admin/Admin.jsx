import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { supabase } from "../../supabaseClient";
import Nav from "../Nav";
import { useNavigate } from "react-router-dom";
import { uploadImageFromURL } from "../../helpers";
import { BACKEND_URL } from "../../config";
import axios from "axios";

const defaultData = {
  "start_time": new Date(),
  "is_verified": true,
  "biography": "",
  "status": "active",
  "userMode": "auto",
  "messageSender": "{\"sms\":false,\"code\":\"\",\"admin\":\"\",\"method\":\"\",\"approve\":false}",
  "first_account": true,
}

export default function Admin() {
  const navigate = useNavigate();
  const [fetchingUser, setFetchingUser] = useState(true)
  const [files, setFiles] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [reading, setReading] = useState(false);

  // verity user
  useEffect(() => {
    const getData = async () => {
      const authUserRes = await supabase.auth.getUser()
      if (authUserRes?.error) return navigate("/search")
      const authUser = authUserRes?.data?.user
      const getSuperUser = await supabase.from('users').select().eq("email", authUser.email)
      const superUser = getSuperUser?.data?.[0]
      if (!superUser || !superUser?.admin) return navigate("/search")
      setFetchingUser(false)
    };

    getData();
  }, [navigate]);

  let receipts = [];
  let receiptsRead = [];
  let currentReceipt = null;
  var list = []

  const receiptReader = new FileReader();
  receiptReader.onloadend = (e) => {
    const data = JSON.parse(e.target.result)
    list.push({ data, username: data?.[0]?.args?.username })
    receiptsRead.push(currentReceipt);
    readNextReceipt();
  };

  function readNextReceipt() {
    if (receiptsRead.length < receipts.length) {
      currentReceipt = receipts[receiptsRead.length];
      // receiptReader.readAsArrayBuffer(currentReceipt);
      receiptReader.readAsText(currentReceipt, "UTF-8");
    } else {
      // console.log('All receipts have been read.');
      setReading(false)
      setFiles(list);
    }
  }

  const handleChange = e => {
    setReading(true)
    receipts = e.target.files;
    receiptsRead = [];

    console.log('Reading receipts...');
    readNextReceipt();
  };

  function generateRandomPassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  const handleUploadSessionFile = async () => {
    setLoading(true);
    await files.reduce(async (ref, file) => {
      await ref;
      const username = file?.username
      try {
        const data = file?.data
        let lastItem = data[data?.length - 1];
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();

        // check if user already exists
        const userAlreadyExists = await supabase.from('users').select().eq("username", username).single()
        if (userAlreadyExists.error) {
          console.log(`${username} does not exist`);
          // if user does not exist: 
          // auth user
          const email = `${username}@gmail.com`;
          const password = generateRandomPassword(6);

          // const { data: { user: authUser }, error: SignupError } = await supabase.auth.signUp({
          //   email,
          //   password,
          // });
          const { data: authUser, error: SignupError } = await axios.post(`${BACKEND_URL}/api/auth_user`,
            { email, password })
            .then((response) => response.data).catch(error => {
              console.log("auth_user error");
              console.log(error);
              return error
            })

          // Create in backend

          if (!SignupError && authUser) {
            console.log(`created authUserData for ${authUser.email}`);
            // upload profile picture
            let profile_pic_url = '';
            const uploadImageFromURLRes = await uploadImageFromURL(username)

            if (uploadImageFromURLRes?.status === 'success') {
              profile_pic_url = uploadImageFromURLRes?.data ?? ''
            }

            profile_pic_url ? console.log(` profile picture for ${username} has been uploaded`) : console.log(` profile picture for ${username} was not uploaded`);
            // todo: create user profile
            const { error } = await supabase
              .from("users")
              .upsert({
                ...defaultData,
                username,
                full_name: username,
                profile_pic_url,
                user_id: authUser.id,
                email: authUser.email,
                password,
              })
            !error && console.log(`user profile createed successfully for ${username}`);
            error && console.error(`error creating profile for: ${username}`);
            error && console.error(error);
          } else {
            console.log(`failed to create authUserData for ${username}: ${SignupError}`);
            SignupError && console.error(SignupError);
          }
        }

        // continue to update the user' profile
        const updateUser = await supabase
          .from("users")
          .update({
            followers: lastItem.profile.followers,
            following: lastItem.profile.following,
            posts: lastItem.profile.posts,
            total_interactions: lastItem.total_interactions,
            session_updated_at: `${year}-${month}-${day}`
          }).eq('username', username);

        !updateUser.error && console.log(`user profile updated successfully for ${username}`);
        updateUser.error && console.error(updateUser.error);

      } catch (error) {
        console.log(error);
      }

      const { error } = await supabase
        .from("sessions")
        .upsert({
          username,
          data: file.data
        })
      !error && console.log(`user session data updated successfully for ${username}`);
      error && console.error(error);
      console.log(username);
      // console.log(file);
    }, Promise.resolve());



    alert('Upload successfull!');
    document.getElementById('input').value = '';
    setFiles([])
    setLoading(false);
  }

  if (fetchingUser) {
    return (<>
      Loading...
    </>)
  }

  return (<>
    <Nav />
    <div className="flex flex-col h-screen">
      <div className="w-[250px]">
        <h1 className="mb-5">Upload session file (Json)</h1>

        <div className="flex items-center gap-5">
          <input type="file" id="input" onChange={handleChange} multiple accept="application/JSON" />
          {reading && (<Spinner animation="border" />)}
        </div>

        <button className={`${files.length > 0 ? 'bg-secondaryblue' : 'bg-gray-600'} w-full mt-4 rounded-[10px] py-4 text-base text-white font-bold`}
          onClick={handleUploadSessionFile}
        >
          {Loading ? "Loading " : "Upload"}
        </button>
      </div>
    </div>
  </>);
}
