"use client"

import { getAlbumById, queryAll } from "@/lib/mongo/actions/AlbumActions"
import { commitAdd, getLatestConfig } from "@/lib/mongo/actions/ConfigActions"
import { getAllVideos, getPhotoById } from "@/lib/mongo/actions/PhotoAction"
import { TZodAlbumSchema } from "@/lib/mongo/schema/Album"
import { TZodConfigSchema, ZodConfigSchema } from "@/lib/mongo/schema/Config"
import { TZodPhotoSchema } from "@/lib/mongo/schema/Photo"
import { Autocomplete, Button, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { useEffect, useState } from "react"

// this component is used to add new config and will override old one
export const ConfigAddForm = ()=>{}
export interface IAlbumAddFormProps{
    submitCallback?:()=>void
    cancelCallback?:()=>void
}

const defaultOption = {id:null,label:"please select"}
const categoryOptions = [
    defaultOption,
    {id:"game",label:"game"},
    {id:"video",label:"video"},
    {id:"album",label:"album"}
]
export interface IAutoConfigItem {
    id:string|null
    label:string
  }
export const AlbumAddForm = ({ submitCallback, cancelCallback}:IAlbumAddFormProps)=>{
    const [zoomSDKKey,setzoomSDKKey]=useState<string|undefined>(undefined)
    const [zoomSDKSecret,setzoomSDKSecret]=useState<string|undefined>(undefined)
    const [zoomAPIKey,setzoomAPIKey]=useState<string|undefined>(undefined)
    const [zoomAPISecret,setzoomAPISecret]=useState<string|undefined>(undefined)
    const [zoomSecretToken,setzoomSecretToken]=useState<string|undefined>(undefined)
    const [zoomVerificationToken,setzoomVerificationToken]=useState<string|undefined>(undefined)
    const [youtubeStreamLink,setyoutubeStreamLink]=useState<string|undefined>(undefined)
    const [youtubeStreamKey,setyoutubeStreamKey]=useState<string|undefined>(undefined)
    const [stageDisplayCategory,setstageDisplayCategory]=useState<IAutoConfigItem>(defaultOption)
    const [stageDisplayId,setstageDisplayId]=useState<IAutoConfigItem>(defaultOption)

    const [stageDisplayIdOptions, setStageDisplayIdOptions] = useState<IAutoConfigItem[]>([defaultOption])
    
    const handleCancel=async ()=>{
        resetForm()
        if(cancelCallback){
            cancelCallback()
        }
    }
    const handleSubmit=async ()=>{
        try{
            const validatedData = ZodConfigSchema.parse({
                zoomSDKKey,
                zoomSDKSecret,
                zoomAPIKey,
                zoomAPISecret,
                zoomSecretToken,
                zoomVerificationToken,
                youtubeStreamLink,
                youtubeStreamKey,
                stageDisplayCategory,
                stageDisplayId,
                createdAt:new Date()
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
        setzoomSDKKey(undefined)
        setzoomSDKSecret(undefined)
        setzoomAPIKey(undefined)
        setzoomAPISecret(undefined)
        setzoomSecretToken(undefined)
        setzoomVerificationToken(undefined)
        setyoutubeStreamLink(undefined)
        setyoutubeStreamKey(undefined)
        setstageDisplayCategory(defaultOption)
        setstageDisplayId(defaultOption)
    }

    useEffect(()=>{
        populateStageDisplayIdOptions(stageDisplayCategory.id as "game"|"video"|"album"|null)
    },[stageDisplayCategory.id])

    const populateStageDisplayIdOptions= async (category:"game"|"video"|"album"|null)=>{
         if(category==="album"){
            const result = await queryAll() as (TZodAlbumSchema&{_id:string})[]
            setStageDisplayIdOptions(result.map(e=>({
                id:e._id,
                label:e.title
            })))
        }else if(category==="video"){
            const result = await getAllVideos() as (TZodPhotoSchema&{_id:string})[]
            setStageDisplayIdOptions(result.map(e=>({
                id:e._id,
                label:e.title||""
            })))
        }else if(category==="game"){
            setStageDisplayIdOptions([defaultOption])
        }else{
            setStageDisplayIdOptions([defaultOption])
        }
    }

    const handlePopulateFromLatestConfig =async ()=>{
        const config= await getLatestConfig() as TZodConfigSchema
        setzoomSDKKey(config.zoomSDKKey)
        setzoomSDKSecret(config.zoomSDKSecret)
        setzoomAPIKey(config.zoomAPIKey)
        setzoomAPISecret(config.zoomAPISecret)
        setzoomSecretToken(config.zoomSecretToken)
        setzoomVerificationToken(config.zoomVerificationToken)
        setyoutubeStreamLink(config.youtubeStreamLink)
        setyoutubeStreamKey(config.youtubeStreamKey)
        setstageDisplayCategory(config.stageDisplayCategory?{id:config.stageDisplayCategory,label:config.stageDisplayCategory}:defaultOption)
        if(config.stageDisplayCategory==="album" && config.stageDisplayId){
            const result = await getAlbumById(config.stageDisplayId)
            setstageDisplayId({id:result._id,label:result.title})
        }else if(config.stageDisplayCategory==="video" && config.stageDisplayId){
            const result = await getPhotoById(config.stageDisplayId)
            setstageDisplayId({id:result._id,label:result.title})
        }else{
            setstageDisplayCategory(defaultOption)
        }
        
    }

    return <div>

            <DialogTitle>
                New Config
            </DialogTitle>
            <DialogContent>
                <form className="flex flex-col gap-2">
                    <TextField label="zoomSDKKey" value={zoomSDKKey} onChange={(e)=>setzoomSDKKey(e.target.value)} ></TextField>
                    <TextField label="zoomSDKSecret" value={zoomSDKSecret} onChange={(e)=>setzoomSDKSecret(e.target.value)} ></TextField>
                    <TextField label="zoomAPIKey" value={zoomAPIKey} onChange={(e)=>setzoomAPIKey(e.target.value)} ></TextField>
                    <TextField label="zoomAPISecret" value={zoomAPISecret} onChange={(e)=>setzoomAPISecret(e.target.value)} ></TextField>
                    <TextField label="zoomSecretToken" value={zoomSecretToken} onChange={(e)=>setzoomSecretToken(e.target.value)} ></TextField>
                    <TextField label="zoomVerificationToken" value={zoomVerificationToken} onChange={(e)=>setzoomVerificationToken(e.target.value)} ></TextField>
                    <TextField label="youtubeStreamLink" value={youtubeStreamLink} onChange={(e)=>setyoutubeStreamLink(e.target.value)} ></TextField>
                    <TextField label="youtubeStreamKey" value={youtubeStreamKey} onChange={(e)=>setyoutubeStreamKey(e.target.value)} ></TextField>
                     <Autocomplete<IAutoConfigItem>
                              disablePortal
                              options={categoryOptions}
                              sx={{ width: 300 }}
                              value={stageDisplayCategory}
                              onChange={(event: any, newValue: IAutoConfigItem|null) => {
                                setstageDisplayCategory(newValue===null?defaultOption:newValue);
                              }}
                              renderInput={(params) => <TextField {...params} label="stageDisplayCategory" />}
                              />
                    <Autocomplete<IAutoConfigItem>
                              disablePortal
                              options={stageDisplayIdOptions}
                              sx={{ width: 300 }}
                              value={stageDisplayId}
                              onChange={(event: any, newValue: IAutoConfigItem|null) => {
                                setstageDisplayId(newValue===null?defaultOption:newValue);
                              }}
                              renderInput={(params) => <TextField {...params} label="stageDisplayCategory" />}
                              />
                </form>
            </DialogContent>
            <DialogActions>
                <Button type="button" onClick={handlePopulateFromLatestConfig}>Cancel</Button>
                <Button type="button" onClick={handleCancel}>Cancel</Button>
                <Button type="button" onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </div>
    
}