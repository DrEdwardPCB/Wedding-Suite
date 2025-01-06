"use client"

import { queryAll } from "@/lib/mongo/actions/AlbumActions"
import { queryPhotoByAlbumId } from "@/lib/mongo/actions/PhotoAction"
import { TextField,Button } from "@mui/material"
import Autocomplete from "@mui/material/Autocomplete"
import { useEffect, useState } from "react"
import { TZodPhotoSchema } from '../../../lib/mongo/schema/Photo';
import { PhotoAddForm } from "./PhotoAddForm"
import { PhotoItem } from "./PhotoItem"
export interface IAlbumSelection {
  id:string|null
  label:string
}
const defaultOption = {id:null,label:"---please select album---"}
export const PhotoManagement = ()=>{
  // list photos in selected Album
  const [albums, setAlbums] = useState<IAlbumSelection[]>([defaultOption])
  const [selectedAlbum, setSelectedAlbum] = useState<IAlbumSelection>(defaultOption)
  const [photos, setPhotos] = useState<(TZodPhotoSchema&{_id:string})[]>([])
  const [openAdd, setOpenAdd] = useState<boolean>(false)
  useEffect(()=>{
    queryAlbum()
  },[])
  useEffect(()=>{
    if(selectedAlbum.id){
      queryPhoto(selectedAlbum.id)
    }else{
      setPhotos([])
    }
  },[selectedAlbum.id])
  async function queryAlbum(){
    const albumList = await queryAll();
    const albumSelectionArray:IAlbumSelection[] = []
    albumSelectionArray.push(defaultOption)
    albumList.forEach(e=>{
      albumSelectionArray.push( {
        id:e._id,
        label:e.title
      })
    })
    setAlbums(albumSelectionArray)
  }
  async function queryPhoto(id:string){
    const photoList= await queryPhotoByAlbumId(id) as (TZodPhotoSchema&{_id:string})[] 
    setPhotos(photoList)
  }
  const AddButton=()=>{
    return (
        <div className="z-100">
            <Button onClick={()=>{setOpenAdd(true)}}>Add</Button>
            <PhotoAddForm open={openAdd} 
            album={selectedAlbum}
            submitCallback={()=>{
              if(selectedAlbum.id){
                queryPhoto(selectedAlbum.id)
              }
                setOpenAdd(false)}} 
            cancelCallback={()=>setOpenAdd(false)}/>
        </div>
    )
}

  return (
    <div className="w-full p-4">
      <div className="flex w-full justify-around items-center">

        <Autocomplete<IAlbumSelection>
          disablePortal
          options={albums}
          sx={{ width: 300 }}
          value={selectedAlbum}
          onChange={(event: any, newValue: IAlbumSelection|null) => {
            setSelectedAlbum(newValue===null?defaultOption:newValue);
          }}
          renderInput={(params) => <TextField {...params} label="Album" />}
          />
          <AddButton/>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {photos.map(e=>{
          return (
            <PhotoItem key = {e._id} fileLocation = {e.fileLocation} onDeleteCallback={()=>{queryPhoto(selectedAlbum.id as string)}}/>
          )
        })}
      </div>
    </div>
  )
}