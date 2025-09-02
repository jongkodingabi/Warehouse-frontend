"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send, X, FileOutput, Hash, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { useUser } from "@/context/UserContext";

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
    deskripsi: z.string().min(10, "Harus lebih dari sepuluh karakter"),
  });

type StockOutFormSchema = {
  stock: number;
  deskripsi: string;
};

interface StockOutAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StockOutFormSchema) => Promise<void>;
  barangData: {
    id: number;
    namaBarang: string;
    stockSekarang: number;
    kategori: {
      kategori: string;
    };
    deskripsi: string;
  } | null;
  // Tambahan props untuk data audit yang akan di-edit
  auditData?: {
    id: number;
    stock?: number;
    deskripsi: string;
    type: string;
  } | null;
  isEditMode?: boolean; // Flag untuk menentukan apakah ini mode edit
}

export default function StockOutAuditModal({
  isOpen,
  onClose,
  onSubmit,
  barangData,
  auditData = null,
  isEditMode = false,
}: StockOutAuditModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  // Create form with dynamic schema based on current stock
  const maxStock = barangData?.stockSekarang || 0;

  const form = useForm<StockOutFormSchema>({
    resolver: zodResolver(createStockOutFormSchema(maxStock)) as any,
    defaultValues: {
      stock: 0,
      deskripsi: "",
    },
  });

  // Effect untuk mengisi form dengan data audit ketika mode edit
  useEffect(() => {
    if (isEditMode && auditData && isOpen) {
      form.reset({
        stock: auditData.stock || 0,
        deskripsi: "",
      });
    } else if (!isEditMode && isOpen) {
      // Reset form ketika bukan mode edit
      form.reset({
        stock: 0,
        deskripsi: "",
      });
    }
  }, [isEditMode, auditData, isOpen, form]);

  const handleSubmit = async (values: StockOutFormSchema) => {
    if (!barangData) return;

    setIsLoading(true);
    try {
      if (isEditMode && auditData) {
        // Update existing audit log
        await axiosInstance.put(`/api/v1/auditlog/${auditData.id}`, {
          stock: values.stock,
          deskripsi: values.deskripsi,
          user_id: user?.id,
          type: "Stock Out",
        });
      } else {
        // Create new audit log
        await axiosInstance.post(`/api/v1/barang/${barangData.id}/stock-out`, {
          stock: values.stock,
          deskripsi: values.deskripsi,
          user_id: user?.id,
          type: "Stock Out",
        });
      }

      // Call the parent onSubmit function
      await onSubmit(values);

      // Reset form and close modal
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error processing stock out:", error);
      // You might want to show an error toast here
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
              <h1 className="font-semibold text-2xl text-text">
                {isEditMode ? "Edit Stock Out" : "Stock Out"}
              </h1>
            </div>

            {/* Barang Info */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-red-800 mb-2">
                Informasi Audit
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-red-800 font-medium">Nama:</span>
                  <p className="text-red-800 uppercase">
                    {barangData.namaBarang}
                  </p>
                </div>
                <div>
                  <span className="text-red-800 font-medium">Kategori:</span>
                  <p className="text-red-800">{barangData.kategori.kategori}</p>
                </div>
                <div className="">
                  <span className="text-red-800 font-medium">
                    Stock Saat Ini:
                  </span>
                  <p className="text-red-800 font-semibold">
                    {barangData.stockSekarang} unit
                  </p>
                </div>
                <div className="">
                  <span className="text-red-800 font-medium">Deskripsi:</span>
                  <p className="text-red-800 font-semibold">
                    {auditData?.deskripsi}
                  </p>
                </div>
                {isEditMode && auditData && (
                  <div className="col-span-2 mt-2 pt-2 border-t border-red-200">
                    <span className="text-red-800 font-medium">
                      Mode:{" "}
                      <span className="text-orange-600">
                        Edit Data Audit #{auditData.id}
                      </span>
                    </span>
                  </div>
                )}
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
                      if (["e", "E", "+", "-"].includes(e.key)) {
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

              {/* Input Deskripsi */}
              <div>
                <label
                  htmlFor="deskripsi"
                  className="block text-text font-medium text-sm mb-2"
                >
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MessageSquare className="text-text/30 w-4 h-4" />
                  </div>
                  <textarea
                    id="deskripsi"
                    placeholder="Masukkan keterangan stock out..."
                    rows={3}
                    {...form.register("deskripsi")}
                    className="w-full pl-10 pr-3 py-2.5 bg-background border border-secondary text-text rounded-md focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all resize-none"
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
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <h4 className="font-medium text-red-800 mb-2">
                    {isEditMode ? "Preview Perubahan:" : "Preview:"}
                  </h4>
                  <div className="text-sm text-red-700">
                    {isEditMode ? (
                      <p className="text-orange-700">
                        <span className="font-semibold">Mode Edit:</span>{" "}
                        Mengubah data audit log
                      </p>
                    ) : (
                      <>
                        <p>
                          Stock akan berkurang dari{" "}
                          <span className="font-semibold">
                            {barangData.stockSekarang}
                          </span>{" "}
                          menjadi{" "}
                          <span className="font-semibold text-red-800">
                            {barangData.stockSekarang - stockNumber}
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
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Warning if stock will be 0 or low - hanya tampil jika bukan mode edit */}
              {!isEditMode &&
                stockNumber > 0 &&
                barangData.stockSekarang - stockNumber === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-yellow-800 text-sm font-medium">
                      ⚠️ Peringatan: Stock akan habis setelah transaksi ini!
                    </p>
                  </div>
                )}

              {!isEditMode &&
                stockNumber > 0 &&
                barangData.stockSekarang - stockNumber <= 5 &&
                barangData.stockSekarang - stockNumber > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-orange-800 text-sm font-medium">
                      ⚠️ Peringatan: Stock akan menjadi rendah (≤ 5 unit)!
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
                    (!isEditMode && stockNumber > barangData.stockSekarang) // Validasi hanya untuk mode create
                  }
                  className="flex-1 flex items-center justify-center bg-red-600 rounded-lg py-3 text-white font-semibold text-base hover:bg-red-700 hover:scale-[1.02] active:bg-red-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2"></div>
                      {isEditMode ? "Mengupdate..." : "Mengurangi Stock..."}
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 w-4 h-4" />
                      {isEditMode ? "Update Stock" : "Kurangi Stock"}
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
