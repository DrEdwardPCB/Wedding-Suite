/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { TZodQuestionSchema } from "@/lib/mongo/schema/QuestionSchema";
import { Button } from "@mantine/core";
import { CircularProgress } from "@mui/material";
import _, { isNil } from "lodash";
import { useEffect, useRef, useState } from "react";
import useSWRMutation from "swr/mutation";
import { EventSourceController, EventSourcePlus } from "event-source-plus";
import { useMachine } from '@xstate/react';
import { createBrowserInspector } from '@statelyai/inspect';
import { gameMachine } from "@/lib/xstate/gameMachine";
import Link from 'next/link'

const { inspect } = createBrowserInspector({
  // Comment out the line below to start the inspector
  autoStart: false
});

type TEventData= Record<string, number> | string[] | {state:"open"} | {state:"stop"} | TZodQuestionSchema | undefined
async function updateStage(
    url:string,
    {arg}:{arg:{
        targetState:"Prepare"|"Open"|"Display"|"End"|"Calculate"
    }}
):Promise<object[]>{
    const body = new FormData()
    body.append("targetState", arg.targetState)
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
function isQuestion(arg:TEventData):arg is TZodQuestionSchema{
    return !_.isNil(arg)&&!isQuestionWinningData(arg) && _.has(arg,"ans")
}
// use xstate to copy the finite state machine to here
export const GameDisplay =()=>{
    const [data, setData] = useState<TEventData>()
    const { trigger } = useSWRMutation("/api/game/stage", updateStage);
    const evt = useRef<EventSourceController|undefined>()
    const [state,send]=useMachine(gameMachine,{inspect})
    const startEventStream = ()=>{
        const evtSource = new EventSourcePlus("/api/game/stage/sse");
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

    // all actions
    const NextStep=()=>{
        trigger({targetState:"Prepare"})
    }
    const StartQuestion=()=>{
        trigger({targetState:"Open"})
    }
    const StartCalculate=()=>{
        trigger({targetState:"Calculate"})
    }
    const StartDisplay=()=>{
        trigger({targetState:"Display"})
    }
    const ResetGameManager=()=>{
        trigger({targetState:"End"})
        evt.current?.abort()
    }

    // handle question display countdown
    const interval = useRef<undefined|ReturnType<typeof setInterval>>()
    const [displayAnswer,setDisplayAnswer] = useState(false)
    useEffect(()=>{
        if(isQuestion(data)&&state.matches("Prepare")&&state.context.question===undefined){
            setDisplayAnswer(false)
            send({type:"Prepare.GetQuestion",value:data})
        }
        if(isOpenCommand(data)&&state.matches("Prepare")){
            send({type:"Prepare.StartGame"})
            if(interval.current===undefined){

                interval.current=setInterval(()=>{
                    send({type:"Open.Tick"})
                },1000)
            }
        }
        if((state.context.countDown<=0&&state.matches("Open")) || (isCloseCommand(data)&&state.matches("Open"))){
            clearInterval(interval.current)
            interval.current=undefined
            setDisplayAnswer(true)
            setTimeout(()=>{
                setDisplayAnswer(false)
                StartCalculate()
                send({type:"Open.TimerEnd"})
            },5000)
           
        }
        if(state.matches("Calculate")){
            StartDisplay()
        }
        if(isQuestionWinningData(data)&&state.matches("Calculate")){
            send({type:"Calculate.FinishCalculate",value:data})
        }
        if(isOverallWinningData(data)&&state.matches("Display")){
            send({type:"Display.DisplayOverall",value:data})
        }
        if(isQuestion(data)&&state.matches("Display")){
            send({type:"Display.NextQuestion",value:data})
        }
    },[data,state])

    //Display
    if(state.matches('Display')){
        return(
            <div className="w-full flex flex-col gap-2 items-stretch px-14 pt-7 h-96">
                <div className="flex-1 bg-white rounded shadow flex p-7 justify-center">
                    <h1 className="font-bold text-3xl">Winners</h1>
                </div>
                <div className="w-full flex items-stretch px-14 rounded h-96 bg-white shadow overflow-y-auto">
                    <div className="w-full flex flex-col items-center p-4">
                            {state.context.winnerOfQuestion.map((e,i)=>{
                                return (<div key={`${e}-${i}`}>
                                    {e}
                                </div>)
                            })}
                    </div>
                </div>
                <Button onClick={()=>NextStep()}>Next</Button>
            </div>
        )
        // return(
        //     <div>
        //         <p>Display question result</p>
        //         {state.context.winnerOfQuestion}
        //         <Button onClick={()=>NextStep()}>Next</Button>
        //     </div>
        // )
    }
    //Overall
    if(state.matches('Overall')||isOverallWinningData(data)){
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
                        {Object.entries(state.context.overall).sort(([k1,v1],[k2,v2])=>v2-v1).map(([k,v],i)=>{
                            
                            return (<div key={`${k}-${v}-${i}`} className={`${i===0?"text-amber-300 font-bold":i===1?"text-zinc-400 font-bold":i===2?"text-yellow-700 font-bold":""} flex justify-between p-4 w-full`}>
                                <p className="flex-1 text-center">{i+1}</p>
                                <p className="flex-1 text-center">{k}</p>
                                <p className="flex-1 text-center">{v}</p>
                            </div>)
                        })}
                </div>
            </div>
            <Link href="/mgmt" className="w-full"><Button onClick={()=>ResetGameManager()}>End Back to Main</Button></Link>
        </div>
        )
        // return (<div>
        //     <p>Display overall result</p>
        //     {JSON.stringify(state.context.overall)}
        //     <Link href="/mgmt"><Button onClick={()=>ResetGameManager()}>End Back to Main</Button></Link>
        // </div>)
    }
    //initial
    if(state.matches('Prepare')&& isNil(state.context.question)){
        return(
            <div className="w-full flex items-stretch p-14">
                <div className="flex-1 bg-white rounded shadow flex p-7 justify-center flex-col items-center gap-4">
                    <h1 className="font-bold text-xl">Let the Game Begin?</h1>
                    <Button onClick={()=>NextStep()}>Start</Button>
                </div>
            </div>
        )
    }
    //questionArrive
    if(state.matches('Prepare')&& !isNil(state.context.question)){
        return(
            <div className="w-full flex items-stretch p-14">
                <div className="flex-1 bg-white rounded shadow flex p-7 justify-center flex-col items-center gap-4">
                    <h1 className="text-xl ">Read the question carefully</h1>
                    <h1 className="font-bold text-4xl italic">{state.context.question.question}</h1>
                    <Button onClick={()=>StartQuestion()}>Start</Button>
                </div>
            </div>
        )
        
    }
    //Close
    
    if(state.matches('Calculate')){
        return (
            <div className="w-full flex items-stretch p-14">
                <div className="flex-1 bg-white rounded shadow flex p-7 justify-center">
                    <CircularProgress/>
                </div>
            </div>
        )
    }
    //Open
    if(state.matches('Open')){
        return (
            <div className="flex flex-col gap-2">
                <div className="w-full flex items-stretch px-14 pt-8">
                     <div className="flex-1 bg-white rounded shadow flex p-7 justify-center items-center flex-col ">
                        <h1 className="font-bold text-5xl">{state!.context.countDown>0?state.context.countDown:"STOP!"}</h1>
                         <h1 className="font-bold text-3xl">{state!.context.question?.question}</h1>
                     </div>
                 </div>
                 <div className="w-full flex items-stretch px-14">
                    <div className="flex-1 grid grid-cols-2 grid-rows-2 p-4 justify-center gap-2">
                        <div className = {`${displayAnswer&&state.context.question?.ans==="A"?"outline outline-2 outline-offset-2 outline-green-400 animate-bounce":""} bg-red-500 rounded shadow flex items-center h-20 justify-center cursor-pointer text-white z-100`}><p className="font-bold p-4 text-center text-wrap break-all w-full text-xs md:text-base">{state?.context?.question?.A}</p></div>
                        <div className = {`${displayAnswer&&state.context.question?.ans==="B"?"outline outline-2 outline-offset-2 outline-green-400 animate-bounce":""} bg-yellow-500 rounded shadow flex items-center h-20 justify-center cursor-pointer text-white z-100`}><p className="font-bold p-4 text-center text-wrap break-all w-full text-xs md:text-base">{state?.context?.question?.B}</p></div>
                        <div className = {`${displayAnswer&&state.context.question?.ans==="C"?"outline outline-2 outline-offset-2 outline-green-400 animate-bounce":""} bg-blue-500 rounded shadow flex items-center h-20 justify-center cursor-pointer text-white z-100`}><p className="font-bold p-4 text-center text-wrap break-all w-full text-xs md:text-base">{state?.context?.question?.C}</p></div>
                        <div className = {`${displayAnswer&&state.context.question?.ans==="D"?"outline outline-2 outline-offset-2 outline-green-400 animate-bounce":""} bg-green-500 rounded shadow flex items-center h-20 justify-center cursor-pointer text-white z-100`}><p className="font-bold p-4 text-center text-wrap break-all w-full text-xs md:text-base">{state?.context?.question?.D}</p></div>
                    </div>
                </div>           
            </div>)
    }
    
    
}