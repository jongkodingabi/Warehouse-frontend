"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Send,
  X,
  FileOutput,
  Hash,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { useUser } from "@/context/UserContext";
import { toast } from "react-hot-toast"; // Import toast library

// Stock out form schema - with proper validation
const createStockOutFormSchema = (maxStock: number) =>
  z.object({
    stock: z.coerce
      .number()
      .min(1, "Jumlah stock wajib diisi")
      .refine((val) => !isNaN(val) && val > 0, {
        message: "Jumlah stock harus berupa angka positif",
      })
      .refine((val) => val <= maxStock, {
        message: `Stock yang dikeluarkan tidak boleh lebih dari ${maxStock}`,
      }),
    keterangan: z.string().optional(),
    production_date: z.string(),
  });

type StockOutFormSchema = {
  stock: number;
  keterangan?: string;
  production_date?: string;
};

interface StockOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    stock: number;
    deskripsi?: string;
    production_date?: string;
  }) => Promise<void>;
  barangData: {
    id: number;
    namaBarang: string;
    totalStock: number;
    kategori: {
      kategori: string;
    };
    deskripsi: string;
  } | null;
}

export default function StockOutModal({
  isOpen,
  onClose,
  onSubmit,
  barangData,
}: StockOutModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  // Create form with dynamic schema based on current stock
  const maxStock = barangData?.totalStock || 0;
  const form = useForm<StockOutFormSchema>({
    resolver: zodResolver(createStockOutFormSchema(maxStock)) as any,
    defaultValues: {
      stock: 0,
      keterangan: "",
      production_date: "",
    },
  });

  // Function to check low stock notification
  const checkLowStockNotification = async (
    finalStock: number,
    namaBarang: string
  ) => {
    if (finalStock < 10) {
      // Show toast notification
      toast.error(
        `⚠️ Stock barang "${namaBarang}" sudah kurang dari 10 unit (tersisa ${finalStock} unit)`,
        {
          duration: 5000,
          position: "top-right",
          style: {
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#B91C1C",
          },
          icon: "📦",
        }
      );

      // Optional: You can also call the notification endpoint to log this
      try {
        await axiosInstance.get("/api/v1/notifikasi/10");
      } catch (error) {}
    }
  };

  const handleSubmit = async (values: StockOutFormSchema) => {
    if (!barangData) return;

    setIsLoading(true);
    try {
      // Calculate final stock after reduction
      const finalStock = barangData.totalStock - values.stock;

      // Call the API endpoint for stock out
      await axiosInstance.post(`/api/v1/barang/${barangData.id}/stock-out`, {
        stock: values.stock,
        keterangan: values.keterangan || "",
        user_id: user?.id,
        type: "Stock Out",
        production_date: values.production_date,
      });

      // Call parent onSubmit handler
      await onSubmit(values);

      // Check and show low stock notification
      await checkLowStockNotification(finalStock, barangData.namaBarang);

      // Show success toast
      toast.success(
        `Stock barang "${barangData.namaBarang}" berhasil dikurangi ${values.stock} unit`,
        {
          duration: 3000,
          position: "top-right",
        }
      );

      form.reset();
      onClose();
    } catch (error) {
      // Show error toast
      toast.error(`Gagal mengurangi stock barang "${barangData?.namaBarang}"`, {
        duration: 4000,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  // Watch stock input for preview
  const watchedStock = form.watch("stock");
  const stockNumber =
    typeof watchedStock === "string"
      ? parseInt(watchedStock, 10) || 0
      : watchedStock || 0;

  if (!isOpen || !barangData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-zinc-900/50 backdrop-blur-md flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white p-6 border border-gray-200 rounded-xl shadow-xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center mb-6">
              <div className="inline-block bg-red-600 p-3 rounded-lg text-white mr-3">
                <FileOutput className="w-6 h-6" />
              </div>
              <h1 className="font-semibold text-2xl text-slate-800">
                Stock Out
              </h1>
            </div>

            {/* Barang Info */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-red-800 mb-2">
                Informasi Barang
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-red-700 font-medium">Nama:</span>
                  <p className="text-red-800 uppercase">
                    {barangData.namaBarang}
                  </p>
                </div>
                <div>
                  <span className="text-red-700 font-medium">Kategori:</span>
                  <p className="text-red-800">{barangData.kategori.kategori}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-red-700 font-medium">
                    Stock Saat Ini:
                  </span>
                  <p className="text-red-800 font-semibold">
                    {barangData.totalStock} unit
                  </p>
                </div>
              </div>
            </div>

            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              {/* Input Stock */}
              <div>
                <label
                  htmlFor="stock"
                  className="block text-slate-700 font-medium text-sm mb-2"
                >
                  Jumlah Stock Keluar <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash className="text-slate-400 w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    id="stock"
                    min="1"
                    max={barangData.totalStock}
                    placeholder="Masukkan jumlah stock"
                    {...form.register("stock")}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      const value = parseInt(target.value);

                      // Prevent input that exceeds max stock
                      if (value > barangData.totalStock) {
                        target.value = barangData.totalStock.toString();
                      }
                      // Prevent negative values
                      else if (value < 0) {
                        target.value = "";
                      }
                    }}
                    onKeyDown={(e) => {
                      // Prevent typing 'e', 'E', '+', '-' in number input
                      if (["e", "E", "+", "-"].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all"
                  />
                </div>
                {form.formState.errors.stock && (
                  <span className="text-red-500 text-xs mt-1">
                    {form.formState.errors.stock.message}
                  </span>
                )}
              </div>

              {/* Input tanggal produksi */}
              <div>
                <label
                  htmlFor="production_date"
                  className="block text-text font-medium text-sm mb-2"
                >
                  Tanggal Produksi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="text-text/30 w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    id="production_date"
                    {...form.register("production_date")}
                    className="w-full pl-10 pr-3 py-2.5 bg-background border border-secondary text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                {form.formState.errors.production_date && (
                  <span className="text-red-500 text-xs mt-1">
                    {form.formState.errors.production_date.message}
                  </span>
                )}
              </div>

              {/* Input Deskripsi */}
              <div>
                <label
                  htmlFor="deskripsi"
                  className="block text-slate-700 font-medium text-sm mb-2"
                >
                  Deskripsi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MessageSquare className="text-slate-400 w-4 h-4" />
                  </div>
                  <textarea
                    id="deskripsi"
                    placeholder="Masukkan keterangan stock out..."
                    rows={3}
                    {...form.register("keterangan")}
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all resize-none"
                  />
                </div>
                {form.formState.errors.keterangan && (
                  <span className="text-red-500 text-xs mt-1">
                    {form.formState.errors.keterangan.message}
                  </span>
                )}
              </div>

              {/* Preview Section */}
              {stockNumber > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <h4 className="font-medium text-red-800 mb-2">Preview:</h4>
                  <div className="text-sm text-red-700">
                    <p>
                      Stock akan berkurang dari{" "}
                      <span className="font-semibold">
                        {barangData.totalStock}
                      </span>{" "}
                      menjadi{" "}
                      <span className="font-semibold text-red-800">
                        {barangData.totalStock - stockNumber}
                      </span>{" "}
                      unit
                    </p>
                    <p>
                      Pengurangan: -
                      <span className="font-semibold text-red-600">
                        {stockNumber}
                      </span>{" "}
                      unit
                    </p>
                  </div>
                </div>
              )}

              {/* Warning if stock will be 0 or low */}
              {stockNumber > 0 && barangData.totalStock - stockNumber === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-800 text-sm font-medium">
                    ⚠️ Peringatan: Stock akan habis setelah transaksi ini!
                  </p>
                </div>
              )}

              {stockNumber > 0 &&
                barangData.totalStock - stockNumber < 10 &&
                barangData.totalStock - stockNumber > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-orange-800 text-sm font-medium">
                      ⚠️ Peringatan: Stock akan menjadi sangat rendah (&lt; 10
                      unit)!
                    </p>
                  </div>
                )}

              {/* Action Buttons */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 flex items-center justify-center bg-gray-500 rounded-lg py-3 text-white font-semibold text-base hover:bg-gray-600 hover:scale-[1.02] active:bg-gray-700 active:scale-[0.98] transition-all"
                >
                  <X className="mr-2 w-4 h-4" />
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    !stockNumber ||
                    stockNumber <= 0 ||
                    stockNumber > barangData.totalStock
                  }
                  className="flex-1 flex items-center justify-center bg-red-600 rounded-lg py-3 text-white font-semibold text-base hover:bg-red-700 hover:scale-[1.02] active:bg-red-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2"></div>
                      Mengurangi Stock...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 w-4 h-4" />
                      Kurangi Stock
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
