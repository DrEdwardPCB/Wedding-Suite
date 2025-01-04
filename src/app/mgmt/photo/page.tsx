import { MgmtHome } from "@/component/common/MgmtHome";
import { PhotoManagement } from "@/component/mgmt/album/PhotoManagement";
import { getSession, logoutMgmt } from "@/lib/ironsession/action";
import { Button } from "@mui/material";
import { redirect } from "next/navigation";

export default async function AlbumPage(){
    const session = await getSession();
    if(!session.isAdmin||!session.isLoggedIn){
        alert("You have not loggedin we are redirecting you to mgmt login")
        redirect("/mgmt/auth")
    }
    /**w-full flex gap-2 mt-4 hover:opacity-70 justify-around */
    return(
        <div className="flex flex-col items-center">
            <div className="w-full p-10 flex items-center justify-between">
                <MgmtHome/>
                    <h1 className="">Album</h1>
                <Button onClick = {logoutMgmt}>
                    logout
                </Button>
            </div>
            <PhotoManagement/>
        </div>
    )
}