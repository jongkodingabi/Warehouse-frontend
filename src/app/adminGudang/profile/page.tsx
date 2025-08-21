"use client";

import Image from "next/image";
import { Eye, SquarePen, User, Users } from "lucide-react";
import Person from "../../../../public/assets/person.png";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import EditProfileModal from "@/components/core/EditProfileModal";
import axiosInstance from "@/lib/axios"; // Adjust import path as needed
import { fetchUser } from "@/services/auth";
import toast, { Toaster } from "react-hot-toast";
import EditProfileModalAdminGudang from "@/components/core/EditProfileAdminGudang";

export default function ProfilePage() {
  const { user, refreshUser } = useUser(); // Assuming updateUser method exists in UserContext
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditProfile = async (data: any) => {
    try {
      console.log(data);
      // Call API to update profile
      await axiosInstance.post("/api/v1/me", data);
      await refreshUser();
      toast.success("Berhasil update profile");

      // You might want to show a success toast here
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      // You might want to show an error toast here
    }
  };

  return (
    <main className="flex-1 mt-20 p-6 space-y-6">
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
            {user?.name ?? "Guest"}
          </h1>
          <div className="flex items-center gap-2 mt-2 text-slate-600">
            <User className="w-4 h-4" /> {user?.role ?? "Guest"}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
              {user?.divisi?.kodedivisi}
            </span>
            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
              {user?.divisi?.divisi}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-1 px-3 py-2 border rounded-lg text-slate-600 hover:bg-slate-100 text-sm transition-colors"
        >
          <SquarePen className="w-4 h-4" /> Edit
        </button>
      </div>

      {/* Google Connect */}
      {/* <div className="p-6 bg-white rounded-2xl shadow text-center">
        <p className="mb-2 text-slate-600 font-medium">
          Hubungkan dengan Google
        </p>
        <p className="text-sm text-slate-500">
          Masuk lebih mudah dengan akun Google kamu
        </p>
        <button className="mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 text-slate-700 bg-white hover:bg-slate-100">
          <Image
            src="/google-icon.png" // ganti dengan icon Google
            alt="Google"
            width={20}
            height={20}
          />
          Login dengan Google
        </button>
      </div> */}

      {/* Informasi Dasar */}
      <div className="grid grid-cols-1 w-full gap-6">
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="bg-blue-500 text-white px-4 py-3 font-semibold flex items-center gap-2">
            <User className="w-5 h-5" /> Informasi Dasar
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500">Nama</p>
              <p className="font-medium">{user?.name}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500">Jabatan</p>
              <p className="font-medium text-slate-700">
                {user?.jabatan?.name}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500">Divisi</p>
              <p className="font-medium">{user?.divisi?.divisi}</p>
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
