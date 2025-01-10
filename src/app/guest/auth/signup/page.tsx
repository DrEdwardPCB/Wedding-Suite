import { SignupForm } from "@/component/guest/auth/signup/SignupForm";

export default async function GuestSignupPage(){
    /**min-w-[300px] p-4 px-14 mx-14 text-themeSemiDark text-gray-600 text-xs text-blue-600 hover:text-blue-200 cursor-pointer underline */
    return (<div className="flex gap-4 items-center justify-start flex-col bg-gradient-to-br from-themeLight to-themeSemiLight min-h-[100vh]">
        <h1 className="font-bold font-theseasons text-2xl italic p-7">RSVP/signup</h1>
        <SignupForm/>
    </div>)
}