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
    useEffect(()=>{
        if(isQuestion(data)&&state.matches("Prepare")&&state.context.question===undefined){
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
            StartCalculate()
            send({type:"Open.TimerEnd"})
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
            <div>
                <p>Display question result</p>
                {state.context.winnerOfQuestion}
                <Button onClick={()=>NextStep()}>Next</Button>
            </div>
        )
    }
    //Overall
    if(state.matches('Overall')||isOverallWinningData(data)){
        return (<div>
            <p>Display overall result</p>
            {JSON.stringify(state.context.overall)}
            <Link href="/mgmt"><Button onClick={()=>ResetGameManager()}>End Back to Main</Button></Link>
        </div>)
    }
    //initial
    if(state.matches('Prepare')&& isNil(state.context.question)){
        return(
            <div>
                <p>initial</p>
                <Button onClick={()=>NextStep()}>Start</Button>
            </div>
        )
    }
    //questionArrive
    if(state.matches('Prepare')&& !isNil(state.context.question)){
        return(
            <div>
                <p>{state.context.question.question}</p>
                <Button onClick={()=>StartQuestion()}>Start</Button>
            </div>
        )
    }
    //Close
    
    if(state.matches('Calculate')){
        return (
            <div>
                <CircularProgress/>
            </div>
        )
    }
    //Open
    if(state.matches('Open')){
        return (<div>
            {state.context.countDown}
            {JSON.stringify(state.context.question)}
        </div>)
    }
    
    
}