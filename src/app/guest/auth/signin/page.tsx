import { getSession, loginGuest } from "@/lib/ironsession/action";
import { redirect } from "next/navigation";
import { SigninForm } from "@/component/SigninForm";

export default async function GuestLoginPage(){
    const session = await getSession();
    if(session.isAdmin&&session.isLoggedIn){
        redirect("/guest/")
    }
    return (<div className="flex gap-4 items-center justify-start flex-col">
        <form action={loginGuest} className="flex flex-col items-center justify-center gap-2">
            <SigninForm/>
        </form>
    </div>)
}