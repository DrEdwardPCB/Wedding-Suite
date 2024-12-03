import HomeRoute from "@/component/mgmt/HomeRoute";
import { getSession } from "@/lib/ironsession/action";
import { redirect } from "next/navigation";
import PhotoAlbumIcon from '@mui/icons-material/PhotoAlbum';
import CastIcon from '@mui/icons-material/Cast';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import PeopleIcon from '@mui/icons-material/People';
import StadiumIcon from '@mui/icons-material/Stadium';
import TheatersIcon from '@mui/icons-material/Theaters';
export default async function MgmtHomePage(){
    const session = await getSession();
    if(!session.isAdmin||!session.isLoggedIn){
        alert("You have not loggedin we are redirecting you to mgmt login")
        redirect("/mgmt/auth")
    }
    return (<div className="flex gap-4 items-center justify-start flex-col">
        <HomeRoute url={"/mgmt/album"} title="Album" icon={<PhotoAlbumIcon></PhotoAlbumIcon>}/>
        <HomeRoute url={"/mgmt/stream"} title="Stream" icon={<CastIcon></CastIcon>}/>
        <HomeRoute url={"/mgmt/game"} title="Game" icon={<VideogameAssetIcon></VideogameAssetIcon>}/>
        <HomeRoute url={"/mgmt/guest"} title="Guest" icon={<PeopleIcon></PeopleIcon>}/>
        <HomeRoute url={"/mgmt/stage/album"} title="Stage Album" icon={<StadiumIcon></StadiumIcon>}/>
        <HomeRoute url={"/mgmt/stage/game"} title="Stage Game" icon={<StadiumIcon></StadiumIcon>}/>
        <HomeRoute url={"/mgmt/stage/video"} title="Stage Video" icon={<StadiumIcon></StadiumIcon>}/>
        <HomeRoute url={"/mgmt/video"} title="Video" icon={<TheatersIcon></TheatersIcon>}/>
    </div>)
} 