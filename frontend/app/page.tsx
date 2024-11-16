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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="grid lg:grid-cols-2 gap-8">
          <Voting />
          <Events />
        </div>
        <a
          href="https://github.com/jackchinski/safeHODL"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary w-full flex items-center justify-center gap-2 mb-16"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-github"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38 
              0-.19-.01-.82-.01-1.49-2 .37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
              -.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 
              2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 
              0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 
              0 0 .67-.21 2.2.82a7.65 7.65 0 012-.27c.68 
              0 1.36.09 2 .27 1.53-1.04 2.2-.82 
              2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 
              2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 
              1.48 0 1.07-.01 1.93-.01 2.2 
              0 .21.15.46.55.38A8.001 8.001 0 0016 8c0-4.42-3.58-8-8-8z"
            />
          </svg>
          View Repository
        </a>
      </div>
    </div>
  );
};

export default Home;
