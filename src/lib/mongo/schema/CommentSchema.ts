// this section allows ppl to leave comment
import {Schema, model, models} from 'mongoose'
import {z} from 'zod'

const CommentSchema = new Schema({
    userId:{type:String,require:true},
    comment:{type:String},
    lastUpdate:{type:Date, require:true},
    selected:{type:Boolean},
    createdAt:{type:Date, require:true},

})

export default models?.Comment||model('Comment',CommentSchema)

export const ZodCommentSchema = z.object({
    userId:z.string(),
    comment:z.string().nullable().optional(),
    lastUpdate:z.date(),
    createdAt:z.date(),
    selected: z.boolean().default(false)
})

export type TZodCommentSchema = z.infer<typeof ZodCommentSchema>