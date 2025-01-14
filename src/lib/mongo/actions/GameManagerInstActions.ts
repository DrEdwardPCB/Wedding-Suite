/* eslint-disable @typescript-eslint/ban-ts-comment */
'use server'

import _ from "lodash"
import GameManagerInst, { TZodGameManagerInstSchema } from "../schema/GameManagerInst"

export const commitAdd=async (gm:TZodGameManagerInstSchema)=>{
    console.log("[GameManagerInst] commit add")
    const newGameManagerInst = new GameManagerInst(gm)
     newGameManagerInst.save()
}
export const commitDelete=async (id:string)=>{
    console.log("[GameManagerInst] commit delete")
     GameManagerInst.deleteOne({id})
}
export const commitUpdate=async (gm:TZodGameManagerInstSchema)=>{
    console.log("[GameManagerInst] commit update")
    GameManagerInst.findOneAndUpdate({id:gm.id},gm).then((gm)=>gm.save())
}
export const queryAll = async():Promise<TZodGameManagerInstSchema[]>=>{
    //@ts-ignore
    const parsed = (await GameManagerInst.find({})).map(e=>_.omit(e.toJSON(),[,"_id","__v"]))
    return parsed as TZodGameManagerInstSchema[]
}

export const findGameManagerInstByGameManagerInstId = async(id:string):Promise<TZodGameManagerInstSchema|null>=>{
    const user = await GameManagerInst.findOne({id})
    if(!user){
        return null
    }
    const parsed = _.omit(user.toJSON(),["_id","__v"]) as TZodGameManagerInstSchema
    return parsed
}
export const findGameManagerInstByMongoId = async(id:string):Promise<TZodGameManagerInstSchema|null>=>{
    const user = await GameManagerInst.findById(id)
    if(!user){
        return null
    }
    const parsed = _.omit(user.toJSON(),["_id","__v"]) as TZodGameManagerInstSchema
    return parsed
}
export const deleteAllGameInst = async()=>{
    return await GameManagerInst.deleteMany({})
}
