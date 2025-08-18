"use client";

import {
  BoxesIcon,
  Archive,
  ChartPie,
  Search,
  SquarePen,
  Trash,
  Group,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Category, Jabatan } from "@/utils/types";
import axiosInstance from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";
import z from "zod";
import DeleteConfirmationModal from "@/components/core/Delete.Modal";
import CreateJabatanModal from "@/components/core/CreateJabatanModal";
import {
  createJabatan,
  deleteJabatan,
  updateJabatan,
} from "@/app/api/jabatan/route";
import EditJabatanModal from "@/components/core/EditJabatanModal";

const jabatanFormSchema = z.object({
  jabatan: z.string(),
});

type JabatanFormSchema = z.infer<typeof jabatanFormSchema>;

export default function JabatanPage() {
  const [datas, setData] = useState<Jabatan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("-");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [jabatanIdToDelete, setJabatanIdToDelete] = useState<Jabatan | null>(
    null
  );
  const [perPage] = useState(5); // Menampilkan 5 data per halaman
  const [filteredData, setFilteredData] = useState<Jabatan[]>([]); // Fixed type
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [jabatanToEdit, setJabatanToEdit] = useState<Jabatan | null>(null);

  const fetchJabatan = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/api/v1/jabatan");
      setData(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditJabatanClick = (jabatan: Jabatan) => {
    setJabatanToEdit(jabatan);
    setIsEditModalOpen(true);
  };

  const handleUpdateJabatan = async (updatedData: JabatanFormSchema) => {
    if (!jabatanToEdit) return;
    try {
      await updateJabatan(jabatanToEdit.id, updatedData);
      toast.success("Jabatan berhasil diperbarui");
      setIsEditModalOpen(false);
      fetchJabatan();
    } catch (error) {
      toast.error("Gagal memperbarui jabatan");
    }
  };

  const handleCreateJabatan = async (newJabatan: JabatanFormSchema) => {
    try {
      await createJabatan(newJabatan);
      toast.success("Berhasil menambahkan jabatan");
      fetchJabatan();
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Gagal menambahkan jabatan");
    }
  };

  const handleDeleteIdCategory = async (id: Jabatan) => {
    setJabatanIdToDelete(id);
    setDeleteModal(true);
  };

  const handleDeleteJabatan = async (id: number) => {
    try {
      await deleteJabatan(id);
      toast.success("Berhasil menghapus jabatan");
      setDeleteModal(false);
      fetchJabatan();
    } catch (error) {
      toast.error("Gagal menghapus jabatan");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchJabatan();
  }, []);

  // Filter dan search data - ACTIVATED
  useEffect(() => {
    let filtered = datas;

    // Filter berdasarkan pencarian
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((data) =>
        data.jabatan.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset ke halaman pertama saat filter berubah
  }, [searchTerm, datas]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Menangani perubahan halaman
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Pagination - FIXED
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

  return (
    <>
      <Toaster position="top-right" />
      <div className="mt-20 p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="">
            <h1 className="text-3xl font-bold text-primary">Data Jabatan</h1>
            <p className="mt-4 text-gray-800">
              Kelola data jabatan admin gudang anda.
            </p>
          </div>

          <div className="">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-primary text-white rounded-md cursor-pointer"
            >
              Tambah Jabatan +
            </button>
          </div>
        </div>
      </div>

      {/* Search Section - ACTIVATED */}
      <div className="bg-background mx-2 sm:mx-6 my-6 sm:my-9 border border-secondary rounded-lg px-3 sm:px-6 py-3 flex flex-col sm:flex-row items-stretch sm:items-center flex-wrap gap-4 sm:gap-6 shadow-md">
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <input
            type="search"
            name="search"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Cari jabatan..."
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
        <h2 className="font-medium text-text text-2xl px-4 sm:px-6 py-6">
          Data Jabatan
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-text/15">
              <tr>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  NAMA JABATAN
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
                // Skeleton Loading Rows
                Array.from({ length: perPage }).map((_, index) => (
                  <tr
                    key={`skeleton-${index}`}
                    className="bg-background border-y border-secondary animate-pulse"
                  >
                    {/* Nama Jabatan Skeleton */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded-md w-32 mx-auto"></div>
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
                      </div>
                    </td>
                  </tr>
                ))
              ) : currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 sm:px-6 py-8 text-center text-text"
                  >
                    {filteredData.length === 0 && searchTerm.trim() !== ""
                      ? "Tidak ada data yang sesuai dengan pencarian"
                      : "Tidak ada data jabatan"}
                  </td>
                </tr>
              ) : (
                // Display paginated data
                currentItems.map((data, idx) => (
                  <tr
                    key={data.id || idx}
                    className="bg-background text-sm font-medium text-text text-center border-y border-secondary"
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {data.jabatan}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {data.created_at
                        ? new Date(data.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex gap-2.5 justify-center">
                        <button
                          onClick={() => handleEditJabatanClick(data)}
                          className="text-yellow-600 hover:text-yellow-800 cursor-pointer"
                          title="Edit"
                        >
                          <SquarePen />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteIdCategory({
                              id: data.id,
                              jabatan: data.jabatan,
                              created_at: data.created_at,
                            })
                          }
                          className="text-red-600 hover:text-red-800 cursor-pointer"
                          title="Hapus"
                        >
                          <Trash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - ACTIVATED AND FIXED */}
        {filteredData.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-4 gap-3">
            <div>
              <h3 className="text-sm sm:text-base">
                Menampilkan {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, filteredData.length)} dari{" "}
                {filteredData.length} jabatan
              </h3>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 sm:px-4 py-2 border border-secondary rounded-sm font-medium text-sm ${
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
                  className={`px-3 sm:px-4 py-2 rounded-sm font-medium text-sm ${
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
                className={`px-3 sm:px-4 py-2 border border-secondary rounded-sm font-medium text-sm ${
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
      {isModalOpen && (
        <CreateJabatanModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateJabatan}
        />
      )}
      {deleteModal && jabatanIdToDelete && (
        <DeleteConfirmationModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          itemName={jabatanIdToDelete.jabatan}
          onConfirm={() => handleDeleteJabatan(jabatanIdToDelete.id)}
        />
      )}
      {isEditModalOpen && jabatanToEdit && (
        <EditJabatanModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateJabatan}
          initialData={{
            jabatan: jabatanToEdit.jabatan,
          }}
        />
      )}
    </>
  );
}
