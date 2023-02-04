import { useEffect, useState } from "react";
import { BsArrowDown, BsArrowUp } from "react-icons/bs"

const StatsCard = ({ userData, sessionsData }) => {
    // console.log(userData);
    const [_7daysGrowth, set_7daysGrowth] = useState(0)
    const [_7daysGrowthPercent, set_7daysGrowthPercent] = useState(0)
    const [_30daysGrowth, set_30daysGrowth] = useState(0)
    const [_30daysGrowthPercent, set_30daysGrowthPercent] = useState(0)
    const [total_interactions, setTotal_interactions] = useState(0)

    // const data = sessionsData //.reverse();
    // console.log({sessionsData});
    // console.log({data});
    useEffect(() => {
        const last7days = sessionsData.slice(0, 7)
        const last7days_prev = sessionsData.slice(8, 15)
        const last30days = sessionsData.slice(0, 30)
        const last30days_prev = sessionsData.slice(31, 61)
        
        var last7daysSum = 0
        var prev_last7daysSum = 0
        var last30daysSum = 0
        var prev_last30daysSum = 0
        last7days.forEach(item => {
            last7daysSum += item.profile.followers;
        });
        last7days_prev.forEach(item => {
            prev_last7daysSum += item.profile.followers;
        });
        last30days.forEach(item => {
            last30daysSum += item.profile.followers;
        });
        last30days_prev.forEach(item => {
            prev_last30daysSum += item.profile.followers;
        });

        const minMax = (arr) => {
            let arr1 = [];
            if (arr) {
                arr1.push(Math.min(...arr));
                arr1.push(Math.max(...arr));
                return arr1
            }
            return null;
        };
        const percentInc = (current, prev) => {
            const minMaxValues = minMax([current, prev]);
            if (minMaxValues) {
                const a = minMaxValues[0];
                const b = minMaxValues[1];

                return `${prev > current ? '-' : '+'}${((a / b) * 100).toFixed(2)}`
            }
            return 0;
        }

        set_7daysGrowthPercent(percentInc(last7daysSum, prev_last7daysSum))
        set_30daysGrowthPercent(percentInc(last30daysSum, prev_last30daysSum))

        set_7daysGrowth(last7daysSum - prev_last7daysSum)
        set_30daysGrowth(last30daysSum - prev_last30daysSum)

        var count = 0;
        for (let i = 0; i < sessionsData.length; i++) {
            count += parseInt(sessionsData[i].total_interactions)
        }
        // setTotal_interactions(sessionsData[0]?.total_interactions)
        setTotal_interactions(count)
    }, [sessionsData])

    // console.log(last7daysSum);
    function nFormatter(num, digits = 1) {
        // console.log(digits);
        const lookup = [
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "k" },
            { value: 1e6, symbol: "M" },
            { value: 1e9, symbol: "G" },
            { value: 1e12, symbol: "T" },
            { value: 1e15, symbol: "P" },
            { value: 1e18, symbol: "E" }
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var item = lookup.slice().reverse().find(function (item) {
            return num >= item.value;
        });
        return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
    }

    return (
        <>
            <div className="container mx-auto p-0">
                <div className="section mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center gap-6">
                    <div className="shadow-stats flex flex-col items-center md:items-start rounded-lg p-4">
                        <div className="flex gap-[10px]">
                            <div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10">
                                <BsArrowUp className="absolute text-btngreen font-semibold" />
                            </div>
                            <h2 className="font-bold text-[30px] text-gray20">Status</h2>
                        </div>
                        <p className="pt-4 pb-4 font-normal text-sm">Your status is <span className="font-bold">{userData?.status}</span></p>
                        <p className="font-normal text-sm opacity-40">
                            {userData?.status === 'pending' && <span>Please <span className="text-red-600">input your password</span> in order to allow us to log in.</span>}
                            {userData?.status === 'paused' && 'Please contact support or renew your plan'}
                            {userData?.status === 'active' && 'Your status is Active.'}
                        </p>
                    </div>
                    <div className="shadow-stats flex flex-col items-center md:items-start rounded-lg p-4">
                        <div className="flex gap-[10px]">
                            {_7daysGrowth >= 0 ?
                                <div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10">
                                    <BsArrowUp className="absolute text-btngreen font-semibold" />
                                </div>
                                :
                                <div className="rounded-[50%] bg-bgiconred p-3 relative w-10 h-10">
                                    <BsArrowDown className="absolute text-btnred font-semibold" />
                                </div>
                            }

                            {_7daysGrowth >= 0 ?
                                <h2 className="font-bold text-[30px] text-gray20">+</h2>
                                :
                                <h2 className="font-bold text-[30px] text-gray20">-</h2>
                            }
                            <h2 className="font-bold text-[30px] text-gray20">{nFormatter(Math.abs(_7daysGrowth)) || 'NAN'}</h2>
                        </div>
                        <p className="pt-4 pb-4 font-normal text-sm">Last <span className="font-bold">7 days</span> Follower Growth</p>
                        <p className="font-normal text-sm opacity-40"><span className="font-bold">{_7daysGrowthPercent}</span>% increase from last week</p>
                    </div>
                    <div className="shadow-stats flex flex-col items-center md:items-start rounded-lg p-4">
                        <div className="flex gap-[10px]">
                            {_30daysGrowth >= 0 ?
                                <div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10">
                                    <BsArrowUp className="absolute text-btngreen font-semibold" />
                                </div>
                                :
                                <div className="rounded-[50%] bg-bgiconred p-3 relative w-10 h-10">
                                    <BsArrowDown className="absolute text-btnred font-semibold" />
                                </div>
                            }

                            {_30daysGrowth >= 0 ?
                                <h2 className="font-bold text-[30px] text-gray20">+</h2>
                                :
                                <h2 className="font-bold text-[30px] text-gray20">-</h2>
                            }
                            <h2 className="font-bold text-[30px] text-gray20">{nFormatter(Math.abs(_30daysGrowth)) || 'NAN'}</h2>
                        </div>
                        <p className="pt-4 pb-4 font-normal text-sm">Last <span className="font-bold">30 days</span> Follower Growth</p>
                        <p className="font-normal text-sm opacity-40"><span className="font-bold">{_30daysGrowthPercent}</span>% increase from last week</p>
                    </div>
                    <div className="shadow-stats flex flex-col items-center md:items-start rounded-lg p-4">
                        <div className="flex gap-[10px]">
                            <div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10">
                                <BsArrowUp className="absolute text-btngreen font-semibold" />
                            </div>
                            <h2 className="font-bold text-[30px] text-gray20">{nFormatter(total_interactions)}</h2>
                        </div>
                        <p className="pt-4 pb-4 font-normal text-sm">Total Interactions</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StatsCard