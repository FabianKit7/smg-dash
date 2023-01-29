import React, { useState, useCallback, useEffect } from "react";
import { Col, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { IoClose } from 'react-icons/io5';
import MultiRangeSlider from "./MultiRangeSlider/MultiRangeSlider";
import "../../src/modalsettings.css"
import { supabase } from "../supabaseClient";

export default function TargetingFilterModal(props, { min, max }) {
  // const stored = {
  //   followerMin: parseInt(localStorage.getItem('followerMinValue'), 10) || 1,
  //   followerMax: parseInt(localStorage.getItem('followerMaxValue'), 10) || 20000,
  //   followingMin: parseInt(localStorage.getItem('followingMinValue'), 10) || 1,
  //   followingMax: parseInt(localStorage.getItem('followingMaxValue'), 10) || 10000,
  //   mediaMin: parseInt(localStorage.getItem('mediaMinValue'), 10) || 1,
  //   mediaMax: parseInt(localStorage.getItem('mediaMaxValue'), 10) || 1000,
  // }

  const [followerMinValue, setFollowerMinValue] = useState(0);
  const [followerMaxValue, setFollowerMaxValue] = useState(0);
  const [followingMinValue, setFollowingMinValue] = useState(0);
  const [followingMaxValue, setFollowingMaxValue] = useState(0);
  const [mediaMinValue, setMediaMinValue] = useState(0);
  const [mediaMaxValue, setMediaMaxValue] = useState(0);
  const [margic, setMargic] = useState(true);
  const [privacy, setPrivacy] = useState('All');
  const [gender, setGender] = useState('All');
  const [lang, setLang] = useState('All');
  // console.log("🚀 ~ file: CenterModal.jsx:11 ~ CenterModal ~ value", value);

  const { setFilterModal, filtermodal, user, user_id } = props;

  const setFilterModalCallback = useCallback(() => {
    setFilterModal(false);
  }, [setFilterModal]);

  const handleSaveAndClose = () => {
    if (user_id) {
      handleSave()
    }
  }

  
  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
      .from('users')
      .select()
      .eq('user_id', user_id).order('created_at', { ascending: false })

      // console.log(data?.[0]?.targetingFilter);

      setPrivacy(data?.[0]?.targetingFilter.privacy || 'All');
      setGender(data?.[0]?.targetingFilter.gender || 'All');
      setLang(data?.[0]?.targetingFilter.lang || 'All');
      setFollowerMinValue(data?.[0]?.targetingFilter.followersMin || 1);
      setFollowerMaxValue(data?.[0]?.targetingFilter.followersMax || 20000);
      setFollowingMinValue(data?.[0]?.targetingFilter.followingMin || 1);
      setFollowingMaxValue(data?.[0]?.targetingFilter.followingMax || 7500);
      setMediaMinValue(data?.[0]?.targetingFilter.mediaMin || 1);
      setMediaMaxValue(data?.[0]?.targetingFilter.mediaMax || 1000);
      error && console.log(error);
    }
    if (user && user?.id && user_id) {
      // console.log(user_id);
      fetch();
    }
  }, [user, user_id, filtermodal])

  const handleSave = async () => {
    const targetingFilter = {
      "followersMin": 1 || followerMinValue,
      "followersMax": 20000 || followerMaxValue,
      "followingMin": 1 || followingMaxValue,
      "followingMax": 7500 || followingMaxValue,
      "mediaMin": 1 || mediaMinValue,
      "mediaMax": 1000 || mediaMaxValue,
      "privacy": privacy,
      "gender": gender,
      "lang": lang,
      "margicFilter": margic
    }
    // console.log(JSON.stringify(targetingFilter));
    const { data, error } = await supabase
      .from('users')
      // .update({ targetingFilter: JSON.stringify(targetingFilter) })
      .update({ targetingFilter })
      .eq('user_id', user_id)
    // .select('*');
    // console.log(data, error && error);
    // console.log(error && error);
    setFilterModalCallback()
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header id="custom-header" closeButton={false}>
        <div className="flex flex-col">
          <Modal.Title className="font-bold text-[20px] mb-2">Targeting Filters</Modal.Title>
          <p className="font-bold text-sm opacity-40 w-full">
            Here you can add preferences for your ideal follower. Before any follow or like we do, target will be checked if it complies to your liking.
          </p>
        </div>
        <div className="flex justify-end">
          <IoClose
            className="text-[30px] text-[#8c8c8c]"
            onClick={setFilterModalCallback}
          />
        </div>
      </Modal.Header>
      <Modal.Body>
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-12 p-3">
            <div className="flex flex-col justify-content-between">
              <div className="flex flex-col gap-2 w-[80%]">
                <label className="font-semibold text-base">Followers</label>
                <MultiRangeSlider
                  margic={margic}
                  setMargic={setMargic}
                  className="range mb-2"
                  title="followers"
                  min={followerMinValue}
                  max={followerMinValue}
                  onChange={({ min, max }) => {
                    setFollowerMinValue(min);
                    setFollowerMaxValue(max);
                    if (min > followerMinValue && max < followerMaxValue) {
                      console.log(min);
                      setMargic(false);
                    }
                  }}
                />
              </div>
              <div className="flex flex-col gap-2 w-[80%] mt-4">
                <label className="font-semibold text-base mt-4">Following</label>
                <MultiRangeSlider
                  margic={margic}
                  setMargic={setMargic}
                  className="range mb-2"
                  title="followers"
                  min={followingMinValue}
                  max={followingMinValue}
                  onChange={({ min, max }) => {
                    setFollowingMinValue(min);
                    setFollowingMaxValue(max);
                    if (min > followingMinValue && max < followingMaxValue) {
                      console.log(min);
                      setMargic(false);
                    }
                  }}
                />
              </div>
              <div className="flex flex-col gap-2 w-[80%] mt-4 mb-3">
                <label className="font-semibold text-base mt-4">Media</label>
                <MultiRangeSlider
                  margic={margic}
                  setMargic={setMargic}
                  className="range mb-2"
                  title="followers"
                  min={mediaMinValue}
                  max={mediaMaxValue}
                  onChange={({ min, max }) => {
                    setMediaMinValue(min);
                    setMediaMaxValue(max);
                    if (min > mediaMinValue && max < mediaMaxValue) {
                      console.log(min);
                      setMargic(false);
                    }
                  }}
                />
              </div>
              <button
                className={`${margic ? "bg-[#23DF85]" : "bg-gray-600"} w-full mt-10 rounded-[10px] py-4 text-base text-white font-bold`}
                onClick={() => { setMargic(!margic) }}
              >Magic Filters: {margic ? 'ON' : 'OFF'}</button>
            </div>

            <Col>
              <div>
                <label className="font-medium text-[15px] mb-2">Privacy</label>
                <Form.Select className="shadow-filter mb-6 rounded-[10px] pl-5" aria-label="Privacy"
                  value={privacy}
                  // defaultValue={privacy}
                  onChange={(e) => {
                    setPrivacy(e.target.value);
                  }}
                >
                  <option value="All">All</option>
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </Form.Select>
              </div>

              <div>
                <label className="font-medium text-[15px] mb-2">Gender</label>
                <Form.Select className="shadow-filter mb-6 rounded-[10px] pl-5" aria-label="Gender"
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value);
                  }}
                >
                  <option value="All">All</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Form.Select>
              </div>

              <div>
                <label className="font-medium text-[15px] mb-2">Language</label>
                <Form.Select className="shadow-filter rounded-[10px] pl-5" aria-label="Privacy"
                  value={lang}
                  onChange={(e) => {
                    setLang(e.target.value);
                  }}
                >
                  {/* <option>Open this select menu</option> */}
                  <option value="All">All</option>
                  <option value="English">English</option>
                  <option value="French">French</option>
                </Form.Select>
              </div>

              <div>
                <button className="bg-secondaryblue w-full mt-10 rounded-[10px] py-4 text-base text-white font-bold"
                  onClick={handleSaveAndClose}
                >
                  Save And Close
                </button>
              </div>
            </Col>
          </div>
        </>
      </Modal.Body>
    </Modal>
  );
}
