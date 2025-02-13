import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent, TimelineSeparator } from "@mui/lab";
import { Heart } from "lucide-react";
import FlatIcon from "./FlatIcon";
import { LoadImageFromDB } from "./ImageSlot";
import { TimelineItem } from "./TimelineItem";


export default async function StoryTimeline(){
    return (
            <Timeline position="alternate" >
                <TimelineItem className="before:!content-none">
                    <TimelineOppositeContent className="flex items-center justify-end bg-themeSemiDark font-bevietnam gap-4 before:!content-none">
                        <FlatIcon className="w-10 h-10 aspect-square" keys="radio.png"></FlatIcon>
                        October 2015
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineConnector/>
                        <TimelineDot className="bg-themeReg">
                            <Heart></Heart>
                        </TimelineDot>
                        <TimelineConnector/>
                    </TimelineSeparator>
                    <TimelineContent className="py-6 font-bevietnam text-xs md:text-base">
                        <div className="flex items-center gap-4 justify-start">
                            <div>
                                <h6 className="text-base md:text-xl font-semibold">First Met</h6>
                                <p className="italic">HKUST-Radio room LG5208</p>
                            </div>
                        <LoadImageFromDB slot="story1" className="ring ring-2 ring-themeReg aspect-square object-cover invisible lg:visible w-56"></LoadImageFromDB>
                        </div>
                    </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                    <TimelineOppositeContent className="flex items-center justify-start gap-4 bg-themeSemiDark font-bevietnam">
                        November 2016
                        <FlatIcon className="w-10 h-10 aspect-square" keys="love.png"></FlatIcon>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineConnector/>
                        <TimelineDot className="bg-themeReg">
                            <Heart></Heart>
                        </TimelineDot>
                        <TimelineConnector/>
                    </TimelineSeparator>
                    <TimelineContent className="py-6 font-bevietnam text-xs md:text-base">
                    <div className="flex items-center gap-4 justify-end">
                        <LoadImageFromDB slot="story2" className="ring ring-2 ring-themeReg aspect-square object-cover invisible lg:visible w-56 "></LoadImageFromDB>
                    <div>
                        <h6 className="text-base md:text-xl font-semibold">Love Relationship Begin</h6>
                        <p className="italic">HKUST-Hall IV Rm 624</p>
                        </div>
                    </div>
                    </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                    <TimelineOppositeContent className="flex items-center justify-end gap-4 bg-themeSemiDark font-bevietnam">
                        <FlatIcon className="w-10 h-10 aspect-square" keys="cats.png"></FlatIcon>
                        June 2018
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineConnector/>
                        <TimelineDot className="bg-themeReg">
                            <Heart></Heart>
                        </TimelineDot>
                        <TimelineConnector/>
                    </TimelineSeparator>
                    <TimelineContent className="py-6 font-bevietnam text-xs md:text-base">
                    <div className="flex items-center gap-4 justify-start">
                    <div>
                        <h6 className="text-base md:text-xl font-semibold">Adopt Saber & Lancer</h6>
                        <p className="italic">Kowloon Bay, Choi Ha Estate</p>
                        </div>
                        <LoadImageFromDB slot="story3" className="ring ring-2 ring-themeReg aspect-square object-cover invisible lg:visible w-56 "></LoadImageFromDB>
                    </div>
                    </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                    <TimelineOppositeContent className="flex items-center justify-start gap-4 bg-themeSemiDark font-bevietnam">
                        November 2022
                        <FlatIcon className="w-10 h-10 aspect-square" keys="ring.png"></FlatIcon>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineConnector/>
                        <TimelineDot className="bg-themeReg">
                            <Heart></Heart>
                        </TimelineDot>
                        <TimelineConnector/>
                    </TimelineSeparator>
                    <TimelineContent className="py-6 font-bevietnam text-xs md:text-base">
                    <div className="flex items-center gap-4 justify-end">
                        <LoadImageFromDB slot="story4" className="ring ring-2 ring-themeReg aspect-square object-cover invisible lg:visible w-56 "></LoadImageFromDB>
                    <div>
                        <h6 className="text-base md:text-xl font-semibold">We Got Engaged</h6>
                        <p className="italic">Tsim Sha Tsui, K11 ARTUS</p>
                        </div>
                    </div>
                    </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                    <TimelineOppositeContent className="flex items-center justify-end gap-4 bg-themeSemiDark font-bevietnam">
                        <FlatIcon className="w-10 h-10 aspect-square" keys="travel.png"></FlatIcon>
                        September 2023
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineConnector/>
                        <TimelineDot className="bg-themeReg">
                            <Heart></Heart>
                        </TimelineDot>
                        <TimelineConnector/>
                    </TimelineSeparator>
                    <TimelineContent className="py-6 font-bevietnam text-xs md:text-base">
                    <div className="flex items-center gap-4 justify-start">
                    <div>
                        <h6 className="text-base md:text-xl font-semibold">Moved To Toronto</h6>
                        <p className="italic">City of Toronto, North York</p>
                        </div>
                        <LoadImageFromDB slot="story5" className="ring ring-2 ring-themeReg aspect-square object-cover invisible lg:visible w-56"></LoadImageFromDB>
                    </div>
                    </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                    <TimelineOppositeContent className="flex items-center justify-start gap-4 bg-themeSemiDark font-bevietnam">
                        August 2025
                        <FlatIcon className="w-10 h-10 aspect-square" keys="married.png"></FlatIcon>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineConnector/>
                        <TimelineDot className="bg-themeReg">
                            <Heart></Heart>
                        </TimelineDot>
                        <TimelineConnector/>
                    </TimelineSeparator>
                    <TimelineContent  className="py-6 font-bevietnam text-xs md:text-base">
                    <div className="flex items-center gap-4 justify-end">
                        <LoadImageFromDB slot="story6" className="ring ring-2 ring-themeReg aspect-square object-cover invisible lg:visible w-56 "></LoadImageFromDB>
                    <div>
                        <h6 className="text-base md:text-xl font-semibold ">Wedding</h6>
                        <p className="italic">Greater Toronto Area, Holland Marsh Wineries</p>
                        </div>
                    </div>
                    </TimelineContent>
                </TimelineItem>
            </Timeline>
    )
}