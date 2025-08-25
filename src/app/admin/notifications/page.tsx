"use client";

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Package,
  RefreshCw,
  Search,
  Filter,
  Clock,
  Building2,
  Tag,
} from "lucide-react";
import axiosInstance from "@/lib/axios";

const NotifikasiStockMenipis = () => {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await axiosInstance.get("/api/v1/notifikasi/10");
      setData(response.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Filter data based on search term
  const filteredData =
    data?.data?.filter(
      (item: any) =>
        item.produk.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kodegrp.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kategori.kategori
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.divisi.divisi.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const getStockStatusColor = (stock: number) => {
    if (stock <= 2) return "text-red-600 bg-red-100";
    if (stock <= 5) return "text-orange-600 bg-orange-100";
    return "text-yellow-600 bg-yellow-100";
  };

  const getStockStatusText = (stock: number) => {
    if (stock <= 2) return "Stock Kritis";
    if (stock <= 5) return "Stock Rendah";
    return "Stock Terbatas";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Notifikasi Stock Rendah
              </h1>
              <p className="text-gray-600 mt-1">
                Barang-barang yang membutuhkan perhatian segera
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Barang
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data?.total || 0}
                  </p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Stock Kritis
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {
                      filteredData.filter(
                        (item: any) => item.stockSekarang <= 2
                      ).length
                    }
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Perlu Restock
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {
                      filteredData.filter(
                        (item: any) => item.stockSekarang <= 5
                      ).length
                    }
                  </p>
                </div>
                <RefreshCw className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, kode, kategori, atau divisi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>
                  Update terakhir:{" "}
                  {lastUpdated ? lastUpdated.toLocaleString() : "Loading..."}
                </span>
              </div>

              <button
                onClick={fetchNotifications}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-center justify-center">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-3" />
              <span className="text-gray-600">Memuat data notifikasi...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredData.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm
                ? "Tidak Ada Data yang Sesuai"
                : "Tidak Ada Notifikasi"}
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? `Tidak ditemukan barang yang sesuai dengan pencarian "${searchTerm}"`
                : "Semua barang memiliki stock yang cukup"}
            </p>
          </div>
        )}

        {/* Notifications List */}
        {!isLoading && filteredData.length > 0 && (
          <div className="space-y-4">
            {filteredData.map((item: any) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.produk}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(
                            item.stockSekarang
                          )}`}
                        >
                          {getStockStatusText(item.stockSekarang)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Kode:</span>
                          <span className="font-medium">{item.kodegrp}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Filter className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Kategori:</span>
                          <span className="font-medium">
                            {item.kategori.kategori}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Divisi:</span>
                          <span className="font-medium">
                            {item.divisi.divisi}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-6 text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {item.stockSekarang}
                      </div>
                      <div className="text-sm text-gray-600">unit tersisa</div>

                      {item.stockSekarang <= 2 && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Urgent
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="px-6 pb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        item.stockSekarang <= 2
                          ? "bg-red-500"
                          : item.stockSekarang <= 5
                          ? "bg-orange-500"
                          : "bg-yellow-500"
                      }`}
                      style={{
                        width: `${Math.max(
                          (item.stockSekarang / 10) * 100,
                          5
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{item.stockSekarang}</span>
                    <span>10 unit</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Info */}
        {!isLoading && data && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Menampilkan {filteredData.length} dari {data.total} barang dengan
            stock di bawah 10 unit
          </div>
        )}
      </div>
    </div>
  );
};

export default NotifikasiStockMenipis;
