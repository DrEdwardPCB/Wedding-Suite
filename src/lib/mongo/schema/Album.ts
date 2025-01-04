import {Schema, model, models} from 'mongoose'
import { z } from 'zod'

const AlbumSchema = new Schema({
    title:{type:String, require:true},
    description:{type:String},
    hidden:{type:Boolean}//hide from 
})

export default models?.Album||model('Album', AlbumSchema )
export const ZodAlbumSchema = z.object({
    title:z.string(),
    description:z.string().optional(),
    hidden:z.boolean()
})
export type TZodAlbumSchema = z.infer<typeof ZodAlbumSchema>