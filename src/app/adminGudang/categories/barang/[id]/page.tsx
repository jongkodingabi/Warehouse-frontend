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
  ArrowLeft,
  Package,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Barang } from "@/utils/types";
import axiosInstance from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import {
  createBarang,
  deleteBarang,
  updateBarang,
} from "@/lib/api/product/route";
import DeleteConfirmationModal from "@/components/core/Delete.Modal";
import EditBarangModal from "@/components/core/EditBarangModal";
import { useUser } from "@/context/UserContext";
import { useQRCode } from "next-qrcode";
import { useParams, useRouter } from "next/navigation";
import z from "zod";
import CreateBarangModal from "@/components/core/CreateBarangModal";

interface CategoryInfo {
  id: number;
  kategori: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryProductsResponse {
  data: Barang[];
  category: CategoryInfo;
}

const barangFormSchema = z.object({
  kategori_id: z.number(),
  created_by: z.number(),
  produk: z.string(),
  production_date: z.string(),
  stock: z.number(),
  kodegrp: z.string(),
  status: z.string(),
  line_divisi: z.number(),
  main_produk: z.number(),
});

type BarangFormSchema = z.infer<typeof barangFormSchema>;

export default function CategoryProductsPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const [datas, setData] = useState<Barang[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<CategoryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("-");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [barangIdToDelete, setBarangIdToDelete] = useState<Barang | null>(null);
  const [perPage] = useState(5);
  const [filteredData, setFilteredData] = useState<Barang[]>([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [barangToEdit, setBarangToEdit] = useState<any>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useUser();
  const { Canvas } = useQRCode();

  // Hitung statistik berdasarkan data
  const totalBarang = datas.length;
  const activeBarang = datas.filter((b) => b.status === "active").length;
  const unActiveBarang = datas.filter((b) => b.status === "un-active").length;
  const activePercentage = totalBarang
    ? ((activeBarang / totalBarang) * 100).toFixed(2)
    : 0;

  const fetchCategoryProducts = async () => {
    try {
      setIsLoading(true);

      // Request ke endpoint kategori
      const response = await axiosInstance.get(
        `/api/v1/kategori/${categoryId}`
      );

      // Debug: Cek struktur response (hapus setelah selesai debug)

      // Set data barang - handle jika data kosong atau undefined
      if (response.data.data && Array.isArray(response.data.data)) {
        setData(response.data.data);
      } else {
        setData([]);
      }

      // Set category info dengan berbagai kemungkinan struktur response
      let categoryData = null;

      // Kemungkinan 1: API mengembalikan info kategori terpisah
      if (response.data.category) {
        categoryData = response.data.category;
      }
      // Kemungkinan 2: Info kategori ada di level root response
      else if (response.data.kategori) {
        categoryData = {
          id: response.data.id,
          kategori: response.data.kategori,
          status: response.data.status,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };
      }
      // Kemungkinan 3: Ambil dari barang pertama jika ada
      else if (
        response.data.data &&
        response.data.data.length > 0 &&
        response.data.data[0].kategori
      ) {
        categoryData = response.data.data[0].kategori;
      }
      // Kemungkinan 4: Jika tidak ada info kategori sama sekali, buat request terpisah
      else {
        try {
          // Coba request terpisah untuk info kategori (sesuaikan endpoint)
          const categoryResponse = await axiosInstance.get(
            `/api/v1/kategori/info/${categoryId}`
          );
          categoryData = categoryResponse.data.data || categoryResponse.data;
        } catch (categoryError) {
          console.warn(
            "Gagal mengambil info kategori terpisah:",
            categoryError
          );

          // Fallback: Set info kategori minimal
          categoryData = {
            id: parseInt(categoryId),
            kategori: `Kategori ${categoryId}`,
            status: "aktif",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
      }

      // Set category info ke state
      if (categoryData) {
        setCategoryInfo(categoryData);
      }
    } catch (error) {
      toast.error("Gagal memuat data barang kategori");

      // Set data kosong saat error
      setData([]);

      // Set category info default saat error
      setCategoryInfo({
        id: parseInt(categoryId),
        kategori: "Error memuat kategori",
        status: "error",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleCreateBarang = async (newBarang: BarangFormSchema) => {
    try {
      await createBarang(newBarang);
      toast.success("Berhasil menambahkan barang");
      fetchCategoryProducts();
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Gagal menambahkan barang");
    }
  };

  const handleUpdateBarang = async (updatedData: any) => {
    if (!barangToEdit || !barangToEdit.id) {
      toast.error("ID barang tidak ditemukan");
      return;
    }

    try {
      await updateBarang(barangToEdit.id, updatedData);
      toast.success("Barang berhasil diperbarui");
      setIsEditModalOpen(false);
      setBarangToEdit(null);
      await fetchCategoryProducts();
    } catch (error) {
      toast.error("Gagal memperbarui barang");
    }
  };

  const handleEditBarangClick = (barang: Barang) => {
    setBarangToEdit(barang);
    setIsEditModalOpen(true);
  };

  const handleDeleteIdBarang = async (barang: Barang) => {
    setBarangIdToDelete(barang);
    setDeleteModal(true);
  };

  const handleDeleteBarang = async (id: number) => {
    try {
      await deleteBarang(id);
      toast.success("Berhasil menghapus barang");
      setDeleteModal(false);
      fetchCategoryProducts();
    } catch (error) {
      toast.error("Gagal menghapus barang");
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchCategoryProducts();
    }
  }, [categoryId]);

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
          data.namaBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.kodeQr.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.kodeGrp?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.createdBy?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [statusFilter, searchTerm, datas]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Pagination
  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / perPage);

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
          <div>
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-primary hover:bg-gray-100 rounded-md"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-primary">
                  Barang Kategori: {categoryInfo?.kategori || "Loading..."}
                </h1>
                <p className="mt-2 text-gray-600">
                  Status Kategori:
                  <span
                    className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                      categoryInfo?.status === "aktif"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {categoryInfo?.status}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-primary text-white rounded-md cursor-pointer"
            >
              Tambah Barang +
            </button>
          </div>
        </div>
      </div>

      {/* Card Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-5">
        {isLoading ? (
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
            <div className="bg-white rounded-lg shadow-md border p-5">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-text font-medium text-sm">
                    Total Barang
                  </h3>
                  <p className="text-text font-medium text-xl pt-2.5">
                    {totalBarang}
                  </p>
                </div>
                <div className="bg-primary p-4 rounded-sm text-background">
                  <Group className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border p-5">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-text font-medium text-sm">
                    Barang Aktif
                  </h3>
                  <p className="text-text font-medium text-xl pt-2.5">
                    {activeBarang}
                  </p>
                </div>
                <div className="bg-primary p-4 rounded-sm text-background">
                  <BoxesIcon className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border p-5">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-text font-medium text-sm">
                    Barang Non Aktif
                  </h3>
                  <p className="text-text font-medium text-xl pt-2.5">
                    {unActiveBarang}
                  </p>
                </div>
                <div className="bg-primary p-4 rounded-sm text-background">
                  <Archive className="w-8 h-8" />
                </div>
              </div>
            </div>

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
      <div className="bg-white mx-2 sm:mx-6 my-6 sm:my-9 border border-secondary rounded-lg px-3 sm:px-6 py-3 flex flex-col sm:flex-row items-stretch sm:items-center flex-wrap gap-4 sm:gap-6 shadow-md">
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
            <option value="active">Aktif</option>
            <option value="un-active">Non-aktif</option>
          </select>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <input
            type="search"
            name="search"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Cari nama barang, kode QR, atau pembuat..."
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
      <div className="bg-white border border-secondary rounded-lg mx-2 sm:mx-6 mb-6">
        <div className="flex justify-between items-center mx-4 sm:mx-6 py-6">
          <h2 className="font-medium text-text text-2xl">
            Data Barang - {categoryInfo?.kategori}
          </h2>
          <div className="flex items-center gap-3">
            <button className="bg-secondary text-white p-2 rounded-sm hover:bg-secondary/90">
              <Download />
            </button>
            <button className="bg-secondary text-white p-2 rounded-sm hover:bg-secondary/90">
              <FolderInput />
            </button>
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
                  KODEGRP
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  DIVISI
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  DIBUAT OLEH
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  STATUS
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  STOCK
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
              {isLoading ? (
                Array.from({ length: perPage }).map((_, index) => (
                  <tr
                    key={`skeleton-${index}`}
                    className="bg-background border-y border-secondary animate-pulse"
                  >
                    {Array.from({ length: 8 }).map((_, colIndex) => (
                      <td key={colIndex} className="px-4 sm:px-6 py-4">
                        <div className="h-4 bg-gray-300 rounded-md w-20 mx-auto"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 sm:px-6 py-8 text-center text-text"
                  >
                    {filteredData.length === 0 && datas.length > 0 ? (
                      "Tidak ada data yang sesuai dengan filter"
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Belum ada barang pada category ini
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Data barang sesuai kategori akan tampil di sini
                        </p>
                        {/* <button
                          onClick={() => handleStockIn(product)}
                          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Tambah Stock Pertama
                        </button> */}
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                currentItems.map((data, idx) => (
                  <tr
                    key={data.id || idx}
                    className="bg-background text-sm font-medium text-text text-center border-y border-secondary"
                  >
                    <td className="px-4 sm:px-6 py-4 uppercase whitespace-nowrap">
                      {data.namaBarang}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {data.kodeGrp}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {data.divisi?.divisi || data.lineDivisi?.divisi || "—"}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col items-center">
                        <span className="font-medium">
                          {data.createdBy?.name || "—"}
                        </span>
                        {data.createdBy?.jabatan?.name && (
                          <span className="text-xs text-gray-500">
                            {data.createdBy.jabatan.name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          data.status === "active"
                            ? "bg-green-500 text-green-100 border border-green-800"
                            : data.status === "un-active"
                            ? "bg-red-700 text-red-100 border border-red-800"
                            : "bg-gray-800/50 text-gray-300 border border-gray-700"
                        }`}
                      >
                        {data.status === "active"
                          ? "Aktif"
                          : data.status === "un-active"
                          ? "Non-aktif"
                          : data.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500">Saat ini:</span>
                        <span className="font-medium">
                          {data.totalStock || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        <Canvas
                          text={data.kodeQr}
                          options={{
                            errorCorrectionLevel: "M",
                            margin: 2,
                            scale: 3,
                            width: 80,
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex gap-2.5 justify-center">
                        <Link href={`/adminGudang/products/detail/${data.id}`}>
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            title="Lihat Detail"
                          >
                            <Eye />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleEditBarangClick(data)}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Edit"
                        >
                          <SquarePen />
                        </button>
                        <button
                          onClick={() => handleDeleteIdBarang(data)}
                          className="text-red-600 hover:text-red-800"
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
              {filteredData.length} barang
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
                    ? "bg-primary text-background glow-box"
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
      {deleteModal && barangIdToDelete && (
        <DeleteConfirmationModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          itemName={barangIdToDelete.namaBarang}
          onConfirm={() => handleDeleteBarang(barangIdToDelete.id)}
        />
      )}

      {isModalOpen && (
        <CreateBarangModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateBarang}
          categoryId={categoryId}
        />
      )}

      {isEditModalOpen && barangToEdit && (
        <EditBarangModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setBarangToEdit(null);
          }}
          onSubmit={handleUpdateBarang}
          barang={{
            id: barangToEdit.id,
            kategori_id: barangToEdit.kategori?.id || barangToEdit.kategori_id,
            user_id: user?.id,
            produk: barangToEdit.namaBarang || barangToEdit.produk,
            production_date:
              barangToEdit.productionDate || barangToEdit.production_date,
            kodegrp: barangToEdit.kodeGrp || "",
            status: barangToEdit.status || "active",
          }}
        />
      )}
    </>
  );
}
