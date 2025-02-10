/* eslint-disable @next/next/no-img-element */
"use client"
import { S3Image } from "@/component/common/images"
import { useHover } from 'usehooks-ts'
import { useRef } from 'react'
import Link from "next/link"
export interface IAlbumItemProps{
    title:string
    albumId:string
    photos:({
        fileLocation: string;
        type: "video" | "photo";
        title?: string | undefined;
        slot?: string | undefined;
        description?: string | undefined;
        album?: string | undefined;
    } & {
        _id: string;
        album?: string;
    })[]
}
export  function AlbumItem({title,photos, albumId}:IAlbumItemProps){
    const hoverRef = useRef(null)
    const isHover = useHover(hoverRef)
    return (
        <Link  href ={`/guest/album/${albumId}`} ref = {hoverRef} className="flex flex-col items-center relative">
            <div className="relative w-[250px] h-[300px] ">
            <div className={(isHover ?`rotate-12 translate-x-10 -translate-y-1 scale-75 `:`rotate-2 ` )+`absolute w-[250px] h-[300px] shadow z-100 bg-white   transition-all`}>
                {(photos[2]?.fileLocation??"null")==="null"?
                    <img src="/img/null.jpeg" alt="null" className="object-cover w-[250px] h-[300px]"></img>
                    :
                    <S3Image Key={photos[2].fileLocation} className="object-cover w-[250px] h-[300px]" ></S3Image>
                    }
                </div>
                <div className={(isHover ?`rotate-2 -translate-y-1 scale-75 `:`` )+ `absolute w-[250px] h-[300px] shadow z-100 bg-white   transition-all`}>
                    {(photos[1]?.fileLocation??"null")==="null"?
                    <img src="/img/null.jpeg" alt="null" className="object-cover w-[250px] h-[300px]"></img>
                    :
                    <S3Image Key={photos[1].fileLocation} className="object-cover w-[250px] h-[300px]" ></S3Image>
                    }
                </div>
                <div className={(isHover ?`-rotate-12 -translate-x-10 -translate-y-1 scale-75 `:`-rotate-2 ` )+ `absolute w-[250px] h-[300px] shadow z-100 bg-white  transition-all`}>
                    {(photos[0]?.fileLocation??"null")==="null"?
                        <img src="/img/null.jpeg" alt="null" className="object-cover w-[250px] h-[300px]"></img>
                        :
                        <S3Image Key={photos[0].fileLocation} className="object-cover w-[250px] h-[300px]"></S3Image>
                        }
                </div>
                </div>
            <p className="font-theseasons italic">
                {title}
            </p>
        </Link>
    )
}