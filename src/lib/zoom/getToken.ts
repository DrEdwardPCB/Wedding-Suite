import { generateSignature } from "./generateSignature";

export async function getData(slug: string) {
    const JWT = await generateSignature(slug, 1);
    return JWT;
  }