import { MgmtHome } from "@/component/common/MgmtHome";
import GuestManagement from "@/component/mgmt/guest/GuestManagement";
import { getSession, logoutMgmt } from "@/lib/ironsession/action";
import { Button } from "@mui/material";
import { redirect } from "next/navigation";

export default async function GuestPage(){
    const session = await getSession();
    if(!session.isAdmin||!session.isLoggedIn){
        redirect("/mgmt/auth")
    }
    return(<div>
        <div className="w-full p-10 flex items-center justify-between">
            <MgmtHome/>
                <h1 className="">Guest</h1>
            <Button onClick = {logoutMgmt}>
                logout
            </Button>
        </div>
        <GuestManagement/>
    </div>)
}