"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Warehouse, Send, X, Group, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

const jabatanFormSchema = z.object({
  jabatan: z.string(),
});

type JabatanFormSchema = z.infer<typeof jabatanFormSchema>;

export default function CreateJabatanModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JabatanFormSchema) => void;
}) {
  const form = useForm<JabatanFormSchema>({
    resolver: zodResolver(jabatanFormSchema),
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
            <h1 className="font-semibold text-2xl text-text">Tambah Jabatan</h1>
          </div>

          <form
            className="mt-5"
            onSubmit={form.handleSubmit((values) => {
              onSubmit(values);
              form.reset();
            })}
          >
            {/* Input jabatan */}
            <div className="mb-5">
              <label
                htmlFor="jabatan"
                className="block text-text font-medium text-base mb-2"
              >
                Jabatan
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Group className="text-text/30" />
                </div>
                <input
                  type="text"
                  id="jabatan"
                  placeholder="Contoh: Kepala divisi"
                  required
                  {...form.register("jabatan")}
                  className="w-full pl-10 pr-3 py-3 bg-background border border-secondary text-text text-lg rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                />
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
