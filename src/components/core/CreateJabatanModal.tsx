"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Warehouse, Send, X, Group, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const jabatanFormSchema = z.object({
  jabatan: z.string().min(1, "Jabatan wajib diisi"),
});

type JabatanFormSchema = z.infer<typeof jabatanFormSchema>;

export default function CreateJabatanModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JabatanFormSchema) => Promise<void>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<JabatanFormSchema>({
    resolver: zodResolver(jabatanFormSchema),
    defaultValues: {
      jabatan: "",
    },
  });

  const handleSubmit = async (values: JabatanFormSchema) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
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
          className="bg-background p-8 border border-secondary rounded-xl shadow-xl w-full max-w-lg relative"
        >
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-text/50 hover:text-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center mb-6">
            <div className="inline-block bg-primary p-3 rounded-lg text-white mr-2">
              <Warehouse className="w-6 h-6" />
            </div>
            <h1 className="font-semibold text-2xl text-text">Tambah Jabatan</h1>
          </div>

          <form className="mt-5" onSubmit={form.handleSubmit(handleSubmit)}>
            {/* Input jabatan */}
            <div className="mb-5">
              <label
                htmlFor="jabatan"
                className="block text-text font-medium text-base mb-2"
              >
                Jabatan <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Group className="text-text/30 w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="jabatan"
                  placeholder="Contoh: Kepala divisi"
                  {...form.register("jabatan")}
                  className="w-full pl-10 pr-3 py-3 bg-background border border-secondary text-text text-lg rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all"
                />
              </div>
              {form.formState.errors.jabatan && (
                <span className="text-red-500 text-xs mt-1">
                  {form.formState.errors.jabatan.message}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
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
                    Tambah Jabatan
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
