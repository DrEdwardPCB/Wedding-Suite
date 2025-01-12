import {Schema, model, Types, models} from 'mongoose'

const MessageBoardSchema = new Schema({
    createdAt:{type:Date, reqired:true},
    message:String,
    fileLocation:String,
    User:{type: Types.ObjectId,ref:"User"}
})

export default models.MessageBoard || model('MessageBoard', MessageBoardSchema)
