"use client"
import { S3Image } from "@/component/common/images"
import { TZodPhotoSchema } from "@/lib/mongo/schema/Photo"

export interface IAlbumPhotoCarouselItemProps{
    photo:TZodPhotoSchema&{_id:string,album?:string}
}
export const AlbumPhotoCarouselItem = ({photo}:IAlbumPhotoCarouselItemProps)=>{
    return <div className="w-full relative h-full">
        <S3Image Key={photo.fileLocation} className="object-cover w-full h-full" />
    </div>
}