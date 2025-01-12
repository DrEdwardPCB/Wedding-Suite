import Link from "next/link"

export interface IHomeRouteProps{
    url:string
    icon:JSX.Element
    title:string
}
export default async function HomeRoute({url,icon,title}:IHomeRouteProps){
    return (
    <Link href={url}>
        <div className="cursor-pointer rounded-md hover:opacity-45 flex items-center justify-around p-4 min-w-40 shadow">
            {icon}
            <h1> {title}</h1>
        </div>
    </Link>
    )
}