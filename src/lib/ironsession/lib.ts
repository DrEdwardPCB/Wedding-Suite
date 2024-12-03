import { SessionOptions } from "iron-session";
import { env } from "../envalid/env";

export interface SessionData {
  username: string;
  userid: string;
  isLoggedIn: boolean;
  isAdmin:boolean;
  isOnlineOnly:boolean;
  error:string;
}

export const defaultSession: SessionData = {
  username: "",
  userid:"",
  isLoggedIn: false,
  isAdmin: false,
  isOnlineOnly:false,
  error:""
};

export const sessionOptions: SessionOptions = {
  password: env.COOKIE_SECRET_KEY,
  cookieName:
    "ekwedding-auth",
  cookieOptions: {
    // secure only works in `https` environments
    // if your localhost is not on `https`, then use: `secure: process.env.NODE_ENV === "production"`
    secure: env.isProduction,
  },
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}