import {Schema, model, Types} from 'mongoose'

const MessageBoardSchema = new Schema({
    createdAt:{type:Date, reqired:true},
    message:String,
    fileLocation:String,
    User:{type: Types.ObjectId,ref:"User"}
})

export default model('MessageBoard', MessageBoardSchema)
