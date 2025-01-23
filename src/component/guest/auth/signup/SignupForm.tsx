"use client"

import { useState } from "react"
import { getDefault, TZodUserSchema } from '../../../../lib/mongo/schema/UserSchema';
import { Autocomplete, Checkbox, FormControlLabel, TextField,Button, ButtonGroup, Tooltip} from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { commitAdd, findUserByEmail } from "@/lib/mongo/actions/UserActions";
import useSWRMutation from 'swr/mutation';
import { newSnowflakeId } from "@/lib/snowflake/generateSnowflake";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { encryptData } from "@/lib/encryption";
import { useMachine } from "@xstate/react";
import { registerMachine } from "@/lib/xstate/registerMachine";
async function sendRSVP(
    url:string,
    {arg}:{arg:{
        userId:string
    }}
):Promise<object[]>{
    const body = new FormData()
    body.append("userId", arg.userId)
    const response = await fetch(url,{method:"POST",body})
    return await response.json()
} 

export const SignupForm= ()=>{
    const [state,send]=useMachine(registerMachine)
    const [form,setForm] = useState<Omit<TZodUserSchema,"id">>(structuredClone(getDefault()))
    const router = useRouter()
    const checkUser = async () =>{
        setLoading(true)
        const user = await findUserByEmail(form.email)
        
        if(user){
            setStage((prev)=>{
                const arr= new Set(prev)
                arr.add("HaveAccount")
                return Array.from(arr)
            })
            setUserId(user.id)
        }else{
            setStage((prev)=>{
                const arr= new Set(prev)
                arr.add("InfoFilling")
                return Array.from(arr)
            })
        }
        setLoading(false)
    }
    const { trigger } = useSWRMutation("/api/rsvp", sendRSVP);
    const handleSendRsvp=async (userId:string)=>{
        await trigger({userId})
        router.push("/")
        
    }
    const handleCreateUserAndRsvp=async()=>{
        const newId = await newSnowflakeId()
        await commitAdd({...form,id:newId, password:encryptData(form.password) })
        await handleSendRsvp(newId)
        reset()
        router.push("/")

    }
    if (state.matches("SEmail")){
        return <></>
    }
    if (state.matches("SAlreadyHave")){
        return <></>
    }
    if (state.matches("SVirtual")){
        return <></>
    }
    if (state.matches("SPhysical")){
        return <></>
    }
    if (state.matches("SCeremony")){
        return <></>
    }
    if (state.matches("SCocktailBanquet")){
        return <></>
    }
    if (state.matches("SBanquet")){
        return <></>
    }
    if (state.matches("SRSVP")){
        return <></>
    }
    return <></>
    
}