import { GameManager } from '@/lib/game/GameManager'
import { SessionData, sessionOptions } from '@/lib/ironsession/lib';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
// This is required to enable streaming
export const dynamic = 'force-dynamic'


// update question id
// start question
// end question
//submit answer
export async function POST(request:NextRequest){
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
        if (!session.userid){
            return NextResponse.error()
        }
        const formData = await request.formData();
        const gm = await GameManager.GetInstance()
        const userId = await formData.get("userId") as string
        await gm?.RegisterCorrectUserId(userId)
        return NextResponse.json({});

}