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
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import { notFound } from "next/navigation";
export const revalidate = 30;

// Type definition berdasarkan struktur data Anda
interface Barang {
  id: number;
  namaBarang: string;
  kodeQr: string;
  kodeGrp: string;
  productionDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  kategori: {
    id: number;
    kategori: string;
    status: string;
  };
  divisi: {
    id: number;
    divisi: string;
    status: string;
  };
  createdBy: {
    id: number;
    name: string;
    email: string;
  };
}

export async function generateStaticParams(): Promise<{ id: string }[]> {
  try {
    const response = await axiosInstance.get("/api/v1/barang");
    const products: Barang[] = response.data.data;

    return products.map((product) => ({ id: product.id.toString() }));
  } catch (error) {
    return [];
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await axiosInstance.get(`/api/v1/barang/${id}`);

  if (res.status === 404) {
    notFound();
  }

  const product: Barang = res.data.data;

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
        return "bg-green-100 text-green-800 border-green-200";
      case "un-active":
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
      case "un-active":
        return "Non-aktif";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <QrCode className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Detail Produk
              </h1>
              <p className="text-gray-600">
                Informasi lengkap produk dari QR scan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Info Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 uppercase">
                    {product.namaBarang}
                  </h2>
                  <p className="text-gray-600 mt-1">Kode: {product.kodeGrp}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                    product.status
                  )}`}
                >
                  {getStatusText(product.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Tag className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Kategori</p>
                      <p className="font-semibold text-gray-900">
                        {product.kategori.kategori}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Building2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Divisi</p>
                      <p className="font-semibold text-gray-900">
                        {product.divisi.divisi}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Hash className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Kode Group</p>
                      <p className="font-semibold text-gray-900">
                        {product.kodeGrp}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tanggal Produksi</p>
                      <p className="font-semibold text-gray-900">
                        {formatProductionDate(product.productionDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Informasi Tambahan
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Dibuat Oleh</p>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">
                        {product.createdBy.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {product.createdBy.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tanggal Dibuat</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {formatDate(product.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Terakhir Diperbarui
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {formatDate(product.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - QR Code & Quick Info */}
          <div className="space-y-6">
            {/* Quick Stats Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Status Kategori & Divisi
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">
                    Status Kategori
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                      product.kategori.status
                    )}`}
                  >
                    {getStatusText(product.kategori.status)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">
                    Status Divisi
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                      product.divisi.status
                    )}`}
                  >
                    {getStatusText(product.divisi.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Production Date Highlight */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
              <div className="text-center">
                <div className="bg-blue-600 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-white mx-auto" />
                </div>
                <h3 className="text-lg font-bold text-blue-900 mb-1">
                  Tanggal Produksi
                </h3>
                <p className="text-2xl font-bold text-blue-800">
                  {formatProductionDate(product.productionDate)}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Diproduksi{" "}
                  {Math.floor(
                    (new Date().getTime() -
                      new Date(product.productionDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  hari yang lalu
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
