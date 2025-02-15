import { MgmtHome } from "@/component/common/MgmtHome";
import { getSession, logoutMgmt } from "@/lib/ironsession/action";
import { Button } from "@mui/material";
import { redirect } from "next/navigation";
import CommentManagement from "@/component/mgmt/comment/CommentManagement";
// max-h-[45%] overflow-y-auto w-full gap-2 shadow flex flex-col
export default async function MgmtBroadcastPage(){
    const session = await getSession();
        if(!session.isAdmin||!session.isLoggedIn){
            alert("You have not loggedin we are redirecting you to mgmt login")
            redirect("/mgmt/auth")
        }
 
    return (
        <div className="flex flex-col items-center">
            <div className="w-full p-10 flex items-center justify-between">
                <MgmtHome/>
                    <h1 className="">Comment</h1>
                <Button onClick = {logoutMgmt}>
                    logout
                </Button>
            </div>
            <CommentManagement></CommentManagement>
                
        </div>
    )
}