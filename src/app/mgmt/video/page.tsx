import { MgmtHome } from "@/component/common/MgmtHome";
import { VideoManagement } from "@/component/mgmt/video/VideoManagement";
import { getSession, logoutMgmt } from "@/lib/ironsession/action";
import { Button } from "@mui/material";
import { redirect } from "next/navigation";

export default async function VideoPage(){
    const session = await getSession();
    if(!session.isAdmin||!session.isLoggedIn){
        alert("You have not loggedin we are redirecting you to mgmt login")
        redirect("/mgmt/auth")
    }
    return(<div className="flex flex-col items-center">
        <div className="w-full p-10 flex items-center justify-between ">
            <MgmtHome/>
                <h1 className="">Videos</h1>
            <Button onClick = {logoutMgmt}>
                logout
            </Button>
        </div>
       <VideoManagement/>
    </div>)
}