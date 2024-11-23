import mongoose from 'mongoose'
import {env} from '../envalid/env'

const MONGODB_URI:string = env.MONGO_URI

export type Tmongoconn ={
    conn:typeof mongoose|null
    promise:Promise<typeof mongoose>|null
}


let cached = (global as any).mongoose
if (!cached){
    cached = (global as any).mongoose ={conn:null, promise:null}
}
async function dbConnect(){
    if(cached.conn){
        return cached.conn
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        }
        cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
            console.log('Db connected')
            return mongoose
        })
    }
    try {
        cached.conn = await cached.promise
    } catch (e) {
        cached.promise = null
        throw e
    }

    return cached.conn
}
export default dbConnect