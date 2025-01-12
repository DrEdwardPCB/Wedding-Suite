
import {Schema, model, models} from 'mongoose'
import { z } from 'zod'

const GameManagerInstSchema = new Schema({
    id:{type:String},
    state:{type:String},
    questionId:{type:String},
})

export default models?.GameManagerInst||model('GameManagerInst', GameManagerInstSchema )

export const ZodGameManagerInstSchema = z.object({
    id:z.string(),
    state:z.union([
        z.literal("Prepare"),
        z.literal("Open"),
        z.literal("Calculate"),
        z.literal("Display"),
        z.literal("Overall"),
    ]),
    questionId:z.string().optional(),

})
export type TZodGameManagerInstSchema = z.infer<typeof ZodGameManagerInstSchema>