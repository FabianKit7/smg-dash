import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { AiFillSave } from "react-icons/ai";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { HiOutlineRefresh } from "react-icons/hi";
import { IoClose } from 'react-icons/io5';
import { supabase } from "../../supabaseClient";
import AlertModal from "../AlertModal";
import { ChargeBeeCard } from "../Subscriptions";
import InfoAlert from "./InfoAlert";
import { useTranslation } from "react-i18next";


export default function ChangeModal(props) {
  const { setShowModal, modalToShow, user, setRefresh, refresh, paymentMethods } = props;
  const { t } = useTranslation();

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      {modalToShow === 'fullname' && <FullName t={t} setShowModal={setShowModal} user={user} setRefresh={setRefresh} refresh={refresh} />}
      {modalToShow === 'email' && <Email t={t} setShowModal={setShowModal} user={user} setRefresh={setRefresh} refresh={refresh} />}
      {modalToShow === 'password' && <Password t={t} setShowModal={setShowModal} user={user} setRefresh={setRefresh} refresh={refresh} />}
      {modalToShow === 'phone' && <Phone t={t} setShowModal={setShowModal} user={user} setRefresh={setRefresh} refresh={refresh} />}
      {modalToShow === 'updatePayment' && <UpdatePayment t={t} setShowModal={setShowModal} user={user} setRefresh={setRefresh} refresh={refresh} paymentMethods={paymentMethods} />}
    </Modal>
  );
}

