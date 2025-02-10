import { getSession, loginMgmt } from "@/lib/ironsession/action";
import { redirect } from "next/navigation";
import { SigninForm } from "@/component/SigninForm";
import { MgmtHome } from "@/component/common/MgmtHome";
export default async function MgmtLoginPage(){
    const session = await getSession();
    if(session.isAdmin&&session.isLoggedIn){
        redirect("/mgmt/")
    }
    return (<div className="flex gap-4 items-center justify-between flex-col h-[100vh] ">
        <div className="w-full h-10 p-10 flex items-center justify-between">
            <MgmtHome/>
                <h1 className="">mgmt login</h1>
            <></>
        </div>
        <SigninForm submitFnc={loginMgmt}/>
        <div></div>
    </div>)
}