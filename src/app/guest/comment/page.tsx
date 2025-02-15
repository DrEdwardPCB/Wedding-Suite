
import { CommentManager } from "@/component/guest/comment/CommentManager";
import { getSession } from "@/lib/ironsession/action";
import { redirect } from "next/navigation";
// space-y-2 space-x-2 mb-4 block text-sm font-medium text-gray-700 bg-gray-200 bg-blue-600 border

export default async function CommentPage(){
    const session = await getSession();
            if(!session.userid||session.isAdmin||!session.isLoggedIn){
                redirect("/guest/auth/signin")
            }
    return (<div>
        <CommentManager userid={session.userid}></CommentManager>
    </div>)
  
} 