import { TZodConfigSchema } from '@/lib/mongo/schema/Config';
import { getLatestConfig } from '../../../lib/mongo/actions/ConfigActions';
import emailjs from "@emailjs/nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { findUserByUserId } from '@/lib/mongo/actions/UserActions';
import { decryptData } from '@/lib/encryption';
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
    emailjs.init({publicKey:emailjsAPIKey as string});
    const invitationlink = `
        <ul>
            ${guest.ceremony||guest.online?`<li>Ceremony: <a href=${ceremonyRSVPLink}>${ceremonyRSVPLink}</a></li>`:""}
            ${guest.cocktail?`<li>Cocktail: <a href=${cocktailRSVPLink}>${cocktailRSVPLink}</a></li>`:""}
            ${guest.banquet?`<li>Banquet: <a href=${banquetRSVPLink}>${banquetRSVPLink}</a></li>`:""}
        </ul>
    `
    emailjs.send(emailjsServiceId,emailjsTemplateId,{
        to_name:guest.preferredName,
        email:guest.email,
        message:`
            <p>
            Thank you for joining Edward & Kiki Wedding,<br/>
            Please find all your detail on ${weddingWebsiteUrl} <br/><br/>
            Your login credentials will be: <br/>
            username: <strong> ${guest.email} </strong><br/>
            password: <strong> ${decryptData(guest.password)}</strong>
            <br/>
            <br/>
            Save the Date; Click the following Invitation link:
            ${invitationlink}
            <br/><br/>
            looking forward to see you <br/>
            at: <strong>Holland Marsh Wineries, 18270 Keele St, Newmarket, ON, Canada L3Y 4V9</strong><br/>
            on: <strong>August 3, 2025 | 4:00 pm onwards</strong>
            </p>
            
        `
    })
    return NextResponse.json({});
    
}