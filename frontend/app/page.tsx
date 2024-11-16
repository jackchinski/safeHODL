"use client";

import React from "react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Voting from "./components/Locking";
import Events from "./components/Events";

const Home: React.FC = () => {
  return (
    <div>
      <div className="navbar">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Safe HODL Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <h1 className="app-title">Safe HODL !!!</h1>
        </div>
        <ConnectButton />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <Voting />
          <Events />
        </div>
      </div>
    </div>
  );
};

export default Home;