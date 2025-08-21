"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Package,
  Send,
  X,
  FileInput,
  Calendar,
  Hash,
  MessageSquare,
  List,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { useUser } from "@/context/UserContext";

// Stock in form schema - ubah dari quantity ke stock
const stockInFormSchema = z.object({
  stock: z.coerce
    .number()
    .min(1, "Jumlah stock wajib diisi")
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Jumlah stock harus berupa angka positif",
    }),
  deskripsi: z.string({ message: "Harus Lebih dari satu karakter" }),
});

type StockInFormSchema = z.infer<typeof stockInFormSchema>;

interface StockInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StockInFormSchema) => Promise<void>;
  barangData: {
    id: number;
    namaBarang: string;
    stockSekarang: number;
    deskripsi: string;
    kategori: {
      kategori: string;
    };
  } | null;
}

export default function StockInModal({
  isOpen,
  onClose,
  onSubmit,
  barangData,
}: StockInModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const form = useForm<StockInFormSchema>({
    resolver: zodResolver(stockInFormSchema),
    defaultValues: {
      stock: 0,
      deskripsi: "",
    },
  });

  const handleSubmit = async (values: StockInFormSchema) => {
    if (!barangData) return;

    setIsLoading(true);
    try {
      await axiosInstance.post(`/api/v1/barang/${barangData.id}/stock-in`, {
        stock: values.stock,
        deskripsi: values.deskripsi,
        user_id: user?.id,
        type: "Stock In",
      });

      // Call the parent onSubmit function
      await onSubmit(values);

      // Reset form and close modal
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error adding stock:", error);
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
    <>
      <AnimatePresence>
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
              <div className="inline-block bg-blue-600 p-3 rounded-lg text-white mr-3">
                <FileInput className="w-6 h-6" />
              </div>
              <h1 className="font-semibold text-2xl text-text">Stock In</h1>
            </div>

            {/* Barang Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
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
              {/* Input Stock - ubah dari quantity ke stock */}
              <div>
                <label
                  htmlFor="stock"
                  className="block text-text font-medium text-sm mb-2"
                >
                  Jumlah Stock Masuk <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash className="text-text/30 w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    id="stock"
                    min="1"
                    placeholder="Masukkan jumlah stock"
                    {...form.register("stock")}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      const value = parseInt(target.value);

                      // Prevent input that exceeds max stock
                      if (value < 0) {
                        target.value = "";
                        form.setValue("stock", 0);
                      }
                    }}
                    className="w-full pl-10 pr-3 py-2.5 bg-background border border-secondary text-text rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  />
                </div>
                {form.formState.errors.stock && (
                  <span className="text-red-500 text-xs mt-1">
                    {form.formState.errors.stock.message}
                  </span>
                )}
              </div>

              {/* Input deskripsi */}
              <div>
                <label
                  htmlFor="deskripsi"
                  className="block text-text font-medium text-sm mb-2"
                >
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 top-0 pl-3 flex items-center pointer-events-none">
                    <List className="text-text/30 w-4 h-4" />
                  </div>
                  <textarea
                    id="deskripsi"
                    placeholder="Masukkan deskripsi stock in"
                    {...form.register("deskripsi")}
                    className="w-full pl-10 pr-3 py-2.5 bg-background border border-secondary text-text rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  />
                </div>
                {form.formState.errors.deskripsi && (
                  <span className="text-red-500 text-xs mt-1">
                    {form.formState.errors.deskripsi.message}
                  </span>
                )}
              </div>

              {/* Preview Section - ubah dari quantity ke stock */}
              {form.watch("stock") ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-medium text-blue-800 mb-2">Preview:</h4>
                  <div className="text-sm text-blue-700">
                    <p>
                      Stock akan bertambah dari{" "}
                      <span className="font-semibold">
                        {barangData.stockSekarang}
                      </span>{" "}
                      menjadi{" "}
                      <span className="font-semibold text-primary">
                        {barangData.stockSekarang + (form.watch("stock") || 0)}
                      </span>{" "}
                      unit
                    </p>
                    <p>
                      Penambahan: +
                      <span className="font-semibold text-primary">
                        {form.watch("stock") || 0}
                      </span>{" "}
                      unit
                    </p>
                  </div>
                </div>
              ) : (
                <p> </p>
              )}

              {/* Action Buttons - ubah kondisi disabled */}
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
                  disabled={isLoading || !form.watch("stock")}
                  className="flex-1 flex items-center justify-center bg-blue-600 rounded-lg py-3 text-white font-semibold text-base hover:bg-blue-700 hover:scale-[1.02] active:bg-blue-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2"></div>
                      Menambah Stock...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 w-4 h-4" />
                      Tambah Stock
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
