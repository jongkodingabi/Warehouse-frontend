"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

// Interface untuk data barang dari API
interface BarangData {
  id: number;
  namaBarang: string;
  productionDate: string;
  stockAwal: number;
  totalStock: number;
  kategori: {
    kategori: string;
  };
  status: string;
}

interface ChartData {
  name: string;
  value: number;
  totalStock: number;
}

export default function StockBarChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isMounted, setIsMounted] = useState(false);

  // Array nama bulan dalam bahasa Indonesia
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  // Ensure component is mounted before rendering chart
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchBarangData = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/api/v1/barang");
      const barangData: BarangData[] = response.data.data;

      // Proses data untuk chart berdasarkan bulan produksi
      const monthlyData = processDataByMonth(barangData, selectedYear);
      setChartData(monthlyData);
    } catch (error) {
      toast.error("Gagal memuat data chart");
    } finally {
      setIsLoading(false);
    }
  };

  const processDataByMonth = (
    data: BarangData[],
    year: number
  ): ChartData[] => {
    // Inisialisasi data untuk semua bulan (0 produk)
    const monthlyStats = monthNames.map((month, index) => ({
      name: month,
      value: 0,
      totalStock: 0,
      month: index,
    }));

    // Filter data berdasarkan tahun dan status aktif
    const filteredData = data.filter((item) => {
      const productionYear = new Date(item.productionDate).getFullYear();
      return productionYear === year && item.status === "active";
    });

    // Hitung jumlah produk dan total stock per bulan
    filteredData.forEach((item) => {
      const productionDate = new Date(item.productionDate);
      const monthIndex = productionDate.getMonth();

      monthlyStats[monthIndex].value += 1; // Tambah jumlah produk
      monthlyStats[monthIndex].totalStock += item.totalStock; // Tambah total stock
    });

    return monthlyStats;
  };

  // Mendapatkan tahun-tahun yang tersedia dari data
  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];

    // Tampilkan 3 tahun ke belakang sampai tahun depan
    for (let year = currentYear - 3; year <= currentYear + 1; year++) {
      years.push(year);
    }

    return years;
  };

  useEffect(() => {
    fetchBarangData();
  }, [selectedYear]);

  // Custom tooltip untuk chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`Bulan: ${label}`}</p>
          <p className="text-blue-600">{`Jumlah Produk: ${data.value}`}</p>
          <p className="text-green-600">{`Total Stock: ${data.totalStock}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm h-full flex flex-col p-5 top-20 md:top-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Data Barang per Bulan</h2>

        {/* Dropdown untuk memilih tahun */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border border-gray-300 px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {getAvailableYears().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full flex-1" style={{ minWidth: 0 }}>
        {!isMounted ? (
          // Show placeholder while mounting
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-32 mb-4 mx-auto"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-8 bg-gray-200 rounded"
                    style={{ width: `${Math.random() * 200 + 100}px` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ) : isLoading ? (
          // Loading skeleton
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-32 mb-4 mx-auto"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-8 bg-gray-200 rounded"
                    style={{ width: `${Math.random() * 200 + 100}px` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ) : chartData.some((item) => item.value > 0) ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                fontSize={12}
              />
              <YAxis
                label={{
                  value: "Jumlah Produk",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                fill="#1D4ED8"
                radius={[5, 5, 0, 0]}
                name="Jumlah Produk"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          // No data message
          <div className="h-[300px] flex flex-col items-center justify-center text-gray-500">
            <svg
              className="w-16 h-16 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-lg font-medium">Tidak ada data produk</p>
            <p className="text-sm">untuk tahun {selectedYear}</p>
          </div>
        )}
      </div>

      {/* Summary statistics */}
      {!isLoading && chartData.some((item) => item.value > 0) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Total Produk</p>
              <p className="text-xl font-bold text-blue-600">
                {chartData.reduce((sum, item) => sum + item.value, 0)}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Bulan Terbanyak</p>
              <p className="text-lg font-bold text-purple-600">
                {chartData.reduce(
                  (max, item) => (item.value > max.value ? item : max),
                  chartData[0]
                )?.name || "-"}
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Rata-rata/Bulan</p>
              <p className="text-xl font-bold text-orange-600">
                {Math.round(
                  chartData.reduce((sum, item) => sum + item.value, 0) / 12
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
