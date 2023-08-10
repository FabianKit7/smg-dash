var chartRange = 'Monthly';
var usercurrentFollowersCount = 0;
var withSprouty = 0;
var withoutSprouty = 0;
var username = '';
var [resultArray1, resultArray2] = [0, 0];
var [weeklyR1, weeklyR2] = [0, 0];
var [dailyR1, dailyR2] = [0, 0];

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
        document.querySelector("#dailyChartEl").classList.add("hidden")
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
        document.querySelector("#dailyChartEl").classList.add("hidden")
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
        document.querySelector("#dailyChartEl").classList.remove("hidden")
        document.querySelector("#dailyChartEl").classList.add("block")

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

function generateMonthlyDates(months) {
    const currentDate = new Date();
    const dates = [];

    // for (let i = 0; i < months; i++) {
    //     currentDate.setMonth(currentDate.getMonth() + 1);
    //     const month = currentDate.getMonth() + 1;
    //     const year = currentDate.getFullYear() % 100; // Get the last two digits of the year
    //     const formattedDate = `${month}/${year}`;
    //     dates.push(formattedDate);
    // }

    // return dates;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < months; i++) {
        currentDate.setMonth(currentDate.getMonth() + 1);
        const monthIndex = currentDate.getMonth();
        const monthName = monthNames[monthIndex];
        const year = currentDate.getFullYear() % 100; // Get the last two digits of the year
        const formattedDate = `${monthName}, ${year}`;
        dates.push(formattedDate);
    }

    return dates;
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

function getRandomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateArrays(baseNumber, weekly) {
    if (!baseNumber) return [0, 0];
    // console.log(baseNumber);
    // console.log(weekly);
    // baseNumber = 899999
    var withSproutyMin, withSproutyMax, withoutSproutyMin, withoutSproutyMax;
    if (baseNumber >= 1 && baseNumber <= 999) {
        withoutSproutyMin = 10;
        withoutSproutyMax = 30;
        withSproutyMin = 300;
        withSproutyMax = 800;
    } else if (baseNumber >= 1000 && baseNumber <= 1999) {
        withoutSproutyMin = 40;
        withoutSproutyMax = 50;
        withSproutyMin = 600;
        withSproutyMax = 1600;
    } else if (baseNumber >= 2000 && baseNumber <= 4999) {
        withoutSproutyMin = 70;
        withoutSproutyMax = 80;
        withSproutyMin = 900;
        withSproutyMax = 2000;
    } else if (baseNumber >= 5000 && baseNumber <= 9999) {
        withoutSproutyMin = 100;
        withoutSproutyMax = 150;
        withSproutyMin = 1000;
        withSproutyMax = 2000;
    } else if (baseNumber >= 10000 && baseNumber <= 19999) {
        withoutSproutyMin = 150;
        withoutSproutyMax = 200;
        withSproutyMin = 1000;
        withSproutyMax = 2000;
    } else if (baseNumber >= 20000 && baseNumber <= 49999) {
        withoutSproutyMin = 350;
        withoutSproutyMax = 500;
        withSproutyMin = 1500;
        withSproutyMax = 3500;
    } else if (baseNumber >= 50000) {
        withoutSproutyMin = 750;
        withoutSproutyMax = 1500;
        withSproutyMin = 1500;
        withSproutyMax = 3500;
    }

    var m1Min = weekly ? withSproutyMin / weekly : withSproutyMin;
    var m1Max = weekly ? withSproutyMax / weekly : withSproutyMax;
    var m2Min = weekly ? withoutSproutyMin / weekly : withoutSproutyMin;
    var m2Max = weekly ? withoutSproutyMax / weekly : withoutSproutyMax;
    const array1 = [baseNumber + getRandomNumberInRange(m1Min, m1Max)];
    const array2 = [baseNumber + getRandomNumberInRange(m2Min, m2Max)];

    for (let i = 1; i < 12; i++) {
        const prev1 = array1[i - 1];
        const prev2 = array2[i - 1];

        const next1 = prev1 + getRandomNumberInRange(m1Min, m1Max);
        const next2 = prev2 + getRandomNumberInRange(m2Min, m2Max);

        array1.push(next1);
        array2.push(next2);
    }

    return [array1, array2];
}

