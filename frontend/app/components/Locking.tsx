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
  const { lock } = useMultiBaas();
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { sendTransactionAsync } = useSendTransaction();

  const [txHash, setTxHash] = useState<`0x${string}`>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const { isLoading: isTxProcessing } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLock = async (
    email: string,
    passwordAndEmailHash: string,
    amount: string
  ) => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    try {
      const tx = await lock(email, passwordAndEmailHash, amount);
      const hash = await sendTransactionAsync(tx);
      setTxHash(hash);
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">HODL your money, securely though</h1>
      {!isConnected ? (
        <div className="text-center">Please connect your wallet to hodl!</div>
      ) : (
        <div className="spinner-parent">
          {isTxProcessing && (
            <div className="overlay">
              <div className="spinner"></div>
            </div>
          )}
          <div className="flex gap-2">
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                handleLock(email, password, amount);
              }}
            >
              Lock
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Voting;
