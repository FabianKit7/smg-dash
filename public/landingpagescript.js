var chartRange = 'Monthly';
var usercurrentFollowersCount = 0;
var withSprouty = 0;
var withoutSprouty = 0;
var username = '';
var [resultArray1, resultArray2] = [0,0];

const chartRangetoggleDropdown = () => {
    const chartRangeDropdownEl = document.querySelectorAll('.chartRangeDropdown')
    chartRangeDropdownEl.forEach(chartRangeDropdown => {
        if (chartRangeDropdown.classList.contains('opacity-0')) {
            chartRangeDropdown.classList.remove('opacity-0', 'pointer-events-none')
            chartRangeDropdown.classList.add('opacity-100', 'pointer-events-all')
        } else {
            chartRangeDropdown.classList.remove('opacity-100', 'pointer-events-all')
            chartRangeDropdown.classList.add('opacity-0', 'pointer-events-none')
        }
    });
}

const toggleChartRangeDropdown = (range) => {
    chartRange = range.toString()
    const selectedRange = document.querySelector('#selectedRange')
    selectedRange.textContent = range.toString();

    chartRangetoggleDropdown();

    if (chartRange === 'Monthly') {
        const options = renderMonthlyChart();
        document.querySelector("#chart2").classList.add("hidden")
        document.querySelector("#chart1").classList.remove("hidden")
        document.querySelector("#chart1").classList.add("block")
        const el = document.querySelector("#chart1")
        if (el) {
            var chart = new ApexCharts(el, options);
            chart.render();
        }
    } else if (chartRange === 'Weekly') {
        const options = renderWeeklyChart()
        document.querySelector("#chart1").classList.add("hidden")
        document.querySelector("#chart2").classList.remove("hidden")
        document.querySelector("#chart2").classList.add("block")
        const el = document.querySelector("#chart2")
        if (el) {
            var chart = new ApexCharts(el, options);
            chart.render();
        }
    }

    else {
        document.querySelector("#chart1").classList.add("hidden")
        document.querySelector("#chart2").classList.add("hidden")

        const options = renderDailyChart();
        const dailyChartEl = document.querySelector("#dailyChartEl")
        if (dailyChartEl) {
            var chart = new ApexCharts(dailyChartEl, options);
            chart.render();
        }
    }
}

function generateDates(range) {
    var dateList = [];
    var currentDate = new Date();

    // Generate dates for the next 11 days
    for (var i = 0; i < range; i++) {
        var date = new Date(currentDate.getTime() + (i * 24 * 60 * 60 * 1000));
        var formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
        dateList.push(formattedDate);
    }

    return dateList;
}

function generateWeeklyDateRanges(range) {
    var dateRangeList = [];
    var currentDate = new Date();

    // Get the current day of the week (00, 6, where 0 represents Sunday)
    var currentDayOfWeek = currentDate.getDay();

    // Calculate the first day of the current week
    var firstDayOfWeek = new Date(currentDate.getTime() - (currentDayOfWeek * 24 * 60 * 60 * 1000));

    // Generate date ranges for the next 'range' weeks
    for (var i = 0; i < range; i++) {
        var startDate = new Date(firstDayOfWeek.getTime() + (i * 7 * 24 * 60 * 60 * 1000));
        var endDate = new Date(startDate.getTime() + (6 * 24 * 60 * 60 * 1000));

        var formattedStartDate = `${startDate.getMonth() + 1}/${startDate.getDate()}`;
        var formattedEndDate = `${endDate.getMonth() + 1}/${endDate.getDate()}`;

        var dateRange = `${formattedStartDate} - ${formattedEndDate}`;
        dateRangeList.push(dateRange);
    }

    return dateRangeList;
}

function generateArrays(baseNumber) {
    const array1 = [];
    const array2 = [];

    let previousNumber = baseNumber;

    for (let i = 0; i < 11; i++) {
        // Generate random numbers for array1 within the range 700-1100
        const random1 = Math.floor(Math.random() * 401) + 700;
        const number1 = random1 + previousNumber;
        array1.push(number1);

        // Generate random numbers for array2 within the range 1000-3000
        const random2 = Math.floor(Math.random() * 2001) + 1000;
        array2.push(random2);

        previousNumber = number1;
    }

    return [array1, array2];
}

