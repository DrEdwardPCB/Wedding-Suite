/* eslint-disable @typescript-eslint/ban-ts-comment */
import { SessionData } from "./lib";
import { defaultSession, sessionOptions, sleep } from "./lib";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { env } from "../envalid/env";
import { findUserByEmail } from "../mongo/actions/UserActions";
import { isNil } from "lodash";
import { encryptData } from "../encryption";

export async function getSession(shouldSleep = true) {
  const cookie = await cookies()
  const session = await getIronSession<SessionData>(
    //@ts-ignore
    cookie, 
    sessionOptions);

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

export async function logoutGuest() {
  "use server";
  // false => no db call for logout
  const session = await getSession(false);
  session.destroy();
  revalidatePath("/");
}

export async function loginGuest(formData: FormData) {
  "use server";

  const session = await getSession();
  const username =formData.get("username") as string
  const password = formData.get("password") as string
  if(isNil(username)||isNil(password)){
    revalidatePath("/");
    return 
  }
  const user = await findUserByEmail(username)
  if(!user){
    revalidatePath("/");
    return
  }
  if(encryptData(password)!==user.password){
    revalidatePath("/");
    return
  }
    session.username = user.email
    session.userid=user.id
    session.isLoggedIn = true;
    session.isAdmin=false
    session.error=""
    await session.save();
    revalidatePath("/");
    return
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
    revalidatePath("/mgmt");
    return
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