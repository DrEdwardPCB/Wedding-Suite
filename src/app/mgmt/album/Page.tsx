import { getSession } from "@/lib/ironsession/action";
import { redirect } from "next/navigation";

export default async function AlbumPage(){
    const session = await getSession();
    if(!session.isAdmin||!session.isLoggedIn){
        alert("You have not loggedin we are redirecting you to mgmt login")
        redirect("/mgmt/auth")
    }
    return(<div>Album</div>)
}