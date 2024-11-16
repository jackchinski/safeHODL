"use client";
import React, { useEffect } from "react";
import useMultiBaas from "../hooks/useMultiBaas";

const Events: React.FC = () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <h1 className="title">Statistics & Recent Activity</h1>
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
            <span className="stats-label">Total Lock Boxes</span>
          </div>
          <div className="stats-card">
            <span className="stats-value">{opensCount}</span>
            <span className="stats-label">Total Opens</span>
          </div>
        </div>

        {/* Events Tables */}
        <div className="grid grid-cols-1 gap-8">
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Recent Lock Boxes</h2>
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
                      <td>#{event.blockNumber}</td>
                      <td>
                        <span className="transaction-hash">{event.transactionHash}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Recent Opens</h2>
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
                      <td>#{event.blockNumber}</td>
                      <td>
                        <span className="transaction-hash">{event.transactionHash}</span>
                      </td>
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
