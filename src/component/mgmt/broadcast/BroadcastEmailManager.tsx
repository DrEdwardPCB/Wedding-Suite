'use client';
import useSWRMutation from 'swr/mutation';
import { IBroadcastTemplateParams } from '@/app/api/broadcast/route';
import { EmailBroadcastForm } from './EmailBroadcastForm';
async function sendBroadcastEmail(
  url: string,
  {
    arg,
  }: {
    arg: IBroadcastTemplateParams;
  },
): Promise<object[]> {
  const body = new FormData();
  body.append('message', arg.message);
  body.append('title', arg.title);
  body.append('type', arg.type);

  const response = await fetch(url, { method: 'POST', body });
  return await response.json();
}
export const BroadcastEmailManager = () => {
  const { trigger } = useSWRMutation('/api/broadcast', sendBroadcastEmail);
  const handleSendProadcastEmail = async (value: IBroadcastTemplateParams) => {
    await trigger(value);
  };
  return (
    <div className="flex flex-col max-h-[100vh] p-14 gap-10 justify-center items-center">
      <EmailBroadcastForm
        submitFnc={handleSendProadcastEmail}
        title="Email Broadcast"
        description="Send Broadcast Email to guest"
      ></EmailBroadcastForm>
    </div>
  );
};
