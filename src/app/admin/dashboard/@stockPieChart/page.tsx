"use client";
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import axiosInstance from "@/lib/axios";
import { RotateCcw } from "lucide-react";

const COLORS = [
  "#3B82F6",
  "#9CA3AF",
  "#10B981",
  "#111827",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
];

interface AuditData {
  id: number;
  deskripsi: string;
  user: {
    userId: number;
    userName: string;
  };
  barang: {
    idBarang: number;
    namaBarang: string;
  };
  type: string;
}

interface ChartData {
  name: string;
  value: number;
}

export default function DonutChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuditData();
  }, []);

  const fetchAuditData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Menggunakan axios dengan benar
      const response = await axiosInstance.get("/api/v1/auditlog");

      // Dengan axios, data langsung tersedia di response.data
      const result = response.data;

      if (result.data && Array.isArray(result.data)) {
        // Hitung frekuensi setiap barang
        const barangCount: { [key: string]: number } = {};

        result.data.forEach((audit: AuditData) => {
          const namaBarang = audit.barang.namaBarang;
          barangCount[namaBarang] = (barangCount[namaBarang] || 0) + 1;
        });

        // Convert ke format chart data dan urutkan berdasarkan frequency
        const chartData: ChartData[] = Object.entries(barangCount)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value) // Sort descending by frequency
          .slice(0, 8); // Ambil maksimal 8 barang teratas

        setChartData(chartData);
      } else {
        throw new Error("Invalid data format received from API");
      }
    } catch (err) {
      console.error("Error fetching audit data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = (): void => {
    fetchAuditData();
  };

  if (loading) {
    return (
      <div className="w-full max-w-md bg-white rounded-md border ml-0 xl:ml-40 self-end p-4">
        <h2 className="text-xl font-semibold mb-4">
          Most Frequently Used Items
        </h2>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md bg-white rounded-md border ml-0 xl:ml-40 self-end p-4">
        <h2 className="text-xl font-semibold mb-4">
          Most Frequently Used Items
        </h2>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-red-500 mb-2">⚠️ Error loading data</div>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="w-full max-w-md bg-white rounded-md border ml-0 xl:ml-40 self-end p-4">
        <h2 className="text-xl font-semibold mb-4">
          Most Frequently Used Items
        </h2>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-gray-500 mb-2">📊 No data available</div>
          <p className="text-gray-600 text-sm mb-4">No audit log data found</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-md border min-h-[500px] ml-0 xl:ml-40 self-end p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Most Frequently Used Items</h2>
        <button
          onClick={handleRefresh}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          title="Refresh data"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            label={({ percent }: { percent?: number }) =>
              percent ? `${(percent * 100).toFixed(0)}%` : ""
            }
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: "12px" }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Summary info */}
      <div className="mt-4 text-sm text-gray-600">
        <p>
          Total items tracked:{" "}
          {chartData.reduce((sum, item) => sum + item.value, 0)}
        </p>
        <p>Showing top {chartData.length} most frequent items</p>
      </div>
    </div>
  );
}
