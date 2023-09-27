import React, { useEffect, useState } from "react";
import { FaTimes, FaTimesCircle } from "react-icons/fa";
import { BsFillEnvelopeFill, BsTrash3 } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Nav from "../Nav";
import ChangeModal from "./ChangeModal";
import axios from "axios";
import InfiniteRangeSlider from "../InfiniteRangeSlider";
import { useTranslation } from "react-i18next";
import { BACKEND_URL } from "../../config";
import AlertModal from "../AlertModal";

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const urlEncode = function (data) {
  var str = [];
  for (var p in data) {
    if (data.hasOwnProperty(p) && (!(data[p] === undefined || data[p] == null))) {
      str.push(encodeURIComponent(p) + "=" + (data[p] ? encodeURIComponent(data[p]) : ""));
    }
  }
  return str.join("&");
}

export default function Settings() {
  let { username } = useParams();
  const { t } = useTranslation();
  const currentUsername = username
  const navigate = useNavigate()
  const [user, setUser] = useState()
  const [showModal, setShowModal] = useState(false)
  const [modalToShow, setModalToShow] = useState('')
  const [cancelModal, setCancelModal] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState('')
  const [showRangeSlider, setShowRangeSlider] = useState(false)
  const [accounts, setAccounts] = useState([])
  const [errorMsg, setErrorMsg] = useState({ title: 'Alert', message: 'something went wrong' })
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return navigate("/login")
      const { data, error } = await supabase.from('users').select().eq('username', currentUsername).eq('email', user.email)
      if (error) {
        error && console.log(error)
        alert("An error occurred, reloading the page or contact support.")
        return;
      }
      const currentUser = data?.[0];
      const getAllAccounts = await supabase.from('users').select().eq('email', user.email)
      setAccounts(getAllAccounts?.data)
      if (!currentUser?.subscribed) {
        window.location.pathname = `subscriptions/${data[0].username}`;
      } else {
        setUser(data[0])

        if (!currentUser?.customer_id) return;

        setShowRangeSlider(true)
        try {
          let customer_payment_methods = await axios.post(`${BACKEND_URL}/api/stripe/list_payment_methods`,{ customer_id: currentUser?.customer_id })
            .then((response) => response.data).catch(err => err)

          let stripeCustomer = await axios.post(`${BACKEND_URL}/api/stripe/retrieve_customer`, { customer_id: currentUser?.customer_id }).then((response) => response.data).catch(err => err)
          const defaultPaymentMethodId = stripeCustomer?.invoice_settings?.default_payment_method
          setDefaultPaymentMethod(customer_payment_methods?.data?.find(pm => pm.id === defaultPaymentMethodId))
          setPaymentMethods(customer_payment_methods?.data)
        } catch (error) {
          setIsModalOpen(true);
          setErrorMsg({ title: 'Failed to create subscription', message: `An error occured: ${error.message}` })
        }
        setShowRangeSlider(false)

      }
    };

    getData();
  }, [currentUsername, navigate, refresh]);

  // console.log({user});
  // console.log(paymentMethods);

  return (
    <>
      <AlertModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        title={errorMsg?.title}
        message={errorMsg?.message}
      />

      <div className="max-w-[1400px] mx-auto">
        <Nav />

        <div className="mt-4">
          <div
            className="flex justify-between items-center rounded-[10px] h-[84px] px-5 md:px-[30px] mb-10"
            style={{
              boxShadow: '0 0 3px #1C1A2640',
            }}
          >
            <h1 className="font-black font-MontserratBold text-[18px] md:text-[26px] text-black-r">{t("Profile settings")}</h1>

            <div className="flex items-center gap-2 text-base cursor-pointer" onClick={() => navigate(-1)}>
              <h3>{t("Close")}</h3>
              <FaTimes size={18} />
            </div>
          </div>

          <div className="md:px-10">
            <div className="flex flex-col md:flex-row justify-between md:items-center md:h-[70px] text-[18px] mb-3 md:mb-0">
              <div className="mb-2 border-b md:mb-0 md:border-b-0">{t("Full Name")}</div>
              <div className="flex items-center justify-between gap-3 md:justify-end">
                <div className="text-[#757575]">{user?.full_name}</div>
                <div className="text-[#b16cea] cursor-pointer"
                  onClick={() => {
                    setShowModal(true);
                    setRefresh(!refresh)
                    setModalToShow('fullname');
                  }}
                >{t("Change")}</div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between md:items-center md:h-[70px] text-[18px] mb-3 md:mb-0">
              <div className="mb-2 border-b md:mb-0 md:border-b-0">{t("Email")}</div>
              <div className="flex flex-col md:flex-row md:items-center md:gap-3">
                <div className="text-[#757575]">{user?.email}</div>
                <div className="text-[#b16cea] cursor-pointer"
                  onClick={() => {
                    setShowModal(true);
                    setRefresh(!refresh)
                    setModalToShow('email');
                  }}
                >{t("Change")}</div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between md:items-center md:h-[70px] text-[18px] mb-3 md:mb-0">
              <div className="mb-2 border-b md:mb-0 md:border-b-0">{t("Password")}</div>
              <div className="flex items-center justify-between gap-3 md:justify-end">
                <div className="text-[#757575]">************</div>
                <div className="text-[#b16cea] cursor-pointer"
                  onClick={() => {
                    setShowModal(true);
                    setRefresh(!refresh)
                    setModalToShow('password');
                  }}
                >{t("Change")}</div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between md:items-center md:h-[70px] text-[18px] mb-3 md:mb-0">
              <div className="mb-2 border-b md:mb-0 md:border-b-0">{t("Phone number")}</div>
              <div className="flex items-center justify-between gap-3 md:justify-end">
                <div className="text-[#757575]">{user?.phone}</div>
                <div className="text-[#b16cea] cursor-pointer"
                  onClick={() => {
                    setShowModal(true);
                    setRefresh(!refresh)
                    setModalToShow('phone');
                  }}
                >{t("Change")}</div>
              </div>
            </div>
            {/* <div className="flex flex-col md:flex-row justify-between md:items-center md:h-[70px] text-[18px] mb-3 md:mb-0">
              <div className="mb-2 border-b md:mb-0 md:border-b-0">Subscription</div>
              <div className="flex items-center justify-between gap-3 md:justify-end">
                <div className="text-[#757575]">Active</div>
                <div className="text-[#b16cea] cursor-pointer" onClick={() => setCancelModal(true)}>Cancel</div>
              </div>
            </div> */}
          </div>
        </div>

        {defaultPaymentMethod ?
          <div className="my-8">
            <div
              className="flex justify-between items-center rounded-[10px] h-[84px] px-5 md:px-[30px] mb-10"
              style={{
                boxShadow: '0 0 3px #1C1A2640',
              }}
            >
              <h1 className="font-black font-MontserratBold text-[18px] md:text-[26px] text-black-r">{t("Payment and Billing Settings")}</h1>
            </div>

            {/* payment and billing settings */}
            <div className="md:px-10">
              <div className="flex flex-col md:flex-row justify-between md:items-center md:h-[70px] text-[18px] mb-3 md:mb-0">
                <div className="mb-2 border-b md:mb-0 md:border-b-0">{t("Credit Card")}</div>

                <div className="flex items-center justify-between gap-3 md:justify-end">
                  <div className="text-[#757575] flex items-center gap-3">
                    {defaultPaymentMethod?.card?.brand === 'visa' && <img src="/icons/visa.svg" alt="visa" className="w-[36px] h-fit" />}
                    {defaultPaymentMethod?.card?.brand === 'mastercard' && <img src="/icons/mastercard.svg" alt="visa" className="w-[36px] h-fit" />}
                    {defaultPaymentMethod?.card?.brand === 'maestro' && <img src="/icons/maestro.svg" alt="visa" className="w-[36px] h-fit" />}
                    {!(['visa', 'mastercard', 'maestro'].includes(defaultPaymentMethod?.card?.brand)) && <>({defaultPaymentMethod?.card?.brand})</>}
                    <span className="">{t("card ending with")} {defaultPaymentMethod?.card?.last4}</span>
                  </div>
                  <div className="text-[#b16cea] cursor-pointer"
                    onClick={() => {
                      setShowModal(true);
                      setRefresh(!refresh)
                      setModalToShow('updatePayment');
                    }}
                  >{t("Update")}</div>
                </div>
              </div>
            </div>
          </div>
          : <>
            {showRangeSlider && <InfiniteRangeSlider />}
          </>}

        <div className="my-8">
          <div
            className="flex flex-col md:flex-row justify-between items-center rounded-[10px] md:h-[84px] py-3 md:py-0 px-5 md:px-[30px] mb-10"
            style={{
              boxShadow: '0 0 3px #1C1A2640',
            }}
          >
            <h1 className="font-black font-MontserratBold text-[18px] md:text-[26px] text-black-r">{t("Accounts")}</h1>
            <Link to={`/search/?username=add_account`}
              className="px-[32px] md:h-[52px] py-2 md:py-0 text-sm md:text-base mt-2 md:mt-0 w-full md:w-fit grid place-items-center whitespace-nowrap rounded-[10px] button-gradient text-white font-bold"
            >{t("Add Account")}</Link>
          </div>

          {/* payment and billing settings */}
          <div className="md:px-[40px] flex flex-col gap-[40px]">

            {accounts.map(account => {
              // console.log(account);
              return (
                <div key={`account_${account?.username}`} className="flex flex-col justify-between md:flex-row">
                  <div className="border-b mb-2 pb-1 md:mb-0 md:border-b-0 flex items-center gap-2 md:gap-4 lg:gap-[30px]">
                    <div className="relative">
                      <img src={account?.profile_pic_url} alt={`@${account?.username}`} className="min-w-[50px] min-h-[50px] w-[50px] h-[50px] lg:min-w-[107px] lg:min-h-[107px] lg:w-[107px] lg:h-[107px] rounded-full" />
                      <div className="hidden lg:block absolute -bottom-[2px] -right-[2px] border-[5px] w-[32px] h-[32px] rounded-full bg-green-600"></div>
                    </div>
                    <div className="lg:text-[24px] w-full">
                      <div className="flex justify-between w-full gap-1 md:justify-start">@{account?.username} <span className="font-bold text-[#ff5e69]">Active</span></div>
                      <div className="">
                        <img src="/instagram.svg" alt="" className="my-[3px] md:my-[5px] lg:my-[7px] mr-[8px] w-[16px] h-[16px] lg:w-[28px] lg:h-[28px] rounded-full" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <div className="px-3 lg:px-[13px] py-3 lg:py-0 lg:h-[52px] grid place-items-center whitespace-nowrap rounded-[10px] button-gradient text-white font-bold cursor-pointer" onClick={() => setCancelModal(true)}><BsTrash3 size={24} className="w-[16px] h-[16px] lg:w-[24px] lg:h-[24px]" /></div>
                  </div>
                </div>
              )
            })}

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
          paymentMethods={paymentMethods}
        />

        <div className={`${cancelModal ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} fixed top-0 left-0 w-full h-screen grid place-items-center`} style={{
          transition: "opacity .15s ease-in"
        }}
        >
          <div className="fixed top-0 left-0 grid w-full h-screen bg-black/40 place-items-center" onClick={() => setCancelModal(false)}></div>
          <div className="bg-white to-black py-4 md:py-7 md:pt-12 px-5 md:px-10 relative max-w-[300px] md:max-w-[500px] lg:max-w-[600px] font-MontserratRegular rounded-[10px]">
            <FaTimesCircle className="absolute flex flex-col items-center top-3 right-3"
              onClick={() => {
                setCancelModal(false)
              }} />
            <h1 className="text-[1rem] md:text-lg font-bold text-center font-MontserratSemiBold text-[#333]">{t("cancel_sub_title")}</h1>
            <div className="text-[.8rem] md:text-base">
              <p className="text-center">
                {t("cancel_sub_text1a")} <a href="mailto:support@propulse.me" className="text-blue-500">support@propulse.me</a>.
                {t("cancel_sub_text1b")}
              </p>
              <br />
              <p className="text-center">
                {t("cancel_sub_text2")}
              </p>
            </div>
            <a href="mailto:support@propulse.me" className="mt-8 m-auto w-fit py-3 rounded-[10px] font-MontserratRegular px-10 bg-blue-500 text-white flex justify-center items-center text-[1rem] md:text-lg gap-3">
              <BsFillEnvelopeFill />
              Send an email
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
