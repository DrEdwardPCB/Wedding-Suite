import { FadeInSection } from "./common/FadeInSection"
import { LoadImageFromDB } from "./common/ImageSlot"
import { CopyButton } from "./common/CopyButton"
export interface IHomeItemDisplayProps{
    imageSlot:string
    title:string
    description:string
    copyText?:string
    copyMessage?:string
    className?:string
}
export const HomeItemDisplay = async ({imageSlot, title, description, copyText, copyMessage, className}:IHomeItemDisplayProps)=>{
    
    return (
        <FadeInSection className={`${className} p-8 bg-white shadow flex flex-col`} >
            <LoadImageFromDB slot={imageSlot} className="aspect-square object-cover shadow"></LoadImageFromDB>
            <h1 className="uppercase mt-8 mb-4 text-xl text-center">{title}</h1>
            <p>{description}</p>
            <div className="flex-1"></div>
            {
                copyText?
                <CopyButton copyText={copyText} copyMessage={copyMessage} className="self-end justify-items-end mt-2"/>
                :<></>
            }
        </FadeInSection>
    )
}