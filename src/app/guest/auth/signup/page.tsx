import { FadeInSection } from "@/component/common/FadeInSection";
import { SignupForm } from "@/component/guest/auth/signup/SignupForm";

export default async function GuestSignupPage(){
    /** min-w-[300px] p-4 px-14 mx-14 text-themeSemiDark text-gray-600 text-xs text-blue-600 hover:text-blue-200 cursor-pointer underline text-themeSemiLight text-slate-400 mt-7 h-96 w-72 md:w-96 max-w-52 max-w-40 md:max-w-52 justify-end px-2 max-w-[250px] min-w-[120px] h-40 h-[500px] max-h-[500px] w-[40px] mt-4 overflow-y-auto overflow-y-scroll
     * grid grid-cols-2 grid-rows-2 bg-red-500 bg-yellow-500  bg-blue-500  bg-green-500 w-40 h-20 p-4 text-wrap  break-all text-xs md:text-base pt-8
     * text-amber-300 text-zinc-400 text-yellow-700 font-bold bg-green-400 bg-red-400 outline-2 outline-offset-2  outline-green-400 outline-red-400 outline
    */
    return (<div className="flex h-full flex-col items-center justify-around">
        <h1 className=" font-modelsignature text-5xl md:text-9xl  p-12">Rsvp</h1>
                  <FadeInSection className="font-bevietnam italic delay-200">
                    <div className="flex flex-col items-center gap-4 m-6 text-xs md:text-base">
                        <p><span className="font-bold">When</span> August 3, 2025 | 4:00 pm onwards</p>
                        <p><span className="font-bold">Where:</span> < a href="https://www.hmwineries.ca" className="cursor-pointer underline hover:text-white transition-all">Holland Marsh Wineries</a>, <a className="cursor-pointer underline hover:text-white transition-all" href="https://www.google.com/maps/place/Holland+Marsh+Wineries/@44.0564073,-79.5604865,1629m/data=!3m2!1e3!4b1!4m6!3m5!1s0x882ad00a64e3c227:0xc7c4f6a970480adb!8m2!3d44.0564073!4d-79.5604865!16s%2Fg%2F1tfscgq6?entry=ttu&g_ep=EgoyMDI1MDEwMi4wIKXMDSoASAFQAw%3D%3D">18270 Keele St, Newmarket, ON, Canada L3Y 4V9</a></p>
                    </div>
                  </FadeInSection>
        <SignupForm/>
    </div>)
}