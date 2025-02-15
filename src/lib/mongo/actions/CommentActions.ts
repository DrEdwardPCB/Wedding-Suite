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
    const parsed = (await Comment.find({})).map(e=>{
        const intermediate = _.omit(e.toJSON(),["_id","__v"]) 
        intermediate._id = e._id.toHexString()
        return intermediate
    }) as (TZodCommentSchema&{_id:string})[]
    console.log(parsed)
    return parsed
}
export const queryCommentByUser = async(userId:string):Promise<(TZodCommentSchema&{_id:string})[]>=>{
    //@ts-ignore
    const parsed = (await Comment.find({userId:userId})).map(e=>{
        const intermediate = _.omit(e.toJSON(),["_id","__v"]) 
        intermediate._id = e._id.toHexString()
        return intermediate
    }) as (TZodCommentSchema&{_id:string})[]
    return parsed
}
export const getSelectedComment = async():Promise<(TZodCommentSchema&{_id:string})[]>=>{
    //@ts-ignore
    const parsed = (await Comment.find({selected:true})).map(e=>{
        const intermediate = _.omit(e.toJSON(),["_id","__v"]) 
        intermediate._id = e._id.toHexString()
        return intermediate
    }) as (TZodCommentSchema&{_id:string})[]
    
    return parsed
}
export const getCommentById = async(commentId:string):Promise<(TZodCommentSchema&{_id:string})>=>{
    const raw = (await Comment.findById(commentId))
    const parsed =  _.omit(raw.toJSON(),["_id","__v"]) as (TZodCommentSchema&{_id:string})
    parsed._id = raw._id.toHexString() 
    return parsed
}