import {
  Boxes,
  CircleCheck,
  CircleX,
  Download,
  Eye,
  FolderInput,
  Plus,
  Search,
  SquarePen,
  Trash,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";

const datas = [
  {
    namaBarang: "Jaket Ahuy",
    kategori: "Pakaian",
    produk: "JAKET",
    stokAwal: "1000",
    stokSekarang: "1.110",
    tanggalProduksi: "29/10/25",
    status: "Aktif",
  },
  {
    namaBarang: "Jaket Ahuy",
    kategori: "Pakaian",
    produk: "JAKET",
    stokAwal: "1000",
    stokSekarang: "1.110",
    tanggalProduksi: "29/10/25",
    status: "Aktif",
  },
  {
    namaBarang: "Jaket Ahuy",
    kategori: "Pakaian",
    produk: "JAKET",
    stokAwal: "1000",
    stokSekarang: "1.110",
    tanggalProduksi: "29/10/25",
    status: "Aktif",
  },
  {
    namaBarang: "Jaket Ahuy",
    kategori: "Pakaian",
    produk: "JAKET",
    stokAwal: "1000",
    stokSekarang: "1.110",
    tanggalProduksi: "29/10/25",
  },
  {
    namaBarang: "Jaket Ahuy",
    kategori: "Pakaian",
    produk: "JAKET",
    stokAwal: "1000",
    stokSekarang: "1.110",
    tanggalProduksi: "29/10/25",
    status: "Aktif",
  },
];

export default function DataBarangPage() {
  return (
    <>
      <div className="mt-20 mx-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <h1 className="font-bold text-3xl text-primary">Data Barang</h1>
            <p className="text-base text-black mt-2.5">
              Kelola dan pantau seluruh data barang gudang
            </p>
          </div>
          <div>
            <Link
              href=""
              className="bg-primary rounded-sm flex items-center py-3 px-6 text-white font-medium text-sm hover:bg-primary/85 transition-all duration-200 ease-in-out"
            >
              <Plus className="mr-2" />
              Tambah Gudang
            </Link>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-5">
        <div className="bg-white rounded-lg shadow-md border p-5">
          <div className="flex justify-between">
            <div>
              <h3 className="text-text font-medium text-sm">Total Barang</h3>
              <p className="text-text font-medium text-xl pt-2.5">1.230</p>
            </div>
            <div className="bg-primary p-4 rounded-sm text-background">
              <Boxes className="w-8 h-8" />
            </div>
          </div>
        </div>
        {/* Card 2 */}
        <div className="bg-white rounded-lg shadow-md border p-5">
          <div className="flex justify-between">
            <div>
              <h3 className="text-text font-medium text-sm">Total Stok</h3>
              <p className="text-text font-medium text-xl pt-2.5">1.102</p>
            </div>
            <div className="bg-primary p-4 rounded-sm text-background">
              <CircleCheck className="w-8 h-8" />
            </div>
          </div>
        </div>
        {/* Card 3 */}
        <div className="bg-white rounded-lg shadow-md border p-5">
          <div className="flex justify-between">
            <div>
              <h3 className="text-text font-medium text-sm">Stok Menipis</h3>
              <p className="text-text font-medium text-xl pt-2.5">45</p>
            </div>
            <div className="bg-primary p-4 rounded-sm text-background">
              <TriangleAlert className="w-8 h-8" />
            </div>
          </div>
        </div>
        {/* Card 4 */}
        <div className="bg-white rounded-lg shadow-md border p-5">
          <div className="flex justify-between">
            <div>
              <h3 className="text-text font-medium text-sm">Stok Habis</h3>
              <p className="text-text font-medium text-xl pt-2.5">5</p>
            </div>
            <div className="bg-primary p-4 rounded-sm text-background">
              <CircleX className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>
      <div className="border border-secondary bg-background rounded-lg my-9 mx-5">
        <div className="flex items-center gap-6 mx-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-text/35 text-xs" />
            </div>
            <input
              type="search"
              id="search"
              name="search"
              placeholder="Cari nama barang, kategori, ..."
              className="w-3xl pl-10 pr-3 py-3 my-3 text-text font-medium rounded-sm border border-secondary placeholder:text-text/35 focus:outline-none"
            />
          </div>
          <div className="flex items-center">
            <select
              name="filter-product"
              id="filter-product"
              className="border border-secondary py-3 px-3 rounded-sm bg-background font-medium text-text focus:outline-none"
            >
              <option value="-">Semua Produk</option>
              <option value="jaket">Jaket</option>
              <option value="kaos">Kaos</option>
            </select>
          </div>
          <div className="flex items-center">
            <select
              name="filter-status"
              id="filter-status"
              className="border border-secondary w-full py-3 px-3 rounded-sm bg-background font-medium text-text focus:outline-none"
            >
              <option value="-">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="non-aktif">Non Aktif</option>
            </select>
          </div>
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
                  PRODUK
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
                    {data.kategori}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {data.produk}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {data.stokAwal}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {data.stokSekarang}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {data.tanggalProduksi}
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
                    <Link href="/delete-gudang" className="">
                      <Trash />
                    </Link>
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
    </>
  );
}
