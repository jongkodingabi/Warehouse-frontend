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

// Perbaiki schema dengan transformasi yang lebih eksplisit
const barangFormSchema = z.object({
  kategori_id: z.coerce.number().min(1, "Kategori harus dipilih"),
  created_by: z.number(),
  produk: z.string().min(1, "Nama produk harus diisi"),
  production_date: z.string().min(1, "Tanggal produksi harus diisi"),
  stock: z.coerce.number().min(0, "Stock tidak boleh negatif"),
  kodegrp: z.string().min(1, "Kode grup harus diisi"),
  status: z.enum(["aktif", "non-aktif"]),
  line_divisi: z.number(),
  main_product: z.number(),
});

type BarangFormSchema = z.infer<typeof barangFormSchema>;

export default function CreateBarangModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BarangFormSchema) => void;
}) {
  const { user } = useUser();
  const [categoriesOption, setCategoriesOption] = useState<Category[]>([]);

  const form = useForm<BarangFormSchema>({
    resolver: zodResolver(barangFormSchema),
    defaultValues: {
      kategori_id: 4,
      created_by: user?.id || 0,
      produk: "",
      production_date: "",
      stock: 0,
      kodegrp: "",
      status: "aktif" as const,
      line_divisi: user?.divisi_id || 0,
      main_product: 1,
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/kategori");
      setCategoriesOption(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle submit dengan type assertion yang aman
  const handleSubmit = (values: BarangFormSchema) => {
    onSubmit(values);
    form.reset();
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
            onClick={onClose}
            className="absolute top-3 right-3 text-text/50 hover:text-text"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center mb-6">
            <div className="inline-block bg-primary p-3 rounded-lg text-white mr-2">
              <Warehouse className="w-6 h-6" />
            </div>
            <h1 className="font-semibold text-2xl text-text">Tambah Barang</h1>
          </div>

          <form className="mt-5" onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              {/* Input nama barang */}
              <div className="mb-5">
                <label
                  htmlFor="produk"
                  className="block text-text font-medium text-base mb-2"
                >
                  Nama Barang
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Home className="text-text/30" />
                  </div>
                  <input
                    type="text"
                    id="produk"
                    placeholder="Contoh: Kaos oblong"
                    {...form.register("produk")}
                    className="w-full pl-10 pr-3 py-3 bg-background border border-secondary text-text text-lg rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                  />
                </div>
                {form.formState.errors.produk && (
                  <span className="text-red-500 text-sm">
                    {form.formState.errors.produk.message}
                  </span>
                )}
              </div>

              {/* Hidden inputs */}
              <input type="hidden" {...form.register("created_by")} />
              <input type="hidden" {...form.register("line_divisi")} />
              <input type="hidden" {...form.register("main_product")} />

              {/* Input kodegrp */}
              <div className="mb-5">
                <label
                  htmlFor="kodegrp"
                  className="block text-text font-medium text-base mb-2"
                >
                  KodeGrp
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Home className="text-text/30" />
                  </div>
                  <input
                    type="text"
                    id="kodegrp"
                    placeholder="Contoh: A716"
                    {...form.register("kodegrp")}
                    className="w-full pl-10 pr-3 py-3 bg-background border border-secondary text-text text-lg rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                  />
                </div>
                {form.formState.errors.kodegrp && (
                  <span className="text-red-500 text-sm">
                    {form.formState.errors.kodegrp.message}
                  </span>
                )}
              </div>

              {/* Input stock */}
              <div className="mb-5">
                <label
                  htmlFor="stock"
                  className="block text-text font-medium text-base mb-2"
                >
                  Stock
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Boxes className="text-text/30" />
                  </div>
                  <input
                    type="number"
                    id="stock"
                    placeholder="Contoh: 100"
                    {...form.register("stock")}
                    className="w-full pl-10 pr-3 py-3 bg-background border border-secondary text-text text-lg rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                  />
                </div>
                {form.formState.errors.stock && (
                  <span className="text-red-500 text-sm">
                    {form.formState.errors.stock.message}
                  </span>
                )}
              </div>

              {/* Input tanggal produksi */}
              <div className="mb-5">
                <label
                  htmlFor="production_date"
                  className="block text-text font-medium text-base mb-2"
                >
                  Tanggal Produksi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="text-text/30" />
                  </div>
                  <input
                    type="date"
                    id="production_date"
                    {...form.register("production_date")}
                    className="w-full pl-10 pr-3 py-3 bg-background border border-secondary text-text text-lg rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                  />
                </div>
                {form.formState.errors.production_date && (
                  <span className="text-red-500 text-sm">
                    {form.formState.errors.production_date.message}
                  </span>
                )}
              </div>

              {/* Input status */}
              <div className="mb-5">
                <label
                  htmlFor="status"
                  className="block text-text font-medium text-base mb-2"
                >
                  Status
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="text-text/30" />
                  </div>
                  <select
                    id="status"
                    {...form.register("status")}
                    className="w-full pl-10 pr-3 py-3 bg-background border border-secondary text-text text-lg rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="non-aktif">Non Aktif</option>
                  </select>
                </div>
                {form.formState.errors.status && (
                  <span className="text-red-500 text-sm">
                    {form.formState.errors.status.message}
                  </span>
                )}
              </div>

              {/* Input kategori */}
              <div className="mb-5">
                <label
                  htmlFor="kategori_id"
                  className="block text-text font-medium text-base mb-2"
                >
                  Kategori
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="text-text/30" />
                  </div>
                  <select
                    id="kategori_id"
                    {...form.register("kategori_id")}
                    className="w-full pl-10 pr-3 py-3 bg-background border border-secondary text-text text-lg rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                  >
                    {categoriesOption.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.kategori}
                      </option>
                    ))}
                  </select>
                </div>
                {form.formState.errors.kategori_id && (
                  <span className="text-red-500 text-sm">
                    {form.formState.errors.kategori_id.message}
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center bg-primary rounded-lg py-3 text-white font-semibold text-lg hover:bg-primary/90 hover:scale-105 active:bg-primary active:scale-95 transition-all"
            >
              <Send className="mr-2" />
              Submit
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
