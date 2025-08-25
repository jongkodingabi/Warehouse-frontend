"use client";

import {
  FileText,
  Activity,
  TrendingUp,
  Search,
  Eye,
  Download,
  FolderInput,
  User,
  Package,
  SquarePen,
} from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "@/context/UserContext";
import DetailAuditModal from "@/components/core/DetailModalAudit";
import StockInAuditModal from "@/components/core/EditAuditLogStockIn";
import StockOutAuditModal from "@/components/core/EditAuditLogStockOut";

// Type definitions untuk audit log
interface AuditLog {
  id: number;
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

interface AuditLogResponse {
  data: AuditLog[];
}

export default function AuditLogPage() {
  const [datas, setData] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState("-");
  const [userFilter, setUserFilter] = useState("-");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5); // Menampilkan 5 data per halaman
  const [filteredData, setFilteredData] = useState<AuditLog[]>([]);
  const [showAudit, setShowAudit] = useState();
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedAuditForEdit, setSelectedAuditForEdit] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeModal, setActiveModal] = useState<any>();
  const { user } = useUser();

  // Hitung statistik berdasarkan data yang sudah difilter
  const totalAuditLog = datas.length;
  const stockInCount = datas.filter((log) => log.type === "Stock In").length;
  const stockOutCount = datas.filter((log) => log.type === "Stock Out").length;
  const stockInPercentage = totalAuditLog
    ? ((stockInCount / totalAuditLog) * 100).toFixed(2)
    : 0;

  // Mendapatkan daftar tipe unik untuk dropdown filter
  const uniqueTypes = Array.from(new Set(datas.map((log) => log.type))).filter(
    Boolean
  );

  // Mendapatkan daftar user unik untuk dropdown filter
  const uniqueUsers = Array.from(
    new Set(datas.map((log) => log.user.userName))
  ).filter(Boolean);

  const handleShowAudit = async (data: any) => {
    setShowAudit(data);
    setDetailModalOpen(true);
  };

  const handleEditAudit = async (auditData: any) => {
    try {
      // Fetch data barang
      const response = await axiosInstance.get(
        `/api/v1/barang/${auditData.barang.idBarang}`
      );

      // Set data untuk edit
      setSelectedAuditForEdit({
        auditData: auditData,
        barangData: response.data.data,
      });
      setIsEditMode(true);

      // Kondisi sederhana berdasarkan tipe
      switch (auditData.type) {
        case "Stock In":
          setActiveModal("stock-in");
          break;
        case "Stock Out":
          setActiveModal("stock-out");
          break;
        default:
          toast.error(`Tipe audit "${auditData.type}" tidak dapat diedit`);
          return;
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal memuat data barang");
    }
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedAuditForEdit(null);
    setIsEditMode(false);
  };

  const handleSubmitAudit = async (data: any) => {
    try {
      await fetchAuditLog(); // Refresh data

      const auditType = selectedAuditForEdit?.auditData?.type;
      const message = isEditMode
        ? `Data audit ${auditType} berhasil diupdate!`
        : `${
            auditType === "Stock In"
              ? "Stock berhasil ditambahkan!"
              : "Stock berhasil dikurangi!"
          }`;

      toast.success(message);
      handleCloseModal();
    } catch (error) {
      toast.error("Operasi gagal");
    }
  };

  const fetchAuditLog = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get<AuditLogResponse>(
        "/api/v1/auditlog"
      );
      setData(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data audit log");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLog();
  }, []);

  // Filter dan search data
  useEffect(() => {
    let filtered = datas;

    // Filter berdasarkan tipe
    if (typeFilter !== "-") {
      filtered = filtered.filter((data) => data.type === typeFilter);
    }

    // Filter berdasarkan user
    if (userFilter !== "-") {
      filtered = filtered.filter((data) => data.user.userName === userFilter);
    }

    // Filter berdasarkan pencarian
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (data) =>
          data.user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.barang.namaBarang
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          data.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset ke halaman pertama saat filter berubah
  }, [typeFilter, userFilter, searchTerm, datas]);

  // Handle perubahan filter tipe
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value);
  };

  // Handle perubahan filter user
  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserFilter(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle perubahan halaman
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Pagination
  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / perPage);

  // Generate page numbers untuk pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="mt-20 p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="">
            <h1 className="text-3xl font-bold text-primary">Audit Log</h1>
            <p className="mt-4 text-gray-800">
              Kelola dan pantau aktivitas audit log sistem.
            </p>
          </div>
        </div>
      </div>

      {/* Card Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-5">
        {isLoading ? (
          // Skeleton Cards
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`card-skeleton-${index}`}
              className="bg-white rounded-lg shadow-md border p-5 animate-pulse"
            >
              <div className="flex justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-24 mb-3"></div>
                  <div className="h-6 bg-gray-300 rounded w-12"></div>
                </div>
                <div className="bg-gray-300 p-4 rounded-sm w-16 h-16"></div>
              </div>
            </div>
          ))
        ) : (
          <>
            {/* Card 1 - Total Audit Log */}
            <div className="bg-white rounded-lg shadow-md border p-5">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-text font-medium text-sm">
                    Total Audit Log
                  </h3>
                  <p className="text-text font-medium text-xl pt-2.5">
                    {totalAuditLog}
                  </p>
                </div>
                <div className="bg-primary p-4 rounded-sm text-background">
                  <FileText className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Card 2 - Stock In */}
            <div className="bg-white rounded-lg shadow-md border p-5">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-text font-medium text-sm">Stock In</h3>
                  <p className="text-text font-medium text-xl pt-2.5">
                    {stockInCount}
                  </p>
                </div>
                <div className="bg-green-600 p-4 rounded-sm text-white">
                  <TrendingUp className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Card 3 - Stock Out */}
            <div className="bg-white rounded-lg shadow-md border p-5">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-text font-medium text-sm">Stock Out</h3>
                  <p className="text-text font-medium text-xl pt-2.5">
                    {stockOutCount}
                  </p>
                </div>
                <div className="bg-red-600 p-4 rounded-sm text-white">
                  <Activity className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Card 4 - Persentase Stock In */}
            <div className="bg-white rounded-lg shadow-md border p-5">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-text font-medium text-sm">
                    Persentase Stock In
                  </h3>
                  <p className="text-text font-medium text-xl pt-2.5">
                    {stockInPercentage}%
                  </p>
                </div>
                <div className="bg-primary p-4 rounded-sm text-background">
                  <TrendingUp className="w-8 h-8" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Filter Section */}
      <div className="bg-white mx-2 sm:mx-6 my-6 sm:my-9 border border-secondary rounded-lg px-3 sm:px-6 py-3 flex flex-col sm:flex-row items-stretch sm:items-center flex-wrap gap-4 sm:gap-6 shadow-md">
        <div className="lg:flex lg:items-center grid gap-3">
          <h1 className="text-sm font-medium text-text">Filter:</h1>

          {/* Filter Tipe */}
          <select
            name="type-filter"
            id="type-filter"
            value={typeFilter}
            onChange={handleTypeChange}
            className="border border-secondary px-3 sm:px-4 py-2 rounded-sm text-text font-medium text-sm"
          >
            <option value="-">Semua Tipe</option>
            {uniqueTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Filter User */}
          <select
            name="user-filter"
            id="user-filter"
            value={userFilter}
            onChange={handleUserChange}
            className="border border-secondary px-3 sm:px-4 py-2 rounded-sm text-text font-medium text-sm"
          >
            <option value="-">Semua User</option>
            {uniqueUsers.map((userName, index) => (
              <option key={index} value={userName}>
                {userName}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <input
            type="search"
            name="search"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Cari user, barang, atau tipe aktivitas..."
            className="border border-secondary px-3 sm:px-4 py-2 rounded-sm font-medium text-sm flex-1"
          />
          <button
            type="button"
            className="bg-primary/90 hover:bg-primary transition-colors duration-200 cursor-pointer ease-in-out p-2 rounded-sm text-white"
          >
            <Search className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-secondary rounded-lg mx-2 sm:mx-6 mb-6">
        <div className="flex justify-between items-center mx-4 sm:mx-6 py-6">
          <h2 className="font-medium text-text text-2xl">Data Audit Log</h2>
          <div className="flex items-center gap-3">
            <div className="bg-secondary text-white p-2 rounded-sm">
              <Download />
            </div>
            <div className="bg-secondary text-white p-2 rounded-sm">
              <FolderInput />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-text/15">
              <tr>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  ID
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  USER
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  NAMA BARANG
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  TIPE AKTIVITAS
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  AKSI
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: perPage }).map((_, index) => (
                  <tr
                    key={`skeleton-${index}`}
                    className="bg-background border-y border-secondary animate-pulse"
                  >
                    {/* ID Skeleton */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded-md w-12 mx-auto"></div>
                    </td>
                    {/* User Skeleton */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded-md w-20 mx-auto"></div>
                    </td>
                    {/* Barang Skeleton */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded-md w-24 mx-auto"></div>
                    </td>
                    {/* Tipe Skeleton */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="h-6 bg-gray-300 rounded-full w-20 mx-auto"></div>
                    </td>
                    {/* Aksi Skeleton */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex gap-2.5 justify-center">
                        <div className="h-6 w-6 bg-gray-300 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 sm:px-6 py-8 text-center text-text"
                  >
                    {filteredData.length === 0 && datas.length > 0
                      ? "Tidak ada data yang sesuai dengan filter"
                      : "Tidak ada data audit log"}
                  </td>
                </tr>
              ) : (
                currentItems.map((data, idx) => (
                  <tr
                    key={data.id || idx}
                    className="bg-background text-sm font-medium text-text text-center border-y border-secondary"
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {data.id}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        {data.user.userName}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 uppercase whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <Package className="w-4 h-4 text-gray-500" />
                        {data.barang.namaBarang}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                              ${
                                data.type === "Stock In"
                                  ? "bg-green-500 text-green-100 border border-green-800"
                                  : data.type === "Stock Out"
                                  ? "bg-red-700 text-red-100 border border-red-800"
                                  : "bg-gray-800/50 text-gray-300 border border-gray-700"
                              }`}
                      >
                        {data.type}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex gap-2.5 justify-center">
                        <button
                          onClick={() => handleShowAudit(data)}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Edit"
                        >
                          <Eye />
                        </button>
                        <button
                          onClick={() => handleEditAudit(data)}
                          className={`transition-colors ${
                            data.type === "Stock In"
                              ? "text-green-600 hover:text-green-800"
                              : data.type === "Stock Out"
                              ? "text-red-600 hover:text-red-800"
                              : "text-gray-400 cursor-not-allowed"
                          }`}
                          title={`Edit ${data.type}`}
                          disabled={
                            !["Stock In", "Stock Out"].includes(data.type)
                          }
                        >
                          <SquarePen className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-4 gap-3">
          <div>
            <h3 className="text-sm sm:text-base">
              Menampilkan {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filteredData.length)} dari{" "}
              {filteredData.length} audit log
            </h3>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 sm:px-4 py-2 border border-secondary rounded-sm font-medium text-sm ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-secondary hover:bg-gray-50"
              }`}
            >
              Previous
            </button>

            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 sm:px-4 py-2 rounded-sm font-medium text-sm ${
                  currentPage === pageNum
                    ? "bg-text text-background glow-box"
                    : "border border-secondary text-text hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 sm:px-4 py-2 border border-secondary rounded-sm font-medium text-sm ${
                currentPage === totalPages || totalPages === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-secondary hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Detail Audit Modal */}
      {detailModalOpen && showAudit && (
        <DetailAuditModal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          auditLog={showAudit as any}
        />
      )}

      {/* Edit Audit Modal */}
      {activeModal === "stock-in" && (
        <StockInAuditModal
          isOpen={true}
          onClose={handleCloseModal}
          onSubmit={handleSubmitAudit}
          barangData={selectedAuditForEdit?.barangData || null}
          auditData={selectedAuditForEdit?.auditData || null}
          isEditMode={isEditMode}
        />
      )}

      {/* Stock Out Modal */}
      {activeModal === "stock-out" && (
        <StockOutAuditModal
          isOpen={true}
          onClose={handleCloseModal}
          onSubmit={handleSubmitAudit}
          barangData={selectedAuditForEdit?.barangData || null}
          auditData={selectedAuditForEdit?.auditData || null}
          isEditMode={isEditMode}
        />
      )}
    </>
  );
}
