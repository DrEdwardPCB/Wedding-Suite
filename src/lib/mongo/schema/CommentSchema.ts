// this section allows ppl to leave comment
import {Schema, model, models} from 'mongoose'
import {z} from 'zod'

const CommentSchema = new Schema({
    userId:{type:String,require:true},
    comment:{type:String},
    lastUpdate:{type:Date, require:true}

})

export default models?.CommentSchema||model('Comment',CommentSchema)

export const ZodCommentSchema = z.object({
    userId:z.string(),
    comment:z.string().nullable().optional(),
    lastUpdate:z.date()
})

export type TZodCommentSchema = z.infer<typeof ZodCommentSchema>