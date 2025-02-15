"use client"
import { commitAdd, commitDelete, queryAll } from "@/lib/mongo/actions/BroadcastActions";
import { TZodBroadcastSchema } from "@/lib/mongo/schema/BroadcastSchema";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { CommentBroadcastForm } from "@/component/common/CommentBroadcastForm";
import BroadcastItem from "@/component/common/BroadcastItem";

export const BroadcastManager=()=>{
    const submitFunction= async(value:{content:string})=>{
            await commitAdd({
                message:value.content,
                lastUpdate:dayjs().toDate(),
            })
            reload()
        }
        const deleteFunction= async(id:string)=>{
            await commitDelete(id)
            reload()
        }
    const [broadcastList, setBroadcastList] = useState<(TZodBroadcastSchema & {
        _id: string;
    })[]>([])
    const reload = async() =>{
        const broadcasts = await queryAll()
        setBroadcastList(broadcasts)
    }
    useEffect(()=>{
        reload()
    },[])
    return (
        <div className="flex flex-col max-h-[100vh] p-14 gap-10 justify-center items-center">

            <div className="max-h-[45%] overflow-y-auto w-full gap-2 shadow flex flex-col">
                {broadcastList.map(e=>{
                    return (
                        <BroadcastItem broadcast={e} key={e._id} deleteFnc={deleteFunction} edit={true}></BroadcastItem>
                    )
                })}
                
            </div>

            <CommentBroadcastForm submitFnc={submitFunction} title="Broadcast" description="Newly updated broadcast message"></CommentBroadcastForm>
        </div>
    )
}