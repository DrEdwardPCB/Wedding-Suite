import {Schema, model} from 'mongoose'

const ConfigSchema = new Schema({
    zoomSDKKey:{type:String},
    zoomSDKSecret:{type:String},
    zoomAPIKey:{type:String},
    zoomAPISecret:{type:String},
    zoomSecretToken:{type:String},
    zoomVerificationToken:{type:String},
    youtubeStreamLink:{type:String},
    youtubeStreamKey:{type:String}
})

export default model('Config', ConfigSchema )