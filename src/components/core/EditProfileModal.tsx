"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User, Send, X, Mail, Lock, Eye, EyeOff, Edit3 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import toast, { Toaster } from "react-hot-toast";

// Profile edit form schema - password is optional for editing
const profileEditFormSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nama wajib diisi")
      .min(2, "Nama minimal 2 karakter")
      .max(50, "Nama maksimal 50 karakter")
      .regex(/^[a-zA-Z\s]+$/, "Nama hanya boleh berisi huruf dan spasi"),

    email: z
      .string()
      .min(1, "Email wajib diisi")
      .email("Format email tidak valid")
      .max(100, "Email maksimal 100 karakter"),

    password: z
      .string()
      .optional()
      .refine((val) => {
        if (val && val.length > 0) {
          return val.length >= 8;
        }
        return true;
      }, "Password minimal 8 karakter")
      .refine((val) => {
        if (val && val.length > 0) {
          return val.length <= 100;
        }
        return true;
      }, "Password maksimal 100 karakter")
      .refine((val) => {
        if (val && val.length > 0) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val);
        }
        return true;
      }, "Password harus mengandung minimal 1 huruf kecil, 1 huruf besar, dan 1 angka"),

    password_confirmation: z.string().optional(),
  })
  .superRefine(({ password_confirmation, password }, ctx) => {
    // Only validate password confirmation if password is provided
    if (password && password.length > 0) {
      if (!password_confirmation) {
        ctx.addIssue({
          code: "custom",
          message: "Konfirmasi password wajib diisi jika password diubah",
          path: ["password_confirmation"],
        });
      } else if (password_confirmation !== password) {
        ctx.addIssue({
          code: "custom",
          message: "Konfirmasi password tidak sesuai",
          path: ["password_confirmation"],
        });
      }
    }
  });

type ProfileEditFormSchema = z.infer<typeof profileEditFormSchema>;

export default function EditProfileModal({
  isOpen,
  onClose,
  onSubmit,
  userData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProfileEditFormSchema) => Promise<void>;
  userData: any;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { user } = useUser();

  const form = useForm<ProfileEditFormSchema>({
    resolver: zodResolver(profileEditFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  // Load data and set form values when modal opens
  useEffect(() => {
    const loadData = async () => {
      if (isOpen && userData) {
        setIsDataLoaded(false);

        // Reset form with user data
        form.reset({
          name: userData.name || "",
          email: userData.email || "",
          password: "",
          password_confirmation: "",
        });

        setIsDataLoaded(true);
      }
    };

    loadData();
  }, [isOpen, userData, form]);

  const handleSubmit = async (values: ProfileEditFormSchema) => {
    setIsLoading(true);
    try {
      // Prepare data for submission
      const submitData = { ...values };

      // Remove password fields if they're empty (not changing password)
      if (!values.password || values.password.length === 0) {
        delete submitData.password;
        delete submitData.password_confirmation;
      }

      await onSubmit(submitData);
      form.reset();
      onClose();
    } catch (error: string | any) {
      if (error.response && error.response.status === 422) {
        const message = "Email sudah terpakai";
        toast.error(message);
      } else {
        toast.error(
          "Gagal mengubah data: " +
            (error.response?.data?.message || error.message)
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setIsDataLoaded(false);
    onClose();
  };

  if (!isOpen || !userData) return null;

  return (
    <>
      <Toaster position="top-right" />
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
            className="bg-white p-6 border border-gray-200 rounded-xl shadow-xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center mb-6">
              <div className="inline-block bg-blue-600 p-3 rounded-lg text-white mr-3">
                <Edit3 className="w-6 h-6" />
              </div>
              <h1 className="font-semibold text-2xl text-slate-800">
                Edit Profile
              </h1>
            </div>

            {/* Show loading indicator while data is being loaded */}
            {!isDataLoaded ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600/30 border-t-blue-600"></div>
                <span className="ml-3 text-slate-800">Memuat data...</span>
              </div>
            ) : (
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(handleSubmit)}
              >
                {/* Input Nama */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-slate-700 font-medium text-sm mb-2"
                  >
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="text-slate-400 w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      placeholder="Masukkan nama lengkap"
                      {...form.register("name")}
                      className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                    />
                  </div>
                  {form.formState.errors.name && (
                    <span className="text-red-500 text-xs mt-1">
                      {form.formState.errors.name.message}
                    </span>
                  )}
                </div>

                {/* Input Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-slate-700 font-medium text-sm mb-2"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-slate-400 w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      placeholder="user@example.com"
                      {...form.register("email")}
                      className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                    />
                  </div>
                  {form.formState.errors.email && (
                    <span className="text-red-500 text-xs mt-1">
                      {form.formState.errors.email.message}
                    </span>
                  )}
                </div>

                {/* Input Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-slate-700 font-medium text-sm mb-2"
                  >
                    Password Baru
                    <span className="text-slate-400 text-xs ml-1">
                      (Kosongkan jika tidak ingin mengubah)
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="text-slate-400 w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Masukkan password baru"
                      {...form.register("password")}
                      className="w-full pl-10 pr-12 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <span className="text-red-500 text-xs mt-1">
                      {form.formState.errors.password.message}
                    </span>
                  )}
                </div>

                {/* Input Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-slate-700 font-medium text-sm mb-2"
                  >
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="text-slate-400 w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="Konfirmasi password baru"
                      {...form.register("password_confirmation")}
                      className="w-full pl-10 pr-12 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {form.formState.errors.password_confirmation && (
                    <span className="text-red-500 text-xs mt-1">
                      {form.formState.errors.password_confirmation.message}
                    </span>
                  )}
                </div>

                {/* Info Text */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 text-sm">
                    <strong>Catatan:</strong> Kosongkan field password jika
                    tidak ingin mengubah password yang sudah ada.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center bg-gray-500 rounded-lg py-3 text-white font-semibold text-base hover:bg-gray-600 hover:scale-[1.02] active:bg-gray-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="mr-2 w-4 h-4" />
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center bg-blue-600 rounded-lg py-3 text-white font-semibold text-base hover:bg-blue-700 hover:scale-[1.02] active:bg-blue-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2"></div>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 w-4 h-4" />
                        Simpan Perubahan
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
