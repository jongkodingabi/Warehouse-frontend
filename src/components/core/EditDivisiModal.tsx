"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Warehouse, Home, Code, Clock, Send, X } from "lucide-react";

const divisiFormSchema = z.object({
  kodedivisi: z.string().min(1, "Kode wajib diisi"),
  divisi: z.string().min(1, "Divisi wajib diisi"),
  status: z.string().min(1, "Status wajib diisi"),
});

type DivisiFormSchema = z.infer<typeof divisiFormSchema>;

export default function EditDivisiModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DivisiFormSchema) => void;
  initialData: DivisiFormSchema;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DivisiFormSchema>({
    resolver: zodResolver(divisiFormSchema),
    defaultValues: initialData,
  });

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
          <div className="flex items-center justify-center mb-6">
            <div className="inline-block bg-primary p-3 rounded-lg text-white mr-2">
              <Warehouse className="w-6 h-6" />
            </div>
            <h1 className="font-semibold text-2xl text-text">Edit Divisi</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="mb-5">
              <label
                htmlFor="kodedivisi"
                className="block text-text font-medium text-base mb-2"
              >
                Kode Divisi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Code className="text-text/30" />
                </div>
                <input
                  type="text"
                  id="kodedivisi"
                  placeholder="Kode: A761"
                  required
                  {...register("kodedivisi")}
                  className="w-full pl-10 pr-3 py-3 bg-background border border-secondary text-text text-lg rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                />
              </div>
            </div>

            <div className="mb-5">
              <label
                htmlFor="divisi"
                className="block text-text font-medium text-base mb-2"
              >
                Divisi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Home className="text-text/30" />
                </div>
                <input
                  type="text"
                  id="divisi"
                  placeholder="Contoh: IT Enginering"
                  required
                  {...register("divisi")}
                  className="w-full pl-10 pr-3 py-3 bg-background border border-secondary text-text text-lg rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                />
              </div>
            </div>

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
                  required
                  {...register("status")}
                  className="w-full pl-10 pr-3 py-3 bg-background border border-secondary text-text text-lg rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                >
                  <option value="aktif">Aktif</option>
                  <option value="non-aktif">Non Aktif</option>
                </select>
              </div>
            </div>

           {/* Action Buttons */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 flex items-center justify-center bg-gray-500 rounded-lg py-3 text-white font-semibold text-base hover:bg-gray-600 hover:scale-[1.02] active:bg-gray-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="mr-2 w-4 h-4" />
                  Batal
                </button>

                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center bg-primary rounded-lg py-3 text-white font-semibold text-base hover:bg-primary/90 hover:scale-[1.02] active:bg-primary/80 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                <Send className="mr-2 w-4 h-4" />
                Tambah Divisi
                </button>
              </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
