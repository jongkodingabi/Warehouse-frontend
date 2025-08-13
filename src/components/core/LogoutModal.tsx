import { LogOut, Trash } from "lucide-react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-zinc-900/50 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-all"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-background text-black rounded-xl shadow-2xl p-8 w-full max-w-md border border-gray-800"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="flex items-center mb-4">
            <div className="bg-red-600 rounded-full p-2 mr-3">
              <Trash className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold">Logout Confirmation</h2>
          </div>
          <p className="text-base mb-8 text-black">
            Are you sure you want to log out?{" "}
            <span className="font-bold text-red-400"></span>
            ?<br />
            <span className="text-sm text-zinc-400">
              You will be logged out from this account.
            </span>
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-text hover:bg-text/50 transition-colors font-medium text-white"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors font-semibold flex items-center gap-2 shadow text-white"
            >
              Logout
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
