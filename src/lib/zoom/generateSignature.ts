import { KJUR } from "jsrsasign";
import { getLatestConfig } from "../mongo/actions/ConfigActions";

export async function generateSignature(sessionName: string, role: number) {
    const {zoomSDKKey,zoomSDKSecret}=await getLatestConfig()
  if ( !zoomSDKKey|| !zoomSDKSecret) {
    throw new Error("Missing ZOOM_SDK_KEY or ZOOM_SDK_SECRET");
  }
  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;
  const oHeader = { alg: "HS256", typ: "JWT" };
  const sdkKey = zoomSDKKey;
  const sdkSecret = zoomSDKSecret;
  const oPayload = {
    app_key: sdkKey, tpc: sessionName, role_type: role, version: 1, iat: iat, exp: exp,
  };
  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  const sdkJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, sdkSecret);
  return sdkJWT;
}