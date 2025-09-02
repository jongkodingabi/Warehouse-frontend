"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Warehouse, Send, X, Clock, Home, Calendar, Boxes } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Category } from "@/utils/types";
import axiosInstance from "@/lib/axios";
import { useUser } from "@/context/UserContext";

// Schema untuk edit - tambahkan id untuk update
const barangFormSchema = z.object({
  kategori_id: z.coerce
    .number()
    .min(1, "Kategori harus dipilih")
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Kategori ID harus berupa angka positif",
    }),
  user_id: z.number(),
  produk: z.string().min(1, "Nama produk harus diisi"),
  production_date: z.string().min(1, "Tanggal produksi harus diisi"),
  kodegrp: z.string().min(1, "Kode grup harus diisi"),
  status: z.string(),
});

type BarangFormSchema = z.infer<typeof barangFormSchema>;

export default function EditBarangModal({
  isOpen,
  onClose,
  onSubmit,
  barang,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BarangFormSchema) => void;
  barang: any;
}) {
  const { user } = useUser();
  const [categoriesOption, setCategoriesOption] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const form = useForm<BarangFormSchema>({
    resolver: zodResolver(barangFormSchema) as any,
    defaultValues: {
      kategori_id: 0,
      user_id: user?.id || 0,
      produk: "",
      production_date: barang.productionDate,
      kodegrp: barang.kodegrp,
      status: "active",
    },
  });

  /**
   * Fetches categories from API and stores them in state
   *
   * @returns {Promise<Category[]>} - Promise that resolves with an array of categories
   */
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/kategori");
      setCategoriesOption(response.data.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };

  // Load data dan set form values ketika modal dibuka
  useEffect(() => {
    const loadData = async () => {
      if (isOpen && barang && user?.id) {
        setIsDataLoaded(false);

        // Fetch categories terlebih dahulu
        const categoriesData = await fetchCategories();

        // Kemudian reset form dengan data barang
        console.log("Resetting form with data:", barang);

        form.reset({
          kategori_id: (
            barang.kategori_id ||
            barang.kategori?.id ||
            0
          ).toString(),
          user_id: user.id,
          produk: barang.produk || barang.namaBarang || "",
          production_date:
            barang.production_date || barang.productionDate || "",
          kodegrp: barang.kodegrp || "",
          status: barang.status || "active",
        });

        setIsDataLoaded(true);
      }
    };

    loadData();
  }, [isOpen, barang, user, form]);

  const handleSubmit = async (values: BarangFormSchema) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      console.log("Submitting values:", values);

      // Prepare data for submission - convert kategori_id back to number
      const submitData = {
        ...values,
        kategori_id: parseInt(values.kategori_id.toString(), 10),
      };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      setIsDataLoaded(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
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
          className="bg-background p-8 border border-secondary rounded-xl shadow-xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="absolute top-3 right-3 text-text/50 hover:text-text disabled:opacity-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center mb-6">
            <div className="inline-block bg-primary p-3 rounded-lg text-white mr-3">
              <Warehouse className="w-6 h-6" />
            </div>
            <h1 className="font-semibold text-2xl text-text">Edit Barang</h1>
          </div>

          {/* Show loading indicator while data is being loaded */}
          {!isDataLoaded ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary/30 border-t-primary"></div>
              <span className="ml-3 text-text">Memuat data...</span>
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Input nama barang */}
                <div>
                  <label
                    htmlFor="produk"
                    className="block text-text font-medium text-sm mb-2"
                  >
                    Nama Barang
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Boxes className="text-text/30 w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="produk"
                      placeholder="Masukkan nama barang"
                      {...form.register("produk")}
                      className="w-full pl-10 pr-3 py-2.5 bg-background border border-secondary text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      disabled={isSubmitting}
                    />
                  </div>
                  {form.formState.errors.produk && (
                    <span className="text-red-500 text-xs mt-1">
                      {form.formState.errors.produk.message}
                    </span>
                  )}
                </div>

                {/* Kode Grup */}
                <div>
                  <label
                    htmlFor="kodegrp"
                    className="block text-text font-medium text-sm mb-2"
                  >
                    Kode Grup
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Home className="text-text/30 w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="kodegrp"
                      placeholder="Masukkan kode grup"
                      {...form.register("kodegrp")}
                      className="w-full pl-10 pr-3 py-2.5 bg-background border border-secondary text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      disabled={isSubmitting}
                    />
                  </div>
                  {form.formState.errors.kodegrp && (
                    <span className="text-red-500 text-xs mt-1">
                      {form.formState.errors.kodegrp.message}
                    </span>
                  )}
                </div>

                {/* Tanggal Produksi */}
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
                      disabled={isSubmitting}
                    />
                  </div>
                  {form.formState.errors.production_date && (
                    <span className="text-red-500 text-xs mt-1">
                      {form.formState.errors.production_date.message}
                    </span>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label
                    htmlFor="status"
                    className="block text-text font-medium text-sm mb-2"
                  >
                    Status
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="text-text/30 w-4 h-4" />
                    </div>
                    <select
                      id="status"
                      {...form.register("status")}
                      className="w-full pl-10 pr-3 py-2.5 bg-background border border-secondary text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      disabled={isSubmitting}
                    >
                      <option value="active">Aktif</option>
                      <option value="un-active">Non Aktif</option>
                    </select>
                  </div>
                  {form.formState.errors.status && (
                    <span className="text-red-500 text-xs mt-1">
                      {form.formState.errors.status.message}
                    </span>
                  )}
                </div>

                {/* Kategori */}
                <div className="md:col-span-2 hidden">
                  <label
                    htmlFor="kategori_id"
                    className="block text-text font-medium text-sm mb-2"
                  >
                    Kategori
                  </label>
                  <div className="relative hidden">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Warehouse className="text-text/30 w-4 h-4" />
                    </div>
                    <select
                      id="kategori_id"
                      {...form.register("kategori_id")}
                      className="w-full pl-10 hidden pr-3 py-2.5 bg-background border border-secondary text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      disabled={isSubmitting}
                    >
                      <option value="">Pilih Kategori</option>
                      {categoriesOption.map((category) => (
                        <option
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.kategori}
                        </option>
                      ))}
                    </select>
                  </div>
                  {form.formState.errors.kategori_id && (
                    <span className="text-red-500 text-xs mt-1">
                      {form.formState.errors.kategori_id.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Info Text */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                <p className="text-primary text-sm">
                  <strong>Info:</strong> Pastikan semua data yang dimasukkan
                  sudah benar sebelum menyimpan perubahan.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center bg-gray-500 rounded-lg py-3 text-white font-semibold text-base hover:bg-gray-600 hover:scale-[1.02] active:bg-gray-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="mr-2 w-4 h-4" />
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center bg-primary rounded-lg py-3 text-white font-semibold text-base hover:bg-primary/90 hover:scale-[1.02] active:bg-primary/80 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 w-4 h-4" />
                      Update Barang
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
