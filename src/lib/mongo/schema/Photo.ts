import {Schema, Types, model} from 'mongoose'

const PhotoSchema = new Schema({
    fileLocation:{type:String, required:true},
    title:{type:String},
    description:{type:String},
    slot:{type:String},// used for plugin to other pages if needed
    album:{type: Types.ObjectId, ref:"Album"}
})

export default model('Photo', PhotoSchema)