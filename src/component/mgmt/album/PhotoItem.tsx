"use client"

import { S3Image } from "@/component/common/images"
import { Tooltip } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import useSWRMutation from "swr/mutation";
export interface IPhotoItemProps{
    fileLocation:string,
    onDeleteCallback?:()=>void
}

async function deletePhoto(
    url:string,
){
    const response = await fetch(url,{method:"DELETE"})
    return response.json()
}
export const PhotoItem = ({fileLocation, onDeleteCallback}:IPhotoItemProps)=>{
    const { trigger } = useSWRMutation(`/api/documents/${fileLocation}`, deletePhoto);
    const handleDeleteClick = async()=>{
        trigger()
        if (onDeleteCallback){
            onDeleteCallback()
        }
    }
    return (
    <div className="w-full aspect-square relative">
        <Tooltip className="cursor-pointer absolute top-0 right-7 aspect-square w-4 z-100" title = "delete picture">
            <div className="" onClick={()=>handleDeleteClick()}>
                <CloseIcon/>
            </div>
        </Tooltip>
        <S3Image Key={fileLocation} />
    </div>)
} 