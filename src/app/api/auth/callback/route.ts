import { SessionData, sessionOptions } from "@/lib/ironsession/lib";
import { OAuth2Client } from "google-auth-library";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET (req:NextRequest)  {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
  const oauth2Client = new OAuth2Client(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
  );

  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.error();
  }

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const userInfo = await oauth2Client.request({
    url: "https://www.googleapis.com/oauth2/v3/userinfo",
  });

  const {user} = userInfo.data;
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  // Save user info in the session
  // if entry is present in db
  // if entry is absent from db
  req.session.user = {
    id: user.sub,
    email: user.email,
    name: user.name,
    picture: user.picture,
  };
  await session.save();

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/", // Redirect to the homepage or another route
    },
  });
};