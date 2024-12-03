// /api/session
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { defaultSession, sessionOptions } from "../../../lib/ironsession/lib";
import { redirect } from "next/navigation";
import { sleep, SessionData } from "../../../lib/ironsession/lib";
export async function POST(request: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  
    const formData = await request.formData();
  
    session.isLoggedIn = true;
    session.username = (formData.get("username") as string) ?? "No username";
    await session.save();
  
    // simulate looking up the user in db
    await sleep(250);
  
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/303
    // not using redirect() yet: https://github.com/vercel/next.js/issues/51592#issuecomment-1810212676
    return Response.redirect(
      `${request.nextUrl.origin}/`,
      303,
    );
  }
  
  // /api/session
  // /api/session?action=logout
  export async function GET(request: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  
    const action = new URL(request.url).searchParams.get("action");
    // /api/session?action=logout
    if (action === "logout") {
      session.destroy();
      return redirect(
        "/",
      );
    }
  
    // simulate looking up the user in db
    await sleep(250);
  
    if (session.isLoggedIn !== true) {
      return Response.json(defaultSession);
    }
    return Response.json(session);
}