import {z} from 'zod'
export const ZodRegisterEmailEntry = z.object({
    email:z.string().email(),
    reenterEmail:z.string().email()
}).refine(schema=>{
    return schema.email===schema.reenterEmail
},{
    path:["reenterEmail"],
    message:"email and re-enter email are not the same"})
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
})
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