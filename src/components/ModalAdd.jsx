/* eslint-disable */
import { useState, useEffect } from 'react';
import { supabase } from "../supabaseClient";
import Modal from 'react-modal';
import { Typeahead } from "react-bootstrap-typeahead"
import { IoClose } from 'react-icons/io5';
import "../../src/modalsettings.css"
import { Spinner } from 'react-bootstrap';
import { getAccount, searchAccount } from '../helpers';
// import { Button } from 'bootstrap';

Modal.setAppElement('#root');

const ModalAdd = ({ from, modalIsOpen, setIsOpen, title, subtitle, extraSubtitle, userId, setAddSuccess, addSuccess }) => {

  const [whitelistAccounts, setWhitelistAccounts] = useState([]);
  const [accountName, setAccountName] = useState("");
  const [selectAccountName, setSelectedAccountName] = useState("");
  const [searchAccounts, setSearchAccounts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingSpinner, setLoadingSpinner] = useState(false);


    const add = async () => {
      // console.log(selectAccountName);
        if (selectAccountName) {
        setLoading(true);
        const theAccount = await getAccount(selectAccountName);
        // console.log(theAccount);
        const res = await supabase.from(from).insert({
          account: selectAccountName,
          followers: theAccount.data[0].follower_count,
          avatar: theAccount.data[0].profile_pic_url,
          user_id: userId,
        });
          res?.error && console.log(
          "🚀 ~ file: Whitelist.jsx:33 ~ const{error}=awaitsupabase.from ~ error",
          res.error
        );
        // console.log(res);

      setAccountName("");
      setSelectedAccountName("");
      setLoading(false);
      setAddSuccess(!addSuccess);
      setIsOpen(!modalIsOpen);
    }
  };

  useEffect(() => {
    if (accountName) {
      setLoadingSpinner(true)
      const getData = async () => {
        const data = await searchAccount(accountName);
        data?.data?.[0]?.users && setSearchAccounts(data.data[0].users);
        setLoadingSpinner(false)
      };
      getData();
    }
  }, [from, accountName]);

  return (
    <Modal
      isOpen={modalIsOpen}
      className="modal_add_content"
      overlayClassName="modal_add_overlay"
      contentLabel="Modal"
    >
      <div className="modal_form_wrapper relative">
        <div className="flex justify-end">
          <IoClose
            className="text-[30px] text-[#8c8c8c]"
            onClick={() => {
              setIsOpen(!modalIsOpen);
            }}
          />
        </div>
        <div className="grid grid-cols-1 justify-center items-center">
          <h1 className='font-bold text-black text-[40px] text-center pb-3'>{title}</h1>
          <p className='font-bold text-sm opacity-40 text-center lg:px-[100px]'>{subtitle}</p>
          <div className="flex items-center justify-center w-full">
              <Typeahead
              className='w-full'
                onInputChange={(text) => setAccountName(text)}
                id="pk"
                onChange={(selected) => {
                  setSelectedAccountName(selected[0]?.username);
                }}
                labelKey="username"
                inputProps={
                  { className: 'w-full bg-inputbkgrd rounded py-[25px] font-semibold' }
                }
              options={searchAccounts}
                placeholder="Search Account"
              />
            {loadingSpinner && (<Spinner animation="border" />)}
            <button className='bg-black w-32 md:w-40 py-[25px] font-semibold rounded text-white'
              onClick={() => add()}
            >{loading ? "Loading..." : "Add"}</button>
          </div>
          {/* <div className="relative pt-8">
              <Typeahead
                onInputChange={(text) => setAccountName(text)}
                id="pk"
                onChange={(selected) => {
                  setSelectedAccountName(selected[0]?.username);
                }}
                labelKey="@username"
                placeholder='@username'
                options={searchAccounts}
                inputProps={{ className: 'w-full bg-inputbkgrd rounded py-[25px] font-semibold' }} />
            <button className='absolute top-[38%] right-[2.5%] bg-black w-32 md:w-40 py-4 font-semibold rounded text-white'
              onClick={() => add()}
            >{loading ? "Loading..." : "Add"}</button>
          </div> */}
          <p className='font-bold text-sm opacity-40 text-center lg:px-[120px] pt-8 pb-5'>{extraSubtitle}</p>
        </div>
      </div>
    </Modal>
  );
}

export default ModalAdd


















// /* eslint-disable */
// import { useState, useEffect } from 'react';
// import { supabase } from "../supabaseClient";
// import Modal from 'react-modal';
// import { Typeahead } from "react-bootstrap-typeahead"
// import { IoClose } from 'react-icons/io5';
// import "../../src/modalsettings.css"
// import { InputGroup, Spinner } from 'react-bootstrap';
// import { getAccount, searchAccount } from '../helpers';
// import { Button } from 'bootstrap';

