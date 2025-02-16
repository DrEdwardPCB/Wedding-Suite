import _ from 'lodash'
import { isNil } from 'lodash'
import {z} from 'zod'
export const ZodRegisterEmailEntry = z.object({
    email:z.string().email(),
    reenterEmail:z.string().email()
}).refine(schema=>{
    return schema.email===schema.reenterEmail
},{
    path:["reenterEmail"],
    message:"Email addresses are not matching"})
export const DefaultZodRegisterEmailEntry:z.infer<typeof ZodRegisterEmailEntry> ={
        email:"",
        reenterEmail:""
}

export const ZodRegisterPersonalDetail = z.object({
    prefix:z.enum(["Mr.","Miss.","Mrs.",""]),
    preferredName:z.string().trim().min(1),
    surname:z.string().trim().min(1),
    firstname:z.string().trim().min(1),
    fullChineseName:z.string().optional().nullable(),
    phonePrefix:z.enum(["+852","+1","+86","+44","+61",""]),
    phoneNumber:z.string().optional().nullable(),
    relationship:z.string(),
    side:z.enum(["GROOM","BRIDE","BOTH"])
}).refine(schema=>{
    if(schema.phonePrefix==="+1"){
        if(isNil(schema.phoneNumber)){
            return false
        }
        return new RegExp('^\\d{3}[- ]?\\d{3}[- ]?\\d{4}$').test(schema.phoneNumber)
    }
    return true
    },{
        path:["phoneNumber"],
        message:"Phone Number should be 10 digit"
    }
).refine(schema=>{
    if(schema.phonePrefix==="+852"){
        if(isNil(schema.phoneNumber)){
            return false
        }
        return new RegExp('^[2-9]\\d{7}$').test(schema.phoneNumber)
    }
    return true
    },{
        path:["phoneNumber"],
        message:"Phone Number should be 8 digit"
    }
).refine(schema=>{
    if(schema.phonePrefix==="+86"){
        if(isNil(schema.phoneNumber)){
            return false
        }
        return new RegExp('^1[3-9]\\d{9}$').test(schema.phoneNumber)
    }
    return true
    },{
        path:["phoneNumber"],
        message:"Phone Number should be 11 digit"
    }
).refine(schema=>{
    if(schema.phonePrefix==="+44"){
        if(isNil(schema.phoneNumber)){
            return false
        }
        return new RegExp('^0[1-9]\\d{8,9}$').test(schema.phoneNumber)
    }
    return true
    },{
        path:["phoneNumber"],
        message:"Phone Number should be 10/11 digit"
    }
).refine(schema=>{
    if(schema.phonePrefix==="+61"){
        if(isNil(schema.phoneNumber)){
            return false
        }
        return new RegExp('^0[2-478]\d{8}$').test(schema.phoneNumber)
    }
    return true
    },{
        path:["phoneNumber"],
        message:"Phone Number should be 10 digit"
    }
)
export const DefaultZodRegisterPersonalDetail:z.infer<typeof ZodRegisterPersonalDetail> ={
    prefix:"",
    preferredName:"",
    surname:"",
    firstname:"",
    fullChineseName:"",
    phonePrefix:"",
    phoneNumber:"",
    relationship:"",
    side:"BOTH"
}

export const ZodRegisterRemaining = z.object({
    online:z.boolean(),
    ceremony:z.boolean(),
    cocktail:z.boolean(),
    banquet:z.boolean(),
    remarks:z.string().optional().nullable(),
    foodAllergies:z.string().optional().nullable(),
    foodChoice:z.enum(["beef","fish&shrimp","vegetarian",""]).nullable().optional()
}).refine(schema=>{
    if(schema.banquet){
        return ["beef","fish&shrimp","vegetarian"].includes(schema.foodChoice??"")
    }
    return true
})
export const DefaultZodRegisterRemaining:z.infer<typeof ZodRegisterRemaining> ={
    online:false,
    ceremony:false,
    cocktail:false,
    banquet:false,
    remarks:"",
    foodAllergies:"",
    foodChoice:""
}

// auto complete options
export interface IOptions {
    id:string|null
    label:string
}

export const keyToDisplay = (key:string):string=>{
    return _.get({
        email:"E-mail",
        reenterEmail:"ReEnter E-mail",
        prefix:"Prefix",
        preferredName:"Preferred Name",
        surname:"Surname",
        firstname:"First Name",
        fullChineseName:"Full Chinese Name",
        phonePrefix:"Phone Prefix",
        phoneNumber:"Phone #",
        relationship:"Replationship",
        side:"Side",
        online:"Join Virtually",
        ceremony:"Join Ceremony(on-site)",
        cocktail:"Join Cocktail(on-site)",
        banquet:"Join Banquet(on-site)",
        remarks:"Remarks",
        foodAllergies:"foodAllergies",
        foodChoice:"Selected Main Course"


    },key)
}