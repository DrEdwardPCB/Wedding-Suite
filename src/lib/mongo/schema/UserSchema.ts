import {Schema, model} from 'mongoose'

const UserSchema = new Schema({
    name:{type:String, required:true},
    onlineOnly:{type:Boolean,required:true},
    ceremony:{type:Boolean,required:true},
    dinner:{type:Boolean,required:true},
    password:{type:String, required:true},
    side:{type:String,enum:["GROOM","BRIDE","BOTH"],required:true},
    dinnerDeskNumber:{type:Number},
    ceremonySeatNumber:{type:Number}
})

export default model('User', UserSchema)
