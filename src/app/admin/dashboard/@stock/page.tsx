"use client";

import { BoxesIcon, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Barang } from "@/utils/types";
import axiosInstance from "@/lib/axios";

export default function Stock() {
  const [barang, setBarang] = useState<Barang[]>([]);
  const [loading, setIsLoading] = useState(false);

  const fetchBarang = async () => {
    const response = await axiosInstance.get("/api/v1/barang");
    setBarang(response.data.data);
  };

  useEffect(() => {
    fetchBarang();
  }, []);

  const totalBarang = barang.length;
  const activeBarang = barang.filter((b) => b.status === "active").length;
  const unActiveBarang = barang.filter((b) => b.status === "un-active").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-50 px-5">
      {/* Card 1 */}
      <div className="bg-white rounded-lg shadow-md border p-4 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="bg-primary text-white p-2 rounded-md">
            <BoxesIcon className="w-10 h-10" />
          </div>
          {/* <span className="bg-primary text-white text-md font-semibold px-2 py-1 rounded">
            12 %
          </span> */}
        </div>
        <div className="mt-auto">
          <p className="text-2xl font-semibold">{totalBarang}</p>
          <p className="text-sm text-gray-500">Total Barang</p>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white rounded-lg shadow-md border p-4 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="bg-primary text-white p-2 rounded-md">
            <TrendingUp className="w-8 h-8" />
          </div>
          <span className="bg-primary text-white text-md font-semibold px-2 py-1 rounded">
            18 %
          </span>
        </div>
        <div className="mt-auto">
          <p className="text-2xl font-semibold">{activeBarang}</p>
          <p className="text-sm text-gray-500">Barang Aktif</p>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-white rounded-lg shadow-md border p-4 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="bg-primary text-white p-2 rounded-md">
            <TrendingDown className="w-8 h-8" />
          </div>
          <span className="bg-primary text-white text-md font-semibold px-2 py-1 rounded">
            21 %
          </span>
        </div>
        <div className="mt-auto">
          <p className="text-2xl font-semibold">{unActiveBarang}</p>
          <p className="text-sm text-gray-500">Barang Non Aktif</p>
        </div>
      </div>
    </div>
  );
}
