import Axios from "axios";
import React, { useEffect, useState } from "react";
import { RxCaretRight } from "react-icons/rx"
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { searchAccount } from "../helpers";
import { useRef } from "react";

export default function Search() {
  const [selectAccountName, setSelectedAccountName] = useState("");
  const [options, setOptions] = useState([]);
  const [error, setError] = useState(false);
  const ref = useRef()

  // function dynamicSort(property) {
  //   var sortOrder = 1;
  //   if (property[0] === "-") {
  //     sortOrder = -1;
  //     property = property.substr(1);
  //   }
  //   return function (a, b) {
  //     /* next line works with strings and numbers, 
  //      * and you may want to customize it to your needs
  //      */
  //     var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
  //     return result * sortOrder;
  //   }
  // }

  const onSubmit = async (e) => {
    const input = ref.current.getInput()
    // console.log(input.value);
    if (selectAccountName || input?.value) {
      if (e === "Enter") {
        const params = { ig: selectAccountName || input.value, response_type: "short", corsEnabled: "false" };
        console.log(params);
        const options = {
          method: "GET",
          url: "https://instagram-bulk-profile-scrapper.p.rapidapi.com/clients/api/ig/ig_profile",
          params,
          headers: {
            "X-RapidAPI-Key": "47e2a82623msh562f6553fe3aae6p10b5f4jsn431fcca8b82e",
            "X-RapidAPI-Host": "instagram-bulk-profile-scrapper.p.rapidapi.com",
          },
        };
        const userResults = await Axios.request(options);
        // if (userResults.data[0].name === "INVALID_USERNAME") return setError(true);
        if (!userResults.data[0].username) return setError(true);
        window.location = `/subscriptions/${userResults.data[0].username}`;
      }
    } else {
      alert('choose your account');
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState('username')

  const handleSearch = async (query) => {
    setInputText(query)
    setIsLoading(true);
    const data = await searchAccount(query);
    const users = data?.users;
    if (users.length > 0) {
      // console.log(user.length);
      // console.log('data.data[0].users', user[0].username);
      // const sorted = users.sort(dynamicSort(query));
      // console.log(sorted);
      // console.log(users);
      setOptions(users);
    }
    setIsLoading(false);
  };

  // const val = ref?.current?.getInput()?.value
  // console.log(val);
  // val && setInputText(val)
  // useEffect(() => {
  // }, [])

  // console.log(options);

  return (
    <div className="container mx-auto px-6">
      <div className="flex flex-col justify-center items-center mt-12 md:mt-20">
        <div className="flex items-center gap-4 md:gap-5 text-semibold mb-10 text-center">
          <p className="text-primaryblue opacity-40 text-sm font-bold">Select Your Account</p>
          <div className="rounded-[4px] bg-[#D9D9D9] relative w-6 h-[18px] md:w-5 md:h-5 cursor-pointer">
            <RxCaretRight className="absolute text-[#8C8C8C] font-semibold text-[17px]" />
          </div>
          <p className="text-gray20 opacity-40 text-sm font-bold">Complete Setup</p>
          <div className="rounded-[4px] bg-[#D9D9D9] relative w-6 h-[18px] md:w-5 md:h-5 cursor-pointer">
            <RxCaretRight className="absolute text-[#8C8C8C] font-semibold text-[17px]" />
          </div>
          <p className="text-gray20 opacity-40 text-sm font-bold">Enter Dashboard</p>
        </div>

        <div className="grid justify-center items-center">
          <h1 className='font-bold text-black text-[40px] text-center pb-3'>Search your account</h1>
          <p className='font-bold text-sm opacity-40 text-center md:px-[100px]'>Find your Instagram account and start growing followers with Sprouty Social</p>
          <div className="flex justify-center items-center relative pt-8">
            {/* <Typeahead
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
              placeholder="@username"
            /> */}
            {/* {loadingSpinner && (<Spinner animation="border" />)} */}

            <AsyncTypeahead
              ref={ref}
              allowNew={true}
              useCache={false}
              paginate={false}
              id="async-example"
              // filterBy={(option, props) => {
              //   /* Your own filtering code goes here. */
              //   // console.log(option, props);
              //   return true
              // }}
              // filterBy={() => true}
              caseSensitive={true}
              isLoading={isLoading}
              labelKey="username"
              inputProps={
                { className: 'w-full bg-inputbkgrd rounded py-[25px] font-semibold' }
              }
              className='w-full'
              placeholder="Search Account..."
              // minLength={2}
              onSearch={handleSearch}
              // onFocus={() => {
              //   handleSearch(ref.current.getInput().value)
              // }}
              // onBlur={() => {
              //   handleSearch(ref.current.getInput().value)
              // }}
              // onInputChange={() => {
              //   handleSearch(ref.current.getInput().value)
              // }}
              // onKeyDown={() => {
              //   handleSearch(ref.current.getInput().value)
              // }}
              // onKeyPress={() => {
              //   handleSearch(ref.current.getInput().value)
              // }}
              // onChange={(selected) => {
              //   setSelectedAccountName(selected[0]?.username);
              // }}
              options={options}
              renderMenuItemChildren={(option) => {
                // console.log(option.username);
                return (
                  <div className='min-w-[300px] flex'>
                    <img
                      alt=''
                      src={option.profile_pic_url}
                      style={{
                        height: '40px',
                        marginRight: '10px',
                        width: '40px',
                        borderRadius: '9999px'
                      }}
                    />
                    <div className="flex flex-col">
                      <span>{option.username}</span>
                      <span className="opacity-40">{option.full_name}</span>
                    </div>
                  </div>
                )
              }}
            />
            {/* <input className='w-full bg-inputbkgrd rounded-[10px] py-[25px] pl-7 font-semibold' placeholder='@username' type="text" value={value} onChange={({ target }) => setValue(target.value)} onKeyPress={(e) => onSubmit(e.nativeEvent.code)} /> */}
            <button className='absolute top-[38%] right-[2.5%] bg-primaryblue w-40 py-4 font-semibold rounded-[10px] text-white cursor-pointer' onClick={() => onSubmit("Enter")}>Select Account</button>
          </div>
          <p className='font-bold text-sm opacity-40 text-center md:px-[120px] pt-14'>Don’t worry. You will be able to check if you’ve entered in a correct format in the next step.</p>
        </div>
        {error && <label style={{ marginTop: '1rem', color: 'red' }}>{`The account @${error.inputValue} was not found on Instagram`}</label>}
      </div>
    </div>
  );
}





















// import React, { } from "react";
// import { RxCaretRight } from "react-icons/rx"

// export default function Search() {
//   return (
//     <div className="container mx-auto px-6">
//       <div className="flex flex-col justify-center items-center mt-12 md:mt-20">
//         <div className="flex items-center gap-4 md:gap-5 text-semibold mb-10 text-center">
//           <p className="text-primaryblue opacity-40 text-sm font-bold">Select Your Account</p>
//           <div className="rounded-[4px] bg-[#D9D9D9] relative w-6 h-[18px] md:w-5 md:h-5 cursor-pointer">
//             <RxCaretRight className="absolute text-[#8C8C8C] font-semibold text-[17px]" />
//           </div>
//           <p className="text-gray20 opacity-40 text-sm font-bold">Complete Setup</p>
//           <div className="rounded-[4px] bg-[#D9D9D9] relative w-6 h-[18px] md:w-5 md:h-5 cursor-pointer">
//             <RxCaretRight className="absolute text-[#8C8C8C] font-semibold text-[17px]" />
//           </div>
//           <p className="text-gray20 opacity-40 text-sm font-bold">Enter Dashboard</p>
//         </div>

//         <div className="grid justify-center items-center">
//           <h1 className='font-bold text-black text-[40px] text-center pb-3'>Search your account</h1>
//           <p className='font-bold text-sm opacity-40 text-center md:px-[100px]'>Find your Instagram account and start growing followers with Sprouty Social</p>
//           <Search />
//           <p className='font-bold text-sm opacity-40 text-center md:px-[120px] pt-14'>Don’t worry. You will be able to check if you’ve entered in a correct format in the next step.</p>
//         </div>
//       </div>
//     </div>
//   );
// }
