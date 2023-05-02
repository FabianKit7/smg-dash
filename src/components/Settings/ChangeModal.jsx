import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { AiFillSave } from "react-icons/ai";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { HiOutlineRefresh } from "react-icons/hi";
import { IoClose } from 'react-icons/io5';
import { supabase } from "../../supabaseClient";
import InfoAlert from "../InfoAlert";
// import { supabase } from "../../supabaseClient";


export default function ChangeModal(props) {
  const { setShowModal, modalToShow, user, setRefresh, refresh } = props;

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      {modalToShow === 'fullname' && <FullName setShowModal={setShowModal} user={user} setRefresh={setRefresh} refresh={refresh} />}
      {modalToShow === 'email' && <Email setShowModal={setShowModal} user={user} setRefresh={setRefresh} refresh={refresh} />}
      {modalToShow === 'password' && <Password setShowModal={setShowModal} user={user} setRefresh={setRefresh} refresh={refresh} />}
      {modalToShow === 'phone' && <Phone setShowModal={setShowModal} user={user} setRefresh={setRefresh} refresh={refresh} />}
    </Modal>
  );
}

const FullName = ({ setShowModal, user, setRefresh, refresh }) => {
  const [value, setValue] = useState()

  useEffect(() => {
    setValue(user?.full_name)
  }, [user])

  const handleSaveAndClose = async () => {
    const data = { full_name: value }
    const { error } = await supabase
      .from("users")
      .update(data).eq("user_id", user.user_id);

    error && console.log(error)
    setRefresh(!refresh)
    setShowModal(false);
  }

  return (<>
    <div className="p-10">
      <div className="flex justify-end absolute top-5 right-5 cursor-pointer">
        <IoClose
          className="text-[30px] text-[#8c8c8c]"
          onClick={() => setShowModal(false)}
        />
      </div>

      <div className="flex flex-col">
        <Modal.Title className="font-bold text-[20px] mb-2 font-MontserratBold text-center">Change Full Name</Modal.Title>
        <p className="font-bold text-base text-[#757575] text-center w-full font-MontserratRegular">
          Update the full name on your Sprouty Social profile.
        </p>
      </div>

      <form className="h-[52px] flex items-center gap-3 mt-5">
        <input type="text" placeholder="Enter your name here..."
          className={`${value ? "border-[#23df85]" : "border-[#c4c4c4]"} h-full border p-3 rounded-[10px] w-full outline-none`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit" className={`${value ? "bg-[#23df85]" : "bg-[#c4c4c4]"} text-white font-bold font-MontserratBold flex items-center justify-center gap-2 h-full rounded-[10px] min-w-[132px] w-[132px] cursor-pointer`} onClick={(e) => {
          e.preventDefault()
          handleSaveAndClose('full_name')
        }}>
          <AiFillSave size={20} />
          <span>Save</span>
        </button>
      </form>
    </div>
  </>)
}

