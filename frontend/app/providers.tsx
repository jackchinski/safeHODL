"use client";

import * as React from "react";

import {
  getDefaultConfig,
  RainbowKitProvider,
  Chain,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const projectId = process.env.NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID || "";

const polygonTestnet = {
  id: 80002,
  name: "Polygon Amoy Testnet",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  rpcUrls: {
    default: { http: [`https://rpc-amoy.polygon.technology/`] },
  },
} as const satisfies Chain;

const config = getDefaultConfig({
  appName: "Safe HODL",
  projectId,
  chains: [polygonTestnet],
});
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{mounted && children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
