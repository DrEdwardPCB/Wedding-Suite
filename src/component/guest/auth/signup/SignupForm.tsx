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
    const [stage,setStage] = useState<("Email"|"HaveAccount"|"InfoFilling"|"RSVP"|"PhysicalFilling"|"BanquetFilling")[]>(["Email"])
    const [form,setForm] = useState<Omit<TZodUserSchema,"id">>(structuredClone(getDefault()))
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [loading,setLoading] = useState<boolean>(false)
    const [userId, setUserId] = useState<string|undefined>(undefined)
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
    const reset=()=>{
        setStage(["Email"])
        setForm(structuredClone(getDefault()))
        setUserId(undefined)
        setConfirmPassword("")
    }
    const { trigger } = useSWRMutation("/api/rsvp", sendRSVP);
    const handleSendRsvp=async (userId:string)=>{
        await trigger({userId})
        reset()
        router.push("/")
        
    }
    const handleCreateUserAndRsvp=async()=>{
        const newId = await newSnowflakeId()
        await commitAdd({...form,id:newId, password:encryptData(form.password) })
        await handleSendRsvp(newId)
        reset()
        router.push("/")

    }
    return (<div className="px-14 w-full">
        <form className="flex gap-2 flex-col p-4 px-14 shadow bg-white bg-opacity-50">
            {
                stage.includes("Email")?
                <div className="flex w-full shadow rounded flex-wrap gap-2 p-4 justify-between items-center">
                    <h1 className="font-bevietnam text-xl italic w-full text-themeSemiDark">Email information</h1>
                    <TextField disabled ={stage.length>1} label="email" value={form.email} className="flex-1 min-w-[300px]" onChange={(evt)=>{setForm((prev)=>({...prev,email:evt.target.value}))}}
                        helperText="We will check if the email has already registered or not"
                        ></TextField>
                    <LoadingButton variant="contained" disabled={form.email.length==0} loading={loading} onClick={()=>{checkUser()}}>Next</LoadingButton>
                </div>
                :<></>
            }
            {
                stage.includes("InfoFilling")?
                <div className="flex w-full shadow rounded flex-wrap gap-2 p-4">
                    <h1 className="font-bevietnam text-xl italic w-full text-themeSemiDark">General Information</h1>
                    <TextField  label="Preferred Name" className="flex-1 min-w-[300px]" required helperText="This name will be displayed on game session" value={form.preferredName} onChange={(evt)=>setForm((prev)=>({...prev,preferredName:evt.target.value}))}></TextField>
                    <TextField  label="Full Chinese Name" className="flex-1 min-w-[300px]" value={form.fullChineseName} onChange={(evt)=>setForm((prev)=>({...prev,fullChineseName:evt.target.value}))}></TextField>
                    <TextField  label="Full English Name" className="flex-1 min-w-[300px]" value={form.fullEnglishName} onChange={(evt)=>setForm((prev)=>({...prev,fullEnglishName:evt.target.value}))}></TextField>
                    <TextField  label="Phone#" className="flex-1 min-w-[300px]" helperText="Please start with +852/+1/+44/+86" value={form.phoneNo} onChange={(evt)=>setForm((prev)=>({...prev,phoneNo:evt.target.value}))}></TextField>
                    <TextField  label="password" className="flex-1 min-w-[300px]" required type="password" value={form.password} onChange={(evt)=>setForm((prev)=>({...prev,password:evt.target.value}))} error={confirmPassword!==form.password}></TextField>
                    <TextField  label="confirm password" className="flex-1 min-w-[300px]" required type="password" value={confirmPassword} onChange={(evt)=>setConfirmPassword(evt.target.value)} error={confirmPassword!==form.password}></TextField>
                    <TextField  label="Category" className="flex-1 min-w-[300px]" helperText="What are your relationship with Edward/Kiki" value={form.category} onChange={(evt)=>setForm((prev)=>({...prev,category:evt.target.value}))}></TextField>
                    <Autocomplete<"BOTH"|"BRIDE"|"GROOM">
                        disablePortal
                        options={["BOTH","BRIDE","GROOM"]}
                        sx={{ width: 300 }}
                        value={form.side}
                        onChange={(event: any, newValue: "BOTH"|"BRIDE"|"GROOM"|null) => {
                            setForm((prev)=>({...prev,newValue}));
                        }}
                        className="flex-1 min-w-[300px]"
                        renderInput={(params) => <TextField className="flex-1 min-w-[300px]" {...params} label="Side" />}
                    />
                   
                    <TextField  label="Remarks" className=" w-full" value={form.remarks} onChange={(evt)=>setForm((prev)=>({...prev,remarks:evt.target.value}))}></TextField>
                    <h1 className="text-gray-600 text-xs w-full ">How would you like to join the wedding</h1>
                    <ButtonGroup className="self-center">
                        <Tooltip title="After login, you will find yourself accessible to Streaming, Album, and Guest book">

                            <Button variant="contained" onClick={()=>setStage(
                                (prev)=>{
                                    const arr= new Set(prev)
                                    arr.add("RSVP")
                                    arr.delete("PhysicalFilling")
                                    arr.delete("BanquetFilling")
                                    return Array.from(arr)
                                }
                            )}>Virtual</Button>
                        </Tooltip>
                        
                        <Button variant="contained" onClick={()=>setStage(
                            (prev)=>{
                                const arr= new Set(prev)
                                arr.delete("RSVP")
                                arr.add("PhysicalFilling")
                                return Array.from(arr)
                            }
                        )}>Physical</Button>
                    </ButtonGroup>
                </div>
                :<></>
            }
            {
                stage.includes("PhysicalFilling")?
                <div className="flex w-full shadow rounded flex-wrap gap-2 p-4">
                    <h1 className="font-bevietnam text-xl italic w-full text-themeSemiDark">Section to join</h1>
                    <FormControlLabel 
                    control={
                        <Checkbox checked={form.ceremony} onChange={()=>{
                            setForm((prev)=>({...prev,ceremony:!form.ceremony}))
                        }} ></Checkbox>
                    }
                    label="Ceremony (4:00pm-5:00pm EDT) & Cocktail (5:00pm-6:00pm EDT) "/>
                    <FormControlLabel 
                    control={
                        <Checkbox checked={form.dinner} onChange={()=>{
                            if(!form.dinner){
                                setStage(
                                    (prev)=>{
                                        const arr= new Set(prev)
                                        arr.add("BanquetFilling")
                                        return Array.from(arr)
                                    }
                                )
                            }else{
                                setStage(
                                    (prev)=>{
                                        const arr= new Set(prev)
                                        arr.delete("BanquetFilling")
                                        return Array.from(arr)
                                    }
                                )
                            }
                            setForm((prev)=>({...prev,dinner:!form.dinner}))
                        }}></Checkbox>
                    }
                    label="Banquet (6:00 onward EDT)"/>
                    {!stage.includes("BanquetFilling")?
                    <div className="w-full">

                        <Button variant="contained" onClick={()=>setStage(
                            (prev)=>{
                                const arr= new Set(prev)
                                arr.add("RSVP")
                                return Array.from(arr)
                            }
                        )}>Next</Button>
                    </div>
                    :<></>}
                </div>
                :<></>
            }
            {
                stage.includes("BanquetFilling")?
                <div className="flex w-full shadow rounded flex-wrap gap-2 p-4">
                    <h1 className="font-bevietnam text-xl italic w-full text-themeSemiDark">Food Allergies</h1>
                    <TextField  label="Food Allergies" className="flex-1" value={form.foodAllergies} onChange={(evt)=>setForm((prev)=>({...prev,foodAllergies:evt.target.value}))} helperText="leave blank if no allergies"></TextField>
                    <Button variant="contained" className="self-center" onClick={()=>setStage(
                        (prev)=>{
                            const arr= new Set(prev)
                            arr.add("RSVP")
                            return Array.from(arr)
                        }
                    )}>Next</Button>
                </div>
                :<></>
            }
            {
                stage.includes("HaveAccount")?
                <div className="flex w-full shadow rounded">
                    <h1 className="font-bevietnam text-xl italic w-full text-themeSemiDark">RSVP</h1>
                    <div>
                        <Button variant="contained" disabled = {!userId} onClick={()=>{handleSendRsvp(userId!)}}>Send RSVP</Button>
                        <p className="text-sm">By clicking the send RSVP button, you will receive an RSVP email from Edawrd and Kiki</p>
                    </div>
                </div>
                :<></>
            }
            {
                stage.includes("RSVP")?
                <div className="flex w-full shadow rounded flex-wrap gap-2 p-4">
                    <h1 className="font-bevietnam text-xl italic w-full text-themeSemiDark">Register and RSVP</h1>
                    <div>
                        <Button variant="contained" onClick={()=>{handleCreateUserAndRsvp()}}>Register and send RSVP</Button>
                        <p className="text-sm">By clicking the register button you have agreed to our <Link href="/privacypolicy"><span className="text-blue-600 hover:text-blue-200 cursor-pointer underline">privacy policy</span></Link>. You will also be registered with as a guest of the wedding with the information you provided, an RSVP email will also be sent to your email afterwards. Please contact Edward or Kiki if any you would like to perform an amendment of any provided information</p>
                    </div>
                </div>
                :<></>
            }
        </form>
    </div>)
}