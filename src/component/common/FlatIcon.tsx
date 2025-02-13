/* eslint-disable @next/next/no-img-element */
export interface IFlatIconProps {
    className?:string
    keys:string
}
export default async function FlatIcon({className,keys}:IFlatIconProps){
    return <img src={`/icon/${keys}`} className={`${className} `}></img>
} 