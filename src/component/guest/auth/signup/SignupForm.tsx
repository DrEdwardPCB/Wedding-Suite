"use client"

import {  Checkbox, FormControlLabel, TextField,Button, FormLabel, Tooltip, IconButton, Select, InputLabel, FormControl, MenuItem, FormHelperText, FormGroup} from "@mui/material";
import { LoadingButton } from '@mui/lab';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { commitAdd, findUserByEmail } from "@/lib/mongo/actions/UserActions";
import useSWRMutation from 'swr/mutation';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMachine } from "@xstate/react";
import { registerMachine } from "@/lib/xstate/registerMachine";
import {Formik, FormikErrors} from 'formik'
import { withZodSchema } from "formik-validator-zod";
import { keyToDisplay, ZodRegisterEmailEntry, ZodRegisterPersonalDetail } from "@/lib/xstate/registerHelper";
import _ from "lodash";
import generator from 'generate-password'
import { encryptData } from '@/lib/encryption';
import {v4} from 'uuid'
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
    const router = useRouter()
    const isUserRegistered = async (email:string) =>{
        const user = await findUserByEmail(email)
        return !!user
    }
    const getUserIdByEmail = async (email:string) =>{
        const user = await findUserByEmail(email)
        return user?.id
    }
    const { trigger } = useSWRMutation("/api/rsvp", sendRSVP);
    const handleSendRsvp=async (userId:string)=>{
        await trigger({userId})
        
    }
    const handleCreateUserAndRsvp=async()=>{
        const newId = v4()
        await commitAdd({
            id:newId,
            password:encryptData(generator.generate({length:10,numbers:true})),
            email:state.context.emailField.email,
            preferredName:state.context.personalField.preferredName,
            surname:state.context.personalField.surname,
            firstName:state.context.personalField.firstname,
            fullChineseName:state.context.personalField.fullChineseName,
            phonePrefix:state.context.personalField.phonePrefix,
            phoneNumber:state.context.personalField.phoneNumber,
            relationship:state.context.personalField.relationship,
            side:state.context.personalField.side,
            online:state.context.otherField.online,
            ceremony:state.context.otherField.ceremony,
            cocktail:state.context.otherField.cocktail,
            banquet:state.context.otherField.banquet,
            remarks:state.context.otherField.remarks,
            foodAllergies:state.context.otherField.foodAllergies,
            foodChoice:state.context.otherField.foodChoice,
            dinnerDeskNumber:0,
            ceremonySeatNumber:0,
            checkedIn:false
        })
        await handleSendRsvp(newId)

    }
    if (state.matches("SEmail")){
        return (
            <div className="shadow rounded-xl flex items-center justify-center bg-white  max-h-[450px] w-82 md:w-96 overflow-y-auto flex-col relative">
                <div className="w-full flex items-center mt-7 justify-between gap-4 md:px-2">
                    <Link href="/" className="">
                        <Tooltip title="homepage">
                        <IconButton className="">
                            <ArrowBackIcon className="text-3xl"/>
                        </IconButton>
                        </Tooltip>
                    </Link>
                    <div className="flex flex-col max-w-40 md:max-w-52">
                        <p>Email information</p>
                        <p className="text-xs text-slate-400">Email information is used to send rsvp email and for login</p>
                    </div>
                    <div className="flex-1"></div>
                </div>
                <Formik
                    initialValues={structuredClone(state.context.emailField)}
                    validate={withZodSchema(ZodRegisterEmailEntry)}
                    onSubmit={async(values,{setSubmitting})=>{
                        send({
                            type:"EFillEmail",
                            value:{...values}
                        })
                        setSubmitting(false)
                        const visUserRegistered = await isUserRegistered(values.email)
                        if(visUserRegistered){
                            console.log("exist")
                            send({
                                type:"EGotoAlreadyHave"
                            })
                        }else{
                            console.log("not exist")
                            send({
                                type:"EGotoPersonal"
                            })
                        }
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        resetForm
                    })=>(
                        <form className="flex flex-col items-center justify-start gap-4 p-7" onSubmit={handleSubmit}>
                            
                            <TextField 
                                required
                                name="email" 
                                aria-label="E-mail" 
                                label="E-mail" 
                                placeholder="Enter your email address" 
                                helperText= {errors.email && touched.email ? errors.email:"This email address will be use as your identifier to login upon wedding days" }
                                onCopy={(e)=>e.preventDefault()} 
                                onCut={(e)=>e.preventDefault()}
                                sx={{
                                    '& .MuiFormHelperText-root': {
                                        width: 250,
                                    },
                                }}
                                size="small"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                error={touched.email && !!errors.email}
                                />
                                
                            <TextField 
                                required
                                name="reenterEmail" 
                                aria-label="ReEnter E-Mail" 
                                label="ReEnter E-mail " 
                                placeholder="ReEnter your email address" 
                                helperText={errors.reenterEmail&&touched.reenterEmail?errors.reenterEmail:"To double confirm your email is correct" }
                                onPaste={(e)=>e.preventDefault()} 
                                sx={{
                                    '& .MuiFormHelperText-root': {
                                        width: 250,
                                    },
                                }}
                                size="small"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.reenterEmail}
                                error={touched.reenterEmail && !!errors.reenterEmail}
                            />
                            <div className="flex justify-end items-center gap-2 w-full">
                                <LoadingButton 
                                    className="font-bevietnam text-white bg-themeDark shadow-black disabled:bg-slate-400 disabled:opacity-50"
                                    variant="contained"
                                    loading={isSubmitting} 
                                    disabled={_.size(errors)>0&&_.size(touched)===_.size(structuredClone(state.context.emailField))} 
                                    type="submit"
                                    >
                                    Next
                                </LoadingButton>
                                <Button 
                                    className="font-bevietnam text-white bg-themeDark shadow-black disabled:bg-slate-400 disabled:opacity-50"
                                    type="button" 
                                    variant="contained" 
                                    onClick={()=>{resetForm(); send({type:"EReset"})}}>
                                Reset</Button>
                            </div>
                        </form>
                    )}
                    
                </Formik>
            </div>
        )
    }
    if (state.matches("SAlreadyHave")){
        return (
            <div className="shadow rounded-xl flex items-center justify-center bg-white  max-h-[450px] w-82 md:w-96 overflow-y-auto flex-col relative">
                <div className="w-full flex items-center mt-7 justify-between gap-4 px-2">
                    
                    <Tooltip title="Fill Email information">
                        <IconButton className="" onClick={()=>send({type:"EReset"})}>
                            <ArrowBackIcon className="text-3xl"/>
                        </IconButton>
                    </Tooltip>
                    <div className="flex flex-col max-w-40 md:max-w-52">
                        <p>Send RSVP</p>
                        <p className="text-xs text-slate-400">Click the below button to send an RSVP and login information to your email </p>
                    </div>
                    <div className="flex-1"></div>
                </div>
                
                    <div className="flex flex-col items-center justify-start gap-4 p-7" >
                        <div className="flex justify-end items-center gap-2 w-full">
                            <LoadingButton 
                                className="font-bevietnam text-white bg-themeDark shadow-black disabled:bg-slate-400 disabled:opacity-50"
                                onClick={async()=> await handleSendRsvp(await getUserIdByEmail(state.context.emailField.email as string) as string)}
                                type="button"
                                variant="contained">
                                Send
                            </LoadingButton>
                        </div>
                    </div>
            </div>
        )
    }
    if (state.matches("SPersonal")){
        return (
            <div className="shadow rounded-xl flex items-center justify-center bg-white  max-h-[400px] md:max-h-[450px] w-82 md:w-2/3  flex-col">
                <div className="overflow-y-auto w-full">
                    <div className="w-full flex items-center mt-7 justify-between gap-4 px-2">
                        
                            <Tooltip title="Back">
                            <IconButton className="" onClick={()=>send({type:"EBackToEmail"})}>
                                <ArrowBackIcon className="text-3xl"/>
                            </IconButton>
                            </Tooltip>
                        <div className="flex flex-col max-w-40 md:max-w-52">
                            <p>Personal information</p>
                            <p className="text-xs text-slate-400">Personal information are collected to ease registration logistic and preparation of the wedding</p>
                        </div>
                        <div className="flex-1"></div>
                    </div>
                    <Formik
                        initialValues={structuredClone(state.context.personalField)}
                        validate={withZodSchema(ZodRegisterPersonalDetail)}
                        onSubmit={(values)=>{
                            send({
                                type:"EFillPersonal",
                                value:{...values}
                            })
                        }}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                        })=>(
                            <form className="flex flex-col items-center justify-start gap-4 p-7 md:grid md:grid-cols-6" onSubmit={handleSubmit}>
                                <FormControl className="max-w-[250px] min-w-[120px] md:max-w-full md:col-span-2" error={touched.prefix && !!errors.prefix} required size="small">
                                    <InputLabel id="SPersonalPrefix-label">Prefix</InputLabel>
                                    <Select
                                        labelId="SPersonalPrefix-label"
                                        id="SPersonalPrefix"
                                        name="prefix"
                                        value={values.prefix}
                                        label="Prefix"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={"Mr."}>Mr.</MenuItem>
                                        <MenuItem value={"Miss."}>Miss.</MenuItem>
                                        <MenuItem value={"Mrs."}>Mrs.</MenuItem>
                                    </Select>
                                    <FormHelperText>{errors.prefix && touched.prefix ? errors.prefix:"Your prefix" }</FormHelperText>
                                </FormControl>
                                
                                <TextField 
                                    className="md:col-span-2"
                                    required
                                    name="firstname" 
                                    aria-label="First Name" 
                                    label="First Name" 
                                    placeholder="Enter your First Name" 
                                    helperText= {errors.firstname && touched.firstname ? errors.firstname:"Your First Name (E.g. Tai Ming)" }
                                    size="small"
                                    sx={{
                                        '& .MuiFormHelperText-root': {
                                            width: 250,
                                        },
                                    }}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.firstname}
                                    error={touched.firstname && !!errors.firstname}
                                    />
                                <TextField 
                                    className="md:col-span-2"
                                    required
                                    name="surname" 
                                    aria-label="Surname" 
                                    label="Surname" 
                                    placeholder="Enter your Surname" 
                                    helperText= {errors.surname && touched.surname ? errors.surname:"Your Surname (E.g. Chan)" }
                                    size="small"
                                    sx={{
                                        '& .MuiFormHelperText-root': {
                                            width: 250,
                                        },
                                    }}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.surname}
                                    error={touched.surname && !!errors.surname}
                                    />
                                <TextField 
                                    className="md:col-span-3 md:self-start"
                                    required
                                    name="preferredName" 
                                    aria-label="Preferred Name" 
                                    label="Preferred Name" 
                                    placeholder="Enter your Preferred Name" 
                                    helperText= {errors.preferredName && touched.preferredName ? errors.preferredName:"Your preferred name or nickname (E.g. Thomas)" }
                                    size="small"
                                    sx={{
                                        '& .MuiFormHelperText-root': {
                                            width: 250,
                                        },
                                    }}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.preferredName}
                                    error={touched.preferredName && !!errors.preferredName}
                                    />
                                
                                <TextField 
                                    className="md:col-span-3 md:self-start"
                                    name="fullChineseName" 
                                    aria-label="Full Chinese Name" 
                                    label="Full Chinese Name" 
                                    placeholder="Enter your Full Chinese Name" 
                                    helperText= {errors.fullChineseName && touched.fullChineseName ? errors.fullChineseName:"Your Full Chinese Name (E.g. 陳大明)" }
                                    size="small"
                                    sx={{
                                        '& .MuiFormHelperText-root': {
                                            width: 250,
                                        },
                                    }}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.fullChineseName}
                                    error={touched.fullChineseName && !!errors.fullChineseName}
                                    />
                                <FormControl className="max-w-[250px] min-w-[120px] md:max-w-full md:col-span-3 " error={touched.phonePrefix && !!errors.phonePrefix} required size="small" >
                                    <InputLabel id="SPersonalPhonePrefix-label">Phone Prefix</InputLabel>
                                    <Select
                                        labelId="SPersonalPhonePrefix-label"
                                        id="SPersonalPhonePrefix"
                                        value={values.phonePrefix}
                                        name="phonePrefix"
                                        label="Phone Prefix"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={"+852"}>Hong Kong (+852)</MenuItem>
                                        <MenuItem value={"+1"}>Canada/US (+1)</MenuItem>
                                        <MenuItem value={"+86"}>China (+86)</MenuItem>
                                        <MenuItem value={"+44"}>United Kingdom (+44)</MenuItem>
                                        <MenuItem value={"+61"}>Austrialia (+61)</MenuItem>
                                    </Select>
                                    <FormHelperText>{errors.phonePrefix && touched.phonePrefix ? errors.phonePrefix:"Area code of your phone" }</FormHelperText>
                                </FormControl>
                                <TextField 
                                    className="md:col-span-3"
                                    name="phoneNumber" 
                                    aria-label="Phone #" 
                                    label="Phone #" 
                                    placeholder="Enter your Phone #" 
                                    helperText= {errors.phoneNumber && touched.phoneNumber ? errors.phoneNumber:"Your Phone #" }
                                    size="small"
                                    sx={{
                                        '& .MuiFormHelperText-root': {
                                            width: 250,
                                        },
                                    }}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.phoneNumber}
                                    error={touched.phoneNumber && !!errors.phoneNumber}
                                    />
                                
                                <FormControl className="max-w-[250px] min-w-[120px] md:max-w-full md:col-span-3 md:self-start" error={touched.side && !!errors.side} required size="small">
                                    <InputLabel id="SPersonalSide-label">Side</InputLabel>
                                    <Select
                                        labelId="SPersonalSide-label"
                                        id="SPersonalSide"
                                        value={values.side}
                                        label="Prefix"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={"BOTH"}>BOTH</MenuItem>
                                        <MenuItem value={"GROOM"}>GROOM (Male)</MenuItem>
                                        <MenuItem value={"BRIDE"}>BRIDE (Female)</MenuItem>
                                    </Select>
                                    <FormHelperText>{errors.side && touched.side ? errors.side:"Which side of the family do you belong to" }</FormHelperText>
                                </FormControl>
                                <TextField 
                                    className="md:col-span-3 md:self-start"
                                    name="relationship" 
                                    aria-label="Relationship" 
                                    label="Relationship" 
                                    placeholder="Friends from University" 
                                    helperText= {errors.relationship && touched.relationship ? errors.relationship:"Your relationship with Edward and/ or Kiki (E.g. HKUST Classmate, HKT Colleagues, Aunt)" }
                                    size="small"
                                    sx={{
                                        '& .MuiFormHelperText-root': {
                                            width: 250,
                                        },
                                    }}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.relationship}
                                    error={touched.relationship && !!errors.relationship}
                                    />
                                <div className="flex justify-center items-center gap-2 w-full md:col-span-6">
                                    <LoadingButton 
                                        className="font-bevietnam text-white bg-themeDark shadow-black disabled:bg-slate-400 disabled:opacity-50 px-2"
                                        disabled={_.size(errors)>0&&_.size(touched)===_.size(structuredClone(state.context.personalField))} 
                                        type="submit"
                                        onClick={()=>{
                                            setTimeout(()=>{
                                                send({type:"EGotoVirtual"})
                                            },1000)
                                        }}
                                        variant="contained">
                                        Join Virtually
                                    </LoadingButton>
                                    <LoadingButton 
                                        className="font-bevietnam text-white bg-themeDark shadow-black disabled:bg-slate-400 disabled:opacity-50 px-1"
                                        disabled={_.size(errors)>0&&_.size(touched)===_.size(structuredClone(state.context.personalField))} 
                                        type="submit"
                                        onClick={()=>{
                                            setTimeout(()=>{
                                                send({type:"EGotoPhysical"})
                                            },1000)
                                        }}
                                        variant="contained">
                                        Join Physically
                                    </LoadingButton>
                                </div>
                            </form>
                        )}
                        
                    </Formik>
                </div>
            </div>
        )
    }
    if (state.matches("SVirtual")){
        return (
            <div className="shadow rounded-xl flex items-center justify-center bg-white  max-h-[450px] w-82 md:w-96 overflow-y-auto flex-col relative">
                <div className="w-full flex items-center mt-7 justify-between gap-4 px-2">
                    
                        <Tooltip title="homepage">
                        <IconButton className="" onClick={()=>send({type:"EBackToPersonal"})}>
                            <ArrowBackIcon className="text-3xl"/>
                        </IconButton>
                        </Tooltip>
                    
                    <div className="flex flex-col max-w-40 md:max-w-52">
                        <p>Virtual Ceremony</p>
                        <p className="text-xs text-slate-400">Add any additional remarks you have for virtual ceremony</p>
                    </div>
                    <div className="flex-1"></div>
                </div>
                <Formik
                    initialValues={{remarks:""}}
                    onSubmit={async(values)=>{
                        send({
                            type:"EFillRemarks",
                            value:values.remarks
                        })
                        send({
                            type:"EGotoRSVP",
                        })
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                    })=>(
                        <form className="flex flex-col items-center justify-start gap-4 p-7" onSubmit={handleSubmit}>
                            
                            <TextField 
                                name="remarks" 
                                aria-label="Remarks" 
                                label="Remarks" 
                                placeholder="Enter your remarks address" 
                                helperText= {errors.remarks && touched.remarks ? errors.remarks:"Any remarks for the day" }
                                onCopy={(e)=>e.preventDefault()} 
                                onCut={(e)=>e.preventDefault()}
                                sx={{
                                    '& .MuiFormHelperText-root': {
                                        width: 250,
                                    },
                                }}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.remarks}
                                error={touched.remarks && !!errors.remarks}
                                />
                                
                            <div className="flex justify-end items-center gap-2 w-full">
                                <LoadingButton 
                                    className="font-bevietnam text-white bg-themeDark shadow-black disabled:bg-slate-400 disabled:opacity-50 px-1"
                                    disabled={_.size(errors)>0} 
                                    type="submit"
                                    variant="contained">
                                    Next
                                </LoadingButton>
                            </div>
                        </form>
                    )}
                    
                </Formik>
            </div>
        )
    }
    if (state.matches("SPhysical")){
        return (
            <div className="shadow rounded-xl flex items-center justify-center bg-white  max-h-[450px] w-82 md:w-96 overflow-y-auto flex-col relative">
                <div className="w-full flex items-center mt-7 justify-between gap-4 px-2">
                        <Tooltip title="back to personal">
                        <IconButton className="" onClick={()=>send({type:"EBackToPersonal"})}>
                            <ArrowBackIcon className="text-3xl"/>
                        </IconButton>
                        </Tooltip>
                    <div className="flex flex-col max-w-40 md:max-w-52">
                        <p>Physical Participation</p>
                        <p className="text-xs text-slate-400">Choose the session you will be participating</p>
                    </div>
                    <div className="flex-1"></div>
                </div>
                <Formik
                    initialValues={{ceremony:false,cocktail:false,banquet:false}}
                    validate={(values)=>{
                        const errors:FormikErrors<{ceremony:false,cocktail:false,banquet:false}> = {}
                        if(!values.ceremony&&!values.cocktail&&!values.banquet){
                            errors.ceremony="You must select at least 1 to pass"
                            errors.cocktail="You must select at least 1 to pass"
                            errors.banquet="You must select at least 1 to pass"
                        }
                        return errors
                    }}
                    onSubmit={(values)=>{
                        console.log(values)
                        send({
                            type:"EFillPhysical",
                            value:{
                                banquet:!!values.banquet,
                                ceremony:!!values.ceremony,
                                cocktail:!!values.cocktail
                            }
                        })
                        console.log(1)
                        if(values.banquet||values.cocktail){
                            console.log(2)
                            send({
                                type:"EGotoCockTailBanquet"
                            })
                        }else{
                            console.log(3)
                            send({
                                type:"EGotoCeremony"
                            })
                        }
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleSubmit,
                    })=>(
                        <form className="flex flex-col items-center justify-start gap-4 p-7" onSubmit={handleSubmit}>
                             <FormControl
                                required
                                error={touched.banquet && !!errors.banquet}
                                component="fieldset"
                                variant="standard"
                            >
                                <FormLabel component="legend">Event session selection</FormLabel>
                                <FormGroup>
                                    <FormControlLabel 
                                    label="Ceremony (16:00-16:30 EST)"
                                    name="ceremony"
                                    onChange={handleChange}
                                
                                    control={
                                    <Checkbox
                                        checked={values.ceremony}
                                        inputProps={{ 'aria-label': 'controlled' }}                                    
                                        />}
                                    />
                                    <FormControlLabel 
                                    label="Cocktail (16:30-18:00 EST)"
                                    name="cocktail"
                                    onChange={handleChange}
                                    control={
                                    <Checkbox
                                        checked={values.cocktail}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                        
                                            />}
                                    />
                                    <FormControlLabel 
                                    label="Banquet (18:00 onward EST)"
                                    name="banquet"
                                    onChange={handleChange}
                                    control={
                                    <Checkbox
                                        checked={values.banquet}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                        
                                            />}
                                    />
                                </FormGroup>
                                <FormHelperText>{errors.banquet && touched.banquet ? errors.banquet:"Select the event session you are able to join" }</FormHelperText>
                            </FormControl>
                       
                            <div className="flex justify-end items-center gap-2 w-full">
                                <LoadingButton 
                                    className="font-bevietnam text-white bg-themeDark shadow-black disabled:bg-slate-400 disabled:opacity-50"
                                    disabled={_.size(errors)>0} 
                                    type="submit"
                                    variant="contained">
                                    Next
                                </LoadingButton>
                            </div>
                        </form>
                    )}
                    
                </Formik>
            </div>
        )
    }
    if (state.matches("SCeremony")){
        return (
            <div className="shadow rounded-xl flex items-center justify-center bg-white  max-h-[450px] w-82 md:w-96 overflow-y-auto flex-col relative">
                <div className="w-full flex items-center mt-7 justify-between gap-4 px-2">
                    
                        <Tooltip title="back">
                        <IconButton className="" onClick={()=>send({type:"EBackToPhysical"})}>
                            <ArrowBackIcon className="text-3xl"/>
                        </IconButton>
                        </Tooltip>
                    
                    <div className="flex flex-col max-w-40 md:max-w-52">
                        <p>Ceremony</p>
                        <p className="text-xs text-slate-400">Add any additional remarks you have</p>
                    </div>
                    <div className="flex-1"></div>
                </div>
                <Formik
                    initialValues={{remarks:""}}
                    onSubmit={async(values)=>{
                        send({
                            type:"EFillRemarks",
                            value:values.remarks
                        })
                        send({
                            type:"EGotoRSVP",
                        })
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                    })=>(
                        <form className="flex flex-col items-center justify-start gap-4 p-7" onSubmit={handleSubmit}>
                            
                            <TextField 
                                name="remarks" 
                                aria-label="Remarks" 
                                label="Remarks" 
                                placeholder="Enter your remarks address" 
                                helperText= {errors.remarks && touched.remarks ? errors.remarks:"Any remarks for the day" }
                                onCopy={(e)=>e.preventDefault()} 
                                onCut={(e)=>e.preventDefault()}
                                sx={{
                                    '& .MuiFormHelperText-root': {
                                        width: 250,
                                    },
                                }}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.remarks}
                                error={touched.remarks && !!errors.remarks}
                                />
                                
                            <div className="flex justify-end items-center gap-2 w-full">
                                <LoadingButton 
                                    className="font-bevietnam text-white bg-themeDark shadow-black disabled:bg-slate-400 disabled:opacity-50"
                                    disabled={_.size(errors)>0} 
                                    type="submit"
                                    variant="contained">
                                    Next
                                </LoadingButton>
                            </div>
                        </form>
                    )}
                    
                </Formik>
            </div>
        )
    }
    if (state.matches("SCocktailBanquet")){
        return (
            <div className="shadow rounded-xl flex items-center justify-center bg-white  max-h-[450px] w-82 md:w-96 overflow-y-auto flex-col relative">
                <div className="w-full flex items-center mt-7 justify-between gap-4 px-2">
                        <Tooltip title="homepage">
                        <IconButton className="" onClick={()=>send({type:"EBackToPhysical"})}>
                            <ArrowBackIcon className="text-3xl"/>
                        </IconButton>
                        </Tooltip>
                    <div className="flex flex-col max-w-40 md:max-w-52">
                        <p>Food Allergies</p>
                        <p className="text-xs text-slate-400">Food Allergies such that we can notify our banquet provider</p>
                    </div>
                    <div className="flex-1"></div>
                </div>
                <Formik
                    initialValues={{foodAllergies:"",remarks:""}}
                    onSubmit={async(values)=>{
                        console.log(values)
                        send({
                            type:"EFillRemarks",
                            value:values.remarks
                        })
                        console.log(1)
                        send({
                            type:"EFillFoodAllergies",
                            value:values.foodAllergies
                        })
                        console.log(state.context.otherField)
                        if(state.context.otherField.banquet){
                            console.log(3)
                            send({
                                type:"EGotoBanquet"
                            })
                        }else{
                            console.log(4)
                            send({
                                type:"EGotoRSVP"
                            })
                        }
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                    })=>(
                        <form className="flex flex-col items-center justify-start gap-4 p-7" onSubmit={handleSubmit}>
                            
                            <TextField 
                                name="remarks" 
                                aria-label="Remarks" 
                                label="Remarks" 
                                placeholder="Enter your remarks " 
                                helperText= {errors.remarks && touched.remarks ? errors.remarks:"Any remarks for the day" }
                                onCopy={(e)=>e.preventDefault()} 
                                onCut={(e)=>e.preventDefault()}
                                sx={{
                                    '& .MuiFormHelperText-root': {
                                        width: 250,
                                    },
                                }}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.remarks}
                                error={touched.remarks && !!errors.remarks}
                                />
                                
                            <TextField 
                                name="foodAllergies" 
                                aria-label="Food Allergies" 
                                label="Food Allergies " 
                                placeholder="Shrimp..." 
                                helperText={errors.foodAllergies&&touched.foodAllergies?errors.foodAllergies:"Enter any food allergies" }
                                onPaste={(e)=>e.preventDefault()} 
                                sx={{
                                    '& .MuiFormHelperText-root': {
                                        width: 250,
                                    },
                                }}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.foodAllergies}
                                error={touched.foodAllergies && !!errors.foodAllergies}
                            />
                            <div className="flex justify-end items-center gap-2 w-full">
                                <LoadingButton
                                    className="font-bevietnam text-white bg-themeDark shadow-black disabled:bg-slate-400 disabled:opacity-50"
                                    disabled={_.size(errors)>0} 
                                    type="submit"
                                    variant="contained">
                                    Next
                                </LoadingButton>
                            </div>
                        </form>
                    )}
                    
                </Formik>
            </div>
        )
    }
    if (state.matches("SBanquet")){
        return(
            <div className="shadow rounded-xl flex items-center justify-center bg-white  max-h-[450px] w-82 md:w-96 overflow-y-auto flex-col relative">
                <div className="w-full flex items-center mt-7 justify-between gap-4 px-2">
                        <Tooltip title="Food Allergies">
                        <IconButton className="" onClick={()=>send({type:"EBackToCockTailBanquet"})}>
                            <ArrowBackIcon className="text-3xl"/>
                        </IconButton>
                        </Tooltip>
                    <div className="flex flex-col max-w-40 md:max-w-52">
                        <p>Main dish selection</p>
                        <p className="text-xs text-slate-400">Please provide the preference on main dish</p>
                    </div>
                    <div className="flex-1"></div>
                </div>
                <Formik
                    initialValues={{foodChoice:"beef"}}
                    onSubmit={async(values)=>{
                        send({
                            type:"EFillFoodChoice",
                            value:values.foodChoice as "beef"|"fish&shrimp"|"vegetarian"
                        })
                        send({
                            type:"EGotoRSVP"
                        })
                        
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleSubmit,
                    })=>(
                        <form className="flex flex-col items-center justify-start gap-4 p-7" onSubmit={handleSubmit}>
                            
                            <FormControl className="max-w-[250px] min-w-[120px]" error={touched.foodChoice && !!errors.foodChoice} required>
                                <InputLabel id="SBanquetFoodChoice-label">Main Course selection</InputLabel>
                                <Select
                                    labelId="SBanquetFoodChoice-label"
                                    id="SBanquetFoodChoice"
                                    name="foodChoice"
                                    value={values.foodChoice}
                                    label="Main Course selection"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="">
                                        <em>No Preference</em>
                                    </MenuItem>
                                    <MenuItem value={"beef"}>Short Rib (Slow-Braised Beef Short Rib in a Red Wine Sauce)</MenuItem>
                                    <MenuItem value={"fish&shrimp"}>Surf & Turf (Panko Crusted Cod Loin With Grilled Shrimp and Lobster Sauce)</MenuItem>
                                    <MenuItem value={"vegetarian"}>Parmigiana (Breaded Eggplant Layered With Tomato Sauce And Mozzarella Nestled On Soft Polenta)</MenuItem>
                                </Select>
                                <FormHelperText>{errors.foodChoice && touched.foodChoice ? errors.foodChoice:"Please select a main course" }</FormHelperText>
                            </FormControl>
                            <div className="flex justify-end items-center gap-2 w-full">
                                <LoadingButton 
                                    className="font-bevietnam text-white bg-themeDark shadow-black disabled:bg-slate-400 disabled:opacity-50"
                                    disabled={_.size(errors)>0} 
                                    type="submit"
                                    variant="contained">
                                    Next
                                </LoadingButton>
                            </div>
                        </form>
                    )}
                    
                </Formik>
            </div>
        )
    }
    if (state.matches("SRSVP")){
        return (
            <div className="shadow rounded-xl flex items-center justify-center bg-white h-[500px] max-h-[450px] w-82 md:w-96  flex-col relative">
                <div className="h-full">

                
                <div className="w-full flex items-center mt-7 justify-between gap-4 px-2 ">
                    
                    <Tooltip title="Fill Email information">
                        <IconButton className="" onClick={()=>{
                            console.log(state.context)
                            if(state.context.otherField.online){
                                send({
                                    type:"EBackToVirtual",
                                })
                            }else if(state.context.otherField.banquet){
                                send({
                                    type:"EBackToBanquet"
                                })
                            }else if(state.context.otherField.cocktail){
                                send({
                                    type:"EBackToCockTailBanquet"
                                })
                            }else if(state.context.otherField.ceremony){
                                send({
                                    type:"EBackToCeremony"
                                })
                            }
                        }}>
                            <ArrowBackIcon className="text-3xl"/>
                        </IconButton>
                    </Tooltip>
                    <div className="flex flex-col max-w-40 md:max-w-52">
                        <p>Send RSVP</p>
                        <p className="text-xs text-slate-400">Click the below button to createAccount and receive RSVP Email </p>
                    </div>
                    <div className="flex-1"></div>
                </div>
                
                    <div className="flex flex-col items-center justify-start gap-4 p-7 " >
                        <div className=" shadow-inner h-40 -z-10 overflow-y-scroll w-full">
                            {Object.entries(state.context.emailField).map(([key,value],i)=>{
                                console.log(key,value)
                                if(key==="reenterEmail"){
                                    return(<></>)
                                }
                                return (
                                    <div key={`${i}emailfield`} className="flex items-center justify-between">
                                        <p className="text-themeSemiDark uppercase">{keyToDisplay(key)}</p>
                                        <p >{value.toString()}</p>
                                    </div>
                                )
                            })}
                            {Object.entries(state.context.personalField).map(([key,value],i)=>{
                                console.log(key,value)
                                return (
                                    <div key={`${i}personalField`} className="flex items-center justify-between">
                                        <p className="text-themeSemiDark uppercase">{keyToDisplay(key)}</p>
                                        <p>{value?.toString()}</p>
                                    </div>
                                )
                            })}
                            {Object.entries(state.context.otherField).map(([key,value],i)=>{
                                console.log(key,value)
                                return (
                                    <div key={`${i}otherField`} className="flex items-center justify-between">
                                        <p className="text-themeSemiDark uppercase">{keyToDisplay(key)}</p>
                                        <p>{value?.toString()}</p>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="mt-4">
                            if everything is ok, you may click the Send button
                        </div>
                        <div className="flex justify-end items-center gap-2 w-full">
                            <LoadingButton 
                                className="font-bevietnam text-white bg-themeDark shadow-black disabled:bg-slate-400 disabled:opacity-50"
                                onClick={async()=> {
                                    await handleCreateUserAndRsvp()
                                    send({type:"EGotoFinish"})
                                }}
                                type="button"
                                variant="contained">
                                Send
                            </LoadingButton>
                        </div>
                    </div>
                    </div>
            </div>
        )
    }
    if (state.matches("SFinish")){
        return (
            <div className="shadow rounded-xl flex items-center justify-center bg-white  max-h-[450px] w-82 md:w-96 overflow-y-auto flex-col relative">
                <div className="w-full flex items-center mt-7 justify-between gap-4 px-2">
                    
                    <div className='w-[40px]'></div>
                    <div className="flex flex-col max-w-40 md:max-w-52">
                        <p>All Done</p>
                        <p className="text-xs text-slate-400">You will receive the RSVP Email shortly </p>
                    </div>
                    <div className="flex-1"></div>
                </div>
                
                    <div className="flex flex-col items-center justify-start gap-4 p-7" >
                        <div>
                            Thank you 
                            looking forward to see you
                        </div>
                        <div className="flex justify-end items-center gap-2 w-full">
                            <LoadingButton 
                                className="font-bevietnam text-white bg-themeDark shadow-black disabled:bg-slate-400 disabled:opacity-50 px-1"
                                onClick={()=>{
                                    router.push("/")
                                }}
                                type="button"
                                variant="contained">
                                Home
                            </LoadingButton>
                        </div>
                    </div>
            </div>
        )
    }
    return <></>
    
}