import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  instrumentationHook: true,
};

export default nextConfig;