const Email = ({ setShowModal, user, setRefresh, refresh }) => {
  const [value, setValue] = useState('')
  const [info, setInfo] = useState({ title: '', body: "" })
  const [error, setError] = useState({message: ''})

  useEffect(() => {
    setValue(user?.email)
  }, [user])

  useEffect(() => {
    if (info.title) {
      setTimeout(() => {
        setInfo({ title: '', body: "" })
        setShowModal(false);
      }, 7000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info])

  useEffect(() => {
    if (error.message) {
      setTimeout(() => {
        setError({ message: "" })
      }, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])


  const handleSaveAndClose = async () => {
    if (value && value !== user?.email) {
      const updateAuthUser = await supabase.auth.updateUser({ email: value });
      if (updateAuthUser.error) {
        setError({ message: updateAuthUser.error.message })
        console.log(updateAuthUser.error);
        return
      }

      const { error } = await supabase
        .from("users")
        .update({ email: value }).eq("user_id", user.user_id);

      error && console.log(error)
      setInfo({ title: "Email Confirmation", body: "Check your email and click on the confirmation link" })
      setRefresh(!refresh)
      return;
    }
    setShowModal(false);
  }

  return (<>
    <div className={`${info.title ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} fixed top-5 left-[50%] translate-x-[-50%]`}>
      <InfoAlert message={{ title: info.title, body: info.body }} />
    </div>

    <div className="p-10">
      <div className="flex justify-end absolute top-5 right-5 cursor-pointer">
        <IoClose
          className="text-[30px] text-[#8c8c8c]"
          onClick={() => setShowModal(false)}
        />
      </div>

      <div className="flex flex-col">
        <Modal.Title className="font-bold text-[20px] mb-2 font-MontserratBold text-center">Change Email</Modal.Title>
        
        <div className={`${error.message ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative`} role="alert">
          {/* <strong className="font-bold">Holy smokes!</strong> */}
          <span className="block sm:inline">{error.message}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setError({message:  ""})}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
          </span>
        </div>


        <p className="font-bold text-base text-[#757575] text-center w-full font-MontserratRegular">
          Update the email address on your Sprouty Social profile.
        </p>
        <p className="font-bold text-base text-[#757575] text-center w-full font-MontserratRegular mt-2">
          Current Email Address
        </p>
        <p className="font-bold text-base text-[#757575] text-center w-full font-MontserratRegular mt-2 mb-4 p-[18px]">
          {user?.email}
        </p>
        <p className="font-bold text-base text-[#757575] text-center w-full font-MontserratRegular">
          New Email Address
        </p>
      </div>

      <form className="flex flex-col items-center gap-5 mt-5 ">
        <input type="text" placeholder="Enter your name here..."
          className={`${value ? "border-[#23df85]" : "border-[#c4c4c4]"} h-[52px] text-center border p-3 rounded-[10px] w-full outline-none`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button className={`${value ? "bg-[#23df85]" : "bg-[#c4c4c4]"} text-white font-bold font-MontserratBold flex items-center justify-center gap-2 h-[52px] min-h-[52px] rounded-[10px] min-w-[200px] w-[200px] cursor-pointer`} onClick={(e) => {
          e.preventDefault()
          handleSaveAndClose()
        }}>
          <HiOutlineRefresh size={20} />
          <span>Update Email</span>
        </button>
      </form>
    </div >
  </>)
}

const Password = ({ setShowModal, user, setRefresh, refresh }) => {
  const [value, setValue] = useState('')
  const [confirm, setConfirm] = useState('')
  const [valueShow, setValueShow] = useState(false)
  const [confirmShow, setConfirmShow] = useState(false)
  const [error, setError] = useState({ message: '' })

  useEffect(() => {
    if (error.message) {
      setTimeout(() => {
        if(error.message === "Success!"){
          setShowModal(false);
        }
        setError({ message: "" })
      }, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  const handleSaveAndClose = async () => {
    if(value === confirm){
      const {error } = await supabase.auth.updateUser({ password: value })
  
      if(error) {
        setError({message: error.message})
        console.log(error)
        return;
      }
      setError({message: "Success!"})
      setRefresh(!refresh)
    }else{
      setError({message: "Password must be the same."})
    }
  }

  return (<>
    <div className="p-10">
      <div className="flex justify-end absolute top-5 right-5 cursor-pointer">
        <IoClose
          className="text-[30px] text-[#8c8c8c]"
          onClick={() => setShowModal(false)}
        />
      </div>

      <div className="flex flex-col">
        <Modal.Title className="font-bold text-[20px] mb-2 font-MontserratBold text-center">Change Password</Modal.Title>

        <div className={`${error.message ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} 
        ${error.message === "Success!" ? "bg-green-100 border border-green-400 text-green-700" : "bg-red-100 border border-red-400 text-red-700"} px-4 py-3 rounded relative`} role="alert">
          {/* <strong className="font-bold">Holy smokes!</strong> */}
          <span className="block sm:inline">{error.message}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setError({ message: "" })}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
          </span>
        </div>

      </div>

      <form className="flex flex-col items-center gap-5 mt-5 ">
        <div className="relative w-full">
          <input type={valueShow ? "text" : "password"} placeholder="New Password"
            className={`${value && value === confirm ? "border-[#23df85]" : "border-[#c4c4c4]"} h-[52px] border p-3 rounded-[10px] w-full outline-none pr-10`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="absolute top-[50%] right-3 translate-y-[-50%] cursor-pointer" onClick={() => setValueShow(!valueShow)}>
            {valueShow ? <FaEye className="" /> : <FaEyeSlash className="" />}
          </div>
        </div>
        <div className="relative w-full">
          <input type={confirmShow ? "text" : "password"} placeholder="Confirm Password"
            className={`${value && value === confirm ? "border-[#23df85]" : "border-[#c4c4c4]"} h-[52px] border p-3 rounded-[10px] w-full outline-none pr-10`}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <div className="absolute top-[50%] right-3 translate-y-[-50%] cursor-pointer" onClick={() => setConfirmShow(!confirmShow)}>
            {confirmShow ? <FaEye className="" /> : <FaEyeSlash className="" />}
          </div>
        </div>
        <button className={`${value && value === confirm ? "bg-[#23df85]" : "bg-[#c4c4c4]"} text-white font-bold font-MontserratBold flex items-center justify-center gap-2 h-[52px] min-h-[52px] rounded-[10px] min-w-[200px] w-[200px] cursor-pointer`} onClick={(e) => {
          e.preventDefault()
          handleSaveAndClose()
        }}>
          <HiOutlineRefresh size={20} />
          <span>Update Email</span>
        </button>
      </form>
    </div>
  </>)
}

const Phone = ({ setShowModal, user, setRefresh, refresh }) => {
  const [value, setValue] = useState()

  useEffect(() => {
    setValue(user?.phone)
  }, [user])

  const handleSaveAndClose = async () => {
    const data = { phone: value }
    const { error } = await supabase
      .from("users")
      .update(data).eq("user_id", user.user_id);

    error && console.log(error)
    setRefresh(!refresh)
    setShowModal(false);
  }

  return (<>
    <div className="p-10">
      <div className="flex justify-end absolute top-5 right-5 cursor-pointer">
        <IoClose
          className="text-[30px] text-[#8c8c8c]"
          onClick={() => setShowModal(false)}
        />
      </div>

      <div className="flex flex-col">
        <Modal.Title className="font-bold text-[20px] mb-2 font-MontserratBold text-center">Change Phone</Modal.Title>
        <p className="font-bold text-base text-[#757575] text-center w-full font-MontserratRegular">
          Update the phone number on your Sprouty Social profile.
        </p>
      </div>

      <form className="flex flex-col items-center gap-3 mt-5">
        <input type="tel" placeholder="e.g: +2348112659304"
          className={`${value ? "border-[#23df85]" : "border-[#c4c4c4]"} h-[52px] border p-3 rounded-[10px] w-full outline-none`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit" className={`${value ? "bg-[#23df85]" : "bg-[#c4c4c4]"} text-white font-bold font-MontserratBold flex items-center justify-center gap-2 h-[52px] min-h-[52px] rounded-[10px] min-w-[200px] w-[200px] cursor-pointer`} onClick={(e) => {
          e.preventDefault()
          handleSaveAndClose()
        }}>
          <HiOutlineRefresh size={20} />
          <span>Update Phone</span>
        </button>
      </form>
    </div>
  </>)
}