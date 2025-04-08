import Link from 'next/link';
import { LoadImageFromDB } from '../common/ImageSlot';

export interface IGuestHomeRouteProps {
  slot: string;
  href: string;
  title: string;
  className?: string;
}
export default async function GuestHomeRoute({
  slot,
  href,
  className,
  title,
}: IGuestHomeRouteProps) {
  return (
    <Link href={href} className="shadow hover:rotate-3 transition-all hover:scale-105">
      <div className={`${className}  bg-white p-4`}>
        <LoadImageFromDB slot={slot} className="w-[300px] h-[300px] object-cover"></LoadImageFromDB>
        <h1 className="text-center font-bevietnam font-bold text-themeDark text-xl pt-4 font-bold">
          {title}
        </h1>
      </div>
    </Link>
  );
}
