import CommentItem from "@/component/common/CommentItem";
import { MgmtHome } from "@/component/common/MgmtHome";
import { getSession, logoutMgmt } from "@/lib/ironsession/action";
import { getSelectedComment } from "@/lib/mongo/actions/CommentActions";
import { Button } from "@mui/material";
import { redirect } from "next/navigation";
export default async function StageCommentPage (){
     const session = await getSession();
        if(!session.isAdmin||!session.isLoggedIn){
            redirect("/mgmt/auth")
        }
    const commentList = await getSelectedComment()
    return (
        <div>
            <div className="w-full p-10 flex items-center justify-between">
                <MgmtHome/>
                    <h1 className="">Selected Leave Message</h1>
                <Button onClick = {logoutMgmt}>
                    logout
                </Button>
            </div>
        
            <div className="max-h-[90%] p-14 overflow-y-auto w-full gap-2 flex flex-col">
                {commentList.map(e=>{
                    return (
                        <CommentItem comment={e} key={e._id}></CommentItem>
                    )
                })}
                
            </div>
        
        </div>
    )
}