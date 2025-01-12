"use client"

import { TZodQuestionSchema } from "@/lib/mongo/schema/QuestionSchema";
import { Button } from "@mantine/core";
import { CircularProgress } from "@mui/material";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import useSWRMutation from "swr/mutation";

type TEventData= Record<string, number> | string[] | {state:"open"} | {state:"stop"} | TZodQuestionSchema | undefined

async function updateStage(
    url:string,
    {arg}:{arg:{
        targetState:"Prepare"|"Open"|"Display"|"End"
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
    useEffect(() => {
        console.log("starting")
        const evtSource = new EventSource("/api/game/stage");
        evtSource.onopen = () => {
            console.log('Connection to server opened')
          }
        evtSource.onmessage = (event) => {
        console.log(event)
          if (event.data) {
            setData(JSON.parse(event.data));
          }
        };
        evtSource.onerror = (e) => {
            console.log('EventSource closed:', e)
            evtSource.close() // Close the connection if an error occurs
        }
        console.log(evtSource)
        return ()=>{
            console.log('EventSource closed:', "effect end")
            evtSource.close()
        }
    }, []);

    // all actions
    const NextStep=()=>{
        trigger({targetState:"Prepare"})
    }
    const StartQuestion=()=>{
        trigger({targetState:"Open"})
    }
    const StartDisplay=()=>{
        trigger({targetState:"Display"})
    }
    const ResetGameManager=()=>{
        trigger({targetState:"End"})
    }

    // handle question display countdown
    const interval = useRef<undefined|ReturnType<typeof setInterval>>()
    useEffect(()=>{
        if(isOpenCommand(data)){
            StartQuestion()
            setCountDown(20)
            interval.current=setInterval(()=>{
                setCountDown(cd=>cd-1)
            },1000)
            setTimeout(()=>{
                StartDisplay()
                clearInterval(interval.current)

            },20000)
        }
    },[data])

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
                {data.toString()}
                <Button onClick={()=>NextStep()}>Next</Button>
            </div>
        )
    }
    //initial
    if(_.isNil(data)){
        return(
            <div>
                <Button onClick={()=>NextStep()}>Start</Button>
            </div>
        )
    }
    //Close
    if(countDown===0){
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
            {JSON.stringify(data)}
            <Button onClick={()=>ResetGameManager()}>End Back to Main</Button>
        </div>)
    }
}