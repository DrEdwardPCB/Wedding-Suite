import { MgmtHome } from '@/component/common/MgmtHome';
import { getSession, logoutMgmt } from '@/lib/ironsession/action';
import { Button } from '@mui/material';
import { redirect } from 'next/navigation';
import { BroadcastManager } from '@/component/mgmt/broadcast/BroadcastManager';
import { BroadcastEmailManager } from '@/component/mgmt/broadcast/BroadcastEmailManager';
// space-y-2 space-x-2 mb-4 block text-sm font-medium text-gray-700 bg-gray-200 bg-blue-600 border
export default async function MgmtBroadcastPage() {
  const session = await getSession();
  if (!session.isAdmin || !session.isLoggedIn) {
    alert('You have not loggedin we are redirecting you to mgmt login');
    redirect('/mgmt/auth');
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full p-10 flex items-center justify-between">
        <MgmtHome />
        <h1 className="">Broadcast Message</h1>
        <Button onClick={logoutMgmt}>logout</Button>
      </div>
      <div className="flex gap-2">
        <BroadcastManager />
        <BroadcastEmailManager />
      </div>
    </div>
  );
}
