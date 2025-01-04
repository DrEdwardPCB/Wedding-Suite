import {Schema, model, models} from 'mongoose'
import {z} from 'zod'

const UserSchema = new Schema({
    id:{type:String, required:true},
    preferredName:{type:String, required:true},
    fullChineseName:{type:String},
    fullEnglishName:{type:String},
    phoneNo:{type:String},
    email:{type:String},
    onlineOnly:{type:Boolean,required:true},
    ceremony:{type:Boolean,required:true},
    dinner:{type:Boolean,required:true},
    password:{type:String, required:true},
    side:{type:String,enum:["GROOM","BRIDE","BOTH"],required:true},
    category:{type:String}, // describe briefly on relations
    remarks:{type:String},
    foodAllergies:{type:String},
    dinnerDeskNumber:{type:Number},
    ceremonySeatNumber:{type:Number},
    checkedIn:{type:Boolean, required:true}// only apply to ceremony==true||dinner==true
})

export default models?.User|| model('User', UserSchema)

export const ZodUserSchema=z.object({
    id:z.string().trim().min(1),
    preferredName:z.string().trim().min(1),
    fullChineseName:z.string().optional().nullable(),
    fullEnglishName:z.string().optional().nullable(),
    phoneNo:z.string().optional().nullable(),
    email:z.string().optional().nullable(),
    onlineOnly:z.boolean(),
    ceremony:z.boolean(),
    dinner:z.boolean(),
    password:z.string(),
    side:z.enum(["GROOM","BRIDE","BOTH"]),
    category:z.string().optional().nullable(),
    remarks:z.string().optional().nullable(),
    foodAllergies:z.string().optional().nullable(),
    dinnerDeskNumber:z.number().optional().nullable(),
    ceremonySeatNumber:z.number().optional().nullable(),
    checkedIn:z.boolean(),// only apply to ceremony==true||dinner==true
})
export type TZodUserSchema = z.infer<typeof ZodUserSchema>