"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQRCode } from "next-qrcode";
import { useEffect, useState } from "react";
import axosInstance from "@/lib/axios";
import {
  Package,
  AlertTriangle,
  Tag,
  Filter,
  Building2,
  Calendar,
  ArrowLeft,
  Plus,
  Minus,
  Download,
  FolderInput,
  Search,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import StockInModal from "@/components/core/StockInModal";
import StockOutModal from "@/components/core/StockOutModal";

export default function ProductDetailPage() {
  const { Canvas } = useQRCode();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const productId = params?.id;
  const [selectedBarangForStockIn, setSelectedBarangForStockIn] = useState<
    any | null
  >(null);
  const [isStockInModalOpen, setIsStockInModalOpen] = useState(false);
  const [isStockOutModalOpen, setIsStockOutModalOpen] = useState(false);
  const [selectedBarangForStockOut, setSelectedBarangForStockOut] = useState<
    any | null
  >(null);

  // State untuk pagination, search, dan filter
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("-");
  const [filteredStockHistory, setFilteredStockHistory] = useState<any[]>([]);

  // Fungsi untuk fetch data produk berdasarkan ID
  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axosInstance.get(`/api/v1/barang/${productId}`);
      setProduct(response.data.data);
      console.log("Product data:", response.data.data);
    } catch (err: any) {
      console.error("Error fetching product:", err);
      if (err.response?.status === 404) {
        setError("Produk tidak ditemukan");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Terjadi kesalahan saat memuat data produk");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductDetail();
    }
  }, [productId]);

  // Filter dan search stock history
  useEffect(() => {
    if (!product?.daftarStock) {
      setFilteredStockHistory([]);
      return;
    }

    let filtered = [...product.daftarStock];

    // Filter berdasarkan jenis transaksi
    if (typeFilter !== "-") {
      filtered = filtered.filter((stock) => stock.type === typeFilter);
    }

    // Filter berdasarkan pencarian
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (stock) =>
          stock.keterangan?.toLowerCase().includes(searchLower) ||
          stock.type?.toLowerCase().includes(searchLower) ||
          (stock.userId === product.createdBy?.id
            ? product.createdBy.name?.toLowerCase().includes(searchLower)
            : false)
      );
    }

    setFilteredStockHistory(filtered);
    setCurrentPage(1);
  }, [product, typeFilter, searchTerm]);

  // Helper function untuk format tanggal
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const handleStockIn = (barang: any) => {
    setSelectedBarangForStockIn(barang);
    setIsStockInModalOpen(true);
  };

  const handleStockInSubmit = async (data: any) => {
    await fetchProductDetail();
    toast.success("Stock berhasil ditambahkan!");
  };

  const handleStockOutSubmit = async (data: any) => {
    try {
      await fetchProductDetail();
      toast.success("berhasil stock out barang");
    } catch (error) {
      toast.error("Gagal mengurangi stock");
    }
  };

  const handleStockOut = (barang: any) => {
    setSelectedBarangForStockOut(barang);
    setIsStockOutModalOpen(true);
  };

  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  const currentItems = filteredStockHistory.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredStockHistory.length / perPage);

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

  // Loading state
  if (loading) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="mt-20 p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="">
              <div className="h-8 bg-gray-300 rounded w-48 mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-64 animate-pulse"></div>
            </div>
            <div className="h-10 w-32 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Skeleton Product Info */}
        <div className="bg-white border border-secondary rounded-lg mx-2 sm:mx-6 mb-6 p-6 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-300 rounded mx-auto mb-4"></div>
                <div className="h-3 bg-gray-300 rounded w-24 mx-auto"></div>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="h-6 bg-gray-300 rounded w-48"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mt-20 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600 font-semibold">{error}</p>
              <button
                onClick={() => window.history.back()}
                className="mt-4 text-blue-600 hover:underline flex items-center justify-center gap-2 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No product state
  if (!product) {
    return (
      <div className="mt-20 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="text-gray-600">Data produk tidak ditemukan</p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 text-blue-600 hover:underline flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  const hasStockHistory = product.daftarStock && product.daftarStock.length > 0;

  return (
    <>
      <Toaster position="top-right" />
      <div className="mt-20 p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary">Detail Produk</h1>
              <p className="text-gray-600 mt-1">
                Informasi lengkap produk dan riwayat stock
              </p>
            </div>
          </div>
          <div className="">
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-500 text-white rounded-md cursor-pointer hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-5 mb-6">
        <div className="bg-white rounded-lg shadow-md border p-5">
          <div className="flex justify-between">
            <div>
              <h3 className="text-text font-medium text-sm">Stock Awal</h3>
              <p className="text-text font-medium text-xl pt-2.5">
                {product.stockAwal || 0}
              </p>
            </div>
            <div className="bg-primary p-4 rounded-sm text-background">
              <Package className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border p-5">
          <div className="flex justify-between">
            <div>
              <h3 className="text-text font-medium text-sm">Stock Sekarang</h3>
              <p className="text-text font-medium text-xl pt-2.5">
                {product.totalStock || 0}
              </p>
            </div>
            <div className="bg-green-600 p-4 rounded-sm text-background">
              <Package className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border p-5">
          <div className="flex justify-between">
            <div>
              <h3 className="text-text font-medium text-sm">Terpakai</h3>
              <p className="text-text font-medium text-xl pt-2.5">
                {(product.stockAwal || 0) - (product.stockSekarang || 0)}
              </p>
            </div>
            <div className="bg-red-600 p-4 rounded-sm text-background">
              <AlertTriangle className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div> */}

      {/* Product Info Section */}
      <div className="bg-white border border-secondary rounded-lg mx-2 sm:mx-6 mb-6 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Informasi Detail Barang
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* QR Code Section */}
          <div className="lg:col-span-1">
            <div className="text-center">
              <div className="inline-block border border-gray-200 p-4 rounded-lg mb-4 bg-gray-50">
                <p className="text-sm text-gray-600 mb-2 font-medium">
                  Kode QR
                </p>
                <div className="w-32 h-32 mx-auto">
                  {product.kodeQr && (
                    <Canvas
                      text={product.kodeQr}
                      options={{
                        margin: 2,
                        scale: 6,
                        width: 120,
                        color: {
                          dark: "#1e293b",
                          light: "#f1f5f9",
                        },
                      }}
                    />
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 break-all">
                {product.kodeQr || "N/A"}
              </p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {product.namaBarang || "N/A"}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        product.status === "active"
                          ? "bg-green-500 text-green-100 border border-green-800"
                          : product.status === "un-active"
                          ? "bg-red-700 text-red-100 border border-red-800"
                          : "bg-gray-800/50 text-gray-300 border border-gray-700"
                      }`}
                    >
                      {product.status === "active"
                        ? "Aktif"
                        : product.status === "un-active"
                        ? "Non-aktif"
                        : product.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Kode Group:</span>
                      <span className="font-medium">
                        {product.kodeGrp || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Kategori:</span>
                      <span className="font-medium">
                        {product.kategori?.kategori || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Divisi:</span>
                      <span className="font-medium">
                        {product.divisi?.divisi || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Tanggal Produksi:</span>
                      <span className="font-medium">
                        {formatDate(product.productionDate)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Line Divisi:</span>
                      <span className="font-medium">
                        {product.lineDivisi?.divisi || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section with Created By and Total Stock */}
              <div className="border-t pt-6">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                  {/* Created By Info */}
                  {product.createdBy && (
                    <div className="flex-1">
                      <div className="text-sm">
                        <p className="text-gray-600 mb-3 font-medium">
                          Dibuat oleh:
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                          <div className="text-gray-900">
                            <p className="font-semibold text-base mb-1">
                              {product.createdBy.name || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                              {product.createdBy.jabatan?.name || "N/A"} -{" "}
                              {product.createdBy.divisi?.divisi || "N/A"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {product.createdBy.email || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Total Stock */}
                  <div className="sm:ml-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 px-6 py-4 rounded-xl text-center min-w-[160px]">
                      <p className="text-sm text-blue-600 mb-2 font-medium uppercase tracking-wide">
                        Total Stock
                      </p>
                      <p className="text-3xl font-bold text-blue-700">
                        {product.totalStock || 0}
                      </p>
                      <p className="text-xs text-blue-500 mt-1">Unit</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section untuk Stock History */}
      {hasStockHistory && (
        <div className="bg-white mx-2 sm:mx-6 my-6 border border-secondary rounded-lg px-3 sm:px-6 py-3 flex flex-col sm:flex-row items-stretch sm:items-center flex-wrap gap-4 sm:gap-6 shadow-md">
          <div className="lg:flex lg:items-center grid gap-3">
            <h1 className="text-sm font-medium text-text">Filter:</h1>
            <select
              name="type-filter"
              id="type-filter"
              value={typeFilter}
              onChange={handleTypeFilterChange}
              className="border border-secondary px-3 sm:px-4 py-2 rounded-sm text-text font-medium text-sm"
            >
              <option value="-">Semua Transaksi</option>
              <option value="Stock In">Stock In</option>
              <option value="Stock Out">Stock Out</option>
            </select>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <input
              type="search"
              name="search"
              id="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Cari keterangan atau pengguna..."
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
      )}

      {/* Stock History Table Section */}
      <div className="bg-white border border-secondary rounded-lg mx-2 sm:mx-6 mb-6">
        <div className="flex justify-between items-center mx-4 sm:mx-6 py-6">
          <h2 className="font-medium text-text text-2xl">Riwayat Stock</h2>
          {hasStockHistory && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleStockIn(product)}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Stock In
              </button>
              <button
                onClick={() => handleStockOut(product)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Minus className="w-4 h-4" />
                Stock Out
              </button>
              <div className="bg-secondary text-white p-2 rounded-sm cursor-pointer">
                <Download className="w-5 h-5" />
              </div>
              <div className="bg-secondary text-white p-2 rounded-sm cursor-pointer">
                <FolderInput className="w-5 h-5" />
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-text/15">
              <tr>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  NO
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  PENGGUNA
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  TANGGAL
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  JENIS TRANSAKSI
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  JUMLAH
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  KODE QR
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  KETERANGAN
                </th>
              </tr>
            </thead>
            <tbody>
              {!hasStockHistory ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 sm:px-6 py-8 text-center text-text"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Belum ada riwayat stock
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Data pergerakan stock akan tampil di sini
                      </p>
                      <button
                        onClick={() => handleStockIn(product)}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Tambah Stock Pertama
                      </button>
                    </div>
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 sm:px-6 py-8 text-center text-text"
                  >
                    Tidak ada data yang sesuai dengan filter
                  </td>
                </tr>
              ) : (
                currentItems.map((stock: any, index: number) => {
                  const userName =
                    stock.userId === product.createdBy?.id
                      ? product.createdBy.name
                      : "Unknown";

                  return (
                    <tr
                      key={index}
                      className="bg-background text-sm font-medium text-text text-center border-y border-secondary hover:bg-gray-50"
                    >
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {userName}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {formatDate(stock.productionDate)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            stock.type === "Stock In"
                              ? "bg-green-500 text-green-100 border border-green-800"
                              : stock.type === "Stock Out"
                              ? "bg-red-700 text-red-100 border border-red-800"
                              : "bg-gray-800/50 text-gray-300 border border-gray-700"
                          }`}
                        >
                          {stock.type}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={
                            stock.type === "Stock Out"
                              ? "text-red-600"
                              : "text-green-600"
                          }
                        >
                          {stock.type === "Stock Out" ? "-" : "+"}
                          {stock.stock}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap ml-2">
                        <Canvas
                          text={stock.kodeQr}
                          options={{
                            errorCorrectionLevel: "M",
                            margin: 3,
                            scale: 4,
                            width: 100,
                          }}
                        />{" "}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {stock.keterangan || "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-4 gap-3">
          <div>
            <h3 className="text-sm sm:text-base">
              Menampilkan {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filteredStockHistory.length)} dari{" "}
              {filteredStockHistory.length} riwayat
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
                    ? "bg-primary text-background glow-box"
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

      {/* Stock In Modal */}
      <StockInModal
        isOpen={isStockInModalOpen}
        onClose={() => {
          setIsStockInModalOpen(false);
          setSelectedBarangForStockIn(null);
        }}
        onSubmit={handleStockInSubmit}
        barangData={selectedBarangForStockIn}
      />

      {/* Stock Out Modal */}
      <StockOutModal
        isOpen={isStockOutModalOpen}
        onClose={() => {
          setIsStockOutModalOpen(false);
          setSelectedBarangForStockOut(null);
        }}
        onSubmit={handleStockOutSubmit}
        barangData={selectedBarangForStockOut}
      />
    </>
  );
}
