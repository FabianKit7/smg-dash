import React, { useState, useCallback, useEffect } from "react";
import { Col, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { IoClose } from 'react-icons/io5';
import MultiRangeSlider, { ChangeResult } from "multi-range-slider-react";
import { FaMagic } from "react-icons/fa"
import "../modalsettings.css"
import "../MultiRangeSlider.css"
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
  const { setFilterModal, filtermodal, user, user_id,
    followerMinValueD, followerMaxValueD, followingMinValueD, followingMaxValueD, mediaMinValueD, mediaMaxValueD, margicD, privacyD, genderD, langD } = props;

  const [followerMinValue, setFollowerMinValue] = useState(followerMinValueD);
  const [followerMaxValue, setFollowerMaxValue] = useState(followerMaxValueD);
  const [followingMinValue, setFollowingMinValue] = useState(followingMinValueD);
  const [followingMaxValue, setFollowingMaxValue] = useState(followingMaxValueD);
  const [mediaMinValue, setMediaMinValue] = useState(mediaMinValueD);
  const [mediaMaxValue, setMediaMaxValue] = useState(mediaMaxValueD);
  const [margic, setMargic] = useState(margicD || true);
  const [privacy, setPrivacy] = useState(privacyD || 'All');
  const [gender, setGender] = useState(genderD || 'All');
  const [lang, setLang] = useState(langD || 'All');

  const handleSaveAndClose = async () => {
    const targetingFilter = {
      "followersMin": followerMinValue,
      "followersMax": followerMaxValue,
      "followingMin": followingMinValue,
      "followingMax": followingMaxValue,
      "mediaMin": mediaMinValue,
      "mediaMax": mediaMaxValue,
      "privacy": privacy,
      "gender": gender,
      "lang": lang,
      "margicFilter": margic
    }
    
    const { error } = await supabase
      .from('users')
      .update({ targetingFilter })
      .eq('user_id', user_id)
    error && console.log(error);
    setFilterModal(false);
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
            onClick={() => setFilterModal(false)}
          />
        </div>
      </Modal.Header>
      <Modal.Body>
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-12 p-3">
            <div className="flex flex-col justify-content-between">
              <div className="flex flex-col w-[80%] relative">
                <label className="font-semibold text-base">Followers</label>
                <div className="mrslider relative">
                  <div className={`${margic ? "bg-[#23DF85]" : "bg-gray-600"} rounded-[10px]  p-2 w-8 h-8 cursor-pointer absolute top-[12%] -right-[23%]`} onClick={() => { setMargic(!margic) }}>
                    <FaMagic className="text-white" />
                  </div>
                  <MultiRangeSlider
                    min={1}
                    max={20000}
                    minValue={followerMinValue}
                    maxValue={followerMaxValue}
                    // step={100}
                    // onInput={(e) => { }}
                    onChange={(e) => {
                      setFollowerMinValue(e.minValue);
                      setFollowerMaxValue(e.maxValue);
                    }}
                    label={true}
                    ruler={false}
                  />

                </div>
              </div>

              <div className="flex flex-col w-[80%]">
                <label className="font-semibold text-base mt-4">Following</label>
                <div className="mrslider relative">
                  <div className={`${margic ? "bg-[#23DF85]" : "bg-gray-600"} rounded-[10px]  p-2 w-8 h-8 cursor-pointer absolute top-[12%] -right-[23%]`} onClick={() => { setMargic(!margic) }}>
                    <FaMagic className="text-white" />
                  </div>
                  <MultiRangeSlider
                    min={1}
                    max={7500}
                    minValue={followingMinValue}
                    maxValue={followingMaxValue}
                    // step={100}
                    // onInput={(e) => { }}
                    onChange={(e) => {
                      setFollowingMinValue(e.minValue);
                      setFollowingMaxValue(e.maxValue);
                    }}
                    label={true}
                    ruler={false}
                  />
                </div>
              </div>
              <div className="flex flex-col w-[80%]">
                <label className="font-semibold text-base mt-4">Media</label>
                <div className="mrslider relative">
                  <div className={`${margic ? "bg-[#23DF85]" : "bg-gray-600"} rounded-[10px]  p-2 w-8 h-8 cursor-pointer absolute top-[12%] -right-[23%]`} onClick={() => { setMargic(!margic) }}>
                    <FaMagic className="text-white" />
                  </div>
                  <MultiRangeSlider
                    min={1}
                    max={1000}
                    minValue={mediaMinValue}
                    maxValue={mediaMaxValue}
                    // step={100}
                    // onInput={(e) => { }}
                    onChange={(e) => {
                      setMediaMinValue(e.minValue);
                      setMediaMaxValue(e.maxValue);
                    }}
                    label={true}
                    ruler={false}
                  />
                </div>
              </div>

              <button
                className={`${margic ? "bg-[#23DF85]" : "bg-gray-600"} w-full mt-5 rounded-[10px] py-4 text-base text-white font-bold`}
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