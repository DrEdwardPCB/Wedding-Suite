/* eslint-disable @next/next/no-img-element */
import { getPhotoBySlot } from "@/lib/mongo/actions/PhotoAction"
import { S3Image } from "./images"
export async function LoadImageFromDB({slot,className}:{slot:string, className?:string}){
    const image = await getPhotoBySlot(slot)
    if(image?.fileLocation){
      return <S3Image Key={image.fileLocation} className={className}></S3Image>
    }
    return <img src={`/img/${slot}.jpeg`} alt={slot} className = {className}></img>
  }