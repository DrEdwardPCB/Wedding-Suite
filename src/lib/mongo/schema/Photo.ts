import {Schema, Types, model, models} from 'mongoose'
import { z } from 'zod'

const PhotoSchema = new Schema({
    fileLocation:{type:String, required:true},
    title:{type:String},//photo/video
    type:{type:String},
    description:{type:String},
    slot:{type:String}, // used for query specific image from 
    album:{type: Types.ObjectId, ref:"Album"}
})

export default models?.Photo||model('Photo', PhotoSchema)

export const ZodPhotoSchema = z.object({
    fileLocation:z.string(),
    title:z.string().optional(),
    type:z.union([
        z.literal('photo'),
        z.literal('video'),
      ]),
    description:z.string().optional(),
    slot:z.string().optional(),
    album:z.string().optional()
})
export type TZodPhotoSchema = z.infer<typeof ZodPhotoSchema>