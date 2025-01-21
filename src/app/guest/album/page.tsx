import { AlbumItem } from "@/component/guest/album/AlbumItem";
import { queryAll } from "@/lib/mongo/actions/AlbumActions";
import { queryPhotoByAlbumId } from "@/lib/mongo/actions/PhotoAction";

// absolute w-[300px] h-[400px] shadow z-200 bg-white -rotate-2 -rotate-3 scale-75 -translate-x-10 translate-x-10 rotate-2 rotate-12 -rotate-12 rotate-2 rotate-3 -translate-y-1 p-3 transition-all object-cover w-[300px] h-[400px]
export default async function AlbumPage(){
    const album = await queryAll()
    const AlbumPhotos = await Promise.all(album.map(e=>queryPhotoByAlbumId(e._id,3)))
    return <div className="">
        <h1>Album</h1>
        <div className="flex items-center justify-around w-full p-">

        {album.map((e,i)=>(<AlbumItem key={e._id} title={album[i].title} photos={AlbumPhotos[i]} albumId={e._id} ></AlbumItem>))}
        </div>
    </div>
}