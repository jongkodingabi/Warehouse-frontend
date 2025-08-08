"use client";

import { useState, useEffect } from "react";

export default function Dashboard() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()));
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="mt-20 p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="">
          <h1 className="text-3xl font-bold text-primary">
            Dashboard Overview
          </h1>
          <p className="mt-4 text-gray-800">
            Selamat datang Jhon Doe, mari lihat ada apa saja di gudang hari
            ini!, Semangat 😉
          </p>
        </div>

        <div className="font-semibold text-gray-700 mr-2">
          {" "}
          {time.toLocaleTimeString("en-US", { timeZone: "Asia/Jakarta" })}
        </div>
      </div>
      {/* Additional dashboard content can go here */}
    </div>
  );
}
