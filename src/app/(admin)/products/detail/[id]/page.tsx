"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQRCode } from "next-qrcode";
import { useProductDetail } from "@/hooks/useProductDetail";

export default function ProductDetailPage() {
  const { params } = useParams();
  const id = params?.id as any;
  const { Canvas } = useQRCode();

  const { product, isError, isLoading } = useProductDetail(id);

  console.log("Product ID:", id);

  // const { product, isLoading, isError } = useProductDetail(id as string);

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (!product)
    return <p className="text-center mt-10">Product tidak ditemukan</p>;
  if (isError)
    return <p className="text-center text-red-500">Gagal memuat data</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">Detail Produk</h1>
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 hover:underline font-semibold"
        >
          ← Kembali
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="text-center">
          {/* QR Code */}
          <div className="inline-block border border-gray-200 p-4 rounded-lg mb-4">
            {/* Ganti Canvas ini dengan komponen QR dari app kamu */}
            <p className="text-sm text-gray-500 mb-2">Kode QR</p>
            <div className="w-32 h-32 mx-auto">
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
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500 mb-1">Nama Barang</p>
            <p className="text-lg font-medium text-gray-900">
              {product.namaBarang}
            </p>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Line Divisi</p>
            <p className="text-lg font-medium text-gray-900">
              {product.lineDivisi}
            </p>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Tanggal Produksi</p>
            <p className="text-lg font-medium text-gray-900">
              {product.productionDate}
            </p>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Stock Awal</p>
            <p className="text-lg font-medium text-gray-900">
              {product.stockAwal}
            </p>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Stock Sekarang</p>
            <p className="text-lg font-medium text-gray-900">
              {product.stockSekarang ?? "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-right">
        <Link
          href={`/products/edit/${product.id}`}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
        >
          Edit Produk
        </Link>
      </div>
    </div>
  );
}
