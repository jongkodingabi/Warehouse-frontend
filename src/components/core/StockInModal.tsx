"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send, X, FileInput, Calendar, Hash, List } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { useUser } from "@/context/UserContext";

// Stock in form schema
const stockInFormSchema = z.object({
  stock: z.coerce
    .number()
    .min(1, "Jumlah stock wajib diisi")
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Jumlah stock harus berupa angka positif",
    }),
  deskripsi: z.string().min(1, "Deskripsi wajib diisi"),
  production_date: z.string(),
});

type StockInFormSchema = z.infer<typeof stockInFormSchema>;

interface StockInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StockInFormSchema) => Promise<void>;
  barangData: {
    id: number;
    namaBarang: string;
    totalStock: number;
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
    resolver: zodResolver(stockInFormSchema) as any,
    defaultValues: {
      stock: 0,
      deskripsi: "",
    },
  });

  const watchedStock = form.watch("stock");
  const stockNumber =
    typeof watchedStock === "string"
      ? parseInt(watchedStock, 10) || 0
      : watchedStock || 0;

  const handleSubmit = async (values: StockInFormSchema) => {
    if (!barangData || isLoading) return; // Prevent double submission

    setIsLoading(true);
    try {
      // Make API call
      const response = await axiosInstance.post(
        `/api/v1/barang/${barangData.id}/stock-in`,
        {
          stock: values.stock,
          keterangan: values.deskripsi,
          user_id: user?.id,
          type: "Stock In",
          production_date: values.production_date,
        }
      );

      console.log("API response:", response.data); // Debug log

      // Call parent onSubmit only for UI updates, not API call
      await onSubmit(values);

      // Reset form and close modal
      form.reset({ stock: 0, deskripsi: "" });
      onClose();
    } catch (error) {
      // Show error to user
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      // Prevent closing while submitting
      form.reset({ stock: 0, deskripsi: "" });
      onClose();
    }
  };

  // Prevent rendering if not open or no data
  if (!isOpen || !barangData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-zinc-900/50 backdrop-blur-md flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          // Close modal when clicking backdrop (but not when loading)
          if (e.target === e.currentTarget && !isLoading) {
            handleClose();
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-background p-6 border border-secondary rounded-xl shadow-xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="absolute top-4 right-4 text-text/50 hover:text-text transition-colors disabled:opacity-50"
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
                  step="1"
                  placeholder="Masukkan jumlah stock"
                  disabled={isLoading}
                  {...form.register("stock", {
                    valueAsNumber: true,
                  })}
                  className="w-full pl-10 pr-3 py-2.5 bg-background border border-secondary text-text rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all disabled:opacity-50"
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
                  disabled={isLoading}
                  {...form.register("deskripsi")}
                  className="w-full pl-10 pr-3 py-2.5 bg-background border border-secondary text-text rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all disabled:opacity-50 min-h-[80px]"
                />
              </div>
              {form.formState.errors.deskripsi && (
                <span className="text-red-500 text-xs mt-1">
                  {form.formState.errors.deskripsi.message}
                </span>
              )}
            </div>

            {/* Preview Section */}
            {stockNumber > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-blue-800 mb-2">Preview:</h4>
                <div className="text-sm text-blue-700">
                  <p>
                    Stock akan bertambah dari{" "}
                    <span className="font-semibold">
                      {barangData.totalStock}
                    </span>{" "}
                    menjadi{" "}
                    <span className="font-semibold text-primary">
                      {barangData.totalStock + stockNumber}
                    </span>{" "}
                    unit
                  </p>
                  <p>
                    Penambahan: +
                    <span className="font-semibold text-primary">
                      {stockNumber}
                    </span>{" "}
                    unit
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center bg-gray-500 rounded-lg py-3 text-white font-semibold text-base hover:bg-gray-600 hover:scale-[1.02] active:bg-gray-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="mr-2 w-4 h-4" />
                Batal
              </button>

              <button
                type="submit"
                disabled={isLoading || !stockNumber || stockNumber <= 0}
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
  );
}