// Modal.setAppElement('#root');

// const ModalAdd = ({modalIsOpen, setIsOpen, title, subtitle, extraSubtitle, userId}) => {

//   const [whitelistAccounts, setWhitelistAccounts] = useState([]);
//   const [accountName, setAccountName] = useState("");
//   const [selectAccountName, setSelectedAccountName] = useState("");
//   const [searchAccounts, setSearchAccounts] = useState([]);

//   const [loading, setLoading] = useState(false);
//   const [loadingSpinner, setLoadingSpinner] = useState(false);

//   const insertWhitelist = async () => {
//     setLoading(true);
//     if (selectAccountName.length > 0) {
//       const theAccount = await getAccount(selectAccountName);
//       const { error } = await supabase.from("whitelist").insert({
//         account: selectAccountName,
//         followers: theAccount.data[0].follower_count,
//         avatar: theAccount.data[0].profile_pic_url,
//         user_id: userId,
//       });
//       console.log(
//         "🚀 ~ file: Whitelist.jsx:33 ~ const{error}=awaitsupabase.from ~ error",
//         error
//       );

//       setAccountName("");
//       setSelectedAccountName("");
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (accountName.length > 0) {
//       setLoadingSpinner(true)
//       const getData = async () => {
//         const data = await searchAccount(accountName);
//         setSearchAccounts(data.data[0].users);
//       setLoadingSpinner(false)

//       };
//       getData();
//     }
//   }, [accountName]);

//   useEffect(() => {
//     const getTargetingAccounts = async () => {
//       const { data, error } = await supabase
//         .from("whitelist")
//         .select()
//         .eq("user_id", userId);
//       console.log(
//         "🚀 ~ file: Whitelist.jsx:55 ~ getTargetingAccounts ~ error",
//         error
//       );
//       setWhitelistAccounts(data);
//     };

//     getTargetingAccounts();
//   }, [selectAccountName]);

//     return (
//         <Modal
//           isOpen={modalIsOpen}
//           className="modal_add_content"
//           overlayClassName="modal_add_overlay"
//           contentLabel="Modal"
//         >
//           <div className="modal_form_wrapper relative">
//             <div className="flex justify-end">
//               <IoClose
//                 className="text-[30px] text-[#8c8c8c]"
//                 onClick={() => {
//                   setIsOpen(!modalIsOpen);
//                 }}
//               />
//             </div>
//             <div className="grid justify-center items-center">
//                 <h1 className='font-bold text-black text-[40px] text-center pb-3'>{title}</h1>
//                 <p className='font-bold text-sm opacity-40 text-center px-[100px]'>{subtitle}</p>
//                 <div className="flex justify-center items-center relative pt-8">
//                     {/* <Typeahead className='w-[600px] bg-inputbkgrd rounded py-[25px] pl-7 font-semibold' placeholder='@username' type="text" />
//                     <button className='absolute top-[38%] right-[13%] bg-black w-40 py-4 font-semibold rounded text-white'>Add</button> */}
//               <InputGroup className="mb-3 mt-3">
//                 <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
//                 <Typeahead
//                   onInputChange={(text) => setAccountName(text)}
//                   id="pk"
//                   onChange={(selected) => {
//                     setSelectedAccountName(selected[0]?.username);
//                   }}
//                   labelKey="username"
//                   options={searchAccounts}
//                 />{" "}
//                 <div className="ps-2" >
//                   {loadingSpinner && (<Spinner animation="border" />)}
//                 </div>
//               </InputGroup>
//               <Button
//                 variant="dark"
//                 className="mt-5"
//                 onClick={() => insertWhitelist()}
//               >
//                 {loading ? "Loading..." : "Whitelist Account"}
//               </Button>
//                 </div>
//                 <p className='font-bold text-sm opacity-40 text-center px-[120px] pt-14'>{extraSubtitle}</p>
//             </div>
//           </div>

//           {/* <InputGroup className="mb-3 mt-3">
//                   <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
//                   <Typeahead
//                     onInputChange={(text) => setAccountName(text)}
//                     id="pk"
//                     onChange={(selected) => {
//                       setSelectedAccountName(selected[0]?.username);
//                     }}
//                     labelKey="username"
//                     options={searchAccounts}
//                     />{" "}
//                 <div className="ps-2" >
//                     {loadingSpinner && (<Spinner animation="border" /> )}
//                 </div>
//                 </InputGroup>
//                 <Button
//                   variant="dark"
//                   className="mt-5"
                  
//                 >
                  
//                 </Button> */}
//         </Modal>
//       );
// }

// export default ModalAdd
