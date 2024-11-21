// app/api/documents/route.ts
import { NextRequest, NextResponse } from "next/server";

import {
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { Bucket, s3 } from "@/lib/awss3/s3";


// endpoint to get the list of files in the bucket
export async function GET() {
  const response = await s3.send(new ListObjectsCommand({ Bucket }));
  return NextResponse.json(response?.Contents ?? []);
}

// endpoint to upload a file to the bucket
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const files = formData.getAll("file") as File[];

  const response = await Promise.all(
    files.map(async (file) => {
      // not sure why I have to override the types here
      const Body = (await file.arrayBuffer()) as unknown as Buffer;
      s3.send(new PutObjectCommand({ Bucket, Key: file.name, Body }));
    })
  );

  return NextResponse.json(response);
}