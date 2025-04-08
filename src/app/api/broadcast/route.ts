import { SessionData, sessionOptions } from '@/lib/ironsession/lib';
import { getLatestConfig } from '@/lib/mongo/actions/ConfigActions';
import { TZodConfigSchema } from '@/lib/mongo/schema/Config';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import emailjs from '@emailjs/nodejs';
import { findUserByPhysicalPresence } from '@/lib/mongo/actions/UserActions';
export interface IBroadcastTemplateParams {
  message: string;
  title: string;
  type: 'Physical' | 'Virtual' | 'All';
}

export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isAdmin) {
    return NextResponse.error();
  }
  const formData = await request.formData();
  const message = formData.get('message') as string;
  const title = formData.get('title') as string;
  const type = formData.get('type') as 'Physical' | 'Virtual' | 'All';
  const config = (await getLatestConfig()) as TZodConfigSchema;
  if (!config.emailjsAPIKey || !config.emailjsServiceId || !config.emailjsBroadcastTemplateId) {
    console.error('emailJS API Key or info is missing');
    return NextResponse.error();
  }
  const emailList = await findUserByPhysicalPresence(type);
  if (emailList?.length === 0) {
    console.error('no email is found with criteria');
    return NextResponse.error();
  }
  const email = emailList.map(e => e.email);
  emailjs.init({ publicKey: config.emailjsAPIKey as string });
  emailjs.send(config.emailjsServiceId, config.emailjsBroadcastTemplateId, {
    title,
    message,
    email,
  });
  return NextResponse.json({});
}
