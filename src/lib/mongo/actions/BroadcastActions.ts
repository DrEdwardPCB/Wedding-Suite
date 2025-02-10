/* eslint-disable @typescript-eslint/ban-ts-comment */
'use server'

import _ from "lodash"
import Broadcast, { TZodBroadcastSchema } from "../schema/BroadcastSchema"

export const commitAdd=async (user:TZodBroadcastSchema)=>{
    console.log("[Broadcast] commit add")
    const newBroadcast = new Broadcast(user)
    await newBroadcast.save()
}
export const commitDelete=async (id:string)=>{
    console.log("[Broadcast] commit delete")
    console.log(id)
     await Broadcast.findByIdAndDelete(id)
}
export const commitUpdate=async (id:string,broadcast:TZodBroadcastSchema)=>{
    console.log("[Broadcast] commit update")
    // console.log(user)
    await Broadcast.findByIdAndUpdate(id,broadcast).then((broadcast)=>broadcast.save())
}
export const queryAll = async()=>{
    //@ts-ignore
    const parsed = (await Broadcast.find({})).map(e=>_.omit(e.toJSON(),[,"__v"]))
    return parsed
}