// function generateListO(targetSum) {
//     let values = [];
//     let currentSum = 0;

//     for (let i = 0; i < 30; i++) {
//         let maxVal = Math.ceil(targetSum - currentSum - (30 - i));
//         let minVal = Math.max(Math.floor((targetSum - currentSum) / (30 - i)), 1);

//         let value = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;

//         values.push(value);
//         currentSum += value;
//     }

//     values.push(targetSum - currentSum);

//     return values;
// }

function generateList(number) {
    const list = [];
    let remaining = number;

    for (let i = 0; i < 30; i++) {
        const value = Math.ceil(remaining / (31 - i));
        list.push(value);
        remaining -= value;
    }

    list.push(remaining); // Add the remaining value to the list

    return list;
}

const renderMonthlyChart = () => {
    var options = {
        colors: ["#ef5f3c", "#c1c1c1"],
        legend: {
            show: false
        },
        series: [
            {
                name: 'sproutysocial',
                // data: resultArray1?.slice(),
                data: resultArray1?.slice(-11),
            },
            {
                name: 'normal',
                data: resultArray2?.slice(-11),
            }
        ],
        chart: {
            height: 450,
            type: 'line',
            toolbar: {
                show: false,
            },
            id: 'areachart'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            // curve: 'straight',
            // width: [2, 1],
            width: 3,
        },
        grid: {
            show: false,
            padding: {
                left: 8,
                right: 8,
            },
        },
        tooltip: {
            enabled: true,
        },
        xaxis: {
            type: 'datetime',
            categories: generateDates(11),
            labels: {
                offsetX: 3,
                formatter: function (value, timestamp, opts) {
                    const date = new Date(timestamp);
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const day = date.getDate().toString().padStart(2, '0');
                    return month + '/' + day;
                }
            }
        },
        yaxis: {
            show: false,
        }
    };

    return options
}

function generateList(number) {
    const list = [];
    let remaining = number;

    for (let i = 0; i < 30; i++) {
        const minValue = Math.ceil(remaining / (31 - i) - 2);
        const maxValue = Math.floor(remaining / (31 - i) + 2);

        const value = Math.floor(Math.random() * (maxValue - minValue + 1) + minValue);
        list.push(value);
        remaining -= value;
    }

    list.push(remaining); // Add the remaining value to the list

    return list;
}

function divideAndSortNumber(number) {
    const parts = [];
    let remainder = number;

    // Divide the number into four parts
    for (let i = 0; i < 3; i++) {
        const part = Math.floor(remainder / (4 - i));
        parts.push(part);
        remainder -= part;
    }
    parts.push(remainder + 1); // Add 1 to the last part for a larger difference

    // Sort the parts in ascending order
    parts.sort((a, b) => a - b);

    // Return the result
    return parts;
}

function distributeAndSortArray(array) {
    // Sort the array in ascending order
    const sortedArray = array.sort((a, b) => a - b);

    const result = [];
    const length = sortedArray.length;

    // Calculate the increment based on the maximum value and array length
    const increment = Math.ceil(sortedArray[length - 1] / length);

    // Distribute the values with a minimum difference of increment
    for (let i = 0; i < length; i++) {
        const distributedValue = sortedArray[0] + (i * increment);
        result.push(distributedValue);
    }

    return result;
}

function generateWeeklyData(array) {
    console.log(array);
    const newArray = [];

    // Loop through the given array
    for (let i = 0; i < array.length; i++) {
        const divided = distributeAndSortArray(divideAndSortNumber(array[i]));
        newArray.push(...divided);
    }

    // Remove the first 4 values
    const trimmedArray = newArray.slice(16);
    console.log(newArray.slice(0, 8));
    console.log(trimmedArray.slice(0, 8));
    return trimmedArray.slice(0, 8);
}


const renderWeeklyChart = () => {
    var options = {
        colors: ["#ef5f3c", "#c1c1c1"],
        legend: {
            show: false
        },
        series: [
            {
                name: 'sproutysocial',
                // data: resultArray1?.slice(0, 8),
                data: generateWeeklyData(resultArray1),
            },
            {
                name: 'normal',
                // data: resultArray2?.slice(0, 8),
                data: generateWeeklyData(resultArray2),
            }
        ],
        chart: {
            height: 450,
            type: 'line',
            toolbar: {
                show: false,
            },
            id: 'areachart'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            // curve: 'straight',
            // width: [2, 1],
            width: 3,
        },
        grid: {
            show: false,
            padding: {
                left: 8,
                right: 8,
            },
        },
        tooltip: {
            enabled: true,
        },
        xaxis: {
            type: 'category',
            categories: generateWeeklyDateRanges(8),
            labels: {
                offsetX: 3,
            }
        },
        yaxis: {
            show: false,
        }
    };

    return options
}

