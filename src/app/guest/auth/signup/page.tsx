import { loginMgmt } from "@/lib/ironsession/action";
import { SigninForm } from "@/component/SigninForm";

export default async function GuestSignupPage(){
    return (<div className="flex gap-4 items-center justify-start flex-col">
        <form action={loginMgmt} className="flex flex-col items-center justify-center gap-2">
        <SigninForm/>
        </form>
    </div>)
}