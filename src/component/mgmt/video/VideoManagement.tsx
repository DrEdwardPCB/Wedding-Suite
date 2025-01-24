"use client"

import { getAllVideos } from "@/lib/mongo/actions/PhotoAction"
import { TZodPhotoSchema } from "@/lib/mongo/schema/Photo"
import { Button } from "@mui/material"
import { VideoDisplay } from "@/component/mgmt/video/VideoDisplay";
import { useEffect, useState } from "react"
import { VideoAddForm } from "./VideoAddForm";

export const VideoManagement=()=>{
    const [videos, setVideos] = useState<(TZodPhotoSchema &{_id:string})[]>([])
    const [openAdd, setOpenAdd]= useState(false)
    useEffect(()=>{
        refresh()
    },[])

    const refresh=async ()=>{
        const vids = await getAllVideos() as (TZodPhotoSchema &{_id:string})[]
        setVideos(vids)
    }
    return <>
        <div className="flex w-full justify-end pt-4">
            <Button onClick={()=>{setOpenAdd(true)}}>Add Video</Button>
            <VideoAddForm open={openAdd} 
            submitCallback={()=>{
                refresh()
                setOpenAdd(false)
            }}
            cancelCallback={()=>{
                setOpenAdd(false)
            }}
            />
        </div>
        <div className="flex flex-col w-full p-10 gap-2">

            {(videos??[]).map((e)=><VideoDisplay video={e} key={e._id}></VideoDisplay>)}
        </div>
    </>

}