"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Warehouse } from "lucide-react";

const jabatanFormSchema = z.object({
  jabatan: z.string().min(1, "Kategori wajib diisi"),
});

type JabatanFormSchema = z.infer<typeof jabatanFormSchema>;

export default function EditJabatanModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JabatanFormSchema) => void;
  initialData: JabatanFormSchema;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JabatanFormSchema>({
    resolver: zodResolver(jabatanFormSchema),
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
                {...register("jabatan")}
                className="border rounded w-full px-3 py-2"
              />
              {errors.jabatan && (
                <p className="text-red-500 text-sm">{errors.jabatan.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-red-700 hover:bg-red-600 transition-colors font-medium text-white"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
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
