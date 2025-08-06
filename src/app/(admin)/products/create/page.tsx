"use client";

import { useState } from "react";
import { createProduct } from "@/app/api/product/route";
import { useRouter } from "next/navigation";

export default function CreateProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nama_barang: "",
    kode_qr: "",
    line_divisi: "",
    production_date: "",
    stock: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct({
        nama_barang: form.nama_barang,
        kode_qr: form.kode_qr,
        line_divisi: form.line_divisi,
        production_date: form.production_date,
        stock: form.stock,
      });
      router.push("/products");
      setForm({
        nama_barang: "",
        kode_qr: "",
        line_divisi: "",
        production_date: "",
        stock: 0,
      });
    } catch (error: any) {
      console.error("Error creating product:", error.response?.data || error);
      alert("Failed to create product. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Daftar Produk</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 mb-8 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Produk
          </label>
          <input
            type="text"
            placeholder="Contoh: Kaos Polos"
            value={form.nama_barang}
            onChange={(e) => setForm({ ...form, nama_barang: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kode QR
          </label>
          <input
            type="text"
            placeholder="https://example.com/qr-code"
            value={form.kode_qr}
            onChange={(e) => setForm({ ...form, kode_qr: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Line divisi
          </label>
          <input
            type="text"
            placeholder="IT TEam"
            value={form.line_divisi}
            onChange={(e) => setForm({ ...form, line_divisi: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Production Date
          </label>
          <input
            type="date"
            placeholder="yyyy-mm-dd"
            value={form.production_date}
            onChange={(e) =>
              setForm({ ...form, production_date: e.target.value })
            }
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock Awal
          </label>
          <input
            type="number"
            placeholder="yyyy-mm-dd"
            value={form.stock}
            onChange={(e) =>
              setForm({ ...form, stock: Number(e.target.value) })
            }
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Tambah Produk
        </button>
      </form>
    </div>
  );
}
