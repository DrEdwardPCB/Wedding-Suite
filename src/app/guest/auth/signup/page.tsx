import { SignupForm } from "@/component/guest/auth/signup/SignupForm";

export default async function GuestSignupPage(){
    /**min-w-[300px] p-4 px-14 mx-14 text-themeSemiDark text-gray-600 text-xs text-blue-600 hover:text-blue-200 cursor-pointer underline */
    return (<div className="flex h-full flex-col items-center justify-around">
        <h1 className=" font-modelsignature text-9xl  p-12">Rsvp</h1>
        <SignupForm/>
    </div>)
}