import { getSession, loginMgmt } from "@/lib/ironsession/action";
import { redirect } from "next/navigation";
import { SigninForm } from "@/component/SigninForm";
export default async function MgmtLoginPage(){
    const session = await getSession();
    if(session.isAdmin&&session.isLoggedIn){
        redirect("/mgmt/")
    }
    return (<div className="flex gap-4 items-center justify-start flex-col">
        <form action={loginMgmt} className="flex flex-col items-center justify-center gap-2">
            <SigninForm/>
        </form>
    </div>)
}