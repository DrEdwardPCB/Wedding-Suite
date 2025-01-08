"use client"

import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { useState } from "react"
import { TZodPhotoSchema } from '../../../lib/mongo/schema/Photo';
import useSWR from "swr";
import { Button } from "@mantine/core";
const fetcher = (path: string) => fetch(path).then((res) => res.json());
export interface IVideoDisplayProps {
    video:TZodPhotoSchema
}
export const VideoDisplay = ({video}:IVideoDisplayProps)=>{
    const [open, setOpen] = useState(false)
    const { data } = useSWR<{ src: string }>(`/api/documents/${video.fileLocation}`, fetcher)
    if(!open){
        return <div className="shadow w-full bg-slate-300 p-4" onClick={()=>{setOpen(true)}}>
            <p>title: {video.title}</p>
        </div>
    }
    return(
        <>
        <div className="shadow w-full bg-slate-300 p-4" onClick={()=>{setOpen(true)}}>
            <p>{video.title}</p>
        </div>
        <Dialog open={open} fullWidth maxWidth={"xl"} onClose={()=>{setOpen(false)}}>
            <DialogTitle>{video.title}</DialogTitle>
            <DialogContent>
                <video controls className="w-full h-full aspect-video" src={data?.src} ></video>
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>{setOpen(false)}}>close</Button>
            </DialogActions>
        </Dialog>
        </>
    )
}