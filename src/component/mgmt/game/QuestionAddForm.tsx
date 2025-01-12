"use client"
import { commitAdd } from "@/lib/mongo/actions/QuestionAction"
import { ZodQuestionSchema } from "@/lib/mongo/schema/QuestionSchema"
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Autocomplete } from "@mui/material"
import {  useState } from "react"

export interface IQuestionAddForm{
    open:boolean
    submitCallback?:()=>void
    cancelCallback?:()=>void
}
export const QuestionAddForm = ({open, submitCallback, cancelCallback}:IQuestionAddForm)=>{
    const [question,setQuestion] = useState<string|undefined>(undefined)
    const [a,setA]= useState<string|undefined>(undefined)
    const [b,setB]= useState<string|undefined>(undefined)
    const [c,setC]= useState<string|undefined>(undefined)
    const [d,setD]= useState<string|undefined>(undefined)
    const [ans,setAns]= useState<"A"|"B"|"C"|"D"|undefined>(undefined)
    
    const handleCancel=async ()=>{
        resetForm()
        if(cancelCallback){
            cancelCallback()
        }
    }
    const handleSubmit=async ()=>{
        try{
            const validatedData = ZodQuestionSchema.parse({
                question,A:a,B:b,C:c,D:d,ans
            })
            await commitAdd(validatedData)
            resetForm()
        }catch(err){
            alert(err)
        }finally{
            if(submitCallback){
                submitCallback()
            }
        }
    }
    const resetForm = ()=>{
        setQuestion(undefined)
        setA(undefined)
        setB(undefined)
        setC(undefined)
        setD(undefined)
        setAns(undefined)
    }
    return <Dialog open={open}>
            <DialogTitle>
                Add Album
            </DialogTitle>
            <DialogContent>
                <form className="flex flex-col gap-2">
                    <TextField label="Question" value={question} onChange={(e)=>setQuestion(e.target.value)} ></TextField>
                    <TextField label="a" value={a} onChange={(e)=>setA(e.target.value)} ></TextField>
                    <TextField label="b" value={b} onChange={(e)=>setB(e.target.value)} ></TextField>
                    <TextField label="c" value={c} onChange={(e)=>setC(e.target.value)} ></TextField>
                    <TextField label="d" value={d} onChange={(e)=>setD(e.target.value)} ></TextField>
                    <Autocomplete<"A"|"B"|"C"|"D">
                        disablePortal
                        options={["A","B","C","D"]}
                        sx={{ width: 300 }}
                        value={ans}
                        onChange={(event: any, newValue: "A"|"B"|"C"|"D"|null) => {
                            setAns(newValue!);
                        }}
                        className="flex-1 min-w-[300px]"
                        renderInput={(params) => <TextField className="flex-1 min-w-[300px]" {...params} label="Side" />}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button type="button" onClick={handleCancel}>Cancel</Button>
                <Button type="button" onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    
}