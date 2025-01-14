import {  GameManager } from '@/lib/game/GameManager'
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
  request.signal.onabort = async (evt) => {
    console.log("abort")
    console.log(evt)
    console.log('closing writer')
    clearInterval(heartbeatInterval)
    const gm = await GameManager.GetInstance()
    gm.ActionReset()
    sub.unsubscribe()
    writer.close()
  }
  const gm = await GameManager.GetInstance()
  const gameState = gm?.getState()
//   console.log(gm,gameState)
  const heartbeatInterval = setInterval(() => {
    console.log("heartbeat")
    sendData("heartbeat")
  }, 15000);
  function sendData(data: any) {
    const formattedData = `data: ${JSON.stringify(data)}\n\n`
    writer.write(encoder.encode(formattedData))
  }
  async function onStateUpdate(v:string){
    switch(v){
        case "Prepare": 
            const question = await gm?.getQuestion()
            sendData(question??"heartbeat")
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
            const overallResult = await gm?.GetOverallScore()
            sendData(overallResult)
            return 
        case "Overall":
            sendData({state:"end"})
            return 
    }
  }
  const sub = gameState?.subscribe({
        next:async (v)=>{
            // console.log("subscription:", v, gm.getCurrentState(), gm)
            onStateUpdate(v)
        }
  })
  onStateUpdate(await gm.getCurrentState())

  console.log("presend")
  // Function to send data to the client
  return new NextResponse(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Content-Encoding': 'none',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
      'Access-Control-Allow-Origin': '*'
    }
  })
}
