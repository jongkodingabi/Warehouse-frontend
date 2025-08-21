"use client";

import {
  Users,
  UserCheck,
  UserX,
  ChartPie,
  Search,
  SquarePen,
  Trash,
  Download,
  FolderInput,
  Eye,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import { User } from "@/utils/types";
import axiosInstance from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";
import z from "zod";
import { createUser, deleteUser, updateUser } from "@/app/api/user/route";
import DeleteConfirmationModal from "@/components/core/Delete.Modal";
import CreateUserModal from "@/components/core/CreateUserModal";
import EditUserModal from "@/components/core/EditUserModal";

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

export default function UserPage() {
  const [datas, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState("-");
  const [divisiFilter, setDivisiFilter] = useState("-");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [userIdToDelete, setUserIdToDelete] = useState<User | null>(null);
  const [perPage] = useState(5); // Menampilkan 5 data per halaman
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Hitung statistik berdasarkan data yang sudah difilter
  const totalUsers = datas.length;
  const superAdminUsers = datas.filter((u) => u.role === "superadmin").length;
  const adminGudangUsers = datas.filter((u) => u.role === "admingudang").length;
  const superAdminPercentage = totalUsers
    ? ((superAdminUsers / totalUsers) * 100).toFixed(2)
    : 0;

  // Mendapatkan daftar divisi unik untuk dropdown filter
  const uniqueDivisi = Array.from(
    new Set(datas.map((user) => user.divisi.divisi))
  ).filter(Boolean);

  // Mendapatkan daftar role unik untuk dropdown filter
  const uniqueRoles = Array.from(
    new Set(datas.map((user) => user.role))
  ).filter(Boolean);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/api/v1/user");
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Gagal memuat data user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (updatedData: any) => {
    if (!userToEdit || !userToEdit.id) {
      toast.error("ID user tidak ditemukan");
      return;
    }

    try {
      await updateUser(userToEdit.id, updatedData);
      toast.success("User berhasil diperbarui");
      setIsEditModalOpen(false);
      setUserToEdit(null);
      await fetchUsers();
    } catch (error) {
      toast.error("Gagal memperbarui user");
      console.error("Error updating user:", error);
    }
  };

  const handleEditUserClick = (user: User) => {
    console.log(user);
    setUserToEdit(user);
    setIsEditModalOpen(true);
  };

  const handleCreateUser = async (newUser: UserFormSchema) => {
    try {
      await createUser(newUser);
      toast.success("Berhasil menambahkan user");
      fetchUsers();
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Gagal menambahkan user");
      console.error("Error creating user:", error);
    }
  };

  const handleDeleteIdUser = async (user: User) => {
    setUserIdToDelete(user);
    setDeleteModal(true);
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id);
      toast.success("Berhasil menghapus user");
      setDeleteModal(false);
      fetchUsers();
    } catch (error) {
      toast.error("Gagal menghapus user");
      console.error("Error deleting user:", error);
    }
  };

  const openDetailModal = (user: User) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter dan search data
  useEffect(() => {
    let filtered = datas;

    // Filter berdasarkan role
    if (roleFilter !== "-") {
      filtered = filtered.filter((data) => data.role === roleFilter);
    }

    // Filter berdasarkan divisi
    if (divisiFilter !== "-") {
      filtered = filtered.filter((data) => data.divisi.divisi === divisiFilter);
    }

    // Filter berdasarkan pencarian
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (data) =>
          data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.jabatan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.divisi.divisi.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset ke halaman pertama saat filter berubah
  }, [roleFilter, divisiFilter, searchTerm, datas]);

  // Handle perubahan filter role
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
  };

  // Handle perubahan filter divisi
  const handleDivisiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDivisiFilter(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle perubahan halaman
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Pagination
  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / perPage);

  // Generate page numbers untuk pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  // Format role display
  const formatRole = (role: string) => {
    switch (role) {
      case "superadmin":
        return "Super Admin";
      case "admingudang":
        return "Admin Gudang";
      default:
        return role;
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "superadmin":
        return "bg-purple-500 text-purple-100 border border-purple-800";
      case "admingudang":
        return "bg-blue-500 text-blue-100 border border-blue-800";
      default:
        return "bg-gray-500 text-gray-100 border border-gray-800";
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="mt-20 p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="">
            <h1 className="text-3xl font-bold text-primary">Data User</h1>
            <p className="mt-4 text-gray-800">Kelola data user sistem anda.</p>
          </div>

          <div className="">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-primary text-white rounded-md cursor-pointer hover:bg-primary/90 transition-colors"
            >
              Tambah User +
            </button>
          </div>
        </div>
      </div>

      {/* Card Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-5">
        {isLoading ? (
          // Skeleton Cards
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`card-skeleton-${index}`}
              className="bg-white rounded-lg shadow-md border p-5 animate-pulse"
            >
              <div className="flex justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-24 mb-3"></div>
                  <div className="h-6 bg-gray-300 rounded w-12"></div>
                </div>
                <div className="bg-gray-300 p-4 rounded-sm w-16 h-16"></div>
              </div>
            </div>
          ))
        ) : (
          <>
            {/* Card 1 - Total User */}
            <div className="bg-white rounded-lg shadow-md border p-5">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-text font-medium text-sm">Total User</h3>
                  <p className="text-text font-medium text-xl pt-2.5">
                    {totalUsers}
                  </p>
                </div>
                <div className="bg-primary p-4 rounded-sm text-background">
                  <Users className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Card 2 - Super Admin */}
            <div className="bg-white rounded-lg shadow-md border p-5">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-text font-medium text-sm">Super Admin</h3>
                  <p className="text-text font-medium text-xl pt-2.5">
                    {superAdminUsers}
                  </p>
                </div>
                <div className="bg-purple-500 p-4 rounded-sm text-white">
                  <Shield className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Card 3 - Admin Gudang */}
            <div className="bg-white rounded-lg shadow-md border p-5">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-text font-medium text-sm">
                    Admin Gudang
                  </h3>
                  <p className="text-text font-medium text-xl pt-2.5">
                    {adminGudangUsers}
                  </p>
                </div>
                <div className="bg-blue-500 p-4 rounded-sm text-white">
                  <UserCheck className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Card 4 - Persentase Super Admin */}
            <div className="bg-white rounded-lg shadow-md border p-5">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-text font-medium text-sm">
                    Persentase Super Admin
                  </h3>
                  <p className="text-text font-medium text-xl pt-2.5">
                    {superAdminPercentage}%
                  </p>
                </div>
                <div className="bg-primary p-4 rounded-sm text-background">
                  <ChartPie className="w-8 h-8" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Filter Section */}
      <div className="bg-background mx-2 sm:mx-6 my-6 sm:my-9 border border-secondary rounded-lg px-3 sm:px-6 py-3 flex flex-col sm:flex-row items-stretch sm:items-center flex-wrap gap-4 sm:gap-6 shadow-md">
        <div className="lg:flex lg:items-center grid gap-3">
          <h1 className="text-sm font-medium text-text">Filter:</h1>

          {/* Filter Role */}
          <select
            name="role-filter"
            id="role-filter"
            value={roleFilter}
            onChange={handleRoleChange}
            className="border border-secondary px-3 sm:px-4 py-2 rounded-sm text-text font-medium text-sm"
          >
            <option value="-">Semua Role</option>
            {uniqueRoles.map((role, index) => (
              <option key={index} value={role}>
                {formatRole(role)}
              </option>
            ))}
          </select>

          {/* Filter Divisi */}
          <select
            name="divisi-filter"
            id="divisi-filter"
            value={divisiFilter}
            onChange={handleDivisiChange}
            className="border border-secondary px-3 sm:px-4 py-2 rounded-sm text-text font-medium text-sm"
          >
            <option value="-">Semua Divisi</option>
            {uniqueDivisi.map((divisi, index) => (
              <option key={index} value={divisi}>
                {divisi}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <input
            type="search"
            name="search"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Cari nama, email, role, jabatan, atau divisi..."
            className="border border-secondary px-3 sm:px-4 py-2 rounded-sm font-medium text-sm flex-1"
          />
          <button
            type="button"
            className="bg-primary/90 hover:bg-primary transition-colors duration-200 cursor-pointer ease-in-out p-2 rounded-sm text-white"
          >
            <Search className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-background border border-secondary rounded-lg mx-2 sm:mx-6 mb-6">
        <div className="flex justify-between items-center mx-4 sm:mx-6 py-6">
          <h2 className="font-medium text-text text-2xl">Data User</h2>
          <div className="flex items-center gap-3">
            <button className="bg-secondary text-white p-2 rounded-sm hover:bg-secondary/80 transition-colors">
              <Download className="w-5 h-5" />
            </button>
            <button className="bg-secondary text-white p-2 rounded-sm hover:bg-secondary/80 transition-colors">
              <FolderInput className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-text/15">
              <tr>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  NAMA
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  EMAIL
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  ROLE
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  JABATAN
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  DIVISI
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  TANGGAL DIBUAT
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  AKSI
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: perPage }).map((_, index) => (
                  <tr
                    key={`skeleton-${index}`}
                    className="bg-background border-y border-secondary animate-pulse"
                  >
                    {/* Nama Skeleton */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded-md w-20 mx-auto"></div>
                    </td>
                    {/* Email Skeleton */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded-md w-32 mx-auto"></div>
                    </td>
                    {/* Role Skeleton */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="h-6 bg-gray-300 rounded-full w-20 mx-auto"></div>
                    </td>
                    {/* Jabatan Skeleton */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded-md w-24 mx-auto"></div>
                    </td>
                    {/* Divisi Skeleton */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded-md w-28 mx-auto"></div>
                    </td>
                    {/* Tanggal Skeleton */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded-md w-20 mx-auto"></div>
                    </td>
                    {/* Aksi Skeleton */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex gap-2.5 justify-center">
                        <div className="h-6 w-6 bg-gray-300 rounded"></div>
                        <div className="h-6 w-6 bg-gray-300 rounded"></div>
                        <div className="h-6 w-6 bg-gray-300 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 sm:px-6 py-8 text-center text-text"
                  >
                    {filteredData.length === 0 && datas.length > 0
                      ? "Tidak ada data yang sesuai dengan filter"
                      : "Tidak ada data user"}
                  </td>
                </tr>
              ) : (
                currentItems.map((data, idx) => (
                  <tr
                    key={data.id || idx}
                    className="bg-background text-sm font-medium text-text text-center border-y border-secondary hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-semibold">
                      {data.name}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {data.email}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(
                          data.role
                        )}`}
                      >
                        {formatRole(data.role)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {data.jabatan.name}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-center">
                        <div className="font-medium">{data.divisi.divisi}</div>
                        <div className="text-xs text-gray-500">
                          {data.divisi.kodedivisi}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {data.createdAt
                        ? new Date(data.createdAt).toLocaleDateString("id-ID")
                        : "—"}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex gap-2.5 justify-center">
                        <button
                          onClick={() => openDetailModal(data)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditUserClick(data)}
                          className="text-yellow-600 hover:text-yellow-800 transition-colors"
                          title="Edit"
                        >
                          <SquarePen className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteIdUser(data)}
                          className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-4 gap-3">
            <div>
              <h3 className="text-sm sm:text-base">
                Menampilkan {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, filteredData.length)} dari{" "}
                {filteredData.length} user
              </h3>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 sm:px-4 py-2 border border-secondary rounded-sm font-medium text-sm transition-colors ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-secondary hover:bg-gray-50"
                }`}
              >
                Previous
              </button>

              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 sm:px-4 py-2 rounded-sm font-medium text-sm transition-colors ${
                    currentPage === pageNum
                      ? "bg-text text-background glow-box"
                      : "border border-secondary text-text hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-3 sm:px-4 py-2 border border-secondary rounded-sm font-medium text-sm transition-colors ${
                  currentPage === totalPages || totalPages === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-secondary hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {deleteModal && userIdToDelete && (
        <DeleteConfirmationModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          itemName={userIdToDelete.name}
          onConfirm={() => handleDeleteUser(userIdToDelete.id)}
        />
      )}
      {isModalOpen && (
        <CreateUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateUser}
        />
      )}
      {isEditModalOpen && userToEdit && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setUserToEdit(null);
          }}
          onSubmit={handleUpdateUser}
          userData={userToEdit}
        />
      )}
      {/* Detail User Modal */}
      {/* {isDetailModalOpen && selectedUser && (
        <DetailUserModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          user={selectedUser}
        />
      )} */}
    </>
  );
}