const renderDailyChart = () => {
    var options = {
        colors: ["#ef5f3c", "#c1c1c1"],
        legend: {
            show: false
        },
        series: [
            {
                name: 'sproutysocial',
                // data: generateWeeklyData(resultArray1, false)?.slice(-31),
                data: generateList(10200)
            }
        ],
        chart: {
            height: 450,
            type: 'bar',
            toolbar: {
                show: false,
            },
            id: 'areachart'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            // curve: 'straight',
            // width: [2, 1],
            width: 3,
        },
        grid: {
            show: false,
            padding: {
                left: 8,
                right: 8,
            },
        },
        tooltip: {
            enabled: true,
        },
        xaxis: {
            type: 'category',
            categories: generateDates(31),
            labels: {
                offsetX: 3,
                // formatter: function (value, timestamp, opts) {
                //     const date = new Date(timestamp);
                //     const month = (date.getMonth() + 1).toString().padStart(2, '0');
                //     const day = date.getDate().toString().padStart(2, '0');
                //     return month + '/' + day;
                // }
                datetimeFormatter: {
                    year: 'yyyy',
                    month: 'MMM yyyy',
                    week: 'MMM dd',
                    day: 'MMM dd',
                },
            }
        },
        yaxis: {
            show: false,
        }
    };

    return options
}

function getUsernameFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('username');
}

async function getUserData() {
    const username = getUsernameFromURL();

    const url = "https://instagram-bulk-profile-scrapper.p.rapidapi.com/clients/api/ig/ig_profile";
    const params = { ig: username, response_type: "short", corsEnabled: "true" };

    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": "47e2a82623msh562f6553fe3aae6p10b5f4jsn431fcca8b82e",
            "X-RapidAPI-Host": "instagram-bulk-profile-scrapper.p.rapidapi.com",
        },
    };

    const r = await fetch(`${url}?${new URLSearchParams(params)}`, options)
        .then(response => response.json())
        .then(data => {
            var res = { message: 'success', data: data?.[0] }
            return res
        })
        .catch(error => {
            // Handle errors
            console.log(error);
            return { message: error?.message }
        });
    return r
}

const numFormatter = (num = 0) => {
    if (num > 999 && num <= 999949) {
        return `${(num / 1000).toFixed(1)}k`
    }

    if (num > 999949) {
        return `${(num / 1000000).toFixed(1)}m`
    }

    if (num === 0) return 0

    if (num) {
        return num
    }
}

const getLastItem = (array) => array[array.length - 1]

