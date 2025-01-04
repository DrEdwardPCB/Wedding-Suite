/* eslint-disable @typescript-eslint/ban-ts-comment */
'use server'

import _ from "lodash"
import Photo, { TZodPhotoSchema } from "../schema/Photo"
export const commitAdd=async (photo:TZodPhotoSchema)=>{
    console.log("[Photo] commit add")
    const newPhoto = new Photo(photo)
     newPhoto.save()
}
export const commitDelete=async (id:string)=>{
    console.log("[Photo] commit delete")
     Photo.deleteOne({_id:id})
}
export const commitUpdate=async (id:string, photo:TZodPhotoSchema)=>{
    console.log("[Photo] commit update")
    // console.log(photo)
    Photo.findOneAndUpdate({_id:id},photo).then((photo)=>photo.save())
}
export const queryAll = async()=>{
    //@ts-ignore
        const parsed = (await Photo.find({})).map(e=>{
            const result=_.omit(e.toJSON(),["__v"])
            result._id = e._id.toHexString()
            return result
        })
        return parsed
}
export const queryPhotoByAlbumId=async(album:string)=>{
    const parsed = (await Photo.find({
        album: album
    })).map(e=>{
        const result=_.omit(e.toJSON(),["__v"])
        result._id = e._id.toHexString()
        return result
    })
    return parsed
}
export const getPhotoBySlot=async(slot:string)=>{
    const parsed = (await Photo.findOne({
        slot
    }))
    const result=_.omit(parsed.toJSON(),["_id","__v"])
    result._id = parsed._id.toHexString()
    return result
    
}
export const getAllVideos=async()=>{
    const parsed = (await Photo.find({
        type:"video"
    })).map(e=>{
        const result=_.omit(e.toJSON(),["_id","__v"])
        result._id = e._id.toHexString()
        return result
    })
    return parsed
}