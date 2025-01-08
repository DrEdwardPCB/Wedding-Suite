import { getSession, logoutMgmt } from "@/lib/ironsession/action";
import { redirect } from "next/navigation";
import { getLatestConfig } from '../../../lib/mongo/actions/ConfigActions';
import { TZodConfigSchema } from '../../../lib/mongo/schema/Config';
import { queryAll } from "@/lib/mongo/actions/AlbumActions";
import { getAllVideos } from "@/lib/mongo/actions/PhotoAction";
import { TZodPhotoSchema } from "@/lib/mongo/schema/Photo";
import { TZodAlbumSchema } from "@/lib/mongo/schema/Album";
import { ConfigAddForm } from "@/component/mgmt/config/ConfigAddForm";
import { MgmtHome } from "@/component/common/MgmtHome";
import { Button } from "@mui/material";
export const dynamic = 'force-dynamic'
export default async function ConfigPage(){
    const session = await getSession();
    if(!session.isAdmin||!session.isLoggedIn){
        alert("You have not loggedin we are redirecting you to mgmt login")
        redirect("/mgmt/auth")
    }
    const config = (await getLatestConfig() ) as TZodConfigSchema &{_id:string}
    const albumlist = (await queryAll() ) as (TZodAlbumSchema &{_id:string})[]
    const albumKV= albumlist.map(e=>({id:e._id, title:e.title}))
    const videoList = (await getAllVideos()) as (TZodPhotoSchema&{_id:string})[]
    const videoKV = videoList.map(e=>({id:e._id, title:e.title}))
    return(
        <div>

            <div className="w-full p-10 flex items-center justify-between ">
                <MgmtHome/>
                    <h1 className="">Album</h1>
                <Button onClick = {logoutMgmt}>
                    logout
                </Button>
            </div>
            <table className="w-full m-4">
                <tbody>

                <tr>
                    <th>key</th>
                    <th>value</th>
                </tr>
                {Object.entries(config).map(([key,value])=>{
                    if(key==="stageDisplayId"){
                        return (<tr key={key}>
                            <td>{key}</td>
                            {
                                config.stageDisplayCategory==="video"?
                                <td>{videoKV.find(e=>e.id===value)?.title??"undefined"}</td>:
                                <></>
                            }
                            {
                                config.stageDisplayCategory==="album"?
                                <td>{albumKV.find(e=>e.id===value)?.title??"undefined"}</td>:
                                <></>
                            }
                            {
                                config.stageDisplayCategory==="game"?
                                <td></td>:
                                <></>
                            }
                        </tr>)
                    }
                    return (<tr key={key}>
                        <td>{key}</td>
                        <td>{value?.toString()}</td>
                    </tr>)
                })}
                </tbody>
            </table>
            <ConfigAddForm/>
        </div>
    )
}