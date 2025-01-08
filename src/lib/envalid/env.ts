import {cleanEnv,str} from 'envalid'
export const env = cleanEnv(process.env,{
    MONGO_URI:str(),
    COOKIE_SECRET_KEY:str(),
    NEXT_PUBLIC_PW_ENCRYPTION_KEY:str(),
    NEXT_PUBLIC_PW_ENCRYPTION_IV:str(),
    MGMT_USERNAME:str(),
    MGMT_PASSWORD:str()
})