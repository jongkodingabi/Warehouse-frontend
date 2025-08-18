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
  kategori_id: z.coerce.number().min(1, "Kategori harus dipilih"),
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

  const form = useForm<BarangFormSchema>({
    resolver: zodResolver(barangFormSchema),
    defaultValues: {
      kategori_id: 1,
      user_id: user?.id || 0,
      produk: "",
      production_date: "",
      kodegrp: "",
      status: "active",
    },
  });

  // Fetch categories terlebih dahulu
  useEffect(() => {
    fetchCategories();
  }, []);

  // Reset form ketika barang berubah DAN categories sudah loaded
  useEffect(() => {
    if (barang && categoriesOption.length > 0 && user?.id) {
      console.log("Resetting form with data:", barang);

      form.reset({
        kategori_id: barang.kategori_id || barang.kategori?.id || 1,
        user_id: user.id,
        produk: barang.produk || barang.namaBarang || "",
        production_date: barang.production_date || barang.productionDate || "",
        kodegrp: barang.kodegrp || "",
        status: barang.status || "active",
      });
    }
  }, [barang, categoriesOption, user, form]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/kategori");
      setCategoriesOption(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (values: BarangFormSchema) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      console.log("Submitting values:", values);
      await onSubmit(values);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
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
        className="fixed inset-0 bg-zinc-900/50 backdrop-blur-md flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-background p-8 border border-secondary rounded-xl shadow-xl w-full max-w-lg relative"
        >
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="absolute top-3 right-3 text-text/50 hover:text-text disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center mb-6">
            <div className="inline-block bg-primary p-3 rounded-lg text-white mr-2">
              <Warehouse className="w-6 h-6" />
            </div>
            <h1 className="font-semibold text-2xl text-text">Edit Barang</h1>
          </div>

          <form className="mt-5" onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              {/* Input nama barang */}
              <div className="mb-5">
                <label
                  htmlFor="produk"
                  className="block text-text font-medium mb-2"
                >
                  Nama Barang
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-3 text-text/30" />
                  <input
                    type="text"
                    id="produk"
                    {...form.register("produk")}
                    className="w-full pl-10 pr-3 py-3 border rounded-sm"
                    disabled={isSubmitting}
                  />
                </div>
                {form.formState.errors.produk && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.produk.message}
                  </p>
                )}
              </div>

              {/* Hidden fields */}

              {/* kodegrp */}
              <div className="mb-5">
                <label
                  htmlFor="kodegrp"
                  className="block text-text font-medium mb-2"
                >
                  KodeGrp
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-3 text-text/30" />
                  <input
                    type="text"
                    id="kodegrp"
                    {...form.register("kodegrp")}
                    className="w-full pl-10 pr-3 py-3 border rounded-sm"
                    disabled={isSubmitting}
                  />
                </div>
                {form.formState.errors.kodegrp && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.kodegrp.message}
                  </p>
                )}
              </div>

              {/* tanggal produksi */}
              <div className="mb-5">
                <label
                  htmlFor="production_date"
                  className="block text-text font-medium mb-2"
                >
                  Tanggal Produksi
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-text/30" />
                  <input
                    type="date"
                    id="production_date"
                    {...form.register("production_date")}
                    className="w-full pl-10 pr-3 py-3 border rounded-sm"
                    disabled={isSubmitting}
                  />
                </div>
                {form.formState.errors.production_date && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.production_date.message}
                  </p>
                )}
              </div>

              {/* status */}
              <div className="mb-5">
                <label
                  htmlFor="status"
                  className="block text-text font-medium mb-2"
                >
                  Status
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 text-text/30" />
                  <select
                    id="status"
                    {...form.register("status")}
                    className="w-full pl-10 pr-3 py-3 border rounded-sm"
                    disabled={isSubmitting}
                  >
                    <option value="active">Aktif</option>
                    <option value="un-active">Non Aktif</option>
                  </select>
                </div>
              </div>

              {/* kategori */}
              <div className="mb-5">
                <label
                  htmlFor="kategori_id"
                  className="block text-text font-medium mb-2"
                >
                  Kategori
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 text-text/30" />
                  <select
                    id="kategori_id"
                    {...form.register("kategori_id")}
                    className="w-full pl-10 pr-3 py-3 border rounded-sm"
                    disabled={isSubmitting}
                  >
                    {categoriesOption.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.kategori}
                      </option>
                    ))}
                  </select>
                </div>
                {form.formState.errors.kategori_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.kategori_id.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center bg-primary rounded-lg py-3 text-white font-semibold text-lg hover:bg-primary/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="mr-2" />
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
