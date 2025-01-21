"use client"

import { S3Image } from "@/component/common/images"
import { TZodPhotoSchema } from "@/lib/mongo/schema/Photo"
import { Dialog, DialogContent, IconButton, ImageListItem, ImageListItemBar } from "@mui/material"
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";

export interface IAlbumPhotoListItemProps{
    item:TZodPhotoSchema&{_id:string}
}
export function AlbumPhotoListItem({item}:IAlbumPhotoListItemProps){
    const [open,setOpen] = useState(false)
    return (
        <ImageListItem key={item._id} className="bg-white rounded-xl p-1 shadow">
            <S3Image className="rounded-xl" Key={item.fileLocation}></S3Image>   
            <ImageListItemBar position="below" 
            title={<span className="px-4">{item.title}</span>} 
            subtitle={<span className="px-4">{item.description}</span>}
            actionIcon={
                <IconButton
                  sx={{ color: 'rgba(0, 0, 0, 0.54)' }}
                  aria-label={`show large`}
                  onClick={()=>setOpen(true)}
                >
                  <OpenInNewIcon />
                </IconButton>
              }
            />
            <Dialog maxWidth="xl" fullWidth open={open}>
                <DialogContent className="relative">
                    <S3Image Key={item.fileLocation} className=" ">
                   
                    </S3Image>   
                    <IconButton
                    className="absolute w-5 right-10 top-5 z-100"
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  onClick={()=>setOpen(false)}
                >
                  <CloseIcon />
                </IconButton>
                </DialogContent>
            </Dialog>
        </ImageListItem>
    )
}