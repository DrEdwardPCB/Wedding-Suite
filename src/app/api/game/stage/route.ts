import { GameManager } from '@/lib/game/GameManager'
import { SessionData, sessionOptions } from '@/lib/ironsession/lib';
import { findNoWinnersQuestion } from '@/lib/mongo/actions/QuestionAction';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server'

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
    const gm = GameManager.GetInstance()
    const targetState = await formData.get("targetState") as "Prepare"|"Open"|"Display"|"End"
    if(targetState==="Prepare"){
        const nextQuestionsPool = await findNoWinnersQuestion()
        if(nextQuestionsPool.length===0){
            gm?.ActionFinishSession()
        }else{
            gm?.ActionChangeQuestion(nextQuestionsPool[Math.min(Math.random()*(nextQuestionsPool.length-1))]._id)
        }
    }else if(targetState==="Open"){
        gm?.ActionOpen()
    }else if(targetState==="Display"){
        await gm?.ActionCalculate()
        await gm?.ActionDisplay()
    }else if (targetState==="End"){
        await gm?.ActionReset()
    }
    return NextResponse.json({});
}