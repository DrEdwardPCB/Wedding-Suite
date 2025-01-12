"use client"

import { TZodQuestionSchema } from "@/lib/mongo/schema/QuestionSchema"
import { TextField } from "@mui/material"

export interface IAlbumItemProps{
    question:TZodQuestionSchema & {_id:string}
    onClick:(_id:string)=>void
}
export const QuestionItem = ({question, onClick}:IAlbumItemProps)=>{
    return <div className="w-full flex gap-2 mt-4 hover:opacity-70 justify-around " onClick={()=>onClick(question._id)}>
        <TextField className="flex-1 min-w-[300px]" label="Question" value={question.question}  ></TextField>
        <TextField multiline className="flex-1 min-w-[300px]" label="a" value={question.A}  ></TextField>
        <TextField multiline className="flex-1 min-w-[300px]" label="b" value={question.B}  ></TextField>
        <TextField multiline className="flex-1 min-w-[300px]" label="c" value={question.C}  ></TextField>
        <TextField multiline className="flex-1 min-w-[300px]" label="d" value={question.D}  ></TextField>
        <TextField className="flex-1 min-w-[300px]" label="Ans" value={question.ans} />
    </div>
} 