import { FadeInSection } from "@/component/common/FadeInSection";
import { LoadImageFromDB } from "@/component/common/ImageSlot";
import GuestHomeRoute from "@/component/guest/guestHomeRoute";
import GuestNav from "@/component/guest/GuestNav";
import { HomeItemDisplay } from "@/component/HomeItemDisplay";
import { getSession } from "@/lib/ironsession/action";
import { findUserByUserId } from "@/lib/mongo/actions/UserActions";
import { redirect } from "next/navigation";
import {queryAll} from "@/lib/mongo/actions/BroadcastActions"
import BroadcastItem from "@/component/common/BroadcastItem";

export const dynamic = 'force-dynamic'
// hover:rotate-3 hover:scale-105 w-[300px] h-[300px] object-cover pt-4 font-bold
export default async function GuestHomePage(){
    const session = await getSession();
    const BroadcastList = await queryAll()
    if(!session.isLoggedIn){
        redirect("/")
    }
    const user = await findUserByUserId(session.userid)
    const renderSeatInformation = ()=>{
        const renderList = []
        if(user?.ceremony){
            renderList.push(
            <div key="ceremonyseat" className="flex flex-col font-theseasons italic font-bold text-white text-xl bg-black bg-opacity-50 p-4 md:p-14 m-2 md:m-7 xl:m-14">
                <div className="mb-2">
                  Ceremony
                </div>
                <div className="text-2xl md:text-6xl font-light">
                    {user.ceremonySeatNumber}
                </div>                         
            </div>
        )}
        if(user?.ceremony){
            renderList.push(
            <div  key="banquetseat" className="flex flex-col font-theseasons italic font-bold text-white text-xl bg-black bg-opacity-50 p-4 md:p-14 m-2 md:m-7 xl:m-14">
                <div className="mb-2">
                  Banquet
                </div>
                <div className="text-2xl md:text-6xl font-light">
                    {user.dinnerDeskNumber}
                </div>  
            </div>
        )}
        return renderList
    }
    return (
    <div>
        <div className="relative w-full h-[90vh] flex">
            <LoadImageFromDB slot="welcome" className="w-full h-full object-cover"></LoadImageFromDB>
            <div className="z-100 absolute w-full h-full flex flex-wrap items-end justify-around">
            <FadeInSection className="flex flex-col font-zapfino italic font-bold text-white  bg-black bg-opacity-50 p-14 m-14">
                <div className="text-2xl md:text-4xl font-light">
                Edward Wong<br/><div className="mt-6"> & </div><br/> Kiki Cho
                </div>
                <div className="mt-10 text-lg md:text-xl">
                August 3, 2025
                </div>
            </FadeInSection>
            <FadeInSection className=" flex gap-2 delay-500 justify-around">
                {renderSeatInformation()}
            </FadeInSection>
            </div>
        </div>
        <GuestNav/>
        <div className="p-1 md:p-14 pt-4 bg-themeReg text-themeLight">
            <div className="flex gap-4 flex-wrap flex-col md:flex-row">
                <div className="w-full md:w-1/3">
                    <FadeInSection className="text-themeLight text-2xl md:text-6xl font-theseasons mb-4 pl-14 md:p-0"><p>Important Info</p></FadeInSection>
                    <HomeItemDisplay className="m-10 text-themeDark" imageSlot="dresscode" title="What to Wear" description="Semi-Formal or Dressy Casual" copyText="https://www.brides.com/story/wedding-dress-code-explained" copyMessage="Dress code explain website is being copied to your clipboard"></HomeItemDisplay>
                </div>
                <div className="flex gap-8 flex-wrap items-center p-4 pt-0 flex-1 flex-col">
                    <FadeInSection className="text-themeLight self-start text-2xl md:text-6xl font-theseasons mb-4 pl-14 md:p-0"><p>Broadcast</p></FadeInSection>
                    <div className="max-h-[500px] flex-1 overflow-y-auto w-full flex flex-col gap-4 items-center justify-start">

                     {BroadcastList.map(e=>{
                         return (
                             <BroadcastItem broadcast={e} key={e._id} ></BroadcastItem>
                            )
                        })}
                    
                    </div>
                </div>
            </div>
        </div>
        
        <div className="p-1 md:p-14 pt-2 bg-themeLight text-themeDark">
            <FadeInSection className="text-themeDark text-2xl md:text-6xl font-theseasons mb-4 pl-14 md:p-0"><p>Wedding Links</p></FadeInSection>
            <div className="flex gap-8 flex-wrap items-center justify-around p-8">
                <GuestHomeRoute href="/guest/album" slot="guestAlbum" title="Album"></GuestHomeRoute>
                <GuestHomeRoute href="/guest/game" slot="guestGame" title="Game"></GuestHomeRoute>
                <GuestHomeRoute href="/guest/menu" slot="guestMenu" title="Menu"></GuestHomeRoute>
                <GuestHomeRoute href="/guest/rundown" slot="guestRundown" title="Rundown"></GuestHomeRoute>
                <GuestHomeRoute href="/guest/stream" slot="guestStream" title="Live Stream"></GuestHomeRoute>
                <GuestHomeRoute href="/guest/comment" slot="guestComment" title="Leave a Message"></GuestHomeRoute>
                <GuestHomeRoute href="/guest/account" slot="guestProfile" title="Edit Profile"></GuestHomeRoute>
            </div>
        </div>
    </div>
)
} 