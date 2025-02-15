import { logoutGuest } from "@/lib/ironsession/action";
import { IconButton } from "@mui/material";
import Link from "next/link";
import HomeIcon from '@mui/icons-material/Home';
import FlatIcon from "../common/FlatIcon";

export interface IGuestNavProps{
    title?:string
    home?:boolean
}
export default async function GuestNav({title, home}:IGuestNavProps){
    return (

        <nav className="h-[10vh] w-full bg-themeLight shadow-inner flex items-center justify-between p-4">
            {home?<Link href="/guest"><IconButton><HomeIcon></HomeIcon></IconButton></Link>:<div></div>}
            {title?
            <div className="font-theseasons italic font-bold text-themeSemiDark text-lg md:text-2xl">{title}</div>
            :<div className=" max-w-[250px] "><FlatIcon className=" aspect-[1440/404] object-cover w-full h-full z-50" keys="Heading.png"></FlatIcon></div>}
            <form action={logoutGuest} >
                <button className="transition-all px-6 py-2 text-center text-xs md:text-base text-themeDark border border-themeDark hover:bg-white hover:text-themeDark active:bg-slate-100 focus:outline-none focus:ring">logout</button>
            </form>
        </nav>
    )
}