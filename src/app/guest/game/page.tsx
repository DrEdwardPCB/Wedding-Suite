import { GamePlay } from '@/component/guest/game/GamePlay';
import { getSession } from '@/lib/ironsession/action';
import { redirect } from 'next/navigation';
export default async function GamePage() {
  const session = await getSession();
  if (!session.userid || session.isAdmin || !session.isLoggedIn) {
    redirect('/guest/auth/signin');
  }
  return (
    <div className="flex h-full flex-col items-center justify-around">
      <h1 className=" font-modelsignature text-5xl md:text-9xl  p-12">Game</h1>
      <GamePlay userId={session.userid} />
    </div>
  );
}
