import GuestManagement from "@/component/mgmt/guest/GuestManagement";
import { getSession } from "@/lib/ironsession/action";
import { redirect } from "next/navigation";

export default async function GuestPage(){
    const session = await getSession();
    if(!session.isAdmin||!session.isLoggedIn){
        redirect("/mgmt/auth")
    }
    return(<div>Guest

        <GuestManagement/>
    </div>)
}