"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trash,
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";
import DeleteConfirmationModal from "@/components/core/Delete.Modal";
import api from "@/lib/axios";

interface AuditLogItem {
  id: number;
  message: string;
  activitas: string;
  deskripsi: string;
  user: {
    id: number;
    name: string;
    email: string;
    jabatan: {
      id: number;
      name: string;
    };
    divisi: {
      id: number;
      kodedivisi: string;
      divisi: string;
      short: number;
      status: string;
    };
  };
}

interface ApiResponse {
  data: AuditLogItem[];
}
interface UserInfo {
  name: string;
  role: string;
  avatar: string;
}

const AuditLogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [auditData, setAuditData] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filteredData, setFilteredData] = useState<AuditLogItem[]>([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [activityIdToDelete, setActivityIdToDelete] =
    useState<AuditLogItem | null>();
  const itemsPerPage = 10;

  // Fetch data from API
  const fetchAuditData = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<ApiResponse>(
        "/api/v1/activitylog"
      );
      const result = response.data;

      if (result.data && result.data.length > 0) {
        setAuditData(result.data);
        setFilteredData(result.data);
        setTotalPages(Math.ceil(result.data.length / itemsPerPage));
      }
    } catch (error) {
      console.error("Error fetching audit data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleIdActivityToDelete = async (activity: AuditLogItem) => {
    setActivityIdToDelete(activity);
    setDeleteModal(true);
  };

  const handleDeleteActivity = async (id: number) => {
    try {
      await api.delete(`/api/v1/activitylog/${id}`);
      toast.success("Berhasil menghapus aktifitas");
      fetchAuditData();
      setDeleteModal(false);
    } catch (error) {
      toast.error("Gagal menghapus aktivitas");
      console.error(error);
    }
  };

  // Filter data based on search term
  const filterData = (): void => {
    if (!searchTerm.trim()) {
      setFilteredData(auditData);
      setTotalPages(Math.ceil(auditData.length / itemsPerPage));
    } else {
      const filtered = auditData.filter(
        (item) =>
          item.activitas.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
      setCurrentPage(1); // Reset to first page when searching
    }
  };

  // Get paginated data
  const getPaginatedData = (): AuditLogItem[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/,/g, "")
      .toUpperCase();
  };

  // Get activity color based on activity type
  const getActivityColor = (activity: string): string => {
    if (
      activity.toLowerCase().includes("tambah") ||
      activity.toLowerCase().includes("nambah")
    ) {
      return "text-green-600";
    } else if (
      activity.toLowerCase().includes("edit") ||
      activity.toLowerCase().includes("update")
    ) {
      return "text-blue-600";
    } else if (
      activity.toLowerCase().includes("hapus") ||
      activity.toLowerCase().includes("delete")
    ) {
      return "text-red-600";
    } else {
      return "text-purple-600";
    }
  };

  // Generate pagination numbers
  const getPaginationNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 9;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logic for showing page numbers with ellipsis
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  // Handle page change
  const handlePageChange = (page: number | string): void => {
    if (typeof page === "number" && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Effects
  useEffect(() => {
    fetchAuditData();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchTerm, auditData]);

  const paginatedData = getPaginatedData();
  const paginationNumbers = getPaginationNumbers();

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-6 bg-slate-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="mt-20 p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="">
              <h1 className="text-3xl font-bold text-primary">Log Aktivitas</h1>
              <p className="mt-4 text-gray-800">
                Monitoring dan kelola aktivitas gudang anda
              </p>
            </div>
          </div>
        </div>

        {/* Header with Search and Date Range */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari Aktifitas"
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Date Range and Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Reset
              </button>
              <button
                onClick={fetchAuditData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Activity List */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-slate-600">
                Memuat data aktifitas...
              </span>
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-slate-500 mb-2">
                  Belum ada data aktivitas yang tercatat
                </p>
                {searchTerm && (
                  <p className="text-sm text-slate-400">
                    Try adjusting your search terms
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {paginatedData.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="p-6 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="h-14 w-14 mt-3 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold text-2xl">
                          {item.user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {/* User Info */}
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-slate-900">
                                {item.user.name}
                              </span>
                              <span className="text-sm text-slate-500">
                                {item.user.jabatan.name}
                              </span>
                            </div>

                            {/* Activity */}
                            <div className="mb-2">
                              <span
                                className={`font-medium ${getActivityColor(
                                  item.activitas
                                )}`}
                              >
                                {item.activitas}
                              </span>
                            </div>

                            {/* Description */}
                            <p className="text-slate-600 text-sm mb-3">
                              {item.deskripsi}
                            </p>

                            {/* Categories (generated based on activity type) */}
                            <div className="flex flex-wrap gap-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {item.user.divisi.divisi}
                              </span>
                            </div>
                          </div>

                          {/* Timestamp and Actions */}
                          <div className="flex items-start gap-3 ml-4">
                            {/* <div className="text-sm text-slate-500 text-right">
                            {formatDate(item.created_at)}
                          </div> */}

                            {/* Action Buttons */}
                            <div className="flex items-center mt-10 gap-1 bg-red-100 rounded-full group group-hover:bg-red-50">
                              <button
                                onClick={() => handleIdActivityToDelete(item)}
                                className="p-4 text-slate-400 hover:text-slate-600 rounded"
                              >
                                <Trash className="w-5 h-5 text-red-600 group-hover:text-red-500 cursor-pointer" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {paginationNumbers.map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="px-2 text-slate-400">...</span>
                ) : (
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Results Info */}
        {!loading && (
          <div className="text-center mt-4 text-sm text-slate-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length} results
            {searchTerm && ` for "${searchTerm}"`}
          </div>
        )}
      </div>

      {deleteModal && activityIdToDelete && (
        <DeleteConfirmationModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          itemName={activityIdToDelete.activitas}
          onConfirm={() => handleDeleteActivity(activityIdToDelete.id)}
        />
      )}
    </>
  );
};

export default AuditLogPage;
