"use client"

import { FormControlLabel, TextField, Checkbox } from "@mui/material"

export interface IAlbumItemProps{
    _id:string,
    title:string,
    description:string,
    hidden:boolean
    onClick:(_id:string)=>void
}
export const AlbumItem = ({_id, title, description, hidden, onClick}:IAlbumItemProps)=>{
    return <div className="w-full flex gap-2 mt-4 hover:opacity-70 justify-around " onClick={()=>onClick(_id)}>
        <TextField label="id" value={_id} disabled></TextField>
        <TextField label="title" value={title} disabled></TextField>
        <TextField label="description" value={description} disabled ></TextField>
        <FormControlLabel
            control={

                <Checkbox checked={hidden} disabled  ></Checkbox>
            }
            label="hidden"
            >
        </FormControlLabel>
    </div>
} 