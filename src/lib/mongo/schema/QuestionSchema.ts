import { Schema, model, models } from 'mongoose';
import { z } from 'zod';
import { ZodUserSchema } from './UserSchema';

const QuestionSchema = new Schema({
    question:{type:String, required:true},
    A:{type:String, required:true},
    B:{type:String, required:true},
    C:{type:String, required:true},
    D:{type:String, required:true},
    ans:{type:String, enum:["A","B","C","D"],required:true},
    winners:[{type: Schema.Types.ObjectId,ref:"User"}]
})

export default models?.Question||model('Question', QuestionSchema)
export const ZodQuestionSchema = z.object({
    question: z.string(),
    A: z.string(),
    B: z.string(),
    C: z.string(),
    D: z.string(),
    ans:z.union([
        z.literal("A"),
        z.literal("B"),
        z.literal("C"),
        z.literal("D"),
    ]),
    winners:z.array(ZodUserSchema).optional()
})

export type TZodQuestionSchema = z.infer<typeof ZodQuestionSchema>
