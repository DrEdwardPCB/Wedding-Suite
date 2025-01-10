import { FadeInSection } from "@/component/common/FadeInSection";
import { LoadImageFromDB } from "@/component/common/ImageSlot";
import { SubmitButton } from "@/component/SubmitButton";
import { getSession, logoutGuest } from "@/lib/ironsession/action";
import { findUserByUserId } from "@/lib/mongo/actions/UserActions";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic'
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
            <div className="flex flex-col font-theseasons italic font-bold text-white text-xl bg-black bg-opacity-50 p-14 m-14">
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
            <div className="flex flex-col font-theseasons italic font-bold text-white text-xl bg-black bg-opacity-50 p-14 m-14">
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
            <FadeInSection className="flex flex-col font-theseasons italic font-bold text-white text-xl bg-black bg-opacity-50 p-14 m-14">
                <div className="text-2xl md:text-6xl font-light">
                Edward Wong<br></br> & <br></br> Kiki Cho
                </div>
                <div className="mt-2">
                August 3, 2025
                </div>
            </FadeInSection>
            <FadeInSection className="flex gap-2 delay-500 m-14">
                {renderSeatInformation()}
            </FadeInSection>
            </div>
        </div>
        <nav className="h-[10vh] w-full bg-themeLight">
            <form action={logoutGuest} >
                <div>
                    <SubmitButton value="Logout" />
                </div>
            </form>
        </nav>
    </div>
)
} 