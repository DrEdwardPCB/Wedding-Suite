"use client"
import useSWR from "swr";

import {Image} from "@mantine/core"

const fetcher = (path: string) => fetch(path).then((res) => res.json());


export const S3Image = ({ Key, className }: { Key: string, className?:string }) => {
  const { data } = useSWR<{ src: string }>(`/api/documents/${Key}`, fetcher)
  // const {data} = await (await fetch(`/api/documents/${Key}`)).json()
  return <Image src={data?.src} alt={Key} className={className} />
}