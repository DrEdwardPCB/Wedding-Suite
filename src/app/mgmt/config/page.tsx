import { getSession, logoutMgmt } from "@/lib/ironsession/action";
import { redirect } from "next/navigation";
import { getLatestConfig } from '../../../lib/mongo/actions/ConfigActions';
import { TZodConfigSchema } from '../../../lib/mongo/schema/Config';
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