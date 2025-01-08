import { TZodConfigSchema } from '@/lib/mongo/schema/Config';
import { getLatestConfig } from '../../../lib/mongo/actions/ConfigActions';
import emailjs from "@emailjs/browser";
import { NextRequest, NextResponse } from 'next/server';
import { findUserByUserId } from '@/lib/mongo/actions/UserActions';
//for sending email
export interface ITemplateParams{
    to_name:string,
    message:string
}
export async function POST(request:NextRequest){
    const formData = await request.formData()
    const id = formData.get("userId") as string
    if(!id){
        return NextResponse.error()
    }
    const guest = await findUserByUserId(id)
    if(!guest){
        return NextResponse.error()
    }
    
    const {emailjsAPIKey, emailjsServiceId, emailjsTemplateId, weddingWebsiteUrl, ceremonyRSVPLink, cocktailRSVPLink, banquetRSVPLink }= await getLatestConfig() as TZodConfigSchema
    if(!emailjsAPIKey||!emailjsServiceId||!emailjsTemplateId){
        return NextResponse.error()
    }
    emailjs.init(emailjsAPIKey as string);
    const invitationlink = `
        <ul>
            ${guest.ceremony||guest.onlineOnly?`<li>Ceremony: <a href=${ceremonyRSVPLink}>${ceremonyRSVPLink}</a></li>`:""}
            ${guest.ceremony?`<li>Cocktail: <a href=${cocktailRSVPLink}>${cocktailRSVPLink}</a></li>`:""}
            ${guest.dinner?`<li>Ceremony: <a href=${banquetRSVPLink}>${banquetRSVPLink}</a></li>`:""}
        </ul>
    `
    emailjs.send(emailjsServiceId,emailjsTemplateId,{
        to_name:guest.fullEnglishName??guest.fullChineseName??guest.id,
        message:`
            <p>
            Thank you for joining Edward & Kiki Wedding,<br/>
            Please find all your detail on ${weddingWebsiteUrl} <br/>
            <br/>
            Save the Date---Click the following Invitation link:
            ${invitationlink}
            </p>
            
        `
    })
    return NextResponse.json({});
    
}