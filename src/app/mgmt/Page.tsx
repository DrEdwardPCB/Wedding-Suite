import HomeRoute from "@/component/mgmt/HomeRoute";
import { getSession, logoutMgmt } from "@/lib/ironsession/action";
import { redirect } from "next/navigation";
import PhotoAlbumIcon from '@mui/icons-material/PhotoAlbum';
import CastIcon from '@mui/icons-material/Cast';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import PeopleIcon from '@mui/icons-material/People';
import StadiumIcon from '@mui/icons-material/Stadium';
import TheatersIcon from '@mui/icons-material/Theaters';
import { SubmitButton } from "@/component/SubmitButton";
export default async function MgmtHomePage(){
    const session = await getSession();
    if(!session.isAdmin||!session.isLoggedIn){
        redirect("/mgmt/auth")
    }
    return (<div className="flex gap-4 items-center justify-start flex-col bg-gradient-to-br from-themeLight to-themeSemiLight min-h-[100vh]">
        <HomeRoute url={"/mgmt/album"} title="Album" icon={<PhotoAlbumIcon></PhotoAlbumIcon>}/>
        <HomeRoute url={"/mgmt/photo"} title="Photo" icon={<PhotoAlbumIcon></PhotoAlbumIcon>}/>
        <HomeRoute url={"/mgmt/config"} title="Config" icon={<CastIcon></CastIcon>}/>
        <HomeRoute url={"/mgmt/game"} title="Game" icon={<VideogameAssetIcon></VideogameAssetIcon>}/>
        <HomeRoute url={"/mgmt/guest"} title="Guest" icon={<PeopleIcon></PeopleIcon>}/>
        <HomeRoute url={"/mgmt/video"} title="Video" icon={<TheatersIcon></TheatersIcon>}/>
        <div className="">
          <HomeRoute url={"/mgmt/stage/album"} title="Stage Album" icon={<StadiumIcon></StadiumIcon>}/>
          <HomeRoute url={"/mgmt/stage/game"} title="Stage Game" icon={<StadiumIcon></StadiumIcon>}/>
          <HomeRoute url={"/mgmt/stage/video"} title="Stage Video" icon={<StadiumIcon></StadiumIcon>}/>
        </div>
        <form action={logoutMgmt} >
          <div>
            <SubmitButton value="Logout" />
          </div>
        </form>
    </div>)
} 