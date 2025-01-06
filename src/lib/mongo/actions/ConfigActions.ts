/* eslint-disable @typescript-eslint/ban-ts-comment */
import _ from "lodash"
import Config, { TZodConfigSchema } from "../schema/Config"
export const commitAdd=async (photo:TZodConfigSchema)=>{
    console.log("[Config] commit add")
    const newConfig = new Config(photo)
     newConfig.save()
}


export const queryAll = async()=>{
    //@ts-ignore
        const parsed = (await Config.find({})).map(e=>{
            const result=_.omit(e.toJSON(),["__v"])
            result._id = e._id.toHexString()
            return result
        })
        return parsed
}

export const getLatestConfig=async()=>{
    const parsed = (await Config.findOne({},{},{sort:{'createdAt':-1}}))
    const result=_.omit(parsed.toJSON(),["_id","__v"])
    result._id = parsed._id.toHexString()
    return result
    
}
