/* eslint-disable @typescript-eslint/ban-ts-comment */
'use server'

import _ from "lodash"
import Comment, { TZodCommentSchema } from "../schema/CommentSchema"

export const commitAdd=async (user:TZodCommentSchema)=>{
    console.log("[Comment] commit add")
    const newComment = new Comment(user)
    await newComment.save()
}
export const commitDelete=async (id:string)=>{
    console.log("[Comment] commit delete")
    console.log(id)
     await Comment.findByIdAndDelete(id)
}
export const commitUpdate=async (id:string,comment:TZodCommentSchema)=>{
    console.log("[Comment] commit update")
    // console.log(user)
    await Comment.findByIdAndUpdate(id,comment).then((comment)=>comment.save())
}
export const queryAll = async()=>{
    //@ts-ignore
    const parsed = (await Comment.find({})).map(e=>_.omit(e.toJSON(),[,"__v"]))
    return parsed
}
export const queryCommentByUser = async(userId:string)=>{
    //@ts-ignore
    const parsed = (await Comment.find({userId:userId})).map(e=>_.omit(e.toJSON(),[,"__v"]))
    return parsed
}
