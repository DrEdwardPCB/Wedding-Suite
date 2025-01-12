"use client"

import { TZodQuestionSchema } from "@/lib/mongo/schema/QuestionSchema";
import { Button } from "@mantine/core";
import { CircularProgress } from "@mui/material";
import _, { isNil } from "lodash";
import { useEffect, useState } from "react";
import useSWRMutation from "swr/mutation";

type TEventData= Record<string, number> | string[] | {state:"open"} | {state:"stop"} | TZodQuestionSchema | undefined

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
    useEffect(() => {
        const evtSource = new EventSource("/api/game/user");
        evtSource.onmessage = (event) => {
          if (event.data) {
            setData(JSON.parse(event.data));
          }
        };
        return ()=>evtSource.close()
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
        if(isQuestion(data)){
            setQuestion(data)
            setCorrect(undefined)
            setUserResponse(undefined)
        }
    },[data])

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