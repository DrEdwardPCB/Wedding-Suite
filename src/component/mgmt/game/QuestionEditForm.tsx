"use client"
import { getQuestionById, commitUpdate, commitDelete } from "@/lib/mongo/actions/QuestionAction"
import { ZodQuestionSchema } from "@/lib/mongo/schema/QuestionSchema"
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField , Button, Autocomplete} from "@mui/material"
import { useEffect, useState } from "react"

export interface IAlbumEditFormProps{
    _id:string|undefined
    submitCallback?:()=>void
    cancelCallback?:()=>void
}
export const QuestionEditForm = ({_id, submitCallback, cancelCallback}:IAlbumEditFormProps)=>{
    const [open,setOpen] = useState(false)
    const [id, setId] = useState<string|undefined>(undefined)
    const [question,setQuestion] = useState<string|undefined>(undefined)
    const [a,setA]= useState<string|undefined>(undefined)
    const [b,setB]= useState<string|undefined>(undefined)
    const [c,setC]= useState<string|undefined>(undefined)
    const [d,setD]= useState<string|undefined>(undefined)
    const [ans,setAns]= useState<"A"|"B"|"C"|"D"|undefined>(undefined)

    useEffect(()=>{
        async function fetchQuestionById(id:string){
            const questionInfo = await getQuestionById(id);
            setId(questionInfo._id)
            setQuestion(questionInfo.question)
            setA(questionInfo.A)
            setB(questionInfo.B)
            setC(questionInfo.C)
            setD(questionInfo.D)
            setAns(questionInfo.ans)
        }
        if(_id){
            fetchQuestionById(_id)
        }
    },[_id])

    useEffect(()=>{
        if(_id){
            setOpen(true)
        }else{
            setOpen(false)
        }
    },[_id])
    const handleCancel=async ()=>{
        if(cancelCallback){
            cancelCallback()
        }
    }
    const handleDelete=async()=>{
        await commitDelete(id as string)
    }
    const handleSubmit=async ()=>{
        try{
            const validatedResult = ZodQuestionSchema.parse({question,A:a,B:b,C:c,D:d,ans})
            console.log(validatedResult)
            await commitUpdate(id as string,validatedResult)
        }catch(err){
            alert(err)
        }finally{
            if(submitCallback){
                submitCallback()
            }
        }
    }
    if(open){
        return <Dialog open={open}>
            <DialogTitle>
                Edit Album
            </DialogTitle>
            <DialogContent>
                <form className="flex flex-col gap-2">
                    <TextField label="id" value={id} onChange={(e)=>setId(e.target.value)} disabled></TextField>
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
                <Button type="button" onClick={handleDelete}>Delete</Button>
            </DialogActions>
        </Dialog>
    }
    return <></>
}