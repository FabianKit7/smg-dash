/* eslint-disable */
import React, { useEffect, useState } from "react";
import Modal from 'react-modal';
import { countDays, deleteAccount, getAccount, numFormatter, searchAccount } from "../helpers";
import { supabase } from "../supabaseClient";
import avatarImg from "../images/avatar.svg"
import { ImBin2 } from "react-icons/im"
import { BsFillPlusSquareFill } from "react-icons/bs"
import ModalAdd from "./ModalAdd";
import { Spinner } from "react-bootstrap";

Modal.setAppElement('#root');

export default function Targeting({ userId, avatar, username }) {
  const [targetingAccounts, setTargetingAccounts] = useState([]);
  const [radioValue, setRadioValue] = useState("Account");
  const [accountName, setAccountName] = useState("");
  const [selectAccountName, setSelectedAccountName] = useState("");
  const [searchAccounts, setSearchAccounts] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  const radios = [
    { name: "Account", value: "Account" },
    { name: "Hashtag", value: "Hashtag" },
  ];

  useEffect(() => {
    if (accountName.length > 0) {
      setLoadingSpinner(true);
      const getData = async () => {
        const data = await searchAccount(accountName);
        setSearchAccounts(data.data[0].users ?? [{ username: "" }]);
        setLoadingSpinner(false);
      };
      getData();
    }
  }, [accountName, addSuccess]);

  useEffect(() => {
    const getTargetingAccounts = async () => {
      setLoadingSpinner(true)
      const { data, error } = await supabase
        .from("targeting")
        .select()
        .eq("user_id", userId)
        .order('id', { ascending: false });
      error && console.log(
        "🚀 ~ file: Targeting.jsx:63 ~ getTargetingAccounts ~ error",
        error
      );
      setTargetingAccounts(data);
      setLoadingSpinner(false)
    };

    getTargetingAccounts();
  }, [userId, selectAccountName, addSuccess]);

  const subtitle = "Set up your targeting by adding relevant username of an account."
  const extraSubtitle = "Add Accounts to use as sources for your targeting. Adding accounts as targets will interact with users who follow that account. For optimal results, aim for a follow-back rate of 15%+ across all targets."

  return (
    <>
      <ModalAdd
        modalIsOpen={modalIsOpen}
        setIsOpen={setIsOpen}
        title="Add a Target"
        from='targeting'
        subtitle={subtitle}
        extraSubtitle={extraSubtitle}
        userId={userId}
        setAddSuccess={setAddSuccess}
        addSuccess={addSuccess}
      />

      <div className="shadow-targeting mt-12">
        {/* nav */}
        <div className="flex justify-between px-8 pt-8">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-[28px] font-MontserratBold">Targeting</h3>
            <div className="bg-gray20 rounded w-8 h-8 flex justify-center items-center">
              <h2 className="text-white font-MontserratSemiBold">{targetingAccounts?.length} </h2>
            </div>
            {loadingSpinner && (<Spinner animation="border" />)}
          </div>
          <div className="flex gap-3 text-black">
            <div className="rounded-[4px] bg-[#D9D9D9] p-3 relative w-10 h-10 cursor-pointer" onClick={() => { setIsOpen(!modalIsOpen) }}>
              <BsFillPlusSquareFill className="absolute text-[#8C8C8C] font-semibold" />
            </div>
          </div>
        </div>
        {/* body */}
        <div className="grid p-5 md:p-8 gap-4">
          {targetingAccounts.map((item, index) => {
            // console.log(item);
            return (
              <div key={index}>
                <div className="rounded-[4px] border-[#E0E0E0] border border-solid flex justify-between p-3">
                  <div className="flex gap-3">
                    <img src={item.avatar || avatarImg} className="h-11 w-11 rounded-full self-center" alt={item.account} crossOrigin="Anonymous" />
                    <div className="flex flex-col">
                      <h1 className="font-bold">@{item.account}</h1>
                      <p>{numFormatter(item.followers)} Followers</p>
                      <p className="flex md:hidden">{countDays(item.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <p className="hidden md:flex">{countDays(item.created_at)}</p>
                    <div className="rounded-[4px] bg-[#D9D9D9] p-2 md:p-3 relative w-8 h-8 md:w-10 md:h-10 md:mr-5 cursor-pointer">
                      <ImBin2 className="absolute text-[#8C8C8C] font-semibold"
                        onClick={ async () => {
                          const res = await deleteAccount('targeting', item.id);
                          console.log(res);
                          console.log(item.id);
                          // await supabase.from('targeting').delete().eq<"id">('id', item.id)
                          setAddSuccess(!addSuccess)
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>



        {/* <div className="mt-5 container">
          <Row>
            <Col xs={12} md={8}>
              <Table striped="columns">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>followers</th>
                    <th>performance</th>
                    <th>Added</th>
                  </tr>
                </thead>
                <tbody>
                  {targetingAccounts.map((item) => {
                    return (
                      <tr>
                        <td>
                          <img
                            className="rounded-circle"
                            src={item.avatar}
                            alt={item.account}
                            width={45}
                            height={40}
                            crossOrigin="Anonymous"
                          />{" "}
                          @{item.account}
                        </td>
                        <td>{numFormatter(item.followers)}</td>
                        <td>{numFormatter(item.performance)}</td>
                        <td>{countDays(item.created_at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
            <Col>
              <div className="d-flex flex-column">
                <h3>Add Source</h3>
                <p>
                  Set up tour targeting by adding relevant username and hashtag
                </p>
                <ButtonGroup>
                  {radios.map((radio, idx) => (
                    <ToggleButton
                      key={idx}
                      id={`radio-${idx}`}
                      type="radio"
                      variant={
                        radioValue === radio.value ? "dark bg-dark" : "white"
                      }
                      name="radio"
                      value={radio.value}
                      checked={radioValue === radio.value}
                      onChange={(e) => setRadioValue(e.currentTarget.value)}
                    >
                      {radio.name}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
                <InputGroup className="mb-3 mt-3">
                  <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                  <Typeahead
                    onInputChange={(text) => setAccountName(text)}
                    id="pk"
                    onChange={(selected) => {
                      setSelectedAccountName(selected[0]?.username);
                    }}
                    labelKey="username"
                    options={[...searchAccounts]}
                  />
                  <div className="ps-2">
                    {loadingSpinner && <Spinner animation="border" />}
                  </div>
                </InputGroup>
                <Button
                  variant="dark"
                  className="mt-5"
                  onClick={() => insertTarget()}
                >
                  {loading ? "Loading..." : "Add Target"}
                </Button>
              </div>
            </Col>
          </Row>
        </div> */}
      </div>
    </>
  );
}
