"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Warehouse } from "lucide-react";

const categoryFormSchema = z.object({
  kategori: z.string().min(1, "Kategori wajib diisi"),
  status: z.string().min(1, "Status wajib diisi"),
});

type CategoryFormSchema = z.infer<typeof categoryFormSchema>;

export default function EditCategoryModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormSchema) => void;
  initialData: CategoryFormSchema;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormSchema>({
    resolver: zodResolver(categoryFormSchema),
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
            <h1 className="font-semibold text-2xl text-text">Edit Kategori</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block mb-1">Kategori</label>
              <input
                {...register("kategori")}
                className="border rounded w-full px-3 py-2"
              />
              {errors.kategori && (
                <p className="text-red-500 text-sm">
                  {errors.kategori.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1">Status</label>
              <select
                {...register("status")}
                className="border rounded w-full px-3 py-2"
              >
                <option value="aktif">Aktif</option>
                <option value="non-aktif">Non-aktif</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-text hover:bg-text/50 transition-colors font-medium text-white"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Simpan
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
