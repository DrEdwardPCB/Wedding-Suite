import { GameManager } from '@/lib/game/GameManager'
import { SessionData, sessionOptions } from '@/lib/ironsession/lib';
import { findNoWinnersQuestion } from '@/lib/mongo/actions/QuestionAction';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
// This is required to enable streaming
export const dynamic = 'force-dynamic'

// Events
// Update Question ID
export async function GET(request: NextRequest){
  //check 
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isAdmin){
    return NextResponse.error()
  }

  const responseStream = new TransformStream()
  const writer = responseStream.writable.getWriter()
  const encoder = new TextEncoder()

  // Close if client disconnects
  request.signal.onabort = () => {
    console.log('closing writer')
    writer.close()
  }
  const gm = GameManager.GetInstance()
  const gameState = gm?.getState()
  function sendData(data: any) {
    const formattedData = `data: ${JSON.stringify(data)}\n\n`
    writer.write(encoder.encode(formattedData))
  }
  const sub = gameState?.subscribe({
        next:async (v)=>{
            switch(v){
                case "Prepare": 
                    const question = gm?.getQuestion()
                    sendData(question)
                    return 
                case "Open":
                    sendData({state:"open"})
                    return
                case "Calculate":
                    sendData({state:"stop"})
                    return
                case "Display":
                    const questionResult = await gm?.GetWinners()
                    sendData(questionResult)
                    return
                case "Overall":
                    const overallResult = gm?.GetOverallScore()
                    sendData(overallResult)
                    writer.close()
                    sub?.unsubscribe()
                    return 
            }
        }
  })

  // Function to send data to the client
  return new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform'
    }
  })
}
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