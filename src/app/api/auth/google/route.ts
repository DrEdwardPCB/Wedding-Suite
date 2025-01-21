import { OAuth2Client } from "google-auth-library";

export async function GET() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

  const oauth2Client = new OAuth2Client(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    `${process.env.BASE_URL}/api/auth/callback/google`
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"],
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: authUrl,
    },
  });
}