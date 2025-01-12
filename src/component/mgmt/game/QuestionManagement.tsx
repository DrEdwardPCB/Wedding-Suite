"use client"

import { queryAll } from "@/lib/mongo/actions/QuestionAction"
import { Button } from "@mui/material"
import { useEffect, useState } from "react"
import { QuestionItem } from "./QuestionItem"
import { QuestionEditForm } from "./QuestionEditForm"
import { QuestionAddForm } from "./QuestionAddForm"
import { TZodQuestionSchema } from "@/lib/mongo/schema/QuestionSchema"

export const QuestionManagement = ()=>{
    const [questions,setQuestions]= useState<(TZodQuestionSchema&{_id:string})[]>([])
    const [selectedEdit, setSelectedEdit]=useState<undefined|string>()
    const [openAdd, setOpenAdd] = useState<boolean>(false)
     useEffect(()=>{
        refresh()
    },[])
    async function refresh(){
        const questionList = await queryAll();
        setQuestions(questionList)
    }
    const AddButton=()=>{
        return (
            <div className="z-100">
                <Button onClick={()=>{setOpenAdd(true)}}>Add</Button>
                <QuestionAddForm open={openAdd} 
                submitCallback={()=>{
                    refresh() 
                    setOpenAdd(false)}} 
                cancelCallback={()=>setOpenAdd(false)}/>
            </div>
        )
    }
    if(questions.length<=0){
        return <div className="flex-grow h-full w-full self-stretch">
            <AddButton/>
        </div>
    }
    return <div className="flex-grow h-full w-full">
        <AddButton/>
        {questions.map((e)=>{
            return <QuestionItem key={e._id} question={e} onClick={setSelectedEdit}/>
        })}
        <QuestionEditForm _id={selectedEdit} 
            submitCallback={()=>{
                refresh() 
                setSelectedEdit(undefined)
            }}
            cancelCallback={()=>{
                setSelectedEdit(undefined)
            }}
        />
    </div>
}