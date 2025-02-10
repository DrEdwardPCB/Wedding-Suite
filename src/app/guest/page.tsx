import { FadeInSection } from "@/component/common/FadeInSection";
import { LoadImageFromDB } from "@/component/common/ImageSlot";
import GuestHomeRoute from "@/component/guest/guestHomeRoute";
import GuestNav from "@/component/guest/GuestNav";
import { getSession } from "@/lib/ironsession/action";
import { findUserByUserId } from "@/lib/mongo/actions/UserActions";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic'
// hover:rotate-3 hover:scale-105 w-[300px] h-[300px] object-cover
export default async function GuestHomePage(){
    const session = await getSession();
    if(!session.isLoggedIn){
        redirect("/")
    }
    const user = await findUserByUserId(session.userid)
    const renderSeatInformation = ()=>{
        const renderList = []
        if(user?.ceremony){
            renderList.push(
            <div className="flex flex-col font-theseasons italic font-bold text-white text-xl bg-black bg-opacity-50 p-14 m-2 md:m-7 xl:m-14">
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
            <div className="flex flex-col font-theseasons italic font-bold text-white text-xl bg-black bg-opacity-50 p-14 m-2 md:m-7 xl:m-14">
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
        <GuestNav title="Wedding Links"/>
        <div className="flex gap-8 flex-wrap items-center justify-around p-8 from-themeLight to-themeSemiLight bg-gradient-to-br">
            <GuestHomeRoute href="/guest/album" slot="guestAlbum" title="Album"></GuestHomeRoute>
            <GuestHomeRoute href="/guest/game" slot="guestGame" title="Game"></GuestHomeRoute>
            <GuestHomeRoute href="/guest/menu" slot="guestMenu" title="Menu"></GuestHomeRoute>
            <GuestHomeRoute href="/guest/rundown" slot="guestRundown" title="Rundown"></GuestHomeRoute>
            <GuestHomeRoute href="/guest/stream" slot="guestStream" title="Live Stream"></GuestHomeRoute>
        </div>
    </div>
)
} 