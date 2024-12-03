import { SessionData } from "./lib";
import { defaultSession, sessionOptions, sleep } from "./lib";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { env } from "../envalid/env";

export async function getSession(shouldSleep = true) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  if (!session.isLoggedIn) {
      session.username = defaultSession.username;
      session.userid=defaultSession.userid
      session.isLoggedIn = defaultSession.isLoggedIn;
      session.isAdmin= defaultSession.isAdmin
      session.isOnlineOnly=defaultSession.isOnlineOnly
      session.error=defaultSession.error;
  }

  if (shouldSleep) {
    // simulate looking up the user in db
    await sleep(250);
  }

  return session;
}

export async function logoutMgmt() {
  "use server";
  // false => no db call for logout
  const session = await getSession(false);
  session.destroy();
  revalidatePath("/");
}

export async function loginMgmt(formData: FormData) {
  "use server";

  const session = await getSession();
  if(formData.get("username")===env.MGMT_USERNAME&&formData.get("password")===env.MGMT_PASSWORD){
    session.username = "admin"
    session.userid=""
    session.isLoggedIn = true;
    session.isAdmin=true
    session.isOnlineOnly=false
    session.error=""
    await session.save();
  }
  session.username = "admin"
  session.userid=""
  session.isLoggedIn = true;
  session.isAdmin=true
  session.isOnlineOnly=false
  session.error="Invalid Password or username"
  await session.save();
  revalidatePath("/mgmt");
}