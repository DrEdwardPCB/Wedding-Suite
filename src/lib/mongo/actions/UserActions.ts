/* eslint-disable @typescript-eslint/ban-ts-comment */
'use server'

import _ from "lodash"
import User, { TZodUserSchema } from "../schema/UserSchema"

export const commitAdd=async (user:TZodUserSchema)=>{
    console.log("[User] commit add")
    const newUser = new User(user)
     newUser.save()
}
export const commitDelete=async (id:string)=>{
    console.log("[User] commit delete")
     User.deleteOne({id})
}
export const commitUpdate=async (user:TZodUserSchema)=>{
    console.log("[User] commit update")
    // console.log(user)
    User.findOneAndUpdate({id:user.id},user).then((user)=>user.save())
}
export const queryAll = async()=>{
    //@ts-ignore
    const parsed = (await User.find({})).map(e=>_.omit(e.toJSON(),[,"_id","__v"]))
    return parsed
}