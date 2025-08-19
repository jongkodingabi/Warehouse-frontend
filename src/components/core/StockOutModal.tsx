"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Package,
  Send,
  X,
  FileOutput, // Changed from FileInput to FileOutput for stock out
  Calendar,
  Hash,
  MessageSquare,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import axiosInstance from "@/lib/axios";

// Stock out form schema - fixed validation to check max stock
const stockOutFormSchema = (maxStock: number) => z.object({
  stock: z
    .string()
    .min(1, "Jumlah stock wajib diisi")
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Jumlah stock harus berupa angka positif",
    })
    .refine((val) => val <= maxStock, {
      message: `Stock yang dikeluarkan tidak boleh lebih dari ${maxStock}`,
    }),
});

// Fixed interface name consistency
interface StockOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { stock: number }) => Promise<void>; // Fixed type name
  barangData: {
    id: number;
    namaBarang: string;
    stockSekarang: number;
    kategori: {
      kategori: string;
    };
  } | null;
}

export default function StockOutModal({
  isOpen,
  onClose,
  onSubmit,
  barangData,
}: StockOutModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Create form with dynamic schema based on current stock
  const form = useForm<{ stock: number }>({
    resolver: barangData ? zodResolver(stockOutFormSchema(barangData.stockSekarang)) : undefined,
    defaultValues: {
      stock: 0,
    },
  });

  const handleSubmit = async (values: { stock: number }) => {
    if (!barangData) return;

    setIsLoading(true);
    try {
      // Call the API endpoint for stock out
      await axiosInstance.post(`/api/v1/barang/${barangData.id}/stock-out`, {
        stock: values.stock, 
      });

      await onSubmit(values);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error reducing stock:", error);
      // You might want to show an error toast here
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

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
            className="bg-background p-6 border border-secondary rounded-xl shadow-xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-text/50 hover:text-text transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center mb-6">
              <div className="inline-block bg-red-600 p-3 rounded-lg text-white mr-3">
                <FileOutput className="w-6 h-6" />
              </div>
              <h1 className="font-semibold text-2xl text-text">Stock Out</h1>
            </div>

            {/* Barang Info */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-primary mb-2">
                Informasi Barang
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-primary font-medium">Nama:</span>
                  <p className="text-primary uppercase">
                    {barangData.namaBarang}
                  </p>
                </div>
                <div>
                  <span className="text-primary font-medium">Kategori:</span>
                  <p className="text-primary">{barangData.kategori.kategori}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-primary font-medium">
                    Stock Saat Ini:
                  </span>
                  <p className="text-primary font-semibold">
                    {barangData.stockSekarang} unit
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
                  className="block text-text font-medium text-sm mb-2"
                >
                  Jumlah Stock Keluar <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash className="text-text/30 w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    id="stock"
                    min="1"
                    max={barangData.stockSekarang}
                    placeholder="Masukkan jumlah stock"
                    {...form.register("stock")}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      const value = parseInt(target.value);
                      
                      // Prevent input that exceeds max stock
                      if (value > barangData.stockSekarang) {
                        target.value = barangData.stockSekarang.toString();
                        form.setValue("stock", barangData.stockSekarang);
                      }
                      // Prevent negative values
                      else if (value < 0) {
                        target.value = "";
                        form.setValue("stock", 0);
                      }
                    }}
                    onKeyDown={(e) => {
                      // Prevent typing 'e', 'E', '+', '-' in number input
                      if (['e', 'E', '+', '-'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="w-full pl-10 pr-3 py-2.5 bg-background border border-secondary text-text rounded-md focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all"
                  />
                </div>
                {form.formState.errors.stock && (
                  <span className="text-red-500 text-xs mt-1">
                    {form.formState.errors.stock.message}
                  </span>
                )}
              </div>

              {/* Preview Section */}
              {form.watch('stock') && form.watch('stock') > 0 ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <h4 className="font-medium text-red-800 mb-2">Preview:</h4>
                  <div className="text-sm text-red-700">
                    <p>
                      Stock akan berkurang dari{" "}
                      <span className="font-semibold">
                        {barangData.stockSekarang}
                      </span>{" "}
                      menjadi{" "}
                      <span className="font-semibold text-primary">
                        {barangData.stockSekarang - (parseInt(String(form.watch("stock"))) || 0)}
                      </span>{" "}
                      unit
                    </p>
                    <p>
                      Pengurangan: -
                      <span className="font-semibold text-red-600">
                        {form.watch("stock") || 0}
                      </span>{" "}
                      unit
                    </p>
                  </div>
                </div>
              ) : null}

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
                  disabled={isLoading || !form.watch("stock") || form.watch("stock") <= 0}
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