"use client";

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Voting from "./components/Locking";
import Events from "./components/Events";

const Home: React.FC = () => {
  return (
    <div>
      <div className="navbar">
        <h1 className="app-title">Safe HODL !!!</h1>
        <ConnectButton />
      </div>
      <div>
        <Voting />
        <Events />
      </div>
    </div>
  );
};

export default Home;
