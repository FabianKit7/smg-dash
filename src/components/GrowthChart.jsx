import React, { useState } from "react";
import Chart from "react-apexcharts";
import { getThDayNameFromDate, numFormatter } from "../helpers";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from "react-bootstrap/Dropdown";

export default function GrowthChart({ data }) {
  const [dropDown, setDropDown] = useState("7 days");
  // const categories = data
  //   .map((account) => getThDayNameFromDate(account.created_at))
  //   .reverse();
  
  const userData = [
    {date: '2023/1/1', count: 23, user_id: 3},
    {date: '2023/1/2', count: 344, user_id: 3},
    {date: '2023/1/3', count: 34, user_id: 3},
    {date: '2023/1/4', count: 233, user_id: 3},
    {date: '2023/1/5', count: 423, user_id: 3},
    {date: '2023/1/6', count: 253, user_id: 3},
    {date: '2023/1/7', count: 923, user_id: 3},
    {date: '2023/1/8', count: 723, user_id: 3},
    {date: '2023/1/9', count: 423, user_id: 3},
    {date: '2023/1/10', count: 623, user_id: 3},
    {date: '2023/1/11', count: 233, user_id: 3},
    {date: '2023/1/12', count: 723, user_id: 3},
    {date: '2023/1/13', count: 523, user_id: 3},
    {date: '2023/1/14', count: 323, user_id: 3},
    {date: '2023/1/15', count: 223, user_id: 3},
    {date: '2023/1/16', count: 273, user_id: 3},
    {date: '2023/1/17', count: 523, user_id: 3},
    {date: '2023/1/18', count: 423, user_id: 3},
    {date: '2023/1/19', count: 223, user_id: 3},
    {date: '2023/1/20', count: 623, user_id: 3},
    {date: '2023/1/21', count: 423, user_id: 3},
    {date: '2023/1/22', count: 23, user_id: 3},
    {date: '2023/1/23', count: 623, user_id: 3},
    {date: '2023/1/24', count: 423, user_id: 3},
    {date: '2023/1/25', count: 323, user_id: 3},
    {date: '2023/1/26', count: 223, user_id: 3},
    {date: '2023/1/27', count: 623, user_id: 3},
    {date: '2023/1/28', count: 423, user_id: 3},
    {date: '2023/1/29', count: 623, user_id: 3},
    {date: '2023/1/30', count: 323, user_id: 3},
    {date: '2023/1/31', count: 623, user_id: 3},
  ]
  const followersData = []
  const categories = []
  const dl = dropDown.split(' ')
  userData.slice(-parseInt(dl[0])).forEach(items => {
    categories.push(items.date);
    followersData.push(items.count);
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
