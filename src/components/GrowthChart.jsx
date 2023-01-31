import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { getThDayNameFromDate, numFormatter } from "../helpers";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from "react-bootstrap/Dropdown";
import { supabase } from "../supabaseClient";

export default function GrowthChart({ userDefaultData }) {
  const [dropDown, setDropDown] = useState("7 days");
  // const categories = data
  //   .map((account) => getThDayNameFromDate(account.created_at))
  //   .reverse();
  const [sessionsData, setSessionsData] = useState([])

  // console.log(userDefaultData?.[0]?.username);
  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select()
        .eq('username', userDefaultData?.[0]?.username)
      error && console.log(error);
      const d = JSON.parse(data[0].data)
      // console.log(d);
      setSessionsData(d)
    }
    const id = userDefaultData?.[0]?.user_id;
    if(id){
      fetch()
    }
  }, [userDefaultData])

  const followersData = []
  const categories = []
  const dl = dropDown.split(' ')
  sessionsData?.slice(-parseInt(dl[0])).forEach(items => {
    const day = new Date(items.finish_time).getDate()
    const month = new Date(items.finish_time).getMonth()+1
    const year = new Date(items.finish_time).getFullYear()
    categories.push(`${year}/${month}/${day}`);
    followersData.push(items.profile.followers);
  })

  

  // const followersData = data?.map((account) => account?.followers).reverse();
  // console.log(followersData);



  const options = {
    dataLabels: {
      enabled: false,
    },
    colors: ["#0087fe"],
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 1,
        opacityTo: 1,
      },
    },
    grid: {
      show: false,
      padding: {
        left: 0,
        right: 0,
      },
    },
    tooltip: {
      enabled: true,
    },
    chart: {
      id: "line",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories,
    },
    yaxis: {
      labels: {
        offsetX: -15,
        offsetY: 0,
        formatter: function (val, index) {
          return numFormatter(val); // formats long numbers for y-axis values just like the rest of the nums
        },
      },
    },
  }

  return (
    <div>
      <h1 className="font-bold text-[20px] pb-5">Followers</h1>
      <div className="rounded-md text-gray20 shadow-stats w-full">
        <div className="card-body pt-3 pb-0 px-3 d-flex flex-column">
          <div className="flex justify-end">

            <div className="rounded-md">
              <Dropdown>
                <Dropdown.Toggle
                  variant=""
                  className="btn btn-outline-secondary btn-sm dropdown-toggle"
                  id="dropdown-basic"
                >
                  {dropDown}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setDropDown("7 Days")}>
                    7 Days
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setDropDown("14 Days")}>
                    14 Days
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setDropDown("30 Days")}>
                    30 Days
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>

        <div className="px-3">
          <Chart
            options={options}

            series={[{
              name: "Followers",
              data: followersData
            }]}

            type="area"
            height="200"
          />
        </div>
      </div>
    </div>
  );
}
