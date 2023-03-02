import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { numFormatter } from "../helpers";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from "react-bootstrap/Dropdown";

export default function GrowthChart({ sessionsData }) {
  const [dropDown, setDropDown] = useState("7 days");
  const [followersData, setFollowersData] = useState([])
  const [categories, setCategories] = useState([])
  useEffect(() => {
    let followersData = []
    let categories = []
    const dl = dropDown.split(' ')
    sessionsData?.slice(-parseInt(dl[0])).forEach(items => {
      // console.log(items);
      // const day = new Date(items.finish_time).getDate()
      // const month = new Date(items.finish_time).getMonth()+1
      // const year = new Date(items.finish_time).getFullYear()
      const day = new Date(items.start_time).getDate()
      const month = new Date(items.start_time).getMonth()+1
      const year = new Date(items.start_time).getFullYear()
      categories.push(`${year}/${month}/${day}`);
      followersData.push(items.profile.followers);
    })
    setCategories(categories);
    setFollowersData(followersData)
    // console.log(categories);
    // console.log(followersData);

  }, [dropDown, sessionsData])
  

  const options = {
    dataLabels: {
      enabled: false,
    },
    // colors: ["#0087fe"],
    colors: ["#7ea5ff"],
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
      {/* <h1 className="font-bold text-[20px] pb-5">Followers</h1> */}
      <div className="rounded-md text-gray20 shadow-stats w-full">
        <div className="card-body pt-3 pb-0 px-3 d-flex flex-column">
          <div className="flex justify-between px-6 py-4">
            <h1 className="font-bold text-[28px] font-MontserratBold">Followers</h1>

            <div className="rounded-md">
              <Dropdown>
                <Dropdown.Toggle
                  variant=""
                  className="btn btn-outline-secondary btn-sm dropdown-toggle font-MontserratRegular text-[#333]"
                  id="dropdown-basic"
                >
                  {dropDown}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setDropDown("7 Days")} className="font-MontserratRegular text-[#333]">
                    7 Days
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setDropDown("14 Days")} className="font-MontserratRegular text-[#333]">
                    14 Days
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setDropDown("30 Days")} className="font-MontserratRegular text-[#333]">
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
