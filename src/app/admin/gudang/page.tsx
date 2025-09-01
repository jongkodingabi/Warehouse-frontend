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
import { Divisi } from "@/utils/types";
import axiosInstance from "@/lib/axios";
import CreateDivisiModal from "@/components/core/CreateDivisiModal";
import toast, { Toaster } from "react-hot-toast";
import z from "zod";
import DeleteConfirmationModal from "@/components/core/Delete.Modal";
import EditDivisiModal from "@/components/core/EditDivisiModal";
import {
  createDivisi,
  deleteDivisi,
  updateDivisi,
} from "@/app/api/divisi/route";

const divisiFormSchema = z.object({
  divisi: z.string(),
  kodedivisi: z.string(),
  status: z.string(),
});

type DivisiFormSchema = z.infer<typeof divisiFormSchema>;

export default function DivisiPage() {
  const [datas, setData] = useState<Divisi[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("-");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [divisiIdToDelete, setDivisiIdToDelete] = useState<Divisi | null>(null);
  const [perPage] = useState(5); // Menampilkan 5 data per halaman
  const [filteredData, setFilteredData] = useState<Divisi[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [divisiToEdit, setDivisiToEdit] = useState<Divisi | null>(null);

  // Hitung statistik berdasarkan data yang sudah difilter
  const totalDivisi = datas.length;
  const activeDivisi = datas.filter((c) => c.status === "aktif").length;
  const unActiveDivisi = datas.filter((c) => c.status == "non-aktif").length;
  const activePercentage = totalDivisi
    ? ((activeDivisi / totalDivisi) * 100).toFixed(2)
    : 0;

  const fetchDivisi = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/api/v1/divisi");
      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditDivisiClick = (divisi: Divisi) => {
    setDivisiToEdit(divisi);
    setIsEditModalOpen(true);
  };

  const handleUpdateDivisi = async (updatedData: DivisiFormSchema) => {
    if (!divisiToEdit) return;
    try {
      await updateDivisi(divisiToEdit.id, updatedData);
      toast.success("divisi berhasil diperbarui");
      setIsEditModalOpen(false);
      fetchDivisi();
    } catch (error) {
      toast.error("Gagal memperbarui divisi");
    }
  };

  const handleCreateDivisi = async (newDivisi: DivisiFormSchema) => {
    try {
      await createDivisi(newDivisi);
      toast.success("Berhasil menambahkan divisi");
      fetchDivisi();
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Gagal menambahkan divisi");
    }
  };

  const handleDeleteIdCategory = async (id: Divisi) => {
    setDivisiIdToDelete(id);
    setDeleteModal(true);
  };

  const handleDeleteDivisi = async (id: number) => {
    try {
      await deleteDivisi(id);
      toast.success("Berhasil menghapus divisi");
      setDeleteModal(false);
      fetchDivisi();
    } catch (error) {
      toast.error("Gagal menghapus divisi");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDivisi();
  }, []);

  // Filter dan search data
  useEffect(() => {
    let filtered = datas;

    // Filter berdasarkan status
    if (statusFilter !== "-") {
      filtered = filtered.filter((data) => data.status === statusFilter);
    }

    // Filter berdasarkan pencarian
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (data) =>
          data.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.divisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.kodedivisi.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset ke halaman pertama saat filter berubah
  }, [statusFilter, searchTerm, datas]);

  // Menangani perubahan filter status
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Menangani perubahan halaman
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

  return (
    <>
      <Toaster position="top-right" />
      <div className="mt-20 p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="">
            <h1 className="text-3xl font-bold text-primary">Data Divisi</h1>
            <p className="mt-4 text-gray-800">
              Kelola divisi data gudang anda.
            </p>
          </div>

          <div className="">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-primary text-white rounded-md cursor-pointer"
            >
              Tambah Divisi +
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
            {/* Card 1 - Total Divisi */}
            <div className="bg-white rounded-lg shadow-md border p-5">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-text font-medium text-sm">
                    Total Divisi
                  </h3>
                  <p className="text-text font-medium text-xl pt-2.5">
                    {totalDivisi}
                  </p>
                </div>
                <div className="bg-primary p-4 rounded-sm text-background">
                  <Group className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Card 2 - Divisi Aktif */}
            <div className="bg-white rounded-lg shadow-md border p-5">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-text font-medium text-sm">
                    Divisi Aktif
                  </h3>
                  <p className="text-text font-medium text-xl pt-2.5">
                    {activeDivisi}
                  </p>
                </div>
                <div className="bg-primary p-4 rounded-sm text-background">
                  <BoxesIcon className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Card 3 - Divisi Non Aktif */}
            <div className="bg-white rounded-lg shadow-md border p-5">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-text font-medium text-sm">
                    Divisi Non Aktif
                  </h3>
                  <p className="text-text font-medium text-xl pt-2.5">
                    {unActiveDivisi}
                  </p>
                </div>
                <div className="bg-primary p-4 rounded-sm text-background">
                  <Archive className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Card 4 - Persentase Aktif */}
            <div className="bg-white rounded-lg shadow-md border p-5">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-text font-medium text-sm">
                    Persentase Aktif
                  </h3>
                  <p className="text-text font-medium text-xl pt-2.5">
                    {activePercentage}%
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
          <select
            name="status-filter"
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusChange}
            className="border border-secondary px-3 sm:px-4 py-2 rounded-sm text-text font-medium text-sm"
          >
            <option value="-">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="non-aktif">Non-aktif</option>
          </select>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <input
            type="search"
            name="search"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Cari kode divisi, divisi, atau short..."
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
          Data Divisi
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-text/15">
              <tr>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  KODE DIVISI
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  DIVISI
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  STATUS
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  TANGGAL PRODUKSI
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
                    {/* Kode Divisi Skeleton */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded-md w-20 mx-auto"></div>
                    </td>
                    {/* Divisi Skeleton */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded-md w-24 mx-auto"></div>
                    </td>
                    {/* Short Skeleton */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded-md w-16 mx-auto"></div>
                    </td>
                    {/* Status Skeleton */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="h-6 bg-gray-300 rounded-full w-16 mx-auto"></div>
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
                    colSpan={6}
                    className="px-4 sm:px-6 py-8 text-center text-text"
                  >
                    {filteredData.length === 0 && datas.length > 0
                      ? "Tidak ada data yang sesuai dengan filter"
                      : "Tidak ada data divisi"}
                  </td>
                </tr>
              ) : (
                currentItems.map((data, idx) => (
                  <tr
                    key={data.id || idx}
                    className="bg-background text-sm font-medium text-text text-center border-y border-secondary"
                  >
                    <td className="px-4 sm:px-6 py-4 uppercase whitespace-nowrap">
                      {data.kodedivisi}
                    </td>
                    <td className="px-4 sm:px-6 py-4 uppercase whitespace-nowrap">
                      {data.divisi}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                              ${
                                data.status === "aktif"
                                  ? "bg-green-500 text-green-100 border border-green-800"
                                  : data.status === "non-aktif"
                                  ? "bg-red-700 text-red-100 border border-red-800"
                                  : data.status === "transfer"
                                  ? "bg-blue-900/50 text-blue-300 border border-blue-800"
                                  : "bg-gray-800/50 text-gray-300 border border-gray-700"
                              }`}
                      >
                        {data.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {data.created_at
                        ? new Date(data.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex gap-2.5 justify-center">
                        <button
                          onClick={() => handleEditDivisiClick(data)}
                          className="text-yellow-600 hover:text-yellow-800 cursor-pointer"
                          title="Edit"
                        >
                          <SquarePen />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteIdCategory({
                              id: data.id,
                              divisi: data.divisi,
                              status: data.status,
                              kodedivisi: data.kodedivisi,
                              short: data.short,
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

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-4 gap-3">
          <div>
            <h3 className="text-sm sm:text-base">
              Menampilkan {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filteredData.length)} dari{" "}
              {filteredData.length} divisi
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
      </div>

      {/* Modals */}
      {isModalOpen && (
        <CreateDivisiModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateDivisi}
        />
      )}

      {isEditModalOpen && divisiToEdit && (
        <EditDivisiModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateDivisi}
          initialData={{
            kodedivisi: divisiToEdit.kodedivisi,
            divisi: divisiToEdit.divisi,
            status: divisiToEdit.status,
          }}
        />
      )}

      {deleteModal && divisiIdToDelete && (
        <DeleteConfirmationModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          itemName={divisiIdToDelete.divisi}
          onConfirm={() => handleDeleteDivisi(divisiIdToDelete.id)}
        />
      )}
    </>
  );
}
