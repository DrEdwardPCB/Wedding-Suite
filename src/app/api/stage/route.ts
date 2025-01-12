import { NextResponse } from 'next/server';
import { GameManager } from '@/lib/game/GameManager'
import { SessionData, sessionOptions } from '@/lib/ironsession/lib';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
// This is required to enable streaming
export const dynamic = 'force-dynamic'
// use SSE to handle the streaming instead of using websocket
export async function GET(request: NextRequest){
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isLoggedIn){
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