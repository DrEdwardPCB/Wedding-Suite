import { GameManager } from '@/lib/game/GameManager'
import { SessionData, sessionOptions } from '@/lib/ironsession/lib';
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

//   Close if client disconnects
  request.signal.onabort = (evt) => {
    console.log("abort")
    console.log(evt)
    console.log('closing writer')
    clearInterval(heartbeatInterval)
    writer.close()
  }
  const gm = GameManager.GetInstance()
  const gameState = gm?.getState()
  const heartbeatInterval = setInterval(() => {
    sendData("heartbeat")
  }, 15000);
  function sendData(data: any) {
    const formattedData = `data: ${JSON.stringify(data)}\n\n`
    writer.write(encoder.encode(formattedData))
  }
  async function onStateUpdate(v:string){
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
  const sub = gameState?.subscribe({
        next:async (v)=>{
            onStateUpdate(v)
        }
  })
  onStateUpdate(await gm.getCurrentState())


  // Function to send data to the client
  return new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Content-Encoding': 'none',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
      'Access-Control-Allow-Origin': '*'
    }
  })
}
