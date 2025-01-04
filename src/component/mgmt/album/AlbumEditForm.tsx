"use client"
import { commitUpdate, getAlbumById } from "@/lib/mongo/actions/AlbumActions"
import { ZodAlbumSchema } from "@/lib/mongo/schema/Album"
import { Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, TextField , Button} from "@mui/material"
import { useEffect, useState } from "react"

export interface IAlbumEditFormProps{
    _id:string|undefined
    submitCallback?:()=>void
    cancelCallback?:()=>void
}
export const AlbumEditForm = ({_id, submitCallback, cancelCallback}:IAlbumEditFormProps)=>{
    const [open,setOpen] = useState(false)
    const [id, setId] = useState<string|undefined>(undefined)
    const [title,setTitle] = useState<string|undefined>(undefined)
    const [description,setDescription]= useState<string|undefined>(undefined)
    const [hidden,setHidden]= useState<boolean>(false)
    useEffect(()=>{
        async function fetchAlbumById(id:string){
            const albumInfo = await getAlbumById(id);
            setId(albumInfo._id)
            setTitle(albumInfo.title)
            setDescription(albumInfo.description)
            setHidden(albumInfo.hidden)
        }
        if(_id){
            fetchAlbumById(_id)
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
    const handleSubmit=async ()=>{
        try{
            const validatedResult = ZodAlbumSchema.parse({title,description, hidden})
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
    useEffect(()=>{console.log(hidden)},[hidden])
    if(open){
        return <Dialog open={open}>
            <DialogTitle>
                Edit Album
            </DialogTitle>
            <DialogContent>
                <form className="flex flex-col gap-2">
                    <TextField label="id" value={id} onChange={(e)=>setId(e.target.value)} disabled></TextField>
                    <TextField label="title" value={title} onChange={(e)=>setTitle(e.target.value)} ></TextField>
                    <TextField label="description" value={description} onChange={(e)=>setDescription(e.target.value)} ></TextField>
                    <FormControlLabel 
                        control={

                            <Checkbox checked={hidden} onChange={()=>setHidden(!hidden)} ></Checkbox>
                        }
                        label="hidden"
                    />

                </form>
            </DialogContent>
            <DialogActions>
                <Button type="button" onClick={handleCancel}>Cancel</Button>
                <Button type="button" onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    }
    return <></>
}