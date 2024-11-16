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
      <h1 className="title">Recent Events</h1>
      <div className="spinner-parent">
        {isFetching && (
          <div className="overlay">
            <div className="spinner"></div>
          </div>
        )}
        <div>
          <div className="event">
            <h2>Lock Boxes</h2>
            <p>{lockBoxesCount}</p>
          </div>
          <div className="event">
            <h2>Opens</h2>
            <p>{opensCount}</p>
          </div>
        </div>
        <div>
          <div className="event">
            <h2>Recent Lock Boxes</h2>
          </div>
          <div className="event">
            <h2>Recent Opens</h2>
            <p>{opensCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
