import { getSession, loginMgmt } from "@/lib/ironsession/action";
import { redirect } from "next/navigation";
import { PasswordInput, TextInput } from '@mantine/core';

export default async function MgmtLoginPage(){
    const session = await getSession();
    if(session.isAdmin&&session.isLoggedIn){
        redirect("/mgmt/")
    }
    return (<div className="flex gap-4 items-center justify-start flex-col">
        <form action={loginMgmt}>
        <TextInput
            name="username"
            radius="lg"
            description="Username registered on vault"
            label="Username"
            placeholder="Focus me to see tooltip"
        />
        <PasswordInput
            name="password"
            radius="lg"
            label="Password"
            description="the word that only you can remember"
            error="incorrect"
            placeholder="Input placeholder"
        />
        </form>
    </div>)
}