const renderMonthlyChart = () => {
    var options = {
        colors: ["#ef5f3c", "#c1c1c1"],
        legend: {
            show: false
        },
        series: [
            {
                name: 'SproutySocial',
                // data: resultArray1?.slice(),
                data: resultArray1?.slice(-11),
            },
            {
                name: 'Others',
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
            type: 'category',
            categories: generateMonthlyDates(11),
            labels: {
                offsetX: 3,
                // formatter: function (value, timestamp, opts) {
                //     const date = new Date(timestamp);
                //     const month = (date.getMonth() + 1).toString().padStart(2, '0');
                //     const day = date.getDate().toString().padStart(2, '0');
                //     return month + '/' + day;
                // }
            }
        },
        yaxis: {
            show: false,
        }
    };

    return options
}

function divideNumber(number) {
    const numbers = [];
    let remaining = number;

    for (let i = 0; i < 4 - 1; i++) {
        const min = Math.floor(remaining / (4 - i) * 0.8); // Adjust the factor (0.8) as needed
        const max = Math.ceil(remaining / (4 - i) * 1.2); // Adjust the factor (1.2) as needed
        const currentNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        numbers.push(currentNumber);
        remaining -= currentNumber;
    }

    numbers.push(remaining);
    return numbers;
}

function generateDailyData(array) {
    const result = [];

    array.forEach(item => {
        const p = divideNumber(item - usercurrentFollowersCount);
        p.forEach(i => {
            result.push(i);
        });

    });

    console.log(array);
    console.log(result);
    return result;
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

function generateWeeklyData(array) {
    const newArray = [];

    // Loop through the given array
    for (let i = 0; i < array.length; i++) {
        const divided = distributeAndSortArray(divideAndSortNumber(array[i]));
        newArray.push(...divided);
    }

    // Remove the first 4 values
    // const trimmedArray = newArray.slice(16);
    const trimmedArray = newArray;
    return trimmedArray.slice(0, 8);
}

const renderWeeklyChart = () => {
    if (!weeklyR1 || weeklyR1?.length === 0) {
        const [r1, r2] = generateArrays(usercurrentFollowersCount, 4);
        weeklyR1 = r1;
        weeklyR2 = r2
    }
    var options = {
        colors: ["#ef5f3c", "#c1c1c1"],
        legend: {
            show: false
        },
        series: [
            {
                name: 'SproutySocial',
                // data: resultArray1?.slice(0, 8),
                // data: generateWeeklyData(resultArray1),
                data: weeklyR1?.slice(0, 8),
            },
            {
                name: 'Others',
                // data: resultArray2?.slice(0, 8),
                // data: generateWeeklyData(resultArray2),
                data: weeklyR2?.slice(0, 8),
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
    // if (!dailyR1 || dailyR1?.length === 0) {
    //     const [r1, r2] = generateArrays(usercurrentFollowersCount, 4);
    //     dailyR1 = r1;
    //     dailyR2 = r2
    // }
    if (!weeklyR1 || weeklyR1?.length === 0) {
        const [r1, r2] = generateArrays(usercurrentFollowersCount, 4);
        weeklyR1 = r1;
        weeklyR2 = r2
    }

    console.log(weeklyR1[0]);

    var options = {
        colors: ["#ef5f3c", "#c1c1c1"],
        legend: {
            show: false
        },
        series: [
            {
                name: 'SproutySocial',
                data: generateDailyData(weeklyR1).slice(0, 7),
                // data: dailyR1?.slice(0, 7),
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
            categories: generateDates(7),
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
    if (!username) return { message: 'no username' }

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

function calculatePercentageDifference(num1, num2) {
    // Calculate the absolute difference between the numbers
    const difference = Math.abs(num1 - num2);

    // Calculate the percentage difference
    const percentageDifference = (difference / ((num1 + num2) / 2)) * 100;

    return percentageDifference;
}

window.addEventListener('DOMContentLoaded', async () => {
    const res = await getUserData()
    if (res?.message === 'success') {
        // console.log(res.data);
        const user = res.data
        if (user) {
            const buttons = document.querySelectorAll('.custom-button-content');
            buttons.forEach(button => {
                button.textContent = `Start Free Trial @${user.username}`;
            });
            usercurrentFollowersCount = user.follower_count
            var [r1, r2] = generateArrays(usercurrentFollowersCount);
            // console.log(r1, r2);
            resultArray1 = r1
            resultArray2 = r2
            withSprouty = getLastItem(r1)
            withoutSprouty = getLastItem(r2)
            // console.log(calculatePercentageDifference(50, 70));
            // console.log(calculatePercentageDifference(withSprouty, withoutSprouty));

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
                                <img alt="" class="platform-logo" src="https://app.SproutySocial.com/instagram.svg"
                                    width="28px" height="28px">
                                <div class="font-black text-base lg:text-2xl text-black-r font-MontserratBold">
                                    Growth Trajectory for @${user.username}
                                </div>
                            </div>
    
                            <div class="hidden lg:block relative rounded-[10px] bg-black-r text-white-r bg-white text-black text-lg font-bold">
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
                                <div class="chartRangeDropdown absolute w-full top-full left-0 rounded-[10px] z-[2] text-black-r bg-white opacity-0 pointer-events-none"
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
                                        src="${user.profile_pic_url}"
                                        alt="">
                                    <div class="flex flex-col text-base lg:text-2xl">
                                        <div class="flex items-center gap-1">${user.full_name}<img alt=""
                                                class="lg:hidden platform-logo"
                                                src="https://app.SproutySocial.com/instagram.svg" width="16px"
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
                                    <div class="lg:hidden px-[13px] ml-2 h-[32px] rounded-[10px] flex items-center justify-center cursor-pointer bg-black-r text-white-r bg-white text-black"
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
                                    <div class="chartRangeDropdown absolute w-full top-full left-0 rounded-[10px] z-[2] text-black-r bg-white opacity-0 pointer-events-none"
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
                                class="mt-4 bg-[#f8f8f8] text-[#757575] md:text-black-r md:bg-transparent lg:mt-0 w-full rounded-[10px]">
                                <div class="flex justify-between items-center gap-1 lg:gap-4 w-full text-center">
                                    <div class="text-[#757575] md:text-black-r md:w-[220px] lg:w-[180px] xl:w-[220px] cursor-pointer rounded-[10px] flex flex-col justify-center itext-center p-2 lg:pt-3 xl:pr-4 lg:pb-[2px] lg:pl-5 lg:shadow-[0_0_3px_#ffffff40]"
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
                                    <div class="bg-[#EF5F3C] text-white md:w-[220px] lg:w-[180px] xl:w-[220px] cursor-pointer rounded-[10px] flex flex-col justify-center itext-center p-2 lg:pt-3 xl:pr-4 lg:pb-[2px] lg:pl-5 lg:shadow-[0_0_3px_#ffffff40]"
                                        style="transition: all 0.15s ease-in 0s;">
                                        <div
                                            class="text-[12px] font-MontserratSemiBold lg:text-[16px] font-[600]">
                                            with Sprouty</div>
                                        <div
                                            class="text-[24px] lg:text-4xl lg:leading-[54px] font-MontserratBold font-bold">
                                            ${numFormatter(withSprouty)}${withSprouty >= 1000000 ? '+' : ''}
                                        </div>
                                    </div>
                                    <div class="text-[#757575] md:text-black-r md:w-[220px] lg:w-[180px] xl:w-[220px] cursor-pointer rounded-[10px] flex flex-col justify-center itext-center p-2 lg:pt-3 xl:pr-4 lg:pb-[2px] lg:pl-5 lg:shadow-[0_0_3px_#ffffff40]"
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