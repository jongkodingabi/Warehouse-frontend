"use client";

import React, { useEffect, useState } from "react";
import {
  Package,
  Calendar,
  Tag,
  Building2,
  Hash,
  Activity,
  Clock,
  User,
  QrCode,
  Package2,
  TrendingUp,
  TrendingDown,
  Info,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useQRCode } from "next-qrcode";
import axiosInstance from "@/lib/axios";

// Type definition berdasarkan struktur data yang baru
interface StockDetail {
  id: number;
  barang: {
    id: number;
    kodeGrp: string;
    kategoriId: number;
    status: string;
    stockAwal: number;
    stockSekarang: number;
    kodeQr: string;
    lineDivisi: number;
    productionDate: string;
    createdBy: number;
    mainProduk: number;
  };
  stock: number;
  keterangan: string;
  kodeQr: string;
  productionDate: string;
  type: string;
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

export default function ProductDetailPage() {
  const [product, setProduct] = useState<StockDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;
  const { Canvas } = useQRCode();

  // Fungsi untuk fetch data produk berdasarkan ID
  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/api/v1/barang/${productId}/stock`
      );
      setProduct(response.data.data);
    } catch (err: any) {
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

  // Format tanggal
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format production date
  const formatProductionDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "aktif":
        return "bg-green-100 text-green-800 border-green-200";
      case "un-active":
      case "non-aktif":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Aktif";
      case "aktif":
        return "Aktif";
      case "un-active":
        return "Non-aktif";
      case "non-aktif":
        return "Non-aktif";
      default:
        return status;
    }
  };

  // Get transaction type color
  const getTransactionTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "stock in":
        return "bg-green-100 text-green-800 border-green-200";
      case "stock out":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  // Get transaction type icon
  const getTransactionTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "stock in":
        return <TrendingUp className="w-4 h-4" />;
      case "stock out":
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat detail produk...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <Package className="w-8 h-8 text-red-600 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Produk Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "Produk yang Anda cari tidak tersedia."}
          </p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <QrCode className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Detail Stock Barang
              </h1>
              <p className="text-gray-600">
                Informasi lengkap stock dan transaksi dari QR scan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Info Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 uppercase">
                    Kode Group: {product.barang.kodeGrp}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    ID Barang: #{product.barang.id}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                    product.barang.status
                  )}`}
                >
                  {getStatusText(product.barang.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Package2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Stock Awal</p>
                      <p className="font-semibold text-gray-900">
                        {product.barang.stockAwal} unit
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Package className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Stock Sekarang</p>
                      <p className="font-semibold text-gray-900">
                        {product.barang.stockSekarang} unit
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Building2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Line Divisi</p>
                      <p className="font-semibold text-gray-900">
                        Line {product.barang.lineDivisi}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tanggal Produksi</p>
                      <p className="font-semibold text-gray-900">
                        {formatProductionDate(product.barang.productionDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-100 p-2 rounded-lg">
                      <Hash className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Main Produk ID</p>
                      <p className="font-semibold text-gray-900">
                        #{product.barang.mainProduk}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <Tag className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Kategori ID</p>
                      <p className="font-semibold text-gray-900">
                        #{product.barang.kategoriId}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Info Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Informasi Transaksi
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        getTransactionTypeColor(product.type)
                          .replace("text-", "text-")
                          .replace("border-", "")
                          .replace("bg-", "bg-")
                          .split(" ")[0]
                      }`}
                    >
                      {getTransactionTypeIcon(product.type)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tipe Transaksi</p>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold border ${getTransactionTypeColor(
                          product.type
                        )}`}
                      >
                        {product.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Jumlah Stock</p>
                      <p className="font-semibold text-gray-900">
                        {product.stock} unit
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <Info className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Keterangan</p>
                      <p className="font-semibold text-gray-900">
                        {product.keterangan}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tanggal Transaksi</p>
                      <p className="font-semibold text-gray-900">
                        {formatProductionDate(product.productionDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User & Division Info Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Informasi Pengguna & Divisi
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Dibuat Oleh</p>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">
                        {product.user.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {product.user.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Jabatan</p>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">
                        {product.user.jabatan.name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Divisi</p>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">
                        {product.user.divisi.divisi}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Kode: {product.user.divisi.kodedivisi}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status Divisi</p>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        product.user.divisi.status
                      )}`}
                    >
                      {getStatusText(product.user.divisi.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - QR Code & Quick Info */}
          <div className="space-y-6">
            {/* QR Code Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                QR Code
              </h3>
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                  <Canvas
                    text={product.productionDate}
                    options={{
                      errorCorrectionLevel: "M",
                      margin: 3,
                      scale: 4,
                      width: 100,
                    }}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center break-all">
                {product.kodeQr}
              </p>
            </div>

            {/* Stock Overview Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Overview Stock
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">
                    Stock Awal
                  </span>
                  <span className="font-bold text-blue-600">
                    {product.barang.stockAwal} unit
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">
                    Stock Saat Ini
                  </span>
                  <span className="font-bold text-green-600">
                    {product.barang.stockSekarang} unit
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">
                    Selisih
                  </span>
                  <span
                    className={`font-bold ${
                      product.barang.stockSekarang - product.barang.stockAwal >=
                      0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.barang.stockSekarang - product.barang.stockAwal >=
                    0
                      ? "+"
                      : ""}
                    {product.barang.stockSekarang - product.barang.stockAwal}{" "}
                    unit
                  </span>
                </div>
              </div>
            </div>

            {/* Transaction Type Highlight */}
            <div
              className={`rounded-xl border p-6 ${getTransactionTypeColor(
                product.type
              )
                .replace("text-", "from-")
                .replace("border-", "to-")
                .replace("bg-", "bg-gradient-to-br from-")
                .replace(" text-", "-50 to-")
                .replace("-800", "-100")}`}
            >
              <div className="text-center">
                <div
                  className={`rounded-full p-3 w-12 h-12 mx-auto mb-3 ${
                    getTransactionTypeColor(product.type).includes("green")
                      ? "bg-green-600"
                      : getTransactionTypeColor(product.type).includes("red")
                      ? "bg-red-600"
                      : "bg-blue-600"
                  }`}
                >
                  <div className="text-white flex items-center justify-center">
                    {getTransactionTypeIcon(product.type)}
                  </div>
                </div>
                <h3
                  className={`text-lg font-bold mb-1 ${
                    getTransactionTypeColor(product.type).includes("green")
                      ? "text-green-900"
                      : getTransactionTypeColor(product.type).includes("red")
                      ? "text-red-900"
                      : "text-blue-900"
                  }`}
                >
                  {product.type}
                </h3>
                <p className="text-lg font-bold text-gray-800">
                  {product.stock} unit
                </p>
                <p
                  className={`text-sm mt-1 ${
                    getTransactionTypeColor(product.type).includes("green")
                      ? "text-green-600"
                      : getTransactionTypeColor(product.type).includes("red")
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                >
                  {product.keterangan}
                </p>
              </div>
            </div>

            {/* Production Date Highlight */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 p-6">
              <div className="text-center">
                <div className="bg-orange-600 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-white mx-auto" />
                </div>
                <h3 className="text-lg font-bold text-orange-900 mb-1">
                  Tanggal Produksi
                </h3>
                <p className="text-xl font-bold text-orange-800">
                  {formatProductionDate(product.barang.productionDate)}
                </p>
                <p className="text-sm text-orange-600 mt-1">
                  Diproduksi{" "}
                  {Math.floor(
                    (new Date().getTime() -
                      new Date(product.barang.productionDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  hari yang lalu
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => router.back()}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            Kembali
          </button>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            Print Detail
          </button>
        </div>
      </div>
    </div>
  );
}
