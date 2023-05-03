import React, { useEffect, useState } from "react";
import { FaTimes, FaTimesCircle } from "react-icons/fa";
import { BsFillEnvelopeFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Nav from "../Nav";
import ChangeModal from "./ChangeModal";

export default function Settings() {
  const navigate = useNavigate()
  const [user, setUser] = useState()
  const [showModal, setShowModal] = useState(false)
  const [modalToShow, setModalToShow] = useState('')
  const [cancelModal, setCancelModal] = useState(false)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return navigate("/login")
      const { data, error } = await supabase
      .from('users')
      .select()
      .eq('user_id', user.id)
      
      if (user && !data[0]?.subscribed) {
        window.location.pathname = `subscriptions/${data[0].username}`;
      }
      setUser(data[0])
      error && console.log(error)
    };

    getData();
  }, [navigate, refresh]);

  // console.log({user});
  return (
    <>
      <Nav />

      <div className="mt-4">
        <div
          className="flex justify-between items-center rounded-[10px] h-[84px] px-[30px] mb-10"
          style={{
            boxShadow: '0 0 3px #00000040',
          }}
        >
          <h1 className="font-black font-MontserratBold text-[26px] text-black">Profile settings</h1>

          <div className="flex items-center gap-2 text-base cursor-pointer" onClick={() => navigate(-1)}>
            <h3>Close</h3>
            <FaTimes size={18} />
          </div>
        </div>

        <div className="md:p-10">
          <div className="flex flex-col md:flex-row justify-between md:items-center md:h-[70px] text-[18px] mb-3 md:mb-0">
            <div className="">Full Name</div>
            <div className="flex items-center justify-between md:justify-end gap-3">
              <div className="text-[#757575]">{user?.full_name}</div>
              <div className="text-[#1b89ff] cursor-pointer"
              onClick={() => {
                setShowModal(true);
                setRefresh(!refresh)
                setModalToShow('fullname');
              }}
              >Change</div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between md:items-center md:h-[70px] text-[18px] mb-3 md:mb-0">
            <div className="">Email</div>
            <div className="flex flex-col md:flex-row md:items-center md:gap-3">
              <div className="text-[#757575]">{user?.email}</div>
              <div className="text-[#1b89ff] cursor-pointer"
              onClick={() => {
                setShowModal(true);
                setRefresh(!refresh)
                setModalToShow('email');
              }}
              >Change</div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between md:items-center md:h-[70px] text-[18px] mb-3 md:mb-0">
            <div className="">Password</div>
            <div className="flex items-center justify-between md:justify-end gap-3">
              <div className="text-[#757575]">************</div>
              <div className="text-[#1b89ff] cursor-pointer"
              onClick={() => {
                setShowModal(true);
                setRefresh(!refresh)
                setModalToShow('password');
              }}
              >Change</div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between md:items-center md:h-[70px] text-[18px] mb-3 md:mb-0">
            <div className="">Phone number</div>
            <div className="flex items-center justify-between md:justify-end gap-3">
              <div className="text-[#757575]">{user?.phone}</div>
              <div className="text-[#1b89ff] cursor-pointer"
              onClick={() => {
                setShowModal(true);
                setRefresh(!refresh)
                setModalToShow('phone');
              }}
              >Change</div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between md:items-center md:h-[70px] text-[18px] mb-3 md:mb-0">
            <div className="">Subscription</div>
            <div className="flex items-center justify-between md:justify-end gap-3">
              <div className="text-[#757575]">Active</div>
              <div className="text-[#1b89ff] cursor-pointer" onClick={() => setCancelModal(true)}>Cancel</div>
            </div>
          </div>
        </div>
      </div>

      <ChangeModal
        show={showModal}
        onHide={() => setShowModal(false)}
        setShowModal={setShowModal}
        showModal={showModal}
        modalToShow={modalToShow}
        user={user}
        setRefresh={setRefresh}
        refresh={refresh}
      />

      <div className={`${cancelModal ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} fixed top-0 left-0 w-full h-screen grid place-items-center`} style={{
        transition: "opacity .15s ease-in"
      }}
      >
        <div className="fixed top-0 left-0 w-full h-screen bg-black/40 grid place-items-center" onClick={() => setCancelModal(false)}></div>
        <div className="bg-white to-black py-7 pt-12 px-10 relative max-w-[300px] md:max-w-[500px] lg:max-w-[600px] font-MontserratRegular">
          <FaTimesCircle className="absolute top-3 right-3 flex flex-col items-center"
            onClick={() => {
              setCancelModal(false)
            }} />
          <h1 className="text-lg font-bold text-center font-MontserratSemiBold text-[#333]">Submit your cancellation request</h1>
          <p className="text-center">
            All cancellations requests have to be processed by our support team. Please request a cancellation and provide us with your reason for cancelling by emailing <a href="mailto:support@sproutysocial.com" className="text-blue-500">support@sproutysocial.com</a>. We appreciate your feedback and are always looking to improve
          </p>
          <br />
          <p className="text-center">
            Our expert account managers are always on standby and ready to help. If you are not getting results, or need help, schedule a time to speak with our expert team who can help you reach your full instagram growth potential.
          </p>
          <a href="mailto:support@sproutysocial.com" className="mt-8 m-auto w-fit py-3 rounded-[10px] font-MontserratRegular px-10 bg-blue-500 text-white flex justify-center items-center gap-3">
            <BsFillEnvelopeFill />
            Send an email
          </a>
        </div>
      </div>
    </>
  );
}
