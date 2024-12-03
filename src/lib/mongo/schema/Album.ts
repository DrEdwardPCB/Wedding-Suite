import {Schema, model} from 'mongoose'

const AlbumSchema = new Schema({
    title:{type:String},
    description:{type:String},
})

export default model('Album', AlbumSchema )