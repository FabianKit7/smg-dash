import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function Admin() {
  const [files, setFiles] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [reading, setReading] = useState(false)

  const handleChange = e => {
    setReading(true)
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = e => {
      // console.log("e.target.result", e.target.result);
      setFiles(JSON.parse(e.target.result));
    };
    setReading(false)
  };

  const handleUploadSessionFile = async () => {
    setLoading(true);
    // console.log(files);
    await files.reduce(async (ref, data) => {
      await ref;
      const { error } = await supabase
        .from("sessions")
        .insert({
          user_id: data.id,
          start_time: data.start_time,
          finish_time: data.finish_time,
          total_interactions: data.total_interactions,
          successful_interactions: data.successful_interactions,
          total_followed: data.total_followed,
          total_likes: data.total_likes,
          total_comments: data.total_comments,
          total_pm: data.total_pm,
          total_watched: data.total_watched,
          total_unfollowed: data.total_unfollowed,
          total_scraped: data.total_scraped,
        })
      error && console.log(error)
    }, Promise.resolve());

    alert('Upload successfull!');
    document.getElementById('input').value ='';
    setFiles([])
    setLoading(false);
  }

  return (
    <div className="h-screen grid place-items-center -mt-10">
      <div>
        <h1 className="mb-5">Upload session file (Json)</h1>

        <div className="flex items-center gap-5">
          <input type="file" id="input" onChange={handleChange} />
          {reading && (<Spinner animation="border" />)}
        </div>

        <button className="bg-secondaryblue w-full mt-10 rounded-[10px] py-4 text-base text-white font-bold"
          onClick={handleUploadSessionFile}
        >
          {Loading ? "Loading " : "Upload"}
        </button>
      </div>
    </div>
  );
}
