// app/api/documents/route.ts
import { NextRequest, NextResponse } from "next/server";

import {
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { Bucket, s3 } from "@/lib/awss3/s3";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/ironsession/lib";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { commitAdd } from "@/lib/mongo/actions/PhotoAction";


// endpoint to get the list of files in the bucket
export async function GET() {
  const response = await s3.send(new ListObjectsCommand({ Bucket }));
  return NextResponse.json(response?.Contents ?? []);
}

// endpoint to upload a file to the bucket
export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isAdmin){
    return NextResponse.error()
  }

  const formData = await request.formData();
  const album = formData.get("album") as string
  const title= formData.get("title") as string|undefined
  const description= formData.get("description") as string|undefined
  const slot = formData.get("slot") as string|undefined
  const type = formData.get("type") as "photo"|"video"
  const files = formData.getAll("file") as File[];
  const response = await Promise.all(
    files.map(async (file) => {
      const uuid=randomUUID()
      // not sure why I have to override the types here
      const Body = (await file.arrayBuffer()) as unknown as Buffer;
      s3.send(new PutObjectCommand({ Bucket, Key: uuid, Body }));
      await commitAdd({
        fileLocation:uuid,
        title,
        description,
        album,
        slot,
        type,
      })
    })
  );

  return NextResponse.json(response);
}