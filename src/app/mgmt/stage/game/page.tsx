import { MgmtHome } from "@/component/common/MgmtHome";
import { GameDisplay } from "@/component/mgmt/stage/Game/GameDisplay";
import { getSession } from "@/lib/ironsession/action";
import { redirect } from "next/navigation";
/**
 * outline outline-2 outline-offset-2 outline-green-400 animate-bounce
 * text-4xl text-3xl
 */
export default async function StageGamePage(){
    const session = await getSession();
    if(!session.isAdmin||!session.isLoggedIn){
        alert("You have not loggedin we are redirecting you to mgmt login")
        redirect("/mgmt/auth")
    }
    return(<div className="flex h-full flex-col items-center justify-around">
         <div className="w-full p-10 flex items-center justify-between">
            <MgmtHome/>
            <h1 className=" font-modelsignature text-5xl md:text-9xl  p-12">Game</h1>
            <div className="w-[40px]"></div>
        </div>
        <GameDisplay/>
    </div>)
}