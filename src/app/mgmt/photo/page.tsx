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
    /** w-full flex gap-2 mt-4 hover:opacity-70 justify-around w-1/4 aspect-square relative absolute top-0 right-7 cursor-pointer w-4 z-100 grid-cols-4 w-full p-4 */
    return(
        <div className="flex flex-col items-center">
            <div className="w-full p-10 flex items-center justify-between ">
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