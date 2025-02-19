import { FadeInSection } from "@/component/common/FadeInSection";
import { SignupForm } from "@/component/guest/auth/signup/SignupForm";

export default async function GuestSignupPage(){
    /** min-w-[300px] p-4 px-14 mx-14 text-themeSemiDark text-gray-600 text-xs text-blue-600 hover:text-blue-200 cursor-pointer underline text-themeSemiLight text-slate-400 mt-7 h-96 w-72 md:w-96 max-w-52 max-w-40 md:max-w-52 justify-end px-2 max-w-[250px] min-w-[120px] h-40 h-[500px] max-h-[400px] md:max-h-[450px] w-[40px] mt-4 overflow-y-auto overflow-y-scroll w-82 px-1 px-2 md:px-2 md:w-2/3 md:col-span-3 md:col-span-2 md:col-span-6 md:grid md:grid-cols-6 md:max-w-full md:self-start
     * grid grid-cols-2 grid-rows-2 bg-red-500 bg-yellow-500  bg-blue-500  bg-green-500 w-40 h-20 p-4 text-wrap  break-all text-xs md:text-base pt-8
     * text-amber-300 text-zinc-400 text-yellow-700 font-bold bg-green-400 bg-red-400 outline-2 outline-offset-2  outline-green-400 outline-red-400 outline bg-themeDark disabled:bg-slate-400 disabled:opacity-50 gap-6
     * max-w-[278px]  w-[300px] border-b border-b-[1px] border-themeReg md:h-52 md:max-w-full w-80 md:w-full
    */
    return (<div className="flex h-full flex-col items-center justify-start gap-4">
        <div className="flex flex-col items-center justify-around gap-4">

            <h1 className=" font-modelsignature text-5xl md:text-6xl pt-12">Rsvp</h1>
            <FadeInSection className="font-bevietnam delay-200">
                <div className="flex flex-col items-center gap-2 mx-6 text-xs md:text-base">
                    <div className="flex flex-col uppercase text-themeDark items-center gap-2 text-sm">
                        <div className="font-bold">August</div>
                        <div className="flex  gap-2 items-center">
                            <p className="font-thin">sunday</p>
                            <p className="border-l-[1px] border-r-[1px] border-themeDark px-2 font-bold text-xl font-serif">3</p>
                            <p className="font-thin">AT 3 PM</p>
                        </div>
                        <div className="font-bold">2025</div>
                    </div>
                    <p className="text-center text-themeDark uppercase text-xs"><a className="cursor-pointer underline hover:text-white transition-all" href="https://www.google.com/maps/place/Holland+Marsh+Wineries/@44.0564073,-79.5604865,1629m/data=!3m2!1e3!4b1!4m6!3m5!1s0x882ad00a64e3c227:0xc7c4f6a970480adb!8m2!3d44.0564073!4d-79.5604865!16s%2Fg%2F1tfscgq6?entry=ttu&g_ep=EgoyMDI1MDEwMi4wIKXMDSoASAFQAw%3D%3D">Holland Marsh Wineries</a></p>
                </div>
            </FadeInSection>
        </div>
        <div className="flex-1 items-center justify-center flex w-full flex-col">
            <div className="flex-1"></div>
            <SignupForm/>
            <div className="flex-[4]"></div>
        </div>
    </div>)
}