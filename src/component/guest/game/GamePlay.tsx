/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { TZodQuestionSchema } from "@/lib/mongo/schema/QuestionSchema";
import { ButtonBase, CircularProgress } from "@mui/material";
import { EventSourceController, EventSourcePlus } from "event-source-plus";
import _, { isNil } from "lodash";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useSWRMutation from "swr/mutation";

type TEventData= Record<string, number> | string[] | {state:"open"} | {state:"stop"}|{state:"end"} | TZodQuestionSchema | undefined

async function updateStage(
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
// Type Deterministic function
function isOverallWinningData(arg:TEventData):arg is Record<string,number>{
    return !_.isNil(arg) &&!isQuestionWinningData(arg)&&!isOpenCommand(arg)&&!isCloseCommand(arg)&&!isQuestion(arg)
} 
function isQuestionWinningData(arg:TEventData):arg is string[]{
    return !_.isNil(arg)&&Array.isArray(arg)
}
function isOpenCommand(arg:TEventData):arg is {state:"open"}{
    return !_.isNil(arg)&&!isQuestionWinningData(arg) && _.has(arg,"state") && arg.state==="open"
}
function isCloseCommand(arg:TEventData):arg is {state:"stop"}{
    return !_.isNil(arg)&&!isQuestionWinningData(arg) && _.has(arg,"state") && arg.state==="stop"
}
function isEndCommand(arg:TEventData):arg is {state:"end"}{
    return !_.isNil(arg)&&!isQuestionWinningData(arg) && _.has(arg,"state") && arg.state==="end"
}
function isQuestion(arg:TEventData):arg is TZodQuestionSchema{
    return !_.isNil(arg)&&!isQuestionWinningData(arg) && _.has(arg,"ans")
}
export interface IGamePlayProps{
    userId:string
}
export const GamePlay =({userId}:IGamePlayProps)=>{
    const [data, setData] = useState<TEventData>()
    const { trigger } = useSWRMutation("/api/game/user", updateStage);
    const [question,setQuestion] = useState<TZodQuestionSchema|undefined>()
    const [correct,setCorrect] = useState<boolean|undefined>()
    const [userResponse, setUserResponse] = useState<"A"|"B"|"C"|"D"|undefined>()
    const evt = useRef<EventSourceController|undefined>()
    const router = useRouter()
    const startEventStream = ()=>{
        console.log("starting")
        const evtSource = new EventSourcePlus("/api/game/user/sse");
        const controller = evtSource.listen({
            onRequest({ request, options }) {
                console.log(request, options);
        
                // add current time query search params
                options.query = options.query || {};
                options.query.t = new Date();
                options.headers.set("accept-encoding","*")
            },
            async onRequestError({ request, error }) {
                console.log(`[request error]`, request, error);
            },
            onMessage(event){
                console.log(event)
                const dat = JSON.parse(event.data)
                console.log(dat)
                if(dat==="heartbeat"){
                    return
                }
                if (dat) {
                    setData(dat);
                }
            },
            async onResponse({  response }) {
                console.log(`Received status code: ${response.status}`);
            },

        })

        evt.current = controller
    }
    useEffect(() => {
        startEventStream()
        return ()=>{
            console.log('EventSource closed:', "effect end")
            evt.current?.abort()
        }
    }, []);
    //ans check
    const submitAnswer=(ans:"A"|"B"|"C"|"D")=>{
        setUserResponse(ans)
        if(ans === question?.ans){
            setCorrect(true)
            trigger({userId})
        }else{
            setCorrect(false)
        }
    }



    // handle saving current question
    useEffect(()=>{
        if(isQuestion(data)&&isNil(question)){
            setQuestion(data)
            setCorrect(undefined)
            setUserResponse(undefined)
        }
        if(isCloseCommand(data)||isQuestionWinningData(data)||isOverallWinningData(data)){
            setQuestion(undefined)
            setCorrect(undefined)
            setUserResponse(undefined)
        }
        if(isEndCommand(data)){
            router.replace("/guest/")
        }
    },[data,question])

    //Display
    if(isQuestionWinningData(data)){
        return(
            <div className="w-full flex flex-col gap-2 items-stretch px-14 pt-7 h-96">
                <div className="flex-1 bg-white rounded shadow flex p-7 justify-center">
                    <h1 className="font-bold text-3xl">winners</h1>
                </div>
                <div className="w-full flex items-stretch px-14 rounded h-96 bg-white shadow overflow-y-auto">
                    <div className="w-full flex flex-col items-center p-4">
                            {data.map((e,i)=>{
                                return (<div key={`${e}-${i}`}>
                                    {e}
                                </div>)
                            })}
                    </div>
                </div>
            </div>
        )
    }
    //initial
    if(_.isNil(data)||isQuestion(data)){
        //dummy
        // const data={
        //     "Edward":10,
        //     "Kiki":9,
        //     "Koko":9,
        //     "Caca":11,
        //     "wewe":9,
        //     "asdasd":0,
        //     "okosdfgj":17,
        // }
        // const question={
        //     question:"asdasdas",
        //     A:"asdasd",
        //     B:"oiasdj",
        //     C:"poipo",
        //     D:"09823e",
        //     ans:"B"
        // }
        //dummy end
        return(
            <div className="w-full flex items-stretch p-14">
                <div className="flex-1 bg-white rounded shadow flex p-7 justify-center">
                    <h1 className="font-bold text-3xl">Ready?</h1>
                </div>
            </div>
        )
        
       
    }
    //Close
    if(isCloseCommand(data)){
        return(
            <div className="w-full flex items-stretch p-14">
                <div className="flex-1 bg-white rounded shadow flex p-7 justify-center">
                    <CircularProgress/>
                </div>
            </div>
        )
    }
    //Open
    if(isOpenCommand(data)){
        return (
            <div className="flex flex-col gap-2">
                <div className="w-full flex items-stretch px-14 pt-8">
                     <div className="flex-1 bg-white rounded shadow flex p-7 justify-center">
                         <h1 className="font-bold text-3xl">{question!.question}</h1>
                     </div>
                 </div>
                 <div className="w-full flex items-stretch px-14">
                    <div className="flex-1 grid grid-cols-2 grid-rows-2 p-4 justify-center gap-2">
                        <ButtonBase onClick = {()=>submitAnswer("A")}className = {`${isNil(correct)?"":question!.ans==="A"?"outline outline-2 outline-offset-2 outline-green-400":userResponse==="A"?"outline outline-2 outline-offset-2 outline-red-400":""} bg-red-500 rounded shadow flex items-center h-20 justify-center cursor-pointer text-white z-100`} disabled={!isNil(correct)}><p className="font-bold p-4 text-wrap break-all w-full text-xs md:text-base">{question!.A}</p></ButtonBase>
                        <ButtonBase onClick = {()=>submitAnswer("B")}className = {`${isNil(correct)?"":question!.ans==="B"?"outline outline-2 outline-offset-2 outline-green-400":userResponse==="B"?"outline outline-2 outline-offset-2 outline-red-400":""} bg-yellow-500 rounded shadow flex items-center h-20 justify-center cursor-pointer text-white z-100`} disabled={!isNil(correct)}><p className="font-bold p-4 text-wrap break-all w-full text-xs md:text-base">{question!.B}</p></ButtonBase>
                        <ButtonBase onClick = {()=>submitAnswer("C")}className = {`${isNil(correct)?"":question!.ans==="C"?"outline outline-2 outline-offset-2 outline-green-400":userResponse==="C"?"outline outline-2 outline-offset-2 outline-red-400":""} bg-blue-500 rounded shadow flex items-center h-20 justify-center cursor-pointer text-white z-100`} disabled={!isNil(correct)}><p className="font-bold p-4 text-wrap break-all w-full text-xs md:text-base">{question!.C}</p></ButtonBase>
                        <ButtonBase onClick = {()=>submitAnswer("D")}className = {`${isNil(correct)?"":question!.ans==="D"?"outline outline-2 outline-offset-2 outline-green-400":userResponse==="D"?"outline outline-2 outline-offset-2 outline-red-400":""} bg-green-500 rounded shadow flex items-center h-20 justify-center cursor-pointer text-white z-100`} disabled={!isNil(correct)}><p className="font-bold p-4 text-wrap break-all w-full text-xs md:text-base">{question!.D}</p></ButtonBase>
                    </div>
                </div>           
            </div>)
    }
    
    //Overall
    if(isOverallWinningData(data)){
        return ( <div className="w-full flex flex-col gap-2 items-stretch px-14 pt-7 h-96">
            <div className="flex-1 bg-white rounded shadow flex p-7 justify-center">
                <h1 className="font-bold text-3xl">Overall Winners</h1>
            </div>
            <div className="w-full flex items-stretch px-1 md:px-14 rounded h-96 bg-white shadow overflow-y-auto">
                <div className="w-full flex flex-col items-center p-4">
                            <div className=" flex justify-between p-4 w-full">
                                <p className="font-bold flex-1 text-center">Position</p>
                                <p className="font-bold flex-1 text-center">Player</p>
                                <p className="font-bold flex-1 text-center">Score</p>
                            </div>
                        {Object.entries(data).sort(([k1,v1],[k2,v2])=>v2-v1).map(([k,v],i)=>{
                            
                            return (<div key={`${k}-${v}-${i}`} className={`${i===0?"text-amber-300 font-bold":i===1?"text-zinc-400 font-bold":i===2?"text-yellow-700 font-bold":""} flex justify-between p-4 w-full`}>
                                <p className="flex-1 text-center">{i+1}</p>
                                <p className="flex-1 text-center">{k}</p>
                                <p className="flex-1 text-center">{v}</p>
                            </div>)
                        })}
                </div>
            </div>
        </div>
        )
    }
}