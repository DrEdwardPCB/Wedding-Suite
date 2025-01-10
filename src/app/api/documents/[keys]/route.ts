import { NextResponse } from "next/server";
import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Bucket, s3 } from "@/lib/awss3/s3";
import { commitDeleteByFilelocation } from "@/lib/mongo/actions/PhotoAction";

// Bucket and s3: same as above

export async function GET(_: Request, { params }: { params: Promise<{ keys : string }> }) {
  const {keys} = await params
  const command = new GetObjectCommand({ Bucket, Key: keys });
  const src = await getSignedUrl(s3, command, { expiresIn: 3600 });

  return NextResponse.json({ src });
}

export async function DELETE(_: Request, { params }: { params: Promise<{  keys : string }> }) {
  const {keys} = await params
  const command = new DeleteObjectCommand({ Bucket, Key: keys});
  await s3.send(command)
  await commitDeleteByFilelocation(keys)
  return NextResponse.json({});
}