window.addEventListener('DOMContentLoaded', async () => {
    const res = await getUserData()
    if (res?.message === 'success') {
        // console.log(res.data);
        const user = res.data
        if(user){
            usercurrentFollowersCount = user.follower_count
            var [r1, r2] = generateArrays(usercurrentFollowersCount);
            // console.log(r1, r2);
            resultArray1=r1
            resultArray2=r2
            withSprouty = getLastItem(r1)
            withoutSprouty = getLastItem(r2)
            
            // var username = user.username
    
    
            const root = document.getElementById('root');
            root.innerHTML = `
            <div class="rounded-xl overflow-hidden">
                <div class="flex items-center justify-end gap-[7px] bg-[#333D54] px-4 py-[4px] mb-4 lg:mb-0">
                    <div class="w-[10px] h-[10px] md:w-[15.64px] md:h-[15.64px] rounded-full bg-[#E30045]"></div>
                    <div class="w-[10px] h-[10px] md:w-[15.64px] md:h-[15.64px] rounded-full bg-[#FFC463]"></div>
                    <div class="w-[10px] h-[10px] md:w-[15.64px] md:h-[15.64px] rounded-full bg-[#33AB54]"></div>
                </div>
                <div>
                    <section class="hidden lg:block">
                        <div class="flex justify-between items-center rounded-[10px] h-[84px] px-4 mb-10"
                            style="box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 3px;">
                            <div class="ml-3 flex items-center gap-[10px]">
                                <img alt="" class="platform-logo" src="https://app.sproutysocial.com/instagram.svg"
                                    width="28px" height="28px">
                                <div class="font-black text-base lg:text-2xl text-black font-MontserratBold">
                                    Growth Trajectory for @${user.username}
                                </div>
                            </div>
    
                            <div class="hidden lg:block relative rounded-[10px] bg-black text-white text-lg font-bold">
                                <div class="flex items-center justify-center h-[52px] cursor-pointer"
                                    onclick="chartRangetoggleDropdown()">
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024"
                                        class="mr-[10px] ml-[16px]" height="28" width="28"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z">
                                        </path>
                                        <path
                                            d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z">
                                        </path>
                                    </svg>
                                    <span class="p-0 flex items-center" id="selectedRange">Monthly</span>
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512"
                                        class="w-[12px] mr-[16px] ml-[7px]" height="1em" width="1em"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z">
                                        </path>
                                    </svg>
                                </div>
                                <div class="chartRangeDropdown absolute w-full top-full left-0 rounded-[10px] z-[2] text-black bg-white opacity-0 pointer-events-none"
                                    style="box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 3px; transition: opacity 0.15s ease-in 0s;">
                                    <div class="py-4 px-[30px] hover:bg-[#f8f8f8] cursor-pointer"
                                        onclick="toggleChartRangeDropdown('Monthly')" id="Monthly">Monthly</div>
                                    <div class="py-4 px-[30px] hover:bg-[#f8f8f8] cursor-pointer"
                                        onclick="toggleChartRangeDropdown('Weekly')" id="Weekly">Weekly</div>
                                    <div class="py-4 px-[30px] hover:bg-[#f8f8f8] cursor-pointer"
                                        onclick="toggleChartRangeDropdown('Daily')" id="Daily">Daily</div>
                                </div>
                            </div>
                        </div>
                    </section>
    
                    <!-- section2 -->
                    <section>
                        <div
                            class="lg:mx-[40px] flex flex-col lg:flex-row justify-between items-center font-MontserratRegular">
                            <div class="w-full flex justify-between items-center">
                                <div class="flex items-center">
                                    <img class="w-[50px] h-[50px] lg:w-[100px] lg:h-[100px] rounded-[10px] lg:rounded-full mr-[12px] lg:mr-[20px]"
                                        src="${ user.profile_pic_url }"
                                        alt="">
                                    <div class="flex flex-col text-base lg:text-2xl">
                                        <div class="flex items-center gap-1">${user.full_name}<img alt=""
                                                class="lg:hidden platform-logo"
                                                src="https://app.sproutysocial.com/instagram.svg" width="16px"
                                                height="16px">
                                        </div>
                                        <div class="font-semibold text-[#757575]">@${user.username}</div>
                                        <div class="flex items-center">
                                            <div class="font-semibold font-MontserratSemiBold">with <span
                                                    class="text-[#EF5F3C]">SproutySocial</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="relative lg:hidden">
                                    <div class="lg:hidden px-[13px] ml-2 h-[32px] rounded-[10px] flex items-center justify-center cursor-pointer bg-black text-white"
                                        onclick="chartRangetoggleDropdown()">
                                        <strong class="text-[12px]">Monthly</strong>
                                        <svg stroke="currentColor" fill="currentColor" stroke-width="0"
                                            viewBox="0 0 320 512" class="w-[12px] ml-[7px]" height="1em" width="1em"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z">
                                            </path>
                                        </svg>
                                    </div>
                                    <div class="chartRangeDropdown absolute w-full top-full left-0 rounded-[10px] z-[2] text-black bg-white opacity-0 pointer-events-none"
                                        style="box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 3px; transition: opacity 0.15s ease-in 0s;">
                                        <div class="py-4 px-[30px] hover:bg-[#f8f8f8] cursor-pointer"
                                            onclick="toggleChartRangeDropdown('Monthly')" id="Monthly">Monthly</div>
                                        <div class="py-4 px-[30px] hover:bg-[#f8f8f8] cursor-pointer"
                                            onclick="toggleChartRangeDropdown('Weekly')" id="Weekly">Weekly</div>
                                        <div class="py-4 px-[30px] hover:bg-[#f8f8f8] cursor-pointer"
                                            onclick="toggleChartRangeDropdown('Daily')" id="Daily">Daily</div>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="mt-4 bg-[#f8f8f8] text-[#757575] md:text-black md:bg-transparent lg:mt-0 w-full rounded-[10px]">
                                <div class="flex justify-between items-center gap-1 lg:gap-4 w-full text-center">
                                    <div class="text-[#757575] md:text-black md:w-[220px] lg:w-[180px] xl:w-[220px] cursor-pointer rounded-[10px] flex flex-col justify-center itext-center p-2 lg:pt-3 xl:pr-4 lg:pb-[2px] lg:pl-5 lg:shadow-[0_0_3px_#00000040]"
                                        style="transition: all 0.15s ease-in 0s;">
                                        <div class="text-[12px] font-MontserratSemiBold lg:text-[16px] font-[500] false">
                                            Followers
                                        </div>
                                        <div
                                            class="flex flex-col lg:flex-row justify-between items-center text-center relative">
                                            <div
                                                class="text-[24px] lg:text-4xl lg:leading-[54px] font-MontserratBold font-bold w-full text-center">${numFormatter(user.follower_count)}</div>
                                            <div
                                                class="absolute lg:static top-[calc(100%-10px)] left-[50%] translate-x-[-50%] py-1 px-2 rounded-[7px] bg-[#c8f7e1] text-[#23df85] mt-1 hidden d-flex items-center gap-1 text-[10px] lg:text-[12px] font-bold font-MontserratBold lg:mr-[-32px] xl:mr-0">
                                                123 <svg stroke="currentColor" fill="currentColor" stroke-width="0"
                                                    viewBox="0 0 320 512" color="#1B89FF" height="12" width="12"
                                                    xmlns="http://www.w3.org/2000/svg" style="color: rgb(27, 137, 255);">
                                                    <path
                                                        d="M288.662 352H31.338c-17.818 0-26.741-21.543-14.142-34.142l128.662-128.662c7.81-7.81 20.474-7.81 28.284 0l128.662 128.662c12.6 12.599 3.676 34.142-14.142 34.142z">
                                                    </path>
                                                </svg></div>
                                        </div>
                                    </div>
                                    <div class="bg-[#EF5F3C] text-white md:w-[220px] lg:w-[180px] xl:w-[220px] cursor-pointer rounded-[10px] flex flex-col justify-center itext-center p-2 lg:pt-3 xl:pr-4 lg:pb-[2px] lg:pl-5 lg:shadow-[0_0_3px_#00000040]"
                                        style="transition: all 0.15s ease-in 0s;">
                                        <div
                                            class="text-[12px] font-MontserratSemiBold lg:text-[16px] font-[600]">
                                            with Sprouty</div>
                                        <div
                                            class="text-[24px] lg:text-4xl lg:leading-[54px] font-MontserratBold font-bold">
                                            ${numFormatter(withSprouty)}
                                        </div>
                                    </div>
                                    <div class="text-[#757575] md:text-black md:w-[220px] lg:w-[180px] xl:w-[220px] cursor-pointer rounded-[10px] flex flex-col justify-center itext-center p-2 lg:pt-3 xl:pr-4 lg:pb-[2px] lg:pl-5 lg:shadow-[0_0_3px_#00000040]"
                                        style="transition: all 0.15s ease-in 0s;">
                                        <div
                                            class="text-[12px] font-MontserratSemiBold lg:text-[16px] font-[600] text-[#333]">
                                            without Sprouty</div>
                                        <div
                                            class="text-[24px] lg:text-4xl lg:leading-[54px] font-MontserratBold font-bold">
                                            ${numFormatter(withoutSprouty)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
    
                    <section class="py-5 lg:px-10">
                        <div class="">
                            <div id="chart1"></div>
                            <div id="chart2"></div>
                            <div id="dailyChartEl"></div>
                        </div>
                    </section>
                </div>
            </div>
            `
    
            const options = renderMonthlyChart();
            document.querySelector("#chart2").classList.add("hidden")
            document.querySelector("#chart1").classList.remove("hidden")
            document.querySelector("#chart1").classList.add("block")
            const el = document.querySelector("#chart1")
            if (el) {
                var chart = new ApexCharts(el, options);
                chart.render();
            }            
        }
    }

})