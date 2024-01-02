import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { monthNames } from "../helpers";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ColumnChart({ type, sessionsData, days }) {
  const [followersData, setFollowersData] = useState([]);
  const [categories, setCategories] = useState([]);

  // useEffect(() => {
  //   let followersData = []
  //   let categories = []
  //   sessionsData?.slice(-days).forEach(items => {
  //     const day = new Date((items?.start_time)?.replace(/-/g, "/")).getDate()
  //     const month = new Date((items?.start_time)?.replace(/-/g, "/")).getMonth()
  //     const monthName = monthNames[month]
  //     categories.push(`${monthName} ${day}`);
  //     if(type === "total_interactions"){
  //       followersData.push(items.total_interactions);
  //       return;
  //     }
  //     followersData.push(items.profile[type]);
  //   })
  //   setCategories(categories);
  //   setFollowersData(followersData)

  // }, [sessionsData, days, type])

  useEffect(() => {
    // Function to merge objects based on the same day of start_time
    function mergeObjectsByDay(data) {
      const mergedData = data.reduce((acc, obj) => {
        const day = obj.start_time.split(" ")[0]; // Extracting the day portion from start_time

        if (!acc[day]) {
          acc[day] = { ...obj }; // Create a new entry for the day
        } else {
          acc[day] = { ...acc[day], ...obj }; // Merge the properties if day entry exists
        }

        return acc;
      }, {});

      return Object.values(mergedData);
    }

    function mergeObjectsByDayWithTotalInteractions(data) {
      const mergedData = data.reduce((acc, obj) => {
        // console.log("dfsdata");
        // console.log(data, '\n');

        console.log("acc, obj");
        console.log(acc, obj, "\n");
        const day = obj.start_time.split(" ")[0]; // Extracting the day portion from start_time
        console.log(day, "\n");

        if (!acc[day]) {
          acc[day] = { ...obj }; // Create a new entry for the day
        } else {
          // Merge the properties if day entry exists
          // console.log('acc', acc[day], '\n');
          // console.log('obj', obj, '\n');

          const gsgx =
            (acc[day].total_interactions || 0) + obj.total_interactions;
          // console.log(gsgx);
          const gsg1 = (acc[day].total_followed || 0) + obj.total_followed;
          const gsg2 = (acc[day].total_likes || 0) + obj.total_likes;
          const gsg3 = (acc[day].total_comments || 0) + obj.total_comments;
          const gsg4 = (acc[day].total_pm || 0) + obj.total_pm;
          const gsg5 = (acc[day].total_watched || 0) + obj.total_watched;
          const gsg6 = (acc[day].total_unfollowed || 0) + obj.total_unfollowed;
          const gsg = gsg1 + gsg2 + gsg3 + gsg4 + gsg5 + gsg6;
          acc[day] = {
            ...acc[day],
            total_interactions: gsgx,
          };
        }

        return acc;
      }, {});
      return Object.values(mergedData);
    }

    function mergeObjectsByDayWithTotalInteractions2(data) {
      const mergedData = data.reduce((acc, obj) => {
        const day = obj.start_time.split(" ")[0]; // Extracting the day portion from start_time
        // day === "2024-01-01" && console.log(day);
        // day === "2024-01-01" && console.log("acc, obj");
        // day === "2024-01-01" && console.log(acc, obj);

        if (!acc[day]) {
          acc[day] = { ...obj }; // Create a new entry for the day
        } else {
          // Merge the properties if day entry exists
          // day === "2024-01-01" && console.log("acc", acc[day], "\n");
          // day === "2024-01-01" && console.log("obj", obj, "\n");

          // const gsgx =
          //   (acc[day].total_interactions || 0) + obj.total_interactions;
          // // day==='2024-01-01' && console.log(gsgx);
          // const gsg1 = (acc[day].total_followed || 0) + obj.total_followed;
          // const gsg2 = (acc[day].total_likes || 0) + obj.total_likes;
          // const gsg3 = (acc[day].total_comments || 0) + obj.total_comments;
          // const gsg4 = (acc[day].total_pm || 0) + obj.total_pm;
          // const gsg5 = (acc[day].total_watched || 0) + obj.total_watched;
          // const gsg6 = (acc[day].total_unfollowed || 0) + obj.total_unfollowed;
          // const gsg = gsg1 + gsg2 + gsg3 + gsg4 + gsg5 + gsg6;

          acc[day] = {
            ...acc[day],
            total_interactions:
              (acc[day].total_interactions || 0) + obj.total_interactions,
            total_followed: (acc[day].total_followed || 0) + obj.total_followed,
            total_likes: (acc[day].total_likes || 0) + obj.total_likes,
            total_comments: (acc[day].total_comments || 0) + obj.total_comments,
            total_pm: (acc[day].total_pm || 0) + obj.total_pm,
            total_watched: (acc[day].total_watched || 0) + obj.total_watched,
            total_unfollowed:
              (acc[day].total_unfollowed || 0) + obj.total_unfollowed,
          };
          // day === "2024-01-01" && console.log("__");
          // day === "2024-01-01" && console.log("semi_final acc");
          // day === "2024-01-01" && console.log(acc);
          // day === "2024-01-01" && console.log("__");
        }
        // day === "2024-01-01" && console.log("final acc");
        // day === "2024-01-01" && console.log(acc);
        // day === "2024-01-01" && console.log(" =====");
        // day === "2024-01-01" && console.log(" =====");
        // day === "2024-01-01" && console.log(" =====");
        return acc;
      }, {});
      return Object.values(mergedData);
    }

    let followersData = [];
    let categories = [];
    var mSessionsData = sessionsData;
    if (type === "following") {
      mSessionsData = mergeObjectsByDay(sessionsData);
    } else {
      mSessionsData = mergeObjectsByDayWithTotalInteractions2(sessionsData);
    }
    mSessionsData?.slice(-days).forEach((items) => {
      const dateParts = items?.start_time?.split(/[- :]/); // Split date string into parts
      // const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; // Adjust month (zero-based index)
      const day = parseInt(dateParts[2]);

      // const sessionDate = new Date(year, month, day); // Create Date object

      const monthName = monthNames[month];
      categories.push(`${monthName} ${day}`);

      let followerValue;
      if (type === "total_interactions") {
        // followerValue = items.total_interactions;
        followerValue =
          items.total_followed +
          items.total_likes +
          items.total_comments +
          items.total_pm +
          items.total_watched +
          items.total_unfollowed;
      } else {
        followerValue = items.profile[type];
      }
      followersData.push(followerValue);
    });

    setCategories(categories);
    setFollowersData(followersData);
  }, [sessionsData, days, type]);

  var colors = ["#dbc8be"];

  var options = {
    // series: [{
    //   data: [21, 22, 10, 28, 16, 21, 13, 30]
    // }],
    // chart: {
    //   height: 400,
    //   type: 'bar',
    //   events: {
    //     click: function (chart, w, e) {
    //       // console.log(chart, w, e)
    //     }
    //   }
    // },
    colors: colors,
    plotOptions: {
      bar: {
        columnWidth: "45%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      show: true,
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
      axisTicks: {
        show: true,
      },
      labels: {
        offsetX: -15,
        offsetY: 0,
        formatter: function (val, index) {
          return val.toLocaleString("en-US", { maximumFractionDigits: 2 });
        },
      },
    },
    // xaxis: {
    //   categories: [
    //     ['John', 'Doe'],
    //     ['Joe', 'Smith'],
    //     ['Jake', 'Williams'],
    //     'Amber',
    //     ['Peter', 'Brown'],
    //     ['Mary', 'Evans'],
    //     ['David', 'Wilson'],
    //     ['Lily', 'Roberts'],
    //   ],
    //   labels: {
    //     style: {
    //       colors: colors,
    //       fontSize: '12px'
    //     }
    //   }
    // }
  };

  return (
    <div className="w-full rounded-lg">
      <div className="w-full text-white rounded-md">
        <div className="md:px-3">
          <Chart
            options={options}
            series={[
              {
                name:
                  type === "total_interactions" ? "Interactions" : "Following",
                data: followersData,
              },
            ]}
            type="bar"
            height="400"
          />
        </div>
      </div>
    </div>
  );
}
