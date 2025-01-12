import { GamePlay } from "@/component/guest/game/GamePlay";
import { getSession } from "@/lib/ironsession/action";
import { redirect } from "next/navigation";
export default async function GamePage(){
    const session = await getSession();
        if(!session.userid||session.isAdmin||!session.isLoggedIn){
            redirect("/guest/auth/signin")
        }
        return(
            <div className="flex flex-col items-center">
                <div className="w-full p-10 flex items-center justify-between ">
                        <h1 className="">Game</h1>
                  
                </div>
                <GamePlay userId={session.userid}/>
            </div>
        )
}