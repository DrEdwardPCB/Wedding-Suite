import { GameManager } from '@/lib/game/GameManager'
import { SessionData, sessionOptions } from '@/lib/ironsession/lib';
import { findNoWinnersQuestion } from '@/lib/mongo/actions/QuestionAction';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server'
import { lastValueFrom } from 'rxjs';

export const runtime = 'nodejs'
// This is required to enable streaming
export const dynamic = 'force-dynamic'


// fire timer end for question display and 
export async function POST(request:NextRequest){
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isAdmin){
        return NextResponse.error()
    }
    const formData = await request.formData();
    const gm = await GameManager.GetInstance()
    console.log(gm)
    const targetState = await formData.get("targetState") as "Prepare"|"Open"|"Calculate"|"Display"|"End"
    if(targetState==="Prepare"){
        const nextQuestionsPool = await findNoWinnersQuestion()
        console.log(nextQuestionsPool)
        if(nextQuestionsPool.length===0){
            await gm?.ActionFinishSession()
        }else{
            console.log(nextQuestionsPool[Math.min(Math.random()*(nextQuestionsPool.length-1))]._id)
            await gm?.ActionChangeQuestion(nextQuestionsPool[Math.min(Math.random()*(nextQuestionsPool.length-1))]._id)
            console.log(await lastValueFrom(gm.getState().asObservable()))
        }
    }else if(targetState==="Open"){
        await gm?.ActionOpen()
    }else if(targetState==="Calculate"){
        await gm?.ActionCalculate()
    }else if(targetState==="Display"){
        await gm?.ActionDisplay()
    }else if (targetState==="End"){
        await gm?.ActionReset()
    }
    return NextResponse.json({targetState});
}