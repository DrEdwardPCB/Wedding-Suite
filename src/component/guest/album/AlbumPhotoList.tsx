import { queryPhotoByAlbumId } from "@/lib/mongo/actions/PhotoAction"
import { ImageList } from "@mui/material"
import { AlbumPhotoListItem } from "./AlbumPhotoListItem"

export interface IAlbumPhotoListProps{
    albumId:string
}
export default async function AlbumPhotoList({albumId}:IAlbumPhotoListProps){
    const photos=await queryPhotoByAlbumId(albumId)
    return (<ImageList variant="masonry" cols={3} gap={8} className="p-2">
        {photos.map((item)=>
            <AlbumPhotoListItem key={item._id} item={item}/>
        )}
    </ImageList>)
}