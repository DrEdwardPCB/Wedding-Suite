import { TZodConfigSchema } from '@/lib/mongo/schema/Config';
import { getLatestConfig } from '../../../lib/mongo/actions/ConfigActions';
import emailjs from "@emailjs/nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { findUserByUserId } from '@/lib/mongo/actions/UserActions';
import { decryptData } from '@/lib/encryption';
import { TZodUserSchema } from '@/lib/mongo/schema/UserSchema';
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
    
    const config= await getLatestConfig() as TZodConfigSchema
    if(!config.emailjsAPIKey||!config.emailjsServiceId||!config.emailjsTemplateId){
        return NextResponse.error()
    }
    emailjs.init({publicKey:config.emailjsAPIKey as string});
    emailjs.send(config.emailjsServiceId,config.emailjsTemplateId,{
        to_name:guest.preferredName,
        title:guest.online?"You're All Set for Edward & Kiki's Wedding! Join Us Virtually!":"You're All Set for Edward & Kiki's Wedding ✨ ",
        email:guest.email,
        message:guest.online?virtualTemplate(guest,config):physicalTemplate(guest,config)
    })
    return NextResponse.json({});
    
}
const invitationLink = (guest:TZodUserSchema,config:TZodConfigSchema)=>{
    return `
        <ul>
            ${guest.ceremony||guest.online?`<li>Ceremony: <a href=${config.ceremonyRSVPLink}>${config.ceremonyRSVPLink}</a></li>`:""}
            ${guest.cocktail?`<li>Cocktail: <a href=${config.cocktailRSVPLink}>${config.cocktailRSVPLink}</a></li>`:""}
            ${guest.banquet?`<li>Banquet: <a href=${config.banquetRSVPLink}>${config.banquetRSVPLink}</a></li>`:""}
        </ul>
    `
}
const loginCredentials=(guest:TZodUserSchema)=>{
    return `
        <strong>Your login credentials</strong><br/>
        <ul>
            <li><strong>Username: ${guest.email}</strong></li>
            <li><strong>Password: ${decryptData(guest.password)}</strong></li>
        </ul>
    `
}

const virtualTemplate = (guest:TZodUserSchema,config:TZodConfigSchema)=>{
    return `
        <p>Thank you so much for joining us virtually on our special day! We're thrilled to have you celebrate with us from wherever you are.</p>
        <br/>
        <p><strong>Here's all the wedding info you'll need:</strong></p>
        <ul>
            <li><strong>Date: </strong> August 3, 2025 (Sunday)</li>
            <li><strong>Wedding Time: </strong> Starting at 3:00 PM EDT (don't forget to double-check your local time zone!)</li>
            <li><strong>Wedding Location: </strong> Holland Marsh Wineries (though you'll be joining us online!)</li>
            <li><strong>Watch the Ceremony Live:</strong><a href=https://youtube.com/live/ovEW5SCEmng> https://youtube.com/live/ovEW5SCEmng</a></li>
        </ul>
        <br/>
        <p>We've also created a Google Calendar invitation to help you save the date and keep track of the time. Simply add it to your calendar, and you'll be all set!</p>
        <br/>
        ${invitationLink(guest,config)}
        <br/>
        <p>Feel free to visit our wedding website anytime before the big day for the latest updates and details. We'll be keeping it updated with everything you need to know!</p>
        <br/>
        ${loginCredentials(guest)}
        <br/>
        <p>If you'd like to contribute to our next journey, please visit our website for more details:</p>
        <br/>
        <a href="https://wedding.ekhome.life/contribution">https://wedding.ekhome.life/contribution</a>
    `
}
const physicalTemplate = (guest:TZodUserSchema,config:TZodConfigSchema) =>{
    return `
        <p>We're thrilled that you'll be joining us in person to celebrate our big day! It means the world to us to have you there.</p>
        <br/>
        <p><strong>Here's all the wedding info you'll need:</strong></p>
        <ul>
            <li><strong>Date: </strong> August 3, 2025 (Sunday)</li>
            <li><strong>Wedding Time: </strong> Starting at 3:00 PM EDT (don't forget to double-check your local time zone!)</li>
            <li><strong>Wedding Location: </strong> Holland Marsh Wineries</li>
        </ul>
        <br/>
        <p>We've also created a Google Calendar invitation to help you save the date and keep track of the time. Simply add it to your calendar, and you'll be all set!</p>
        <br/>
        ${invitationLink(guest,config)}
        <br/>
        ${loginCredentials(guest)}
        <br/>
        <p>Simply visit <a href="https://wedding.ekhome.life">wedding.ekhome.life</a>, sign in with the details above, and feel free to update your RSVP or make any changes if needed.</p>
        <br>
        </br>
    `
}