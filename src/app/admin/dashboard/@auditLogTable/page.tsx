"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  RefreshCw,
  Filter,
  Calendar,
} from "lucide-react";
import axiosInstance from "@/lib/axios";

export default function AuditLogTable() {
  const [auditData, setAuditData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchAuditData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/api/v1/auditlog");
      setAuditData(response.data.data || []);
      setFilteredData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching audit data:", error);
      setAuditData([]);
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditData();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...auditData];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.user?.userName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.barang?.namaBarang
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== "All") {
      filtered = filtered.filter((item) => item.type === filterType);
    }

    // Sort by date/time (assuming there's a timestamp field, otherwise by index)
    filtered.sort((a, b) => {
      const aValue = a.createdAt || a.timestamp || a.id || 0;
      const bValue = b.createdAt || b.timestamp || b.id || 0;
      return sortOrder === "desc"
        ? new Date(bValue).getTime() - new Date(aValue).getTime()
        : new Date(aValue).getTime() - new Date(bValue).getTime();
    });

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [auditData, searchTerm, filterType, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleRefresh = () => {
    fetchAuditData();
  };

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (isLoading && auditData.length === 0) {
    return (
      <div className="border rounded-lg p-8 mx-4 mb-4 bg-white shadow-md">
        <div className="flex items-center justify-center">
          <RefreshCw className="animate-spin h-8 w-8 text-blue-600" />
          <span className="ml-2 text-gray-600">Loading audit data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg mx-4 mb-4 bg-white shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Audit Log</h2>
            <p className="text-sm text-gray-600 mt-1">
              Total {filteredData.length} records
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Filters and Search */}
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search user or item name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[140px]"
            >
              <option value="All">Semua Tipe</option>
              <option value="Stock In">Stock In</option>
              <option value="Stock Out">Stock Out</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[120px]"
            >
              <option value="desc">Terbaru</option>
              <option value="asc">Terlama</option>
            </select>
          </div>

          {/* Items per page */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Lihat:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <th className="px-6 py-4 font-semibold text-left">Pengguna</th>
              <th className="px-6 py-4 font-semibold text-center">
                Nama Barang
              </th>
              <th className="px-6 py-4 font-semibold text-center">
                Stock Sekarang
              </th>
              <th className="px-6 py-4 font-semibold text-center">
                Input Stok
              </th>
              <th className="px-6 py-4 font-semibold text-center">Tipe</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentData.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {searchTerm || filterType !== "All" ? (
                    <div>
                      <Search className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-lg font-medium">
                        Tidak ada audit ditemukan
                      </p>
                      <p className="text-sm">Coba terapkan filter data</p>
                    </div>
                  ) : (
                    <div>
                      <div className="h-12 w-12 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
                        <Filter className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-lg font-medium">
                        Tidak ada data audit tersedia saat ini
                      </p>
                      <p className="text-sm">Coba lagi beberapa waktu</p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              currentData.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold text-sm">
                          {item.user?.userName?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {item.user?.userName || "Unknown User"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-semibold text-gray-900">
                      {item.barang?.namaBarang || "Unknown Item"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-semibold text-gray-900">
                      {item.newValues || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-semibold text-gray-900">
                      {item.inputValues || 0}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border
                        ${
                          item.type === "Stock In"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : item.type === "Stock Out"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                        }`}
                    >
                      {item.type || "Unknown"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredData.length)} of {filteredData.length}{" "}
            results
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>

            <div className="flex items-center space-x-1">
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === "number" && goToPage(page)}
                  disabled={page === "..."}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : page === "..."
                      ? "text-gray-400 cursor-default"
                      : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
