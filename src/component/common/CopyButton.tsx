"use client"

import { toast } from "react-toastify"
import { useCopyToClipboard } from "usehooks-ts"

export interface ICopyButtonProps{
    copyText:string
    copyMessage?:string
    className?:string
}
export const CopyButton = ( {copyText, copyMessage, className}:ICopyButtonProps)=>{
    const [copiedText, copy] = useCopyToClipboard()
        const handleCopy = ()=>{
            if(!copyText){
                return
            }
            copy(copyText).then(()=>toast.info(copyMessage?copyMessage:`${copiedText} has been copied to your clipboard`))
        }
    return  <button onClick={()=>{handleCopy()}} className={`${className} transition-all px-6 py-2 min-w-[120px] text-center text-black border border-black hover:bg-black hover:text-white active:bg-slate-100 focus:outline-none focus:ring`}>Copy</button>
}