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
      <h1 className="title">HODL your ass-ets in peace</h1>
      {!isConnected ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">
            Connect your wallet to start securing your assets
          </p>
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
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Credentials
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Set the credentials, either for locking or unlocking.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Lock Section */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Lock</h3>
            <p className="text-sm text-gray-500 mb-4">
              Lock your tokens by specifying the amount in Wei
            </p>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Amount (Wei)
                </label>
                <input
                  id="amount"
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setAmount("1000000000")}
                    className="btn btn-secondary text-sm"
                  >
                    1 Gwei
                  </button>
                  <button
                    onClick={() => setAmount("1000000000000000000")}
                    className="btn btn-secondary text-sm"
                  >
                    1 MATIC
                  </button>
                </div>
              </div>
              <button
                className="btn btn-primary w-full"
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
            <h3 className="text-lg font-medium text-gray-800 mb-4">Unlock</h3>
            <p className="text-sm text-gray-500 mb-4">
              Specify the recipient address to send the unlocked tokens to
            </p>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Recipient Address
                </label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input-field"
                />
              </div>
              <button
                className="btn btn-primary w-full"
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
