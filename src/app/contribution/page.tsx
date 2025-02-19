/* eslint-disable react/no-unescaped-entities */
import { FadeInSection } from "@/component/common/FadeInSection";
import { HomeItemDisplay } from "@/component/HomeItemDisplay";
export const dynamic = 'force-dynamic'
export default async function Home() {
  // p-8 bg-white w-[300px] shadow uppercase mt-8 mb-4 text-black border-black hover:bg-black self-end w-10 h-10 py-6 ring ring-2 ring-themeReg aspect-square object-cover invisible lg:visible w-56
  return (
      <div className="relative w-full h-[100vh] flex">
      
      <div className="p-1 md:p-10  text-themeDark flex flex-col md:flex-row gap-6 flex-wrap justify-around">
      <div className="flex flex-col items-start gap-10 items-start justify-center flex-1 md:p-4">
      <FadeInSection className="text-themeDark text-2xl md:text-6xl font-theseasons pl-14 md:p-0"><p>Cash Gift</p></FadeInSection>
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 text-xs md:text-base">

        {/* <HomeItemDisplay className="rotate-2" imageSlot="dresscode" title="What to Wear" description="Semi-Formal or Dressy Casual" copyText="https://www.brides.com/story/wedding-dress-code-explained" copyMessage="Dress code explain website is being copied to your clipboard"></HomeItemDisplay> */}
        <HomeItemDisplay className="-rotate-3"  imageSlot="paymentedward1" title="Edward E-Transfer" description="We accept Wedding Angpau in Interac e-transfer, e-transfer email is eternal.edward1997@gmail.com" copyText="eternal.edward1997@gmail.com" copyMessage="Edward Interac E-Transfer email has been copied to your clipboard"></HomeItemDisplay>
        <HomeItemDisplay  className="rotate-3" imageSlot="paymentedward2" title="Edward PayMe" description="We accept Wedding Angpau in PayMe, PayMe Phone# is +852 9080 6787" copyText="90806787" copyMessage="Edward's PayMe Phone# has been copied to your clipboard"></HomeItemDisplay>
        <HomeItemDisplay className="-rotate-2"  imageSlot="paymentkiki1" title="Kiki E-Transfer" description="We accept Wedding Angpau in Interac e-transfer, e-transfer email is kikiwithyou@gmail.com" copyText="kikiwithyou@gmail.com" copyMessage="Kiki's Interac E-Transfer email has been copied to your clipboard"></HomeItemDisplay>
        <HomeItemDisplay  className="-rotate-2" imageSlot="paymentkiki2" title="Kiki PayMe" description="We accept Wedding Angpau in PayMe, PayMe Phone# is +852 9791 5890" copyText="97915890" copyMessage="Kiki's PayMe Phone# has been copied to your clipboard"></HomeItemDisplay>
      </div>
      </div>
      </div>
  
    </div>
  );
}
