/* eslint-disable @typescript-eslint/ban-ts-comment */
'use server'

import _ from "lodash"
import Broadcast, { TZodBroadcastSchema } from "../schema/BroadcastSchema"

export const commitAdd=async (user:TZodBroadcastSchema)=>{
    console.log("[Broadcast] commit add")
    const newBroadcast = new Broadcast(user)
    console.log(user)
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
export const queryAll = async():Promise<(TZodBroadcastSchema&{_id:string})[]>=>{
    //@ts-ignore
    const parsed = (await Broadcast.find({})??[]).map(e=>
        {
           const intermediate = _.omit(e.toJSON(),["_id","__v"]) 
                   intermediate._id = e._id.toHexString()
                   return intermediate
        }
    ) as (TZodBroadcastSchema&{_id:string})[]
    return parsed
}
