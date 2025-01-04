"use client"
import { commitAdd } from "@/lib/mongo/actions/AlbumActions"
import { ZodAlbumSchema } from "@/lib/mongo/schema/Album"
import { Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, TextField, Button } from "@mui/material"
import {  useState } from "react"

export interface IAlbumAddFormProps{
    open:boolean
    submitCallback?:()=>void
    cancelCallback?:()=>void
}
export const AlbumAddForm = ({open, submitCallback, cancelCallback}:IAlbumAddFormProps)=>{
    const [title,setTitle] = useState<string|undefined>(undefined)
    const [description,setDescription]= useState<string|undefined>(undefined)
    const [hidden,setHidden]= useState<boolean>(false)
    const handleCancel=async ()=>{
        resetForm()
        if(cancelCallback){
            cancelCallback()
        }
    }
    const handleSubmit=async ()=>{
        try{
            const validatedData = ZodAlbumSchema.parse({title,description, hidden})
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
        setTitle(undefined)
        setDescription(undefined)
        setHidden(false)
    }
    return <Dialog open={open}>
            <DialogTitle>
                Add Album
            </DialogTitle>
            <DialogContent>
                <form className="flex flex-col gap-2">
                    <TextField label="title" value={title} onChange={(e)=>setTitle(e.target.value)} ></TextField>
                    <TextField label="description" value={description} onChange={(e)=>setDescription(e.target.value)} ></TextField>
                    <FormControlLabel 
                        control={
                            <Checkbox checked={hidden} onChange={()=>setHidden(!hidden)} ></Checkbox>
                        }
                    label="hidden"/>
                </form>
            </DialogContent>
            <DialogActions>
                <Button type="button" onClick={handleCancel}>Cancel</Button>
                <Button type="button" onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    
}