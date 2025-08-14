"use client";

import {
  BoxesIcon,
  Archive,
  ChartPie,
  Search,
  SquarePen,
  Trash,
  Group,
  Download,
  FolderInput,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BarangResponse, Barang } from "@/utils/types";
import axiosInstance from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";
import z from "zod";
import Link from "next/link";

import { createBarang, deleteBarang } from "@/app/api/product/route";
import DeleteConfirmationModal from "@/components/core/Delete.Modal";
import CreateBarangModal from "@/components/core/CreateBarangModal";

const barangFormSchema = z.object({
  kategori_id: z.number(),
  created_by: z.number(),
  produk: z.string(),
  production_date: z.string(),
  stock: z.number(),
  kodegrp: z.string(),
  status: z.string(),
  line_divisi: z.number(),
  main_product: z.number(),
});

type BarangFormSchema = z.infer<typeof barangFormSchema>;

export default function Kategori() {
  const [datas, setData] = useState<Barang[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("-");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [barangIdToDelete, setBarangIdToDelete] = useState<Barang | null>(null);
  const [perPage] = useState(5); // Menampilkan 5 data per halaman
  const [filteredData, setFilteredData] = useState<BarangResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // const [categoryToEdit, setCategoryToEdit] = useState<BarangResponse | null>(
  //   null
  // );

  // const totalCategories = datas.length;
  // const activeCategories = datas.filter((c) => c.status === "aktif").length;
  // const unActiveCategories = datas.filter(
  //   (c) => c.status == "non-aktif"
  // ).length;
  // const activePercentage = totalCategories
  //   ? ((activeCategories / totalCategories) * 100).toFixed(2)
  //   : 0;

  const fetchBarang = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/barang");
      setIsLoading(true);
      setData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  // const handleEditCategoryClick = (category: Category) => {
  //   setCategoryToEdit(category);
  //   setIsEditModalOpen(true);
  // };

  // const handleUpdateCategory = async (updatedData: BarangFormSchema) => {
  //   if (!categoryToEdit) return;
  //   try {
  //     await updateCategory(categoryToEdit.id, updatedData);
  //     toast.success("Kategori berhasil diperbarui");
  //     setIsEditModalOpen(false);
  //     fetchCategories();
  //   } catch (error) {
  //     toast.error("Gagal memperbarui kategori");
  //   }
  // };

  const handleCreateBarang = async (newBarang: BarangFormSchema) => {
    try {
      await createBarang(newBarang);
      toast.success("Berhasil menambahkan barang");
      fetchBarang();
      setIsModalOpen(false);
      console.log(newBarang);
    } catch (error) {
      toast.error("Gagal menambahkan barang");
    }
  };

  const handleDeleteIdBarang = async (barang: Barang) => {
    setBarangIdToDelete(barang);
    setDeleteModal(true);
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteBarang(id);
      toast.success("Berhasil menghapus kategori");
      setDeleteModal(false);
      fetchBarang();
    } catch (error) {
      toast.error("Gagal menghapus kategori");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBarang();
  }, []);

  // Menyaring data berdasarkan status dan pencarian
  // useEffect(() => {
  //   const filtered = datas.filter((data) => {
  //     const matchesStatus =
  //       statusFilter === "-" || data.status === statusFilter;
  //     const matchesSearch =
  //       data.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       data.kategori.toLowerCase().includes(searchTerm.toLowerCase());

  //     return matchesStatus && matchesSearch;
  //   });
  //   setFilteredData(filtered);
  // }, [statusFilter, searchTerm, datas]);

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
            <h1 className="text-3xl font-bold text-primary">Data Barang</h1>
            <p className="mt-4 text-gray-800">
              Kelola data barang gudang anda.
            </p>
          </div>

          <div className="">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-primary text-white rounded-md cursor-pointer"
            >
              Tambah Barang +
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
              <h3 className="text-text font-medium text-sm">Total Kategori</h3>
              <p className="text-text font-medium text-xl pt-2.5">
                {/* {totalCategories} */} 20
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
              <h3 className="text-text font-medium text-sm">Kategori Aktif</h3>
              <p className="text-text font-medium text-xl pt-2.5">
                {/* {activeCategories} */} 20
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
                Kategori Non Aktif
              </h3>
              <p className="text-text font-medium text-xl pt-2.5">
                {/* {unActiveCategories} */} 40
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
                {/* {activePercentage} % */} 100%
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
        <div className="flex justify-between items-center mx-4 sm:mx-6 py-6">
          <h2 className="font-medium text-text text-2xl">Data Barang</h2>
          <div className="flex items-center gap-3">
            <div className="bg-secondary text-white p-2 rounded-sm">
              <Download />
            </div>
            <div className="bg-secondary text-white p-2 rounded-sm">
              <FolderInput />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-text/15">
              <tr>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  NAMA BARANG
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  KATEGORI
                </th>

                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  STOK AWAL
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  STOK SEKARANG
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  TANGGAL PRODUKSI
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  KODE QR
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  AKSI
                </th>
              </tr>
            </thead>
            <tbody>
              {datas.map((data, idx) => (
                <tr
                  key={idx}
                  className="bg-background text-sm font-medium text-text text-center border-y border-secondary"
                >
                  <td className="px-4 sm:px-6 py-4 uppercase whitespace-nowrap">
                    {data.namaBarang}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {data.kategori.kategori}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {data.stockAwal}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {data.stockSekarang}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {data.productionDate}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={
                        data.status === "Aktif"
                          ? "bg-accent px-4 py-2 rounded-sm"
                          : "bg-[#ff5757] px-4 py-2 rounded-sm"
                      }
                    >
                      {data.status === "Aktif" ? "Aktif" : "Non Aktif"}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 flex gap-2.5 justify-center">
                    <Link href="/detail-gudang" className="">
                      <Eye />
                    </Link>
                    <Link href="/edit-gudang" className="">
                      <SquarePen />
                    </Link>
                    <button onClick={() => handleDeleteIdBarang(data)}>
                      <Trash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-4 gap-3">
          <div>
            <h3 className="text-sm sm:text-base">
              Menampilkan 1-5 dari 10 gudang
            </h3>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="px-3 sm:px-4 py-2 border border-secondary rounded-sm font-medium text-sm text-secondary">
              Previous
            </button>
            <span className="px-3 sm:px-4 py-2 bg-text text-background rounded-sm font-medium text-sm glow-box">
              1
            </span>
            <span className="px-3 sm:px-4 py-2 border border-secondary rounded-sm font-medium text-sm">
              2
            </span>
            <span className="px-3 sm:px-4 py-2 border border-secondary rounded-sm font-medium text-sm">
              3
            </span>
            <button className="px-3 sm:px-4 py-2 border border-secondary rounded-sm font-medium text-sm">
              Next
            </button>
          </div>
        </div>
      </div>
      {deleteModal && barangIdToDelete && (
        <DeleteConfirmationModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          itemName={barangIdToDelete.namaBarang}
          onConfirm={() => handleDeleteCategory(barangIdToDelete.id)}
        />
      )}
      {isModalOpen && (
        <CreateBarangModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateBarang}
        />
      )}
      {/* {isModalOpen && (
        <CreateCategoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateCategory}
        />
      )}
      {deleteModal && categoryIdToDelete && (
        <DeleteConfirmationModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          itemName={categoryIdToDelete.kategori}
          onConfirm={() => handleDeleteCategory(categoryIdToDelete.id)}
        />
      )}
      {isEditModalOpen && categoryToEdit && (
        <EditCategoryModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateCategory}
          initialData={{
            kategori: categoryToEdit.kategori,
            status: categoryToEdit.status,
          }}
        />
      )} */}
    </>
  );
}
