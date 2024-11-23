import {Schema, model, Types} from 'mongoose'

const QuestionSchema = new Schema({
    question:{type:String, required:true},
    A:{type:String, required:true},
    B:{type:String, required:true},
    C:{type:String, required:true},
    D:{type:String, required:true},
    ans:{type:String, enum:["A","B","C","D"],required:true},
    winner:{type: Types.ObjectId,ref:"User"}
})

export default model('Question', QuestionSchema)
