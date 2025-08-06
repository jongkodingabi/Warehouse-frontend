"use client";

import { useProducts } from "@/hooks/useProducts";
import Link from "next/link";
import { Product } from "@/utils/types"; // Adjust the import path as necessary
import { useQRCode } from "next-qrcode";
// import { useEffect, useState } from "react";
// import { Product } from "@/types/products";
// import Image from "next/image";
export default function ProductNewPage() {
  const { products, isLoading, isError } = useProducts();
  console.log("Products:", products);
  const { Canvas } = useQRCode();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading products</div>;

  //   const [products, setProducts] = useState<Product[]>([]);

  //   const fetchProducts = async () => {
  //     try {
  //       const response = await fetch(
  //         `${
  //           process.env.NEXT_PUBLIC_API_URL + "/api/barang" ||
  //           "https://fakestoreapi.com/products"
  //         }`
  //       );
  //       const data = await response.json();
  //       setProducts(data);
  //     } catch (error) {
  //       console.error("Error fetching products:", error);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchProducts();
  //   }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">
          Daftar Produk Baru
        </h1>
        <Link
          href="/products/create"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition font-semibold"
        >
          + Tambah Produk
        </Link>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-blue-50">
              <th className="py-4 px-6 font-semibold text-gray-700 text-center">
                QR Code
              </th>
              <th className="py-4 px-6 font-semibold text-gray-700">
                Nama Barang
              </th>
              <th className="py-4 px-6 font-semibold text-gray-700 text-center">
                Stock Awal
              </th>
              <th className="py-4 px-6 font-semibold text-gray-700 text-center">
                Stock Sekarang
              </th>
              <th className="py-4 px-6 font-semibold text-gray-700">
                Line Divisi
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: Product) => (
              <tr
                key={product.id}
                className="border-b hover:bg-blue-50 transition"
              >
                <td className="py-4 px-6 text-center">
                  <div className="flex justify-center">
                    <Canvas
                      text={product.kodeQr || product.productionDate || "N/A"}
                      options={{
                        margin: 2,
                        scale: 4,
                        width: 80,
                        color: {
                          dark: "#1e293b",
                          light: "#f1f5f9",
                        },
                      }}
                    />
                  </div>
                </td>
                <td className="py-4 px-6 font-medium text-gray-900">
                  {product.namaBarang}
                </td>
                <td className="py-4 px-6 text-center">{product.stockAwal}</td>
                <td className="py-4 px-6 text-center">
                  {product.stockSekarang ?? "N/A"}
                </td>
                <td className="py-4 px-6">{product.lineDivisi ?? "N/A"}</td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 px-6 text-center text-gray-500">
                  Tidak ada produk ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
