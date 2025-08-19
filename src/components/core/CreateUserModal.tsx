"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Send,
  X,
  Mail,
  Lock,
  UserCheck,
  Building,
  Briefcase,
  Eye,
  EyeOff,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Jabatan, Divisi } from "@/utils/types";
import axiosInstance from "@/lib/axios";

// User form schema
const userFormSchema = z
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
      .min(1, "Password wajib diisi")
      .min(8, "Password minimal 8 karakter")
      .max(100, "Password maksimal 100 karakter")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password harus mengandung minimal 1 huruf kecil, 1 huruf besar, dan 1 angka"
      ),

    password_confirmation: z.string().min(1, "Konfirmasi password wajib diisi"),

    role: z
      .string()
      .min(1, "Role wajib dipilih")
      .refine((val) => ["superadmin", "admingudang"].includes(val), {
        message: "Role tidak valid",
      }),

    jabatan_id: z.coerce
      .number()
      .int("Jabatan ID harus berupa bilangan bulat")
      .positive("Jabatan ID harus berupa angka positif"),

    divisi_id: z.coerce
      .number()
      .int("Divisi ID harus berupa bilangan bulat")
      .positive("Divisi ID harus berupa angka positif"),
  })
  .superRefine(({ password_confirmation, password }, ctx) => {
    if (password_confirmation !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Konfirmasi password tidak sesuai",
        path: ["password_confirmation"],
      });
    }
  });

type UserFormSchema = z.infer<typeof userFormSchema>;

export default function CreateUserModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormSchema) => void;
}) {
  const [jabatanOptions, setJabatanOptions] = useState<Jabatan[]>([]);
  const [divisiOptions, setDivisiOptions] = useState<Divisi[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const form = useForm<UserFormSchema>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      role: "",
      jabatan_id: 0,
      divisi_id: 0,
    },
  });

  useEffect(() => {
    const loadData = async () => {
      if (isOpen) {
        setIsDataLoaded(false);

        // Fetch jabatan and divisi data first
        const [jabatanData, divisiData] = await Promise.all([
          fetchJabatan(),
          fetchDivisi(),
        ]);

        // Then reset form with user data
        form.reset({
          name: "",
          email: "",
          password: "",
          password_confirmation: "",
          role: "",
          jabatan_id: 1,
          divisi_id: 1,
        });

        setIsDataLoaded(true);
      }
    };

    loadData();
  }, [isOpen]);

  const fetchJabatan = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/jabatan");
      setJabatanOptions(response.data.data);
    } catch (error) {
      console.log("Error fetching jabatan:", error);
    }
  };

  const fetchDivisi = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/divisi");
      setDivisiOptions(response.data);
    } catch (error) {
      console.log("Error fetching divisi:", error);
    }
  };

  const handleSubmit = async (values: UserFormSchema) => {
    setIsLoading(true);
    try {
      await onSubmit(values);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
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
          className="bg-background p-6 border border-secondary rounded-xl shadow-xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-text/50 hover:text-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center mb-6">
            <div className="inline-block bg-primary p-3 rounded-lg text-white mr-3">
              <User className="w-6 h-6" />
            </div>
            <h1 className="font-semibold text-2xl text-text">Tambah User</h1>
          </div>

          {/* Show loading indicator while data is being loaded */}
          {!isDataLoaded ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600/30 border-t-blue-600"></div>
              <span className="ml-3 text-text">Memuat data...</span>
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Input Nama */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-text font-medium text-sm mb-2"
                  >
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="text-text/30 w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      placeholder="Masukkan nama lengkap"
                      {...form.register("name")}
                      className="w-full pl-10 pr-3 py-2.5 bg-background border border-secondary text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
                    className="block text-text font-medium text-sm mb-2"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-text/30 w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      placeholder="user@example.com"
                      {...form.register("email")}
                      className="w-full pl-10 pr-3 py-2.5 bg-background border border-secondary text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
                    className="block text-text font-medium text-sm mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="text-text/30 w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Masukkan password"
                      {...form.register("password")}
                      className="w-full pl-10 pr-12 py-2.5 bg-background border border-secondary text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-text/30 hover:text-text"
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
                    className="block text-text font-medium text-sm mb-2"
                  >
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="text-text/30 w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="Konfirmasi password"
                      {...form.register("password_confirmation")}
                      className="w-full pl-10 pr-12 py-2.5 bg-background border border-secondary text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-text/30 hover:text-text"
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

                {/* Input Role */}
                <div>
                  <label
                    htmlFor="role"
                    className="block text-text font-medium text-sm mb-2"
                  >
                    Role
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCheck className="text-text/30 w-4 h-4" />
                    </div>
                    <select
                      id="role"
                      {...form.register("role")}
                      className="w-full pl-10 pr-3 py-2.5 bg-background border border-secondary text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >
                      <option value="">Pilih Role</option>
                      <option value="superadmin">Super Admin</option>
                      <option value="admingudang">Admin Gudang</option>
                    </select>
                  </div>
                  {form.formState.errors.role && (
                    <span className="text-red-500 text-xs mt-1">
                      {form.formState.errors.role.message}
                    </span>
                  )}
                </div>

                {/* Input Jabatan */}
                <div>
                  <label
                    htmlFor="jabatan_id"
                    className="block text-text font-medium text-sm mb-2"
                  >
                    Jabatan
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="text-text/30 w-4 h-4" />
                    </div>
                    <select
                      id="jabatan_id"
                      {...form.register("jabatan_id")}
                      className="w-full pl-10 pr-3 py-2.5 bg-background border border-secondary text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >
                      <option value="">Pilih Jabatan</option>
                      {jabatanOptions.map((jabatan) => (
                        <option key={jabatan.id} value={jabatan.id}>
                          {jabatan.jabatan}
                        </option>
                      ))}
                    </select>
                  </div>
                  {form.formState.errors.jabatan_id && (
                    <span className="text-red-500 text-xs mt-1">
                      {form.formState.errors.jabatan_id.message}
                    </span>
                  )}
                </div>

                {/* Input Divisi */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="divisi_id"
                    className="block text-text font-medium text-sm mb-2"
                  >
                    Divisi
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="text-text/30 w-4 h-4" />
                    </div>
                    <select
                      id="divisi_id"
                      {...form.register("divisi_id")}
                      className="w-full pl-10 pr-3 py-2.5 bg-background border border-secondary text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >
                      <option value="">Pilih Divisi</option>
                      {divisiOptions.map((divisi) => (
                        <option key={divisi.id} value={divisi.id}>
                          {divisi.kodedivisi} - {divisi.divisi}
                        </option>
                      ))}
                    </select>
                  </div>
                  {form.formState.errors.divisi_id && (
                    <span className="text-red-500 text-xs mt-1">
                      {form.formState.errors.divisi_id.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center bg-primary rounded-lg py-3 text-white font-semibold text-base hover:bg-primary/90 hover:scale-[1.02] active:bg-primary active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 w-4 h-4" />
                      Tambah User
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
