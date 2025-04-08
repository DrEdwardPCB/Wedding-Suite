import { EditInfo } from '@/component/guest/Account/EditInfo';
import { getSession } from '@/lib/ironsession/action';
import { findUserByUserId } from '@/lib/mongo/actions/UserActions';
import { redirect } from 'next/navigation';

export default async function AccountManagementPage() {
  const session = await getSession();
  if (!session.userid || session.isAdmin || !session.isLoggedIn) {
    redirect('/guest/auth/signin');
  }
  const user = await findUserByUserId(session.userid);
  if (!user) {
    return <div>Unable to locate userinfo please contact Edward for Support</div>;
  }
  return <EditInfo info={user} />;
}
