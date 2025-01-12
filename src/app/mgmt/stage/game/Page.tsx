import { MgmtHome } from "@/component/common/MgmtHome";
import { GameDisplay } from "@/component/mgmt/stage/Game/GameDisplay";
import { getSession, logoutMgmt } from "@/lib/ironsession/action";
import { Button } from "@mui/material";
import { redirect } from "next/navigation";

export default async function StageGamePage(){
    const session = await getSession();
    if(!session.isAdmin||!session.isLoggedIn){
        alert("You have not loggedin we are redirecting you to mgmt login")
        redirect("/mgmt/auth")
    }
    return(<div>
         <div className="w-full p-10 flex items-center justify-between">
            <MgmtHome/>
                <h1 className="">Game</h1>
            <Button onClick = {logoutMgmt}>
                logout
            </Button>
        </div>
        <GameDisplay/>
    </div>)
}