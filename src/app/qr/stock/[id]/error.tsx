"use client";

import { Package } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error detail:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
          <Package className="w-8 h-8 text-red-600 mx-auto" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Stock Tidak Ditemukan
        </h1>
        <p className="text-gray-600 mb-6">
          {error.message || "Produk yang Anda cari tidak tersedia."}
        </p>
        <button
          onClick={reset} // reset = coba render ulang
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
