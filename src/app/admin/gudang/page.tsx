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

  const totalDivisi = datas.length;
  const activeDivisi = datas.filter((c) => c.status === "aktif").length;
  const unActiveDivisi = datas.filter((c) => c.status == "non-aktif").length;
  const activePercentage = totalDivisi
    ? ((activeDivisi / totalDivisi) * 100).toFixed(2)
    : 0;

  const fetchDivisi = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/divisi");
      setIsLoading(true);
      setData(response.data);
    } catch (error) {
      console.error(error);
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

  // Menyaring data berdasarkan status dan pencarian
  useEffect(() => {
    const filtered = datas.filter((data) => {
      const matchesStatus =
        statusFilter === "-" || data.status === statusFilter;
      const matchesSearch =
        data.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.divisi.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
    setFilteredData(filtered);
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

  // Slice data untuk pagination
  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <Toaster position="top-right" />
      <div className="mt-20 p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="">
            <h1 className="text-3xl font-bold text-primary">Data Divisi</h1>
            <p className="mt-4 text-gray-800">
              Kelola divisi data guadang anda.
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
        {/* Additional dashboard content can go here */}
      </div>
      {/* Card content goes here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-5">
        {/* Card 1 */}
        <div className="bg-white rounded-lg shadow-md border p-5">
          <div className="flex justify-between">
            <div>
              <h3 className="text-text font-medium text-sm">Total divisi</h3>
              <p className="text-text font-medium text-xl pt-2.5">
                {totalDivisi}
              </p>
            </div>
            <div className="bg-primary p-4 rounded-sm text-background">
              <Group className="w-8 h-8" />
            </div>
          </div>
        </div>
        {/* Card 2 */}
        <div className="bg-white rounded-lg shadow-md border p-5">
          <div className="flex justify-between">
            <div>
              <h3 className="text-text font-medium text-sm">divisi Aktif</h3>
              <p className="text-text font-medium text-xl pt-2.5">
                {activeDivisi}
              </p>
            </div>
            <div className="bg-primary p-4 rounded-sm text-background">
              <BoxesIcon className="w-8 h-8" />
            </div>
          </div>
        </div>
        {/* Card 3 */}
        <div className="bg-white rounded-lg shadow-md border p-5">
          <div className="flex justify-between">
            <div>
              <h3 className="text-text font-medium text-sm">
                divisi Non Aktif
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
        {/* Card 4 */}
        <div className="bg-white rounded-lg shadow-md border p-5">
          <div className="flex justify-between">
            <div>
              <h3 className="text-text font-medium text-sm">
                Persentase Aktif
              </h3>
              <p className="text-text font-medium text-xl pt-2.5">
                {activePercentage} %
              </p>
            </div>
            <div className="bg-primary p-4 rounded-sm text-background">
              <ChartPie className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Filter content goes here */}
      <div className="bg-background mx-2 sm:mx-6 my-6 sm:my-9 border border-secondary rounded-lg px-3 sm:px-6 py-3 flex flex-col sm:flex-row items-stretch sm:items-center flex-wrap gap-4 sm:gap-6 shadow-md">
        <div className="lg:flex lg:items-center grid gap-3">
          <h1 className="text-sm font-medium text-text">Filter:</h1>
          <select
            name="nama-gudang"
            id="nama-gudang"
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
            placeholder="Pencarian..."
            className="border border-secondary px-3 sm:px-4 py-2 rounded-sm font-medium text-sm flex-1"
          />
          <button
            type="submit"
            className="bg-primary/90 hover:bg-primary transition-colors duration-200 cursor-pointer ease-in-out p-2 rounded-sm text-white"
          >
            <Search className="w-6 h-6" />
          </button>
        </div>
      </div>
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
                  SHORT
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  STATUS
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  TANGGAL PRODUKSI
                </th>

                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((data, idx) => (
                <tr
                  key={idx}
                  className="bg-background text-sm font-medium text-text text-center border-y border-secondary"
                >
                  <td className="px-4 sm:px-6 py-4 uppercase whitespace-nowrap">
                    {data.kodedivisi}
                  </td>
                  <td className="px-4 sm:px-6 py-4 uppercase whitespace-nowrap">
                    {data.divisi}
                  </td>
                  <td className="px-4 sm:px-6 py-4 uppercase whitespace-nowrap">
                    {data.short}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                            ${
                              data.status === "aktif"
                                ? "bg-green-500 text-green-100 border border-green-800"
                                : data.status === "non-aktif"
                                ? "bg-red-900/50 text-red-300 border border-red-800"
                                : data.status === "transfer"
                                ? "bg-blue-900/50 text-blue-300 border border-blue-800"
                                : "bg-gray-800/50 text-gray-300 border border-gray-700"
                            }`}
                    >
                      {data.status}
                    </span>{" "}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {data.created_at
                      ? new Date(data.created_at).toLocaleDateString()
                      : "—"}{" "}
                  </td>

                  <td className="px-4 sm:px-6 py-4 flex gap-2.5 justify-center">
                    <button onClick={() => handleEditDivisiClick(data)}>
                      <SquarePen />
                    </button>

                    {/* <button onClick={() => handleDeleteCategory(data.id)}>
                      <Trash />
                    </button> */}
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
                    >
                      <Trash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-4 gap-3">
          <div>
            <h3 className="text-sm sm:text-base">
              Menampilkan {indexOfFirstItem + 1}-{indexOfLastItem} dari{" "}
              {filteredData.length} gudang
            </h3>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="px-3 sm:px-4 py-2 border border-secondary rounded-sm font-medium text-sm text-secondary"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {/* Halaman Dinamis */}
            {[...Array(Math.ceil(filteredData.length / perPage))].map(
              (_, index) => (
                <button
                  key={index}
                  className={`px-3 sm:px-4 py-2 border border-secondary rounded-sm font-medium text-sm ${
                    index + 1 === currentPage ? "bg-text text-background" : ""
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              )
            )}
            <button
              className="px-3 sm:px-4 py-2 border border-secondary rounded-sm font-medium text-sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(filteredData.length / perPage)
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <CreateDivisiModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateDivisi}
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
    </>
  );
}
