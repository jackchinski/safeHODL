"use client";

import * as React from "react";

import {
  getDefaultConfig,
  RainbowKitProvider,
  Chain
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const projectId = process.env.NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID || '';
const mbBaseUrl = process.env.NEXT_PUBLIC_MULTIBAAS_DEPLOYMENT_URL || '';
const mbWeb3ApiKey = process.env.NEXT_PUBLIC_MULTIBAAS_WEB3_API_KEY || '';


const curvegridTestnet = {
  id: 2017072401,
  name: 'Curvegrid Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [`${mbBaseUrl}/web3/${mbWeb3ApiKey}`] },
  },
} as const satisfies Chain;


const config = getDefaultConfig({
  appName: 'Simple Voting DApp',
  projectId,
  chains: [curvegridTestnet],
});
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {mounted && children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
