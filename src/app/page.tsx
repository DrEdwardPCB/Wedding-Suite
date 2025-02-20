/* eslint-disable react/no-unescaped-entities */
import { FadeInSection } from "@/component/common/FadeInSection";
import { LoadImageFromDB } from "@/component/common/ImageSlot";
import { HomeItemDisplay } from "@/component/HomeItemDisplay";
import Link from "next/link";
import {ToastContainer} from "react-toastify"
import StoryTimeline from "@/component/common/StoryLine";
import FlatIcon from "@/component/common/FlatIcon";
export const dynamic = 'force-dynamic'
export default async function Home() {
  // p-8 bg-white w-[300px] shadow uppercase mt-8 mb-4 text-black border-black hover:bg-black self-end w-10 h-10 py-6 ring ring-2 ring-themeReg aspect-square object-cover invisible lg:visible w-56
  return (
    <div>
      <div className="relative w-full h-[100vh] flex">
        <LoadImageFromDB slot="welcome" className="w-full h-full object-cover"></LoadImageFromDB>
        <div className="z-100 absolute w-full h-full flex flex-wrap items-end justify-around">
          <FadeInSection className="flex flex-col font-zapfino italic font-bold text-white  bg-black bg-opacity-50 p-14 m-14">
            <div className="text-2xl md:text-4xl font-light">
              Edward Wong<br/><div className="mt-6"> & </div><br/> Kiki Cho
            </div>
            <div className="mt-10 text-base md:text-xl">
              August 3, 2025
            </div>
          </FadeInSection>
          <FadeInSection className="flex gap-2 delay-500 m-14">
          {/* rsvp=signup signin=access different function */}
          <Link href="/guest/auth/signup" className="p-6 bg-[rgba(0,0,0,.5)]"><button className="transition-all px-6 py-2 min-w-[120px] text-center text-white border border-white hover:bg-white hover:text-black active:bg-slate-100 focus:outline-none focus:ring">RSVP</button></Link>
          </FadeInSection>
        </div>
      </div>
      <nav className="min-h-[10vh] w-full bg-themeLight shadow-inner flex items-center justify-between md:px-4 px-1 sticky top-0 z-50">
          <div className="flex-1"></div>
          <div className="flex-1">

            <FlatIcon className=" aspect-[1440/404] object-cover w-full h-full z-50" keys="Heading.png"></FlatIcon>
          </div>
          <div className="flex-1 justify-end flex">
            
            <Link href="/guest/auth/signin" className=""><button className="transition-all px-6 py-2 min-w-[120px] text-center text-black border border-black hover:bg-white hover:text-black active:bg-slate-100 focus:outline-none focus:ring">sign in</button></Link>
          </div>
        </nav>
      <div className="p-1 md:p-14 pt-2 bg-themeLight text-themeDark">
        {/* our story */}
        <div className=" flex flex-col items-start justify-around text-xs md:text-base">

          <FadeInSection className="text-themeDark text-2xl md:text-6xl font-theseasons mb-4 pl-14 md:p-0"><p>Our Story</p></FadeInSection>
          {/* <FadeInSection className="ring ring-2 ring-themeReg p-2  md:w-5/6 self-center delay-150">
            <LoadImageFromDB slot="ourstory1" className="ring ring-2 ring-themeReg aspect-square object-cover"></LoadImageFromDB>
          </FadeInSection>
        </div>
        <div className="flex-[2] flex flex-col gap-6 md:pt-36">
          <FadeInSection className=" delay-500 font-bevietnam font-light"><p>Edward and Kiki's love story began in 2015 at Hong Kong University of Science and Technology, where they co-hosted a radio program about love at People's Campus Radio. Their relationship blossomed during a trip to Taiwan in 2016, where a magical twilight bicycle ride along Qijin's coastline sparked their romance. They officially became a couple on November 16, 2016, marking the beginning of their beautiful journey together. Through years of supporting each other during their studies, careers, and eventually moving to Toronto in 2023, their love has only grown stronger. Now settled in Toronto with their beloved cats Saber and Lancer, they're excited to celebrate their wedding in August 2025, starting a new chapter in their lives together.</p></FadeInSection>
          {/*  王煜銘(Edward)和曹凱棋(Kiki)的愛情故事始於2015年香港科技大學的校園電台。在2016年的台灣之旅中，旗津海岸的黃昏單車之旅，讓他們萌生愛意。2016年11月16日，他們正式成為戀人，展開了美麗的人生旅程。多年來，他們在學業、事業上互相扶持，直至2023年一同移居多倫多。期間他們收養了兩隻可愛的貓咪Saber和Lancer，讓生活增添歡樂。如今已在多倫多安頓下來的他們，期待在2025年8月舉行婚禮，譜寫人生新的一頁。*/}
          {/* <FadeInSection className="ring ring-2 ring-themeReg p-2  md:w-1/2 self-center delay-1000">
            <LoadImageFromDB slot="ourstory2" className="ring ring-2 ring-themeReg aspect-square object-cover"></LoadImageFromDB>
          </FadeInSection> */}
          </div>
          <StoryTimeline></StoryTimeline>
          <div className=" flex flex-col items-center justify-center gap-6 visible lg:invisible lg:w-0 py-4">
            <LoadImageFromDB slot="story1" className="ring ring-2 ring-themeReg aspect-square object-cover w-56 rotate-2"></LoadImageFromDB>
            <LoadImageFromDB slot="story2" className="ring ring-2 ring-themeReg aspect-square object-cover w-56 -rotate-2"></LoadImageFromDB>
            <LoadImageFromDB slot="story3" className="ring ring-2 ring-themeReg aspect-square object-cover w-56 rotate-3"></LoadImageFromDB>
            <LoadImageFromDB slot="story4" className="ring ring-2 ring-themeReg aspect-square object-cover w-56 -rotate-2"></LoadImageFromDB>
            <LoadImageFromDB slot="story5" className="ring ring-2 ring-themeReg aspect-square object-cover w-56 rotate-3"></LoadImageFromDB>
            <LoadImageFromDB slot="story6" className="ring ring-2 ring-themeReg aspect-square object-cover w-56 -rotate-2"></LoadImageFromDB>
          </div>
      </div>
      <div className="p-14 bg-themeReg text-themeLight flex items-center flex-col md:flex-row">
        <div className="flex flex-col items-start gap-10 items-start justify-center flex-1 p-10 md:p-24">
          <FadeInSection className="text-themeLight text-2xl md:text-6xl font-theseasons"><p>Join us as we tie the Knot<span className="font-serif font-thin">!</span></p></FadeInSection>
          <FadeInSection className="font-bevietnam delay-200">
            <p><span className="font-bold">When</span> August 3, 2025 | 3:00 pm onwards</p>
            <p><span className="font-bold">Where:</span> < a href="https://www.hmwineries.ca" className="cursor-pointer underline hover:text-white transition-all">Holland Marsh Wineries</a>, <a className="cursor-pointer underline hover:text-white transition-all" href="https://www.google.com/maps/place/Holland+Marsh+Wineries/@44.0564073,-79.5604865,1629m/data=!3m2!1e3!4b1!4m6!3m5!1s0x882ad00a64e3c227:0xc7c4f6a970480adb!8m2!3d44.0564073!4d-79.5604865!16s%2Fg%2F1tfscgq6?entry=ttu&g_ep=EgoyMDI1MDEwMi4wIKXMDSoASAFQAw%3D%3D">18270 Keele St, Newmarket, ON, Canada L3Y 4V9</a></p>
          </FadeInSection>
          <FadeInSection className="delay-250">
          <Link href="/guest/auth/signup" className=""><button className="transition-all px-6 py-2 min-w-[120px] text-center text-themeLight border border-themeLight hover:bg-themeLight hover:text-black active:bg-slate-100 focus:outline-none focus:ring">RSVP</button></Link>
          </FadeInSection>
        </div>
        <div className="flex-1 flex items-center justify-center">
        <FadeInSection className="delay-500 flex-1">
          <div className="ring ring-2 ring-themeReg p-2  md:w-1/2 self-center delay-1000">
            <LoadImageFromDB className="ring ring-2 ring-themeReg aspect-square object-cover" slot="knot"/>
          </div>
        </FadeInSection>
        </div>
      </div>
      <div className="p-1 md:p-14 bg-themeLight text-themeDark flex flex-col md:flex-row gap-6 flex-wrap justify-around">
      <div className="flex flex-col items-start gap-10 items-start justify-center flex-1 md:p-24">
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
      <div className="relative w-full h-[100vh] flex">
        {/* see you there */}
        <LoadImageFromDB slot="footer" className="w-full h-full object-cover"></LoadImageFromDB>
        <div className="z-100 absolute w-full h-full flex items-center justify-center">
          <FadeInSection className="text-2xl md:text-6xl font-light text-white font-theseasons italic p-7 bg-black bg-opacity-50"><p>See you there</p></FadeInSection>
        </div>
      </div>
      <div className="w-full h-40 flex justify-around items-center bg-black">
        <p className="text-white text-center">
          Created and <Link className="cursor-pointer" href="/mgmt/auth">Managed</Link> by Edward Wong<br></br><a href="/privacypolicy" className="cursour-pointer underline hover:white hover:text-blue-600">Privacy Policy</a>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}
