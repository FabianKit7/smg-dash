import { BsArrowDown, BsArrowUp } from "react-icons/bs"

const StatsCard = ({ userData }) => {
    // console.log(userData);

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
                            {userData?.status === 'pending' && 'Please input your password in order to allow us to log in.'}
                            {userData?.status === 'paused' && 'Please contact support or renew your plan'}
                            {userData?.status === 'active' && 'Your status is Active.'}
                        </p>
                    </div>
                    <div className="shadow-stats flex flex-col items-center md:items-start rounded-lg p-4">
                        <div className="flex gap-[10px]">
                            {userData?.last_7_days_followers > 0 && userData?.last_7_days_followers_prev > 0 && <>{userData?.last_7_days_followers > userData?.last_7_days_followers_prev ?
                                <><div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10">
                                    <BsArrowUp className="absolute text-btngreen font-semibold" />
                                </div> <h2 className="font-bold text-[30px] text-gray20">+</h2></>
                                : <>
                                    <div className="rounded-[50%] bg-bgiconred p-3 relative w-10 h-10">
                                        <BsArrowDown className="absolute text-btnred font-semibold" />
                                    </div> <h2 className="font-bold text-[30px] text-gray20">-</h2></>
                            }</>}
                            <h2 className="font-bold text-[30px] text-gray20">{nFormatter(userData?.last_7_days_followers) || 'NAN'}</h2>
                        </div>
                        <p className="pt-4 pb-4 font-normal text-sm">Last <span className="font-bold">7 days</span> Follower Growth</p>
                        <p className="font-normal text-sm opacity-40"><span className="font-bold">
                            {percentInc(userData?.last_7_days_followers, userData?.last_7_days_followers_prev)}
                        </span>% increase from last week</p>
                    </div>
                    <div className="shadow-stats flex flex-col items-center md:items-start rounded-lg p-4">
                        <div className="flex gap-[10px]">
                            {userData?.last_30_days_followers > 0 && userData?.last_30_days_followers_prev > 0 && <>{userData?.last_30_days_followers > userData?.last_30_days_followers_prev ?
                                <><div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10">
                                    <BsArrowUp className="absolute text-btngreen font-semibold" />
                                </div> <h2 className="font-bold text-[30px] text-gray20">+</h2></>
                                : <>
                                    <div className="rounded-[50%] bg-bgiconred p-3 relative w-10 h-10">
                                        <BsArrowDown className="absolute text-btnred font-semibold" />
                                    </div> <h2 className="font-bold text-[30px] text-gray20">-</h2></>
                            }</>}
                            <h2 className="font-bold text-[30px] text-gray20">{nFormatter(userData?.last_30_days_followers) || 'NAN'}</h2>
                        </div>
                        <p className="pt-4 pb-4 font-normal text-sm">Last <span className="font-bold">30 days</span> Follower Growth</p>
                        <p className="font-normal text-sm opacity-40"><span className="font-bold">
                            {percentInc(userData?.last_30_days_followers, userData?.last_30_days_followers_prev)}
                        </span>% increase from last week</p>
                    </div>
                    <div className="shadow-stats flex flex-col items-center md:items-start rounded-lg p-4">
                        <div className="flex gap-[10px]">
                            <div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10">
                                <BsArrowUp className="absolute text-btngreen font-semibold" />
                            </div>
                            <h2 className="font-bold text-[30px] text-gray20">{nFormatter(userData?.total_interactions) || 0}</h2>
                        </div>
                        <p className="pt-4 pb-4 font-normal text-sm">Total Interactions</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StatsCard