const UpdatePayment = ({ setShowModal, user, setRefresh, refresh, paymentMethods, t }) => {
  const [loading, setLoading] = useState(false)
  const [showCardPage, setShowCardPage] = useState(false)
  const [errorMsg, setErrorMsg] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // console.log(errorMsg);
    if (errorMsg) {
      setIsModalOpen(true)
    }
  }, [errorMsg])

  return (<>
    <AlertModal
      isOpen={isModalOpen}
      onClose={() => { setIsModalOpen(false) }}
      title={errorMsg?.title}
      message={errorMsg?.message}
    />

    <div className="px-2 py-4 md:px-5 lg:p-10">
      <div className="absolute flex justify-end cursor-pointer top-5 right-5">
        <IoClose
          className="text-[30px] text-[#8c8c8c]"
          onClick={() => setShowModal(false)}
        />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-3 mb-2">
          {showCardPage && <div className="w-[32px] h-[32px] rounded-full grid place-items-center shadow-[0_3px_8px_#0000001a] cursor-pointer bg-[#f8f8f8]" onClick={() => setShowCardPage(false)}>
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 512" className="text-[#8C8C8C] font-semibold" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"></path></svg>
          </div>}
          <Modal.Title className="font-bold text-[20px] ">{t("Payment method")}</Modal.Title>
        </div>
      </div>

      <div className={`${showCardPage ? "opacity-100 pointer-events-all" : "opacity-0 pointer-events-none hidden"} transition-all mt-3`}>
        <ChargeBeeCard
          user={user}
          userResults={{}}
          addCard={true}
          username={user.username}
          setIsModalOpen={setShowModal}
          setErrorMsg={setErrorMsg}
          mobile={false}
          Loading={loading}
          setLoading={setLoading}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      </div>

      <div className={`${showCardPage ? "opacity-0 pointer-events-none hidden" : "opacity-100 pointer-events-all"} transition-all`}>
        <form className="flex flex-col mt-5">
          <div className="flex flex-col gap-4 max-h-[220px] overflow-y-auto pr-4">
            {paymentMethods?.map(pm => {
              // console.log(pm);
              const card = pm?.card;
              return (
                <div key={`billing_card_${card?.last4}`} className={`bg-[#f8f8f8] h-[52px] w-full border p-3 rounded-[10px] outline-none`}>
                  <div className="text-[#000] flex items-center justify-center gap-3">
                    {card?.brand === 'visa' && <img src="/icons/visa.svg" alt="visa" className="w-[36px] h-fit" />}
                    {card?.brand === "mastercard" && <img src="/icons/mastercard.svg" alt="visa" className="w-[36px] h-fit" />}
                    {card?.brand === 'maestro' && <img src="/icons/maestro.svg" alt="visa" className="w-[36px] h-fit" />}
                    {!(['visa', 'mastercard', 'maestro'].includes(card?.brand)) && <>({card?.brand})</>}
                    <span className="">{t("card ending with")} {card?.last4}</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className={`mt-2 text-[#dbc8be] font-bold  flex items-center justify-center gap-2 rounded-[10px] h-[52px] w-full cursor-pointer`} onClick={() => {
            // show card page
            setShowCardPage(true)

            // setIsModalOpen(true);
            // setErrorMsg({ title: 'Alert', message: t('Not available yet!') })
          }}>
            <span>+ {t("Add a new payment method")}</span>
          </div>
        </form>

        <button type="button" className={`button-gradient mt-[65px] text-white font-bold  flex items-center justify-center gap-2 rounded-[10px] h-[52px] w-full cursor-pointer`} onClick={() => {
          setShowModal(false);
        }}>
          <span>{t("Close")}</span>
        </button>
      </div>
    </div>
  </>)
}

const FullName = ({ setShowModal, user, setRefresh, refresh, t }) => {
  const [value, setValue] = useState()

  useEffect(() => {
    setValue(user?.full_name)
  }, [user])

  const handleSaveAndClose = async () => {
    const data = { full_name: value }
    const { error } = await supabase
      .from("users")
      .update(data).eq("user_id", user?.user_id).eq("username", user?.username);

    error && console.log(error)
    setRefresh(!refresh)
    setShowModal(false);
  }

  return (<>
    <div className="px-2 py-4 md:px-5 lg:p-10">
      <div className="absolute flex justify-end cursor-pointer top-5 right-5">
        <IoClose
          className="text-[30px] text-[#8c8c8c]"
          onClick={() => setShowModal(false)}
        />
      </div>

      <div className="flex flex-col">
        <Modal.Title className="font-bold text-[20px] mb-2  text-center">{t("Change Full Name")}</Modal.Title>
        <p className="font-bold text-base text-[#757575] text-center w-full ">
          {t("x_full_name_text")}
        </p>
      </div>

      <form className="h-[52px] flex items-center gap-3 mt-5">
        <input type="text" placeholder="Enter your name here..."
          className={`${value ? "border-[#dbc8be]" : "border-[#c4c4c4]"} h-full border p-3 rounded-[10px] w-full outline-none bg-transparent`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit" className={`${value ? "button-gradient" : "bg-[#c4c4c4]"} text-white font-bold  flex items-center justify-center gap-2 h-full rounded-[10px] min-w-[152px] w-[152px] cursor-pointer`} onClick={(e) => {
          e.preventDefault()
          handleSaveAndClose('full_name')
        }}>
          <AiFillSave size={20} />
          <span>{t("Save")}</span>
        </button>
      </form>
    </div>
  </>)
}

const Email = ({ setShowModal, user, setRefresh, refresh, t }) => {
  const [value, setValue] = useState('')
  const [info, setInfo] = useState({ title: '', body: "" })
  const [error, setError] = useState({ message: '' })

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
        .update({ email: value }).eq("username", user?.username);

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

    <div className="px-2 py-4 md:px-5 lg:p-10">
      <div className="absolute flex justify-end cursor-pointer top-5 right-5">
        <IoClose
          className="text-[30px] text-[#8c8c8c]"
          onClick={() => setShowModal(false)}
        />
      </div>

      <div className="flex flex-col">
        <Modal.Title className="font-bold text-[20px] mb-2  text-center">{t("Change Email")}</Modal.Title>

        <div className={`${error.message ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative`} role="alert">
          {/* <strong className="font-bold">Holy smokes!</strong> */}
          <span className="block sm:inline">{error.message}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setError({ message: "" })}>
            <svg className="w-6 h-6 text-red-500 fill-current" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>{t("Close")}</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
          </span>
        </div>


        <p className="font-bold text-base text-[#757575] text-center w-full ">
          {t("x_email_text")}
        </p>
        <p className="font-bold text-base text-[#757575] text-center w-full  mt-2">
          {t("Current Email Address")}
        </p>
        <p className="font-bold text-base text-[#757575] text-center w-full  mt-2 mb-4 p-[18px]">
          {user?.email}
        </p>
        <p className="font-bold text-base text-[#757575] text-center w-full ">
          {t("New Email Address")}
        </p>
      </div>

      <form className="flex flex-col items-center gap-5 mt-5 ">
        <input type="text" placeholder="Enter your name here..."
          className={`${value ? "border-[#dbc8be]" : "border-[#c4c4c4]"} h-[52px] text-center border p-3 rounded-[10px] w-full outline-none bg-transparent`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button className={`${value ? "button-gradient" : "bg-[#c4c4c4]"} text-white font-bold  flex items-center justify-center gap-2 h-[52px] min-h-[52px] rounded-[10px] min-w-[200px] w-[200px] cursor-pointer`} onClick={(e) => {
          e.preventDefault()
          handleSaveAndClose()
        }}>
          <HiOutlineRefresh size={20} />
          <span>{t("Save")}</span>
        </button>
      </form>
    </div >
  </>)
}

const Password = ({ setShowModal, user, setRefresh, refresh, t }) => {
  const [value, setValue] = useState('')
  const [confirm, setConfirm] = useState('')
  const [valueShow, setValueShow] = useState(false)
  const [confirmShow, setConfirmShow] = useState(false)
  const [error, setError] = useState({ message: '' })

  useEffect(() => {
    if (error.message) {
      setTimeout(() => {
        if (error.message === "Success!") {
          setShowModal(false);
        }
        setError({ message: "" })
      }, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  const handleSaveAndClose = async () => {
    if (value === confirm) {
      const { error } = await supabase.auth.updateUser({ password: value })

      if (error) {
        setError({ message: error.message })
        console.log(error)
        return;
      }
      setError({ message: "Success!" })
      setRefresh(!refresh)
    } else {
      setError({ message: "Password must be the same." })
    }
  }

  return (<>
    <div className="px-2 py-4 md:px-5 lg:p-10">
      <div className="absolute flex justify-end cursor-pointer top-5 right-5">
        <IoClose
          className="text-[30px] text-[#8c8c8c]"
          onClick={() => setShowModal(false)}
        />
      </div>

      <div className="flex flex-col">
        <Modal.Title className="font-bold text-[20px] mb-2  text-center">{t("Change Password")}</Modal.Title>

        <div className={`${error.message ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} 
        ${error.message === "Success!" ? "bg-green-100 border border-green-400 text-green-700" : "bg-red-100 border border-red-400 text-red-700"} px-4 py-3 rounded relative`} role="alert">
          {/* <strong className="font-bold">Holy smokes!</strong> */}
          <span className="block sm:inline">{error.message}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setError({ message: "" })}>
            <svg className="w-6 h-6 text-red-500 fill-current" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>{t("Close")}</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
          </span>
        </div>

      </div>

      <form className="flex flex-col items-center gap-5 mt-5 ">
        <div className="relative w-full">
          <input type={valueShow ? "text" : "password"} placeholder={t("New Password")}
            className={`${value && value === confirm ? "border-[#dbc8be]" : "border-[#c4c4c4]"} h-[52px] border p-3 rounded-[10px] w-full outline-none bg-transparent pr-10`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="absolute top-[50%] right-3 translate-y-[-50%] cursor-pointer" onClick={() => setValueShow(!valueShow)}>
            {valueShow ? <FaEye className="" /> : <FaEyeSlash className="" />}
          </div>
        </div>
        <div className="relative w-full">
          <input type={confirmShow ? "text" : "password"} placeholder={t("Confirm Password")}
            className={`${value && value === confirm ? "border-[#dbc8be]" : "border-[#c4c4c4]"} h-[52px] border p-3 rounded-[10px] w-full outline-none bg-transparent pr-10`}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <div className="absolute top-[50%] right-3 translate-y-[-50%] cursor-pointer" onClick={() => setConfirmShow(!confirmShow)}>
            {confirmShow ? <FaEye className="" /> : <FaEyeSlash className="" />}
          </div>
        </div>
        <button className={`${value && value === confirm ? "button-gradient" : "bg-[#c4c4c4]"} text-white font-bold  flex items-center justify-center gap-2 h-[52px] min-h-[52px] rounded-[10px] min-w-[200px] w-[200px] cursor-pointer`} onClick={(e) => {
          e.preventDefault()
          handleSaveAndClose()
        }}>
          <HiOutlineRefresh size={20} />
          <span>{t("Save")}</span>
        </button>
      </form>
    </div>
  </>)
}

const Phone = ({ setShowModal, user, setRefresh, refresh, t }) => {
  const [value, setValue] = useState()

  useEffect(() => {
    setValue(user?.phone)
  }, [user])

  const handleSaveAndClose = async () => {
    const data = { phone: value }
    const { error } = await supabase
      .from("users")
      .update(data).eq("user_id", user?.user_id).eq("username", user?.username);

    error && console.log(error)
    setRefresh(!refresh)
    setShowModal(false);
  }

  return (<>
    <div className="px-2 py-4 md:px-5 lg:p-10">
      <div className="absolute flex justify-end cursor-pointer top-5 right-5">
        <IoClose
          className="text-[30px] text-[#8c8c8c]"
          onClick={() => setShowModal(false)}
        />
      </div>

      <div className="flex flex-col">
        <Modal.Title className="font-bold text-[20px] mb-2  text-center">{t("Change Phone")}</Modal.Title>
        <p className="font-bold text-base text-[#757575] text-center w-full ">
          {t("x_phone_text")}
        </p>
      </div>

      <form className="flex flex-col items-center gap-3 mt-5">
        <input type="tel" placeholder="e.g: +2348112659304"
          className={`${value ? "border-[#dbc8be]" : "border-[#c4c4c4]"} h-[52px] border p-3 rounded-[10px] w-full outline-none bg-transparent`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit" className={`${value ? "button-gradient" : "bg-[#c4c4c4]"} text-white font-bold  flex items-center justify-center gap-2 h-[52px] min-h-[52px] rounded-[10px] min-w-[200px] w-[200px] cursor-pointer`} onClick={(e) => {
          e.preventDefault()
          handleSaveAndClose()
        }}>
          <HiOutlineRefresh size={20} />
          <span>{t("Save")}</span>
        </button>
      </form>
    </div>
  </>)
}