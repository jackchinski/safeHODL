"use client";
import React, { useState } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import useMultiBaas from "../hooks/useMultiBaas";

const Voting: React.FC = () => {
  const { lock, unlock } = useMultiBaas();
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { sendTransactionAsync } = useSendTransaction();

  const [txHash, setTxHash] = useState<`0x${string}`>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const { isLoading: isTxProcessing } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLock = async (
    email: string,
    password: string,
    amount: string
  ) => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    try {
      const tx = await lock(email, password, amount);
      const hash = await sendTransactionAsync(tx);
      setTxHash(hash);
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  const handleUnlock = async (
    email: string,
    password: string,
    address: string
  ) => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    try {
      const tx = await unlock(email, password, address);
      const hash = await sendTransactionAsync(tx);
      setTxHash(hash);
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Secure Your Assets</h1>
      {!isConnected ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">Connect your wallet to start securing your assets</p>
          <button onClick={openConnectModal} className="btn btn-primary">
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="spinner-parent space-y-8">
          {isTxProcessing && (
            <div className="overlay">
              <div className="spinner" />
            </div>
          )}
          
          {/* Common Credentials Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Your Credentials</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Lock Section */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Lock Tokens</h3>
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Amount to Lock"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field"
              />
              <button
                className="btn btn-primary"
                disabled={!email || !password || !amount}
                onClick={(e) => {
                  e.preventDefault();
                  handleLock(email, password, amount);
                }}
              >
                Lock Tokens
              </button>
            </div>
          </div>

          {/* Unlock Section */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Unlock Tokens</h3>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Recipient Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="input-field"
              />
              <button
                className="btn btn-primary"
                disabled={!email || !password || !address}
                onClick={(e) => {
                  e.preventDefault();
                  handleUnlock(email, password, address);
                }}
              >
                Unlock Tokens
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Voting;
