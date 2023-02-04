import  Axios  from "axios";
import React, { useEffect, useState } from "react";
// import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { RxCaretRight } from "react-icons/rx"
import { Typeahead } from "react-bootstrap-typeahead";
import { searchAccount } from "../helpers";
import { Spinner } from "react-bootstrap";




export default function Search() {
  const [accountName, setAccountName] = useState("");
  const [selectAccountName, setSelectedAccountName] = useState("");
  const [searchAccounts, setSearchAccounts] = useState([]);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  // const [value, setValue] = useState("");
  // const [data, setData] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

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
  }, [accountName]);


  const options = {
    method: "GET",
    url: "https://instagram-bulk-profile-scrapper.p.rapidapi.com/clients/api/ig/ig_profile",
    params: { ig: selectAccountName || accountName, response_type: "short", corsEnabled: "true" },
    headers: {
      "X-RapidAPI-Key": "47e2a82623msh562f6553fe3aae6p10b5f4jsn431fcca8b82e",
      "X-RapidAPI-Host": "instagram-bulk-profile-scrapper.p.rapidapi.com",
    },
  };


/*   const getData = async () => {
    const userResults = await Axios.request(options);
    if (userResults.data[0].name === "INVALID_USERNAME")
      return setError(true);
    setData(userResults.data);
  };   */

  const onSubmit = async (e) => {
    if (selectAccountName || accountName) {
      if (e === "Enter") {
        const userResults = await Axios.request(options);
        
        if (userResults.data[0].name === "INVALID_USERNAME")
        return setError(true);
        // setData(userResults.data);
        if(userResults) {
          // navigate(`/subscriptions/${selectAccountName || accountName}`);
          window.location = `/subscriptions/${selectAccountName || accountName}`;
        }
      }
    }
  };

    

 


  return (
    <div className="container mx-auto px-6">
      <div className="flex flex-col justify-center items-center mt-12 md:mt-20">
        <div className="flex items-center gap-4 md:gap-5 text-semibold mb-10 text-center">
          <p className="text-primaryblue opacity-40 text-sm font-bold">Select Your Account</p>
          <div className="rounded-[4px] bg-[#D9D9D9] relative w-6 h-[18px] md:w-5 md:h-5 cursor-pointer">
            <RxCaretRight className="absolute text-[#8C8C8C] font-semibold text-[17px]"/>
          </div>
          <p className="text-gray20 opacity-40 text-sm font-bold">Complete Setup</p>
          <div className="rounded-[4px] bg-[#D9D9D9] relative w-6 h-[18px] md:w-5 md:h-5 cursor-pointer">
            <RxCaretRight className="absolute text-[#8C8C8C] font-semibold text-[17px]"/>
          </div>
          <p className="text-gray20 opacity-40 text-sm font-bold">Enter Dashboard</p>
        </div>


        <div className="grid justify-center items-center">
          <h1 className='font-bold text-black text-[40px] text-center pb-3'>Search your account</h1>
          <p className='font-bold text-sm opacity-40 text-center md:px-[100px]'>Find your Instagram account and start growing followers with Sprouty Social</p>
          <div className="flex justify-center items-center relative pt-8">
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
              placeholder="@username"
            />
            {loadingSpinner && (<Spinner animation="border" />)}
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
