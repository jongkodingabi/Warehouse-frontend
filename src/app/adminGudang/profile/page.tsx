"use client";

import Image from "next/image";
import { Eye, SquarePen, User, Users } from "lucide-react";
import Person from "../../../../public/assets/person.png";
import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";
import EditProfileModalAdminGudang from "@/components/core/EditProfileAdminGudang";

export default function ProfilePage() {
  const { user, refreshUser } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Add loading effect to handle initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [user]);

  const handleEditProfile = async (data: any) => {
    try {
      await axiosInstance.post("/api/v1/me", data);
      await refreshUser();
      toast.success("Berhasil update profile");
      console.log("Profile updated successfully");
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
    }
  };

  // Show loading state while user data is being fetched
  if (isLoading) {
    return (
      <main className="flex-1 mt-20 p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600/30 border-t-blue-600"></div>
          <span className="ml-3 text-slate-600">Memuat profil...</span>
        </div>
      </main>
    );
  }

  // Show error state if user is not available after loading
  if (!user) {
    return (
      <main className="flex-1 mt-20 p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Tidak dapat memuat profil
            </h2>
            <p className="text-slate-600 mb-4">
              Silakan refresh halaman atau login kembali
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Refresh Halaman
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 mt-20 p-6 space-y-6">
      <Toaster position="top-right" />

      {/* Profile Header */}
      <div className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow">
        <div className="relative flex flex-col items-center">
          <Image
            src={Person}
            alt="Profile"
            width={100}
            height={100}
            className="rounded-full object-cover border-4 border-white shadow"
          />
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-blue-600">
            {user.name || "Guest"}
          </h1>
          <div className="flex items-center gap-2 mt-2 text-slate-600">
            <User className="w-4 h-4" /> {user.role || "Guest"}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {user.divisi?.kodedivisi && (
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                {user.divisi.kodedivisi}
              </span>
            )}
            {user.divisi?.divisi && (
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                {user.divisi.divisi}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-1 px-3 py-2 border rounded-lg text-slate-600 hover:bg-slate-100 text-sm transition-colors"
        >
          <SquarePen className="w-4 h-4" /> Edit
        </button>
      </div>

      {/* Informasi Dasar */}
      <div className="grid grid-cols-1 w-full gap-6">
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="bg-blue-500 text-white px-4 py-3 font-semibold flex items-center gap-2">
            <User className="w-5 h-5" /> Informasi Dasar
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500">Nama</p>
              <p className="font-medium">{user.name || "-"}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500">Jabatan</p>
              <p className="font-medium text-slate-700">
                {user.jabatan?.name || "-"}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500">Email</p>
              <p className="font-medium">{user.email || "-"}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500">Divisi</p>
              <p className="font-medium">{user.divisi?.divisi || "-"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModalAdminGudang
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditProfile}
        userData={user}
      />
    </main>
  );
}
