"use client"
import { commitAdd, commitDelete, queryCommentByUser } from "@/lib/mongo/actions/CommentActions";
import { TZodCommentSchema } from "@/lib/mongo/schema/CommentSchema";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { CommentBroadcastForm } from "@/component/common/CommentBroadcastForm";
import CommentItem from "@/component/common/CommentItem";
export interface ICommentManagerProps{
    userid:string
}
export const CommentManager=({userid}:ICommentManagerProps)=>{
    const submitFunction= async(value:{content:string})=>{
            await commitAdd({
                userId:userid,
                comment:value.content,
                lastUpdate:dayjs().toDate(),
                createdAt:dayjs().toDate(),
                selected:false
            })
            reload()
        }
        const deleteFunction= async(id:string)=>{
            await commitDelete(id)
            reload()
        }
    const [commentList, setCommentList] = useState<(TZodCommentSchema & {
        _id: string;
    })[]>([])
    const reload = async() =>{
        const comments = await queryCommentByUser(userid)
        setCommentList(comments)
    }
    useEffect(()=>{
        reload()
    },[])
    return (
        <div className="flex flex-col max-h-[100vh] p-14 gap-10 justify-center items-center">

            <div className="max-h-[45%] overflow-y-auto w-full gap-2 flex flex-col">
                {commentList.map(e=>{
                    return (
                        <CommentItem comment={e} key={e._id} deleteFnc={deleteFunction} edit={true}></CommentItem>
                    )
                })}
                
            </div>

            <CommentBroadcastForm submitFnc={submitFunction} title="Leave a Message" description="Leave a message to give blessing to Edward & Kiki"></CommentBroadcastForm>
        </div>
    )
}