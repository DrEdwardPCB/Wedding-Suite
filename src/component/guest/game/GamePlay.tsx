"use client"

import { TZodQuestionSchema } from "@/lib/mongo/schema/QuestionSchema";
import { Button } from "@mantine/core";
import { CircularProgress } from "@mui/material";
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
            <div>
                {data.toString()}
            </div>
        )
    }
    //initial
    if(_.isNil(data)||isQuestion(data)){
        return(
            <div>
                <h1>Ready</h1>
            </div>
        )
    }
    //Close
    if(isCloseCommand(data)){
        return (
            <div>
                <CircularProgress/>
            </div>
        )
    }
    //Open
    if(isOpenCommand(data)){
        return (<div>
            <p>{question!.question}</p>
            <Button onClick = {()=>submitAnswer("A")}className = {`${isNil(correct)?"bg-transparent":question!.ans==="A"?"bg-green-400":userResponse==="A"?"bg-red-400":"bg-transparent"}`} disabled={!isNil(correct)}><p>A:{question!.A}</p></Button>
            <Button onClick = {()=>submitAnswer("B")}className = {`${isNil(correct)?"bg-transparent":question!.ans==="B"?"bg-green-400":userResponse==="B"?"bg-red-400":"bg-transparent"}`} disabled={!isNil(correct)}><p>B:{question!.B}</p></Button>
            <Button onClick = {()=>submitAnswer("C")}className = {`${isNil(correct)?"bg-transparent":question!.ans==="C"?"bg-green-400":userResponse==="C"?"bg-red-400":"bg-transparent"}`} disabled={!isNil(correct)}><p>C:{question!.C}</p></Button>
            <Button onClick = {()=>submitAnswer("D")}className = {`${isNil(correct)?"bg-transparent":question!.ans==="D"?"bg-green-400":userResponse==="D"?"bg-red-400":"bg-transparent"}`} disabled={!isNil(correct)}><p>D:{question!.D}</p></Button>
        </div>)
    }
    
    //Overall
    if(isOverallWinningData(data)){
        return (<div>
            {JSON.stringify(data)}
        </div>)
    }
}