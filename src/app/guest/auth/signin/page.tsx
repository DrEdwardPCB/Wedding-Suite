import { getSession, loginGuest } from "@/lib/ironsession/action";
import { redirect } from "next/navigation";
import { SigninForm } from "@/component/SigninForm";
import { FadeInSection } from "@/component/common/FadeInSection";

export default async function GuestLoginPage(){
    const session = await getSession();
    if(!session.isAdmin&&session.isLoggedIn){
        redirect("/guest/")
    }
    return (<div className="flex gap-4 items-center justify-start flex-col">
        <h1 className=" font-modelsignature text-5xl md:text-6xl pt-12">Sign in</h1>
            <FadeInSection className="font-bevietnam delay-200">
                <div className="flex flex-col items-center gap-2 mx-6 text-xs md:text-base">
                    <div className="flex flex-col uppercase text-themeDark items-center gap-2 text-sm">
                        <div className="font-bold">August</div>
                        <div className="flex  gap-2 items-center">
                            <p className="font-thin">sunday</p>
                            <p className="border-l-[1px] border-r-[1px] border-themeDark px-2 font-bold text-xl font-serif">3</p>
                            <p className="font-thin">AT 3 PM</p>
                        </div>
                        <div className="font-bold">2025</div>
                    </div>
                    <p className="text-center text-themeDark uppercase text-xs"><a className="cursor-pointer underline hover:text-white transition-all" href="https://www.google.com/maps/place/Holland+Marsh+Wineries/@44.0564073,-79.5604865,1629m/data=!3m2!1e3!4b1!4m6!3m5!1s0x882ad00a64e3c227:0xc7c4f6a970480adb!8m2!3d44.0564073!4d-79.5604865!16s%2Fg%2F1tfscgq6?entry=ttu&g_ep=EgoyMDI1MDEwMi4wIKXMDSoASAFQAw%3D%3D">Holland Marsh Wineries</a></p>
                </div>
            </FadeInSection>
        <SigninForm submitFnc={loginGuest}/>
        <div className="flex-1"></div>
    </div>)
}