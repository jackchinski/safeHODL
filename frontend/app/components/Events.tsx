"use client";
import React, { useEffect } from "react";
import useMultiBaas from "../hooks/useMultiBaas";
import Image from "next/image";

const Events: React.FC = () => {
  const EXPLORER_BASE = "https://amoy.polygonscan.com";

  const renderExplorerLink = (type: "block" | "tx", value: string | number) => {
    const path = type === "block" ? "block" : "tx";
    const displayValue =
      type === "tx" ? shortenHash(value.toString()) : `#${value}`;

    return (
      <a
        href={`${EXPLORER_BASE}/${path}/${value}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 hover:underline"
        title={type === "tx" ? value.toString() : undefined}
      >
        {displayValue}
      </a>
    );
  };

  const shortenHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const {
    fetchStats,
    isFetching,
    lockBoxesCount,
    opensCount,
    recentLockBoxes,
    recentOpens,
  } = useMultiBaas();

  useEffect(() => {
    fetchStats();

    const interval = setInterval(() => {
      fetchStats(false);
    }, 15000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <div className="relative w-full h-[200px] flex justify-center">
        <Image
          src="/banner.png"
          alt="Safe HODL Banner"
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="spinner-parent">
        {isFetching && (
          <div className="overlay">
            <div className="spinner" />
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="stats-card">
            <span className="stats-value">{lockBoxesCount}</span>
            <span className="stats-label">Total Locks</span>
          </div>
          <div className="stats-card">
            <span className="stats-value">{opensCount}</span>
            <span className="stats-label">Total Unlocks</span>
          </div>
        </div>

        {/* Events Tables */}
        <div className="grid grid-cols-1 gap-8">
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">
                Recent Locks
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="events-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Block</th>
                    <th>Transaction</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLockBoxes.map((event, index) => (
                    <tr key={index}>
                      <td>{event.email}</td>
                      <td>{renderExplorerLink("block", event.blockNumber)}</td>
                      <td>{renderExplorerLink("tx", event.transactionHash)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">
                Recent Unlocks
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="events-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Block</th>
                    <th>Transaction</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOpens.map((event, index) => (
                    <tr key={index}>
                      <td>{event.email}</td>
                      <td>{renderExplorerLink("block", event.blockNumber)}</td>
                      <td>{renderExplorerLink("tx", event.transactionHash)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
