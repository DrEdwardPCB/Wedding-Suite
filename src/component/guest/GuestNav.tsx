import { logoutGuest } from "@/lib/ironsession/action";
import { IconButton } from "@mui/material";
import Link from "next/link";
import HomeIcon from '@mui/icons-material/Home';

export interface IGuestNavProps{
    title:string
    home?:boolean
}
export default async function GuestNav({title, home}:IGuestNavProps){
    return (

        <nav className="h-[10vh] w-full bg-themeLight shadow-inner flex items-center justify-between p-4">
            {home?<Link href="/guest"><IconButton><HomeIcon></HomeIcon></IconButton></Link>:<div></div>}
            <div className="font-theseasons italic font-bold text-themeSemiDark text-2xl">{title}</div>
            <form action={logoutGuest} >
                <button className="transition-all px-6 py-2 min-w-[120px] text-center text-themeDark border border-themeDark hover:bg-white hover:text-themeDark active:bg-slate-100 focus:outline-none focus:ring">logout</button>
            </form>
        </nav>
    )
}