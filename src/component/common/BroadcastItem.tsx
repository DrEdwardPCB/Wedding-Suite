"use client"
import { TZodBroadcastSchema } from "@/lib/mongo/schema/BroadcastSchema"
import { IconButton } from "@mui/material"
import dayjs from "dayjs"
import CloseIcon from '@mui/icons-material/Close';
export interface IBroadcastItemProps{
    broadcast:TZodBroadcastSchema&{_id:string}
    edit?:boolean
    deleteFnc?:(id:string)=>Promise<void>|void
}
export default function BroadcastItem({broadcast, edit, deleteFnc}:IBroadcastItemProps){
    return (
        <div className="rounded text-themeDark bg-white shadow flex flex-col p-4 gap-2 w-full">
            {edit&&deleteFnc?
                <div className="flex flex-end">
                    <IconButton onClick={()=>deleteFnc(broadcast._id)}>
                        <CloseIcon></CloseIcon>
                    </IconButton>
                </div>
                    :<></>
            }
            <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: broadcast.message??"" }}
                />
            <div className="flex w-full justify-end">
                {dayjs(broadcast.lastUpdate).format("YYYY-MM-DD HH:mm")}
            </div>
        </div>
    )
}