"use client"
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material"
import {  useState } from "react"
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import useSWRMutation from 'swr/mutation';

export interface IPhotoAddFormProps{
    open:boolean
    submitCallback?:()=>void
    cancelCallback?:()=>void
}
async function uploadPhotos(
    url: string,
    { arg }: { arg: { 
        files: FileWithPath[], 
        title:string|undefined,
        description:string|undefined, 
        type:"photo"|"video",
        slot:string|undefined 
    }}
  ): Promise<object[]> {
    const body = new FormData();
    if(arg.title)
        body.append("title",arg.title)
    if(arg.description)
        body.append("description",arg.description)
    if(arg.type)
        body.append("type",arg.type)
    if(arg.slot)
        body.append("slot",arg.slot)
    arg.files.forEach((file) => {
      body.append("file", file, file.name);
    });
  
    const response = await fetch(url, { method: "POST", body });
    return await response.json();
  }
export const PhotoAddForm = ({open, submitCallback, cancelCallback}:IPhotoAddFormProps)=>{
    const [title,setTitle] = useState<string|undefined>(undefined)
    const [description,setDescription]= useState<string|undefined>(undefined)
    const [slot,setSlot] = useState<string|undefined>(undefined)
    const [files, setFiles] = useState<FileWithPath[]>([])
    const { trigger } = useSWRMutation("/api/documents", uploadPhotos);
    const handleCancel=async ()=>{
        resetForm()
        if(cancelCallback){
            cancelCallback()
        }
    }
    const handleSubmit=async ()=>{
        try{
            console.log(files)
            trigger({
                files,
                title,
                description,
                slot,
                type:"video",
            })
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
        setSlot(undefined)
        setFiles([])
    }
    return <Dialog open={open} fullWidth maxWidth="lg">
            <DialogTitle>
                Add Video
            </DialogTitle>
            <DialogContent>
                <form className="flex flex-col gap-2">
                    <TextField label="title" value={title} onChange={(e)=>setTitle(e.target.value)} ></TextField>
                    <TextField label="description" value={description} onChange={(e)=>setDescription(e.target.value)} ></TextField>
                    <TextField label="slot" value={slot} onChange={(e)=>setSlot(e.target.value)} ></TextField>
                    <Dropzone
                        onDrop={(files)=>setFiles([files[0]])}
                        >
                            <div className="outline outline-2 flex justify-center items-center p-10">
                                Drop here
                            </div>
                    </Dropzone>
                    {files.length>0?
                    <ul>
                        {files.map(e=>{
                            return <li key={e.name}>{e.name}</li>
                        })}
                    </ul>
                    :<></>}
                </form>
            </DialogContent>
            <DialogActions>
                <Button type="button" onClick={handleCancel}>Cancel</Button>
                <Button type="button" onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    
}
