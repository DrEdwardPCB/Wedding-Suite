"use client"

import { TZodQuestionSchema } from "@/lib/mongo/schema/QuestionSchema";
import { Button } from "@mantine/core";
import { CircularProgress } from "@mui/material";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import useSWRMutation from "swr/mutation";
import { EventSourceController, EventSourcePlus } from "event-source-plus";

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
export const GameDisplay =()=>{
    const [data, setData] = useState<TEventData>()
    const { trigger } = useSWRMutation("/api/game/stage", updateStage);
    const [countDown, setCountDown] = useState<number>(0)
    const [question,setQuestion] = useState<TZodQuestionSchema|undefined>()
    const evt = useRef<EventSourceController|undefined>()
    const [displayStarted, setDisplayStarted] = useState(false)
    const startEventStream = ()=>{
        console.log("starting")
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
        setDisplayStarted(false)
    }
    const StartCalculate=()=>{
        trigger({targetState:"Calculate"})
        setDisplayStarted(true)
    }
    const StartDisplay=()=>{
        trigger({targetState:"Display"})
        setDisplayStarted(true)
    }
    const ResetGameManager=()=>{
        trigger({targetState:"End"})
    }

    // handle question display countdown
    const interval = useRef<undefined|ReturnType<typeof setInterval>>()
    useEffect(()=>{
        if(isOpenCommand(data)&&!displayStarted){
            StartQuestion()
            setCountDown(20)
            interval.current=setInterval(()=>{
                setCountDown(cd=>cd-1)
            },1000)
            setTimeout(()=>{
                StartCalculate()
                clearInterval(interval.current)
                interval.current=undefined

            },20000)
        }
        if(isCloseCommand(data)){
            StartDisplay()
        }
    },[data,displayStarted])

    // handle saving current question
    useEffect(()=>{
        if(isQuestion(data)){
            setQuestion(data)
        }
    },[data])
    //Display
    if(isQuestionWinningData(data)){
        return(
            <div>
                <p>Display question result</p>
                {data.toString()}
                <Button onClick={()=>NextStep()}>Next</Button>
            </div>
        )
    }
    //initial
    if(_.isNil(data)){
        return(
            <div>
                <p>initial</p>
                <Button onClick={()=>NextStep()}>Start</Button>
            </div>
        )
    }
    //questionArrive
    if(isQuestion(data)&&question){
        return(
            <div>
                <p>{question!.question}</p>
                <Button onClick={()=>StartQuestion()}>Start</Button>
            </div>
        )
    }
    //Close
    
    if(countDown<=0){
        return (
            <div>
                <CircularProgress/>
            </div>
        )
    }
    //Open
    if(isOpenCommand(data)){
        return (<div>
            {countDown}
            {JSON.stringify(question)}
        </div>)
    }
    
    //Overall
    if(isOverallWinningData(data)){
        return (<div>
            <p>Display overall result</p>
            {JSON.stringify(data)}
            <Button onClick={()=>ResetGameManager()}>End Back to Main</Button>
        </div>)
    }
}