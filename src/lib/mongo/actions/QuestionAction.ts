/* eslint-disable @typescript-eslint/ban-ts-comment */
'use server'

import _ from "lodash"
import Question, { TZodQuestionSchema } from "../schema/QuestionSchema"
import UserSchema  from '../schema/UserSchema';
import QuestionSchema from "../schema/QuestionSchema";
import { TZodUserSchema } from '../schema/UserSchema';
export const commitAdd=async (question:TZodQuestionSchema)=>{
    console.log("[Question] commit add")
    const newQuestion = new Question(question)
     newQuestion.save()
}
export const commitDelete=async (id:string)=>{
    console.log("[Question] commit delete")
    await Question.deleteOne({_id:id})
}
export const commitDeleteByFilelocation=async (fileLocation:string)=>{
    console.log("[Question] commit delete")
    await Question.deleteOne({fileLocation:fileLocation})
}

export const commitUpdate=async (id:string, question:TZodQuestionSchema)=>{
    console.log("[Question] commit update")
    // console.log(question)
    Question.findOneAndUpdate({_id:id},question).then((question)=>question.save())
}
export const queryAll = async():Promise<(TZodQuestionSchema&{_id:string})[]>=>{
    //@ts-ignore
        const parsed = (await Question.find({})).map(e=>{
            const result=_.omit(e.toJSON(),["__v"])
            result._id = e._id.toHexString()
            return result
        })
        return parsed as (TZodQuestionSchema&{_id:string})[]
}

export const getQuestionById=async(id:string):Promise<TZodQuestionSchema&{_id:string}> =>{
    const parsed = (await Question.findById(id)).toJSON()
    const result=_.omit(parsed,["_id","__v"])
    result._id = parsed._id.toHexString()
    return result as TZodQuestionSchema&{_id:string}
}

export const registerCorrect = async(questionId:string, userId:string)=>{
    const user = await UserSchema.findOne({id:userId});
    const question = await QuestionSchema.findById(questionId);
    question.winners.push(user)
    await question.save()
}

export const findWinnerOfQuestion = async(questionId:string):Promise<string[]>=>{
    const question = await QuestionSchema.findById(questionId).populate("winners");
    return question.winners.map((e:TZodUserSchema)=>e.preferredName)
}

export const findNoWinnersQuestion = async():Promise<(TZodQuestionSchema&{_id:string})[]>=>{
    //@ts-ignore
    const parsed = (await Question.find({ winners: { $size: 0 } })).map(e=>{
        const result=_.omit(e.toJSON(),["__v"])
        result._id = e._id.toHexString()
        return result
    })
    return parsed as (TZodQuestionSchema&{_id:string})[]
}

export const getOverallScorePerUser = async():Promise<Record<string,number>>=>{
    const result:Record<string,number> = {}
    const questions = await QuestionSchema.find();
    questions.forEach(question=>{
        question.populate("winners")
        question.winners.forEach((e:TZodUserSchema) => {
            if(!result?.[e.preferredName]){
                result[e.preferredName]=1
            }else{
                result[e.preferredName]++
            }
        })
    })
    return result
}