import { getSession, loginMgmt } from "@/lib/ironsession/action";
import { redirect } from "next/navigation";
import { SigninForm } from "@/component/SigninForm";
export default async function MgmtLoginPage(){
    const session = await getSession();
    if(session.isAdmin&&session.isLoggedIn){
        redirect("/mgmt/")
    }
    return (<div className="flex gap-4 items-center justify-center flex-col h-[100vh] ">
        <h1 className="">mgmt login</h1>
        <form action={loginMgmt} className="flex flex-col items-scratch justify-center gap-2 outline outline-1 p-4 rounded-lg">
            <SigninForm/>
        </form>
    </div>)
}