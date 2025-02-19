import { AlbumItem } from "@/component/guest/album/AlbumItem";
import { queryAllEnabled } from "@/lib/mongo/actions/AlbumActions";
import { queryPhotoByAlbumId } from "@/lib/mongo/actions/PhotoAction";
export const dynamic = 'force-dynamic';

// absolute w-[250px] h-[300px] shadow z-200 bg-white -rotate-2 -rotate-3 scale-75 -translate-x-10 translate-x-10 rotate-2 rotate-12 -rotate-12 rotate-2 rotate-3 -translate-y-1 p-3 transition-all object-cover w-[300px] h-[400px]
export default async function AlbumPage(){
    const album = await queryAllEnabled()
    const AlbumPhotos = await Promise.all(album.map(e=>queryPhotoByAlbumId(e._id,3)))
    return (
        <div className="flex gap-4 items-center justify-start flex-col">
            <h1 className=" font-modelsignature text-5xl md:text-6xl pt-12">Album</h1>
            <div className=" flex-1 max-h-[90vh] h-[90vh] w-full overflow-y-auto overflow-x-visible">
                <div className="flex items-center justify-around flex-wrap flex-col md:flex-row w-full h-full p-10 gap-6">

                    {album.map((e,i)=>(<AlbumItem key={e._id} title={album[i].title} photos={AlbumPhotos[i]} albumId={e._id} ></AlbumItem>))}
                </div>
            </div>
        </div>
    ) 
}