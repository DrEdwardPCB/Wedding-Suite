/* eslint-disable @typescript-eslint/ban-ts-comment */
'use server'

import _ from "lodash"
import Album, { TZodAlbumSchema } from "../schema/Album"
export const commitAdd=async (album:TZodAlbumSchema)=>{
    console.log("[Album] commit add")
    const newAlbum = new Album(album)
     newAlbum.save()
}
export const commitDelete=async (id:string)=>{
    console.log("[Album] commit delete")
     Album.deleteOne({_id:id})
}
export const commitUpdate=async (id:string, album:TZodAlbumSchema)=>{
    console.log("[Album] commit update")
    console.log(album)
    Album.findOneAndUpdate({_id:id},album).then((album)=>album.save())
}
export const queryAll = async()=>{
    //@ts-ignore
    const parsed = (await Album.find({})).map(e=>{
        const result=_.omit(e.toJSON(),["_id","__v"])
        result._id = e._id.toHexString()
        return result
    })
    return parsed
}
export const getAlbumById = async(_id:string)=>{
    const data = (await Album.findById(_id)).toJSON()
    const result = _.omit(data,["_id","__v"])
    result._id = data._id.toHexString()
    return result
}