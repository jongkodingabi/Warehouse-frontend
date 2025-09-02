"use client";

import { BoxesIcon, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Barang } from "@/utils/types";
import axiosInstance from "@/lib/axios";

export default function Stock() {
  const [barang, setBarang] = useState<Barang[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBarang = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/api/v1/barang");
      setBarang(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBarang();
  }, []);

  const totalBarang = barang.length;
  const activeBarang = barang.filter((b) => b.status === "active").length;
  const unActiveBarang = barang.filter((b) => b.status === "un-active").length;

  return (
    <>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-50 px-5">
          {/* Card 1 */}
          <div className="animate-pulse rounded-lg shadow-md border p-4 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="bg-gray-300 h-6 w-6 rounded-md"></div>
              <div className="bg-gray-300 h-5 w-12 rounded"></div>
            </div>
            <div className="mt-auto">
              <div className="bg-gray-300 h-6 w-20 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 w-32 rounded"></div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="animate-pulse rounded-lg shadow-md border p-4 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="bg-gray-300 h-6 w-6 rounded-md"></div>
              <div className="bg-gray-300 h-5 w-12 rounded"></div>
            </div>
            <div className="mt-auto">
              <div className="bg-gray-300 h-6 w-20 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 w-32 rounded"></div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="animate-pulse rounded-lg shadow-md border p-4 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="bg-gray-300 h-6 w-6 rounded-md"></div>
              <div className="bg-gray-300 h-5 w-12 rounded"></div>
            </div>
            <div className="mt-auto">
              <div className="bg-gray-300 h-6 w-20 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 w-32 rounded"></div>
            </div>
          </div>
        </div>
      ) : (
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
            </div>
            <div className="mt-auto">
              <p className="text-2xl font-semibold">{unActiveBarang}</p>
              <p className="text-sm text-gray-500">Barang Non Aktif</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
