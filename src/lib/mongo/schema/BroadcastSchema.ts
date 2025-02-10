// this schema allows all ppl to view the latest news about the wedding site// this section allows ppl to leave comment
import {Schema, model, models} from 'mongoose'
import {z} from 'zod'

const BroadcastSchema = new Schema({
    comment:{type:String},
    lastUpdate:{type:Date, require:true}

})

export default models?.BroadcastSchema||model('Broadcast',BroadcastSchema)

export const ZodBroadcastSchema = z.object({
    message:z.string().nullable().optional(),
    lastUpdate:z.date()
})

export type TZodBroadcastSchema = z.infer<typeof ZodBroadcastSchema>