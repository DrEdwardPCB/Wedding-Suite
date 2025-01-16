
import { getData } from "@/lib/zoom/getToken";
import Script from "next/script";
import dynamic from "next/dynamic";

const Videocall = dynamic<{ slug: string; JWT: string }>(
    () => import("../../../../component/mgmt/stream/Videocall"),
  );
export default async function Page({ params }: { params: { slug: string } }) {
  const jwt = await getData(params.slug);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <Videocall slug={params.slug} JWT={jwt} />
    <Script src="/coi-serviceworker.js" strategy="beforeInteractive" />
  </main>
  );
}