import { AlbumCarousel } from "@/component/guest/album/AlbumPhotoCarousel"
import AlbumPhotoList from "@/component/guest/album/AlbumPhotoList"
import GuestNav from "@/component/guest/GuestNav";
import { getSession } from "@/lib/ironsession/action";
import { getAlbumById } from "@/lib/mongo/actions/AlbumActions";
import { queryPhotoByAlbumId } from "@/lib/mongo/actions/PhotoAction"
import { redirect } from "next/navigation";

// object-cover w-full h-full absolute w-5 right-10 top-5 z-100 rounded-xl p-1 shadow px-4 rounded
export default async function AlbumPhotoPage({params}:{params:Promise<{key:string}>}){
    const session = await getSession();
        if(!session.isLoggedIn){
            redirect("/")
        }
    const key=(await params).key
    const album = await getAlbumById(key)
    const photos = await queryPhotoByAlbumId(key)
    return (
        <div className="overflow-y-auto">
            <AlbumCarousel photos={photos}/>
            <GuestNav title={album.title} home/>
            <AlbumPhotoList albumId={key} />
        </div>
    )
}