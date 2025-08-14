"use client";

import { useState, useEffect } from "react";

export default function Dashboard() {
  const [time, setTime] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", { timeZone: "Asia/Jakarta" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-20 p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Dashboard Admin Gudang Overview
          </h1>
          <p className="mt-4 text-gray-800">
            Selamat datang Jhon Doe, mari lihat ada apa saja di gudang hari
            ini!, Semangat 😉
          </p>
        </div>

        <div className="font-semibold text-gray-700 mr-2">
          {isMounted ? time : null}
        </div>
      </div>
    </div>
  );
}
