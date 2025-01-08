"use client"

import { getAlbumById, queryAll } from "@/lib/mongo/actions/AlbumActions"
import { commitAdd, getLatestConfig } from "@/lib/mongo/actions/ConfigActions"
import { getAllVideos, getPhotoById } from "@/lib/mongo/actions/PhotoAction"
import { TZodAlbumSchema } from "@/lib/mongo/schema/Album"
import { TZodConfigSchema, ZodConfigSchema } from "@/lib/mongo/schema/Config"
import { TZodPhotoSchema } from "@/lib/mongo/schema/Photo"
import { Autocomplete, Button, Checkbox, DialogActions, DialogContent, DialogTitle, FormControlLabel, TextField } from "@mui/material"
import { useEffect, useState } from "react"

// this component is used to add new config and will override old one
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
export const ConfigAddForm = ({ submitCallback, cancelCallback}:IAlbumAddFormProps)=>{
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
    const [guestSigninable, setguestSigninable] = useState<boolean>(false)
    const [ceremonyRSVPLink, setceremonyRSVPLink] = useState<string|undefined>(undefined)
    const [cocktailRSVPLink, setcocktailRSVPLink] = useState<string|undefined>(undefined)
    const [banquetRSVPLink, setbanquetRSVPLink] = useState<string|undefined>(undefined)
    const [emailjsAPIKey, setemailjsAPIKey] = useState<string|undefined>(undefined)
    const [emailjsServiceId, setemailjsServiceId] = useState<string|undefined>(undefined)
    const [emailjsTemplateId, setemailjsTemplateId] = useState<string|undefined>(undefined)
    const [weddingWebsiteUrl, setweddingWebsiteUrl] = useState<string|undefined>(undefined)


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
                stageDisplayCategory:stageDisplayCategory?.id??"album",
                stageDisplayId:stageDisplayId?.id??"",
                createdAt:new Date(),
                guestSigninable,
                ceremonyRSVPLink,
                cocktailRSVPLink,
                banquetRSVPLink,
                emailjsAPIKey,
                emailjsServiceId,
                emailjsTemplateId,
                weddingWebsiteUrl,
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
        setguestSigninable(false)
        setceremonyRSVPLink(undefined)
        setcocktailRSVPLink(undefined)
        setbanquetRSVPLink(undefined)
        setemailjsAPIKey(undefined)
        setemailjsServiceId(undefined)
        setemailjsTemplateId(undefined)
        setweddingWebsiteUrl(undefined)
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
        setguestSigninable(false)
        setceremonyRSVPLink(config.ceremonyRSVPLink)
        setcocktailRSVPLink(config.cocktailRSVPLink)
        setbanquetRSVPLink(config.banquetRSVPLink)
        setemailjsAPIKey(config.emailjsAPIKey)
        setemailjsServiceId(config.emailjsServiceId)
        setemailjsTemplateId(config.emailjsTemplateId)
        setweddingWebsiteUrl(config.weddingWebsiteUrl)
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
                        renderInput={(params) => <TextField {...params} label="stageDisplayId" />}
                        />
                    <FormControlLabel 
                        control={
                            <Checkbox checked={guestSigninable} onChange={()=>setguestSigninable(!guestSigninable)} ></Checkbox>
                        }
                    label="guestSigninable"/>
                    <TextField label="ceremonyRSVPLink" value={ceremonyRSVPLink} onChange={(e)=>setceremonyRSVPLink(e.target.value)} ></TextField>
                    <TextField label="cocktailRSVPLink" value={cocktailRSVPLink} onChange={(e)=>setcocktailRSVPLink(e.target.value)} ></TextField>
                    <TextField label="banquetRSVPLink" value={banquetRSVPLink} onChange={(e)=>setbanquetRSVPLink(e.target.value)} ></TextField>
                    <TextField label="emailjsAPIKey" value={emailjsAPIKey} onChange={(e)=>setemailjsAPIKey(e.target.value)} ></TextField>
                    <TextField label="emailjsServiceId" value={emailjsServiceId} onChange={(e)=>setemailjsServiceId(e.target.value)} ></TextField>
                    <TextField label="emailjsTemplateId" value={emailjsTemplateId} onChange={(e)=>setemailjsTemplateId(e.target.value)} ></TextField>
                    <TextField label="weddingWebsiteUrl" value={weddingWebsiteUrl} onChange={(e)=>setweddingWebsiteUrl(e.target.value)} ></TextField>
                    
                </form>
            </DialogContent>
            <DialogActions>
                <Button type="button" onClick={handlePopulateFromLatestConfig}>Populate</Button>
                <Button type="button" onClick={handleCancel}>Cancel</Button>
                <Button type="button" onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </div>
    
}