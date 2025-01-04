'use client'

import { queryAll } from "@/lib/mongo/actions/AlbumActions";
import { Button } from "@mui/material"
import { useState , useEffect} from "react";
import { AlbumItem, IAlbumItemProps } from './AlbumItem';
import { AlbumAddForm } from "./AlbumAddForm";
import { AlbumEditForm } from "./AlbumEditForm";

export const AlbumManagement =()=>{
    const [albums,setAlbums]= useState<any[]>([])
    const [selectedEdit, setSelectedEdit]=useState<undefined|string>()
    const [openAdd, setOpenAdd] = useState<boolean>(false)
     useEffect(()=>{
        refresh()
    },[])
    async function refresh(){
        const albumList = await queryAll();
        setAlbums(albumList)
    }
    const AddButton=()=>{
        return (
            <div className="z-100">
                <Button onClick={()=>{setOpenAdd(true)}}>Add</Button>
                <AlbumAddForm open={openAdd} 
                submitCallback={()=>{
                    refresh() 
                    setOpenAdd(false)}} 
                cancelCallback={()=>setOpenAdd(false)}/>
            </div>
        )
    }
    console.log(albums)
    if(albums.length<=0){
        return <div className="flex-grow h-full w-full self-stretch">
            <AddButton/>
        </div>
    }
    return <div className="flex-grow h-full w-full">
        <AddButton/>
        {albums.map((e:IAlbumItemProps)=>{
            return <AlbumItem key={e._id} _id={e._id} title={e.title} description={e.description} hidden={e.hidden} onClick={setSelectedEdit}/>
        })}
        <AlbumEditForm _id={selectedEdit} 
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