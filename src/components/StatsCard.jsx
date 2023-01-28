import { BsArrowDown, BsArrowUp } from "react-icons/bs"

const StatsCard = ({ userData }) => {
    console.log(userData);
  return (
    <>
    <div className="container mx-auto p-0">
    <div className="section mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center gap-6">
        <div className="shadow-stats flex flex-col items-center md:items-start rounded-lg p-4">
            <div className="flex gap-[10px]">
                <div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10">
                    <BsArrowUp className="absolute text-btngreen font-semibold"/>
                </div>
                <h2 className="font-bold text-[30px] text-gray20">Status</h2>
            </div>
                      <p className="pt-4 pb-4 font-normal text-sm">Your status is <span className="font-bold">{userData?.status}</span></p>
        </div>
        <div className="shadow-stats flex flex-col items-center md:items-start rounded-lg p-4">
            <div className="flex gap-[10px]">
                <div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10">
                    <BsArrowUp className="absolute text-btngreen font-semibold"/>
                </div>
                <h2 className="font-bold text-[30px] text-gray20">+301.97k</h2>
            </div>
            <p className="pt-4 pb-4 font-normal text-sm">Last <span className="font-bold">7 days</span> Follower Growth</p>
            <p className="font-normal text-sm opacity-40"><span className="font-bold">23.12</span>% increase from last week</p>
        </div>
        <div className="shadow-stats flex flex-col items-center md:items-start rounded-lg p-4">
            <div className="flex gap-[10px]">
                <div className="rounded-[50%] bg-bgiconred p-3 relative w-10 h-10">
                    <BsArrowDown className="absolute text-btnred font-semibold"/>
                </div>
                <h2 className="font-bold text-[30px] text-gray20">-501.97k</h2>
            </div>
            <p className="pt-4 pb-4 font-normal text-sm">Last <span className="font-bold">30 days</span> Follower Growth</p>
            <p className="font-normal text-sm opacity-40"><span className="font-bold">23.12</span>% increase from last week</p>
        </div>
        <div className="shadow-stats flex flex-col items-center md:items-start rounded-lg p-4">
            <div className="flex gap-[10px]">
                <div className="rounded-[50%] bg-bgicongreen p-3 relative w-10 h-10">
                    <BsArrowUp className="absolute text-btngreen font-semibold"/>
                </div>
                <h2 className="font-bold text-[30px] text-gray20">{userData?.total_interactions || 0}</h2>
            </div>
            <p className="pt-4 pb-4 font-normal text-sm">Total Interactions</p>
        </div>
    </div>
    </div>
    </>
  )
}

export default StatsCard