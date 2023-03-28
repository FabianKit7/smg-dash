import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { updateUserProfilePicUrl } from "../../helpers";
import { supabase } from "../../supabaseClient";
import Nav from "../Nav";

export default function Admin() {
  const [files, setFiles] = useState([]);
  const [username, setUsername] = useState('')
  const [Loading, setLoading] = useState(false);
  const [reading, setReading] = useState(false)

  let receipts = [];
  let receiptsRead = [];
  let currentReceipt = null;
  var list = []
  
  const receiptReader = new FileReader();
  receiptReader.onloadend = (e) => {
    // const loadSucceeded = (e.error === undefined) ? true : false;
    // console.log(`${currentReceipt.name}: ${e.loaded} of ${e.total} loaded. success: ${loadSucceeded}`);
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

    // setFiles(e.target.files)
    // setReading(true)
    // const fileReader = new FileReader();
    // // console.log(e?.target?.files);
    // var files = e?.target?.files
    // let index = 0
    // var fileRead = []

    // setInterval(() => {
    //   var file = files[fileRead.length]
    //   fileReader.readAsText(file, "UTF-8");
    //   fileReader.onload = e => {
    //     // console.log("e.target.result", e.target.result);
    //     const data = JSON.parse(e.target.result)
    //     setUsername(data[0].args.username);
    //     const r = e.target.result
    //     console.log(r);
    //     // setFiles({...files, r});
    //   };
    // }, 50);

    // for (const file of files) {
    //   // do something with the file, for example:
    //   console.log(file);

    //     fileReader.readAsText(file, "UTF-8");
    //     fileReader.onload = e => {
    //       // console.log("e.target.result", e.target.result);
    //       const data = JSON.parse(e.target.result)
    //       console.log(data);
    //       setUsername(data[0].args.username);
    //       const r = e.target.result
    //       setFiles({...files, r});
    //     };
    // }
    // setReading(false)
  };


  const handleUploadSessionFile = async () => {
    setLoading(true);
    // const username = 'dev_cent'
    // if (!username) return setLoading(false);
    await files.reduce(async (ref, file) => {
      await ref;
      const username = file?.username
      const { error } = await supabase
        .from("sessions")
        .upsert({
          username,
          data: file.data
        })
      error && console.log(error);
      console.log(username);
      // console.log(file);
    }, Promise.resolve());



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
          <input type="file" id="input" onChange={handleChange} multiple accept="application/JSON" />
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
