
export interface IHomeRouteProps{
    url:string
    icon:JSX.Element
    title:string
}
export default async function HomeRoute({url,icon,title}:IHomeRouteProps){
    return (
    <a href={url}>
        <div className="cursor-pointer rounded-md hover:opacity-45 flex items-center justify-around p-4 min-w-40">
            {icon}
            <h1> {title}</h1>
        </div>
    </a>
    )
}